angular.module('app.controllers').controller('radioBoxPageController', radioBoxPageController);

function radioBoxPageController($scope, $timeout, helper) {
    $scope.ports2 = helper.getPorts();
    $scope.ports1 = [];

    angular.forEach($scope.ports2, function(port) {
        $scope.ports1.push(port.name);
    });

    $scope.port1 = $scope.ports1[1];
    $scope.port2 = $scope.ports2[1];
    $scope.port3 = $scope.ports1[1];
    $scope.port4 = $scope.ports1[1];
    $scope.port5 = $scope.ports2[1];
    $scope.port6 = $scope.ports1[1];
    $scope.port7 = $scope.ports2[1];
    $scope.port7ItemTemplate = function(port) {
        return '<strong>' + port.name + '</strong>' + ' (' + port.country.name + ')';
    };

    $scope.change1 = function(port) {
        console.log('change');
        console.log('scope:', $scope.port1);
        console.log('event:', port);
    };

    $scope.change2 = function(port) {
        console.log('change');
        console.log('scope:', $scope.port2);
        console.log('event:', port);
    };

    $scope.change5 = function(port, oldPort) {
        console.log('change');
        console.log('scope:', $scope.port5);
        console.log('event:', port);
        console.log('old value:', oldPort);
    };

    $scope.change6 = function(port) {
        console.log('change');
        console.log('scope:', $scope.port6);
        console.log('event:', port);
    };

    // $timeout(function() {
    //     $scope.port2 = $scope.ports2[0];
    // }, 4000);
}
