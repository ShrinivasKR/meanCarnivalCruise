//, 'rgkevin.datetimeRangePicker', 'vr.directives.slider', 'ngTouch'], [require('angular-touch')]
angular.module('EventCtrl', ['ngMaterial', 'ngMessages']).controller('EventController', ["$scope", "EventFactory", function ($scope, eventFactory) {
    // stripped out: , 'ui.bootstrap'
    $scope.tagline = 'The square root of life is pi!';
    $scope.user = {
        username: 'Enter Username',
        password: 'Enter Password',
    };
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.update = function () {
        var d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        $scope.mytime = d;
    };

    $scope.changed = function () {
        console.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function () {
        $scope.mytime = null;
    };

    /* Location stuff */
    $scope.locationStatus = "Please enter users in order to auto-generate a place";

    $scope.createEvent = function () {
        // Create an example event
        var eventDate = new Date();
        var locationID = '556364d9f5aee374129d55f9';
        var event = {
            date: eventDate,
            location: locationID

        };
        eventFactory.createEvent(event);
    };
}])
.config(function ($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
});