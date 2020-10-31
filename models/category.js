let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CategorySchema = new Schema({
  name: {type: String, required: true, maxlength: 100},
  description: {type: String, required: true, maxlength: 250},
})

// Virtual for category's url

CategorySchema.virtual('url').get(()=> {
  return "/inventory/category/" + this._id;
});

// Export model
module.exports = mongoose.model("Category", CategorySchema);