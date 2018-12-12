angular.module('app.controllers', []);
angular.module('app.services', []);

var app = angular.module('app', [
    'ui.router',
    'ngSanitize',
    'marcuraUI',
    'app.services',
    'app.controllers'
]);

app.config(function ($stateProvider, $urlRouterProvider) {
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

    $stateProvider.state('message', {
        url: '/message',
        templateUrl: 'message-page/message-page.html',
        controller: 'messagePageController'
    });

    $stateProvider.state('date-box', {
        url: '/date-box',
        templateUrl: 'date-box-page/date-box-page.html',
        controller: 'dateBoxPageController'
    });

    $stateProvider.state('multi-check-box', {
        url: '/multi-check-box',
        templateUrl: 'multi-check-box-page/multi-check-box-page.html',
        controller: 'multiCheckBoxPageController'
    });

    $stateProvider.state('grid', {
        url: '/grid',
        templateUrl: 'grid-page/grid-page.html',
        controller: 'gridPageController'
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

    $stateProvider.state('radio-button', {
        url: '/radio-button',
        templateUrl: 'radio-button-page/radio-button-page.html',
        controller: 'radioButtonPageController'
    });

    $stateProvider.state('text-area', {
        url: '/text-area',
        templateUrl: 'text-area-page/text-area-page.html',
        controller: 'textAreaPageController'
    });

    $stateProvider.state('html-area', {
        url: '/html-area',
        templateUrl: 'html-area-page/html-area-page.html',
        controller: 'htmlAreaPageController'
    });

    $stateProvider.state('pager', {
        url: '/pager',
        templateUrl: 'pager-page/pager-page.html',
        controller: 'pagerPageController'
    });

    $stateProvider.state('label', {
        url: '/label',
        templateUrl: 'label-page/label-page.html',
        controller: 'labelPageController'
    });

    $stateProvider.state('spinner', {
        url: '/spinner',
        templateUrl: 'spinner-page/spinner-page.html',
        controller: 'spinnerPageController'
    });

    $stateProvider.state('tooltip', {
        url: '/tooltip',
        templateUrl: 'tooltip-page/tooltip-page.html',
        controller: 'tooltipPageController'
    });

    $urlRouterProvider.otherwise('/home');
});