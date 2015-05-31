angular.module('EventService', []).factory('EventFactory', ['$http', function ($http) {

    var eventService = {};

    // This method will get the event location of a particular event
    eventService.getEventLocation = function (eventID) // This might need to change to event name, or something
    {
        //return $http.post("/api/EventLocation/" + eventID, request);
        return $http.get("/api/EventLocation/test2")//, request);
    }

    eventService.createLocation = function (locationData) {
        return $http.post('/api/Location', locationData);
    }

    eventService.createEvent = function(eventData){
        return $http.post('/api/Event', eventData);
    }

    return eventService;
}]);