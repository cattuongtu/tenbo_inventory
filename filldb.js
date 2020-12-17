#! /usr/bin/env node

console.log(
	"This script populates some test items, collections, and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

// if (!userArgs[0].startsWith('mongodb')) {
//     console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
//     return
// }

var async = require("async");
var Item = require("./models/item");
var Collection = require("./models/collection");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on(
	"error",
	console.error.bind(console, "MongoDB connection error:")
);

var items = [];
var collections = [];
var categories = [];

function itemCreate(
	name,
	description,
	category,
	price,
	numberInStock,
	colorway,
	cb
) {
	itemdetail = {
		name: name,
		description: description,
		category: category,
		price: price,
		numberInStock: numberInStock,
		
	};
	if (colorway != false)
		itemdetail.colorway = colorway;
	

	var item = new Item(itemdetail);

	item.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New Item: " + item);
		items.push(item);
		cb(null, item);
	});
}

function categoryCreate(name = '', description = '', cb) {
	categorydetail = {
		name: name,
		description: description
	}
	
	var category = new Category(categorydetail);

	category.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New Category: " + category);
		categories.push(category);
		cb(null, category);
	});
}

function collectionCreate(
	name,
	description,
	isLimited,
	items,
	cb
) {
	collectiondetail = {
		name: name,
		description: description,
		isLimited: isLimited,
		
	};
	if (items != false) collectiondetail.items = items;

	var collection = new Collection(collectiondetail);
	collection.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New Collection: " + collection);
		collections.push(collection);
		cb(null, collection);
	});
}


function createCategories(cb) {
	async.parallel(
		[
			function (callback) {
				categoryCreate(
					"Hoodies",
					"Cotton hoodies with logo or graphic designs",
					callback
				);
			},
			function (callback) {
				categoryCreate(
					"Graphic Tees",
					"Cotton t-shirts with logo or graphic designs",
					callback
				);
			},
			function (callback) {
				categoryCreate(
					"Sweatpants",
					"Signature sweatpants with multiple colorways",
					callback
				);
			},
			function (callback) {
				categoryCreate(
					"Longsleeves",
					"Cotton longsleeves with logo or graphic designs",
					callback
				);
			},
			function (callback) {
				categoryCreate(
					"Hats",
					"Various hats with logo or graphic designs",
					callback
				);
			}
		],
		// optional callback
		cb
	);
}

function createItems(cb) {
	async.parallel(
		[
			function (callback) {
				itemCreate(
					"Against the Grave",
					"Rise to life.",
					categories[0],
					49.99,
					100,
					"Red/White",
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Cursed",
					"Inner demons.",
					categories[1],
					19.99,
					100,
					"Red/Black",
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Logo Sweatpants",
					"Signature sweatpants.",
					categories[2],
					39.99,
					200,
					"White/Black",
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Medusa Longsleeve",
					"Be wary of the cursed sight.",
					categories[3],
					29.99,
					200,
					"White/Black",
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Medusa Longsleeve",
					"Be wary of the cursed sight.",
					categories[3],
					29.99,
					200,
					"Yellow/Black",
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Logo Bucket Hat",
					"Signature logo bucket hat",
					categories[4],
					14.99,
					200,
					"White/Black",
					callback
				);
			}
		],
		// optional callback
		cb
	);
}

function createCollections(cb) {
	async.parallel(
		[
			function (callback) {
				collectionCreate(
					"Adversary",
					"Formidable foes.",
					true,
					[items[0], items[1], items[3], items[4]],
					callback
				);
			},
			function (callback) {
				collectionCreate(
					"Classic Essential",
					"Back to the basics.",
					false,
					[items[2], items[5]],
					callback
				);
			}
		],
		// Optional callback
		cb
	);
}

async.series(
	[createCategories, createItems, createCollections],
	// Optional callback
	function (err, results) {
		if (err) {
			console.log("FINAL ERR: " + err);
		} else {
			console.log("ITEMS: " + items);
			console.log("CATEGORIES: " + categories);
			console.log("COLLECTIONS: " + collections);
		}
		// All done, disconnect from database
		mongoose.connection.close();
	}
);
