angular.module('MainCtrl', []).controller('MainController', ["$scope", "UserFactory", function ($scope, userFactory) {

	//$scope.tagline = 'To the moon and back!';	

    /*$scope.activity; is the dashboard list
            what: 'Recipe to try',
            who: 'Brian Holt',
            when: '3:08PM',
            notes: "We should eat this: Grapefruit, Squash, Corn, and Tomatillo tacos"
    */
    $scope.username = "";
	$scope.activity = [];
	$scope.activity.push({
	    what: 'Loading events..',
	    who: '--',
	    when: '--',
        notes: '--'
	});
	$scope.refreshList = function(eventsList)
	{
	    $scope.activity = [];
	    for(var i = 0; i < eventsList.length; i++)
	    {
	        var eventDate = new Date(eventsList[i].date);
	        var item = {
	            what: eventsList[i].name,
	            who: eventsList[i].creator.name,
	            when: '----',
	            notes: eventDate.toLocaleString()
	        };
	        if (eventsList[i].creator.name == $scope.username)
	        {
	            item.who = 'You';
	        }
	        $scope.activity.push(item);
	    }
	}

	$scope.getUserInfo = function () {
	    console.log("Getting user info..");
	    userFactory.getSelf()
        .success(function (userID) {
            userFactory.getUser(userID)
            .success(function (userInfo)
            {
                console.log("User info found..");
                $scope.username = userInfo.name;
                if (userInfo.events != null)
                {
                    console.log("Populating events..");
                    $scope.refreshList(userInfo.events);
                }
                else
                {
                    console.log("Events list was empty..");
                    $scope.activity = fakeActivity;
                }
                console.log(userInfo);
            }).error(function (error) {
                console.log('Could not get User Info: ' + error.message);
            });
        }).error(function (error) {
            console.log('Could not get User ID: ' + error.message);
        });
	}

	fakeActivity = [
        {
            what: 'Brunch this weekend?',
            who: 'Ali Conners',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
        },
        {
            what: 'Summer BBQ',
            who: 'to Alex, Scott, Jennifer',
            when: '3:08PM',
            notes: "Wish I could come out but I'm out of town this weekend"
        },
        {
            what: 'Oui Oui',
            who: 'Sandra Adams',
            when: '3:08PM',
            notes: "Do you have Paris recommendations? Have you ever been?"
        },
        {
            what: 'Birthday Gift',
            who: 'Trevor Hansen',
            when: '3:08PM',
            notes: "Have any ideas of what we should get Heidi for her birthday?"
        },
        {
            what: 'Recipe to try',
            who: 'Brian Holt',
            when: '3:08PM',
            notes: "We should eat this: Grapefruit, Squash, Corn, and Tomatillo tacos"
        },
	];

	$scope.getUserInfo();
}]);