angular.module('app.controllers').controller('pagerPageController', pagerPageController);

function pagerPageController($scope) {
    $scope.page1 = 5;
    $scope.totalPages = 25;

    $scope.change = function(page) {
        console.log('change');
        console.log('event:', page);
        console.log('scope:', $scope.page1);
    };
}
