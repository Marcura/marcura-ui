angular.module('app.controllers').controller('buttonPageController', buttonPageController);

function buttonPageController($scope) {
    $scope.click = function () {
        console.log('click');
    };

    $scope.focus = function () {
        console.log('focus');
    };

    $scope.blur = function () {
        console.log('blur');
    };
}