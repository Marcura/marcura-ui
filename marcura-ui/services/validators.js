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
        },

        isGreaterThan: function(valueToCompare) {
            return {
                name: 'IsGreaterThan',
                method: function(value) {
                    return maHelper.isGreaterThan(value, valueToCompare);
                }
            };
        },

        isGreaterThanOrEqual: function(valueToCompare) {
            return {
                name: 'IsGreaterThanOrEqual',
                method: function(value) {
                    return maHelper.isGreaterThanOrEqual(value, valueToCompare);
                }
            };
        },

        isLessThan: function(valueToCompare) {
            return {
                name: 'IsLessThan',
                method: function(value) {
                    return maHelper.isLessThan(value, valueToCompare);
                }
            };
        },

        isLessThanOrEqual: function(valueToCompare) {
            return {
                name: 'IsLessThanOrEqual',
                method: function(value) {
                    return maHelper.isLessThanOrEqual(value, valueToCompare);
                }
            };
        }
    };
}]);
