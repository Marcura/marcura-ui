angular.module('marcuraUI.components').directive('maRadioBox', ['maHelper', '$timeout', function(maHelper, $timeout) {
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
                ng-focus="onFocus()"\
                ng-blur="onBlur()"\
                ng-keypress="onKeypress($event)"\
                ng-click="onChange()"\
                ng-class="{\
                    \'ma-radio-box-is-checked\': isChecked(),\
                    \'ma-radio-box-is-disabled\': isDisabled,\
                    \'ma-radio-box-has-text\': hasText,\
                    \'ma-radio-box-is-focused\': isFocused\
                }">\
                <span class="ma-radio-box-text">{{text || \'&nbsp;\'}}</span>\
                <div class="ma-radio-box-inner"></div>\
                <i class="ma-radio-box-icon" ng-show="isChecked()"></i>\
            </div>';

            return html;
        },
        link: function(scope, element, attributes) {
            var setTabindex = function() {
                    if (scope.isDisabled) {
                        element.removeAttr('tabindex');
                    } else {
                        element.attr('tabindex', '0');
                    }
                },
                getControllerScope = function() {
                    var controllerScope = null,
                        initialScope = scope.$parent;

                    while (initialScope && !controllerScope) {
                        if (initialScope.hasOwnProperty(attributes.selectedValue)) {
                            controllerScope = initialScope;
                        } else {
                            initialScope = initialScope.$parent;
                        }
                    }

                    return controllerScope;
                },
                controllerScope = getControllerScope();
                
            scope._size = scope.size ? scope.size : 'xs';
            scope.cssClass = ' ma-radio-box-' + scope._size;
            scope.hasText = scope.text ? true : false;
            scope.isFocused = false;

            scope.isChecked = function() {
                return JSON.stringify(scope.value) === JSON.stringify(scope.selectedValue);
            };

            scope.onChange = function() {
                if (!scope.isDisabled) {
                    scope.selectedValue = scope.value;

                    // This is to update correct scope value when the component is inside ng-repeat.
                    if (controllerScope) {
                        controllerScope[attributes.selectedValue] = scope.value;
                    }

                    $timeout(function() {
                        scope.change({
                            value: scope.value
                        });
                    });
                }
            };

            scope.onFocus = function() {
                if (!scope.isDisabled) {
                    scope.isFocused = true;
                }
            };

            scope.onBlur = function() {
                if (!scope.isDisabled) {
                    scope.isFocused = false;
                }
            };

            scope.onKeypress = function(event) {
                if (!scope.isDisabled && !scope.isChecked() && event.keyCode === maHelper.keyCode.space) {
                    scope.onChange();
                }
            };

            scope.$watch('isDisabled', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (newValue) {
                    scope.isFocused = false;
                }

                setTabindex();
            });

            setTabindex();
        }
    };
}]);
