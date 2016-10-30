angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope, $timeout, MaDate, maValidators, maHelper) {
    $scope.maValidators = maValidators;

    // Moment string.
    $scope.date1 = '2016-07-25T00:00:00Z';
    $scope.date2 = '2016-07-25T20:00:00Z';
    $scope.date3 = '2016-07-25T16:30:00Z';
    // $scope.date4 = '2016-07-25T16:30:00Z';
    $scope.date4 = '2016-07-25T16:30:00+04:00';
    $scope.date4Disabled = false;
    $scope.date4Instance = {};
    $scope.date6 = '2016-07-25T16:30:00Z';
    // $scope.date7 = '2016-07-25T00:00:00Z';
    $scope.change7Validator = {
        method: function(date) {
            console.log('validate:', date);
            return true;
        }
    };
    $scope.date8 = '2016-07-25T16:30:00Z';
    $scope.date9 = MaDate.format(moment(), 'yyyy-MM-ddT00:00:00Z');
    $scope.date9min = MaDate.format(moment().add(-5, 'day'), 'yyyy-MM-ddT00:00:00Z');
    $scope.date9max = MaDate.format(moment().add(5, 'day'), 'yyyy-MM-ddT00:00:00Z');
    $scope.date10 = '2016-07-25T00:00:00Z';

    maHelper.isGreaterThanOrEqual('2016-10-12T00:00:00Z', '2016-10-12T00:00:00Z');

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

    $scope.change7 = function(date) {
        console.log('change:', date);
    };

    $scope.change10 = function(date) {
        console.log('event:', date);
        console.log('scope:', $scope.date10);
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
