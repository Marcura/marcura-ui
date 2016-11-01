angular.module('app.controllers').controller('textAreaPageController', textAreaPageController);

function textAreaPageController($scope, $timeout, $interval) {
    $scope.text1 = 'Sweet, thanks for posting! Just wanted to add that I was having an issue where removing \
lines of text wouldnt decrease the height enough (2px at a time, possibly related to using bootstrap). \
I fixed this by setting element[0].style.height in the resize function to 1px first, then setting it to \
the scrollHeight. Sweet, thanks for posting! Just wanted to add that I was having an issue where removing \
lines of text wouldnt decrease the height enough (2px at a time, possibly related to using bootstrap). \
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

    $scope.change1 = function (text) {
        console.log('change');
        console.log('event:', text);
        console.log('scope:', $scope.text1);
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
