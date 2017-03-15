angular.module('marcuraUI.components').directive('maMessage', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            type: '@',
            state: '@',
            size: '@',
            textAlign: '@',
            hasIcon: '='
        },
        replace: true,
        template: function () {
            var html = '\
                <div class="ma-message{{cssClass}}">\
                    <div class="ma-message-icon" ng-if="_hasIcon">\
                        <i class="fa" ng-class="{\
                            \'fa-info-circle\': _state === \'info\',\
                            \'fa-check-circle\': _state === \'success\',\
                            \'fa-exclamation-triangle\': _state === \'warning\',\
                            \'fa-times-circle\': _state === \'danger\'\
                        }"></i>\
                    </div>\
                    <div class="ma-message-text"><ng-transclude></ng-transclude></div>\
                </div>';

            return html;
        },
        link: function (scope) {
            var type = scope.type || 'message',
                size = scope.size ? scope.size : 'md';
            scope._hasIcon = scope.hasIcon === false ? false : true;

            var setState = function () {
                scope._state = scope.state || 'default';
            };

            var setCssClass = function () {
                scope.cssClass = ' ma-message-' + type + ' ma-message-' + scope._state + ' ma-message-' + size;

                if (scope.textAlign) {
                    scope.cssClass += ' ma-message-text-align-' + scope.textAlign;
                }

                if (scope._hasIcon) {
                    scope.cssClass += ' ma-message-has-icon';
                }
            };

            scope.$watch('state', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setState();
                setCssClass();
            });

            setState();
            setCssClass();
        }
    };
}]);