angular.module('marcuraUI.components').directive('maMessage', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            type: '@',
            state: '@',
            size: '@',
            textAlign: '@',
            hasIcon: '@'
        },
        replace: true,
        template: function (element, attributes) {
            var hasIcon = attributes.hasIcon === 'false' ? false : true;

            if (!attributes.state || attributes.state === 'default') {
                hasIcon = false;
            }

            var html = '<div class="ma-message">';

            if (hasIcon) {
                html += '<div class="ma-message-icon">\
                    <i class="fa"></i>\
                </div>';
            }

            html += '<div class="ma-message-text"><ng-transclude></ng-transclude></div>\
                </div>';

            return html;
        },
        link: function (scope, element, attributes) {
            var iconElement = angular.element(element[0].querySelector('.ma-message-icon .fa'));

            var setCssClass = function () {
                var size = scope.size || 'sm',
                    state = scope.state || 'default',
                    hasIcon = scope.hasIcon === 'false' ? false : true,
                    type = scope.type || 'message',
                    cssClass = 'ma-message ma-message-' + size + ' ma-message-' + state + ' ma-message-' + type,
                    iconCssClass = 'fa';

                if (state === 'default') {
                    hasIcon = false;
                }

                if (hasIcon) {
                    cssClass += ' ma-message-has-icon';
                }

                if (scope.textAlign) {
                    cssClass += ' ma-message-text-align-' + scope.textAlign;
                }

                if (state === 'info') {
                    iconCssClass += ' fa-info-circle';
                } else if (state === 'success') {
                    iconCssClass += ' fa-check-circle';
                } else if (state === 'warning') {
                    iconCssClass += ' fa-exclamation-circle';
                } else if (state === 'danger') {
                    iconCssClass += ' fa-times-circle';
                }

                element.attr('class', cssClass);
                iconElement.attr('class', iconCssClass);
            };

            attributes.$observe('state', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setCssClass();
            });

            setCssClass();
        }
    };
}]);