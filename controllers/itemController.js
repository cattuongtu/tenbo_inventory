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
  // NOT YET IMPLEMENTED
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
      console.log(results.item);
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
        Item.findById(req.body.itemid).exec(callback);
      }
    },
    function (err, results) {
			if (err) {
				return next(err);
			}
			Item.findByIdAndRemove(
				req.body.itemid,
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
        categories: results.categories,
      });
    }
  );
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