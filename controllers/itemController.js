let Item = require("../models/item");
let Category = require("../models/category");
let Collection = require("../models/collection");

let async = require("async");
let {
  body,
  validationResult
} = require("express-validator");
const { Collection } = require("mongoose");


exports.index = function (req, res) {
  async.parallel(
    {
      item_count: function(callback) {
        Item.countDocuments({}, callback); // Pass an empty object as match conditionin to find all documents of this collection
      },
      collection_count: function(callback) {
        Collection.countDocuments({}, callback);
      },
      category_count: function(callback) {
        Category.countDocuments({}, callback);
      }
    },
    function (err, results) {
      res.render("index", {
        title: "Tenbo Inventory",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all Items
exports.item_list = function (req, res) {
  Item.find()
    .populate()
}

// Display item create form on GET.
exports.item_create_get = function(req, res, next) {
  // Get all categories and collections, which we can use for adding to our item.
  async.parallel({
    categories: function(callback) {
      Category.find(callback);
    },
    collections: function(callback) {
      Collections.find(callback);
    },
    function(err, results) {
      if(err) {
        return next(err);
      }
      res.render("item_form", {
        title: "Create Item",
        categories: results.categories,
        collections: results.collections,
      });
    }
  });
};

// Handle item create on POST.
exports.item_create_post = [
  // NOT YET IMPLEMENTED
]

// Display detail page for a specific Item
exports.item_detail = function (req, res, next) {
  // NOT YET IMPLEMENTED
}

// Display Item delete form on GET.
exports.item_delete_get = function (req, res, next) {
  // NOT YET IMPLEMENTED
}

// Handle Item delete on POST.
exports.item_delete_post = function(req, res, next) {
  // NOT YET IMPLEMENTED
}

// Display Item update form on GET.
exports.item_update_get = function (req, res, next) {
  // NOT YET IMPLEMENTED
}

// Handle Item update on POST.
exports.item_update_post = [
  (req, res, next) => {
    // NOT YET IMPLEMENTED
    next();
  },

  // Validate and sanitize fields.

  // Process request after validiation and sanitization.
  (req, res, next) => {

  }
];