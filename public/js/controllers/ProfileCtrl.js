angular.module('ProfileCtrl', ['ngMaterial', 'ngMessages']).controller('ProfileController', ["$scope", "UserFactory", function ($scope, userFactory) {

    /* ====== Scope Variables ======*/
        $scope.user = {
            username: 'Enter Username',
            password: 'Enter Password',
        };

        $scope.userId = '';
        $scope.username = "";
        $scope.myLocation = { latitude: null, longitude: null };

        $scope.Times = [];
        $scope.TimesLength = 105;

        for (i = 0; i <= $scope.TimesLength; i++) {
            $scope.Times[i] = false;
        }

    /* ====== Scope Functions ======*/
        // This function is called on mouse-over or on click of a button in the table
        $scope.setColor = function (btn, num) {
            var property = document.getElementById(btn);
            if ($scope.Times[num] == true) {
                property.style.backgroundColor = "#FFFFFF"
                $scope.Times[num] = false;
            } else {
                property.style.backgroundColor = "#76FF03"
                $scope.Times[num] = true;
            }
        }

        $scope.initColor = function (btn, num) {
            var property = document.getElementById(btn);
            if ($scope.Times[num] == null || $scope.Times[num] == false)
            {
                property.style.backgroundColor = "#FFFFFF"
            }
            else{
                property.style.backgroundColor = "#76FF03"
            }
        }

        // This function should save the profile as displayed on the page
        $scope.saveProfile = function ()
        {
            var userInfo = {
                id: $scope.userId,
                name: $scope.userName,
                schedule: $scope.Times,
                location: $scope.myLocation
            };
            userFactory.saveProfile(userInfo)
            .success(function (userIDList) {
                console.log("Information saved!");
            }).error(function (error) {
                console.log('Could not save profile: ' + error.message);
            });
        }
        
        $scope.getUserInfo = function()
        {
            userFactory.getSelf()
            .success(function (userID) {
                $scope.userId = userID;
                userFactory.getUser($scope.userId)
                .success(function (userInfo) {
                    $scope.username = userInfo.name;
                    if (userInfo.schedule != null) {
                        $scope.Times = userInfo.schedule;
                        for (i = 0; i < $scope.TimesLength; i++) {
                            $scope.initColor('normalPriorityButton' + (i + 1), i);
                        }
                    }
                    $scope.myLocation = userInfo.location;
                    console.log(userInfo);
                }).error(function (error) {
                    console.log('Could not get User Info: ' + error.message);
                });
            }).error(function (error) {
                console.log('Could not get User ID: ' + error.message);
            });
        }

        $scope.getUserInfo();

    }])
    .config(function ($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
    });
