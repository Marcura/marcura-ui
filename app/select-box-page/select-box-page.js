angular.module('app.controllers').controller('selectBoxPageController', selectBoxPageController);

function selectBoxPageController($scope, $timeout) {
    $scope.currencies1 = [
        'BRL',
        'USD',
        'AED'
    ];
    $scope.currency1 = $scope.currencies1[1];
    $scope.currencies2 = [{
        code: 'BRL',
        country: 'Brazil'
    }, {
        code: 'USD',
        country: 'United States'
    }, {
        code: 'AED',
        country: 'United Arab Emirates'
    }];
    $scope.currency2 = $scope.currencies2[1];

    $scope.change1 = function(currency) {
        console.log('change1:', currency);
    };

    $scope.change2 = function(currency) {
        console.log('change2:', currency);
    };

    // $timeout(function() {
    //     $scope.isLoading = true;
    // }, 3000);
    //
    // $timeout(function() {
    //     $scope.isLoading = false;
    // }, 6000);
    //
    // $timeout(function() {
    //     $scope.isLoading = true;
    // }, 9000);
    //
    // $timeout(function() {
    //     $scope.isLoading = false;
    // }, 12000);
}
