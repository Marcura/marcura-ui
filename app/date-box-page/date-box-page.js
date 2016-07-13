angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope, $timeout, maDateConverter) {
    // Moment string.
    $scope.date = '2014-12-31T00:00:00Z';

    // Moment date.
    // $scope.date = moment('2014-12-31T00:00:00Z');

    // JavaScript Date.
    // $scope.date = new Date(2014, 11, 31);

    // $scope.change = function(date, momentDate) {
    //     console.log('change date:', date);
    //     console.log('change momentDate:', momentDate);
    // };

    // $scope.$watch('date', function(newDate, oldDate) {
    //     console.log('new:', newDate);
    //     console.log('old:', oldDate);
    // });

    // $timeout(function() {
    //     // $scope.date = '2014-11-17T00:00:00Z';
    //     $scope.date = '';
    // }, 5000);
}
