angular.module('marcuraUI.components').directive('maRadioButton', ['$timeout', 'MaValidators', 'MaHelper', function ($timeout, MaValidators, MaHelper) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            itemTemplate: '=',
            itemTextField: '@',
            itemValueField: '@',
            value: '=',
            change: '&',
            isDisabled: '=',
            isRequired: '=',
            validators: '=',
            instance: '=',
            canUnselect: '='
        },
        replace: true,
        template: function () {
            var html = '\
                <div class="ma-radio-button" ng-class="{\
                        \'ma-radio-button-is-disabled\': isDisabled,\
                        \'ma-radio-button-is-invalid\': !isValid,\
                        \'ma-radio-button-is-touched\': isTouched,\
                        \'ma-radio-button-can-unselect\': canUnselect\
                    }">\
                    <div class="ma-radio-button-item" ng-class="{\
                            \'ma-radio-button-item-is-selected\': isItemSelected(item)\
                        }" ng-style="{ width: (100 / items.length) + \'%\' }"\
                        ng-repeat="item in items">\
                        <ma-button\
                            class="ma-button-radio"\
                            text="{{getItemText(item)}}"\
                            simple\
                            size="xs"\
                            is-disabled="{{isDisabled}}"\
                            click="onChange(item)">\
                        </ma-button>\
                    </div>\
                </div>';

            return html;
        },
        link: function (scope, element) {
            var isObjectArray = scope.itemTextField || scope.itemValueField,
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false;

            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

            var validate = function (value) {
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

            scope.getItemText = function (item) {
                if (scope.itemTemplate) {
                    return scope.itemTemplate(item);
                } else if (!isObjectArray) {
                    return item;
                } else if (scope.itemTextField) {
                    return item[scope.itemTextField];
                }
            };

            scope.isItemSelected = function (item) {
                if (!isObjectArray) {
                    return item === scope.value;
                } else if (scope.itemValueField) {
                    return item && scope.value &&
                        item[scope.itemValueField] === scope.value[scope.itemValueField];
                }

                return false;
            };

            scope.onChange = function (item) {
                if (scope.isDisabled) {
                    return;
                }

                var oldValue = scope.value,
                    hasChanged = true;
                scope.value = item;

                // Check that value has changed.
                if (!isObjectArray) {
                    hasChanged = oldValue !== item;
                } else if (scope.itemValueField) {
                    if (MaHelper.isNullOrUndefined(oldValue) && !MaHelper.isNullOrUndefined(item[scope.itemValueField])) {
                        hasChanged = true;
                    } else {
                        hasChanged = oldValue[scope.itemValueField] !== item[scope.itemValueField];
                    }
                } else {
                    // Compare objects if itemValueField is not provided.
                    if (MaHelper.isNullOrUndefined(oldValue) && !MaHelper.isNullOrUndefined(item)) {
                        hasChanged = true;
                    } else {
                        hasChanged = JSON.stringify(oldValue) === JSON.stringify(item);
                    }
                }

                // Remove selection if the same item is selected.
                if (scope.canUnselect && !hasChanged) {
                    scope.value = null;
                }

                if (hasChanged || (scope.canUnselect && !hasChanged)) {
                    $timeout(function () {
                        validate(scope.value);

                        scope.change({
                            maValue: scope.value,
                            maOldValue: oldValue
                        });
                    });
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
                    validate(scope.value);
                };
            }
        }
    };
}]);