angular.module('app.controllers').controller('costsGridPageController', costsGridPageController);

function costsGridPageController($scope, helper) {
    $scope.costItems = helper.getCostItems();
}
