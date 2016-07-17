angular.module('marcuraUI.components').directive('maTabs', maTabs);

function maTabs($state, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            select: '&',
            useState: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-tabs">\
                <ul class="ma-tabs-list clearfix">\
                    <li class="ma-tabs-item" ng-repeat="item in items" ng-class="{\
                            \'ma-tabs-item-is-selected\': item.isSelected,\
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
        link: function(scope) {
            var useState = scope.useState === false ? false : true,
                selectItem = function(stateName) {
                    if (!useState) {
                        return;
                    }

                    var selectedItem;

                    angular.forEach(scope.items, function(item) {
                        item.isSelected = false;

                        if (!item.isDisabled && item.state && stateName.indexOf(item.state.name) > -1) {
                            selectedItem = item;
                        }
                    });

                    if (selectedItem) {
                        selectedItem.isSelected = true;
                    }
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

            if (useState) {
                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                    selectItem(toState.name);
                });

                selectItem($state.current.name);
            }
        }
    };
}
