angular.module('marcuraUI.components').directive('maMultiCheckBox', ['$timeout', 'maValidators', function($timeout, maValidators) {
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
            instance: '='
        },
        replace: true,
        template: function() {
            var html = '\
                <div class="ma-multi-check-box" ng-class="{\
                        \'ma-multi-check-box-is-disabled\': isDisabled,\
                        \'ma-multi-check-box-is-invalid\': !isValid,\
                        \'ma-multi-check-box-is-touched\': isTouched\
                    }">\
                    <div class="ma-multi-check-box-item" ng-repeat="item in items">\
                        <div class="ma-multi-check-box-background" ng-click="onChange(item)"></div>\
                        <ma-check-box\
                            size="sm"\
                            value="getItemMetadata(item).isSelected"\
                            is-disabled="isDisabled">\
                        </ma-check-box><div class="ma-multi-check-box-text">{{getItemText(item)}}</div>\
                    </div>\
                </div>';

            return html;
        },
        link: function(scope, element) {
            var isObjectArray = scope.itemTextField || scope.itemValueField,
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                itemsMetadata = {};

            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

            var validate = function(value) {
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

            var setSelectedItems = function() {
                if (scope.value && scope.value.length && scope.items && scope.items.length) {
                    for (var j = 0; j < scope.value.length; j++) {
                        for (var k = 0; k < scope.items.length; k++) {
                            if (!isObjectArray) {
                                if (scope.items[k] === scope.value[j]) {
                                    scope.getItemMetadata(scope.items[k]).isSelected = true;
                                }
                            } else if (scope.itemValueField) {
                                if (scope.items[k][scope.itemValueField] === scope.value[j][scope.itemValueField]) {
                                    scope.getItemMetadata(scope.items[k]).isSelected = true;
                                }
                            }
                        }
                    }
                }
            };

            scope.getItemMetadata = function(item) {
                var itemValue = isObjectArray ? item[scope.itemValueField] : item;

                if (!itemsMetadata[itemValue]) {
                    itemsMetadata[itemValue] = {};
                    itemsMetadata[itemValue].item = item;
                }

                return itemsMetadata[itemValue];
            };

            scope.getItemText = function(item) {
                if (scope.itemTemplate) {
                    return scope.itemTemplate(item);
                } else if (!isObjectArray) {
                    return item;
                } else if (scope.itemTextField) {
                    return item[scope.itemTextField];
                }
            };

            scope.onChange = function(item) {
                if (scope.isDisabled) {
                    return;
                }

                var oldValue = scope.value,
                    value = [],
                    itemMetadata = scope.getItemMetadata(item);

                itemMetadata.isSelected = !itemMetadata.isSelected;

                for (var itemValue in itemsMetadata) {
                    if (itemsMetadata.hasOwnProperty(itemValue)) {
                        if (itemsMetadata[itemValue].isSelected) {
                            value.push(itemsMetadata[itemValue].item);
                        }
                    }
                }

                scope.value = value.length ? value : null;

                $timeout(function() {
                    validate(scope.value);

                    scope.change({
                        maValue: scope.value,
                        maOldValue: oldValue
                    });
                });
            };

            scope.$watch('value', function(newValue, oldValue) {
                if (angular.equals(newValue, oldValue)) {
                    return;
                }

                setSelectedItems();
            });

            // Set initial value.
            $timeout(function() {
                setSelectedItems();
            });

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

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function() {
                    return scope.isValid;
                };

                scope.instance.validate = function() {
                    validate(scope.value);
                };
            }
        }
    };
}]);
