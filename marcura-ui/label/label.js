angular.module('marcuraUI.components').directive('maLabel', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            for: '@'
        },
        replace: true,
        template: function () {
            var html = '\
                <div class="ma-label" ng-class="{\
                    \'ma-label-has-content\': hasContent\
                }">\
                    <label class="ma-label-text" for="{{::for}}"><ng-transclude></ng-transclude></label><!--\
                    --><div class="ma-label-star">&nbsp;<i class="fa fa-star"></i></div><!--\
                    --><div class="ma-label-warning">&nbsp;\
                    <i class="fa fa-exclamation-triangle"></i></div>\
                </div>';

            return html;
        },
        link: function (scope, element) {
            scope.hasContent = element.find('span').contents().length > 0;
        }
    };
}]);