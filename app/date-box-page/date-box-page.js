angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope, $timeout, maDateConverter) {
    // Moment string.
    $scope.date1 = '2016-07-25T10:00:00Z';
    $scope.date2 = '2016-07-25T10:00:00Z';

    // Moment date.
    // $scope.date = moment('2014-12-31T00:00:00Z');

    // JavaScript Date.
    // $scope.date = new Date(2014, 11, 31);

    // $scope.change = function(date, momentDate) {
    //     console.log('change date:', date);
    //     console.log('change momentDate:', momentDate);
    // };

    $scope.$watch('date1', function(newDate, oldDate) {
        // console.log('date1:', newDate);
        // console.log('old:', oldDate);
    });

    $scope.$watch('date2', function(newDate, oldDate) {
        // console.log('date2:', newDate);
    });

    // $timeout(function() {
    //     // $scope.date = '2014-11-17T00:00:00Z';
    //     $scope.date = '';
    // }, 5000);
}
