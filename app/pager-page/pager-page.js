angular.module('app.controllers').controller('pagerPageController', pagerPageController);

function pagerPageController($scope) {
    $scope.page1 = 2;
    $scope.page2 = 2;

    $scope.change = function(page) {
        console.log('change');
        console.log('event:', page);
        console.log('scope:', $scope.page1);
    };
}