var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: {type: String, required: true, maxlength: 100},
  description: {type: String, required: true, maxlength: 250},
  category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
  price: {type: Number, required: true, max: 1000},
  numberInStock: {type: Number, required: true},
  colorway: {type: String},
});

// Virtual for item's url
ItemSchema.virtual('url').get( function() {
  return "/inventory/item/" + this._id;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);