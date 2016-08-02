angular.module('app.controllers').controller('radioBoxPageController', radioBoxPageController);

function radioBoxPageController($scope) {
    $scope.position = 'top';
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

    $scope.change = function(value) {
        console.log('change position:', value);
    };

    $scope.$watch('position', function(position) {
        console.log('watch position:', position);
    });

    $scope.portChange = function(value) {
        console.log('port:', value);
    };
}
