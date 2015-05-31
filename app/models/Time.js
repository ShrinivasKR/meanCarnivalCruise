// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timeSchema = new Schema({ //Military time vs. Regular time?
    hour: { type: int, min:0, max:23, default: 0},
    minute: {type: int, min:0, max:59, default: 0},
    second: {type: int, min:0, max:59, default: 0}
    //How to account for AM/PM?
})
// define our time model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Time', timeSchema);