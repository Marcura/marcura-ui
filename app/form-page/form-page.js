angular.module('app.controllers').controller('formPageController', formPageController);

function formPageController($scope) {
    $scope.form = {
        comment: ''
    };
}