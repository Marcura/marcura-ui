angular.module('marcuraUI.components').directive('maSpinner', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            isVisible: '@',
            size: '@',
            position: '@'
        },
        replace: true,
        template: function (element, attributes) {
            var size = attributes.size || 'xs',
                position = attributes.position || 'center',
                cssClass = 'ma-spinner ma-spinner-' + size + ' ma-spinner-' + position;

            var html = '\
                <div class="'+ cssClass + '">\
                    <div class="ma-pace">\
                        <div class="ma-pace-activity"></div>\
                    </div>\
                </div>';

            return html;
        }
    };
}]);