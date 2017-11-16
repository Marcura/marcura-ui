angular.module('marcuraUI.components').directive('maCostsGrid', [function () {
    return {
        restrict: 'E',
        scope: {
            costItems: '='
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-grid ma-grid-costs"\
                costs grid\
            </div>';

            return html;
        },
        link: function (scope) {
            console.log('scope.costItems:', scope.costItems);
        }
    };
}]);