angular.module('app.controllers').controller('selectBoxPageController', selectBoxPageController);

function selectBoxPageController($scope, $timeout, helper) {
    $scope.ports1 = ['Tokai', 'Vladivostok', 'Navlakhi'];
    $scope.ports2 = helper.getPorts();
    $scope.port1 = $scope.ports1[1];
    $scope.port2 = $scope.ports2[1];
    $scope.port3 = $scope.ports2[1];
    $scope.port3SelectBox = {};
    $scope.port4 = $scope.ports2[1];
    $scope.port5 = $scope.ports1[1];
    $scope.port7 = $scope.ports2[1];
    $scope.port8 = {
        name: 'Moscow'
    };
    $scope.port8SelectBox = {};
    // $scope.port8 = 'Moscow';
    // $scope.port8 = $scope.ports2[1];
    $scope.port9 = {
        name: 'Moscow'
    };
    $scope.port9SelectBox = {};
    $scope.port10 = $scope.ports2[2];
    $scope.port10Ajax = {
        url: '/api/ports',
        results: function(ports, page) {
            for (var i = 0; i < ports.length; i++) {
                ports[i].text = ports[i].name;
            }

            return {
                results: ports
            };
        }
    };

    // port1.
    $scope.change1 = function(port) {
        console.log('change');
        console.log('scope:', $scope.port1);
        console.log('event:', port);
    };

    // port2.
    $scope.change2 = function(port) {
        console.log('change');
        console.log('scope:', $scope.port2);
        console.log('event:', port);
    };

    // port3.
    $scope.change3 = function(port) {
        console.log('change');
        console.log('scope:', $scope.port3);
        console.log('event:', port);
    };
    //
    // $scope.change5 = function(port) {
    //     console.log('change');
    //     console.log('scope:', $scope.port5);
    //     console.log('event:', port);
    // };

    // port7.
    $scope.focus7 = function(port) {
        console.log('focus');
        console.log('scope:', $scope.port7 ? $scope.port7 : $scope.port7);
        console.log('event:', port ? port : port);
    };

    $scope.blur7 = function(port) {
        console.log('blur');
        console.log('scope:', $scope.port7 ? $scope.port7 : $scope.port7);
        console.log('event:', port ? port : port);
    };

    $scope.change7 = function(port) {
        console.log('change');
        console.log('scope:', $scope.port7 ? $scope.port7 : $scope.port7);
        console.log('event:', port ? port : port);
    };

    // port8.
    $scope.focus8 = function(port) {
        console.log('focus');
        // console.log('scope:', $scope.port8 ? $scope.port8 : $scope.port8);
        // console.log('event:', port ? port : port);
    };

    $scope.blur8 = function(port) {
        console.log('blur');
        // console.log('scope:', $scope.port8 ? $scope.port8 : $scope.port8);
        // console.log('event:', port ? port : port);
    };

    $scope.change8 = function(port) {
        console.log('change');
        // console.log('scope:', $scope.port8 ? $scope.port8 : $scope.port8);
        // console.log('event:', port ? port : port);
    };

    // port9.
    $scope.focus9 = function(port) {
        console.log('focus');
        console.log('scope:', $scope.port9 ? $scope.port9 : $scope.port9);
        console.log('event:', port ? port : port);
    };

    $scope.blur9 = function(port) {
        console.log('blur');
        console.log('scope:', $scope.port9 ? $scope.port9 : $scope.port9);
        console.log('event:', port ? port : port);
    };

    $scope.change9 = function(port) {
        console.log('change');
        console.log('scope:', $scope.port9 ? $scope.port9 : $scope.port9);
        console.log('event:', port ? port : port);
    };

    // port10.
    $scope.focus10 = function(port) {
        console.log('focus');
        console.log('scope:', $scope.port10 ? $scope.port10 : $scope.port10);
        console.log('event:', port ? port : port);
    };

    $scope.blur10 = function(port) {
        console.log('blur');
        console.log('scope:', $scope.port10 ? $scope.port10 : $scope.port10);
        console.log('event:', port ? port : port);
    };

    $scope.change10 = function(port) {
        console.log('change');
        console.log('scope:', $scope.port10 ? $scope.port10 : $scope.port10);
        console.log('event:', port ? port : port);
    };

    // API: Mode.
    // $timeout(function() {
    //     $scope.port8SelectBox.switchToAddMode();
    // }, 5000);
    //
    // $timeout(function() {
    //     $scope.port8SelectBox.switchToSelectMode();
    // }, 10000);
    //
    // $timeout(function() {
    //     $scope.port8SelectBox.switchToAddMode();
    // }, 15000);

    // Setting value changes mode.
    // $timeout(function() {
    //     $scope.port8 = $scope.ports2[2];
    // }, 5000);
    //
    // $timeout(function() {
    //     $scope.port8 = $scope.ports2[0];
    // }, 10000);
    //
    // $timeout(function() {
    //     $scope.port8 = {
    //         name: 'Magnitogorsk'
    //     };
    // }, 15000);

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
