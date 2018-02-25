angular.module('app.controllers').controller('tooltipPageController', tooltipPageController);

function tooltipPageController($scope) {
    $scope.canClose = true;
    $scope.tooltipComponent = {};

    $scope.show = function () {
        $scope.tooltipComponent.show();
    };

    $scope.hide = function () {
        $scope.tooltipComponent.hide();
    };

    $scope.close = function () {
        $scope.canClose = !$scope.canClose;
    };
}