angular.module('marcuraUI.components').directive('maPager', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            page: '=',
            totalItems: '=',
            visiblePages: '=',
            showItemsPerPage: '=',
            itemsPerPageNumbers: '=',
            itemsPerPageText: '@',
            itemsPerPage: '=',
            change: '&'
        },
        replace: true,
        template: function () {
            var html = '<div class="ma-pager" ng-class="{\
                \'ma-pager-has-pager\': _hasPager\
            }">\
                <div class="ma-pager-items-per-page" ng-if="_showItemsPerPage">\
                    <div class="ma-pager-items-per-page-text" ng-show="itemsPerPageText">{{itemsPerPageText}}</div><ma-select-box\
                        type="number"\
                        items="_itemsPerPageNumbers"\
                        value="_itemsPerPage"\
                        change="itemsPerPageChange(maValue, maOldValue)">\
                    </ma-select-box>\
                </div><div class="ma-pager-pager">\
                    <div class="ma-pager-start">\
                        <ma-button\
                            class="ma-button-first"\
                            text="First"\
                            size="xs"\
                            default\
                            click="firstClick()"\
                            is-disabled="{{_page <= 1}}"\
                        ></ma-button><ma-button\
                            class="ma-button-previous"\
                            text="Previous"\
                            size="xs"\
                            default\
                            click="previousClick()"\
                            is-disabled="{{_page <= 1}}">\
                        </ma-button>\
                    </div\
                    ><div class="ma-pager-middle">\
                        <ma-button\
                            class="ma-button-previous-range"\
                            text="..."\
                            size="xs"\
                            default\
                            click="previousRangeClick()"\
                            is-disabled="{{isFirstRange}}"\
                        ></ma-button><div class="ma-pager-pages"><ma-button\
                            ng-repeat="rangePage in rangePages"\
                            class="ma-button-page"\
                            text="{{rangePage}}"\
                            size="xs"\
                            ng-attr-selected="{{_page === rangePage || undefined}}"\
                            ng-attr-default="{{_page !== rangePage || undefined}}"\
                            click="pageClick(rangePage)"></div></ma-button\
                        ><ma-button\
                            class="ma-button-next-range"\
                            text="..."\
                            size="xs"\
                            default\
                            click="nextRangeClick()"\
                            is-disabled="{{isLastRange}}"\
                        ></ma-button>\
                    </div\
                    ><div class="ma-pager-end">\
                        <ma-button\
                            class="ma-button-next"\
                            text="Next"\
                            size="xs"\
                            default\
                            click="nextClick()"\
                            is-disabled="{{_page >= totalPages}}"\
                        ></ma-button><ma-button\
                            class="ma-button-last"\
                            text="Last"\
                            size="xs"\
                            default\
                            click="lastClick()"\
                            is-disabled="{{_page >= totalPages}}">\
                        </ma-button>\
                    </div>\
                </div>\
            </div>';

            return html;
        },
        link: function (scope) {
            scope._page = scope.page;
            scope._showItemsPerPage = scope.showItemsPerPage === false ? false : true;
            scope._itemsPerPageNumbers = [25, 50, 75, 100];
            scope._itemsPerPage = 25;
            scope.hasItemsPerPageChanged = false;
            scope._totalItems = scope.totalItems >= 0 ? scope.totalItems : 0;

            var setTotalPages = function () {
                scope.totalPages = Math.ceil(scope._totalItems / scope._itemsPerPage);
            };

            var setItemsPerPage = function () {
                if (!scope._showItemsPerPage || !scope.itemsPerPage) {
                    return;
                }

                scope._itemsPerPage = scope.itemsPerPage;
            };

            var setItemsPerPageNumbers = function () {
                if (!scope._showItemsPerPage) {
                    return;
                }

                if (angular.isArray(scope.itemsPerPageNumbers)) {
                    scope._itemsPerPageNumbers = scope.itemsPerPageNumbers;
                }
            };

            var setRangePages = function () {
                scope._visiblePages = scope.visiblePages > 1 ? scope.visiblePages : 5;

                if (scope.totalPages < scope._visiblePages) {
                    scope._visiblePages = scope.totalPages || 1;
                }

                scope.rangePages = [];
                scope.range = Math.ceil(scope._page / scope._visiblePages) - 1;
                scope.isFirstRange = scope.range === 0;
                scope.isLastRange = scope.range === Math.ceil(scope.totalPages / scope._visiblePages) - 1;
                var startPage = scope.range * scope._visiblePages;

                for (var visiblePage = 1; visiblePage <= scope._visiblePages && startPage + visiblePage <= scope.totalPages; visiblePage++) {
                    scope.rangePages.push(startPage + visiblePage);
                }
            };

            var setHasPager = function () {
                scope._hasPager = !scope._showItemsPerPage || (scope.totalPages * scope._itemsPerPage > scope._itemsPerPage);
            };

            var onChange = function () {
                if (scope.page === scope._page && !scope.hasItemsPerPageChanged) {
                    return;
                }

                scope.page = scope._page || null;
                setRangePages();

                var value = {
                    maPage: scope.page
                };

                if (scope._showItemsPerPage) {
                    value.maItemsPerPage = scope._itemsPerPage;
                    scope.hasItemsPerPageChanged = false;

                    // If itemsPerPage is set update its value.
                    if (scope.itemsPerPage !== undefined) {
                        scope.itemsPerPage = value.maItemsPerPage;
                    }
                }

                // Postpone change event for $apply (which is being invoked by $timeout)
                // to have time to take effect and update scope.page.
                $timeout(function () {
                    scope.change(value);
                });
            };

            scope.itemsPerPageChange = function (itemsPerPage, oldItemsPerPage) {
                scope._itemsPerPage = itemsPerPage;
                scope.hasItemsPerPageChanged = true;
                var oldTotalPages = scope.totalPages;
                scope.totalPages = Math.ceil(scope._totalItems / scope._itemsPerPage);
                var firstVisibleItem = (oldItemsPerPage * scope.page) - oldItemsPerPage + 1;
                scope._page = Math.ceil(firstVisibleItem / itemsPerPage);

                setHasPager();
                onChange();
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

            scope.$watch('totalItems', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                scope._totalItems = scope.totalItems < 0 ? 0 : scope.totalItems;
                setTotalPages();

                // Correct the page and trigger change.
                if (scope._totalItems === 0 || scope._totalItems <= scope._itemsPerPage) {
                    scope._page = 1;
                    onChange();
                    setHasPager();
                    return;
                }

                setRangePages();
                setHasPager();
            });

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

                // Correct page to 1 in case totalPages is 0 and page is 0.
                scope._page = page || 1;
                setRangePages();
                setHasPager();
            });

            scope.$watch('itemsPerPageNumbers', function (newValue, oldValue) {
                if (angular.equals(newValue, oldValue)) {
                    return;
                }

                setItemsPerPageNumbers();
            });

            scope.$watch('itemsPerPage', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setItemsPerPage();
                setHasPager();
            });

            setItemsPerPageNumbers();
            setItemsPerPage();
            setTotalPages();
            setRangePages();
            setHasPager();
        }
    };
}]);