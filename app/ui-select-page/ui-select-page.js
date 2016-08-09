angular.module('app.controllers').controller('uiSelectPageController', uiSelectPageController);

function uiSelectPageController($scope) {
    $scope.currencies = [
        'BRL',
        'USD',
        'AED'
    ];
}
