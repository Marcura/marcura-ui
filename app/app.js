angular.module('app.controllers', []);

var app = angular.module('app', [
    'ui.router',
    'marcuraUI',
    'app.controllers'
]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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

    $urlRouterProvider.otherwise('/home');
}]);
