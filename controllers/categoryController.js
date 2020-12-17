let Category = require("../models/category");
let async = require("async");
let {
  body, 
  validationResult
} = require("express-validator");
const Item = require("../models/item");

// Display list of all Categories
exports.category_list = function (req, res) {
  Category.find()
    .exec(function (err, list_categories) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("category_list.pug", {
        category_list : list_categories,
      })
    })
}

// Display detail page for a specific Category
exports.category_detail = function (req, res, next) {
  // Display category detail.
  Category.findById(req.params.id)
    .exec(function (err, category) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("category_detail.pug", {
        category: category,
      })
    });
}
// Display category create form on GET.
exports.category_create_get = function (req, res, next) {
  // Display create form.
  Category.find()
    .exec(function (err, category) {
      if (err) {
        return next(err);
      }
      res.render("category_form.pug", {
        category: category,
      }
    )});
}

// Handle category create on POST.
exports.category_create_post = [
  // NOT YET IMPLEMENTED 
]

// Display Category delete form on GET.
exports.category_delete_get = function (req, res, next) {
  // Display create form.
  Category.findById(req.params.id)
    .populate("category")
    .populate("item")
    .exec(function (err, cat) {
      if (err) {
        return next(err);
      }
      // If category is available, find all items
      Item.find({category: cat})
        .exec(function(err, items) {
          if (err) {
            return next(err);
          }
          // If item is available, render
          res.render("category_delete.pug", {
            category: cat,
            category_item_list: items,
          });
      });
    });
  }

// Handle Category delete on POST.
exports.category_delete_post = function(req, res, next) {
  // NOT YET IMPLEMENTED
}

// Display Category update form on GET.
exports.category_update_get = function (req, res, next) {
  // NOT YET IMPLEMENTED
}

// Handle Category update on POST.
exports.category_update_post = [
  (req, res, next) => {
    // NOT YET IMPLEMENTED
    next();
  },

  // Validate and sanitize fields.

  // Process request after validiation and sanitization.
  (req, res, next) => {

  }
];