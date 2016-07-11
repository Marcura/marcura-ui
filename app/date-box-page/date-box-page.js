angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope) {
    $scope.dateChange = function(date) {
        console.log('date:', date);
    };
}
