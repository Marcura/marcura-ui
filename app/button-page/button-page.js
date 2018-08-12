angular.module('app.controllers').controller('buttonPageController', buttonPageController);

function buttonPageController($scope) {
    $scope.click = function () {
        console.log('click');
    };

    $scope.mousedown = function () {
        console.log('mousedown');
    };

    $scope.mouseup = function () {
        console.log('mouseup');
    };
}