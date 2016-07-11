angular.module('app.controllers').controller('dateBoxController', dateBoxController);

function dateBoxController($scope) {
    $scope.dateChange = function(date) {
        console.log('date:', date);
    };
}
