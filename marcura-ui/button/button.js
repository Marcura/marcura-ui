angular.module('marcuraUI.components').directive('maButton', ['maHelper', function (maHelper) {
    return {
        restrict: 'E',
        scope: {
            text: '@',
            kind: '@',
            leftIcon: '@',
            rightIcon: '@',
            isDisabled: '=',
            click: '&',
            size: '@',
            modifier: '@',
            isLoading: '='
        },
        replace: true,
        template: function () {
            var html = '\
                <button class="ma-button"\
                    ng-click="onClick()"\
                    ng-disabled="isDisabled"\
                    ng-class="{\
                        \'ma-button-link\': isLink(),\
                        \'ma-button-has-left-icon\': hasLeftIcon,\
                        \'ma-button-has-right-icon\': hasRightIcon,\
                        \'ma-button-is-disabled\': isDisabled,\
                        \'ma-button-has-text\': hasText,\
                        \'ma-button-is-loading\': isLoading\
                    }">\
                    <span class="ma-button-spinner" ng-if="isLoading">\
                        <div class="pace">\
                            <div class="pace-activity"></div>\
                        </div>\
                    </span>\
                    <span ng-if="leftIcon" class="ma-button-icon ma-button-icon-left">\
                        <i class="fa fa-{{leftIcon}}"></i>\
                        <span class="ma-button-rim" ng-if="isLink()"></span>\
                    </span><span class="ma-button-text">{{text || \'&nbsp;\'}}</span><span ng-if="rightIcon" class="ma-button-icon ma-button-icon-right">\
                        <i class="fa fa-{{rightIcon}}"></i>\
                        <span class="ma-button-rim" ng-if="isLink()"></span>\
                    </span>\
                    <span class="ma-button-rim" ng-if="!isLink()"></span>\
                </button>';

            return html;
        },
        link: function (scope, element) {
            scope.hasText = false;
            scope.hasLeftIcon = false;
            scope.hasRightIcon = false;
            scope.size = scope.size ? scope.size : 'md';
            scope.hasLeftIcon = scope.leftIcon ? true : false;
            scope.hasRightIcon = scope.rightIcon ? true : false;
            scope.hasText = scope.text ? true : false;
            var modifiers = '';

            if (!maHelper.isNullOrWhiteSpace(scope.modifier)) {
                modifiers = scope.modifier.split(' ');
            }

            for (var i = 0; i < modifiers.length; i++) {
                element.addClass('ma-button-' + modifiers[i]);
            }

            element.addClass('ma-button-' + scope.size);

            scope.onClick = function () {
                if (scope.isDisabled || scope.isLoading) {
                    return;
                }

                scope.click();
            };

            scope.isLink = function functionName() {
                return scope.kind === 'link';
            };
        }
    };
}]);