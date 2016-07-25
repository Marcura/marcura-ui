angular.module('marcuraUI.components').directive('maCheckBox', [function() {
    return {
        restrict: 'E',
        scope: {
            text: '@',
            value: '=',
            isDisabled: '=',
            change: '&',
            size: '@',
            rtl: '='
        },
        replace: true,
        template: function($timeout) {
            var html = '\
            <div class="ma-check-box{{cssClass}}"\
                ng-click="onChange()"\
                ng-class="{\
                    \'ma-check-box-is-checked\': value === true,\
                    \'ma-check-box-is-disabled\': isDisabled,\
                    \'ma-check-box-has-text\': hasText,\
                    \'ma-check-box-rtl\': rtl\
                }">\
                <span class="ma-check-box-text">{{text || \'&nbsp;\'}}</span>\
                <i class="ma-check-box-icon fa fa-check" ng-show="value === true"></i>\
                <div class="ma-check-box-inner"></div>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            scope._size = scope.size ? scope.size : 'xs';
            scope.cssClass = ' ma-check-box-' + scope._size;
            scope.hasText = scope.text ? true : false;

            scope.onChange = function() {
                if (!scope.isDisabled) {
                    scope.value = !scope.value;

                    scope.change({
                        value: scope.value
                    });
                }
            };
        }
    };
}]);
