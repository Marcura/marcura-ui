angular.module('app.controllers').controller('multiCheckBoxPageController', multiCheckBoxPageController);

function multiCheckBoxPageController($scope, helper) {
    $scope.ports2 = helper.getPorts().slice(0, 3);
    $scope.ports1 = [];

    angular.forEach($scope.ports2, function(port) {
        $scope.ports1.push(port.name);
    });

    $scope.port1 = [$scope.ports1[1]];
    $scope.port2 = [$scope.ports2[1]];

    $scope.change1 = function(port) {
        console.log('change');
        console.log('event:', port);
        console.log('scope:', $scope.port1);
    };

    $scope.change2 = function(port) {
        console.log('change');
        console.log('event:', port);
        console.log('scope:', $scope.port2);
    };
}
