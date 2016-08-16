angular.module('app.controllers').controller('textAreaPageController', textAreaPageController);

function textAreaPageController($scope) {
    $scope.text1 = 'Sweet, thanks for posting! Just wanted to add that I was having an issue where removing \
lines of text wouldnt decrease the height enough (2px at a time, possibly related to using bootstrap). \
I fixed this by setting element[0].style.height in the resize function to 1px first, then setting it to \
the scrollHeight. Sweet, thanks for posting! Just wanted to add that I was having an issue where removing \
lines of text wouldnt decrease the height enough (2px at a time, possibly related to using bootstrap). \
I fixed this by setting element[0].style.height in the resize function to 1px first, then setting it to the scrollHeight.';
    $scope.text2 = $scope.text1;
    $scope.text3 = $scope.text1;
    $scope.text4 = $scope.text1;

    $scope.$watch('text', function(newValue, oldValue) {
        console.log('new:', newValue);
        console.log('old:', oldValue);
    });
}
