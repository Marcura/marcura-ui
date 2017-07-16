angular.module('marcuraUI.components').directive('maGrid', ['maHelper', function (maHelper) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            orderBy: '=',
            orderIsReverse: '=',
            modifier: '@',
            isResponsive: '=',
            responsiveSize: '@'
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-grid">\
                <div class="ma-grid-inner"><ng-transclude></ng-transclude></div>\
            </div>';

            return html;
        },
        controller: ['$scope', function (scope) {
            scope.componentName = 'maGrid';
        }],
        link: function (scope, element) {
            var responsiveSize = scope.responsiveSize ? scope.responsiveSize : 'md';

            var setModifiers = function (oldModifiers) {
                // Remove previous modifiers first.
                if (!maHelper.isNullOrWhiteSpace(oldModifiers)) {
                    oldModifiers = oldModifiers.split(' ');

                    for (var i = 0; i < oldModifiers.length; i++) {
                        element.removeClass('ma-grid-' + oldModifiers[i]);
                    }
                }

                var modifiers = '';

                if (!maHelper.isNullOrWhiteSpace(scope.modifier)) {
                    modifiers = scope.modifier.split(' ');
                }

                for (var j = 0; j < modifiers.length; j++) {
                    element.addClass('ma-grid-' + modifiers[j]);
                }
            };

            var setModifier = function (modifierName, modifierValue) {
                var modifier;

                if (typeof modifierValue === 'boolean') {
                    modifier = 'ma-grid-' + modifierName;

                    if (modifierValue === true) {
                        element.addClass(modifier);
                    } else {
                        element.removeClass(modifier);
                    }
                } else if (modifierValue) {
                    // Clean existing classes.
                    element.removeClass(function (index, className) {
                        return (className.match(RegExp('ma-grid-' + modifierName + '-.+', 'ig')) || []).join(' ');
                    });

                    element.addClass('ma-grid-' + modifierName + '-' + modifierValue);
                }
            };

            scope.$watch('modifier', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setModifiers(oldValue);
            });

            scope.$watch('isResponsive', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setModifier('is-responsive', scope.isResponsive);
            });

            setModifiers();
            setModifier('is-responsive', scope.isResponsive);

            if (scope.isResponsive) {
                scope.$watch('responsiveSize', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    responsiveSize = newValue;
                    setModifier('responsive-size', responsiveSize);
                });

                setModifier('responsive-size', responsiveSize);
            }
        }
    };
}]);