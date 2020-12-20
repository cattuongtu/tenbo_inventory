let Item = require("../models/item");
let Category = require("../models/category");
let ClothingCollection = require("../models/collection");

let async = require("async");
const {
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
        ClothingCollection.countDocuments({}, callback);
      },
      category_count: function(callback) {
        Category.countDocuments({}, callback);
      }
    },
    function (err, results) {
      res.render("index.pug", {
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
    .populate("item")
		.exec(function (err, list_items) {
			if (err) {
				return next(err);
			}
			// Successful, so render
			res.render("item_list.pug", {
				item_list: list_items,
			});
		});
}

// Display item create form on GET.
exports.item_create_get = function(req, res, next) {
  // Get all categories and collections, which we can use for adding to our item.
  async.parallel({
    categories: function(callback) {
      Category.find(callback);
    },
    collections: function(callback) {
      ClothingCollection.find(callback);
    },
  },
    function(err, results) {
      if(err) {
        return next(err);
      }
      res.render("item_form.pug", {
        title: "Create Item",
        categories: results.categories,
        collections: results.collections,
      });
    }
  );
};

// Handle item create on POST.
exports.item_create_post = [
  // Validate and sanitise fields.
	body("name", "Title must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("category", "Category must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("description", "Description must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("colorway", "Colorway must not be empty")
		.isLength({ min: 1 })
		.trim(),
  body("price", "Price must not be empty")
    .trim(),
  body("numberInStock", "Number in stock must not be empty")
    .trim(),


	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a item object with escaped and trimmed data.
		var item = new Item({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
      numberInStock: req.body.numberInStock,
      colorway: req.body.colorway
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.

			// Get all categories for form.
			async.parallel(
				{
					categories: function (callback) {
						Category.find(callback);
					},
				},
				function (err, results) {
					if (err) {
						return next(err);
					}
					res.render("book_form", {
						title: "Create Item",
						categories: results.categories,
						item: item,
						errors: errors.array(),
					});
				}
			);
			return;
		} else {
			// Data from form is valid. Save book.
			item.save(function (err) {
				if (err) {
					return next(err);
				}
				//successful - redirect to new book record.
				res.redirect(item.url);
			});
		}
	},
]

// Display detail page for a specific Item
exports.item_detail = function (req, res, next) {
  async.parallel ( {
    item: function (callback) {
      Item.findById(req.params.id)
        .populate("item")
        .populate("category")
        .exec(callback);
    },
  },
    function (err, results) {
      if(err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        var err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      
      // Successful, so render.
      res.render("item_detail.pug", {
        item: results.item,
      });
    }
  )
};

// Display Item delete form on GET.
exports.item_delete_get = function (req, res, next) {
  async.parallel(
    {
      item: function(callback) {
        // Finds item
        Item.findById(req.params.id)
          .populate("item")
          .exec(callback)
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        res.redirect("/inventory/items");
      }
      console.log(results);
      // Successful, so render
      res.render("item_delete.pug", {
        item: results.item,
      })
    }
  )
}

// Handle Item delete on POST.
exports.item_delete_post = function(req, res, next) {
  async.parallel(
    {
      item: function(callback) {
        Item.findById(req.params.id)
        .exec(callback);
      }
    },
    function (err, results) {
			if (err) {
				return next(err);
			}
			Item.findByIdAndRemove(
				req.params.id,
				function deleteItem(err) {
					if (err) {
						return next(err);
					}
					// Success - go to inventory list
					res.redirect("/inventory/items");
				}
			);

			return;
		}
	);
};

// Display Item update form on GET.
exports.item_update_get = function (req, res, next) {
  // Get all categories, which we can use for updating to our item.
  async.parallel({
    item: function(callback) {
      Item.findById(req.params.id)
        .populate("item")
        .populate("categories")
        .exec(callback);
    },
    categories: function(callback) {
      Category.find(callback);
    },
  },
    function(err, results) {
      if(err) {
        return next(err);
      }
      res.render("item_form.pug", {
        title: "Update " + results.item.name,
        item: results.item,
        categories: results.categories,
      });
    }
  );
}

// Handle Item update on POST.
exports.item_update_post = [
	// Validate and sanitise fields.
  body("name", "Title must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("category", "Category must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("description", "Description must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("colorway", "Colorway must not be empty")
		.isLength({ min: 1 })
		.trim(),
  body("price", "Price must not be empty")
    .trim(),
  body("numberInStock", "Number in stock must not be empty")
    .trim(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a Item object with escaped/trimmed data and old id.
		var item = new Item({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
      numberInStock: req.body.numberInStock,
      colorway: req.body.colorway,
			_id: req.params.id, // This is required, or a new ID will be assigned!
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.

			// Get all categories for form.
			async.parallel(
				{
					categories: function (callback) {
						Category.find(callback);
          },
				},
				function (err, results) {
					if (err) {
						return next(err);
					}

					res.render("item_form.pug", {
						title: "Update Item",
            categories: results.categories,
            item:item,
						errors: errors.array(),
					});
				}
			);
			return;
		} else {
			// Data from form is valid. Update the record.
			Item.findByIdAndUpdate(
				req.params.id,
				item,
				{},
				function (err, item) {
					if (err) {
						return next(err);
					}
					// Successful - redirect to book detail page.
					res.redirect(item.url);
				}
			);
		}
	},
];