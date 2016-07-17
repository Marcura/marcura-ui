angular.module('app.controllers').controller('sideMenuPageController', sideMenuPageController);

function sideMenuPageController($scope) {
    $scope.items1 = [{
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
    $scope.items2 = [{
        text: 'DAs',
        icon: 'list',
        new: 6,
        state: {
            name: 'side-menu.das',
            parameters: {
                id: 1
            }
        }
    }, {
        text: 'payments',
        icon: 'calendar',
        state: {
            name: 'side-menu.payments',
            parameters: {
                id: 2
            }
        }
    }, {
        text: 'port information',
        icon: 'anchor',
        state: {
            name: 'side-menu.port-information'
        }
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
