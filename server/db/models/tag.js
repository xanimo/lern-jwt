const mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

const validateLocal = property => {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

const TagSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocal, 'Please provide a tag!']
	}
}, { timestamps: true });

const ModelClass = mongoose.model('Tag', TagSchema);

module.exports = ModelClass;