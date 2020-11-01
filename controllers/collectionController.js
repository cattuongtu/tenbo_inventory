let Collection = require("../models/collection");
let Item = require("../models/item");
let {
  body, 
  validationResult
} = require("express-validator");
let async = require("async");

// Display list of all Collections
exports.collection_list = function (req, res) {
  // NOT YET IMPLEMENTED
}

// Display detail page for a specific Collection
exports.collection_detail = function(req, res, next) {
  // NOT YET IMPLEMENTTED
}

// Display collection create form on GET. 
exports.collection_create_get = function(req, res, next) {
  // NOT YET IMPLEMENTED 
}

// Handle collection create on POST.
exports.collection_create_post = function(req, res, next) {
  // NOT YET IMPLEMENTED
}

// Display Collection delete form on GET.
exports.collection_delete_get = function (req, res, next) {
  // NOT YET IMPLEMENTED
}

// Handle Collection delete on POST.
exports.collection_delete_post = function (req, res, next) {

}

// Display Collection update on GET.
exports.collection_update_get = function (req, res, next) {
  // NOT YET IMPLEMENTED
}

// Handle Collection update on POST
exports.collection_update_post = [
  (req, res, next) => {
    // NOT YET IMPLEMENTED
    next();
  },

  // Validate and sanitize fields.

  // Process request after validation and sanitization.
  (req, res, next) => {

  }
];