angular.module('app.controllers').controller('homeController', homeController);

function homeController($scope, api) {
    api.ports().then(function(ports) {
        console.log('ports:', ports);
    });
}
