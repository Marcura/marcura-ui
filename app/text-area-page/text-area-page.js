angular.module('app.controllers').controller('textAreaPageController', textAreaPageController);

function textAreaPageController($scope, $timeout, $interval) {
    $scope.text1 = 'Sweet, thanks for posting! Just wanted to add that I was having an issue where removing \
lines of text wouldnt decrease the height enough. \
I fixed this by setting element[0].style.height in the resize function to 1px first, then setting it to \
the scrollHeight. Sweet, thanks for posting! Just wanted to add that I was having an issue where removing \
lines of text wouldnt decrease the height enough. \
I fixed this by setting element[0].style.height in the resize function to 1px first, then setting it to the scrollHeight.';
    $scope.text2 = $scope.text1;
    $scope.text3 = $scope.text1;
    $scope.text4 = $scope.text1;
    $scope.text5 = $scope.text1;
    $scope.text6 = 'Sweet, thanks for posting!';
    $scope.textBox7 = {};
    // $scope.text7 = 'Sweet, thanks for posting!';
    $scope.showTextArea = false;
    $scope.date1 = '2016-07-25T00:00:00Z';

    $scope.change = function (value, oldText, property) {
        console.log('change');
        console.log('event:', value);
        console.log('scope:', $scope[property]);
        console.log('event old:', oldText);
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

    $scope.focus = function (value, property) {
        console.log('focus');
        console.log('event:', value);
        console.log('scope:', $scope[property]);
        console.log('');
    };

    // $scope.$watch('text1', function(newValue, oldValue) {
    //     console.log('text1:', newValue);
    // });

    // $timeout(function() {
    //     $scope.text7 = '';
    //     // $scope.textBox7.isValid()
    // }, 3000);

    // $interval(function() {
    //     console.log('isValid:', $scope.textBox7.isValid());
    // }, 2000);
}