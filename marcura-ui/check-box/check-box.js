angular.module('marcuraUI.components').directive('maCheckBox', ['MaHelper', '$timeout', '$parse', 'MaValidators', function (MaHelper, $timeout, $parse, MaValidators) {
    return {
        restrict: 'E',
        scope: {
            text: '@',
            value: '=',
            isDisabled: '=',
            change: '&',
            size: '@',
            rtl: '=',
            isRequired: '=',
            validators: '=',
            instance: '=',
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-check-box{{cssClass}}"\
                ng-focus="onFocus()"\
                ng-blur="onBlur()"\
                ng-keypress="onKeypress($event)"\
                ng-click="onChange()"\
                ng-class="{\
                    \'ma-check-box-is-checked\': value === true,\
                    \'ma-check-box-is-disabled\': isDisabled,\
                    \'ma-check-box-rtl\': rtl,\
                    \'ma-check-box-is-focused\': isFocused,\
                    \'ma-check-box-is-invalid\': !isValid,\
                    \'ma-check-box-is-touched\': isTouched\
                }">\
                <span class="ma-check-box-text">{{text || \'&nbsp;\'}}</span>\
                <div class="ma-check-box-inner"></div>\
                <i class="ma-check-box-icon fa fa-check" ng-show="value === true"></i>\
            </div>';

            return html;
        },
        link: function (scope, element, attributes) {
            var validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                hasText = false;

            var setTabindex = function () {
                if (scope.isDisabled) {
                    element.removeAttr('tabindex');
                } else {
                    element.attr('tabindex', '0');
                }
            };

            scope._size = scope.size ? scope.size : 'xs';
            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

            var setHasText = function () {
                hasText = scope.text ? true : false;
            };

            var setCssClass = function () {
                var cssClass = ' ma-check-box-' + scope._size;

                // When angular-animate is enabled ng-class doesn't set has-text CSS class properly
                // for some reason. Thus we do it manually.
                if (hasText) {
                    cssClass += ' ma-check-box-has-text';
                }

                scope.cssClass = cssClass;
            };

            var getControllerScope = function () {
                var valuePropertyParts = null,
                    controllerScope = null,
                    initialScope = scope.$parent,
                    property = attributes.value;

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

                // Use parent scope by default if search is unsuccessful.
                return controllerScope || scope.$parent;
            };

            // When the component is inside ng-if, a normal binding like value="isEnabled" won't work,
            // as the value will be stored by Angular on ng-if scope.
            var controllerScope = getControllerScope();

            var validate = function () {
                scope.isValid = true;
                scope.isTouched = true;

                // Remove 'false' value for 'IsNotEmpty' to work correctly.
                var value = scope.value === false ? null : scope.value;

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        var validator = validators[i];

                        if (!validator.validate(validator.name === 'IsNotEmpty' ? value : scope.value)) {
                            scope.isValid = false;
                            break;
                        }
                    }
                }
            };

            scope.onChange = function () {
                if (scope.isDisabled) {
                    return;
                }

                // Handle nested properties or function calls with $parse service.
                // This is related to a case when the component is located inside ng-if,
                // but it works for other cases as well.
                var valueGetter = $parse(attributes.value),
                    valueSetter = valueGetter.assign,
                    value = !valueGetter(controllerScope);

                scope.value = value;
                valueSetter(controllerScope, value);
                validate();

                $timeout(function () {
                    scope.change({
                        maValue: scope.value
                    });
                });
            };

            scope.onFocus = function () {
                if (!scope.isDisabled) {
                    scope.isFocused = true;
                }
            };

            scope.onBlur = function () {
                if (scope.isDisabled) {
                    return;
                }

                scope.isFocused = false;
                validate();
            };

            scope.onKeypress = function (event) {
                if (event.keyCode === MaHelper.keyCode.space) {
                    // Prevent page from scrolling down.
                    event.preventDefault();

                    if (!scope.isDisabled) {
                        scope.onChange();
                    }
                }
            };

            scope.$watch('isDisabled', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (newValue) {
                    scope.isFocused = false;
                }

                setTabindex();
            });

            scope.$watch('text', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setHasText();
                setCssClass();
            });

            // Set up validators.
            for (var i = 0; i < validators.length; i++) {
                if (validators[i].name === 'IsNotEmpty') {
                    hasIsNotEmptyValidator = true;
                    break;
                }
            }

            if (!hasIsNotEmptyValidator && isRequired) {
                validators.unshift(MaValidators.isNotEmpty());
            }

            if (hasIsNotEmptyValidator) {
                isRequired = true;
            }

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isEditor = function () {
                    return true;
                };

                scope.instance.isValid = function () {
                    return scope.isValid;
                };

                scope.instance.validate = function () {
                    validate();
                };
            }

            setTabindex();
            setHasText();
            setCssClass();
        }
    };
}]);