angular.module('marcuraUI.components').directive('maGridSort', ['$timeout', function ($timeout) {
    return {
        // maGridSort should always be located inside maGrid.
        require: '^^maGrid',
        restrict: 'E',
        scope: {
            sortBy: '@'
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-grid-sort{{isVisible() ? \' ma-grid-sort-\' + direction : \'\'}}"\
                ng-click="sort()">\
                <i class="fa fa-sort-asc"></i>\
                <i class="fa fa-sort-desc"></i>\
            </div>';

            return html;
        },
        link: function (scope, element, attributes, grid) {
            var gridScope,
                headerColElement = element.closest('.ma-grid-header-col');

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

            scope.sort = function () {
                if (!gridScope) {
                    return;
                }

                var isReverse = gridScope.sortBy.charAt(0) === '-';
                isReverse = !isReverse;

                gridScope.sortBy = isReverse ? '-' + scope.sortBy : scope.sortBy;
                scope.direction = isReverse ? 'desc' : 'asc';

                // Postpone the event to allow gridScope.sortBy to change first.
                $timeout(function () {
                    gridScope.sort();
                });
            };

            var cleanSortProperty = function (property) {
                if (!property) {
                    return '';
                }

                return property.charAt(0) === '-' ? property.substring(1) : property;
            };

            if (!headerColElement.hasClass('ma-grid-header-col-sortable')) {
                headerColElement.addClass('ma-grid-header-col-sortable');
            }

            // Set a timeout before searching for maGrid scope to make sure it's been initialized.
            $timeout(function () {
                gridScope = getGridScope();

                if (cleanSortProperty(gridScope.sortBy) === scope.sortBy) {
                    scope.direction = gridScope.sortBy.charAt(0) === '-' ? 'desc' : 'asc';
                }
            });

            scope.isVisible = function () {
                if (!gridScope) {
                    return false;
                }

                return cleanSortProperty(gridScope.sortBy) === scope.sortBy;
            };
        }
    };
}]);