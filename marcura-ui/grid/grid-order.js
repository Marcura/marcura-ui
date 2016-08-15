angular.module('marcuraUI.components').directive('maGridOrder', [function() {
    return {
        restrict: 'E',
        scope: {
            orderBy: '@',
            sorting: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-grid-order ma-grid-order-{{sorting.direction}}"\
                ng-show="sorting.orderedBy === orderBy || (sorting.orderedBy === \'-\' + orderBy)">\
                <i class="fa fa-sort-{{sorting.direction}}"></i>\
            </div>';

            return html;
        }
    };
}]);
