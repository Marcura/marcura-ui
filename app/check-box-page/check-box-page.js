angular.module('app.controllers').controller('checkBoxPageController', checkBoxPageController);

function checkBoxPageController($scope, $timeout) {
    $scope.isAgreed = false;
    $scope.isDisabled = true;
    $scope.change = function(value) {
        console.log('value:', value);
    };

    // $timeout(function() {
    //     $scope.isDisabled = false;
    // }, 3000);
    //
    // $timeout(function() {
    //     $scope.isDisabled = true;
    // }, 10000);
}
