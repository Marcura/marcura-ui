angular.module('marcuraUI.components').directive('maHtmlArea', ['$timeout', 'MaHelper', 'MaValidators', function ($timeout, MaHelper, MaValidators) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            value: '=',
            isDisabled: '=',
            isRequired: '=',
            instance: '=',
            validators: '=',
            focus: '&',
            blur: '&',
            change: '&'
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-html-area"\
                ng-class="{\
                    \'ma-html-area-is-disabled\': isDisabled,\
                    \'ma-html-area-is-focused\': isFocused,\
                    \'ma-html-area-is-invalid\': !isValid,\
                    \'ma-html-area-is-touched\': isTouched\
                }">\
                <trix-editor ng-disabled="isDisabled">\
                </trix-editor>\
            </div>';

            return html;
        },
        link: function (scope, element, attributes) {
            var editorElement = angular.element(element[0].querySelector('.ma-html-area trix-editor')),
                buttonElements = angular.element(element[0].querySelectorAll('.ma-html-area .trix-button')),
                editor,
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                focusValue,
                isInternalChange = false;
            scope._value = scope.value || '';
            scope.isTouched = false;

            var setEditorValue = function (value) {
                editor.loadHTML(value);
            };

            var getEditorValue = function () {
                return editorElement.html();
            };

            var disableEditor = function () {
                editorElement[0].contentEditable = !scope.isDisabled;

                if (scope.isDisabled) {
                    buttonElements.attr('disabled', true);
                } else {
                    buttonElements.removeAttr('disabled');
                }
            };

            var validate = function () {
                var value = getEditorValue();
                scope.isValid = true;

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        if (!validators[i].validate(value)) {
                            scope.isValid = false;
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

            editorElement.on('trix-initialize', function () {
                editor = editorElement[0].editor;
                disableEditor();
                setEditorValue(scope.value);
            });

            editorElement.on('trix-change', function () {
                validate();

                if (scope.isValid) {
                    MaHelper.safeApply(function () {
                        isInternalChange = true;
                        scope.value = getEditorValue();

                        $timeout(function () {
                            scope.change({
                                maValue: scope.value
                            });
                        });
                    });
                }
            });

            editorElement.on('trix-focus', function () {
                MaHelper.safeApply(function () {
                    scope.isFocused = true;
                    focusValue = scope.value;

                    scope.focus({
                        maValue: scope.value
                    });
                });
            });

            editorElement.on('trix-blur', function () {
                MaHelper.safeApply(function () {
                    scope.isFocused = false;
                    scope.isTouched = true;

                    validate();

                    scope.blur({
                        maValue: scope.value,
                        maOldValue: focusValue,
                        maHasValueChanged: focusValue !== scope.value
                    });
                });
            });

            scope.$watch('value', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (isInternalChange) {
                    isInternalChange = false;
                    return;
                }

                scope.isValid = true;
                setEditorValue(scope.value);
            });

            scope.$watch('isDisabled', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                disableEditor();
            });

            $timeout(function () {
                $('[for="' + scope.id + '"]').on('click', function () {
                    editorElement.focus();
                });
            });

            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isEditor = function () {
                    return true;
                };

                scope.instance.isValid = function () {
                    return scope.isValid;
                };

                scope.instance.validate = function () {
                    scope.isTouched = true;
                    validate();
                };
            }
        }
    };
}]);