angular.module('app.controllers').controller('progressPageController', progressPageController);

function progressPageController($scope) {
    $scope.steps = [{
        text: 'Review Pro forma'
    }, {
        text: 'Bank Account'
    }, {
        text: 'Done'
    }];
    $scope.currentStep = 2;
}
