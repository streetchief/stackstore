var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    author: String, // email
    product_sku: Number,
    star_rating: { type: Number, min: 1, max: 5 },
    publish_date: { type: Date, default: Date.now },
    content: String

});

mongoose.model('Review', schema);