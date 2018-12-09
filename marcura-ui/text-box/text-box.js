angular.module('marcuraUI.components')
    .provider('maTextBoxConfiguration', function () {
        this.$get = function () {
            return this;
        };
    })
    .directive('maTextBox', ['$timeout', 'MaHelper', 'MaValidators', function ($timeout, MaHelper, MaValidators) {
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
                validate: '&',
                changeTimeout: '=',
                canReset: '=',
                placeholder: '@',
                hasShowPasswordButton: '=',
                trim: '=',
                max: '=',
                min: '=',
                decimals: '=',
                useFormat: '=',
                reset: '&',
                defaultValue: '=',
                modifier: '@'
            },
            replace: true,
            template: function (element, attributes) {
                var type = attributes.type === 'password' ? 'password' : 'text';

                if (type === 'number' || type === 'email') {
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
                    \'ma-text-box-is-toggle-password-disabled\': canTogglePassword && !isDisabled && !isTogglePasswordEnabled(),\
                    \'ma-text-box-has-value\': hasValue()\
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
            link: function (scope, element, attributes) {
                var valueElement = angular.element(element[0].querySelector('.ma-text-box-value')),
                    resetButtonElement = angular.element(element[0].querySelector('.ma-button-reset')),
                    togglePasswordButtonElement = angular.element(element[0].querySelector('.ma-button-toggle-password')),
                    validators = [],
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
                    decimals = scope.configuration.decimals,
                    hasDefaultValue = attributes.defaultValue !== undefined,
                    defaultValue = MaHelper.isNullOrUndefined(scope.defaultValue) ? '' : scope.defaultValue,
                    hasMin = typeof scope.min === 'number',
                    hasMax = typeof scope.max === 'number',
                    useFormat = scope.useFormat === undefined ? true : scope.useFormat;

                if (scope.type === 'number') {
                    defaultValue = typeof scope.defaultValue === 'number' ? scope.defaultValue : null;
                }

                var setModifiers = function (oldModifiers) {
                    // Remove previous modifiers first.
                    if (!MaHelper.isNullOrWhiteSpace(oldModifiers)) {
                        oldModifiers = oldModifiers.split(' ');

                        for (var i = 0; i < oldModifiers.length; i++) {
                            element.removeClass('ma-text-box-' + oldModifiers[i]);
                        }
                    }

                    var modifiers = '';

                    if (!MaHelper.isNullOrWhiteSpace(scope.modifier)) {
                        modifiers = scope.modifier.split(' ');
                    }

                    for (var j = 0; j < modifiers.length; j++) {
                        element.addClass('ma-text-box-' + modifiers[j]);
                    }
                };

                var setPreviousValue = function (value) {
                    value = MaHelper.isNullOrUndefined(value) ? '' : value;

                    if (scope.type !== 'number' && trim) {
                        value = value.trim();
                    }

                    previousValue = value;
                };

                var getValue = function () {
                    var value = valueElement.val();
                    return scope.type === 'number' ? parseNumber(value) : value;
                };

                var validate = function (triggerEvent) {
                    scope.isValid = true;
                    failedValidator = null;
                    triggerEvent = triggerEvent !== undefined ? triggerEvent : true;
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

                    if (triggerEvent !== false) {
                        triggerValidate(value);
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

                    if (hasDefaultValue) {
                        if (MaHelper.isNullOrUndefined(value)) {
                            value = defaultValue;
                        }

                        if (MaHelper.isNullOrUndefined(oldValue)) {
                            oldValue = defaultValue;
                        }
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

                var triggerValidate = function (value) {
                    // Postpone the event to allow scope.value to be updated, so
                    // the event can operate relevant value.
                    $timeout(function () {
                        scope.validate({
                            maValue: value
                        });
                    });
                };

                var hasValueChanged = function (value) {
                    value = MaHelper.isNullOrUndefined(value) ? '' : value;
                    var oldValue = MaHelper.isNullOrUndefined(previousValue) ? '' : previousValue,
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

                var parseNumber = function (value, keepDecimals) {
                    if (MaHelper.isNullOrWhiteSpace(value)) {
                        return null;
                    }

                    value = parseFloat(removeCommasFromNumber(value));

                    if (!keepDecimals) {
                        value = parseFloat(value.toFixed(decimals));
                    }

                    if (isNaN(value)) {
                        return null;
                    }

                    return value;
                };

                var addCommasToNumber = function (value) {
                    if (MaHelper.isNullOrWhiteSpace(value)) {
                        return '';
                    }

                    var decimalDigits = value.indexOf('.') == -1 ? '' : value.replace(/^-?\d+(?=\.)/, ''),
                        wholeDigits = value.replace(/(\.\d+)$/, ''),
                        commas = wholeDigits.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                    return '' + commas + decimalDigits;
                };

                var removeCommasFromNumber = function (value) {
                    if (MaHelper.isNullOrWhiteSpace(value)) {
                        return '';
                    }

                    return value.trim().replace(/,/g, '');
                };

                var formatValue = function (value) {
                    if (MaHelper.isNullOrWhiteSpace(value)) {
                        return value;
                    }

                    var formattedValue = value;

                    if (scope.type === 'number') {
                        value = typeof value === 'number' ? value : Number(value);

                        if (useFormat) {
                            formattedValue = addCommasToNumber(value.toFixed(decimals));
                        } else {
                            // Remove leading 0.
                            formattedValue = value.toFixed(0);
                        }
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

                    if (!hasIsNotEmptyValidator && scope.isRequired) {
                        validators.unshift(MaValidators.isNotEmpty());
                    }

                    if (scope.type === 'number') {
                        validators.push(MaValidators.isNumber(true));
                    }

                    if (hasMin) {
                        if (scope.type === 'number') {
                            validators.push(MaValidators.isGreaterOrEqual(scope.min, true));
                        } else {
                            validators.push(MaValidators.isLengthGreaterOrEqual(scope.min, true));
                        }
                    }

                    if (hasMax) {
                        if (scope.type === 'number') {
                            validators.push(MaValidators.isLessOrEqual(scope.max, true));
                        } else {
                            validators.push(MaValidators.isLengthLessOrEqual(scope.max, true));
                        }
                    }

                    if (scope.type === 'email') {
                        validators.push(MaValidators.isEmail(true));
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

                scope.hasValue = function () {
                    if (scope.type === 'number') {
                        var value = valueElement.val();

                        if (value !== '' && !MaHelper.isNumber(value)) {
                            return true;
                        }

                        return parseNumber(value, true) !== defaultValue && value !== '';
                    }

                    return valueElement.val() !== defaultValue;
                };

                scope.isResetEnabled = function () {
                    if (scope.isDisabled) {
                        return false;
                    }

                    if (scope.type === 'number') {
                        var value = valueElement.val();

                        if (value !== '' && !MaHelper.isNumber(value)) {
                            return true;
                        }

                        return parseNumber(value, true) !== defaultValue && value !== '';
                    }

                    return valueElement.val() !== defaultValue;
                };

                scope.doReset = function () {
                    setPreviousValue(getValue());
                    valueElement.val(defaultValue);
                };

                scope.onReset = function () {
                    if (scope.isDisabled) {
                        return;
                    }

                    scope.doReset();
                    scope.isTouched = true;
                    triggerChange(defaultValue);
                    validate();
                    valueElement.focus();

                    // Postpone reset event to fire after change event.
                    $timeout(function () {
                        scope.reset();
                    });
                };

                scope.onFocus = function (elementName) {
                    if (elementName === 'value') {
                        scope.isValueFocused = true;

                        if (scope.type === 'number' && !MaHelper.isNullOrUndefined(scope.value) && scope.isValid) {
                            // Remove commas from the number.
                            var value = scope.value.toFixed(useFormat ? decimals : 0);
                            valueElement.val(value);
                        }
                    }

                    if (isFocusLost) {
                        focusValue = valueElement.val();

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
                    var elementTo = angular.element(event.relatedTarget),
                        value = valueElement.val(),
                        hasValueChanged = focusValue !== value;

                    setPreviousValue(scope.value);

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
                        if (hasDefaultValue && value.trim() === '') {
                            // Prevent value watcher from triggering twice.
                            // It'll be triggered later in isFocusLost condition by the sequence of method calls: changeValue -> triggerChange.
                            // We need to suppress the trigger or change event won't fire if isRequired is set to true
                            // and the user clears the value.
                            // E.g., value is 0, user types 1, and then removes the value.
                            isInternalChange = true;
                            value = defaultValue;

                            if (hasValueChanged) {
                                scope.value = value;
                            }

                            valueElement.val(formatValue(value));
                        }

                        if (!scope.isResetEnabled() && elementTo[0] === resetButtonElement[0]) {
                            isFocusLost = true;
                        }

                        validate();

                        if (scope.isValid) {
                            // Format value when a user has finished editing it.
                            valueElement.val(formatValue(value));
                        }
                    }

                    // Use safeApply to avoid apply error when Reset icon is clicked.
                    MaHelper.safeApply(function () {
                        scope.isValueFocused = false;
                        scope.isTouched = true;
                    });

                    if (isFocusLost) {
                        if (hasValueChanged) {
                            changeValue();
                        }

                        MaHelper.safeApply(function () {
                            scope.blur({
                                maValue: scope.value,
                                maOldValue: focusValue,
                                maHasValueChanged: hasValueChanged
                            });
                        });
                    }
                };

                scope.onKeydown = function (event) {
                    // No need to save keydown value when the user is navigating with tab key.
                    if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
                        return;
                    }

                    keydownValue = angular.element(event.target).val();

                    if (scope.type === 'number') {
                        if (
                            // Allow backspace, tab, delete.
                            $.inArray(event.keyCode, [MaHelper.keyCode.backspace, MaHelper.keyCode.delete, MaHelper.keyCode.home, MaHelper.keyCode.end, MaHelper.keyCode.period, MaHelper.keyCode.numLock.period, MaHelper.keyCode.dash, MaHelper.keyCode.dash2]) !== -1 ||
                            // Allow left, right.
                            (event.keyCode === 37 || event.keyCode === 39)) {
                            return;
                        }

                        // Don't allow to enter not numbers.
                        if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                            event.preventDefault();
                        }
                    }
                };

                // Use input event to support value change from contextual menu,
                // e.g. mouse right click + Cut/Copy/Paste etc.
                valueElement.on('input', function (event) {
                    // Ignore tab key.
                    if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
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

                    if (scope.id) {
                        valueElement.attr('id', scope.id);
                    } else {
                        valueElement.removeAttr('id');
                    }
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

                    // Pass false as first parameter to avoid loop from triggering validate event.
                    validate(false);

                    // Restore caret position.
                    if (scope.isValueFocused) {
                        valueElement.prop({
                            selectionStart: caretPosition,
                            selectionEnd: caretPosition
                        });
                    }
                });

                scope.$watch('isRequired', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    setValidators();
                    validate();
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

                scope.$watch('modifier', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    setModifiers(oldValue);
                });

                // Set initial value.
                if (hasDefaultValue && MaHelper.isNullOrUndefined(scope.value)) {
                    scope.value = defaultValue;
                }

                valueElement.val(formatValue(scope.value));
                validate();
                setPreviousValue(scope.value);
                setModifiers();

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.isInitialized = true;

                    scope.instance.isEditor = function () {
                        return true;
                    };

                    scope.instance.validate = function () {
                        scope.isTouched = true;

                        // Prevent loop that might occur if validate method is invoked
                        // from validate event from outside.
                        validate(false);

                        // In case value validity depends on side factors, we need to set scope value
                        // when validation has passed.
                        if (scope.isValid) {
                            var value = getValue();

                            if (hasValueChanged(value)) {
                                scope.value = value;
                            }
                        }
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

                    // User typed value, that hasn't gone through validation.
                    scope.instance.rawValue = function (value) {
                        if (arguments.length === 1) {
                            valueElement.val(value);
                        } else {
                            return getValue();
                        }
                    };

                    scope.instance.clear = function () {
                        scope.doReset();

                        $timeout(function () {
                            scope.isTouched = false;
                        });
                    };

                    scope.instance.isTouched = function () {
                        return scope.isTouched;
                    };
                }
            }
        };
    }]);