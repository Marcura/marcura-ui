angular.module('app.controllers').controller('textBoxPageController', textBoxPageController);

function textBoxPageController($scope) {
    $scope.name = '';

    // $scope.$watch('name', function(newValue, oldValue) {
    //     console.log('new:', newValue);
    //     console.log('old:', oldValue);
    // });
}
