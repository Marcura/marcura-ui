angular.module('marcuraUI.components').directive('maSideMenu', ['$sce', function ($sce) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            select: '&'
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-side-menu">\
                <div class="ma-side-menu-item" ng-repeat="item in items" ng-hide="item.isHidden" ng-class="{\
                        \'ma-side-menu-item-is-selected\': isItemSelected(item),\
                        \'ma-side-menu-item-is-disabled\': item.isDisabled\
                    }"\
                    ng-click="onSelect(item)">\
                    <i ng-if="item.icon" class="fa fa-{{item.icon}}"></i>\
                    <div class="ma-side-menu-text" ng-bind-html="getItemText(item)"></div>\
                    <div class="ma-side-menu-new" ng-if="item.new">{{item.new}}</div>\
                </div>\
            </div>';

            return html;
        },
        link: function (scope, element, attributes) {
            scope.isItemSelected = function (item) {
                if (item.selector) {
                    return item.selector();
                }

                return item.isSelected;
            };

            scope.onSelect = function (item) {
                if (item.isDisabled) {
                    return;
                }

                if (!item.selector) {
                    angular.forEach(scope.items, function (item) {
                        item.isSelected = false;
                    });
                    item.isSelected = true;
                }

                scope.select({
                    item: item
                });
            };

            scope.getItemText = function (item) {
                return $sce.trustAsHtml(item.text);
            };
        }
    };
}]);