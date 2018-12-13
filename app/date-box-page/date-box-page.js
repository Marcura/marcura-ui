angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope, $timeout, MaDate) {
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
    $scope.date9 = new MaDate().startOf('day').format();
    $scope.date9Min = new MaDate().startOf('day').subtract(5, 'day').format();
    $scope.date9Max = new MaDate().startOf('day').add(5, 'day').format();
    $scope.date10 = '2016-07-25T00:00:00Z';
    $scope.date11 = '2016-07-25T12:40:00Z';
    $scope.date21 = new MaDate().startOf('day').format();
    $scope.date20DateBox = {};
    $scope.date20Validator = {
        validate: function (date) {
            return true;
        }
    };

    $scope.change = function (value, property) {
        console.log('change');
        console.log('event:', value);
        console.log('scope:', $scope[property]);
        console.log('');
    };

    // var getStart = function() {
    //     var end = new MaDate($scope.end);
    //
    //     if (end.isEmpty()) {
    //         end = new MaDate();
    //     }
    //
    //     return end.subtract(1, 'month').startOf('day').format();
    // };
    //
    // var getEnd = function() {
    //     return new MaDate().startOf('day').format();
    // };
    //
    // $scope.now = new MaDate().startOf('day').format();
    // $scope.end = getEnd();
    // $scope.start = getStart();
    // $scope.startComponent = {};
    // $scope.endComponent = {};
    //
    // $scope.validateStart = function(start) {
    //     start = new MaDate(start);
    //
    //     if (start.isEmpty()) {
    //         $scope.start = getStart();
    //     } else if (start.isGreater($scope.end)) {
    //         $scope.startComponent.refresh();
    //     }
    // };
    // $scope.validateEnd = function(end) {
    //     end = new MaDate(end);
    //
    //     if (end.isEmpty()) {
    //         $scope.end = getEnd();
    //     } else if (!end.isBetween($scope.start, $scope.now)) {
    //         $scope.endComponent.refresh();
    //     }
    // };

    // $scope.$watch('date2', function(newDate, oldDate) {
    //     console.log('change:', newDate);
    // });

    // $timeout(function() {
    //     // $scope.date4 = '2016-07-25T18:30:00+03:00';
    //     // $scope.date4Disabled = true;
    //     // $scope.date4Instance.validate();
    // }, 3000);
}