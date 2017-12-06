angular.module('marcuraUI.services').factory('MaValidators', ['MaHelper', 'MaDate', function (MaHelper, MaDate) {
    var formatValueToCompare = function (value) {
        if (!value) {
            return null;
        }

        var formattedValue = value.toString();

        if (MaDate.isMaDate(value)) {
            formattedValue = value.format('dd MMM yyyy');
        }

        return formattedValue;
    };

    return {
        isNotEmpty: function () {
            return {
                name: 'IsNotEmpty',
                message: 'This field cannot be empty.',
                validate: function (value) {
                    if (angular.isArray(value)) {
                        return value.length > 0;
                    }

                    return !MaHelper.isNullOrWhiteSpace(value);
                }
            };
        },

        isGreater: function (valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field cannot be less than or equal to ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsGreater',
                message: message,
                validate: function (value) {
                    if (allowEmpty && MaHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return MaHelper.isGreater(value, valueToCompare);
                }
            };
        },

        isGreaterOrEqual: function (valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field cannot be less than ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsGreaterOrEqual',
                message: message,
                validate: function (value) {
                    if (allowEmpty && MaHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return MaHelper.isGreaterOrEqual(value, valueToCompare);
                }
            };
        },

        isLengthGreaterOrEqual: function (length, allowEmpty) {
            var message = null;

            if (length) {
                message = 'Length cannot be less than ' + formatValueToCompare(length) + '.';
            }

            return {
                name: 'isLengthGreaterOrEqual',
                message: message,
                validate: function (value) {
                    if (allowEmpty && MaHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return MaHelper.isLengthGreaterOrEqual(value, length);
                }
            };
        },

        isLess: function (valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field cannot be greater than or equal to ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsLess',
                message: message,
                validate: function (value) {
                    if (allowEmpty && MaHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return MaHelper.isLess(value, valueToCompare);
                }
            };
        },

        isLessOrEqual: function (valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field cannot be greater than ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsLessOrEqual',
                message: message,
                validate: function (value) {
                    if (allowEmpty && MaHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return MaHelper.isLessOrEqual(value, valueToCompare);
                }
            };
        },

        isLengthLessOrEqual: function (length, allowEmpty) {
            var message = null;

            if (length) {
                message = 'Length cannot be greater than ' + formatValueToCompare(length) + '.';
            }

            return {
                name: 'isLengthLessOrEqual',
                message: message,
                validate: function (value) {
                    if (allowEmpty && MaHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return MaHelper.isLengthLessOrEqual(value, length);
                }
            };
        },

        isNumber: function (allowEmpty) {
            return {
                name: 'IsNumber',
                message: 'This field should be a number.',
                validate: function (value) {
                    if (allowEmpty && MaHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return MaHelper.isNumber(value);
                }
            };
        },

        isEmail: function (allowEmpty) {
            return {
                name: 'IsEmail',
                message: 'This field should be an email.',
                validate: function (value) {
                    if (allowEmpty && MaHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return MaHelper.isEmail(value);
                }
            };
        }
    };
}]);