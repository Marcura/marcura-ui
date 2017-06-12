// TODO:
// - Include items per page select box with a parameter showItemsPerPage, which is enabled by default.
// - If all items fit in one page hide the pager.
// - Mobile view.

angular.module('marcuraUI.components').directive('maPager', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            page: '=',
            totalPages: '=',
            visiblePages: '=',
            change: '&'
        },
        replace: true,
        template: function () {
            var html = '<div class="ma-pager"\
                ><ma-button\
                    class="ma-button-first"\
                    text="First"\
                    size="xs"\
                    modifier="default"\
                    click="firstClick()"\
                    is-disabled="_page <= 1"\
                ></ma-button><ma-button\
                    class="ma-button-previous"\
                    text="Previous"\
                    size="xs"\
                    modifier="default"\
                    click="previousClick()"\
                    is-disabled="_page <= 1"\
                ></ma-button><ma-button\
                    class="ma-button-previous-range"\
                    text="..."\
                    size="xs"\
                    modifier="default"\
                    click="previousRangeClick()"\
                    is-disabled="isFirstRange"\
                ></ma-button><div class="ma-pager-pages"><ma-button\
                    ng-repeat="rangePage in rangePages"\
                    class="ma-button-page"\
                    text="{{rangePage}}"\
                    size="xs"\
                    modifier="{{_page === rangePage ? \'selected\' : \'default\'}}"\
                    click="pageClick(rangePage)"></div></ma-button\
                ><ma-button\
                    class="ma-button-next-range"\
                    text="..."\
                    size="xs"\
                    modifier="default"\
                    click="nextRangeClick()"\
                    is-disabled="isLastRange"\
                ></ma-button><ma-button\
                    class="ma-button-next"\
                    text="Next"\
                    size="xs"\
                    modifier="default"\
                    click="nextClick()"\
                    is-disabled="_page >= totalPages"\
                ></ma-button><ma-button\
                    class="ma-button-last"\
                    text="Last"\
                    size="xs"\
                    modifier="default"\
                    click="lastClick()"\
                    is-disabled="_page >= totalPages"\
                ></ma-button>\
            </div>';

            return html;
        },
        link: function (scope) {
            scope._page = scope.page;

            var setRangePages = function () {
                scope._visiblePages = scope.visiblePages > 1 ? scope.visiblePages : 5;

                if (scope.totalPages < scope._visiblePages) {
                    scope._visiblePages = scope.totalPages;
                }

                scope.rangePages = [];
                scope.range = Math.ceil(scope._page / scope._visiblePages) - 1;
                scope.isFirstRange = scope.range === 0;
                scope.isLastRange = scope.totalPages - scope._page < scope._visiblePages;
                var startPage = scope.range * scope._visiblePages;

                for (var visiblePage = 1; visiblePage <= scope._visiblePages; visiblePage++) {
                    scope.rangePages.push(startPage + visiblePage);
                }
            };

            var onChange = function () {
                if (scope.page === scope._page) {
                    return;
                }

                scope.page = scope._page;
                setRangePages();

                // Postpone change event for $apply (which is being invoked by $timeout)
                // to have time to take effect and update scope.page.
                $timeout(function () {
                    scope.change({
                        maPage: scope.page
                    });
                });
            };

            scope.firstClick = function () {
                scope._page = 1;
                onChange();
            };

            scope.previousClick = function () {
                scope._page = scope._page <= 1 ? 1 : scope._page - 1;
                onChange();
            };

            scope.nextClick = function () {
                scope._page = scope._page >= scope.totalPages ? 1 : scope._page + 1;
                onChange();
            };

            scope.lastClick = function () {
                scope._page = scope.totalPages;
                onChange();
            };

            scope.pageClick = function (page) {
                scope._page = page;
                onChange();
            };

            scope.previousRangeClick = function () {
                scope._page = scope.range * scope._visiblePages;
                onChange();
            };

            scope.nextRangeClick = function () {
                scope._page = scope.range * scope._visiblePages + scope._visiblePages + 1;
                onChange();
            };

            scope.$watch('visiblePages', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setRangePages();
            });

            scope.$watch('page', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                var page = scope.page;

                // Correct page.
                if (page < 1) {
                    page = 1;
                } else if (page > scope.totalPages) {
                    page = scope.totalPages;
                }

                scope._page = page;
                setRangePages();
            });

            setRangePages();
        }
    };
}]);