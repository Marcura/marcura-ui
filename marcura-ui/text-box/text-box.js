angular.module('marcuraUI.components').directive('maTextBox', maTextBox);

function maTextBox($timeout) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            value: '=',
            size: '='
        },
        replace: true,
        template: function($timeout) {
            var html = '\
            <div class="ma-text-box">\
                <input class="ma-text-box-value form-control input-{{_size}}"\
                    type="text"\
                    ng-model="value"/>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var valueElement = angular.element(element[0].querySelector('.ma-text-box-value'));
            scope._size = scope.size ? scope.size : 'sm';

            $timeout(function() {
                // move id to input
                element.removeAttr('id');
                valueElement.attr('id', scope.id);
            });
        }
    };
}
