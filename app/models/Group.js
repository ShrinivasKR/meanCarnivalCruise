// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    id: { type: Number },//or string?
    name: { type: String },
    owner: { type: String }, // UserID?
    schedule: { type: Array }, // Array of Events
    members: { type: Array } // Array of users (User IDs?)
})
// define our group model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Group', groupSchema);