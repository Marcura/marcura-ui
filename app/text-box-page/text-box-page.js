angular.module('app.controllers').controller('textBoxPageController', textBoxPageController);

function textBoxPageController($scope) {
    $scope.text3 = '';
    $scope.text4 = '';
    $scope.text5 = '';
    $scope.text7 = 'Vladivostok';
    $scope.number1 = 4500;
    $scope.number2 = 2500.47;
    $scope.number2Min = 1000.50;
    $scope.number2Max = 5000.50;

    $scope.changeNumber3 = function (value, oldValue) {
        console.log('change');
        console.log('event:', value);
        console.log('scope:', $scope.number3);
        console.log('event old:', oldValue);
        console.log('---');
    };

    $scope.focusNumber3 = function (value) {
        console.log('focus');
        console.log('event:', value);
        console.log('scope:', $scope.number3);
        console.log('---');
    };

    $scope.blurNumber3 = function (value, oldValue, hasChanged) {
        console.log('blur');
        console.log('event:', value);
        console.log('scope:', $scope.number3);
        console.log('event old:', oldValue);
        console.log('hasChanged:', hasChanged);
        console.log('---');
    };

    $scope.change1 = function (text, oldText) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text1);
        console.log('event old:', oldText);
        console.log('---');
    };

    $scope.blur1 = function (text, oldText, hasChanged) {
        console.log('blur');
        console.log('event:', text);
        console.log('scope:', $scope.text1);
        console.log('event old:', oldText);
        console.log('hasChanged:', hasChanged);
        console.log('---');
    };

    $scope.focus1 = function (text) {
        console.log('focus');
        console.log('event:', text);
        console.log('scope:', $scope.text1);
        console.log('---');
    };

    $scope.change3 = function (text) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text3);
        console.log('---');
    };

    $scope.change4 = function (text, oldText) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text4);
        console.log('event old:', oldText);
        console.log('---');
    };

    $scope.change6 = function (text) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text6);
        console.log('---');
    };

    $scope.change7 = function (text, oldText) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text7);
        console.log('event old:', oldText);
        console.log('---');
    };

    $scope.focus7 = function (text) {
        console.log('focus');
        console.log('event:', text);
        console.log('scope:', $scope.text7);
        console.log('---');
    };

    $scope.blur7 = function (text, oldText) {
        console.log('blur');
        console.log('event:', text);
        console.log('scope:', $scope.text7);
        console.log('event old:', oldText);
        console.log('---');
    };
}
