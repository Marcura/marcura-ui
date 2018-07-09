angular.module('app.controllers').controller('htmlAreaPageController', htmlAreaPageController);

function htmlAreaPageController($scope, $timeout) {
    $scope.text1 = '\
        Text <strong>bold</strong><br>\
        <em>italic</em><br>\
        <underline style="text-decoration: underline;">unde</underline>rline\
    ';

    $scope.focus = function (value, property) {
        console.log('focus');
        console.log('event:', value);
        console.log('scope:', $scope[property]);
        console.log('');
    };

    $scope.blur = function (value, oldText, hasChanged, property) {
        console.log('blur');
        console.log('event:', value);
        console.log('scope:', $scope[property]);
        console.log('event old:', oldText);
        console.log('hasChanged:', hasChanged);
        console.log('');
    };

    $scope.change = function (value, property) {
        console.log('change');
        console.log('event:', value);
        console.log('scope:', $scope[property]);
        console.log('');
    };
}