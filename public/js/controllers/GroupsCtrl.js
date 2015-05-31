angular.module('GroupsCtrl', ['ngMaterial', 'ngMessages']).controller('GroupsController', function ($scope) {

        $scope.tagline = 'The square root of life is pi!';
        $scope.user = {
            username: 'Enter Username',
            password: 'Enter Password',
        };
    })
    .config(function ($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
    });
