angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope) {
    $scope.date = '2016-12-31T00:00:00Z';
    $scope.dateChange = function(date) {
        console.log('date:', date);
    };
}
