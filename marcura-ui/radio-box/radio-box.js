angular.module('marcuraUI.components').directive('maRadioBox', [function() {
    return {
        restrict: 'E',
        scope: {
            text: '@',
            value: '=',
            selectedValue: '=',
            isDisabled: '=',
            change: '&',
            size: '@'
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-radio-box{{cssClass}}"\
                ng-click="onChange()"\
                ng-class="{\
                    \'ma-is-checked\': value === selectedValue,\
                    \'ma-radio-box-is-disabled\': isDisabled,\
                    \'ma-radio-box-has-text\': hasText,\
                }">\
                <span class="ma-radio-box-text">{{text || \'&nbsp;\'}}</span>\
                <div class="ma-radio-box-inner"></div>\
                <i class="ma-radio-box-icon" ng-show="value === selectedValue"></i>\
            </div>';

            return html;
        },
        link: function(scope) {
            scope._size = scope.size ? scope.size : 'xs';
            scope.cssClass = ' ma-radio-box-' + scope._size;
            scope.hasText = scope.text ? true : false;

            scope.onChange = function() {
                if (!scope.isDisabled) {
                    scope.selectedValue = scope.value;

                    scope.change({
                        value: scope.value
                    });
                }
            };
        }
    };
}]);
