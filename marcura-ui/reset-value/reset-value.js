angular.module('marcuraUI.components').directive('maResetValue', maResetValue);

function maResetValue() {
    return {
        restrict: 'E',
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-reset-value">\
                <i class="fa fa-times"></i>\
            </div>';

            return html;
        }
    };
}
