angular.module('app.controllers').controller('gridPageController', gridPageController);

function gridPageController($scope) {
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
    $scope.orderedBy = '-eta';
    $scope.orderDirection = 'desc';

    $scope.changeOrder = function(order) {
        if (order.charAt(0) === '-') {
            if ($scope.orderedBy !== order) {
                $scope.orderDirection = 'desc';
                $scope.orderedBy = order;
            } else {
                $scope.orderDirection = 'asc';
                $scope.orderedBy = order.substr(1);
            }
        } else {
            if ($scope.orderedBy !== order) {
                $scope.orderDirection = 'asc';
                $scope.orderedBy = order;
            } else {
                $scope.orderDirection = 'desc';
                $scope.orderedBy = '-' + order;
            }
        }
    };
}
