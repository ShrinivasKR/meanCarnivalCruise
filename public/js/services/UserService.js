angular.module('UserService', []).factory('UserFactory', ['$http', function($http) 
{
    var urlBase = "/api/users";
    var userService = {};

    // call to get all users
    userService.getAllUsers = function () {
        return $http.get(urlBase);
    },

    // Gets the info of the user specified by the userId
    userService.getUser = function (userId)
    {
        return $http.get(urlBase + "/" + userId);
    },

    // Returns the id of the TestUser
    userService.getSelf = function ()
    {
        return $http.get(urlBase+"/TestUser");
    },

    // call to POST and create a new user
    userService.createUser = function (userData) {
        return $http.post(urlBase, userData);
    },

    // This method saves a user's info
    userService.saveProfile = function (userData) {
        if (userData != null && userData.id != null)
            return $http.post(urlBase + "/" + userData.id, userData);
        else
            console.log("Could not save profile information; no user id!");
    }

    return userService;
}]);