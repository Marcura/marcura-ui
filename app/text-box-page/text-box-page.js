angular.module('app.controllers').controller('textBoxPageController', textBoxPageController);

function textBoxPageController($scope) {
    $scope.text3 = '';
    $scope.text4 = '';
    $scope.text5 = '';
    $scope.text7 = 'Vladivostok';
    $scope.text10 = 'Vladivostok';
    $scope.text10Min = 3;
    $scope.text10Max = 20;
    $scope.number1 = 4500;
    $scope.number2 = 2500.47;
    $scope.number2Min = 1000.50;
    $scope.number2Max = 5000.50;

    $scope.change = function (value, oldValue, property) {
        console.log('change');
        console.log('new', value);
        console.log('change', value, ' scope: ', $scope[property], ' old:', oldValue);
        console.log('---');
    };

    $scope.blur = function (value, oldValue, hasChanged, property) {
        console.log('blur   - event:', value, ' scope: ', $scope[property], ' old:', oldValue, ' changed:', hasChanged);
    };

    $scope.focus = function (value, property) {
        console.log('focus  - event:', value, ' scope: ', $scope[property]);
    };
}