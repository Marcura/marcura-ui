angular.module('app.controllers').controller('modalPageController', modalPageController);

function modalPageController($scope, $modal) {
    $scope.openModal = function() {
        $modal.open({
            templateUrl: 'modal-page/modal/modal.html',
            controller: 'modalController',
            size: 'md'
        });
    }
}
