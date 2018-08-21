const mongoose = require('mongoose'),
	  Schema = mongoose.Schema,
	  bcrypt = require('bcrypt-nodejs');

const validateLocal = property => {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

const UserSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocal, 'Please provide a name!']
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
}, { timestamps: true });

UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password)
}

UserSchema.pre('save', function(next) {
	if(this.isModified('password')) {
		this.password = this.generateHash(this.password)
	}
	next()
})

const ModelClass = mongoose.model('User', UserSchema);

module.exports = ModelClass;