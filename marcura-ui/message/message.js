angular.module('marcuraUI.components').directive('maMessage', [function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            type: '@',
            state: '@'
        },
        replace: true,
        template: function() {
            var html = '\
                <div class="ma-message{{cssClass}}">\
                    <div class="ma-message-icon">\
                        <i class="fa" ng-class="{\
                            \'fa-info-circle\': _state === \'info\',\
                            \'fa-check-circle\': _state === \'success\',\
                            \'fa-exclamation-triangle\': _state === \'danger\' || _state === \'warning\'\
                        }"></i>\
                    </div>\
                    <div class="ma-message-text"><ng-transclude></ng-transclude></div>\
                </div>';

            return html;
        },
        link: function(scope) {
            scope._type = scope.type || 'message';
            scope._state = scope.state || 'info';
            scope.cssClass = ' ma-message-' + scope._type + ' ma-message-' + scope._state;
        }
    };
}]);
