angular.module('marcuraUI.components').directive('maTextArea', ['$timeout', '$window', 'MaHelper', 'MaValidators', function ($timeout, $window, MaHelper, MaValidators) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            value: '=',
            isDisabled: '=',
            fitContentHeight: '=',
            isResizable: '=',
            isRequired: '=',
            validators: '=',
            instance: '=',
            updateOn: '@',
            change: '&'
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-text-area"\
                ng-class="{\
                    \'ma-text-area-is-disabled\': isDisabled,\
                    \'ma-text-area-is-focused\': isFocused,\
                    \'ma-text-area-fit-content-height\': fitContentHeight,\
                    \'ma-text-area-is-invalid\': !isValid,\
                    \'ma-text-area-is-touched\': isTouched\
                }">\
                <textarea class="ma-text-area-value"\
                    type="text"\
                    ng-focus="onFocus()"\
                    ng-blur="onBlur()"\
                    ng-keydown="onKeydown($event)"\
                    ng-keyup="onKeyup($event)"\
                    ng-disabled="isDisabled">\
                </textarea>\
            </div>';

            return html;
        },
        link: function (scope, element) {
            var valueElement = angular.element(element[0].querySelector('.ma-text-area-value')),
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                // Variables keydownValue and keyupValue help track touched state.
                keydownValue,
                keyupValue,
                previousValue,
                updateOn = scope.updateOn ? scope.updateOn : 'input';

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

            var resize = function () {
                if (!scope.fitContentHeight) {
                    return;
                }

                var valueElementStyle = getValueElementStyle(),
                    textHeight = MaHelper.getTextHeight(valueElement.val(), valueElementStyle.font, valueElementStyle.width + 'px', valueElementStyle.lineHeight),
                    height = (textHeight + valueElementStyle.paddingHeight + valueElementStyle.borderHeight);

                if (height < 40) {
                    height = 30;
                }

                valueElement[0].style.height = height + 'px';
                element[0].style.height = height + 'px';
            };

            var validate = function () {
                scope.isValid = true;

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        if (!validators[i].validate(valueElement.val())) {
                            scope.isValid = false;
                            break;
                        }
                    }
                }
            };

            var onChange = function (value) {
                if (previousValue === value) {
                    return;
                }

                previousValue = value;

                $timeout(function () {
                    scope.change({
                        maValue: value
                    });
                });
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
                validators.unshift(MaValidators.isNotEmpty());
            }

            if (hasIsNotEmptyValidator) {
                isRequired = true;
            }

            scope.onFocus = function () {
                scope.isFocused = true;
            };

            scope.onBlur = function () {
                scope.isFocused = false;
                scope.isTouched = true;

                if (scope.isValid && updateOn === 'blur') {
                    scope.value = valueElement.val();
                    onChange(scope.value);
                }

                validate();
            };

            scope.onKeydown = function (event) {
                // Ignore tab key.
                if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
                    return;
                }

                keydownValue = angular.element(event.target).val();
            };

            scope.onKeyup = function (event) {
                // Ignore tab key.
                if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
                    return;
                }

                keyupValue = angular.element(event.target).val();

                if (keydownValue !== keyupValue) {
                    scope.isTouched = true;
                }
            };

            // We are forced to use input event because scope.watch does
            // not respond to Enter key when the cursor is in the end of text.
            valueElement.on('input', function (event) {
                validate();
                resize();

                if (scope.isValid && updateOn === 'input') {
                    scope.$apply(function () {
                        scope.value = valueElement.val();
                    });
                }
            });

            angular.element($window).on('resize', function () {
                resize();
            });

            $timeout(function () {
                resize();

                if (scope.isResizable === false) {
                    valueElement.css('resize', 'none');
                }

                // Move id to input.
                element.removeAttr('id');
                valueElement.attr('id', scope.id);

                // If TextArea is hidden initially with ng-show then after appearing
                // it's height is calculated incorectly. This code fixes the issue.
                if (scope.fitContentHeight) {
                    var hiddenParent = $(element[0]).closest('.ng-hide[ng-show]');

                    if (hiddenParent.length === 1) {
                        var parentScope = hiddenParent.scope();

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
            });

            scope.$watch('value', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                scope.isValid = true;
                scope.isTouched = false;

                // IE 11.0 version moves the caret at the end when textarea value is fully replaced.
                // In IE 11.126+ the issue has been fixed.
                var caretPosition = valueElement.prop('selectionStart');
                valueElement.val(newValue);

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

            // Set initial value.
            valueElement.val(scope.value);
            validate();
            previousValue = scope.value;

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function () {
                    return scope.isValid;
                };

                scope.instance.focus = function () {
                    if (!scope.isFocused) {
                        valueElement.focus();
                    }
                };
            }
        }
    };
}]);