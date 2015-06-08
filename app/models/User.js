// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, default: 'New User' },
    email: { type: String }, //    need default values for?
    password: { type: String }, //                     |
    location: { type: Schema.ObjectId, ref: 'GPS' },// | 
    groups: { type: Array },  // Array of groups       |
    events: { type: Array },// Array of Events         v
    schedule: { type: Array }
})
// define our user model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', userSchema);
