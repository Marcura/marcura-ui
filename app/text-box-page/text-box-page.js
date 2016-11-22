angular.module('app.controllers').controller('textBoxPageController', textBoxPageController);

function textBoxPageController($scope) {
    $scope.text1 = '';
    $scope.text3 = '';
    $scope.text4 = '';

    $scope.change1 = function(text) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text1);
    };

    $scope.blur1 = function(text) {
        console.log('blur');
        console.log('event:', text);
        console.log('scope:', $scope.text1);
    };

    $scope.focus1 = function(text) {
        console.log('focus');
        console.log('event:', text);
        console.log('scope:', $scope.text1);
    };

    $scope.change3 = function(text) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text3);
    };
}
