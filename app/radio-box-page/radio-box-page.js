angular.module('app.controllers').controller('radioBoxPageController', radioBoxPageController);

function radioBoxPageController($scope) {
    $scope.position = 'top';

    $scope.change = function(value) {
        console.log('change position:', value);
    };

    $scope.$watch('position', function(position) {
        console.log('watch position:', position);
    });
}
