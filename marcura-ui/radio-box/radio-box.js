angular.module('marcuraUI.components').directive('maRadioBox', ['maHelper', '$timeout', '$sce', function(maHelper, $timeout, $sce) {
    return {
        restrict: 'E',
        scope: {
            text: '=',
            value: '=',
            selectedValue: '=',
            isDisabled: '=',
            change: '&',
            size: '@',
            comparer: '='
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
                <span class="ma-radio-box-text" ng-bind-html="_text"></span>\
                <div class="ma-radio-box-inner"></div>\
                <i class="ma-radio-box-icon" ng-show="isChecked()"></i>\
            </div>';

            return html;
        },
        link: function(scope, element, attributes) {
            var valuePropertyParts = null,
                setTabindex = function() {
                    if (scope.isDisabled) {
                        element.removeAttr('tabindex');
                    } else {
                        element.attr('tabindex', '0');
                    }
                },
                getControllerScope = function() {
                    var controllerScope = null,
                        initialScope = scope.$parent,
                        property = attributes.selectedValue;

                    // In case of a nested property binding like 'company.port.id'.
                    if (property.indexOf('.') !== -1) {
                        valuePropertyParts = property.split('.');
                        property = valuePropertyParts[0];
                    }

                    while (initialScope && !controllerScope) {
                        if (initialScope.hasOwnProperty(property)) {
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
            scope._text = $sce.trustAsHtml(scope.text || '&nbsp;');

            scope.isChecked = function() {
                if (scope.comparer) {
                    return scope.comparer(scope.value, scope.selectedValue);
                }

                return JSON.stringify(scope.value) === JSON.stringify(scope.selectedValue);
            };

            scope.onChange = function() {
                if (!scope.isDisabled) {
                    var valueProperty,
                        oldValue = scope.selectedValue;
                    scope.selectedValue = scope.value;

                    if (controllerScope && valuePropertyParts) {
                        // When the component is inside ng-repeat normal binding like
                        // selected-value="selectedPort" won't work.
                        // This is to workaround the problem.
                        valueProperty = controllerScope;

                        // Handle nested property binding.
                        for (var i = 0; i < valuePropertyParts.length; i++) {
                            valueProperty = valueProperty[valuePropertyParts[i]];
                        }

                        valueProperty = scope.value;
                    } else {
                        valueProperty = controllerScope[attributes.selectedValue];
                        controllerScope[attributes.selectedValue] = scope.value;
                    }

                    $timeout(function() {
                        scope.change({
                            value: scope.value,
                            oldValue: oldValue
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
                if (event.keyCode === maHelper.keyCode.space) {
                    // Prevent page from scrolling down.
                    event.preventDefault();

                    if (!scope.isDisabled && !scope.isChecked()) {
                        scope.onChange();
                    }
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
