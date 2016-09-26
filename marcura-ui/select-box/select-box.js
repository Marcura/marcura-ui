angular.module('marcuraUI.components').directive('maSelectBox', ['$timeout', 'maHelper', function($timeout, maHelper) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            selectedItem: '=',
            isLoading: '=',
            change: '&',
            itemTemplate: '=',
            itemTextField: '@',
            itemValueField: '@',
            isDisabled: '=',
            isRequired: '=',
            isSearchable: '=',
            canAddItem: '=',
            addItemTooltip: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-select-box"\
                ng-class="{\
                    \'ma-select-box-can-add-item\': canAddItem,\
                    \'ma-select-box-is-focused\': isFocused,\
                    \'ma-select-box-is-disabled\': isDisabled\
                }">\
                <div class="ma-select-box-spinner" ng-if="isLoading && !isDisabled">\
                    <div class="pace">\
                        <div class="pace-activity"></div>\
                    </div>\
                </div>\
                <select ui-select2="options"\
                    ng-show="!addingItem"\
                    ng-disabled="isDisabled"\
                    ng-model="value"\
                    ng-change="onChange()"\
                    ng-required="isRequired">\
                    <option ng-repeat="item in items" value="{{getItemValue(item)}}">\
                        {{formatItem(item)}}\
                    </option>\
                </select>\
                <input class="ma-select-box-input" type="text" ng-show="addingItem"\
                    ng-model="text"\
                    ng-focus="onFocus()"\
                    ng-blur="onBlur()"/>\
                <ma-button ng-if="canAddItem" size="xs" modifier="secondary"\
                    tooltip="{{getAddItemTooltip()}}"\
                    right-icon="{{addingItem ? \'bars\' : \'plus\'}}"\
                    click="addItem()"\
                    is-disabled="isDisabled">\
                </ma-button>\
            </div>';

            return html;
        },
        controller: ['$scope', function(scope) {
            // Setting Select2 options does not work from link function, so they are set here.
            scope.options = {};

            if (!scope.isSearchable) {
                scope.options.minimumResultsForSearch = -1;
            }
        }],
        link: function(scope, element) {
            var inputElement = angular.element(element[0].querySelector('.ma-select-box-input')),
                previousSelectedItem,
                previousAddedItem;

            scope.addingItem = false;
            scope.formatItem = scope.itemTemplate ||
                function(item) {
                    if (!item) {
                        return '';
                    }

                    return scope.itemTextField ? item[scope.itemTextField] : item.toString();
                };
            scope.isFocused = false;

            // Set initial value.
            if (scope.selectedItem) {
                if (scope.itemValueField) {
                    scope.value = scope.selectedItem[scope.itemValueField].toString();
                } else if (typeof scope.selectedItem === 'string') {
                    scope.value = scope.selectedItem;
                } else {
                    scope.value = JSON.stringify(scope.selectedItem);
                }

                previousSelectedItem = scope.value;
            }

            scope.getAddItemTooltip = function() {
                // \u00A0 Unicode character is used here like &nbsp;.
                if (scope.addingItem) {
                    return 'Back\u00A0to the\u00A0list';
                }

                return scope.addItemTooltip ? scope.addItemTooltip : 'Add new\u00A0item';
            };

            scope.getItemValue = function(item) {
                return scope.itemValueField ? item[scope.itemValueField].toString() : item;
            };

            scope.addItem = function() {
                scope.addingItem = !scope.addingItem;

                // Restore previously selected or added item.
                if (scope.addingItem) {
                    previousSelectedItem = scope.selectedItem;
                    scope.selectedItem = previousAddedItem;
                } else {
                    previousAddedItem = scope.selectedItem;
                    scope.selectedItem = previousSelectedItem;
                }

                $timeout(function() {
                    // Trigger change event as user manually swithces between custom and selected items.
                    scope.change({
                        item: scope.selectedItem
                    });

                    // Focus the right component.
                    if (scope.addingItem) {
                        inputElement.focus();
                        scope.isFocused = true;
                    } else {
                        var selectElement = angular.element(element[0].querySelector('.select2-container'));
                        selectElement.select2('focus');
                    }
                });
            };

            scope.onFocus = function() {
                scope.isFocused = true;
            };

            scope.onBlur = function() {
                scope.isFocused = false;

                if (scope.itemTextField) {
                    if (scope.selectedItem && scope.selectedItem[scope.itemTextField] === scope.text) {
                        return;
                    }

                    scope.selectedItem = {};
                    scope.selectedItem[scope.itemTextField] = scope.text;
                } else {
                    if (scope.selectedItem === scope.text) {
                        return;
                    }

                    scope.selectedItem = scope.text;
                }

                previousAddedItem = scope.selectedItem;

                $timeout(function() {
                    scope.change({
                        item: scope.selectedItem
                    });
                });
            };

            scope.onChange = function() {
                // Validation is required if the item is a simple text, not a JSON object.
                var item = maHelper.isJson(scope.value) ? JSON.parse(scope.value) : scope.value;

                // Get selected item from items by value field.
                if (scope.itemValueField) {
                    for (var i = 0; i < scope.items.length; i++) {

                        if (scope.items[i][scope.itemValueField].toString() === item.toString()) {
                            item = scope.items[i];
                            break;
                        }
                    }
                }

                if (!item && !scope.selectedItem) {
                    return;
                }

                if (scope.itemValueField) {
                    if (scope.selectedItem && scope.selectedItem[scope.itemValueField].toString() === item[scope.itemValueField].toString()) {
                        return;
                    }
                } else if (item === scope.selectedItem) {
                    return;
                }

                scope.selectedItem = item;
                previousSelectedItem = item;

                $timeout(function() {
                    scope.change({
                        item: item
                    });
                });
            };
        }
    };
}]);
