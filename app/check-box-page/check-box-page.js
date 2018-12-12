angular.module('app.controllers').controller('checkBoxPageController', checkBoxPageController);

function checkBoxPageController($scope, $timeout, helper) {
    $scope.ports = helper.getPorts().slice(0, 3);
    $scope.isDisabled = true;
    $scope.value1 = true;
    $scope.value3 = true;
    $scope.value6 = true;
    $scope.value9 = true;
    $scope.value12 = true;
    $scope.checkBox1Enabled = true;

    $scope.toggleCheckBox1 = function () {
        $scope.checkBox1Enabled = !$scope.checkBox1Enabled;
    };

    $scope.change = function (value) {
        console.log('change:', value);
    };

    $scope.portChange = function (port) {
        console.log('port:', port);
    };

    // $timeout(function() {
    //     $scope.isDisabled = false;
    // }, 3000);
    //
    // $timeout(function() {
    //     $scope.isDisabled = true;
    // }, 10000);
}