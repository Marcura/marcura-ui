angular.module('app.controllers').controller('pagerPageController', pagerPageController);

function pagerPageController($scope) {
    $scope.page1 = 2;
    $scope.page2 = 2;
    $scope.page3 = 2;
    $scope.page4 = 2;
    $scope.page5 = 2;

    $scope.change1 = function (page, itemsPerPage) {
        console.log('change');
        console.log('page:', page);
        console.log('itemsPerPage:', itemsPerPage);
        console.log('scope page:', $scope.page1);
    };

    $scope.change2 = function (page, itemsPerPage) {
        console.log('change');
        console.log('page:', page);
        console.log('itemsPerPage:', itemsPerPage);
        console.log('scope page:', $scope.page5);
    };
}