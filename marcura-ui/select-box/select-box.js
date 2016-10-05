angular.module('marcuraUI.components')
    .filter('maSelectBoxOrderBy', ['orderByFilter', function(orderByFilter) {
        return function(items, orderByExpression) {
            if (orderByExpression) {
                return orderByFilter(items, orderByExpression);
            }

            return items;
        };
    }])
    .directive('maSelectBox', ['$document', '$timeout', 'maHelper', function($document, $timeout, maHelper) {
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
                isSearchable: '=',
                canAddItem: '=',
                addItemTooltip: '@',
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
                        <option ng-repeat="item in items | maSelectBoxOrderBy:orderBy" value="{{getItemValue(item)}}">\
                            {{formatItem(item)}}\
                        </option>\
                    </select>\
                    <input class="ma-select-box-input" type="text" ng-show="addingItem"\
                        ng-model="text"\
                        ng-disabled="isDisabled"\
                        ng-focus="onFocus(\'input\')"/>\
                    <ma-button ng-if="canAddItem" size="xs" modifier="simple"\
                        tooltip="{{getAddItemTooltip()}}"\
                        right-icon="{{addingItem ? \'bars\' : \'plus\'}}"\
                        click="toggleView()"\
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
                    isItemHovered = false;

                scope.addingItem = false;
                scope.formatItem = scope.itemTemplate ||
                    function(item) {
                        if (!item) {
                            return '';
                        }

                        return scope.itemTextField ? item[scope.itemTextField] : item.toString();
                    };
                scope.isFocused = false;

                var setValue = function(item) {
                    if (!item) {
                        scope.value = null;
                        scope.text = null;
                        previousAddedItem = null;
                    } else {
                        if (scope.itemValueField && item[scope.itemValueField]) {
                            scope.value = item[scope.itemValueField].toString();
                        } else if (typeof item === 'string') {
                            scope.value = item;
                        } else {
                            scope.value = JSON.stringify(item);
                        }
                    }
                };

                // $(document).click(function (event) {
                //     console.log('document:', event);
                // });

                var onFocusout = function(event, elementName) {
                    var elementTo = angular.element(event.relatedTarget),
                        selectInputElement = angular.element(selectData.dropdown[0].querySelector('.select2-input'));
                    console.log('blur');
                    // console.log($(selectData.container).hasClass('select2-container-active'));
                    // console.log($('.select2-container-active', selectElement));
                    // var isSelect2Active = $('.select2-container-active', selectElement).length === 1;
                    // console.log('isSelect2Active:', isSelect2Active);

                    scope.isFocused = false;

                    console.log('to:', elementTo.attr('class'));

                    // Trigger change event for text input.
                    if (elementName === 'input') {
                        // Need to apply changes because onFocusout is triggered using jQuery
                        // (AngularJS does not have ng-focusout event directive).
                        scope.$apply(function() {
                            if (scope.itemTextField) {
                                if (scope.selectedItem && scope.selectedItem[scope.itemTextField] === scope.text) {
                                    return;
                                }

                                if (scope.text) {
                                    scope.selectedItem = {};
                                    scope.selectedItem[scope.itemTextField] = scope.text;
                                } else {
                                    scope.selectedItem = null;
                                }
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
                    }

                    // Trigger blur event when focus goes to an element outside the component.
                    if (!isItemHovered &&
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

                    isItemHovered = false;
                };

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

                scope.toggleView = function(view) {
                    var isInternalCall = false;

                    if (view === 'select') {
                        scope.addingItem = false;
                        isInternalCall = true;
                    } else if (view === 'add') {
                        scope.addingItem = true;
                        isInternalCall = true;
                    } else {
                        scope.addingItem = !scope.addingItem;
                    }

                    // Restore previously selected or added item.
                    if (scope.addingItem) {
                        // Sometimes select2 remains opened after it has lost focus.
                        // Make sure that it is closed in 'add' view.
                        selectElement.select2('close');
                        previousSelectedItem = scope.selectedItem;
                        scope.selectedItem = previousAddedItem;

                        if (scope.selectedItem) {
                            scope.text = typeof scope.selectedItem === 'string' ? scope.selectedItem : scope.selectedItem[scope.itemTextField];
                        }
                    } else {
                        previousAddedItem = scope.selectedItem;
                        scope.selectedItem = previousSelectedItem;
                    }

                    if (!isInternalCall) {
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
                                selectElement.select2('focus');
                            }
                        });
                    }
                };

                scope.onFocus = function(elementName) {
                    if (elementName === 'input') {
                        scope.isFocused = true;
                    }

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

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.showSelectView = function() {
                        if (scope.addingItem) {
                            scope.toggleView('select');
                        }
                    };

                    scope.instance.showAddView = function() {
                        if (!scope.addingItem) {
                            scope.toggleView('add');
                        }
                    };
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
                            if (scope.addingItem) {
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
                        onFocusout(event);
                    });

                    selectData.dropdown.on('focus', '.select2-input', function() {
                        scope.onFocus();
                    });

                    selectData.dropdown.on('focusout', '.select2-input', function(event) {
                        onFocusout(event);
                    });

                    buttonElement.focusout(function(event) {
                        onFocusout(event);
                    });

                    // Detect if item in the list is hovered.
                    // This is later used for triggering blur event correctly.
                    selectData.dropdown.on('mouseenter', '.select2-result', function() {
                        isItemHovered = true;
                    });
                });
            }
        };
    }]);
