angular.module('marcuraUI.services').factory('maHelper', maHelper);

function maHelper() {
    return {
        isDate: function(value) {
            if (!value) {
                return false;
            }

            return Object.prototype.toString.call(value) === '[object Date]' && value.getTime && !isNaN(value.getTime());
        },

        isEmail: function(value) {
            var pattern = /^([\+\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return pattern.test(value);
        }
    };
}
