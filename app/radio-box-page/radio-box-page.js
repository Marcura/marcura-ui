angular.module('app.controllers').controller('radioBoxPageController', radioBoxPageController);

function radioBoxPageController($scope, $timeout) {
    $scope.selectedPortName = 'top';
    $scope.ports = [{
        id: 1,
        name: 'Tokai'
    }, {
        id: 2,
        name: 'Vladivostok'
    }, {
        id: 3,
        name: 'Navlakhi'
    }];
    $scope.ports2 = angular.copy($scope.ports);
    $scope.selectedPort = null;
    $scope.selectedPort2 = null;

    // $scope.portComparer = function(port, selectedPort) {
    //     return port && selectedPort && port.id === selectedPort.id;
    // };

    $scope.change = function(value) {
        console.log('change:', value);
    };

    $scope.portChange2 = function(value) {
        // console.log('value:', value);
        console.log('selectedPort:', $scope.selectedPort2);
    };

    $timeout(function() {
        // $scope.selectedPort2 = {
        //     id: 3,
        //     name: 'Navlakhi'
        // };
        $scope.selectedPort2 = $scope.ports2[1];
    }, 4000);
}
