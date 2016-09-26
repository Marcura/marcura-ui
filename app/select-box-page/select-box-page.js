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

    // $timeout(function() {
    //     $scope.port2 = null;
    //     console.log('1:', $scope.port2);
    // }, 3000);
    //
    // $timeout(function() {
    //     $scope.port2 = $scope.ports2[0];
    //     console.log('2:', $scope.port2);
    // }, 6000);
    //
    // $timeout(function() {
    //     $scope.port2 = $scope.ports2[2];
    //     console.log('3:', $scope.port2);
    // }, 9000);
    //
    // $timeout(function() {
    //     $scope.port2 = null;
    //     console.log('4:', $scope.port2);
    // }, 12000);

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
