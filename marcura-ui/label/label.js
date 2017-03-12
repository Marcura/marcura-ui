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
                <div class="ma-label">\
                    <div class="ma-label-inner">\
                        <label class="ma-label-text" for="{{for}}"><ng-transclude></ng-transclude></label>\
                        <div class="ma-label-star" ng-if="isRequired">*</div>\
                    </div>\
                </div>';

            return html;
        }
    };
}]);