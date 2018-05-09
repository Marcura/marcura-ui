angular.module('app.controllers').controller('selectBoxPageController', selectBoxPageController);

function selectBoxPageController($scope, $timeout, $modal, $document, helper, MaHelper) {
    $scope.MaHelper = MaHelper;
    $scope.ports2 = helper.getPorts();
    $scope.ports1 = [];

    angular.forEach($scope.ports2, function (port) {
        $scope.ports1.push(port.name);
    });

    $scope.portItemTemplate = function (port) {
        return port.name + ' (' + port.country.name + ')';
    };

    var getPortsRequest = function () {
        return {
            url: '/api/ports',
            results: function (ports, page) {
                for (var i = 0; i < ports.length; i++) {
                    ports[i].text = $scope.portItemTemplate(ports[i]);
                }

                return {
                    results: ports
                };
            }
        }
    };

    var getPortsByRegionRequest = function () {
        return {
            url: '/api/ports',
            results: function (ports, page) {
                for (var i = 0; i < ports.length; i++) {
                    ports[i].text = $scope.portItemTemplate(ports[i]);
                }

                var portsByRegion = _.map(_.groupBy(helper.getPorts(), function (port) {
                    return port.region.id;
                }), function (ports) {
                    return {
                        text: ports[0].region.name,
                        children: ports
                    }
                });

                return {
                    results: portsByRegion
                };
            }
        }
    };

    $scope.portsByRegion = _.map(_.groupBy(helper.getPorts(), function (port) {
        return port.region.id;
    }), function (ports) {
        return {
            id: ports[0].region.id,
            text: ports[0].region.name,
            children: ports
        }
    });
    $scope.years = helper.getYears(1950);
    $scope.year = 1958;
    $scope.port1 = $scope.ports1[1];
    $scope.port2 = $scope.ports2[1];
    $scope.port3 = $scope.ports2[1];
    $scope.port3Component = {};
    $scope.port4 = $scope.ports2[1];
    $scope.port5 = $scope.ports1[1];
    $scope.port7 = $scope.ports2[1];
    $scope.port8 = {
        name: 'Moscow'
    };
    $scope.port8Component = {};
    // $scope.port8 = 'Moscow';
    // $scope.port8 = $scope.ports2[1];
    $scope.port9 = {
        name: 'Moscow'
    };
    $scope.port9Component = {};
    $scope.port10 = angular.copy($scope.ports2[2]);
    $scope.portsRequest = getPortsRequest();
    $scope.portsByRegionRequest = getPortsByRegionRequest();
    $scope.port18 = angular.copy($scope.ports2[3]);
    $scope.port18Component = {};
    $scope.port11 = $scope.ports2[1];
    $scope.port12 = null;
    $scope.port13 = $scope.ports2[1];
    // Use a copy of the array to avoid side effects from the 'items' wathcer inside SelectBox.
    // For example, selecting an item in AJAX SelectBox causes the watcher to be invoked for other SelectBoxes,
    // which in turn changes the appearence of displayed value for those SelectBoxes.
    $scope.ports14 = angular.copy($scope.ports2);
    $scope.ports15 = angular.copy($scope.ports2);
    $scope.port15 = [$scope.ports2[1]];
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
    $scope.yesNoItemTemplate = function (item) {
        return item ? 'Yes' : 'No';
    };
    $scope.yesNo = false;
    $scope.port19 = $scope.ports1[1];
    $scope.text1 = 'Tokyo';
    $scope.text2 = 'Tokyo';
    $scope.port20 = [$scope.ports2[1]];

    $scope.openModal = function () {
        $modal.open({
            templateUrl: 'select-box-page/modal/modal.html',
            controller: 'selectBoxPageModalController',
            size: 'md',
            resolve: {
                ports: function () {
                    return $scope.ports2;
                }
            }
        });
    };

    $scope.change = function (value, oldValue, property) {
        console.log('change');
        console.log('event:', value);
        console.log('scope:', $scope[property]);
        console.log('old:  ', oldValue);
        console.log('---');
    };

    $scope.blur = function (value, property, component) {
        var eventName = 'blur ' + property;
        console.log(eventName);
        console.log('event:', value);
        console.log('scope:', $scope[property]);
        console.log('---');
    };

    $scope.focus = function (value, property, component) {
        var eventName = 'focus ' + property;
        console.log(eventName);
        console.log('event:', value);
        console.log('scope:', $scope[property]);
        console.log('---');
    };

    // Test placeholder in AJAX mode.
    // $timeout(function () {
    //     $scope.port10 = null;
    // }, 2000);
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
    //     $scope.port8Component.mode('add');
    // }, 5000);
    //
    // $timeout(function() {
    //     $scope.port8Component.mode('select');
    // }, 10000);
    //
    // $timeout(function() {
    //     $scope.port8Component.mode('add');
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