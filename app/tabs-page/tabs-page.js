angular.module('app.controllers').controller('tabsPageController', tabsPageController);

function tabsPageController($scope) {
    $scope.items = [{
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

    $scope.select = function(item) {
        console.log('select:', item);
    };
}
