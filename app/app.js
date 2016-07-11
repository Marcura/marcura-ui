angular.module('app.controllers', []);

var app = angular.module('app', [
    'ngRoute',
    'marcuraUI',
    'app.controllers'
]);

app.config(['$routeProvider', '$httpProvider',
    function($routeProvider, $httpProvider) {
        $routeProvider.
        when('/button', {
            templateUrl: 'button/button.html',
            controller: 'buttonController'
        }).
        when('/date-box', {
            templateUrl: 'date-box/date-box.html',
            controller: 'dateBoxController'
        }).
        when('/home', {
            templateUrl: 'home/home.html',
            controller: 'homeController'
        }).
        otherwise({
            redirectTo: '/home'
        });
    }
]);
