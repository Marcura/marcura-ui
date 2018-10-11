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

                gridScope.sortBy.isAsc = !gridScope.sortBy.isAsc;
                gridScope.sortBy.field = scope.sortBy;
                scope.direction = gridScope.sortBy.isAsc ? 'asc' : 'desc';

                // Postpone the event to allow gridScope.sortBy to change first.
                $timeout(function () {
                    gridScope.sort();
                });
            };


            if (!headerColElement.hasClass('ma-grid-header-col-sortable')) {
                headerColElement.addClass('ma-grid-header-col-sortable');
            }

            scope.isVisible = function () {
                if (!gridScope) {
                    return false;
                }

                return gridScope.sortBy.field === scope.sortBy;
            };

            // Set a timeout before searching for maGrid scope to make sure it's been initialized.
            $timeout(function () {
                gridScope = getGridScope();
                scope.direction = gridScope.sortBy.isAsc ? 'asc' : 'desc';
            });
        }
    };
}]);