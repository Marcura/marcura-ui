angular.module('app.controllers').controller('selectBoxPageController', selectBoxPageController);

function selectBoxPageController($scope, $timeout, helper, MaHelper) {
    $scope.MaHelper = MaHelper;
    $scope.ports2 = helper.getPorts();
    $scope.ports1 = [];

    angular.forEach($scope.ports2, function (port) {
        $scope.ports1.push(port.name);
    });

    $scope.portItemTemplate = function (port) {
        return port.name + ' (' + port.country.name + ')';
    };

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
    $scope.port8 = $scope.ports2[1];
    $scope.port9 = {
        name: 'Moscow'
    };
    $scope.port9SelectBox = {};
    $scope.port10 = $scope.ports2[2];
    $scope.port10Ajax = {
        url: '/api/ports',
        results: function (ports, page) {
            for (var i = 0; i < ports.length; i++) {
                ports[i].text = $scope.portItemTemplate(ports[i]);
            }

            return {
                results: ports
            };
        }
    };
    $scope.port11 = $scope.ports2[1];
    $scope.port12 = null;
    $scope.port13 = $scope.ports2[1];
    // Use a copy of the array to avoid side effects from the 'items' wathcer inside SelectBox.
    // For example, selecting an item in AJAX SelectBox causes the watcher to be invoked for other SelectBoxes,
    // which in turn changes the appearence of displayed value for those SelectBoxes.
    $scope.ports14 = angular.copy($scope.ports2);
    $scope.ports15 = angular.copy($scope.ports2);
    $scope.port15 = [$scope.ports2[1]];
    $scope.port16 = $scope.ports2[1].id;
    // $scope.port17 = [$scope.ports2[2]];
    $scope.port17Ajax = {
        url: '/api/ports',
        results: function (ports, page) {
            for (var i = 0; i < ports.length; i++) {
                ports[i].text = $scope.portItemTemplate(ports[i]);
            }

            return {
                results: ports
            };
        }
    };

    // port1.
    $scope.change1 = function (port, oldPort) {
        console.log('change');
        console.log('scope:', $scope.port1);
        console.log('event:', port);
        console.log('old value:', oldPort);
    };

    // port2.
    $scope.change2 = function (port, oldPort) {
        console.log('change');
        console.log('scope:', $scope.port2);
        console.log('event:', port);
        console.log('old value:', oldPort);
    };

    // port3.
    $scope.change3 = function (port, oldPort) {
        console.log('change');
        console.log('scope:', $scope.port3);
        console.log('event:', port);
        console.log('old value:', oldPort);
    };

    // port5.
    $scope.change5 = function (port, oldPort) {
        console.log('change');
        console.log('scope:', $scope.port5);
        console.log('event:', port);
        console.log('old value:', oldPort);
    };

    // port7.
    $scope.focus7 = function (port) {
        console.log('focus');
        console.log('scope:', $scope.port7);
        console.log('event:', port);
    };

    $scope.blur7 = function (port) {
        console.log('blur');
        console.log('scope:', $scope.port7);
        console.log('event:', port);
    };

    $scope.change7 = function (port) {
        console.log('change');
        console.log('scope:', $scope.port7);
        console.log('event:', port);
    };

    // port8.
    $scope.focus8 = function (port) {
        console.log('focus');
        // console.log('scope:', $scope.port8);
        // console.log('event:', port);
    };

    $scope.blur8 = function (port) {
        console.log('blur');
        // console.log('scope:', $scope.port8);
        // console.log('event:', port);
    };

    $scope.change8 = function (port) {
        console.log('change');
        // console.log('scope:', $scope.port8);
        // console.log('event:', port);
    };

    // port9.
    $scope.focus9 = function (port) {
        console.log('focus');
        console.log('scope:', $scope.port9);
        console.log('event:', port);
    };

    $scope.blur9 = function (port) {
        console.log('blur');
        console.log('scope:', $scope.port9);
        console.log('event:', port);
    };

    $scope.change9 = function (port) {
        console.log('change');
        console.log('scope:', $scope.port9);
        console.log('event:', port);
    };

    // port10.
    $scope.focus10 = function (port) {
        console.log('focus');
        console.log('scope:', $scope.port10);
        console.log('event:', port);
    };

    $scope.blur10 = function (port) {
        console.log('blur');
        console.log('scope:', $scope.port10);
        console.log('event:', port);
    };

    $scope.change10 = function (port, oldPort) {
        console.log('change');
        console.log('scope:', $scope.port10);
        console.log('event:', port);
        console.log('old value:', oldPort);
    };

    // port11.
    $scope.focus11 = function (port) {
        console.log('focus');
        console.log('scope:', $scope.port11);
        console.log('event:', port);
    };

    $scope.blur11 = function (port) {
        console.log('blur');
        console.log('scope:', $scope.port11);
        console.log('event:', port);
    };

    $scope.change11 = function (port) {
        console.log('change');
        console.log('scope:', $scope.port11);
        console.log('event:', port);
    };

    // port14.
    $scope.focus14 = function (ports) {
        console.log('focus');
        console.log('scope:', $scope.port14);
        console.log('event:', ports);
    };

    $scope.blur14 = function (ports) {
        console.log('blur');
        console.log('scope:', $scope.port14);
        console.log('event:', ports);
    };

    $scope.change14 = function (ports, oldPort) {
        console.log('change');
        console.log('scope:', $scope.port14);
        console.log('event:', ports);
        console.log('old value:', oldPort);
    };

    // port15.
    $scope.focus15 = function (ports) {
        console.log('focus');
        console.log('scope:', $scope.port15);
        console.log('event:', ports);
    };

    $scope.blur15 = function (ports) {
        console.log('blur');
        console.log('scope:', $scope.port15);
        console.log('event:', ports);
    };

    $scope.change15 = function (ports) {
        console.log('change');
        console.log('scope:', $scope.port15);
        console.log('event:', ports);
    };

    // port16.
    $scope.focus16 = function (port) {
        console.log('focus');
        console.log('scope:', $scope.port16);
        console.log('event:', port);
    };

    $scope.blur16 = function (port) {
        console.log('blur');
        console.log('scope:', $scope.port16);
        console.log('event:', port);
    };

    $scope.change16 = function (port, oldPort) {
        console.log('change');
        console.log('scope:', $scope.port16);
        console.log('event:', port);
        console.log('old value:', oldPort);
    };

    $timeout(function () {
        $scope.port16 = 0;
    }, 3000);


    // port17.
    // $scope.focus17 = function (port) {
    //     console.log('focus');
    //     console.log('scope:', $scope.port17);
    //     console.log('event:', port);
    // };

    // $scope.blur17 = function (port) {
    //     console.log('blur');
    //     console.log('scope:', $scope.port17);
    //     console.log('event:', port);
    // };

    $scope.change17 = function (port, oldPort) {
        console.log('change');
        console.log('scope:', $scope.port17);
        console.log('event:', port);
        console.log('old value:', oldPort);
    };

    // Test placeholder in AJAX mode.
    // $timeout(function () {
    //     $scope.port10 = null;
    // }, 3000);
    //
    // $timeout(function () {
    //     $scope.port10 = $scope.ports2[1];
    // }, 6000);
    //
    // $timeout(function () {
    //     $scope.port10 = null;
    // }, 9000);
    //
    // $timeout(function () {
    //     $scope.port10 = $scope.ports2[0];
    // }, 12000);

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