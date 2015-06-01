angular.module('NerdCtrl', []).controller('NerdController', ["$scope", "NerdFactory", function ($scope, nerdFactory) {

    $scope.tagline = 'Nothing beats a pocket protector!';
    $scope.visible = false;
    $scope.nerdData = "Get nerds.."

    $scope.hide = function () {
        $scope.visible = !$scope.visible;
    }

    $scope.getNerdsList = function () {
        nerdFactory.getAllNerds()
            .success(function (nerdList) {
                $scope.status = "Retrived Nerds:"
                $scope.nerdData = nerdList;
            })
            .error(function (error) {
                $scope.status = 'Unable to load nerd data: ' + error.message;
            });
    }

    $scope.create = function () {
        var newNerd = {
            name: $scope.textbox.textBoxValue,
            location: '556a428ddc92f7081175f198'
        }
        $scope.status = 'Inserting Nerd: ' + $scope.textbox.textBoxValue;
        nerdFactory.createNerd(newNerd)
            .success(function () {
                $scope.status = 'Inserted Nerd!';
                $scope.getNerdsList();
            }).
        error(function (error) {
            $scope.status = 'Inserting Nerd: ' + $scope.textbox.textBoxValue + " ---- " + 'Unable to insert nerd: ' + error.message;
        });
    }

}]);
