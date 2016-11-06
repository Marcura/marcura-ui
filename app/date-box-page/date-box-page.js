angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope, $timeout, MaDate, maValidators) {
    $scope.date1 = '2016-07-25T00:00:00Z';
    $scope.date2 = '2016-07-25T20:00:00Z';
    $scope.date3 = '2016-07-25T16:30:00Z';
    // $scope.date4 = '2016-07-25T16:30:00Z';
    $scope.date4 = '2016-07-25T16:30:00+04:00';
    $scope.date4Disabled = false;
    $scope.date4Instance = {};
    $scope.date6 = '2016-07-25T16:30:00Z';
    // $scope.date7 = '2016-07-25T00:00:00Z';
    $scope.date8 = '2016-07-25T16:30:00Z';
    $scope.date9 = new MaDate().format('yyyy-MM-ddT00:00:00Z');
    $scope.date9Min = new MaDate().subtract(5, 'day').format('yyyy-MM-ddT00:00:00Z');
    $scope.date9Max = new MaDate().add(5, 'day').format('yyyy-MM-ddT00:00:00Z');
    $scope.date10 = '2016-07-25T00:00:00Z';
    $scope.date21 = new MaDate().format('yyyy-MM-ddT00:00:00Z');

    $scope.date20DateBox = {};
    $scope.date20Validator = {
        validate: function(date) {
            console.log('validate:', date);
            return true;
        }
    };

    $scope.change1 = function(date) {
        console.log('change');
        console.log('event:', date);
        console.log('scope:', $scope.date1);
    };

    // $scope.change2 = function(date) {
    //     console.log('event:', date);
    //     console.log('scope:', $scope.date2);
    // };

    $scope.change7 = function(date) {
        console.log('change');
        console.log('event:', date);
        console.log('scope:', $scope.date7);
    };

    $scope.change10 = function(date) {
        console.log('change');
        console.log('event:', date);
        console.log('scope:', $scope.date10);
    };

    $scope.change20 = function(date) {
        console.log('change');
        console.log('event:', date);
        console.log('scope:', $scope.date20);
    };

    // $scope.$watch('date2', function(newDate, oldDate) {
    //     console.log('change:', newDate);
    // });

    // $timeout(function() {
    //     // $scope.date4 = '2016-07-25T18:30:00+03:00';
    //     // $scope.date4Disabled = true;
    //     // $scope.date4Instance.validate();
    // }, 3000);
}
