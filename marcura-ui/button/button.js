angular.module('marcuraUI.components').directive('maButton', ['MaHelper', '$sce', function (MaHelper, $sce) {
    return {
        restrict: 'E',
        scope: {
            text: '@',
            kind: '@',
            leftIcon: '@',
            rightIcon: '@',
            isDisabled: '=',
            click: '&',
            mousedown: '&',
            mouseup: '&',
            focus: '&',
            blur: '&',
            size: '@',
            modifier: '@',
            isLoading: '='
        },
        replace: true,
        template: function () {
            var html = '\
                <button class="ma-button"\
                    ng-click="onClick()"\
                    ng-mousedown="onMousedown()"\
                    ng-mouseup="onMouseup()"\
                    ng-focus="onFocus()"\
                    ng-blur="onBlur()"\
                    ng-disabled="isDisabled"\
                    ng-class="{\
                        \'ma-button-link\': isLink(),\
                        \'ma-button-has-left-icon\': hasLeftIcon,\
                        \'ma-button-has-right-icon\': hasRightIcon,\
                        \'ma-button-is-disabled\': isDisabled,\
                        \'ma-button-has-text\': hasText(),\
                        \'ma-button-is-loading\': isLoading\
                    }">\
                    <span class="ma-button-spinner" ng-if="isLoading">\
                        <div class="ma-pace">\
                            <div class="ma-pace-activity"></div>\
                        </div>\
                    </span>\
                    <span ng-if="leftIcon" class="ma-button-icon ma-button-icon-left">\
                        <i class="fa fa-{{leftIcon}}"></i>\
                        <span class="ma-button-rim" ng-if="isLink()"></span>\
                    </span><span class="ma-button-text" ng-bind-html="getText()"></span><span ng-if="rightIcon" class="ma-button-icon ma-button-icon-right">\
                        <i class="fa fa-{{rightIcon}}"></i>\
                        <span class="ma-button-rim" ng-if="isLink()"></span>\
                    </span>\
                    <span class="ma-button-rim" ng-if="!isLink()"></span>\
                </button>';

            return html;
        },
        link: function (scope, element) {
            scope.hasLeftIcon = false;
            scope.hasRightIcon = false;
            scope.size = scope.size ? scope.size : 'md';
            scope.hasLeftIcon = scope.leftIcon ? true : false;
            scope.hasRightIcon = scope.rightIcon ? true : false;
            element.addClass('ma-button-' + scope.size);
            scope.isFocused = false;

            var setModifiers = function (oldModifiers) {
                // Remove previous modifiers first.
                if (!MaHelper.isNullOrWhiteSpace(oldModifiers)) {
                    oldModifiers = oldModifiers.split(' ');

                    for (var i = 0; i < oldModifiers.length; i++) {
                        element.removeClass('ma-button-' + oldModifiers[i]);
                    }
                }

                var modifiers = '';

                if (!MaHelper.isNullOrWhiteSpace(scope.modifier)) {
                    modifiers = scope.modifier.split(' ');
                }

                for (var j = 0; j < modifiers.length; j++) {
                    element.addClass('ma-button-' + modifiers[j]);
                }
            };

            scope.onClick = function () {
                if (scope.isDisabled || scope.isLoading) {
                    return;
                }

                scope.click();
            };

            scope.onMousedown = function () {
                if (scope.isDisabled || scope.isLoading) {
                    return;
                }

                scope.mousedown();
            };

            scope.onMouseup = function () {
                if (scope.isDisabled || scope.isLoading) {
                    return;
                }

                scope.mouseup();
            };

            scope.onFocus = function () {
                if (scope.isDisabled) {
                    return;
                }

                scope.isFocused = true;
                scope.focus();
            };

            scope.onBlur = function () {
                if (scope.isDisabled) {
                    return;
                }

                scope.isFocused = false;
                scope.blur();
            };

            scope.isLink = function functionName() {
                return scope.kind === 'link';
            };

            scope.hasText = function () {
                return scope.text ? true : false;
            };

            scope.getText = function () {
                return $sce.trustAsHtml(scope.text ? scope.text : MaHelper.html.nbsp);
            };

            scope.$watch('modifier', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setModifiers(oldValue);
            });

            scope.$watch('isDisabled', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (newValue) {
                    scope.isFocused = false;
                }
            });

            setModifiers();
        }
    };
}]);