angular.module('marcuraUI.components').directive('maGridOrder', ['maHelper', '$timeout', function (maHelper, $timeout) {
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
            var gridScope,
                headerColElement = element.closest('.ma-grid-header-col'),
                captionElement = element.closest('.ma-grid-caption');

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

            var order = function () {
                if (!gridScope) {
                    return;
                }

                var isReverse = gridScope.orderBy.charAt(0) === '-';
                isReverse = !isReverse;
                gridScope.orderBy = isReverse ? '-' + scope.orderBy : scope.orderBy;
                scope.direction = isReverse ? 'desc' : 'asc';
            };

            var cleanOrderBy = function (orderBy) {
                return orderBy.charAt(0) === '-' ? orderBy.substring(1) : orderBy;
            };

            if (!headerColElement.hasClass('ma-grid-header-col-sortable')) {
                headerColElement.addClass('ma-grid-header-col-sortable');
            }

            // Set a timeout before searching for maGrid scope to make sure it's been initialized.
            $timeout(function () {
                gridScope = getGridScope();

                if (cleanOrderBy(gridScope.orderBy) === scope.orderBy) {
                    scope.direction = gridScope.orderBy.charAt(0) === '-' ? 'desc' : 'asc';
                }
            });

            scope.isVisible = function () {
                if (!gridScope) {
                    return false;
                }

                return cleanOrderBy(gridScope.orderBy) === scope.orderBy;
            };

            captionElement.on('click', function () {
                maHelper.safeApply(function () {
                    order();
                });
            });
        }
    };
}]);