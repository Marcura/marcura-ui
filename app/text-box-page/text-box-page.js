angular.module('app.controllers').controller('textBoxPageController', textBoxPageController);

function textBoxPageController($scope) {
    $scope.name = '';

    $scope.change = function(value) {
        console.log('value:', value);
    };

    // $scope.$watch('name', function(newValue, oldValue) {
    //     console.log('new:', newValue);
    //     console.log('old:', oldValue);
    // });
}
