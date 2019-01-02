angular.module('marcuraUI.components').directive('maTextArea', ['$timeout', '$window', 'MaHelper', 'MaValidators', function ($timeout, $window, MaHelper, MaValidators) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            isDisabled: '@',
            fitContentHeight: '@',
            isResizable: '@',
            isRequired: '@',
            changeTimeout: '@',
            change: '&',
            blur: '&',
            focus: '&',
            value: '=',
            validators: '=',
            instance: '='
        },
        replace: true,
        template: function (element, attributes) {
            var fitContentHeight = attributes.fitContentHeight === 'true',
                cssClass = 'ma-text-area';

            if (fitContentHeight) {
                cssClass += ' ma-text-area-fit-content-height';
            }

            var html = '\
                <div class="'+ cssClass + '">\
                    <textarea class="ma-text-area-value"\
                        type="text"\
                        ng-focus="onFocus()"\
                        ng-blur="onBlur()"\
                        ng-disabled="isDisabled === \'true\'">\
                    </textarea>\
                </div>';

            return html;
        },
        link: function (scope, element, attributes) {
            var valueElement = angular.element(element[0].querySelector('.ma-text-area-value')),
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired === 'true',
                isDisabled = scope.isDisabled === 'true',
                fitContentHeight = scope.fitContentHeight === 'true',
                isResizable = scope.isResizable === 'false' ? false : true,
                hasIsNotEmptyValidator = false,
                // Variables keydownValue and keyupValue help track touched state.
                keydownValue,
                keyupValue,
                previousValue,
                focusValue,
                changePromise,
                changeTimeout = Number(scope.changeTimeout) || 0,
                isTouched = false,
                isFocused = false,
                isValid = true,
                isInternalChange = false;

            // Set initial height to avoid jumping.
            valueElement[0].style.height = '30px';

            if (!isResizable) {
                valueElement.css('resize', 'none');
            }

            var getValueElementStyle = function () {
                var style = $window.getComputedStyle(valueElement[0], null),
                    properties = {},
                    paddingHeight = parseInt(style.getPropertyValue('padding-top')) + parseInt(style.getPropertyValue('padding-bottom')),
                    paddingWidth = parseInt(style.getPropertyValue('padding-left')) + parseInt(style.getPropertyValue('padding-right')),
                    borderHeight = parseInt(style.getPropertyValue('border-top-width')) + parseInt(style.getPropertyValue('border-bottom-width')),
                    borderWidth = parseInt(style.getPropertyValue('border-left-width')) + parseInt(style.getPropertyValue('border-right-width'));

                properties.width = parseInt($window.getComputedStyle(valueElement[0], null).getPropertyValue('width')) - paddingWidth;
                properties.height = parseInt($window.getComputedStyle(valueElement[0], null).getPropertyValue('height')) - paddingHeight;
                properties.paddingHeight = paddingHeight;
                properties.paddingWidth = paddingWidth;
                properties.borderHeight = borderHeight;
                properties.borderWidth = borderWidth;
                properties.lineHeight = style.getPropertyValue('line-height');

                // IE and Firefox do not support 'font' property, so we need to get it ourselves.
                properties.font = style.getPropertyValue('font-style') + ' ' +
                    style.getPropertyValue('font-variant') + ' ' +
                    style.getPropertyValue('font-weight') + ' ' +
                    style.getPropertyValue('font-size') + ' ' +
                    style.getPropertyValue('font-height') + ' ' +
                    style.getPropertyValue('font-family');

                return properties;
            };

            var getValue = function () {
                return valueElement.val();
            };

            var setValue = function (value) {
                return valueElement.val(value);
            };

            var setIsTouched = function (_isTouched) {
                isTouched = _isTouched;
                element.toggleClass('ma-text-area-is-touched', isTouched);
            };

            var setIsFocused = function (_isFocused) {
                isFocused = _isFocused;
                element.toggleClass('ma-text-area-is-focused', isFocused);
            };

            var setIsValid = function (_isValid) {
                isValid = _isValid;
                element.toggleClass('ma-text-area-is-invalid', !isValid);
            };

            var setIsDisabled = function (_isDisabled) {
                isDisabled = _isDisabled;
                element.toggleClass('ma-text-area-is-disabled', isDisabled);
            };

            var resize = function () {
                if (!fitContentHeight) {
                    return;
                }

                var valueElementStyle = getValueElementStyle(),
                    textHeight = MaHelper.getTextHeight(getValue(), valueElementStyle.font, valueElementStyle.width + 'px', valueElementStyle.lineHeight),
                    height = (textHeight + valueElementStyle.paddingHeight + valueElementStyle.borderHeight);

                if (height < 40) {
                    height = 30;
                }

                valueElement[0].style.height = height + 'px';
                element[0].style.height = height + 'px';
            };

            var validate = function () {
                setIsValid(true);

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        if (!validators[i].validate(getValue())) {
                            setIsValid(false);
                            break;
                        }
                    }
                }
            };

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

            scope.onFocus = function () {
                setIsFocused(true);
                focusValue = scope.value;

                scope.focus({
                    maValue: scope.value
                });
            };

            scope.onBlur = function () {
                setIsFocused(false);
                setIsTouched(true);
                validate();

                scope.blur({
                    maValue: scope.value,
                    maOldValue: focusValue,
                    maHasValueChanged: focusValue !== getValue()
                });
            };

            valueElement.on('keydown', function (event) {
                // Ignore tab key.
                if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
                    return;
                }

                keydownValue = angular.element(event.target).val();
            });

            valueElement.on('keyup', function (event) {
                // Ignore tab key.
                if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
                    return;
                }

                keyupValue = angular.element(event.target).val();

                if (keydownValue !== keyupValue) {
                    setIsTouched(true);
                }
            });

            // Use input event to support value change from Enter key, and contextual menu,
            // e.g. mouse right click + Cut/Copy/Paste etc.
            valueElement.on('input', function (event) {
                var hasChanged = false;
                keyupValue = angular.element(event.target).val();

                if (keydownValue !== keyupValue) {
                    hasChanged = true;
                }

                previousValue = keydownValue;

                // Change value after a timeout while the user is typing.
                if (!hasChanged) {
                    return;
                }

                if (changePromise) {
                    $timeout.cancel(changePromise);
                }

                validate();
                resize();

                if (isValid) {
                    changePromise = $timeout(function () {
                        scope.$apply(function () {
                            scope.value = getValue();

                            // $timeout is required here for scope.value and event value to match.
                            $timeout(function () {
                                scope.change({
                                    maValue: scope.value,
                                    maOldValue: previousValue
                                });
                            });
                        });
                    }, changeTimeout);
                }
            });

            angular.element($window).on('resize', function () {
                resize();
            });

            $timeout(function () {
                resize();

                if (!isResizable) {
                    valueElement.css('resize', 'none');
                }

                // Move id to input.
                element.removeAttr('id');
                valueElement.attr('id', scope.id);

                // If TextArea is hidden initially with ng-show then after appearing
                // it's height is calculated incorectly. This code fixes the issue.
                if (fitContentHeight) {
                    var hiddenParent = $(element[0]).closest('.ng-hide[ng-show]');

                    if (hiddenParent.length === 1) {
                        var parentScope = hiddenParent.scope();

                        if (parentScope) {
                            parentScope.$watch(hiddenParent.attr('ng-show'), function (isVisible) {
                                if (isVisible) {
                                    // Wait for the hidden element to appear first.
                                    $timeout(function () {
                                        resize();
                                    });
                                }
                            });
                        }
                    }
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

                setIsValid(true);
                setIsTouched(false);

                // IE 11.0 version moves the caret at the end when textarea value is fully replaced.
                // In IE 11.126+ the issue has been fixed.
                var caretPosition = valueElement.prop('selectionStart');
                setValue(newValue);

                // Restore caret position if text area is visible.
                var isVisible = $(element).is(':visible');

                if (isVisible) {
                    valueElement.prop({
                        selectionStart: caretPosition,
                        selectionEnd: caretPosition
                    });
                }

                resize();
            });

            attributes.$observe('isDisabled', function (newValue) {
                var oldValue = isDisabled;
                newValue = newValue === 'true';

                if (newValue === oldValue) {
                    return;
                }

                setIsDisabled(newValue);
            });

            // Set initial value.
            setValue(scope.value);
            validate();
            previousValue = scope.value;
            setIsDisabled(isDisabled);

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isEditor = function () {
                    return true;
                };

                scope.instance.isValid = function () {
                    return isValid;
                };

                scope.instance.validate = function () {
                    setIsTouched(true);
                    validate();
                };

                scope.instance.focus = function () {
                    if (!isFocused) {
                        valueElement.focus();
                    }
                };
            }
        }
    };
}]);