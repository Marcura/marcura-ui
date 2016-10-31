angular.module('marcuraUI.services').factory('maValidators', ['maHelper', 'MaDate', function(maHelper, MaDate) {
    var formatValueToCompare = function(value) {
        if (!value) {
            return null;
        }

        var formattedValue = value.toString();

        if (value instanceof MaDate) {
            formattedValue = value.format('dd MMM yyyy');
        }

        return formattedValue;
    };

    return {
        isNotEmpty: function() {
            return {
                name: 'IsNotEmpty',
                message: 'This field can not be empty.',
                validate: function(value) {
                    if (angular.isArray(value)) {
                        return value.length > 0;
                    }

                    return !maHelper.isNullOrWhiteSpace(value);
                }
            };
        },

        isGreaterThan: function(valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field can not be less than or equal to ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsGreaterThan',
                message: message,
                validate: function(value) {
                    if (allowEmpty && maHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return maHelper.isGreaterThan(value, valueToCompare);
                }
            };
        },

        isGreaterThanOrEqual: function(valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field can not be less than ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsGreaterThanOrEqual',
                message: message,
                validate: function(value) {
                    if (allowEmpty && maHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return maHelper.isGreaterThanOrEqual(value, valueToCompare);
                }
            };
        },

        isLessThan: function(valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field can not be greater than or equal to ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsLessThan',
                message: message,
                validate: function(value) {
                    if (allowEmpty && maHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return maHelper.isLessThan(value, valueToCompare);
                }
            };
        },

        isLessThanOrEqual: function(valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field can not be greater than ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsLessThanOrEqual',
                message: message,
                validate: function(value) {
                    if (allowEmpty && maHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return maHelper.isLessThanOrEqual(value, valueToCompare);
                }
            };
        }
    };
}]);
