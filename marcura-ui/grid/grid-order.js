angular.module('marcuraUI.components').directive('maGridOrder', [function() {
    return {
        restrict: 'E',
        scope: {
            orderBy: '@',
            orderedBy: '=',
            direction: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-grid-order ma-grid-order-{{direction}}"\
                ng-show="orderedBy === orderBy || (orderedBy === \'-\' + orderBy)">\
                <i class="fa fa-sort-{{direction}}"></i>\
            </div>';

            return html;
        }
    };
}]);
