angular.module('app.controllers').controller('gridPageController', gridPageController);

function gridPageController($scope, maHelper) {
    $scope.maHelper = maHelper;
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
        total: 50000
    }];
    $scope.sorting = {
        orderedBy: '-eta',
        direction: 'desc'
    };
}
