angular.module('marcuraUI.components').directive('maLabel', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            for: '@',
            isRequired: '='
        },
        replace: true,
        template: function () {
            var html = '\
                <div class="ma-label" ng-class="{\
                    \'ma-label-is-required\': isRequired,\
                    \'ma-label-has-content\': hasContent\
                }">\
                    <label class="ma-label-text" for="{{for}}"><ng-transclude></ng-transclude></label><!--\
                    --><div class="ma-label-star" ng-if="isRequired">&nbsp;</div>\
                    <i class="fa fa-star" ng-if="isRequired"></i>\
                </div>';

            return html;
        },
        link: function (scope, element) {
            scope.hasContent = element.find('span').contents().length > 0;
        }
    };
}]);