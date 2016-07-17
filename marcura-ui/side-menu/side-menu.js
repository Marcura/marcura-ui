angular.module('marcuraUI.components').directive('maSideMenu', maSideMenu);

function maSideMenu($state, $rootScope) {
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
            <div class="ma-side-menu">\
                <div class="ma-side-menu-item" ng-repeat="item in items" ng-class="{\
                        \'ma-side-menu-item-is-selected\': item.isSelected,\
                        \'ma-side-menu-item-is-disabled\': item.isDisabled\
                    }"\
                    ng-click="onSelect(item)">\
                    <i ng-if="item.icon" class="fa fa-{{item.icon}}"></i>\
                    <div class="ma-side-menu-text">{{item.text}}</div>\
                    <div class="ma-side-menu-new" ng-if="item.new">{{item.new}}</div>\
                </div>\
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
