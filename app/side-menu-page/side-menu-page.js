angular.module('app.controllers').controller('sideMenuPageController', sideMenuPageController);

function sideMenuPageController($scope) {
    $scope.items = [{
        text: 'DAs',
        icon: 'list',
        new: 6,
        isSelected: true
    }, {
        text: 'payments',
        icon: 'calendar'
    }, {
        text: 'port information',
        icon: 'anchor'
    }, {
        text: 'issue resolution',
        icon: 'comments'
    }, {
        text: 'settings',
        icon: 'cog',
        isDisabled: true
    }];

    $scope.select = function(item) {
        console.log('select:', item);
    };
}
