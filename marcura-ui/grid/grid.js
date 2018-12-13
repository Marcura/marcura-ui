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
            var _modifier;

            var setModifiers = function (oldModifiers, newModifiers) {
                // Remove previous modifiers first.
                if (!MaHelper.isNullOrWhiteSpace(oldModifiers)) {
                    oldModifiers = oldModifiers.split(' ');

                    for (var i = 0; i < oldModifiers.length; i++) {
                        element.removeClass('ma-grid-' + oldModifiers[i]);
                    }
                }

                var modifiers = '';

                if (!MaHelper.isNullOrWhiteSpace(newModifiers)) {
                    modifiers = newModifiers.split(' ');
                }

                for (var j = 0; j < modifiers.length; j++) {
                    element.addClass('ma-grid-' + modifiers[j]);
                }
            };

            attributes.$observe('modifier', function (newValue) {
                var oldValue = _modifier;

                if (newValue === oldValue) {
                    return;
                }

                _modifier = newValue;
                setModifiers(oldValue, _modifier);
            });
        }
    };
}]);