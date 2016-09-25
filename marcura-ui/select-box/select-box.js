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
            isSearchable: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-select-box">\
                <div class="ma-select-box-spinner" ng-if="isLoading">\
                    <div class="pace">\
                        <div class="pace-activity"></div>\
                    </div>\
                </div>\
                <select ui-select2="options"\
                    ng-disabled="isDisabled"\
                    ng-model="value"\
                    ng-change="onChange()"\
                    ng-required="isRequired">\
                    <option ng-repeat="item in items" value="{{getItemValue(item)}}">\
                        {{formatItem(item)}}\
                    </option>\
                </select>\
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
        link: function(scope) {
            scope.formatItem = scope.itemTemplate ||
                function(item) {
                    if (!item) {
                        return '';
                    }

                    return scope.itemTextField ? item[scope.itemTextField] : item.toString();
                };

            // Set initial value.
            if (scope.selectedItem) {
                if (scope.itemValueField) {
                    scope.value = scope.selectedItem[scope.itemValueField].toString();
                } else if (typeof scope.selectedItem === 'string') {
                    scope.value = scope.selectedItem;
                } else {
                    scope.value = JSON.stringify(scope.selectedItem);
                }
            }

            scope.getItemValue = function(item) {
                return scope.itemValueField ? item[scope.itemValueField].toString() : item;
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

                $timeout(function() {
                    scope.change({
                        item: item
                    });
                });
            };
        }
    };
}]);
