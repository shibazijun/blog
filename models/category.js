var  mongoose = require('mongoose');
var  categorySchema = require('../schemas/categories');


module.exports = mongoose.model('category',categorySchema)