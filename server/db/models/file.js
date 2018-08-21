const mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

const FileSchema = new Schema({
  id: {type:String},
  originalname: {type:String},
  encoding: {type:String},
  mimetype: {type:String},
  size: {type:Number}
}, { timestamps: true });

const ModelClass = mongoose.model('File', FileSchema);

module.exports = ModelClass;