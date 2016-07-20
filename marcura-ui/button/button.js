angular.module('marcuraUI.components').directive('maButton', [function() {
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
            modifier: '@'
        },
        replace: true,
        template: function() {
            var html = '\
            <button class="ma-button{{cssClass}}"\
                ng-click="onClick()"\
                ng-disabled="isDisabled"\
                ng-class="{\
                    \'ma-button-link\': kind === \'link\',\
                    \'ma-button-has-left-icon\': hasLeftIcon,\
                    \'ma-button-has-right-icon\': hasRightIcon,\
                    \'ma-button-is-disabled\': isDisabled,\
                    \'ma-button-has-text\': hasText\
                }">\
                <span ng-if="leftIcon" class="ma-button-icon ma-button-icon-left">\
                    <i class="fa fa-{{leftIcon}}"></i>\
                </span><span class="ma-button-text">{{text || \'&nbsp;\'}}</span><span ng-if="rightIcon" class="ma-button-icon ma-button-icon-right">\
                    <i class="fa fa-{{rightIcon}}"></i>\
                </span>\
            </button>';

            return html;
        },
        link: function(scope) {
            scope.hasText = false;
            scope.hasLeftIcon = false;
            scope.hasRightIcon = false;
            scope.size = scope.size ? scope.size : 'md';
            scope.cssClass = ' ma-button-' + scope.size;
            scope.hasLeftIcon = scope.leftIcon ? true : false;
            scope.hasRightIcon = scope.rightIcon ? true : false;
            scope.hasText = scope.text ? true : false;

            if (scope.modifier) {
                scope.cssClass += ' ma-button-' + scope.modifier;
            }

            scope.onClick = function() {
                if (!scope.isDisabled) {
                    scope.click();
                }
            };
        }
    };
}]);
