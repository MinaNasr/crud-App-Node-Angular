const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new Schema({
 id: Number,
 name: String,
 slug: String,
 image: String,
 description: String,
 regularPrice: String,
 salePrice: String,
 dateOnSaleFrom: Date,
 dateOnSaleTo: Date,
 stockQuantity: Number,
 manageStock: Boolean,
 sku: String
});

mongoose.model('product',productSchema);

module.exports = mongoose.model('product');