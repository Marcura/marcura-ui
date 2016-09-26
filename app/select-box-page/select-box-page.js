angular.module('app.controllers').controller('selectBoxPageController', selectBoxPageController);

function selectBoxPageController($scope, $timeout) {
    $scope.ports1 = ['Tokai', 'Vladivostok', 'Navlakhi'];
    $scope.ports2 = [{
        id: 1,
        name: 'Tokai'
    }, {
        id: 2,
        name: 'Vladivostok'
    }, {
        id: 3,
        name: 'Navlakhi'
    }];
    $scope.port1 = $scope.ports1[1];
    $scope.port2 = $scope.ports2[1];
    $scope.port3 = $scope.ports2[1];
    $scope.port4 = $scope.ports2[1];
    $scope.port3SelectBox = {};

    $scope.change1 = function(port) {
        console.log('scope:', $scope.port1);
        console.log('event:', port);
    };

    $scope.change2 = function(port) {
        console.log('scope:', $scope.port2);
        console.log('event:', port);
    };

    $scope.change3 = function(port) {
        console.log('scope:', $scope.port3);
        console.log('event:', port);
    };

    // API.
    // $timeout(function() {
    //     $scope.port3SelectBox.showAddView();
    // }, 5000);
    //
    // $timeout(function() {
    //     $scope.port3SelectBox.showSelectView();
    // }, 10000);

    // Setting value from scope.
    // $timeout(function() {
    //     $scope.port3 = null;
    //     console.log('1:', $scope.port3);
    // }, 3000);
    //
    // $timeout(function() {
    //     $scope.port3 = $scope.ports2[0];
    //     console.log('2:', $scope.port3);
    // }, 6000);
    //
    // $timeout(function() {
    //     $scope.port3 = $scope.ports2[2];
    //     console.log('3:', $scope.port3);
    // }, 9000);
    //
    // $timeout(function() {
    //     $scope.port3 = null;
    //     console.log('4:', $scope.port3);
    // }, 12000);

    // Disabled.
    // $timeout(function() {
    //     $scope.isDisabled = true;
    // }, 3000);
    //
    // $timeout(function() {
    //     $scope.isDisabled = false;
    // }, 9000);

    // Loading.
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
