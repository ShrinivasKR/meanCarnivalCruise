angular.module('NerdService', []).factory('NerdFactory', ['$http', function($http) 
{
    var urlBase = "/api/nerds";
    var nerdService = {};
    // call to get all nerds
    nerdService.getAllNerds = function () {
        return $http.get(urlBase);
    },


    // these will work when more API routes are defined on the Node side of things
    // call to POST and create a new nerd
    nerdService.createNerd = function (nerdData) {
        return $http.post(urlBase, nerdData);
    }

    return nerdService;
}]);