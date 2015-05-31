angular.module('GeekService', []).factory('GeekFactory', ['$http', function ($http)
{

    var locationService = {};

    // This method will get the event location of a particular event
    locationService.getEventLocation = function (eventID) // This might need to change to event name, or something
    {
        //return $http.post("/api/EventLocation/" + eventID, request);
        return $http.get("/api/EventLocation/test2")//, request);
    }

    locationService.createLocation = function (locationData) {
        return $http.post('/api/Location', locationData);
    }

    return locationService;
}]);