angular.module('GeekCtrl', []).controller('GeekController', ["$scope", "GeekFactory", function ($scope, geekFactory) {

    $scope.status = 'Initilizing..';

    // ALL the maps stuff!
    var map;
    var initialZoom = 15;
    var zoomIncriment = 2;
    var expanionNum = 0;
    var maxExpansionNum = 4;

    function initialize() {
        var mapOptions = { zoom: initialZoom };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        getPosition();

        /*
	    // Try HTML5 geolocation
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function (position) {
	            var pos = new google.maps.LatLng(position.coords.latitude,
                                                 position.coords.longitude);

	            var infowindow = new google.maps.InfoWindow(
                {
                    map: map,
                    position: pos,
                    content: 'Location found using HTML5.'
                });

	            map.setCenter(pos);
	        },
            function () {
                handleNoGeolocation(true);
            });
	    }
	    else {
	        // Browser doesn't support Geolocation
	        handleNoGeolocation(false);
	    }
	    infoWindow = new google.maps.InfoWindow();
	    service = new google.maps.places.PlacesService(map);

	    google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
        */
    }

    function getPosition()
    {
        geekFactory.getEventLocation('0x1') // Random temp ID
            .success(function (location) {
                $scope.status = "Retrieving location..";

                var pos = new google.maps.LatLng(location.latitude, location.longitude);

                var infowindow = new google.maps.InfoWindow();

                map.setCenter(pos);

                infoWindow = new google.maps.InfoWindow();
                service = new google.maps.places.PlacesService(map);
                $scope.status = "Marking nearby locations.."
                google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
            })
            .error(function (error) {
                $scope.status = 'Unable to retrieve location: ' + error.message;
            });
        
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        }
        else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options =
        {
            map: map,
            position: new google.maps.LatLng(60, 105),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }


    function performSearch()
    {
        expanionNum++;
        var typesList = ['library', 'cafe'];
        var radius = 5000;
        switch(expanionNum)
        {
            case 1:
                radius = 5000;
                break;
            case 2:
                radius = 10000;
                break;
            case 3:
                radius = 25000;
                break;
            case 4:
                radius = 35000;
                break;
            case 5:
                radius = 50000;
                typesList += ['city_hall', 'park', 'establishment', 'food', 'night_club'];
                break;
            default:
                expansionNum = maxExpansionNum + 1; // Uhoh. Ensure we're past max num
        }
        var request =
        {
            bounds: map.getBounds(),
            radius: '' + radius, // dirty string conversion
            types: typesList

        };
        //service.radarSearch(request, callback); // Radar search gets us more options with less variety
        service.nearbySearch(request, callback);
    }

    function callback(results, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK)
        {
            console.log("Error: Unable to display search results: " + status);
            if (expanionNum < maxExpansionNum)
            {
                console.log("Expanding search paramaters..");
                google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
                map.setZoom(map.getZoom() - zoomIncriment);
            }
            return;
        }
        for (var i = 0, result; result = results[i]; i++) // Iterates through results
        {
            createMarker(results[i]);
        }
    }

    function createMarker(place) {
        var marker = new google.maps.Marker(
        {
            map: map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function () {
            service.getDetails(place, function (result, status)
            {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                    alert(status);
                    return;
                }

                infoWindow.setContent("<b>" + result.name + "</b></br> " + result.formatted_address + '</br><button onclick="addLocation(' + result.geometry.location.lat() + ',' + result.geometry.location.lng() + ')">Create</button>');
                infoWindow.open(map, marker);
            });
        });
    }

    addLocation = function (lat, long) {
        console.log("Creating location. Lat: " + lat + ", Long: " + long);
        var newLocation =
        {
            latitude: lat,
            longitude: long
        }
        geekFactory.createLocation(newLocation)
            .success(function () {
                console.log("Created new location");
            }).
        error(function (error) {
            console.log('Inserting location: ' + $scope.textbox.textBoxValue + ", " + $scope.textbox.textBoxValueTwo + " ---- " + 'Unable to insert location: ' + error.message);
        });
    }

    $scope.createLocation = function () {
        addLocation($scope.textbox.textBoxValue, $scope.textbox.textBoxValueTwo);
        /*
        var newLocation =
        {
            latitude: $scope.textbox.textBoxValue,
            longitude: $scope.textbox.textBoxValueTwo
        }
        geekFactory.createLocation(newLocation)
            .success(function () {
                console.log("Created new location");
            }).
        error(function (error) {
            console.log('Inserting location: ' + $scope.textbox.textBoxValue + ", " + $scope.textbox.textBoxValueTwo + " ---- " + 'Unable to insert location: ' + error.message);
        });*/
    }

    initialize();
}]);