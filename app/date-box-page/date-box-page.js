angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope) {
    // Moment string.
    // $scope.date = '2016-12-31T00:00:00Z';

    // Moment date.
    // $scope.date = moment('2014-12-31T00:00:00Z');

    // JavaScript Date.
    $scope.date = new Date(2014, 11, 31);

    $scope.dateChange = function(date) {
        console.log('date:', date);
    };
}
