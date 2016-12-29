angular.module('app.controllers').controller('textBoxPageController', textBoxPageController);

function textBoxPageController($scope) {
    $scope.text1 = '';
    $scope.text3 = '';
    $scope.text4 = '';
    $scope.text5 = '';
    $scope.text7 = 'Vladivostok';

    $scope.change1 = function(text, oldText) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text1);
        console.log('event old:', oldText);
    };

    $scope.blur1 = function(text, oldText, hasChanged) {
        console.log('blur');
        console.log('event:', text);
        console.log('scope:', $scope.text1);
        console.log('event old:', oldText);
        console.log('hasChanged:', hasChanged);
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

    $scope.change4 = function(text, oldText) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text4);
        console.log('event old:', oldText);
    };

    $scope.change6 = function(text) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text6);
    };

    $scope.change7 = function(text, oldText) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text7);
        console.log('event old:', oldText);
        console.log('---');
    };

    $scope.focus7 = function(text) {
        console.log('focus');
        console.log('event:', text);
        console.log('scope:', $scope.text7);
        console.log('---');
    };

    $scope.blur7 = function(text, oldText) {
        console.log('blur');
        console.log('event:', text);
        console.log('scope:', $scope.text7);
        console.log('event old:', oldText);
        console.log('---');
    };
}
