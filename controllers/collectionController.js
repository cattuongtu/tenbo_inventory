let ClothingCollection = require("../models/collection");
let Item = require("../models/item");
let {
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
      console.log(results.collection.items);
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
          console.log(results.collection);
        });
    }
  )
}

// Display collection create form on GET. 
exports.collection_create_get = function(req, res, next) {
  // Get all items to create your collection
  Item.find()
    .populate("category")
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