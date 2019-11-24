angular.module('app.controllers').controller('tabsPageController', tabsPageController);

function tabsPageController($scope) {
    $scope.items1 = [{
        text: 'Appointment Letter',
        isSelected: true
    }, {
        text: 'Disbursement Account',
        isDisabled: true
    }, {
        text: 'Payments'
    }, {
        text: 'History'
    }];
    $scope.items2 = [{
        text: 'Appointment Letter',
        state: {
            name: 'tabs.appointmentLetter',
            parameters: {
                id: 1
            }
        }
    }, {
        text: 'Disbursement Account',
        isDisabled: true,
        state: {
            name: 'tabs.da',
            parameters: {
                id: 2
            }
        }
    }, {
        text: 'Payments',
        state: {
            name: 'tabs.payments'
        }
    }, {
        text: 'History'
    }];

    $scope.select = function (item) {
        console.log('select:', item);
    };
}