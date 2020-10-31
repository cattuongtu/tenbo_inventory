var express = require("express");
var router = express.Router();

// Require controller modules
var item_controller = require("../controllers/itemController");
var category_controller = require("../controller/categoryController");
var collection_controller = require("../controllers/collectionController");

// ITEM ROUTES//

// GET inventory home page.
router.get("/", item_controller.index);

// GET request for creating an Item.
router.get("/item/create", item_controller.item_create_get);

// POST request for creating item.
router.post(
	"/item/create",
	item_controller.item_create_post
);

// GET request to delete item.
router.get(
	"/item/:id/delete",
	item_controller.item_delete_get
);

// POST request to delete item.
router.post(
	"/item/:id/delete",
	item_controller.item_delete_post
);

// GET request to update item.
router.get(
	"/item/:id/update",
	item_controller.item_update_get
);

// POST request to update item.
router.post(
	"/item/:id/update",
	item_controller.item_update_post
);

// GET request for one item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all item items.
router.get("/items", item_controller.item_list);

/// CATEGORY ROUTES ///

// GET request for creating category. NOTE This must come before route for id (i.e. display category).
router.get(
	"/category/create",
	category_controller.category_create_get
);

// POST request for creating category.
router.post(
	"/category/create",
	category_controller.category_create_post
);

// GET request to delete category.
router.get(
	"/category/:id/delete",
	category_controller.category_delete_get
);

// POST request to delete category.
router.post(
	"/category/:id/delete",
	category_controller.category_delete_post
);

// GET request to update category.
router.get(
	"/category/:id/update",
	category_controller.category_update_get
);

// POST request to update category.
router.post(
	"/category/:id/update",
	category_controller.category_update_post
);

// GET request for one category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all categorys.
router.get("/categorys", category_controller.category_list);

/// COLLECTION ROUTES ///

// GET request for creating collection. NOTE This must come before route for id (i.e. display collection).
router.get(
	"/collection/create",
	collection_controller.collection_create_get
);

// POST request for creating collection.
router.post(
	"/collection/create",
	collection_controller.collection_create_post
);

// GET request to delete collection.
router.get(
	"/collection/:id/delete",
	collection_controller.collection_delete_get
);

// POST request to delete collection.
router.post(
	"/collection/:id/delete",
	collection_controller.collection_delete_post
);

// GET request to update collection.
router.get(
	"/collection/:id/update",
	collection_controller.collection_update_get
);

// POST request to update collection.
router.post(
	"/collection/:id/update",
	collection_controller.collection_update_post
);

// GET request for one collection.
router.get("/collection/:id", collection_controller.collection_detail);

// GET request for list of all collections.
router.get("/collections", collection_controller.collection_list);