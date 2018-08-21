const mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

const validateLocal = property => {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

const PageSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocal, 'Please provide a page!']
	}
}, { timestamps: true });

const ModelClass = mongoose.model('Page', PageSchema);

module.exports = ModelClass;