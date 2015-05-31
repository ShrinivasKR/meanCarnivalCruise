// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration ===========================================
	
// config files

var port = process.env.PORT || 8080; // set our port
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://<css360gettogether>:<gettogether>@ds031902.mongolab.com:31902/heroku_app37037588');

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);
console.log('Make sure C:\\Program Files\\MongoDB\\Server\\3.0\\bin\\mongod.exe is running first.');
console.log('Web server is running.');	
console.log('Open a Web browser to the URL: localhost:' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app