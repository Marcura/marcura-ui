angular.module('marcuraUI.components').directive('maTabs', ['$state', 'MaHelper', '$timeout', function ($state, MaHelper, $timeout) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            select: '&',
            useState: '='
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-tabs">\
                <ul class="ma-tabs-list clearfix">\
                    <li class="ma-tabs-item" ng-repeat="item in items"\
                        ng-focus="onFocus(item)"\
                        ng-blur="onBlur(item)"\
                        ng-keypress="onKeypress($event, item)"\
                        ng-class="{\
                            \'ma-tabs-item-is-selected\': isItemSelected(item),\
                            \'ma-tabs-item-is-disabled\': item.isDisabled,\
                            \'ma-tabs-item-is-focused\': item.isFocused\
                        }"\
                        ng-click="onSelect(item)">\
                        <a class="ma-tabs-link" href="" tabindex="-1">\
                            <span class="ma-tabs-text">{{item.text}}</span>\
                        </a>\
                    </li>\
                </ul>\
            </div>';

            return html;
        },
        link: function (scope, element, attributes) {
            scope.$state = $state;
            var useState = scope.useState === false ? false : true;

            scope.isItemSelected = function (item) {
                if (item.selector) {
                    return item.selector();
                }

                if (useState) {
                    if (item.state && item.state.name) {
                        return $state.includes(item.state.name);
                    }
                } else {
                    return item.isSelected;
                }

                return false;
            };

            scope.onSelect = function (item) {
                if (item.isDisabled || item.isSelected) {
                    return;
                }

                if (useState) {
                    if (item.state && item.state.name) {
                        $state.go(item.state.name, item.state.parameters);
                    }
                } else {
                    angular.forEach(scope.items, function (item) {
                        item.isSelected = false;
                    });
                    item.isSelected = true;

                    scope.select({
                        item: item
                    });
                }
            };

            scope.onKeypress = function (event, item) {
                if (event.keyCode === MaHelper.keyCode.enter) {
                    scope.onSelect(item);
                }
            };

            scope.onFocus = function (item) {
                item.isFocused = true;
            };

            scope.onBlur = function (item) {
                item.isFocused = false;
            };

            $timeout(function () {
                var itemElements = angular.element(element[0].querySelectorAll('.ma-tabs-item'));

                itemElements.each(function (itemIndex, itemElement) {
                    var item = scope.items[itemIndex];

                    if (!item.isDisabled) {
                        angular.element(itemElement).attr('tabindex', '0');
                    }
                });
            });
        }
    };
}]);