let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ItemSchema = new Schema({
  name: {type: String, required: true, maxlength: 100},
  description: {type: String, required: true, maxlength: 250},
  category: {type: Schema.Types.ObjectId, ref:"Category"},
  price: {type: Number, required: true, max: 1000},
  numberInStock: {type: Number, required: true},
  colorway: {type: String},
});

// Virtual for item's url
ItemSchema.virtual('url').get(() => {
  return "/inventory/item/" + this._id;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);