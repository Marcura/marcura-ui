angular.module('app.controllers', []);

var app = angular.module('app', [
    'ngRoute',
    'marcuraUI',
    'app.controllers'
]);

app.config(['$routeProvider', '$httpProvider',
    function($routeProvider, $httpProvider) {
        $routeProvider.
        when('/home', {
            templateUrl: 'home/home.html',
            controller: 'homeController'
        }).
        when('/date-box', {
            templateUrl: 'date-box-page/date-box-page.html',
            controller: 'dateBoxPageController'
        }).
        when('/side-menu', {
            templateUrl: 'side-menu-page/side-menu-page.html',
            controller: 'sideMenuPageController'
        }).
        otherwise({
            redirectTo: '/home'
        });
    }
]);
