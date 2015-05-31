// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dateSchema = new Schema({
    day: { type: int, min:1, max:31, default: 1},
    month: {type: int, min:1, max:12, default: 1},
    year: {type: int, min:2015, default:2015 }
})
// define our date model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Date', dateSchema);