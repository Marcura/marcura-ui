angular.module('marcuraUI.components').directive('maSideMenu', maSideMenu);

function maSideMenu() {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            select: '&'
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
            scope.onSelect = function(item) {
                if (item.isDisabled) {
                    return;
                }

                angular.forEach(scope.items, function(item) {
                    item.isSelected = false;
                });
                item.isSelected = true;

                scope.select({
                    item: item
                });
            };
        }
    };
}
