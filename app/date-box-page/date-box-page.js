angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope, $timeout, maDateConverter, maValidators) {
    $scope.maValidators = maValidators;

    // Moment string.
    $scope.date1 = '2016-07-25T00:00:00Z';
    $scope.date2 = '2016-07-25T20:00:00Z';
    $scope.date3 = '2016-07-25T16:30:00Z';
    // $scope.date4 = '2016-07-25T16:30:00Z';
    $scope.date4 = '2016-07-25T16:30:00+04:00';
    $scope.date4Disabled = false;
    $scope.date4Instance = {};
    $scope.date5 = '2016-07-25T16:30:00Z';
    $scope.date6 = '2016-07-25T16:30:00Z';
    $scope.date7 = '2016-07-25T00:00:00Z';
    $scope.date8 = '2016-07-25T16:30:00+04:00';
    $scope.date9 = maDateConverter.format(moment(), 'yyyy-MM-ddT00:00:00Z');
    $scope.date9min = maDateConverter.format(moment().add(-5, 'day'), 'yyyy-MM-ddT00:00:00Z');
    $scope.date9max = maDateConverter.format(moment().add(5, 'day'), 'yyyy-MM-ddT00:00:00Z');
    $scope.date10 = '2016-07-25T00:00:00Z';

    $scope.change1 = function(date) {
        console.log('event:', date);
        console.log('scope:', $scope.date1);
    };

    // $scope.change2 = function(date) {
    //     console.log('date2:', date);
    // };

    $scope.change3 = function(date) {
        console.log('change:', date);
    };

    // $scope.$watch('date2', function(newDate, oldDate) {
    //     console.log('change:', newDate);
    // });

    $timeout(function() {
        // $scope.date4 = '2016-07-25T18:30:00+03:00';
        // $scope.date4Disabled = true;
        // $scope.date4Instance.validate();
    }, 3000);
}
