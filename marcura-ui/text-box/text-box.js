angular.module('marcuraUI.components')
    .provider('maTextBoxConfiguration', function () {
        this.$get = function () {
            return this;
        };
    })
    .directive('maTextBox', ['$timeout', 'maHelper', 'maValidators', function ($timeout, maHelper, maValidators) {
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
                changeWhenIsInvalid: '=',
                blur: '&',
                focus: '&',
                changeTimeout: '=',
                canReset: '=',
                placeholder: '@',
                hasShowPasswordButton: '=',
                trim: '=',
                max: '=',
                min: '=',
                decimals: '=',
                reset: '&'
            },
            replace: true,
            template: function (element, attributes) {
                var type = attributes.type === 'password' ? 'password' : 'text';

                if (type === 'number') {
                    type = 'text';
                }

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
            controller: ['$scope', 'maTextBoxConfiguration', function (scope, maTextBoxConfiguration) {
                scope.configuration = {};

                if (scope.decimals >= 0) {
                    scope.configuration.decimals = scope.decimals;
                } else if (maTextBoxConfiguration.decimals >= 0) {
                    scope.configuration.decimals = maTextBoxConfiguration.decimals;
                } else {
                    scope.configuration.decimals = 2;
                }
            }],
            link: function (scope, element) {
                var valueElement = angular.element(element[0].querySelector('.ma-text-box-value')),
                    resetButtonElement = angular.element(element[0].querySelector('.ma-button-reset')),
                    togglePasswordButtonElement = angular.element(element[0].querySelector('.ma-button-toggle-password')),
                    validators = [],
                    isRequired = scope.isRequired,
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
                    isInternalChange = false,
                    failedValidator = null,
                    decimals = scope.configuration.decimals;

                var setPreviousValue = function (value) {
                    value = maHelper.isNullOrUndefined(value) ? '' : value;

                    if (scope.type !== 'number' && trim) {
                        value = value.trim();
                    }

                    previousValue = value;
                };

                var getValue = function () {
                    var value = valueElement.val();
                    return scope.type === 'number' ? parseNumber(value) : value;
                };

                var validate = function () {
                    scope.isValid = true;
                    failedValidator = null;
                    // Use raw value for validators.
                    var value = valueElement.val();

                    if (scope.type === 'number') {
                        value = removeCommasFromNumber(value);
                    }

                    if (validators && validators.length) {
                        for (var i = 0; i < validators.length; i++) {
                            if (!validators[i].validate(value)) {
                                scope.isValid = false;
                                failedValidator = validators[i];
                                break;
                            }
                        }
                    }
                };

                var triggerChange = function (value) {
                    if (!hasValueChanged(value)) {
                        return;
                    }

                    isInternalChange = true;
                    var oldValue = previousValue;

                    if (scope.type !== 'number' && trim) {
                        oldValue = oldValue.trim();
                        value = value.trim();
                    }

                    scope.value = value;
                    setPreviousValue(value);

                    $timeout(function () {
                        scope.change({
                            maValue: value,
                            maOldValue: oldValue
                        });
                    });
                };

                var hasValueChanged = function (value) {
                    value = maHelper.isNullOrUndefined(value) ? '' : value;
                    var oldValue = maHelper.isNullOrUndefined(previousValue) ? '' : previousValue,
                        hasChanged = false;

                    if (scope.type !== 'number' && trim) {
                        hasChanged = oldValue.trim() !== value.trim();
                    } else {
                        hasChanged = oldValue !== value;
                    }

                    return hasChanged;
                };

                var changeValue = function () {
                    scope.isTouched = true;

                    if (!hasValueChanged(getValue())) {
                        validate();
                        return;
                    }

                    validate();

                    if (scope.isValid || scope.changeWhenIsInvalid) {
                        triggerChange(getValue());
                    }
                };

                var parseNumber = function (value) {
                    if (maHelper.isNullOrWhiteSpace(value)) {
                        return null;
                    }

                    value = parseFloat(removeCommasFromNumber(value));
                    value = parseFloat(value.toFixed(decimals));
                    return value;
                };

                var addCommasToNumber = function (value) {
                    if (maHelper.isNullOrWhiteSpace(value)) {
                        return '';
                    }

                    var decimalDigits = value.indexOf('.') == -1 ? '' : value.replace(/^-?\d+(?=\.)/, ''),
                        wholeDigits = value.replace(/(\.\d+)$/, ''),
                        commas = wholeDigits.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                    return '' + commas + decimalDigits;
                };

                var removeCommasFromNumber = function (value) {
                    if (maHelper.isNullOrWhiteSpace(value)) {
                        return '';
                    }

                    return value.trim().replace(',', '');
                };

                var formatValue = function (value) {
                    if (maHelper.isNullOrWhiteSpace(value)) {
                        return value;
                    }

                    var formattedValue = value;

                    if (scope.type === 'number') {
                        formattedValue = addCommasToNumber(value.toFixed(decimals));
                    }

                    return formattedValue;
                };

                var setValidators = function () {
                    var hasIsNotEmptyValidator = false;
                    validators = scope.validators ? angular.copy(scope.validators) : [];

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

                    if (scope.type === 'number') {
                        validators.push(maValidators.isNumber(true));

                        if (typeof scope.min === 'number') {
                            validators.push(maValidators.isGreaterOrEqual(scope.min, true));
                        }

                        if (typeof scope.max === 'number') {
                            validators.push(maValidators.isLessOrEqual(scope.max, true));
                        }
                    }
                };

                setValidators();
                scope.isValueFocused = false;
                scope.isTouched = false;
                scope.canTogglePassword = false;
                scope.isPasswordVisible = false;

                if (scope.type === 'password') {
                    scope.canTogglePassword = scope.hasShowPasswordButton !== false;
                }

                scope.isResetEnabled = function () {
                    return !scope.isDisabled && valueElement.val() !== '';
                };

                scope.doReset = function () {
                    setPreviousValue(getValue());
                    valueElement.val('');
                };

                scope.onReset = function () {
                    if (scope.isDisabled) {
                        return;
                    }

                    scope.doReset();
                    scope.isTouched = true;
                    triggerChange(scope.type === 'number' ? null : '');
                    validate();
                    valueElement.focus();

                    // Postpone reset event to fire after change event.
                    $timeout(function() {
                        scope.reset();
                    });
                };

                scope.onFocus = function (elementName) {
                    if (elementName === 'value') {
                        scope.isValueFocused = true;

                        if (scope.type === 'number' && !maHelper.isNullOrUndefined(scope.value) && scope.isValid) {
                            // Remove commas from the number.
                            valueElement.val(scope.value.toFixed(decimals));
                        }
                    }

                    if (isFocusLost) {
                        focusValue = scope.value;

                        scope.focus({
                            maValue: scope.value
                        });
                    }

                    isFocusLost = false;
                };

                valueElement.focusout(function (event) {
                    onFocusout(event, 'value');
                });

                resetButtonElement.focusout(function (event) {
                    onFocusout(event);
                });

                togglePasswordButtonElement.focusout(function (event) {
                    onFocusout(event);
                });

                scope.togglePassword = function () {
                    scope.isPasswordVisible = !scope.isPasswordVisible;
                    valueElement[0].type = scope.isPasswordVisible ? 'text' : 'password';
                };

                scope.isTogglePasswordEnabled = function () {
                    return !scope.isDisabled && valueElement.val() !== '';
                };

                var onFocusout = function (event, elementName) {
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

                    if (elementName === 'value') {
                        // Format value when a user has finished editing it.
                        if (scope.isValid) {
                            valueElement.val(formatValue(scope.value));
                        }
                    }

                    // Use safeApply to avoid apply error when Reset icon is clicked.
                    maHelper.safeApply(function () {
                        scope.isValueFocused = false;
                    });

                    if (isFocusLost) {
                        changeValue();

                        maHelper.safeApply(function () {
                            scope.blur({
                                maValue: scope.value,
                                maOldValue: focusValue,
                                maHasValueChanged: focusValue !== scope.value
                            });
                        });
                    }
                };

                scope.onKeydown = function (event) {
                    // Ignore tab key.
                    if (event.keyCode === maHelper.keyCode.tab || event.keyCode === maHelper.keyCode.shift) {
                        return;
                    }

                    keydownValue = angular.element(event.target).val();
                };

                // Use input event to support value change from contextual menu,
                // e.g. mouse right click + Cut/Copy/Paste etc.
                valueElement.on('input', function (event) {
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
                    changePromise = $timeout(function () {
                        changeValue();
                    }, changeTimeout);
                });

                $timeout(function () {
                    // Move id to input.
                    element.removeAttr('id');
                    valueElement.attr('id', scope.id);
                });

                scope.$watch('value', function (newValue, oldValue) {
                    if (isInternalChange) {
                        isInternalChange = false;
                        return;
                    }

                    if (newValue === oldValue) {
                        return;
                    }

                    if (hasValueChanged(newValue)) {
                        scope.isTouched = true;
                    }

                    var caretPosition = valueElement.prop('selectionStart');
                    setPreviousValue(newValue);
                    valueElement.val(formatValue(newValue));
                    validate();

                    // Restore caret position.
                    if (scope.isValueFocused) {
                        valueElement.prop({
                            selectionStart: caretPosition,
                            selectionEnd: caretPosition
                        });
                    }
                });

                var minMaxWatcher = function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    var value = getValue();

                    setValidators();

                    // Run only min/max validators to avoid the component being highligthed as invalid
                    // by other validators like IsNotEmpty, when min/max is changed.
                    var minMaxValidators = [];

                    for (var i = 0; i < validators.length; i++) {
                        if (validators[i].name === 'IsGreaterOrEqual' || validators[i].name === 'IsLessOrEqual') {
                            minMaxValidators.push(validators[i]);
                        }
                    }

                    if (minMaxValidators.length) {
                        // Empty failedValidator if it is min/max validator.
                        if (failedValidator && (failedValidator.name === 'IsGreaterOrEqual' || failedValidator.name === 'IsLessOrEqual')) {
                            failedValidator = null;
                            scope.isValid = true;
                        }

                        for (i = 0; i < minMaxValidators.length; i++) {
                            if (!minMaxValidators[i].validate(value)) {
                                scope.isValid = false;
                                failedValidator = minMaxValidators[i];
                                break;
                            }
                        }

                        if (!scope.isValid) {
                            scope.isTouched = true;
                        }
                    }

                    if (scope.isValid || scope.changeWhenIsInvalid) {
                        triggerChange(value);
                    }
                };

                scope.$watch('max', function (newValue, oldValue) {
                    minMaxWatcher(newValue, oldValue);
                });

                scope.$watch('min', function (newValue, oldValue) {
                    minMaxWatcher(newValue, oldValue);
                });

                // Set initial value.
                valueElement.val(formatValue(scope.value));
                validate();
                setPreviousValue(scope.value);

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.isInitialized = true;

                    scope.instance.validate = function () {
                        scope.isTouched = true;
                        validate();
                    };

                    scope.instance.isValid = function () {
                        return scope.isValid;
                    };

                    scope.instance.focus = function () {
                        if (!scope.isValueFocused) {
                            valueElement.focus();
                        }
                    };

                    scope.instance.failedValidator = function () {
                        return failedValidator;
                    };

                    scope.instance.clear = function () {
                        scope.doReset();

                        $timeout(function () {
                            scope.isTouched = false;
                        });
                    };
                }
            }
        };
    }]);