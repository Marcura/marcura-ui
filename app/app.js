angular.module('app.controllers', []);
angular.module('app.services', []);

var app = angular.module('app', [
    'ui.bootstrap',
    'ui.router',
    'ui.select2',
    'ui.select',
    'ngSanitize',
    'marcuraUI',
    'app.services',
    'app.controllers',
    'ngMockE2E'
]);

app.config(function($stateProvider, $urlRouterProvider, maDateBoxConfigurationProvider) {
    maDateBoxConfigurationProvider.displayFormat = 'dd MMM yy';

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'home/home.html',
        controller: 'homeController'
    });

    $stateProvider.state('button', {
        url: '/button',
        templateUrl: 'button-page/button-page.html',
        controller: 'buttonPageController'
    });

    $stateProvider.state('date-box', {
        url: '/date-box',
        templateUrl: 'date-box-page/date-box-page.html',
        controller: 'dateBoxPageController'
    });

    $stateProvider.state('grid', {
        url: '/grid',
        templateUrl: 'grid-page/grid-page.html',
        controller: 'gridPageController'
    });

    $stateProvider.state('side-menu', {
        url: '/side-menu',
        templateUrl: 'side-menu-page/side-menu-page.html',
        controller: 'sideMenuPageController'
    });

    $stateProvider.state('side-menu.das', {
            url: '/side-menu/:id/das',
            templateUrl: 'side-menu-page/side-menu-page.html',
            controller: 'sideMenuPageController'
        })
        .state('side-menu.payments', {
            url: '/side-menu/:id/payments',
            templateUrl: 'side-menu-page/side-menu-page.html',
            controller: 'sideMenuPageController'
        })
        .state('side-menu.port-information', {
            url: '/side-menu/port-information',
            templateUrl: 'side-menu-page/side-menu-page.html',
            controller: 'sideMenuPageController'
        });

    $stateProvider.state('tabs', {
            url: '/tabs',
            templateUrl: 'tabs-page/tabs-page.html',
            controller: 'tabsPageController'
        })
        .state('tabs.appointment-letter', {
            url: '/tabs/:id/appointment-letter',
            templateUrl: 'tabs-page/tabs-page.html',
            controller: 'tabsPageController'
        })
        .state('tabs.da', {
            url: '/tabs/:id/da',
            templateUrl: 'tabs-page/tabs-page.html',
            controller: 'tabsPageController'
        })
        .state('tabs.payments', {
            url: '/tabs/payments',
            templateUrl: 'tabs-page/tabs-page.html',
            controller: 'tabsPageController'
        });

    $stateProvider.state('progress', {
        url: '/progress',
        templateUrl: 'progress-page/progress-page.html',
        controller: 'progressPageController'
    });

    $stateProvider.state('text-box', {
        url: '/text-box',
        templateUrl: 'text-box-page/text-box-page.html',
        controller: 'textBoxPageController'
    });

    $stateProvider.state('select-box', {
        url: '/select-box',
        templateUrl: 'select-box-page/select-box-page.html',
        controller: 'selectBoxPageController'
    });

    $stateProvider.state('ui-select', {
        url: '/ui-select',
        templateUrl: 'ui-select-page/ui-select-page.html',
        controller: 'uiSelectPageController'
    });

    $stateProvider.state('costs-grid', {
        url: '/costs-grid',
        templateUrl: 'costs-grid-page/costs-grid-page.html',
        controller: 'costsGridPageController'
    });

    $stateProvider.state('check-box', {
        url: '/check-box',
        templateUrl: 'check-box-page/check-box-page.html',
        controller: 'checkBoxPageController'
    });

    $stateProvider.state('radio-box', {
        url: '/radio-box',
        templateUrl: 'radio-box-page/radio-box-page.html',
        controller: 'radioBoxPageController'
    });

    $stateProvider.state('reset-value', {
        url: '/reset-value',
        templateUrl: 'reset-value-page/reset-value-page.html',
        controller: 'resetValuePageController'
    });

    $stateProvider.state('text-area', {
        url: '/text-area',
        templateUrl: 'text-area-page/text-area-page.html',
        controller: 'textAreaPageController'
    });

    $stateProvider.state('form', {
        url: '/form',
        templateUrl: 'form-page/form-page.html',
        controller: 'formPageController'
    });

    $stateProvider.state('modal', {
        url: '/modal',
        templateUrl: 'modal-page/modal-page.html',
        controller: 'modalPageController'
    });

    $urlRouterProvider.otherwise('/home');
});
