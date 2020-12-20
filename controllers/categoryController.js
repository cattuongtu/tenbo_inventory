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
  // Validate and sanitise fields.
	body("name", "Title must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("description", "Description must not be empty.")
		.isLength({ min: 1 })
		.trim(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
    
		// Create a Category object with trimmed data.
		var category = new Category({
			name: req.body.name,
			description: req.body.description,
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
      if (err) {
        return next(err);
      }
      res.render("category_form.pug", {
        title: "Create Category",
        errors: errors.array(),
      });
			return;
		} else {
			// Data from form is valid. Save category.
			category.save(function (err) {
				if (err) {
					return next(err);
				}
				//successful - redirect to new category record.
				res.redirect(category.url);
			});
		}
	},
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
  async.parallel(
		{
			category: function (callback) {
				Category.findById(req.params.id).exec(callback);
			},
			category_item_list: function (callback) {
			  Item.find({ category: req.params.id }).exec(
					callback
				);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			// Success
			if (results.category_item_list.length > 0) {
				// Book has book instances. Render in same way as for GET route.
				res.render("book_delete", {
					category: results.category,
					category_item_list: results.category_item_list,
				});
				return;
			} else {
				// Category has no items belonging in it. Delete object and redirect to the list of categories.
				Category.findByIdAndRemove(
					req.params.id,
					function deleteCategory(err) {
						if (err) {
							return next(err);
						}
						// Success - go to category list
						res.redirect("/inventory/categories");
					}
				);
			}
		}
	);
}

// Display Category update form on GET.
exports.category_update_get = function (req, res, next) {
  Category.findById(req.params.id)
    .populate("category")
    .exec(function (err, category) {
      if(err) {
        return next(err);
      }
      // If no error, render template
      res.render("category_form.pug", {
        category: category,
      });
    });
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