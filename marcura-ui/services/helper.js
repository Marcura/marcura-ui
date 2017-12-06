angular.module('marcuraUI.services').factory('MaHelper', ['MaDate', '$rootScope', function (MaDate, $rootScope) {
    return {
        keyCode: {
            backspace: 8,
            comma: 188,
            delete: 46,
            down: 40,
            end: 35,
            enter: 13,
            escape: 27,
            home: 36,
            left: 37,
            pageDown: 34,
            pageUp: 33,
            period: 190,
            right: 39,
            shift: 16,
            space: 32,
            tab: 9,
            up: 38,
            dash: 109,
            dash2: 189,
            numLock: {
                period: 110
            }
        },

        html: {
            nbsp: '&nbsp;'
        },

        isEmail: function (value) {
            var pattern = /^([\+\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return pattern.test(value);
        },

        isNullOrWhiteSpace: function (value) {
            if (value === null || value === undefined) {
                return true;
            }

            if (angular.isArray(value)) {
                return false;
            }

            // Convert value to string in case if it is not.
            return value.toString().replace(/\s/g, '').length < 1;
        },

        isNullOrUndefined: function (value) {
            return value === null || angular.isUndefined(value);
        },

        formatString: function (value) {
            // Source: http://ajaxcontroltoolkit.codeplex.com/SourceControl/latest#Client/MicrosoftAjax/Extensions/String.js
            var formattedString = '';

            for (var i = 0; ;) {
                // Search for curly bracers.
                var open = value.indexOf('{', i);
                var close = value.indexOf('}', i);

                // Curly bracers are not found - copy rest of string and exit loop.
                if (open < 0 && close < 0) {
                    formattedString += value.slice(i);
                    break;
                }

                if (close > 0 && (close < open || open < 0)) {
                    // Closing brace before opening is error.
                    if (value.charAt(close + 1) !== '}') {
                        throw new Error('The format string contains an unmatched opening or closing brace.');
                    }

                    formattedString += value.slice(i, close + 1);
                    i = close + 2;
                    continue;
                }

                // Copy string before brace.
                formattedString += value.slice(i, open);
                i = open + 1;

                // Check for double braces (which display as one and are not arguments).
                if (value.charAt(i) === '{') {
                    formattedString += '{';
                    i++;
                    continue;
                }

                // At this point we have valid opening brace, which should be matched by closing brace.
                if (close < 0) {
                    throw new Error('The format string contains an unmatched opening or closing brace.');
                }

                // This test is just done to break a potential infinite loop for invalid format strings.
                // The code here is minimal because this is an error condition in debug mode anyway.
                if (close < 0) {
                    break;
                }

                // Find closing brace.
                // Get string between braces, and split it around ':' (if any).
                var brace = value.substring(i, close);
                var colonIndex = brace.indexOf(':');
                var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10) + 1;

                if (isNaN(argNumber)) {
                    throw new Error('The format string is invalid.');
                }

                var arg = arguments[argNumber];

                if (typeof (arg) === 'undefined' || arg === null) {
                    arg = '';
                }

                formattedString += arg.toString();
                i = close + 1;
            }

            return formattedString;
        },

        getTextHeight: function (text, font, width, lineHeight) {
            if (!font) {
                return 0;
            }

            // Prepare textarea.
            var textArea = document.createElement('TEXTAREA');
            textArea.setAttribute('rows', 1);
            textArea.style.font = font;
            textArea.style.width = width || '0px';
            textArea.style.border = '0';
            textArea.style.overflow = 'hidden';
            textArea.style.padding = '0';
            textArea.style.outline = '0';
            textArea.style.resize = 'none';
            textArea.style.lineHeight = lineHeight || 'normal';
            textArea.value = text;

            // To measure sizes we need to add textarea to DOM.
            angular.element(document.querySelector('body')).append(textArea);

            // Measure height.
            textArea.style.height = 'auto';
            textArea.style.height = textArea.scrollHeight + 'px';

            var height = parseInt(textArea.style.height);

            // Remove textarea.
            angular.element(textArea).remove();

            return height;
        },

        isGreater: function (value, valueToCompare) {
            var date1 = new MaDate(value),
                date2 = new MaDate(valueToCompare),
                isNumber = typeof value === 'number' || typeof valueToCompare === 'number';

            if (isNumber) {
                return parseFloat(value) > parseFloat(valueToCompare);
            } else if (!date1.isEmpty() && !date2.isEmpty()) {
                return date1.isGreater(date2);
            }

            return value > valueToCompare;
        },

        isGreaterOrEqual: function (value, valueToCompare) {
            var date1 = new MaDate(value),
                date2 = new MaDate(valueToCompare),
                isNumber = typeof value === 'number' || typeof valueToCompare === 'number';

            if (isNumber) {
                return parseFloat(value) >= parseFloat(valueToCompare);
            } else if (!date1.isEmpty() && !date2.isEmpty()) {
                return date1.isGreaterOrEqual(date2);
            }

            return value >= valueToCompare;
        },

        isLengthGreaterOrEqual: function (value, length) {
            var valueLength = (value || '').toString().length;
            return valueLength >= length;
        },

        isLess: function (value, valueToCompare) {
            var date1 = new MaDate(value),
                date2 = new MaDate(valueToCompare),
                isNumber = typeof value === 'number' || typeof valueToCompare === 'number';

            if (isNumber) {
                return parseFloat(value) < parseFloat(valueToCompare);
            } else if (!date1.isEmpty() && !date2.isEmpty()) {
                return date1.isLess(date2);
            }

            return value < valueToCompare;
        },

        isLessOrEqual: function (value, valueToCompare) {
            var date1 = new MaDate(value),
                date2 = new MaDate(valueToCompare),
                isNumber = typeof value === 'number' || typeof valueToCompare === 'number';

            if (isNumber) {
                return parseFloat(value) <= parseFloat(valueToCompare);
            } else if (!date1.isEmpty() && !date2.isEmpty()) {
                return date1.isLessOrEqual(date2);
            }

            return value <= valueToCompare;
        },

        isLengthLessOrEqual: function (value, length) {
            var valueLength = (value || '').toString().length;
            return valueLength <= length;
        },

        isNumber: function (value) {
            if (typeof value === 'number') {
                return true;
            }

            if (this.isNullOrWhiteSpace(value)) {
                return false;
            }

            return value.match(/^-?\d+\.?\d*$/) !== null;
        },

        isJson: function (value) {
            try {
                JSON.parse(value);
                return true;
            } catch (error) {
                return false;
            }
        },

        safeApply: function (method) {
            var phase = $rootScope.$$phase;

            if (phase !== '$apply' && phase !== '$digest') {
                $rootScope.$apply(method);
                return;
            }

            if (method && typeof method === 'function') {
                method();
            }
        }
    };
}]);