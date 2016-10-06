angular.module('marcuraUI.components')
    .filter('maSelectBoxOrderBy', ['orderByFilter', function(orderByFilter) {
        return function(items, orderByExpression) {
            if (orderByExpression) {
                return orderByFilter(items, orderByExpression);
            }

            return items;
        };
    }])
    .directive('maSelectBox', ['$document', '$timeout', 'maHelper', 'maValidators', function($document, $timeout, maHelper, maValidators) {
        return {
            restrict: 'E',
            scope: {
                id: '@',
                items: '=',
                selectedItem: '=',
                isLoading: '=',
                change: '&',
                blur: '&',
                focus: '&',
                itemTemplate: '=',
                itemTextField: '@',
                itemValueField: '@',
                isDisabled: '=',
                isRequired: '=',
                validators: '=',
                isSearchable: '=',
                canAddItem: '=',
                addItemTooltip: '@',
                showAddItemTooltip: '=',
                instance: '=',
                orderBy: '='
            },
            replace: true,
            template: function() {
                var html = '\
                <div class="ma-select-box"\
                    ng-class="{\
                        \'ma-select-box-can-add-item\': canAddItem,\
                        \'ma-select-box-is-focused\': isFocused,\
                        \'ma-select-box-is-disabled\': isDisabled,\
                        \'ma-select-box-is-invalid\': !isValid,\
                        \'ma-select-box-is-touched\': isTouched\
                    }">\
                    <div class="ma-select-box-spinner" ng-if="isLoading && !isDisabled">\
                        <div class="pace">\
                            <div class="pace-activity"></div>\
                        </div>\
                    </div>\
                    <select ui-select2="options"\
                        ng-show="!isAddMode"\
                        ng-disabled="isDisabled"\
                        ng-model="value"\
                        ng-change="onChange()">\
                        <option ng-repeat="item in items | maSelectBoxOrderBy:orderBy" value="{{getItemValue(item)}}">\
                            {{formatItem(item)}}\
                        </option>\
                    </select>\
                    <input class="ma-select-box-input" type="text" ng-show="isAddMode"\
                        ng-model="text"\
                        ng-disabled="isDisabled"\
                        ng-focus="onFocus(\'input\')"/>\
                    <ma-button ng-if="canAddItem" size="xs" modifier="simple"\
                        tooltip="{{getAddItemTooltip()}}"\
                        right-icon="{{isAddMode ? \'bars\' : \'plus\'}}"\
                        click="toggleMode()"\
                        ng-focus="onFocus()"\
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
                    previousSelectedItem = null,
                    previousAddedItem = null,
                    buttonElement,
                    selectElement,
                    selectData,
                    labelElement,
                    isFocusLost = true,
                    isFocusInside = false,
                    showAddItemTooltip = scope.showAddItemTooltip === false ? false : true,
                    validators = scope.validators ? angular.copy(scope.validators) : [],
                    isRequired = scope.isRequired,
                    hasIsNotEmptyValidator = false;

                scope.isAddMode = false;
                scope.formatItem = scope.itemTemplate ||
                    function(item) {
                        if (!item) {
                            return '';
                        }

                        return scope.itemTextField ? item[scope.itemTextField] : item.toString();
                    };
                scope.isFocused = false;
                scope.isValid = true;
                scope.isTouched = false;

                var isExistingItem = function(item) {
                    var isItemObject = scope.itemValueField && item[scope.itemValueField];

                    for (var i = 0; i < scope.items.length; i++) {
                        if (isItemObject) {
                            // Search by id value field.
                            if (scope.items[i][scope.itemValueField] === item[scope.itemValueField]) {
                                return true;
                            }
                        } else {
                            // Search by item itself as text.
                            if (scope.items[i] === item) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                var getItemByValue = function(itemValue) {
                    if (!itemValue) {
                        return null;
                    }

                    // The list is an array of strings, so value is item itself.
                    if (!scope.itemTextField) {
                        return itemValue;
                    }

                    for (var i = 0; i < scope.items.length; i++) {
                        if (scope.items[i][scope.itemValueField].toString() === itemValue.toString()) {
                            return scope.items[i];
                        }
                    }

                    return null;
                };

                var getNewItem = function(itemText) {
                    // The list is an array of strings, so item should be a simple string.
                    if (!scope.itemTextField) {
                        return itemText;
                    }

                    // The list is an array of objects, so item should be an object.
                    if (itemText) {
                        var item = {};
                        item[scope.itemTextField] = itemText;
                        return item;
                    }

                    return null;
                };

                var setValue = function(item) {
                    // Switch mode depending on whether provided item exists in the list.
                    // This allows the component to be displayed in correct mode, let's say, in add mode,
                    // when scope.selectedItem is initially a custom value not presented in the list.
                    if (item) {
                        scope.isAddMode = !isExistingItem(item);
                    }

                    validate(item);

                    if (scope.isAddMode) {
                        if (!item) {
                            scope.text = null;
                        } else {
                            if (scope.itemTextField && item[scope.itemTextField]) {
                                // Item is an object.
                                scope.text = item[scope.itemTextField].toString();
                            } else {
                                // Item is a string.
                                scope.text = item;
                            }
                        }

                        previousAddedItem = item;
                        scope.toggleMode('add');
                    } else {
                        if (!item) {
                            scope.value = null;
                        } else {
                            // Set select value.
                            if (scope.itemValueField && item[scope.itemValueField]) {
                                // Item is an object.
                                scope.value = item[scope.itemValueField].toString();
                            } else if (typeof item === 'string') {
                                // Item is a string.
                                scope.value = item;
                            }
                        }

                        previousSelectedItem = item;
                        scope.toggleMode('select');
                    }
                };

                var onFocusout = function(event, elementName) {
                    var elementTo = angular.element(event.relatedTarget),
                        selectInputElement = angular.element(selectData.dropdown[0].querySelector('.select2-input'));

                    scope.isFocused = false;

                    // Trigger change event for text input.
                    if (elementName === 'input') {
                        // Need to apply changes because onFocusout is triggered using jQuery
                        // (AngularJS does not have ng-focusout event directive).
                        scope.$apply(function() {
                            scope.isTouched = true;

                            if (scope.itemTextField) {
                                if (scope.selectedItem && scope.selectedItem[scope.itemTextField] === scope.text) {
                                    return;
                                }

                                scope.selectedItem = getNewItem(scope.text);
                            } else {
                                if (scope.selectedItem === scope.text) {
                                    return;
                                }

                                scope.selectedItem = scope.text;
                            }

                            previousAddedItem = scope.selectedItem;

                            // Postpone change event for $apply to have time to
                            // take effect and update scope.selectedItem,
                            // so both 'item' parameter inside change event and scope.selectedItem have
                            // the same values.
                            $timeout(function() {
                                scope.change({
                                    item: scope.selectedItem
                                });
                            });
                        });
                    } else if (elementName === 'select') {
                        scope.$apply(function() {
                            scope.isTouched = true;
                        });
                    }

                    // Trigger blur event when focus goes to an element outside the component.
                    if (!isFocusInside &&
                        elementTo[0] !== buttonElement[0] &&
                        elementTo[0] !== inputElement[0] &&
                        elementTo[0] !== selectData.focusser[0] &&
                        elementTo[0] !== selectInputElement[0]
                    ) {
                        scope.blur({
                            item: scope.selectedItem
                        });

                        isFocusLost = true;
                    }

                    isFocusInside = false;
                };

                var validate = function(value) {
                    scope.isValid = true;

                    if (validators && validators.length) {
                        for (var i = 0; i < validators.length; i++) {
                            if (!validators[i].method(value)) {
                                scope.isValid = false;
                                break;
                            }
                        }
                    }
                };

                scope.onFocus = function(elementName) {
                    scope.isFocused = true;

                    if (isFocusLost) {
                        scope.focus({
                            item: scope.selectedItem
                        });
                    }

                    isFocusLost = false;
                };

                inputElement.focusout(function(event) {
                    onFocusout(event, 'input');
                });

                scope.getAddItemTooltip = function() {
                    if (!showAddItemTooltip) {
                        return '';
                    }

                    // \u00A0 Unicode character is used here like &nbsp;.
                    if (scope.isAddMode) {
                        return 'Back\u00A0to the\u00A0list';
                    }

                    return scope.addItemTooltip ? scope.addItemTooltip : 'Add new\u00A0item';
                };

                scope.getItemValue = function(item) {
                    return scope.itemValueField ? item[scope.itemValueField].toString() : item;
                };

                scope.toggleMode = function(mode) {
                    if (scope.isAddMode && mode === 'add' || !scope.isAddMode && mode === 'select') {
                        return;
                    }

                    var isInternalCall = false;

                    if (mode === 'select') {
                        scope.isAddMode = false;
                        isInternalCall = true;
                    } else if (mode === 'add') {
                        scope.isAddMode = true;
                        isInternalCall = true;
                    } else {
                        scope.isAddMode = !scope.isAddMode;
                    }

                    // Restore previously selected or added item.
                    if (scope.isAddMode) {
                        // Sometimes select2 remains opened after it has lost focus.
                        // Make sure that it is closed in add mode.
                        if (selectElement) {
                            // selectElement is undefined when scope.toggleMode method
                            // is invoked from setValue initially.
                            selectElement.select2('close');
                        }

                        previousSelectedItem = getItemByValue(scope.value);
                        scope.selectedItem = previousAddedItem;

                        if (scope.selectedItem) {
                            scope.text = typeof scope.selectedItem === 'string' ? scope.selectedItem : scope.selectedItem[scope.itemTextField];
                        }
                    } else {
                        previousAddedItem = getNewItem(scope.text);
                        scope.selectedItem = previousSelectedItem;
                    }

                    if (!isInternalCall) {
                        $timeout(function() {
                            // Trigger change event as user manually swithces between custom and selected items.
                            scope.change({
                                item: scope.selectedItem
                            });

                            // Focus the right component.
                            if (scope.isAddMode) {
                                inputElement.focus();
                            } else {
                                selectElement.select2('focus');
                            }

                            scope.isFocused = true;
                        });
                    }
                };

                scope.onChange = function() {
                    // Validation is required if the item is a simple text, not a JSON object.
                    var item = maHelper.isJson(scope.value) ? JSON.parse(scope.value) : scope.value;

                    // Get selected item from items by value field.
                    if (scope.itemValueField && item) {
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
                        if (scope.selectedItem && scope.selectedItem[scope.itemValueField] &&
                            scope.selectedItem[scope.itemValueField].toString() === item[scope.itemValueField].toString()) {
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

                scope.$watch('selectedItem', function(newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    setValue(newValue);
                });

                // Validate text while it is being typed.
                scope.$watch('text', function(newValue, oldValue) {
                    scope.isTouched = true;
                    validate(newValue);
                });

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.switchToSelectMode = function() {
                        if (scope.isAddMode) {
                            scope.toggleMode('select');
                        }
                    };

                    scope.instance.switchToAddMode = function() {
                        if (!scope.isAddMode) {
                            scope.toggleMode('add');
                        }
                    };

                    scope.instance.isValid = function() {
                        return scope.isValid;
                    };
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

                $timeout(function() {
                    // Set initial value.
                    // Value is set inside timeout to ensure that we get the latest selectedItem.
                    // If put outside timeout then there could be issues when selectedItem is set
                    // from directive's link function, not from controller.
                    setValue(scope.selectedItem);

                    selectElement = angular.element(element[0].querySelector('.select2-container'));
                    selectData = selectElement.data().select2;
                    labelElement = $('label[for="' + scope.id + '"]');
                    buttonElement = angular.element(element[0].querySelector('.ma-button'));

                    // Focus the component when label is clicked.
                    if (labelElement.length > 0) {
                        $($document).on('click', 'label[for="' + scope.id + '"]', function() {
                            if (scope.isAddMode) {
                                inputElement.focus();
                            } else {
                                selectElement.select2('focus');
                            }
                        });
                    }

                    selectData.focusser.on('focus', function() {
                        scope.onFocus('select');
                    });

                    selectData.focusser.on('focusout', function(event) {
                        onFocusout(event, 'select');
                    });

                    selectData.dropdown.on('focus', '.select2-input', function() {
                        // This is required for IE to keep focus when item is selectedItem
                        // from the list using keyboard.
                        isFocusInside = true;
                        scope.onFocus();
                    });

                    selectData.dropdown.on('focusout', '.select2-input', function(event) {
                        onFocusout(event, 'select');
                    });

                    buttonElement.focusout(function(event) {
                        onFocusout(event);
                    });

                    // Detect if item in the list is hovered.
                    // This is later used for triggering blur event correctly.
                    selectData.dropdown.on('mouseenter', '.select2-result', function() {
                        isFocusInside = true;
                    });

                    // Detect if select2 mask is hovered.
                    // This is later used for triggering blur event correctly in IE.
                    $($document).on('mouseenter', '.select2-drop-mask', function() {
                        isFocusInside = true;
                    });
                });
            }
        };
    }]);
