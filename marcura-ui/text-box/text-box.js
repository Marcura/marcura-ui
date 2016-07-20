angular.module('marcuraUI.components').directive('maTextBox', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            value: '=',
            size: '=',
            change: '&',
            isDisabled: '='
        },
        replace: true,
        template: function($timeout) {
            var html = '\
            <div class="ma-text-box"\
                ng-class="{\
                    \'ma-text-box-is-disabled\': isDisabled\
                }">\
                <input class="ma-text-box-value form-control input-{{_size}}"\
                    ng-disabled="isDisabled"\
                    type="text"\
                    ng-model="value"/>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var valueElement = angular.element(element[0].querySelector('.ma-text-box-value'));
            // valueType,

            // getValueInType = function(value) {
            //     if (!value) {
            //         return null;
            //     } else if (dateType === 'String') {
            //         return value.toString();
            //     } else if (angular.isNumber(value)) {
            //         return date;
            //     } else {
            //         return maDateConverter.format(date, format);
            //     }
            // },
            // onChange = function (value) {
            //     scope.change({
            //         value: value
            //     });
            // };

            scope._size = scope.size ? scope.size : 'sm';

            $timeout(function() {
                // move id to input
                element.removeAttr('id');
                valueElement.attr('id', scope.id);
            });

            // scope.$watch('value', function(newValue, oldValue) {
            //     if (newValue === oldValue) {
            //         return;
            //     }
            //
            //     scope.change({
            //         value: value
            //     });
            // });


            // if (scope.value) {
            //     // determine initial value type
            //     if (maHelper.isString(scope.value)) {
            //         valueType = 'String';
            //     } else {
            //         valueType = 'Number';
            //     }
            //
            //     valueElement.val(scope.value);
            // }
        }
    };
}]);
