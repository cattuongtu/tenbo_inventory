let ClothingCollection = require("../models/collection");
let Item = require("../models/item");
const {
  body, 
  validationResult
} = require("express-validator");
let async = require("async");

// Display list of all Collections
exports.collection_list = function (req, res) {
  ClothingCollection.find()
    .populate("collection")
    .exec(function (err, list_collections) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("collection_list.pug", {
        collection_list: list_collections,
      });
    });
}

// Display detail page for a specific Collection
exports.collection_detail = function(req, res, next) {
  async.parallel ( {
    collection: function (callback) {
      ClothingCollection.findById(req.params.id)
        .populate("collection")
        .populate("item")
        .populate("category")
        .exec(callback);
    },
  },
    function (err, results) {
      if(err) {
        return next(err);
      }
      if (results.collection == null) {
        // No results.
        var err = new Error("Collection not found");
        err.status = 404;
        return next(err);
      }
      Item.find({'_id': {$in:(results.collection.items)}})
        .populate('item')
        .populate('category')
        .exec(function (err, item_list) {
          if(err) {
            return next(err)
          }
          // Successful, so render.
          res.render("collection_detail.pug", {
            collection: results.collection,
            items: item_list,
          });
        });
    }
  )
}

// Display collection create form on GET. 
exports.collection_create_get = function(req, res, next) {
  // Get all items to create your collection
  Item.find()
    .exec(function (err, items) {
      if (err) {
        return next(err);
      }
      res.render("collection_form.pug", {
        items: items,
      })
    })
}

// Handle collection create on POST.
exports.collection_create_post = [
  
	// Validate and sanitise fields.
	body("name", "Name must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("description", "Description must not be empty.")
		.isLength({ min: 1 })
    .trim(),
  body("isLimited"),

	// Process request after validation and sanitization.
	(req, res, next) => {
    console.log(req.body);
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		// Create a Collection object with escaped and trimmed data.
		var collection = new ClothingCollection({
			name: req.body.name,
			description: req.body.description,
			isLimited: req.body.isLimited == 'on' ? true : false,
			items: req.body.items,
    });
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			// Get all items for form.
			async.parallel(
				{
					items: function (callback) {
            Item.find({'_id' : {$in: collection.items}})
              .populate('item')
              .populate('category')
              .exec(callback);
					},
				},
				function (err, results) {
					if (err) {
						return next(err);
          }
          
					res.render("collection_form.pug", {
						title: "Create Collection",
						items: results.items,
						errors: errors.array(),
					});
				}
			);
			return;
		} else {
			// Data from form is valid. Save collection.
			collection.save(function (err) {
				if (err) {
					return next(err);
				}
				//successful - redirect to new collection record.
				res.redirect(collection.url);
			});
		}
	},
];

// Display Collection delete form on GET.
exports.collection_delete_get = function (req, res, next) {
  ClothingCollection.find()
    .exec(function(err, collection) {
      if (err) {
        return next(err);
      }
      res.render('collection_delete.pug', {
        collection: collection
      });
    });
}

// Handle Collection delete on POST.
exports.collection_delete_post = function (req, res, next) {
  async.parallel(
    {
      collection: function(callback) {
        ClothingCollection.findById(req.params.id)
        .exec(callback);
      }
    },
    function (err, results) {
			if (err) {
				return next(err);
			}
			ClothingCollection.findByIdAndRemove(
				req.params.id,
				function deleteCollection(err) {
					if (err) {
						return next(err);
					}
					// Success - go to inventory list
					res.redirect("/inventory/collections");
				}
			);
			return;
		}
	);
}

// Display Collection update on GET.
exports.collection_update_get = function (req, res, next) {
  async.parallel({
    collection: function(callback) {
      ClothingCollection.findById(req.params.id)
        .exec(callback);
    },
    items: function(callback) {
      Item.find(callback);
    },
  },
  function(err, results) {
    if (err) {
      return next(err);
    }
    res.render("collection_form.pug" , {
      collection: results.collection,
      items: results.items,
    })
  });
}

// Handle Collection update on POST
exports.collection_update_post = [
  // Convert the items to an array
	(req, res, next) => {
		if (!(req.body.items instanceof Array)) {
			if (typeof req.body.items === "undefined")
				req.body.items = [];
			else req.body.items = new Array(req.body.items);
		}
		next();
	},

	// Validate and sanitise fields.
	body("name", "Name must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("description", "Description must not be empty.")
		.isLength({ min: 1 })
    .trim(),
  body("isLimited"),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a ClothingCollection object with escaped/trimmed data and old id.
		var collection = new ClothingCollection({
			name: req.body.name,
			description: req.body.description,
			isLimited: req.body.isLimited == 'on' ? true : false,
			items:
				typeof req.body.items === "undefined"
					? []
					: req.body.items,
			_id: req.params.id, //This is required, or a new ID will be assigned!
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.

			// Get all items for form.
			async.parallel(
				{
					items: function (callback) {
						Item.find({'_id' : {$in: collection.items}})
              .populate('item')
              .populate('category')
              .exec(callback);
					},
          collection: 
            ClothingCollection.findById(req.params.id)
              .exec(callback)
				},
				function (err, results) {
					if (err) {
						return next(err);
					}

					// Mark our selected items as checked.
					for (let i = 0; i < results.items.length; i++) {
						if (
							collection.items.indexOf(results.items[i]._id) > -1
						) {
							results.items[i].checked = "true";
						}
					}
					res.render("collection_form.pug", {
						title: "Update Collection",
            collection: results.collection,
            items: results.items,
						errors: errors.array(),
					});
				}
			);
			return;
		} else {
			// Data from form is valid. Update the record.
			ClothingCollection.findByIdAndUpdate(
				req.params.id,
				collection,
				{},
				function (err, collection) {
					if (err) {
						return next(err);
					}
					// Successful - redirect to collection detail page.
					res.redirect(collection.url);
				}
			);
		}
	},
];