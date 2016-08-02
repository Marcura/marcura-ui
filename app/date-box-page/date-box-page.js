angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope, $timeout, maDateConverter) {
    // Moment string.
    $scope.date1 = '2016-07-25T00:00:00Z';
    $scope.date2 = '2016-07-25T20:00:00Z';
    $scope.date3 = '2016-07-25T16:30:00Z';

    // Moment date.
    // $scope.date = moment('2014-12-31T00:00:00Z');

    $scope.change1 = function(date) {
        console.log('date1:', date);
    };

    $scope.change2 = function(date) {
        console.log('date2:', date);
    };

    // $scope.$watch('date1', function(newDate, oldDate) {
    //     console.log('date1:', newDate);
    // });

    // $scope.$watch('date2', function(newDate, oldDate) {
    //     console.log('date2:', newDate);
    // });

    // $timeout(function() {
    //     // $scope.date = '2014-11-17T00:00:00Z';
    //     $scope.date = '';
    // }, 5000);
}
