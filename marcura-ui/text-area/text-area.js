angular.module('marcuraUI.components').directive('maTextArea', ['$timeout', '$window', 'maHelper', function($timeout, $window, maHelper) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            value: '=',
            isDisabled: '=',
            fitContentHeight: '=',
            canResize: '='
        },
        replace: true,
        template: function($timeout) {
            var html = '\
            <div class="ma-text-area"\
                ng-class="{\
                    \'ma-text-area-is-disabled\': isDisabled,\
                    \'ma-text-area-is-focused\': isFocused,\
                    \'ma-text-area-fit-content-height\': fitContentHeight\
                }">\
                <textarea class="ma-text-area-value"\
                    type="text"\
                    ng-focus="onFocus()"\
                    ng-blur="onBlur()"\
                    ng-model="value">\
                </textarea>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var valueElement = angular.element(element[0].querySelector('.ma-text-area-value')),
                getValueElementStyle = function() {
                    var style = $window.getComputedStyle(valueElement[0], null),
                        properties = {},
                        paddingHeight = parseInt(style.getPropertyValue('padding-top')) + parseInt(style.getPropertyValue('padding-bottom')),
                        paddingWidth = parseInt(style.getPropertyValue('padding-left')) + parseInt(style.getPropertyValue('padding-right')),
                        borderHeight = parseInt(style.getPropertyValue('border-top-width')) + parseInt(style.getPropertyValue('border-bottom-width')),
                        borderWidth = parseInt(style.getPropertyValue('border-left-width')) + parseInt(style.getPropertyValue('border-right-width'));

                    properties.width = parseInt($window.getComputedStyle(valueElement[0], null).getPropertyValue('width')) - paddingWidth;
                    properties.height = parseInt($window.getComputedStyle(valueElement[0], null).getPropertyValue('height')) - paddingHeight;
                    properties.paddingHeight = paddingHeight;
                    properties.paddingWidth = paddingWidth;
                    properties.borderHeight = borderHeight;
                    properties.borderWidth = borderWidth;
                    properties.lineHeight = style.getPropertyValue('line-height');
                    properties.font = style.getPropertyValue('font');

                    return properties;
                },
                resize = function() {
                    if (!scope.fitContentHeight) {
                        return;
                    }

                    var valueElementStyle = getValueElementStyle(),
                        textHeight = maHelper.getTextHeight(scope.value, valueElementStyle.font, valueElementStyle.width + 'px', valueElementStyle.lineHeight);

                    valueElement[0].style.height = (textHeight + valueElementStyle.paddingHeight + valueElementStyle.borderHeight) + 'px';
                    element[0].style.height = (textHeight + valueElementStyle.paddingHeight + valueElementStyle.borderHeight) + 'px';
                };

            scope.isFocused = false;

            scope.onFocus = function() {
                scope.isFocused = true;
            };

            scope.onBlur = function() {
                scope.isFocused = false;
            };

            // We are forced to use input event because scope.watch does
            // not respond to Enter key when the cursor is in the end of text.
            valueElement.on('input', function(event) {
                scope.$apply(function() {
                    scope.value = valueElement.val();
                });
                resize();
            });

            angular.element($window).on('resize', function() {
                resize();
            });

            $timeout(function() {
                resize();

                if (scope.canResize === false) {
                    valueElement.css('resize', 'none');
                }

                // Move id to input.
                element.removeAttr('id');
                valueElement.attr('id', scope.id);
            });
        }
    };
}]);
