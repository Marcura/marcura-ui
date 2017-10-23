angular.module('marcuraUI.components').directive('maLabel', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            cutOverflow: '=',
            for: '@',
            isRequired: '='
        },
        replace: true,
        template: function () {
            var html = '\
                <div class="ma-label" ng-class="{\
                    \'ma-label-is-required\': isRequired,\
                    \'ma-label-has-content\': hasContent,\
                    \'ma-label-cut-overflow\': cutOverflow\
                }">\
                    <label class="ma-label-text" for="{{for}}"><ng-transclude></ng-transclude></label><!--\
                    --><div class="ma-label-star" ng-if="isRequired">&nbsp;<i class="fa fa-star"></i></div>\
                </div>';

            return html;
        },
        link: function (scope, element) {
            scope.hasContent = element.find('span').contents().length > 0;
        }
    };
}]);