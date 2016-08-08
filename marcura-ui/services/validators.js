angular.module('marcuraUI.services').factory('maValidators', ['maHelper', function(maHelper) {
    return {
        isNotEmpty: function() {
            return {
                name: 'IsNotEmpty',
                method: function(value) {
                    if (angular.isArray(value)) {
                        return value.length > 0;
                    }

                    return !maHelper.isNullOrWhiteSpace(value);
                }
            };
        }
    };
}]);
