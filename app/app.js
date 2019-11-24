angular.module('app.controllers', []);
angular.module('app.services', []);

var app = angular.module('app', [
    'ui.router',
    'ngSanitize',
    'marcuraUI',
    'app.services',
    'app.controllers'
]);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $stateProvider.state({
        name: 'home',
        url: '/home',
        templateUrl: 'home/home.html',
        controller: 'homeController'
    });

    $stateProvider.state({
        name: 'button',
        url: '/button',
        templateUrl: 'button-page/button-page.html',
        controller: 'buttonPageController'
    });

    $stateProvider.state({
        name: 'message',
        url: '/message',
        templateUrl: 'message-page/message-page.html',
        controller: 'messagePageController'
    });

    $stateProvider.state({
        name: 'dateBox',
        url: '/date-box',
        templateUrl: 'date-box-page/date-box-page.html',
        controller: 'dateBoxPageController'
    });

    $stateProvider.state({
        name: 'multiCheckBox',
        url: '/multi-check-box',
        templateUrl: 'multi-check-box-page/multi-check-box-page.html',
        controller: 'multiCheckBoxPageController'
    });

    $stateProvider.state({
        name: 'grid',
        url: '/grid',
        templateUrl: 'grid-page/grid-page.html',
        controller: 'gridPageController'
    });

    $stateProvider.state({
        name: 'tabs',
        url: '/tabs',
        templateUrl: 'tabs-page/tabs-page.html',
        controller: 'tabsPageController'
    })
        .state({
            name: 'tabs.appointmentLetter',
            url: '/:id/appointment-letter',
            templateUrl: 'tabs-page/tabs-page.html',
            controller: 'tabsPageController'
        })
        .state({
            name: 'tabs.da',
            url: '/:id/da',
            templateUrl: 'tabs-page/tabs-page.html',
            controller: 'tabsPageController'
        })
        .state({
            name: 'tabs.payments',
            url: '/payments',
            templateUrl: 'tabs-page/tabs-page.html',
            controller: 'tabsPageController'
        });

    $stateProvider.state({
        name: 'progress',
        url: '/progress',
        templateUrl: 'progress-page/progress-page.html',
        controller: 'progressPageController'
    });

    $stateProvider.state({
        name: 'textBox',
        url: '/text-box',
        templateUrl: 'text-box-page/text-box-page.html',
        controller: 'textBoxPageController'
    });

    $stateProvider.state({
        name: 'selectBox',
        url: '/select-box',
        templateUrl: 'select-box-page/select-box-page.html',
        controller: 'selectBoxPageController'
    });

    $stateProvider.state({
        name: 'checkBox',
        url: '/check-box',
        templateUrl: 'check-box-page/check-box-page.html',
        controller: 'checkBoxPageController'
    });

    $stateProvider.state({
        name: 'radioBox',
        url: '/radio-box',
        templateUrl: 'radio-box-page/radio-box-page.html',
        controller: 'radioBoxPageController'
    });

    $stateProvider.state({
        name: 'radioButton',
        url: '/radio-button',
        templateUrl: 'radio-button-page/radio-button-page.html',
        controller: 'radioButtonPageController'
    });

    $stateProvider.state({
        name: 'textArea',
        url: '/text-area',
        templateUrl: 'text-area-page/text-area-page.html',
        controller: 'textAreaPageController'
    });

    $stateProvider.state({
        name: 'htmlArea',
        url: '/html-area',
        templateUrl: 'html-area-page/html-area-page.html',
        controller: 'htmlAreaPageController'
    });

    $stateProvider.state({
        name: 'pager',
        url: '/pager',
        templateUrl: 'pager-page/pager-page.html',
        controller: 'pagerPageController'
    });

    $stateProvider.state({
        name: 'label',
        url: '/label',
        templateUrl: 'label-page/label-page.html',
        controller: 'labelPageController'
    });

    $stateProvider.state({
        name: 'spinner',
        url: '/spinner',
        templateUrl: 'spinner-page/spinner-page.html',
        controller: 'spinnerPageController'
    });

    $stateProvider.state({
        name: 'tooltip',
        url: '/tooltip',
        templateUrl: 'tooltip-page/tooltip-page.html',
        controller: 'tooltipPageController'
    });

    $urlRouterProvider.otherwise('/home');
});