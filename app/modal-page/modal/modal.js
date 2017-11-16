angular.module('app.controllers').controller('modalController', modalController);

function modalController($scope) {
    $scope.form = {
        comment: ''
    };
}