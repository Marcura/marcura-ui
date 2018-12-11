angular.module('marcuraUI.components').directive('maCheckBox', ['MaHelper', '$timeout', '$parse', 'MaValidators', function (MaHelper, $timeout, $parse, MaValidators) {
    return {
        restrict: 'E',
        scope: {
            text: '@',
            size: '@',
            rtl: '@',
            change: '&',
            value: '=',
            isDisabled: '=',
            isRequired: '=',
            validators: '=',
            instance: '='
        },
        replace: true,
        template: function (element, attributes) {
            var isRtl = attributes.rtl === 'true',
                size = attributes.size || 'xs',
                hasText = !!attributes.text,
                cssClass = 'ma-check-box ma-check-box-' + size;

            if (isRtl) {
                cssClass += ' ma-check-box-rtl';
            }

            if (hasText) {
                cssClass += ' ma-check-box-has-text';
            }

            var html = '\
                <div class="'+ cssClass + '"\
                    ng-focus="onFocus()"\
                    ng-blur="onBlur()"\
                    ng-keypress="onKeypress($event)"\
                    ng-click="onChange()"\
                    ng-class="{\
                        \'ma-check-box-is-checked\': value === true,\
                        \'ma-check-box-is-disabled\': isDisabled,\
                        \'ma-check-box-is-focused\': isFocused,\
                        \'ma-check-box-is-invalid\': !isValid,\
                        \'ma-check-box-is-touched\': isTouched\
                    }">\
                    <span class="ma-check-box-text">{{text || \'&nbsp;\'}}</span>\
                    <div class="ma-check-box-inner"></div>\
                    <i class="ma-check-box-icon fa fa-check"></i>\
                </div>';

            return html;
        },
        link: function (scope, element, attributes) {
            var validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false;

            var setTabindex = function () {
                if (scope.isDisabled) {
                    element.removeAttr('tabindex');
                } else {
                    element.attr('tabindex', '0');
                }
            };

            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

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
        }
    };
}]);