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
            placeholder: '@'
        },
        replace: true,
        template: function(element, attributes) {
            var type = attributes.type === 'password' ? 'password' : 'text';

            var html = '\
            <div class="ma-text-box"\
                ng-class="{\
                    \'ma-text-box-is-disabled\': isDisabled,\
                    \'ma-text-box-is-focused\': isFocused,\
                    \'ma-text-box-is-invalid\': !isValid,\
                    \'ma-text-box-is-touched\': isTouched,\
                    \'ma-text-box-can-reset\': canReset,\
                    \'ma-text-box-is-reset-disabled\': canReset && !isDisabled && !isResetEnabled()\
                }">\
                <input class="ma-text-box-value" type="' + type + '" id="{{id}}"\
                    type="text"\
                    placeholder="{{placeholder}}"\
                    ng-focus="onFocus()"\
                    ng-blur="onBlur()"\
                    ng-keydown="onKeydown($event)"\
                    ng-disabled="isDisabled"/>\
                <ma-button class="ma-button-reset"\
                    ng-show="canReset" size="xs" modifier="simple"\
                    right-icon="times-circle"\
                    click="onReset()"\
                    is-disabled="!isResetEnabled()">\
                </ma-button>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var valueElement = angular.element(element[0].querySelector('.ma-text-box-value')),
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                // Variables keydownValue and keyupValue help track touched state.
                keydownValue,
                keyupValue,
                previousValue,
                changePromise,
                changeTimeout = Number(scope.changeTimeout);

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
                if (previousValue === value) {
                    return;
                }

                scope.value = value;
                previousValue = value;

                $timeout(function() {
                    scope.change({
                        maValue: value
                    });
                });
            };

            var hasValueChanged = function() {
                var value = valueElement.val();

                if (maHelper.isNullOrUndefined(previousValue) && value === '') {
                    return false;
                }

                return previousValue !== value;
            };

            var changeValue = function() {
                scope.isTouched = true;

                if (!hasValueChanged()) {
                    return;
                }

                validate();

                if (scope.isValid) {
                    triggerChange(valueElement.val());
                }
            };

            scope.isFocused = false;
            scope.isTouched = false;

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

                previousValue = valueElement.val();
                scope.isTouched = true;
                triggerChange(null);
                validate();
                valueElement.focus();
            };

            scope.onFocus = function() {
                scope.isFocused = true;

                scope.focus({
                    maValue: scope.value
                });
            };

            scope.onBlur = function() {
                // Cancel change if it is already in process to prevent the event from firing twice.
                if (changePromise) {
                    $timeout.cancel(changePromise);
                }

                scope.isFocused = false;
                changeValue();
                scope.blur({
                    maValue: scope.value
                });
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
                if (newValue === oldValue) {
                    return;
                }

                var caretPosition = valueElement.prop('selectionStart');
                valueElement.val(newValue);
                validate();

                // Restore caret position.
                valueElement.prop({
                    selectionStart: caretPosition,
                    selectionEnd: caretPosition
                });
            });

            // Set initial value.
            valueElement.val(scope.value);
            validate();
            previousValue = scope.value;

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
            }
        }
    };
}]);
