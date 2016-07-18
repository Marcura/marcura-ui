angular.module('app.controllers').controller('select2PageController', select2PageController);

function select2PageController($scope) {
    $scope.currencies = [
        'BRL',
        'USD',
        'AED'
    ];
    $scope.currency = $scope.currencies[0];
}
