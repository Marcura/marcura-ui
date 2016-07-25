angular.module('app.controllers').controller('checkBoxPageController', checkBoxPageController);

function checkBoxPageController($scope) {
    $scope.isAgreed = false;
    $scope.change = function(value) {
        console.log('value:', value);
    };
}
