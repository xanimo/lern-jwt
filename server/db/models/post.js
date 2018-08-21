const mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

const validateLocal = property => {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

const PostSchema = new Schema({
	page: {
		type: Schema.Types.ObjectId,
		ref: 'Page'
	},
	title: {
		type: String,
		trim: true,
		default: 'Title',
		validate: [validateLocal, 'Please provide a title!']
	},
	content: {
		type: String,
		trim: true,
		default: 'Content',
		validate: [validateLocal, 'Please provide some content!']
	},
	slug: {
		type: String,
		validate: [validateLocal, 'Please provide a url!']
	},
	cuid: {
		type: String
	},
	tags: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Tag'
		}
	]
}, { timestamps: true });
PostSchema.index({ tags: 1 });

const ModelClass = mongoose.model('Post', PostSchema);

module.exports = ModelClass;