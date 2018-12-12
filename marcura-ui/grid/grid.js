angular.module('marcuraUI.components').directive('maGrid', ['MaHelper', function (MaHelper) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            modifier: '@',
            isResponsive: '@',
            responsiveSize: '@',
            sort: '&',
            sortBy: '=',
        },
        replace: true,
        template: function (element, attributes) {
            var cssClass = 'ma-grid';

            if (attributes.isResponsive === 'true') {
                cssClass += ' ma-grid-is-responsive';
                cssClass += ' ma-grid-responsive-size-' + (attributes.responsiveSize || 'md');
            }

            var html = '\
                <div class="'+ cssClass + '">\
                    <div class="ma-grid-inner"><ng-transclude></ng-transclude></div>\
                </div>';

            return html;
        },
        controller: ['$scope', function (scope) {
            scope.componentName = 'maGrid';
        }],
        link: function (scope, element, attributes) {
            var setModifiers = function (oldModifiers) {
                // Remove previous modifiers first.
                if (!MaHelper.isNullOrWhiteSpace(oldModifiers)) {
                    oldModifiers = oldModifiers.split(' ');

                    for (var i = 0; i < oldModifiers.length; i++) {
                        element.removeClass('ma-grid-' + oldModifiers[i]);
                    }
                }

                var modifiers = '';

                if (!MaHelper.isNullOrWhiteSpace(scope.modifier)) {
                    modifiers = scope.modifier.split(' ');
                }

                for (var j = 0; j < modifiers.length; j++) {
                    element.addClass('ma-grid-' + modifiers[j]);
                }
            };

            attributes.$observe('modifier', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setModifiers(oldValue);
            });
        }
    };
}]);