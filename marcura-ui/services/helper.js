angular.module('marcuraUI.services').factory('maHelper', maHelper);

function maHelper() {
    return {
        isEmail: function(value) {
            var pattern = /^([\+\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return pattern.test(value);
        }
    };
}
