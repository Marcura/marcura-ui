angular.module('marcuraUI.components').directive('maTabs', maTabs);

function maTabs($state) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            select: '&',
            useState: '=',
            itemSelector: '&'
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-tabs">\
                <ul class="ma-tabs-list clearfix">\
                    <li class="ma-tabs-item" ng-repeat="item in items" ng-class="{\
                            \'ma-tabs-item-is-selected\': isItemSelected(item),\
                            \'ma-tabs-item-is-disabled\': item.isDisabled\
                        }"\
                        ng-click="onSelect(item)">\
                        <a class="ma-tabs-link">\
                            <span class="ma-tabs-text">{{item.text}}</span>\
                        </a>\
                    </li>\
                </ul>\
            </div>';

            return html;
        },
        link: function(scope, element, attributes) {
            scope.$state = $state;
            var useState = scope.useState === false ? false : true,
                hasItemSelector = attributes.itemSelector !== undefined,
                itemSelector = function(item) {
                    if (useState) {
                        if (item.state && item.state.name) {
                            return $state.includes(item.state.name);
                        }
                    } else {
                        return item.isSelected;
                    }

                    return false;
                };

            scope.isItemSelected = function(item) {
                if (hasItemSelector) {
                    return scope.itemSelector({
                        item: item,
                        defaultItemSelector: itemSelector
                    });
                }

                return itemSelector(item);
            };

            scope.onSelect = function(item) {
                if (item.isDisabled) {
                    return;
                }

                if (useState) {
                    if (item.state && item.state.name) {
                        $state.go(item.state.name, item.state.parameters);
                    }
                } else {
                    angular.forEach(scope.items, function(item) {
                        item.isSelected = false;
                    });
                    item.isSelected = true;

                    scope.select({
                        item: item
                    });
                }
            };
        }
    };
}
