angular.module('app.controllers').controller('dateBoxPageController', dateBoxPageController);

function dateBoxPageController($scope, $timeout, maDateConverter, maValidators) {
    $scope.maValidators = maValidators;

    // Moment string.
    $scope.date1 = '2016-07-25T00:00:00Z';
    $scope.date2 = '2016-07-25T20:00:00Z';
    $scope.date3 = '2016-07-25T16:30:00Z';
    // $scope.date4 = '2016-07-25T16:30:00Z';
    $scope.date4 = '2016-07-25T16:30:00+04:00';
    $scope.date5 = '2016-07-25T16:30:00Z';
    $scope.date6 = '2016-07-25T16:30:00Z';
    $scope.date7 = '2016-07-25T00:00:00Z';
    $scope.date8 = '2016-07-25T16:30:00+04:00';
    $scope.isDate4Disabled = false;

    // console.log(maDateConverter.parse('2016-07-26T20:00:00+09:00'));

    // Moment date.
    // $scope.date = moment('2014-12-31T00:00:00Z');

    $scope.change1 = function(date) {
        console.log('date1:', date);
    };

    // $scope.change2 = function(date) {
    //     console.log('date2:', date);
    // };

    $scope.change3 = function(date) {
        console.log('date3:', date);
    };

    $scope.$watch('date2', function(newDate, oldDate) {
        console.log('change:', newDate);
    });

    $timeout(function() {
        // $scope.date4 = '2016-07-25T18:30:00+03:00';
        // $scope.isDate4Disabled = true;
    }, 3000);

    // $timeout(function() {
    //     $scope.isDate4Disabled = false;
    // }, 6000);
}
