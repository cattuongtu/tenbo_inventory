let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CollectionSchema = new Schema({
  name: {type: String, required: true, maxlength: 100},
  description: {type: String, required: true, maxlength: 250},
  isLimited: {type: Boolean, required: true},
  items: [{type: Schema.Types.ObjectId, ref: "Item"}]
})

// Virtual for collection's url
CollectionSchema.virtual('url').get(() => {
  return "/inventory/item/" + this._id;
})

// Export model
module.exports = mongoose.model("Collection", CollectionSchema);