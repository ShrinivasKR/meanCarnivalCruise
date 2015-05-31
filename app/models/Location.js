// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    latitude:  Number,
    longitude: Number
})
// define our location model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Location', locationSchema);
