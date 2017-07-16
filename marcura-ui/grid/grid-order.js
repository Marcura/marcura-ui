angular.module('marcuraUI.components').directive('maGridOrder', ['maHelper', function (maHelper) {
    return {
        // maGridOrder should always be located inside maGrid.
        require: '^^maGrid',
        restrict: 'E',
        scope: {
            orderBy: '@'
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-grid-order ma-grid-order-{{direction}}"\
                ng-show="isVisible()"\
                ng-click="order()">\
                <i class="fa fa-sort-{{direction}}"></i>\
            </div>';

            return html;
        },
        link: function (scope, element, attributes, grid) {
            var getGridScope = function () {
                var gridScope = null,
                    initialScope = scope.$parent;

                while (initialScope && !gridScope) {
                    if (initialScope.hasOwnProperty('componentName') && initialScope.componentName === 'maGrid') {
                        gridScope = initialScope;
                    } else {
                        initialScope = initialScope.$parent;
                    }
                }

                return gridScope;
            };

            var gridScope = getGridScope(),
                headerColElement = element.closest('.ma-grid-header-col'),
                captionElement = element.closest('.ma-grid-caption');

            if (!headerColElement.hasClass('ma-grid-header-col-sortable')) {
                headerColElement.addClass('ma-grid-header-col-sortable');
            }

            var order = function () {
                gridScope.orderBy = scope.orderBy;
                gridScope.orderIsReverse = !gridScope.orderIsReverse;
                scope.direction = gridScope.orderIsReverse ? 'desc' : 'asc';
            };

            if (gridScope.orderBy === scope.orderBy) {
                scope.direction = gridScope.orderIsReverse ? 'desc' : 'asc';
            }

            scope.isVisible = function () {
                return gridScope.orderBy === scope.orderBy;
            };

            captionElement.on('click', function () {
                maHelper.safeApply(function () {
                    order();
                });
            });
        }
    };
}]);