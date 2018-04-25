/*
    TODO:
    - Tabbing out in 'add' mode when list is open doesn't trigger blur. Focus goes to browser navigation bar.
      However, if mouse hovers container, then it works fine.
    - Mousedown triggers focus, but shouldn't.
    - Multiple: Second click on container doesn't close dropdown.
    - IE Multiple: Selecting value with Enter triggers focus.
    - IE Single: "Adding item as object" When clicking quickly twice on Toggle button selectedItem gets cleared.
*/
angular.module('marcuraUI.components')
    .directive('maSelectBox', ['$document', '$timeout', 'MaHelper', function ($document, $timeout, MaHelper) {
        return {
            restrict: 'E',
            scope: {
                id: '@',
                items: '=',
                value: '=',
                isLoading: '=',
                change: '&',
                blur: '&',
                focus: '&',
                init: '&',
                itemTemplate: '=',
                itemTextField: '@',
                itemValueField: '@',
                isDisabled: '=',
                isRequired: '=',
                validators: '=',
                canAddItem: '=',
                selectItemTooltip: '@',
                addItemTooltip: '@',
                showAddItemTooltip: '=',
                instance: '=',
                ajax: '=',
                canReset: '=',
                placeholder: '@',
                textPlaceholder: '@',
                isMultiple: '=',
                type: '@',
                minSearchCharacters: '=',
                noItemsFoundText: '@'
            },
            replace: true,
            template: function (element, attributes) {
                var hasAjax = !MaHelper.isNullOrWhiteSpace(attributes.ajax),
                    isMultiple = attributes.isMultiple === 'true';

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
                            \'ma-select-box-is-reset-disabled\': canReset && !isDisabled && !_hasValue,\
                            \'ma-select-box-is-loading\': isLoading,\
                            \'ma-select-box-has-value\': _hasValue\
                        }">\
                        <div class="ma-select-box-spinner" ng-if="isLoading && !isDisabled">\
                            <div class="pace">\
                                <div class="pace-activity"></div>\
                            </div>\
                        </div>';

                if (hasAjax) {
                    html += '<input class="ma-select-box-input" ma-select-box-wrapper="options"' + (isMultiple ? ' multiple' : '') + '\
                        ng-show="!isAddMode"\
                        ng-disabled="isDisabled"\
                        ng-change="onChange()"\
                        ng-model="selectedItem"/>';
                } else {
                    // Add an empty option <option></option> as first item for the placeholder to work.
                    // It's strange, but that's how Select2 works.
                    html += '\
                        <select ma-select-box-wrapper="options"' + (isMultiple ? ' multiple' : '') + '\
                            ng-show="!isAddMode"\
                            ng-disabled="isDisabled"\
                            ng-model="selectedItem"\
                            ng-change="onChange()"\
                            placeholder="{{placeholder}}">\
                            <option></option>\
                            <option ng-repeat="item in _items" value="{{item[_itemValueField]}}">\
                                {{item.text}}\
                            </option>\
                        </select>';
                }

                html += '\
                    <input class="ma-select-box-text" type="text" ng-show="isAddMode"\
                        ng-model="text"\
                        ng-disabled="isDisabled"\
                        ng-focus="onFocus(\'text\')"\
                        placeholder="{{textPlaceholder}}"/>\
                    <ma-button class="ma-button-toggle"\
                        ng-show="canAddItem" size="xs" modifier="simple"\
                        ma-tooltip="{{_addItemTooltip}}"\
                        ma-tooltip-is-disabled="!canAddItem"\
                        right-icon="{{isAddMode ? \'bars\' : \'plus\'}}"\
                        click="toggleMode(null, null, true)"\
                        ng-focus="onFocus(\'toggle\')"\
                        is-disabled="isDisabled">\
                    </ma-button>\
                    <ma-button class="ma-button-reset"\
                        ng-show="canReset" size="xs" modifier="simple"\
                        right-icon="times-circle"\
                        click="onReset()"\
                        ng-focus="onFocus(\'reset\')"\
                        is-disabled="isDisabled || !_hasValue">\
                    </ma-button>\
                </div>';

                return html;
            },
            controller: ['$scope', function (scope) {
                scope._type = scope.type ? scope.type : 'object';
                scope._itemValueField = scope.itemValueField ? scope.itemValueField : 'id';
                scope._minSearchCharacters = scope.minSearchCharacters > 0 ? scope.minSearchCharacters : 1;

                // Always return string value for compatibility reasons with select2,
                // as it only supports string identifiers.
                scope.getItemValue = function (item, asString) {
                    asString = typeof asString === 'boolean' ? asString : true;

                    if (MaHelper.isNullOrWhiteSpace(item)) {
                        return null;
                    }

                    // Item value is item itself.
                    if (typeof item !== 'object') {
                        return item.toString();
                    }

                    // In case of a nested property binding like 'company.port.id'.
                    var parts = scope._itemValueField.split('.'),
                        value = item[parts[0]];

                    for (var i = 1; i < parts.length; i++) {
                        value = value[parts[i]];
                    }

                    if (MaHelper.isNullOrUndefined(value)) {
                        return null;
                    }

                    return asString ? value.toString() : value;
                };

                scope.convertItemValue = function (item) {
                    if (MaHelper.isNullOrUndefined(item)) {
                        return null;
                    }

                    if (scope._type === 'object') {
                        return item;
                    } else if (scope._type === 'string') {
                        return item[scope._itemValueField];
                    } else if (scope._type === 'boolean') {
                        return item[scope._itemValueField] === 'true';
                    } else if (scope._type === 'number') {
                        return Number(item[scope._itemValueField]);
                    }

                    return item;
                };

                scope.getItemText = function (item) {
                    if (scope.itemTemplate) {
                        return scope.itemTemplate(scope.convertItemValue(item));
                    }

                    if (!item) {
                        return '';
                    }

                    if (scope._type !== 'object') {
                        // Primitive types are converted to an object where id becomes item itself.
                        return item[scope._itemValueField];
                    }

                    return scope.itemTextField ? item[scope.itemTextField] : item.toString();
                };

                scope.runInitSelection = true;

                // Setting Select2 options does not work from link function, so they are set here.
                scope.options = {};
                scope.options.canAddItem = !!scope.canAddItem;
                scope.options.instance = {};

                if (scope.noItemsFoundText) {
                    scope.options.formatNoMatches = function () {
                        return scope.noItemsFoundText;
                    };
                }

                // AJAX options.
                if (scope.ajax) {
                    scope.options.ajax = scope.ajax;
                    scope.options.minimumInputLength = scope._minSearchCharacters;
                    scope.options.escapeMarkup = function (markup) {
                        return markup;
                    };
                    scope.options.initSelection = function initSelection(element, callback) {
                        // Run init function only when it is required to update Select2 value.
                        if (scope.runInitSelection && scope.getItemValue(scope.value)) {
                            var item = angular.copy(scope.value);
                            item.text = scope.getItemText(item);
                            // We shouldn't convert item id to string here, because it can be of any type,
                            // e.g. number, and later will be saved to scope.value.
                            item[scope._itemValueField] = scope.getItemValue(item, scope._type === 'object' ? false : true);
                            scope.previousSelectedItem = item;
                            callback(item);
                        } else {
                            callback();
                        }

                        scope.runInitSelection = false;
                    };

                    if (scope.isMultiple) {
                        scope.options.formatSelection = function (item) {
                            return scope.getItemText(item);
                        };
                    }
                }
            }],
            link: function (scope, element, attrs) {
                var textElement = angular.element(element[0].querySelector('.ma-select-box-text')),
                    previousAddedItem = null,
                    toggleButtonElement,
                    resetButtonElement,
                    selectElement,
                    selectData,
                    labelElement,
                    isFocusLost = true,
                    isMultiselectHovered = false,
                    isToggleButtonDown = false,
                    isResetButtonDown = false,
                    showAddItemTooltip = scope.showAddItemTooltip === false ? false : true,
                    validators = scope.validators ? angular.copy(scope.validators) : [],
                    previousValue,
                    unicodeNbsp = '\u00A0',
                    failedValidator = null;

                scope.previousSelectedItem = scope.previousSelectedItem || null;
                scope.isAddMode = false;
                scope.isTextFocused = false;
                scope.isValid = true;
                scope.isTouched = false;
                scope.hasAjax = angular.isObject(scope.ajax);
                scope._hasValue = false;
                scope._items = [];

                var setItems = function (items) {
                    if (scope.hasAjax || !angular.isArray(items)) {
                        return;
                    }

                    // When an array of items is completely replaced with a new array, ma-select-box-wrapper
                    // triggers a watcher which sets the value to undefined, which we do not want.
                    // So instead of replacing an array, we clear it and repopulate with new items.
                    scope._items.splice(0, scope._items.length);

                    // We need a copy of items. See 'scope.$watch('items', ...)' for an answer why.
                    var newItems = [],
                        i;

                    if (scope._type === 'object') {
                        newItems = angular.copy(items);
                    } else {
                        // Performance improvement:
                        // Convert primitive type arrays to object, to be able use item.id and item.text
                        // in view, instead of functions like getItemText.
                        for (i = 0; i < items.length; i++) {
                            if (!MaHelper.isNullOrUndefined(items[i])) {
                                var newItem = {};
                                newItem[scope._itemValueField] = items[i].toString();
                                newItems.push(newItem);
                            }
                        }
                    }

                    for (i = 0; i < newItems.length; i++) {
                        newItems[i].text = scope.getItemText(newItems[i]);
                    }

                    // Push new items to the array.
                    Array.prototype.push.apply(scope._items, newItems);
                };

                setItems(scope.items);

                // A custom 'IsNotEmpty' validator, which also checks that
                // a selected item is in the list.
                var isNotEmptyAndInListValidator = {
                    name: 'IsNotEmpty',
                    validate: function (value) {
                        if (scope.isMultiple && angular.isArray(value)) {
                            return value.length > 0;
                        }

                        if (MaHelper.isNullOrWhiteSpace(value)) {
                            return false;
                        }

                        // For array of primitives.
                        if (scope._type !== 'object' && !MaHelper.isNullOrWhiteSpace(value)) {
                            return true;
                        }

                        // In select mode check that a selected item is in the list.
                        // In AJAX mode there is no items array and we cannot check it.
                        if (!scope.hasAjax && !scope.isAddMode && !isExistingItem(value)) {
                            return false;
                        }

                        return true;
                    }
                };

                var setValidators = function () {
                    var emptyValidatorIndex = null;

                    for (var i = 0; i < validators.length; i++) {
                        if (validators[i].name === 'IsNotEmpty') {
                            emptyValidatorIndex = i;
                            validators[i] = isNotEmptyAndInListValidator;
                            break;
                        }
                    }

                    if (emptyValidatorIndex === null && scope.isRequired) {
                        validators.unshift(isNotEmptyAndInListValidator);
                    } else if (emptyValidatorIndex !== null && !scope.isRequired) {
                        validators.splice(emptyValidatorIndex, 1);
                    }
                };

                var isExistingItem = function (item) {
                    // In AJAX mode existing items can be detect the presence of id field,
                    // thus only object types are supported for now.
                    if (scope.hasAjax) {
                        return item && !MaHelper.isNullOrWhiteSpace(item[scope.itemValueField]);
                    } else {
                        for (var i = 0; i < scope._items.length; i++) {
                            // Search by value field.
                            if (scope.getItemValue(scope._items[i]) === scope.getItemValue(item)) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                var getItemByValue = function (itemValue) {
                    if (MaHelper.isNullOrWhiteSpace(itemValue)) {
                        return null;
                    }

                    if (scope._type !== 'object') {
                        return itemValue;
                    }

                    for (var i = 0; i < scope._items.length; i++) {
                        if (scope.getItemValue(scope._items[i]) === itemValue.toString()) {
                            return scope._items[i];
                        }
                    }

                    return null;
                };

                var getNewItem = function (itemText) {
                    if (MaHelper.isNullOrWhiteSpace(itemText)) {
                        return null;
                    }

                    var item = {};

                    if (scope._type === 'object') {
                        item[scope.itemTextField] = itemText;
                    } else if (itemText) {
                        item[scope._itemValueField] = itemText;
                    }

                    return item;
                };

                var setInternalValue = function (item) {
                    if (scope.isMultiple) {
                        var items = [],
                            i;

                        // Set Select2 value.
                        if (!scope.hasAjax) {
                            if (item && item.length) {
                                for (i = 0; i < item.length; i++) {
                                    items.push(scope.getItemValue(item[i]));
                                }
                            }
                        } else {
                            if (item && item.length) {
                                for (i = 0; i < item.length; i++) {
                                    items.push(item[i]);
                                }
                            }

                            items = JSON.stringify(items);
                        }

                        scope.selectedItem = items;
                        validate(item);
                    } else {
                        if (scope.canAddItem && item) {
                            // Toggle mode depending on whether provided item exists in the list.
                            // This allows the component to be displayed in correct mode, let's say, in add mode,
                            // when scope.value is initially a custom value not presented in the list.
                            scope.isAddMode = !isExistingItem(item);
                            setAddItemTooltip();
                        }

                        validate(item);

                        if (scope.isAddMode) {
                            if (MaHelper.isNullOrWhiteSpace(item)) {
                                scope.text = null;
                            } else if (scope._type === 'object') {
                                scope.text = item[scope.itemTextField].toString();
                            } else {
                                scope.text = item;
                            }

                            previousAddedItem = item;
                            scope.toggleMode('add');
                        } else {
                            if (MaHelper.isNullOrWhiteSpace(item)) {
                                scope.selectedItem = null;
                            } else if (!scope.hasAjax) {
                                scope.selectedItem = scope.getItemValue(item);
                            }

                            scope.previousSelectedItem = item;
                            scope.toggleMode('select');
                        }

                        setAddItemTooltip();
                    }

                    setHasValue();
                };

                var cleanItemValue = function (item) {
                    if (MaHelper.isNullOrWhiteSpace(item)) {
                        return null;
                    }

                    // Make a copy so deleting item.text doesn't affect item in the list.
                    // Otherwise list item will become blank.
                    var cleanItem = angular.copy(item);

                    if (scope._type === 'object') {
                        if (scope.isMultiple) {
                            for (var i = 0; i < cleanItem.length; i++) {
                                delete cleanItem[i].text;
                            }
                        } else {
                            delete cleanItem.text;
                        }
                    }

                    return cleanItem;
                };

                var onFocusout = function (event, elementName) {
                    var elementTo = angular.element(event.relatedTarget || event.toElement),
                        toResetButton = elementTo[0] === resetButtonElement[0] ? true : false,
                        toSelect = scope.isMultiple ? false : selectData.focusser[0] === elementTo[0],
                        fromToggleButton = event.target === toggleButtonElement[0],
                        fromResetButton = event.target === resetButtonElement[0];
                    scope.isTextFocused = false;

                    // Trigger change event for text element.
                    if (elementName === 'text') {
                        // Need to apply changes because onFocusout is triggered using jQuery
                        // (AngularJS does not have ng-focusout event directive).
                        scope.$apply(function () {
                            scope.isTouched = true;
                            var value;

                            // Check if value has changed.
                            if (MaHelper.isNullOrWhiteSpace(scope.text) && MaHelper.isNullOrWhiteSpace(scope.value)) {
                                return;
                            }

                            if (scope._type === 'object') {
                                if (scope.value && scope.value[scope.itemTextField] === scope.text) {
                                    return;
                                }

                                value = scope.convertItemValue(getNewItem(scope.text));
                            } else {
                                if (scope.value === scope.text) {
                                    return;
                                }

                                value = scope.text;
                            }

                            validate(value);

                            if (!scope.isValid) {
                                return;
                            }

                            value = cleanItemValue(value);
                            previousValue = cleanItemValue(scope.value) || null;
                            scope.value = value;
                            previousAddedItem = scope.value;
                            setHasValue();

                            // Don't need to trigger change second time if Reset button is clicked.
                            if (scope.isValid && !toResetButton) {
                                // Postpone change event for scope value to be updated before.
                                $timeout(function () {
                                    scope.change({
                                        maValue: scope.value,
                                        maOldValue: previousValue
                                    });
                                });
                            }
                        });
                    } else if (elementName === 'select') {
                        scope.$apply(function () {
                            scope.isTouched = true;
                        });
                    }

                    if ((fromToggleButton || fromResetButton) && toSelect) {
                        // When tabbing from Toggle or Reset button to Select2, blur event should be preventred.
                        isFocusLost = false;
                    } else {
                        // Use isToggleButtonDown/isResetButtonDown for IE, because event.toElement isn't supported.
                        // We need it in such cases when user clicks Toggle/Reset button while dropdown is open.
                        isFocusLost = !isToggleButtonDown && !isResetButtonDown &&
                            elementTo[0] !== toggleButtonElement[0] &&
                            !toResetButton &&
                            elementTo[0] !== textElement[0] &&
                            elementTo[0] !== selectData.search[0];
                    }

                    if (scope.isMultiple) {
                        var inputElement = angular.element(event.target);

                        if (inputElement.hasClass('select2-input') && inputElement.hasClass('select2-default')) {
                            // Dirty workaround that triggers blur event when clicking on active select twice.
                            isFocusLost = true;
                        } else if (isMultiselectHovered) {
                            isFocusLost = false;
                        }
                    }

                    if (isFocusLost) {
                        scope.blur({
                            maValue: scope.value
                        });
                    }
                };

                var validate = function (value) {
                    scope.isValid = true;
                    failedValidator = null;

                    if (validators && validators.length) {
                        for (var i = 0; i < validators.length; i++) {
                            if (!validators[i].validate(value)) {
                                scope.isValid = false;
                                failedValidator = validators[i];
                                break;
                            }
                        }
                    }
                };

                var setFocus = function () {
                    if (scope.isAddMode) {
                        textElement.focus();
                    } else {
                        selectElement.select2('focus');
                    }
                };

                var setHasValue = function () {
                    if (scope.isMultiple) {
                        scope._hasValue = !MaHelper.isNullOrUndefined(scope.value) && scope.value.length;
                    } else if (scope.isAddMode) {
                        scope._hasValue = !MaHelper.isNullOrWhiteSpace(scope.text);
                    } else {
                        scope._hasValue = !MaHelper.isNullOrUndefined(scope.value) && !scope.isLoading;
                    }
                };

                var setAddItemTooltip = function () {
                    if (!showAddItemTooltip || !scope.canAddItem) {
                        scope._addItemTooltip = '';
                    } else if (scope.isAddMode) {
                        scope._addItemTooltip = scope.selectItemTooltip ? scope.selectItemTooltip : 'Select' + unicodeNbsp + 'item';
                    } else {
                        scope._addItemTooltip = scope.addItemTooltip ? scope.addItemTooltip : 'Add' + unicodeNbsp + 'item';
                    }
                };

                // Compares two array of items by value field.
                // Can't use angular.equals() because internal _items are amended to have
                // text property for each item.
                var areItemsEqual = function (items1, items2) {
                    if (!items1 && !items2) {
                        return true;
                    }

                    if (items1 && !items2 || !items1 && items2 || items1.length !== items2.length) {
                        return false;
                    }

                    var areEqual = true;

                    for (var i = 0; i < items1.length; i++) {
                        if (scope._type === 'object') {
                            if (items1[i][scope._itemValueField] !== items2[i][scope._itemValueField]) {
                                areEqual = false;
                                break;
                            }
                        } else {
                            if (items1[i] !== items2[i]) {
                                areEqual = false;
                                break;
                            }
                        }
                    }

                    return areEqual;
                };

                var searchText = function (text) {
                    if (arguments.length === 1) {
                        if (selectData) {
                            selectData.searchText = text;
                        }
                    } else {
                        return selectData ? selectData.searchText : '';
                    }
                };

                scope.reset = function () {
                    previousValue = scope.value;
                    scope.value = scope.isMultiple ? [] : null;
                    setHasValue();
                };

                scope.onReset = function () {
                    scope.isTouched = true;
                    scope.reset();
                    setFocus();

                    $timeout(function () {
                        scope.change({
                            maValue: scope.value,
                            maOldValue: previousValue
                        });
                    });
                };

                scope.onFocus = function (elementName, event) {
                    if (elementName === 'text') {
                        scope.isTextFocused = true;
                    }

                    if (isFocusLost) {
                        scope.focus({
                            maValue: scope.value
                        });
                    }

                    isFocusLost = false;
                };

                scope.options.instance.focus = function () {
                    scope.onFocus();
                };

                scope.options.instance.blur = function (event) {
                    onFocusout(event, 'select');
                };

                textElement.focusout(function (event) {
                    onFocusout(event, 'text');
                });

                scope.toggleMode = function (mode, triggerChange, touch) {
                    if (!scope.canAddItem) {
                        return;
                    }

                    if (scope.isAddMode && mode === 'add' || !scope.isAddMode && mode === 'select') {
                        return;
                    }

                    var _triggerChange = true,
                        value,
                        hasValueChanged;
                    previousValue = MaHelper.isNullOrWhiteSpace(scope.value) ? null : scope.value;

                    if (mode === 'select') {
                        scope.isAddMode = false;
                        _triggerChange = false;
                    } else if (mode === 'add') {
                        scope.isAddMode = true;
                        _triggerChange = false;
                    } else {
                        scope.isAddMode = !scope.isAddMode;
                    }

                    if (typeof triggerChange === 'boolean') {
                        _triggerChange = triggerChange;
                    }

                    setAddItemTooltip();

                    // Restore previously selected or added item.
                    if (scope.isAddMode) {
                        // Sometimes select2 remains opened after it has lost focus.
                        // Make sure that it is closed in add mode.
                        if (selectElement) {
                            // selectElement is undefined when scope.toggleMode method
                            // is invoked from setInternalValue initially.
                            selectElement.select2('close');
                        }

                        if (scope.hasAjax) {
                            scope.previousSelectedItem = scope.selectedItem;
                        } else {
                            scope.previousSelectedItem = getItemByValue(scope.selectedItem);
                        }

                        if (searchText()) {
                            // Toggling to add mode when search text is entered.
                            value = scope._type === 'object' ? getNewItem(searchText()) : searchText();
                        } else {
                            value = cleanItemValue(previousAddedItem);
                        }

                        if (!MaHelper.isNullOrWhiteSpace(value)) {
                            scope.text = scope._type === 'object' ? value[scope.itemTextField] : value;
                        }

                        // Clean search text.
                        searchText('');
                    } else {
                        previousAddedItem = scope.convertItemValue(getNewItem(scope.text));
                        value = cleanItemValue(scope.previousSelectedItem);
                    }

                    validate(value);
                    hasValueChanged = !angular.equals(scope.getItemValue(value), scope.getItemValue(previousValue));

                    if (scope.isValid) {
                        scope.value = value;
                    }

                    if (touch) {
                        scope.isTouched = true;
                    }

                    setHasValue();

                    if (_triggerChange) {
                        $timeout(function () {
                            setFocus();

                            // Trigger change event as user manually swithces between custom and selected item.
                            if (scope.isValid && hasValueChanged) {
                                scope.change({
                                    maValue: scope.value,
                                    maOldValue: previousValue
                                });
                            }
                        });
                    }
                };

                scope.onChange = function () {
                    var item;

                    if (scope.isMultiple) {
                        var itemsValues = scope.selectedItem,
                            items = [];

                        if (scope.hasAjax) {
                            // Get selected items directly from Select2 component,
                            // because scope.selectedItem gives only an id of a currently selected item.
                            items = selectData.data();

                            // Value hasn't changed.
                            if (angular.equals(items, scope.value)) {
                                return;
                            }

                            previousValue = cleanItemValue(scope.value);
                        } else {
                            previousValue = cleanItemValue(scope.value);

                            for (var j = 0; j < itemsValues.length; j++) {
                                item = getItemByValue(itemsValues[j]);

                                if (item) {
                                    items.push(item);
                                }
                            }
                        }

                        scope.isTouched = true;
                        scope.value = cleanItemValue(scope.convertItemValue(items));

                        setHasValue();

                        $timeout(function () {
                            scope.change({
                                maValue: scope.value,
                                maOldValue: previousValue
                            });
                        });

                        // Invoke mouseleave on the list when it is closed for the next blur event to work properly.
                        selectData.dropdown.mouseleave();
                    } else {
                        // Validation is required if the item is a simple text, not a JSON object.
                        item = MaHelper.isJson(scope.selectedItem) ? JSON.parse(scope.selectedItem) : scope.selectedItem;

                        // In case if JSON.parse has parsed string to a number.
                        // This can happen when items is an array of numbers.
                        if (scope._type === 'number') {
                            item = scope.selectedItem;
                        }

                        // The change event works differently in AJAX mode.
                        if (scope.hasAjax) {
                            // The change event fires first time even if scope.value has not changed.
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
                        // There is no items array in AJAX mode.
                        if (!scope.hasAjax) {
                            if (scope._itemValueField && !MaHelper.isNullOrWhiteSpace(item)) {
                                for (var i = 0; i < scope._items.length; i++) {
                                    if (scope.getItemValue(scope._items[i]) === item.toString()) {
                                        item = scope._items[i];
                                        break;
                                    }
                                }
                            }
                        }

                        if (MaHelper.isNullOrWhiteSpace(item) && MaHelper.isNullOrWhiteSpace(scope.value)) {
                            return;
                        }

                        if (scope._itemValueField) {
                            var value = scope.getItemValue(scope.value);

                            if (value && value === scope.getItemValue(item)) {
                                return;
                            }
                        } else if (item === scope.value) {
                            return;
                        }

                        previousValue = cleanItemValue(scope.value);
                        scope.value = cleanItemValue(scope.convertItemValue(item));
                        scope.previousSelectedItem = item;

                        setHasValue();
                        $timeout(function () {
                            scope.change({
                                maValue: scope.value,
                                maOldValue: previousValue
                            });
                        });
                    }
                };

                // Runs initSelection to force Select2 to refresh its displayed value.
                // This is only required in AJAX mode.
                var initializeSelect2Value = function functionName() {
                    if (!scope.hasAjax || !selectData) {
                        return;
                    }

                    // If placeholder is set Select2 initSelection will not work and thus value will not be set.
                    // We need to add/remove placeholder accordingly.
                    selectData.opts.placeholder = scope.value ? '' : scope.placeholder;

                    scope.runInitSelection = true;
                    selectData.initSelection();
                };

                if (!scope.hasAjax) {
                    scope.$watch('items', function (newItems) {
                        if (areItemsEqual(scope._items, newItems)) {
                            return;
                        }

                        setItems(newItems);

                        // Set value to refresh displayed value and mode.
                        // 1 scenario:
                        // Initial value is 'Vladivostok' and items is an empty array, so mode is 'add'.
                        // Then items is set to an array containing 'Vladivostok', so
                        // mode should be toggled to 'select', because 'Vladivostok' is now exists in the list.
                        // 2 scenario:
                        // Initial value is 'Vladivostok' and items is an empty array. Select2 displays empty value.
                        // Then items are loaded asynchronously and Select2 value needs to be refreshed.
                        setInternalValue(scope.value);

                        // For some reason ma-select-box-wrapper does not trigger change for selectedItem
                        // in this case, so we need to set it manually.
                        // No need to change Select2 value when in 'add' mode.
                        if (!scope.isAddMode) {
                            $timeout(function () {
                                var itemValue,
                                    item;

                                if (MaHelper.isNullOrWhiteSpace(scope.value)) {
                                    selectData.data(null);
                                } else if (angular.isObject(scope.value)) {
                                    if (scope.isMultiple && angular.isArray(scope.value)) {
                                        var items = [];

                                        for (var i = 0; i < scope.value.length; i++) {
                                            // An item might only contain value field, which might not be enough to format the item.
                                            // So we need to get a full item from items.
                                            itemValue = scope.getItemValue(scope.value[i]);
                                            item = angular.copy(getItemByValue(itemValue) || scope.value[i]);
                                            item.text = scope.getItemText(item);
                                            item[scope._itemValueField] = itemValue;

                                            if (item) {
                                                items.push(item);
                                            }
                                        }

                                        selectData.data(items);
                                    } else {
                                        itemValue = scope.getItemValue(scope.value);
                                        item = angular.copy(getItemByValue(itemValue) || scope.value);
                                        item.text = scope.getItemText(item);
                                        item[scope._itemValueField] = itemValue;
                                        selectData.data(item);
                                    }
                                } else {
                                    selectData.val(scope.getItemValue(scope.value));
                                }
                            });
                        }
                    }, true);
                }

                scope.$watch('value', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    initializeSelect2Value();
                    setInternalValue(newValue);
                });

                // Validate text while it is being typed.
                scope.$watch('text', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    scope.isTouched = true;
                    setHasValue();
                    validate(newValue);
                });

                scope.$watch('isRequired', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    setValidators();
                    validate(scope.isAddMode ? scope.text : scope.value);
                });

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.isInitialized = true;

                    scope.instance.isEditor = function () {
                        return true;
                    };

                    scope.instance.mode = function (mode) {
                        if (arguments.length === 1) {
                            if (mode === 'select' && scope.isAddMode) {
                                scope.toggleMode('select');
                            } else if (mode === 'add' && !scope.isAddMode) {
                                scope.toggleMode('add');
                            }
                        } else {
                            return scope.isAddMode ? 'add' : 'select';
                        }
                    };

                    scope.instance.isValid = function () {
                        return scope.isValid;
                    };

                    scope.instance.validate = function () {
                        scope.isTouched = true;

                        validate(scope.isAddMode ? scope.text : scope.value);
                    };

                    scope.instance.failedValidator = function () {
                        return failedValidator;
                    };

                    scope.instance.clear = function () {
                        scope.reset();

                        $timeout(function () {
                            scope.isTouched = false;
                        });
                    };
                }

                setValidators();

                $timeout(function () {
                    // Set initial value.
                    // Value is set inside timeout to ensure that we get the latest value.
                    // If put outside timeout then there could be issues when value is set
                    // from directive's link function, not from controller.
                    setInternalValue(scope.value);

                    selectElement = angular.element(element[0].querySelector('.select2-container'));
                    selectData = selectElement.data().select2;
                    labelElement = $('label[for="' + scope.id + '"]');
                    toggleButtonElement = angular.element(element[0].querySelector('.ma-button-toggle'));
                    resetButtonElement = angular.element(element[0].querySelector('.ma-button-reset'));

                    initializeSelect2Value();

                    // Focus the component when label is clicked.
                    if (labelElement.length > 0) {
                        $($document).on('click', 'label[for="' + scope.id + '"]', function () {
                            setFocus();
                        });
                    }

                    if (scope.isMultiple) {
                        // Track that the select is hovered to prevent focus lost when a selected item
                        // or selection is clicked.
                        selectData.selection.on('mouseenter', function () {
                            isMultiselectHovered = true;
                        });

                        selectData.selection.on('mouseleave', function () {
                            isMultiselectHovered = false;
                        });

                        selectData.dropdown.on('mouseenter', function () {
                            isMultiselectHovered = true;
                        });

                        selectData.dropdown.on('mouseleave', function () {
                            isMultiselectHovered = false;
                        });

                        selectData.dropdown.on('click', function () {
                            // Return focus to the input field for the next blur event to work properly.
                            selectData.search.focus();
                        });
                    } else {
                        selectData.addItemButton.on('click', function (e) {
                            scope.$apply(function () {
                                scope.toggleMode('add', true, true);
                            });
                        });
                    }

                    toggleButtonElement.focusout(function (event) {
                        onFocusout(event);
                    });

                    resetButtonElement.focusout(function (event) {
                        onFocusout(event);
                    });

                    toggleButtonElement.mousedown(function (event) {
                        isToggleButtonDown = true;
                    });

                    toggleButtonElement.mouseup(function (event) {
                        isToggleButtonDown = false;
                    });

                    resetButtonElement.mousedown(function (event) {
                        isResetButtonDown = true;
                    });

                    resetButtonElement.mouseup(function (event) {
                        isResetButtonDown = false;
                    });

                    scope.init({
                        maInstance: scope.instance
                    });
                });
            }
        };
    }]);