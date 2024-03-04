const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	validator = require('validator'),
	generatePassword = require('generate-password'),
	owasp = require('owasp-password-strength-test'),
	ROLE_MEMBER = require('../../constants').ROLE_MEMBER,
	ROLE_CLIENT = require('../../constants').ROLE_CLIENT,
	ROLE_OWNER = require('../../constants').ROLE_OWNER,
	ROLE_ADMIN = require('../../constants').ROLE_ADMIN;

const validateLocal = property => {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
const validateLocalStrategyEmail = (email) => {
	return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};

const UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocal, 'Please provide a first name!']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocal, 'Please provide a last name!']
	},
	displayName: {
	  type: String,
	  trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		default: '',
		validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
	},
	password: {
		type: String,
		required: true,
		default: ''
	},
	salt: {
		type: String
	},
	provider: {
		type: String
	},
	providerData: {},
	additionalProvidersData: {},
	role: {
		type: String,
		enum: [ROLE_MEMBER, ROLE_CLIENT, ROLE_OWNER, ROLE_ADMIN],
		default: ROLE_MEMBER
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
}, { timestamps: true });

UserSchema.statics.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password)
}

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    console.log('validating password:', this.password);
    const result = owasp.test(this.password);
    if (result.errors.length) {
      const error = result.errors.join(' ');
      console.log('validate error', error);
      this.invalidate('password', error);
    }
  }
  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 64, 'sha1').toString('base64');
	}
	return password;
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
	return this.password === this.hashPassword(password);
};

/**
 * Generates a random passphrase that passes the owasp test.
 * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
 */
UserSchema.statics.generateRandomPassphrase = function () {
	return new Promise((resolve, reject) => {
		let password = '';
		const repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

		// iterate until the we have a valid passphrase.
		// NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
		while (password.length < 20 || repeatingCharacters.test(password)) {
			// build the random password
			password = generatePassword.generate({
				length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
				numbers: true,
				symbols: false,
				uppercase: true,
				excludeSimilarCharacters: true
			});

			// check if we need to remove any repeating characters.
			password = password.replace(repeatingCharacters, '');
		}

		// Send the rejection back if the passphrase fails to pass the strength test
		if (owasp.test(password).errors.length) {
			reject(new Error('An unexpected problem occurred while generating the random passphrase'));
		} else {
			// resolve with the validated passphrase
			resolve(password);
		}
	});
};

UserSchema.pre('save', function(next) {
	if(this.isModified('password')) {
		this.password = this.generateHash(this.password)
	}
	next()
})

const ModelClass = mongoose.model('User', UserSchema);

module.exports = ModelClass;
