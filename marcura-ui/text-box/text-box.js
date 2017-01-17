angular.module('marcuraUI.components').directive('maTextBox', ['$timeout', 'maHelper', 'maValidators', function($timeout, maHelper, maValidators) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@',
            value: '=',
            isDisabled: '=',
            isRequired: '=',
            validators: '=',
            instance: '=',
            change: '&',
            blur: '&',
            focus: '&',
            changeTimeout: '=',
            canReset: '=',
            placeholder: '@',
            hasShowPasswordButton: '=',
            trim: '='
        },
        replace: true,
        template: function(element, attributes) {
            var type = attributes.type === 'password' ? 'password' : 'text';

            var html = '\
            <div class="ma-text-box"\
                ng-class="{\
                    \'ma-text-box-is-disabled\': isDisabled,\
                    \'ma-text-box-is-focused\': isValueFocused,\
                    \'ma-text-box-is-invalid\': !isValid,\
                    \'ma-text-box-is-touched\': isTouched,\
                    \'ma-text-box-can-reset\': canReset,\
                    \'ma-text-box-is-reset-disabled\': canReset && !isDisabled && !isResetEnabled(),\
                    \'ma-text-box-can-toggle-password\': canTogglePassword,\
                    \'ma-text-box-is-toggle-password-disabled\': canTogglePassword && !isDisabled && !isTogglePasswordEnabled()\
                }">\
                <input class="ma-text-box-value" type="' + type + '" id="{{id}}"\
                    type="text"\
                    autocomplete="off"\
                    placeholder="{{placeholder}}"\
                    ng-focus="onFocus(\'value\')"\
                    ng-keydown="onKeydown($event)"\
                    ng-disabled="isDisabled"/>\
                <ma-button class="ma-button-toggle-password"\
                    ng-show="canTogglePassword" size="xs" modifier="simple"\
                    right-icon="{{isPasswordVisible ? \'eye-slash\' : \'eye\'}}"\
                    click="togglePassword()"\
                    ng-focus="onFocus()"\
                    is-disabled="!isTogglePasswordEnabled()">\
                </ma-button>\
                <ma-button class="ma-button-reset"\
                    ng-show="canReset" size="xs" modifier="simple"\
                    right-icon="times-circle"\
                    click="onReset()"\
                    ng-focus="onFocus()"\
                    is-disabled="!isResetEnabled()">\
                </ma-button>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var valueElement = angular.element(element[0].querySelector('.ma-text-box-value')),
                resetButtonElement = angular.element(element[0].querySelector('.ma-button-reset')),
                togglePasswordButtonElement = angular.element(element[0].querySelector('.ma-button-toggle-password')),
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                // Variables keydownValue and keyupValue help track touched state.
                keydownValue,
                keyupValue,
                previousValue,
                changePromise,
                changeTimeout = Number(scope.changeTimeout),
                // Value at the moment of focus.
                focusValue,
                isFocusLost = true,
                trim = scope.trim === false ? false : true,
                isInternalChange = false;

            var setPreviousValue = function(value) {
                // Convert the value to string if it's a number, for example,
                // because a number cannot be trimmed.
                value = (maHelper.isNullOrUndefined(value) ? '' : value).toString();

                if (trim) {
                    value = value.trim();
                }

                previousValue = value;
            };

            var validate = function() {
                scope.isValid = true;
                var value = valueElement.val();

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        if (!validators[i].validate(value)) {
                            scope.isValid = false;
                            break;
                        }
                    }
                }
            };

            var triggerChange = function(value) {
                if (!hasValueChanged(value)) {
                    return;
                }

                isInternalChange = true;
                var oldValue = trim ? previousValue.trim() : previousValue;
                value = trim ? value.trim() : value;
                scope.value = value;
                setPreviousValue(value);

                $timeout(function() {
                    scope.change({
                        maValue: value,
                        maOldValue: oldValue
                    });
                });
            };

            var hasValueChanged = function(value) {
                value = maHelper.isNullOrUndefined(value) ? '' : value;
                var oldValue = maHelper.isNullOrUndefined(previousValue) ? '' : previousValue;

                if (trim) {
                    return oldValue.trim() !== value.trim();
                }

                return oldValue !== value;
            };

            var changeValue = function() {
                scope.isTouched = true;

                if (!hasValueChanged(valueElement.val())) {
                    validate();
                    return;
                }

                validate();

                if (scope.isValid) {
                    triggerChange(valueElement.val());
                }
            };

            scope.isValueFocused = false;
            scope.isTouched = false;
            scope.canTogglePassword = false;
            scope.isPasswordVisible = false;

            if (scope.type === 'password') {
                scope.canTogglePassword = scope.hasShowPasswordButton !== false;
            }

            // Set up validators.
            for (var i = 0; i < validators.length; i++) {
                if (validators[i].name === 'IsNotEmpty') {
                    hasIsNotEmptyValidator = true;
                    break;
                }
            }

            if (!hasIsNotEmptyValidator && isRequired) {
                validators.unshift(maValidators.isNotEmpty());
            }

            if (hasIsNotEmptyValidator) {
                isRequired = true;
            }

            scope.isResetEnabled = function() {
                return !scope.isDisabled && valueElement.val() !== '';
            };

            scope.onReset = function() {
                if (scope.isDisabled) {
                    return;
                }

                setPreviousValue(valueElement.val());
                scope.isTouched = true;
                valueElement.val('');
                triggerChange('');
                validate();
                valueElement.focus();
            };

            scope.onFocus = function(elementName) {
                if (elementName === 'value') {
                    scope.isValueFocused = true;
                }

                if (isFocusLost) {
                    focusValue = scope.value;

                    scope.focus({
                        maValue: scope.value
                    });
                }

                isFocusLost = false;
            };

            valueElement.focusout(function(event) {
                onFocusout(event);
            });

            resetButtonElement.focusout(function(event) {
                onFocusout(event);
            });

            togglePasswordButtonElement.focusout(function(event) {
                onFocusout(event);
            });

            scope.togglePassword = function() {
                scope.isPasswordVisible = !scope.isPasswordVisible;
                valueElement[0].type = scope.isPasswordVisible ? 'text' : 'password';
            };

            scope.isTogglePasswordEnabled = function() {
                return !scope.isDisabled && valueElement.val() !== '';
            };

            var onFocusout = function(event) {
                var elementTo = angular.element(event.relatedTarget);

                // Trigger blur event when focus goes to an element outside the component.
                if (scope.canTogglePassword) {
                    isFocusLost = elementTo[0] !== valueElement[0] &&
                        elementTo[0] !== togglePasswordButtonElement[0] &&
                        elementTo[0] !== resetButtonElement[0];
                } else {
                    isFocusLost = elementTo[0] !== valueElement[0] &&
                        elementTo[0] !== resetButtonElement[0];
                }

                // Cancel change if it is already in process to prevent the event from firing twice.
                if (changePromise) {
                    $timeout.cancel(changePromise);
                }

                // Use safeApply to avoid apply error when Reset icon is clicked.
                maHelper.safeApply(function() {
                    scope.isValueFocused = false;
                });

                if (isFocusLost) {
                    changeValue();

                    maHelper.safeApply(function() {
                        scope.blur({
                            maValue: scope.value,
                            maOldValue: focusValue,
                            maHasValueChanged: focusValue !== scope.value
                        });
                    });
                }
            };

            scope.onKeydown = function(event) {
                // Ignore tab key.
                if (event.keyCode === maHelper.keyCode.tab || event.keyCode === maHelper.keyCode.shift) {
                    return;
                }

                keydownValue = angular.element(event.target).val();
            };

            // Use input event to support value change from contextual menu,
            // e.g. mouse right click + Cut/Copy/Paste etc.
            valueElement.on('input', function(event) {
                // Ignore tab key.
                if (event.keyCode === maHelper.keyCode.tab || event.keyCode === maHelper.keyCode.shift) {
                    return;
                }

                var hasChanged = false;
                keyupValue = angular.element(event.target).val();

                if (keydownValue !== keyupValue) {
                    hasChanged = true;
                }

                // Change value after a timeout while the user is typing.
                if (!hasChanged) {
                    return;
                }

                if (changePromise) {
                    $timeout.cancel(changePromise);
                }

                // $timeout is required here to apply scope changes, even if changeTimeout is 0.
                changePromise = $timeout(function() {
                    changeValue();
                }, changeTimeout);
            });

            $timeout(function() {
                // Move id to input.
                element.removeAttr('id');
                valueElement.attr('id', scope.id);
            });

            scope.$watch('value', function(newValue, oldValue) {
                if (isInternalChange) {
                    isInternalChange = false;
                    return;
                }

                if (newValue === oldValue) {
                    return;
                }

                var caretPosition = valueElement.prop('selectionStart');
                setPreviousValue(newValue);
                valueElement.val(newValue);
                validate();

                // Restore caret position.
                if (scope.isValueFocused) {
                    valueElement.prop({
                        selectionStart: caretPosition,
                        selectionEnd: caretPosition
                    });
                }
            });

            // Set initial value.
            valueElement.val(scope.value);
            validate();
            setPreviousValue(scope.value);

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.validate = function() {
                    scope.isTouched = true;
                    validate();
                };

                scope.instance.isValid = function() {
                    return scope.isValid;
                };

                scope.instance.focus = function() {
                    if (!scope.isValueFocused) {
                        valueElement.focus();
                    }
                };
            }
        }
    };
}]);
