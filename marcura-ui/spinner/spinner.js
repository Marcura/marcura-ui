angular.module('marcuraUI.components').directive('maSpinner', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            isVisible: '=',
            size: '@',
            position: '@'
        },
        replace: true,
        template: function () {
            var html = '\
                <div class="ma-spinner{{cssClass}}" ng-show="isVisible">\
                    <div class="ma-pace">\
                        <div class="ma-pace-activity"></div>\
                    </div>\
                </div>';

            return html;
        },
        link: function (scope) {
            var size = scope.size ? scope.size : 'xs',
                position = scope.position ? scope.position : 'center';
            scope.cssClass = ' ma-spinner-' + size + ' ma-spinner-' + position;
        }
    };
}]);