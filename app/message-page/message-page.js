angular.module('app.controllers').controller('messagePageController', messagePageController);

function messagePageController($scope, $timeout) {
    $scope.state = 'info';

    $timeout(function () {
        $scope.state = 'success';
    }, 3000);

    $timeout(function () {
        $scope.state = 'warning';
    }, 6000);

    $timeout(function () {
        $scope.state = 'danger';
    }, 9000);
}