angular.module('marcuraUI.components').directive('maDateBox', ['$timeout', 'maDateConverter', 'maHelper', function($timeout, maDateConverter, maHelper) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            date: '=',
            timeZone: '=',
            culture: '=',
            isRequired: '=',
            change: '&',
            isResettable: '=',
            displayFormat: '=',
            format: '=',
            hasTime: '=',
            parser: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-date-box" ng-class="{\
                    \'ma-date-box-has-time\': hasTime,\
                    \'ma-date-box-is-invalid\': ((isRequired && isEmpty()) || isInvalid),\
                    \'ma-date-box-is-resettable\': _isResettable,\
                    \'ma-date-box-is-focused\': isFocused\
                }">\
                <input class="ma-date-box-date" type="text" id="{{id}}"\
                    ng-required="isRequired"\
                    ng-focus="onFocus()"\
                    ng-keydown="onKeydown($event)"\
                    ng-keyup="onKeyup($event)"\
                    ng-blur="onBlur()"/><input class="ma-date-box-hours"\
                        maxlength="2"\
                        ng-show="hasTime"\
                        ng-focus="onFocus()"\
                        ng-keydown="onKeydown($event)"\
                        ng-keyup="onKeyup($event)"\
                        ng-blur="onBlur()"\
                        ng-keydown="onTimeKeydown($event)"\
                        /><div class="ma-date-box-colon" ng-if="hasTime">:</div><input \
                        class="ma-date-box-minutes" type="text"\
                        maxlength="2"\
                        ng-show="hasTime"\
                        ng-focus="onFocus()"\
                        ng-keydown="onKeydown($event)"\
                        ng-keyup="onKeyup($event)"\
                        ng-blur="onBlur()"\
                        ng-keydown="onTimeKeydown($event)"/>\
                <i class="ma-date-box-icon fa fa-calendar"></i>\
                <ma-reset-value\
                    ng-show="_isResettable && date"\
                    ng-click="onReset()">\
                </ma-reset-value>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var picker = null,
                dateType = 'String',
                displayFormat = (scope.displayFormat ? scope.displayFormat : 'dd MMM yyyy').replace(/Y/g, 'y').replace(/D/g, 'd'),
                format = (scope.format ? scope.format : 'dd MMM yyyy').replace(/Y/g, 'y').replace(/D/g, 'd'),
                dateElement = angular.element(element[0].querySelector('.ma-date-box-date')),
                hoursElement = angular.element(element[0].querySelector('.ma-date-box-hours')),
                minutesElement = angular.element(element[0].querySelector('.ma-date-box-minutes')),
                previousDate = null,
                timeZone = scope.timeZone ? scope.timeZone.replace(/GMT/g, '') : 'Z',
                timeZoneOffset = moment().utcOffset(timeZone).utcOffset(),
                isDateSetInternally = true,
                initialDisplayDate,
                // Help track changes in date, hours or minutes.
                keydownValue,
                keyupValue,
                isTouched = false,
                initialDateOffset = 0,
                onChange = function(internalDate) {
                    var date = null;

                    if (internalDate) {
                        date = moment(new Date());

                        date.year(internalDate.year())
                            .month(internalDate.month())
                            .date(internalDate.date())
                            .hours(internalDate.hours())
                            .minutes(internalDate.minutes())
                            .seconds(0);
                    }

                    scope.date = getDateInType(date);
                    scope.change({
                        date: scope.date
                    });
                },
                getDateInType = function(date) {
                    if (!date) {
                        return null;
                    } else if (dateType === 'Moment') {
                        return date;
                    } else {
                        return maDateConverter.format(date, format, timeZone);
                    }
                },
                hasDateChanged = function(date) {
                    if ((previousDate === null && date === null) || (previousDate && date && previousDate.diff(date) === 0)) {
                        return false;
                    }

                    isTouched = true;

                    return true;
                },
                setDisplayDate = function(maDate, offset) {
                    var displayDate = null;

                    if (maDate && maDate.date) {
                        // Adjust time zone offset.
                        displayDate = maDateConverter.offsetUtc(maDate.date, timeZoneOffset - maDate.offset);
                        dateElement.val(maDateConverter.format(displayDate, displayFormat));
                        hoursElement.val(maDateConverter.format(displayDate, 'HH'));
                        minutesElement.val(maDateConverter.format(displayDate, 'mm'));

                        if (!initialDisplayDate) {
                            initialDisplayDate = dateElement.val();
                        }
                    } else {
                        dateElement.val('');
                        hoursElement.val('00');
                        minutesElement.val('00');
                    }

                    setCalendarDate(displayDate);
                },
                setCalendarDate = function(date) {
                    if (picker) {
                        isDateSetInternally = true;
                        picker.setDate(date ? date.toDate() : null);
                    }
                },
                parseDate = function(date) {
                    if (!date) {
                        return null;
                    }

                    var parsedDate = null;

                    if (scope.parser) {
                        parsedDate = scope.parser(date);
                    } else {
                        parsedDate = maDateConverter.parse(date, scope.culture);

                        if (!parsedDate) {
                            return null;
                        }
                    }

                    return {
                        date: moment(parsedDate.date),
                        offset: parsedDate.offset
                    };
                },
                addTimeToDate = function(date) {
                    var _date = moment(date);

                    return moment([_date.year(), _date.month(), _date.date(), Number(hoursElement.val()), Number(minutesElement.val()), 0]);
                };

            scope._isResettable = scope.isResettable === false ? false : true;
            scope.isFocused = false;

            scope.isEmpty = function() {
                return dateElement.val() === '';
            };

            scope.onFocus = function() {
                scope.isFocused = true;
            };

            scope.onBlur = function() {
                scope.isFocused = false;
                scope.isInvalid = false;

                var date = dateElement.val().trim(),
                    isEmptyDate = date === '',
                    isValidDate = true,
                    hours = Number(hoursElement.val()),
                    minutes = Number(minutesElement.val()),
                    maDate = {
                        date: null,
                        offset: 0
                    };

                // Check time.
                if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                    maDate = parseDate(date) || maDate;
                    maDate.offset = initialDateOffset;
                }

                if (maDate.date) {
                    if (scope.hasTime || (!isTouched && initialDisplayDate === date)) {
                        // Substruct time zone offset.
                        maDate.date = addTimeToDate(maDate.date);
                        maDate.date = maDateConverter.offsetUtc(maDate.date, -(timeZoneOffset - initialDateOffset));
                    }
                }

                if (!hasDateChanged(maDate.date)) {
                    setDisplayDate(maDate);
                    scope.isInvalid = false;

                    return;
                }

                if (maDate.date) {
                    setDisplayDate(maDate);
                    previousDate = maDate.date;
                }

                isValidDate = maDate.date !== null;

                if (!isEmptyDate && !isValidDate) {
                    scope.isInvalid = true;

                    return;
                }

                if (maDate.date || isEmptyDate) {
                    scope.isInvalid = scope.isRequired && isEmptyDate && !isValidDate;
                    onChange(maDate.date);
                }
            };

            scope.onKeydown = function(event) {
                keydownValue = angular.element(event.target).val();
            };

            scope.onKeyup = function(event) {
                keyupValue = angular.element(event.target).val();

                if (keydownValue !== keyupValue) {
                    isTouched = true;

                    // Override initial time zone offset after date has been changed.
                    initialDateOffset = timeZoneOffset;
                }
            };

            scope.onTimeKeydown = function(event) {
                if (
                    // Allow backspace, tab, delete.
                    $.inArray(event.keyCode, [maHelper.keyCode.backspace, maHelper.keyCode.tab, maHelper.keyCode.delete]) !== -1 ||
                    // Allow left, right.
                    (event.keyCode === 37 || event.keyCode === 39)) {
                    return;
                }

                // Ensure that it is a number and stop the keypress.
                if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            };

            scope.onReset = function() {
                previousDate = null;
                onChange();
            };

            $timeout(function() {
                picker = new Pikaday({
                    field: angular.element(element[0].querySelector('.ma-date-box-icon'))[0],
                    position: 'bottom right',
                    onSelect: function() {
                        // This is to prevent the event from firing when the date
                        // is set internally with setCalendarDate method.
                        if (isDateSetInternally) {
                            isDateSetInternally = false;
                            return;
                        }

                        var date = maDateConverter.offsetUtc(picker.getDate());

                        if (scope.hasTime) {
                            // Substruct time zone offset.
                            date = addTimeToDate(date);
                            date = maDateConverter.offsetUtc(date, -(timeZoneOffset - initialDateOffset));
                        }

                        if (!hasDateChanged(date)) {
                            return;
                        }

                        previousDate = date;

                        // Use $timeout to apply scope changes instead of $apply,
                        // which throws digest error at this point.
                        $timeout(function() {
                            onChange(date);
                        });
                    }
                });

                setCalendarDate(previousDate);

                // Move id to input.
                element.removeAttr('id');
                dateElement.attr('id', scope.id);
            });

            // Set initial date.
            if (scope.date) {
                // Determine initial date type.
                if (scope.date && scope.date.isValid && scope.date.isValid()) {
                    dateType = 'Moment';
                }

                var maDate = {
                    date: null,
                    offset: 0
                };

                if (dateType === 'String') {
                    maDate = maDateConverter.parse(scope.date, scope.culture) || maDate;
                }

                maDate.date = maDateConverter.offsetUtc(maDate.date);

                if (!maDate.date) {
                    return;
                }

                setDisplayDate(maDate);
                previousDate = maDate.date;
                initialDateOffset = maDate.offset;
            }

            scope.$watch('date', function(newDate, oldDate) {
                if (newDate === null && oldDate === null) {
                    return;
                }

                var maDate = {
                    date: null,
                    offset: 0
                };

                maDate = parseDate(newDate) || maDate;

                if (maDate.date === null) {
                    previousDate = null;
                    setDisplayDate(null);
                }

                if (!hasDateChanged(maDate.date)) {
                    setDisplayDate(maDate);
                    return;
                }

                setDisplayDate(maDate);
                previousDate = maDate.date;
                initialDateOffset = maDate.offset;
            });
        }
    };
}]);
