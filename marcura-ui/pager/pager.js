angular.module('marcuraUI.components').directive('maPager', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            page: '=',
            totalPages: '=',
            change: '&'
        },
        replace: true,
        template: function() {
            var html = '<div class="ma-pager"\
                ><ma-button\
                    class="ma-button-previous"\
                    right-icon="chevron-left"\
                    size="xs"\
                    modifier="default"\
                    click="previousClick()"\
                    is-disabled="getPage(internalPage) <= 1"\
                ></ma-button\
                ><input class="form-control input-sm" type="text" ng-model="internalPage"\
                /><div class="ma-pager-text">of {{getPage(totalPages)}} pages</div\
                ><ma-button\
                    class="ma-button-next"\
                    right-icon="chevron-right"\
                    size="xs"\
                    modifier="default"\
                    click="nextClick()"\
                    is-disabled="getPage(internalPage) >= getPage(totalPages)">\
                </ma-button></div>';

            return html;
        },
        link: function(scope) {
            var pageCorrected = false;
            scope.internalPage = scope.page;

            scope.previousClick = function() {
                var page = scope.getPage(scope.internalPage);
                scope.internalPage = page <= 1 ? 1 : page - 1;
            };

            scope.nextClick = function() {
                var page = scope.getPage(scope.internalPage);
                scope.internalPage = page >= scope.totalPages ? 1 : page + 1;
            };

            scope.$watch('internalPage', function(newValue, oldValue) {
                var page = scope.getPage(newValue),
                    oldPage = scope.getPage(oldValue);

                if (page === oldPage) {
                    return;
                }

                if (page < 1 || page > scope.getPage(scope.totalPages)) {
                    scope.internalPage = oldPage;
                    pageCorrected = true;
                    return;
                }

                if (!pageCorrected) {
                    scope.page = page;

                    // Postpone change event for $apply (which is being invoked by $timeout)
                    // to have time to take effect and update scope.value,
                    $timeout(function() {
                        scope.change({
                            maPage: page
                        });
                    });
                }

                pageCorrected = false;
            });

            scope.$watch('page', function(newValue, oldValue) {
                scope.internalPage = scope.page;
            });

            scope.getPage = function(page) {
                page = Number(page);

                return typeof page !== 'number' || isNaN(page) ? 0 : page;
            };
        }
    };
}]);
