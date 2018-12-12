angular.module('marcuraUI.components').directive('maButton', ['MaHelper', '$sce', function (MaHelper, $sce) {
    return {
        restrict: 'E',
        scope: {
            text: '@',
            leftIcon: '@',
            rightIcon: '@',
            size: '@',
            isLoading: '@',
            isDisabled: '@',
            click: '&',
            mousedown: '&',
            mouseup: '&'
        },
        replace: true,
        template: function (element, attributes) {
            var hasLeftIcon = !!attributes.leftIcon,
                hasRightIcon = !!attributes.rightIcon,
                hasText = !!attributes.text,
                hasMousedown = !!attributes.mousedown,
                hasMouseup = !!attributes.mouseup,
                size = attributes.size || 'md',
                cssClass = 'ma-button ma-button-' + size;

            if (hasLeftIcon) {
                cssClass += ' ma-button-has-left-icon';
            }

            if (hasRightIcon) {
                cssClass += ' ma-button-has-right-icon';
            }

            if (hasText) {
                cssClass += ' ma-button-has-text';
            }

            var html = '\
                <button class="'+ cssClass + '"';

            if (hasMousedown) {
                html += ' ng-mousedown="onMousedown()"';
            }

            if (hasMouseup) {
                html += ' ng-mouseup="onMouseup()"';
            }

            html += 'ng-click="onClick()">';
            html += '<span class="ma-button-spinner">\
                <div class="ma-pace">\
                    <div class="ma-pace-activity"></div>\
                </div>\
            </span>';

            if (hasLeftIcon) {
                html += '<span class="ma-button-icon ma-button-icon-left">\
                    <i class="fa fa-{{leftIcon}}"></i>\
                    <span class="ma-button-rim"></span>\
                </span>';
            }

            html += '<span class="ma-button-text" ng-bind-html="getText()"></span>';

            if (hasRightIcon) {
                html += '<span class="ma-button-icon ma-button-icon-right">\
                    <i class="fa fa-{{rightIcon}}"></i>\
                    <span class="ma-button-rim"></span>\
                </span>';
            }

            html += '<span class="ma-button-rim"></span>\
                </button>';

            return html;
        },
        link: function (scope, element) {
            var isLoading = function () {
                return element.attr('is-loading') === 'true';
            };

            var isDisabled = function () {
                return element.attr('is-disabled') === 'true';
            };

            scope.onClick = function () {
                if (isDisabled() || isLoading()) {
                    return;
                }

                scope.click();
            };

            scope.onMousedown = function () {
                if (isDisabled() || isLoading()) {
                    return;
                }

                scope.mousedown();
            };

            scope.onMouseup = function () {
                if (isDisabled() || isLoading()) {
                    return;
                }

                scope.mouseup();
            };

            scope.getText = function () {
                return $sce.trustAsHtml(scope.text ? scope.text : MaHelper.html.nbsp);
            };
        }
    };
}]);