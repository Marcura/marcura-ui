angular.module('marcuraUI.components').directive('maResetValue', [function() {
    return {
        restrict: 'E',
        scope: {
            isDisabled: '=',
            click: '&'
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-reset-value" ng-class="{\
                    \'ma-reset-value-is-disabled\': isDisabled\
                }"\
                ng-click="onClick()">\
                <i class="fa fa-times"></i>\
            </div>';

            return html;
        },
        link: function(scope, element, attributes) {
            scope.onClick = function() {
                if (!scope.isDisabled) {
                    scope.click();
                }
            };
        }
    };
}]);
