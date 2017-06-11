angular.module('marcuraUI.components').directive('maPagerNew', ['$timeout', function ($timeout) {
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
                    is-disabled="internalPage <= 1"\
                ></ma-button><ma-button\
                    class="ma-button-previous"\
                    text="Previous"\
                    size="xs"\
                    modifier="default"\
                    click="previousClick()"\
                    is-disabled="internalPage <= 1"\
                ></ma-button><ma-button\
                    class="ma-button-previous-range"\
                    text="..."\
                    size="xs"\
                    modifier="default"\
                    click="npreviousRangeClick()"\
                    is-if="true"\
                ></ma-button><div class="ma-pager-pages"><ma-button\
                    ng-repeat="pageItem in pageItems"\
                    class="ma-button-page"\
                    text="{{pageItem}}"\
                    size="xs"\
                    modifier="{{internalPage === pageItem ? \'selected\' : \'default\'}}"\
                    click="pageClick(pageItem)"></div></ma-button\
                ><ma-button\
                    class="ma-button-next-range"\
                    text="..."\
                    size="xs"\
                    modifier="default"\
                    click="nextRangeClick()"\
                    is-if="true"\
                ></ma-button><ma-button\
                    class="ma-button-next"\
                    text="Next"\
                    size="xs"\
                    modifier="default"\
                    click="nextClick()"\
                    is-disabled="internalPage >= totalPages"\
                ></ma-button><ma-button\
                    class="ma-button-last"\
                    text="Last"\
                    size="xs"\
                    modifier="default"\
                    click="lastClick()"\
                    is-disabled="internalPage >= totalPages"\
                ></ma-button>\
                </div>';

            return html;
        },
        link: function (scope) {
            var setPageItems = function () {
                var visiblePages = scope.visiblePages > 1 ? scope.visiblePages : 5;
                scope.pageItems = [];

                for (var visiblePage = 1; visiblePage <= visiblePages; visiblePage++) {
                    scope.pageItems.push(visiblePage);
                }
            };

            scope.firstClick = function () {

            };

            scope.previousClick = function () {

            };

            scope.nextClick = function () {

            };

            scope.lastClick = function () {

            };

            scope.pageClick = function (page) {
                scope.page = page;
                scope.internalPage = page;
            };

            scope.previousRangeClick = function () {

            };

            scope.nextRangeClick = function () {

            };

            $timeout(function () {
                // Set initial value.
                scope.internalPage = scope.page;
            });

            scope.$watch('visiblePages', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setPageItems();
            });

            setPageItems();
        }
    };
}]);
