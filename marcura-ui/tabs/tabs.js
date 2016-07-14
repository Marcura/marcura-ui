angular.module('marcuraUI.components').directive('maTabs', maTabs);

function maTabs() {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            select: '&'
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
