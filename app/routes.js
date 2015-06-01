var mongoose = require('mongoose');
var Location = require('./models/GPS');
var Event = require('./models/Event');
var User = require('./models/User');
var Group = require('./models/Group');
var testUserName = "Test User";

module.exports = function (app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

    //Create an event and return the event ID as a response
    app.post('/api/Event', function (req, res) {
     
        /* Location stuff */
        var loc = new Location();
        loc.latitude = req.body.location.latitude;
        loc.longitude = req.body.location.longitude;

        loc.save(function (err) {
            if (err)
                res.send(err);

            console.log('Location at <' + loc.latitude + ', ' + loc.longitude + '> created!');
            /* Event Stuff*/
            var event = new Event();
            if (req.body.name != null && req.body.name != '')
                event.name = req.body.name;
            event.location = loc.id; // Set our new Event's location equal to our new Location's ID
            event.date = req.body.date; // This will be a date object sent from body -- Maybe look for a suggested time!
            event.creator = req.body.creator;
            event.attendees = req.body.users;

            // Save our event
            event.save(function (err) {
                console.log("Creating new event");
                if (err)
                    res.send(err);
                console.log("EventId: " + event.id);
            });

            // Save the eventID to each of our attendees's event lists (and the creator ..!)
            var usersToSaveTheEventTo = event.attendees;
            usersToSaveTheEventTo.push(event.creator);
            for (var i = 0; i < usersToSaveTheEventTo.length; i++)
            {
                User.findOne({ '_id': usersToSaveTheEventTo[i] }, function (err, user) {
                    if (err) {
                        console.log("ERROR adding event to user event list: " + err);
                    }
                    else {
                        user.events.push(event.id);
                        user.save(function (err) {
                            if (err) {
                                console.log("ERROR saving user after updating event list: " + err);
                            }
                            else {
                                console.log("User " + user.id + " updated!");
                            }
                        });
                    }
                });
            }
            res.json({
                message: 'Event created!',
                eventId: event.id
            });
        });
        //event.location = mongoose.Types.ObjectId(req.body.location); // This will be an ID sent from body
    });

    // This method finds ALL of the events.
    // Avoid using this.
    app.get('/api/Event', function (req, res) {
        Event.find(function (err, events) {

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(events); // return all locations in JSON format
        });
    });

    // This method finds an event based on it's eventID
    //  It returns an event, it's location, it's creator, and the UserIDs of it's attendees
    app.get('/api/Event/:event_ID', function (req, res) {
        Event.findOne({ '_id': req.params.event_ID }).populate("location creator").exec(function (err, event) {
            if (err)
                res.send(err);
            res.json(event);
        });
    });

    // This method returns an event location based on the users list that is sent.
    // This method does not save anything, nor does it retrieve any event locations.
    app.post('/api/EventLocation', function (req, res) 
    {
        console.log("Finding suggested location..");
        if (req.body.users != null && req.body.users != []) {
            var users = req.body.users;
            var numUsers = users.length;
            var databaseReturnCount = 0;
            var locations = []; // Overall list of locations to average
            var returnLocation = { latitude: 0, longitude: 0 }; // Loction to return at the end (must start at 0,0)
            for (var i = 0; i < numUsers; i++) {
                User.findOne({ '_id': users[i] }).populate("location").exec(function (err, user) {
                    if (err || user == null) {
                        databaseReturnCount++;
                        console.log("ERROR: Could not find user: " + users[i]);
                    }
                    else {
                        databaseReturnCount++;
                        locations.push( user.location);
                    }

                    if(databaseReturnCount == numUsers) // This will only execute after all users have been queried
                    {
                        returnLocation = suggestLocation(locations);
                        res.json(returnLocation);
                    }
                });
            }
        }
        else {
            // Error return below:
            res.json({
                message: "Users list empty or not sent!",
                latitude: null,
                longitude: null
            });
        }
    });

    function suggestLocation(locations)
    {
        console.log("Suggesting location..");
        var returnLocation = { latitude: 0, longitude: 0 };
        for (var i = 0; i < locations.length; i++) {
            returnLocation.latitude += locations[i].latitude;
            returnLocation.longitude += locations[i].longitude;
        }
        returnLocation.latitude /= locations.length;
        returnLocation.longitude /= locations.length;
        return returnLocation;
    }

    app.get('/api/EventLocation/:event_ID', function (req, res) {

        if (req.params.event_ID == "test")
        {
            console.log("Location test 1..");
            var location1 = { latitude: 47.7594, longitude: -122.1911 }; // UW Bothell
            var location2 = { latitude: 47.6550, longitude: -122.3080 }; // UW Seattle
            var location3 = { latitude: 47.9633, longitude: -122.2006 }; // City of Everett
            var locations = [location1, location2, location3];

            var returnLocation = { latitude: 0, longitude: 0 };
            for (var i = 0; i < locations.length; i++)
            {
                returnLocation.latitude += locations[i].latitude;
                returnLocation.longitude += locations[i].longitude;
            }
            returnLocation.latitude /= locations.length;
            returnLocation.longitude /= locations.length;
            res.json(returnLocation);
        }
        else if(req.params.event_ID == "test2")
        {
            Location.find(function (err, locations)
            {
                console.log("Location test 2..");
                var returnLocation = { latitude: 0, longitude: 0 };
                for (var i = 0; i < locations.length && i < 10; i++) // No more than 10 locations, just in case
                {
                    returnLocation.latitude += locations[i].latitude;
                    returnLocation.longitude += locations[i].longitude;
                }
                returnLocation.latitude /= locations.length;
                returnLocation.longitude /= locations.length;
                res.json(returnLocation);
            });
        }
        else {
            Event.findOne({ '_id': req.params.event_ID }).populate("location").exec( function (err, event) {

                // if there is an error retrieving, send the error. 
                // nothing after res.send(err) will execute
                if (err) // This means that our location didn't exist
                    res.send(err); // This is effectively a 'return'
                /*
                console.log("Event: " + event);
                console.log("Location: " + event.location);
                console.log("Latitude: " + event.location.latitude);
                */
                res.json(event.location); // return single location in JSON format
            });
        }
    })

    app.post('/api/EventLocation/:event_ID', function (req, res) {
        // The request is currently an event ID-- group ID might make sense too
        res.json({ latitude: 47.7594, longitude: -122.1911 });
    });

    // This method gets ALL locations stored in the database.
    // Avoid using this. Use the :location_ID method instead.
    app.get('/api/Location', function (req, res) {
        Location.find(function (err, locations) {

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(locations); // return all locations in JSON format
        });
    });

    app.get('/api/Location/:location_ID', function (req, res) {
        Location.findOne({ '_id': req.params.location_ID }, function (err, location) {

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(location); // return single location in JSON format
        });
    });

    app.post('/api/Location', function (req, res) {

        var loc = new Location();
        loc.latitude = req.body.latitude;
        loc.longitude = req.body.longitude;

        // save the user and check for errors
        loc.save(function (err) {
            if (err)
                res.send(err);

            console.log('Location at <' + req.body.latitude + ', ' + req.body.longitude + '> created!');
            res.json({
                message: 'Location at <' + req.body.latitude + ', ' + req.body.longitude + '> created!',
                locationId: loc.id
            });
        });

    });

    // This finds the user with user_ID
    // Also used to find the ID of the testuser
    app.get('/api/users/:user_ID', function (req, res) {

        if (req.params.user_ID == "TestUser")
        {
            console.log("Find TestUser..");
            User.findOne({ 'name': testUserName }, function (err, user) {
                if (err) {
                    console.log("ERROR finding Test User: " + err);
                    res.send(err);
                }
                else if(user == null || user.id == null)
                {
                    console.log("ERROR finding Test User ID!");
                    res.json({ message: "Could not find Test User ID!" });
                }
                else {
                    console.log("Test user found!");
                    res.send(user.id);
                }
            });
        }
        else
        {
            User.findOne({ '_id': req.params.user_ID }).populate("location").exec(function (err, user) {
                if (err)
                    res.send(err);
                Event.find({ '_id': { $in: user.events } }).populate("creator").exec(function (err, eventsList) {
                    if (err)
                        res.send(err);
                    user.events = eventsList;
                    res.json(user);
                });
            });
        }
    });

    // This finds ALL users. Avoid using this.
    app.get('/api/users', function (req, res) {
        // use mongoose to get all users in the database
        User.find(function (err, users) {
            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(users); // return all users in JSON format
        });
    });

    // route to handle creating goes here (app.post)
    app.post('/api/users', function (req, res) {
        
        var user = new User();      // create a new instance of the User model
        user.name = req.body.name;  // set the user's name (comes from the request)
        user.location = req.body.location; // Set the user's location ID

        // save the user and check for errors
        user.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'User named "' + req.body.name + '" created!' });
        });
        
    });

    // This method verifies the array of user names sent in the
    //  body of the request, and returns an array of user IDs
    // This method also saves the users profile information, if
    //  the user_ID is not 'verify' and returns the updated info
    app.post('/api/users/:user_ID', function (req, res) {
        if (req.params.user_ID == "verify") {
            console.log("Verifiying usernames: " + req.body.users);
            User.find({ 'name': { $in: req.body.users } }, function (err, userList) {
                if (err)
                    res.send(err);
                var returnUserIDList = [];
                for (var i = 0; i < userList.length; i++) {
                    returnUserIDList.push(userList[i].id);
                }
                res.json(returnUserIDList);
            });
        }
        else
        {
            User.findOne({ '_id': req.params.user_ID }, function (err, user) {
                if (err)
                    res.send(err);
                else if (user == null) {
                    res.json({ message: "Could not find user!" });
                }
                else {
                    if (req.body.name != null && req.body.name != "")
                        user.name = req.body.name;
                    if (req.body.schedule != null && req.body.schedule != [] && req.body.schedule != "")
                        user.schedule = req.body.schedule;
                    if (req.body.location != null && req.body.location != "" && req.body.location.id != null)
                        user.location = req.body.location.id;
                    user.save(function (err) {
                        if (err) {
                            console.log("Could not update profile information: " + err);
                            res.send(err);
                        }
                        else {
                            console.log("Updated profile information for: " + user.id);
                            res.json(user);
                        }
                    });
                }
            });
        }
    });

    /* This area is for the automated tests */
    app.get('/api/automatedTests', function (req, res) {
        console.log("Running automated tests..");
        var userIds = [];
        var locationIds = [];
        /* Add test locations*/
        var location1 = { latitude: 47.7594, longitude: -122.1911 }; // UW Bothell
        var location2 = { latitude: 47.6550, longitude: -122.3080 }; // UW Seattle
        var location3 = { latitude: 47.9633, longitude: -122.2006 }; // City of Everett
        var locations = [location1, location1,location2, location3];
        var numLocations = locations.length;
        var topDatabaseQueryNum = 0;
        for (var l = 0; l < numLocations; l++)
        {
            var loc = new Location();
            loc.latitude = locations[l].latitude;
            loc.longitude = locations[l].longitude;

            // save the user and check for errors
            console.log('Creating Location at <' + loc.latitude + ', ' + loc.longitude + '>..');
            locationIds.push(loc.id);
            loc.save(function (err)
            {
                if (err)
                    res.send(err);

                topDatabaseQueryNum++;
                if (topDatabaseQueryNum == numLocations) // We've added all of our locations; add our users
                {
                    /* Add test users*/
                    var users = [testUserName, "Test User UW Bothell", "Test User UW Seattle", "Test User Everett"];
                    var numUsers = users.length;
                    var secondDatabaseQueryNum = 0;
                    for (var i = 0; i < numUsers; i++) { // Add some predetermined test users
                        var user = new User();
                        user.name = users[i];  // set the user's name
                        user.location = locationIds[i]; // Set the user's location ID
                        // save the user and check for errors
                        console.log('Creating User named "' + user.name + '", ID: ' + user.id +'..');
                        userIds.push(user.id);
                        user.save(function (err) {
                            if (err)
                                res.send(err);
                            secondDatabaseQueryNum++;
                            if (secondDatabaseQueryNum == numUsers)
                            {
                                res.send({
                                    message: "Successfully completed creation of test users",
                                    locationIdList: locationIds,
                                    userIdList: userIds
                                });
                            }
                        });
                    }
                }
            });
        }
    });

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};