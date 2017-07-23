angular.module('app.controllers').controller('gridPageController', gridPageController);

function gridPageController($scope) {
    $scope.orderBy1 = '-eta';
    $scope.orderBy2 = '-eta';
    $scope.das = [{
        vessel: 'Densa Felcon',
        operation: 'Discharging',
        commodity: 'Grains',
        eta: '2016-12-25',
        status: 'Appointment accepted',
        total: 36483.27
    }, {
        vessel: 'Bertina',
        operation: 'Loading',
        commodity: 'Wheat',
        eta: '2016-07-22',
        status: 'Appointment accepted, PDA approval completed',
        total: 25990.20
    }, {
        vessel: 'Alpine Alaska',
        operation: 'Discharging',
        commodity: 'Coal',
        eta: '2016-02-12',
        status: 'Appointment accepted, PDA approval completed',
        total: 40000
    }, {
        vessel: 'Alpine Alaska',
        operation: 'Discharging',
        commodity: 'Coal',
        eta: '2016-02-12',
        status: 'Appointment accepted, PDA approval completed',
        total: 50000
    }, {
        vessel: 'Alpine Alaska',
        operation: 'Discharging',
        commodity: 'Coal',
        eta: '2016-02-12',
        status: 'Appointment accepted, PDA approval completed',
        total: 30000
    }];
}