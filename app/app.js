angular.module('app.controllers', []);

var app = angular.module('app', [
    'ui.router',
    'marcuraUI',
    'app.controllers'
]);

app.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'home/home.html',
            controller: 'homeController'
        })
        .state('button', {
            url: '/button',
            templateUrl: 'button-page/button-page.html',
            controller: 'buttonPageController'
        })
        .state('date-box', {
            url: '/date-box',
            templateUrl: 'date-box-page/date-box-page.html',
            controller: 'dateBoxPageController'
        })
        .state('side-menu', {
            url: '/side-menu',
            templateUrl: 'side-menu-page/side-menu-page.html',
            controller: 'sideMenuPageController'
        })
        .state('tabs', {
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
            url: '/tabs/:id/payments',
            templateUrl: 'tabs-page/tabs-page.html',
            controller: 'tabsPageController'
        });
}]);
