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
                canSearch: '=',
                canAddItem: '=',
                addItemTooltip: '@',
                showAddItemTooltip: '=',
                instance: '=',
                orderBy: '=',
                ajax: '=',
                canReset: '=',
                placeholder: '@',
                textPlaceholder: '@'
            },
            replace: true,
            template: function(element, attributes) {
                var isAjax = !maHelper.isNullOrWhiteSpace(attributes.ajax);

                var html = '\
                    <div class="ma-select-box"\
                        ng-class="{\
                            \'ma-select-box-can-add-item\': canAddItem,\
                            \'ma-select-box-is-text-focused\': isTextFocused,\
                            \'ma-select-box-is-disabled\': isDisabled,\
                            \'ma-select-box-is-invalid\': !isValid,\
                            \'ma-select-box-is-touched\': isTouched,\
                            \'ma-select-box-mode-add\': isAddMode,\
                            \'ma-select-box-mode-select\': !isAddMode,\
                            \'ma-select-box-can-reset\': canReset,\
                            \'ma-select-box-is-reset-disabled\': canReset && !isDisabled && !isResetEnabled()\
                        }">\
                        <div class="ma-select-box-spinner" ng-if="isLoading && !isDisabled">\
                            <div class="pace">\
                                <div class="pace-activity"></div>\
                            </div>\
                        </div>';

                if (isAjax) {
                    html += '<input ui-select2="options"\
                        ng-show="!isAddMode"\
                        ng-disabled="isDisabled"\
                        ng-change="onChange()"\
                        ng-model="value"\
                        placeholder="{{placeholder}}"/>';
                } else {
                    // Add an empty option (<option></option>) as first item for the placeholder to work.
                    // It's strange, but that's how Select2 works.
                    html += '\
                        <select ui-select2="options"\
                            ng-show="!isAddMode"\
                            ng-disabled="isDisabled"\
                            ng-model="value"\
                            ng-change="onChange()"\
                            placeholder="{{placeholder}}">\
                            <option></option>\
                            <option ng-repeat="item in items | maSelectBoxOrderBy:orderBy" value="{{getItemValue(item)}}">\
                                {{formatItem(item)}}\
                            </option>\
                        </select>';
                }

                html += '\
                    <input class="ma-select-box-text" type="text" ng-show="isAddMode"\
                        ng-model="text"\
                        ng-disabled="isDisabled"\
                        ng-focus="onFocus(\'text\')"\
                        placeholder="{{textPlaceholder}}"/>\
                    <ma-button class="ma-button-switch"\
                        ng-if="canAddItem" size="xs" modifier="simple"\
                        tooltip="{{getAddItemTooltip()}}"\
                        right-icon="{{isAddMode ? \'bars\' : \'plus\'}}"\
                        click="toggleMode()"\
                        ng-focus="onFocus()"\
                        is-disabled="isDisabled">\
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
            controller: ['$scope', function(scope) {
                // Setting Select2 options does not work from link function, so they are set here.
                scope.options = {};

                if (!scope.canSearch) {
                    scope.options.minimumResultsForSearch = -1;
                }

                // AJAX options.
                if (scope.ajax) {
                    scope.options.ajax = scope.ajax;
                    scope.options.minimumInputLength = 3;
                    scope.options.escapeMarkup = function(markup) {
                        return markup;
                    };
                    scope.options.initSelection = function initSelection(element, callback) {
                        // Run init function only once to set initial port.
                        initSelection.runs = initSelection.runs ? initSelection.runs : 1;

                        if (initSelection.runs === 1 && scope.selectedItem && scope.selectedItem[scope.itemValueField]) {
                            var item = angular.copy(scope.selectedItem);
                            item.text = scope.itemTemplate ? scope.itemTemplate(item) : item[scope.itemTextField];
                            item.id = item[scope.itemValueField];
                            scope.previousSelectedItem = item;
                            callback(item);
                        } else {
                            callback();
                        }

                        initSelection.runs++;
                    };
                }
            }],
            link: function(scope, element) {
                var textElement = angular.element(element[0].querySelector('.ma-select-box-text')),
                    previousAddedItem = null,
                    switchButtonElement,
                    resetButtonElement,
                    selectElement,
                    selectData,
                    labelElement,
                    isFocusLost = true,
                    isFocusInside = false,
                    showAddItemTooltip = scope.showAddItemTooltip === false ? false : true,
                    validators = scope.validators ? angular.copy(scope.validators) : [],
                    isRequired = scope.isRequired,
                    hasIsNotEmptyValidator = false;

                scope.previousSelectedItem = scope.previousSelectedItem || null;
                scope.isAddMode = false;
                scope.formatItem = scope.itemTemplate ||
                    function(item) {
                        if (!item) {
                            return '';
                        }

                        return scope.itemTextField ? item[scope.itemTextField] : item.toString();
                    };
                scope.isTextFocused = false;
                scope.isValid = true;
                scope.isTouched = false;
                scope.isAjax = angular.isObject(scope.ajax);

                var isExistingItem = function(item) {
                    if (!angular.isArray(scope.items)) {
                        return false;
                    }

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

                    if (angular.isArray(scope.items)) {
                        for (var i = 0; i < scope.items.length; i++) {
                            if (scope.items[i][scope.itemValueField].toString() === itemValue.toString()) {
                                return scope.items[i];
                            }
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
                    if (scope.canAddItem && item) {
                        // Switch mode depending on whether provided item exists in the list.
                        // This allows the component to be displayed in correct mode, let's say, in add mode,
                        // when scope.selectedItem is initially a custom value not presented in the list.
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
                        } else if (!scope.isAjax) {
                            // Set select value.
                            // When in AJAX mode Select2 sets values by itself.
                            if (scope.itemValueField && item[scope.itemValueField]) {
                                // Item is an object.
                                scope.value = item[scope.itemValueField].toString();
                            } else if (typeof item === 'string') {
                                // Item is a string.
                                scope.value = item;
                            }
                        }

                        scope.previousSelectedItem = item;
                        scope.toggleMode('select');
                    }
                };

                var onFocusout = function(event, elementName) {
                    var elementTo = angular.element(event.relatedTarget),
                        selectInputElement = angular.element(selectData.dropdown[0].querySelector('.select2-input'));

                    scope.isTextFocused = false;

                    // Trigger change event for text element.
                    if (elementName === 'text') {
                        isFocusInside = false;

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
                            if (scope.isValid) {
                                $timeout(function() {
                                    scope.change({
                                        maItem: scope.selectedItem
                                    });
                                });
                            }
                        });
                    } else if (elementName === 'select') {
                        scope.$apply(function() {
                            scope.isTouched = true;
                        });
                    }

                    // Trigger blur event when focus goes to an element outside the component.
                    if (scope.canAddItem) {
                        // Compare switchButtonElement only if it exists, to avoid comparing
                        // two undefineds: elementTo[0] and switchButtonElement[0].
                        isFocusLost = !isFocusInside &&
                            elementTo[0] !== switchButtonElement[0] &&
                            elementTo[0] !== resetButtonElement[0] &&
                            elementTo[0] !== textElement[0] &&
                            elementTo[0] !== selectData.focusser[0] &&
                            elementTo[0] !== selectInputElement[0];
                    } else {
                        isFocusLost = !isFocusInside &&
                            elementTo[0] !== resetButtonElement[0] &&
                            elementTo[0] !== textElement[0] &&
                            elementTo[0] !== selectData.focusser[0] &&
                            elementTo[0] !== selectInputElement[0];
                    }

                    if (isFocusLost) {
                        scope.blur({
                            item: scope.selectedItem
                        });
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

                var setFocus = function() {
                    // Focus the right element.
                    if (scope.isAddMode) {
                        textElement.focus();
                        scope.isTextFocused = true;
                    } else {
                        selectElement.select2('focus');
                    }
                };

                scope.isResetEnabled = function() {
                    if (scope.isDisabled) {
                        return false;
                    }

                    // When in add mode check scope.text as user changes it.
                    if (scope.isAddMode) {
                        return !maHelper.isNullOrWhiteSpace(scope.text);
                    }

                    return !maHelper.isNullOrUndefined(scope.selectedItem);
                };

                scope.onReset = function() {
                    scope.selectedItem = null;
                    setFocus();

                    $timeout(function() {
                        scope.change({
                            maItem: scope.selectedItem
                        });
                    });
                };

                scope.onFocus = function(elementName) {
                    if (elementName === 'text') {
                        scope.isTextFocused = true;
                    }

                    if (isFocusLost) {
                        scope.focus({
                            item: scope.selectedItem
                        });
                    }

                    isFocusLost = false;
                };

                textElement.focusout(function(event) {
                    onFocusout(event, 'text');
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
                    if (!scope.canAddItem) {
                        return;
                    }

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

                        scope.previousSelectedItem = getItemByValue(scope.value);
                        scope.selectedItem = previousAddedItem;

                        if (scope.selectedItem) {
                            scope.text = typeof scope.selectedItem === 'string' ? scope.selectedItem : scope.selectedItem[scope.itemTextField];
                        }
                    } else {
                        previousAddedItem = getNewItem(scope.text);
                        scope.selectedItem = scope.previousSelectedItem;
                    }

                    if (!isInternalCall) {
                        $timeout(function() {
                            // Trigger change event as user manually swithces between custom and selected items.
                            scope.change({
                                maItem: scope.selectedItem
                            });

                            setFocus();
                        });
                    }
                };

                scope.onChange = function() {
                    // Validation is required if the item is a simple text, not a JSON object.
                    var item = maHelper.isJson(scope.value) ? JSON.parse(scope.value) : scope.value;

                    // The change event works differently in AJAX mode.
                    if (scope.isAjax) {
                        // The change event fires first time even if scope.selectedItem has not changed.
                        if (item === scope.previousSelectedItem) {
                            return;
                        }

                        // When item is selected, change event fires multiple times.
                        // The last time, when item is an object, is the correct one - all others must be ignored.
                        if (!angular.isObject(item)) {
                            return;
                        }
                    }

                    // Get selected item from items by value field.
                    // There is no 'items' array in AJAX mode.
                    if (!scope.isAjax) {
                        if (scope.itemValueField && !maHelper.isNullOrWhiteSpace(item)) {
                            for (var i = 0; i < scope.items.length; i++) {

                                if (scope.items[i][scope.itemValueField].toString() === item.toString()) {
                                    item = scope.items[i];
                                    break;
                                }
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
                    scope.previousSelectedItem = item;

                    $timeout(function() {
                        scope.change({
                            maItem: item
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
                    if (newValue === oldValue) {
                        return;
                    }

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
                    switchButtonElement = angular.element(element[0].querySelector('.ma-button-switch'));
                    resetButtonElement = angular.element(element[0].querySelector('.ma-button-reset'));

                    // Focus the component when label is clicked.
                    if (labelElement.length > 0) {
                        $($document).on('click', 'label[for="' + scope.id + '"]', function() {
                            setFocus();
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

                    switchButtonElement.focusout(function(event) {
                        onFocusout(event);
                    });

                    resetButtonElement.focusout(function(event) {
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
