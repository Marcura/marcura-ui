angular.module('app.controllers').controller('buttonPageController', buttonPageController);

function buttonPageController($scope) {
    $scope.click = function () {
        console.log('click');
    };
}