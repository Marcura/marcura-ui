angular.module('app.controllers').controller('selectBoxPageModalController', selectBoxPageModalController);

function selectBoxPageModalController($scope, ports) {
    $scope.ports = ports;
    $scope.port1 = null;

    $scope.change = function (value, oldValue, property) {
        console.log('change');
        // console.log('event:', value);
        // console.log('scope:', $scope[property]);
        // console.log('old:  ', oldValue);
        // console.log('---');
    };

    $scope.blur = function (value, property) {
        console.log('blur');
        // console.log('event:', value);
        // console.log('scope:', $scope[property]);
        // console.log('---');
    };

    $scope.focus = function (value, property) {
        console.log('focus');
        // console.log('event:', value);
        // console.log('scope:', $scope[property]);
        // console.log('---');
    };
}