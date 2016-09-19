angular.module('marcuraUI.components')
    .provider('maDateBoxConfiguration', function() {
        this.$get = function() {
            return this;
        };
    })
    .directive('maDateBox', ['$timeout', 'maDateConverter', 'maHelper', 'maValidators', function($timeout, maDateConverter, maHelper, maValidators) {
        return {
            restrict: 'E',
            scope: {
                id: '@',
                date: '=',
                timeZone: '=',
                culture: '=',
                isDisabled: '=',
                isRequired: '=',
                change: '&',
                isResettable: '=',
                displayFormat: '=',
                format: '=',
                hasTime: '=',
                parser: '=',
                validators: '=',
                instance: '='
            },
            replace: true,
            template: function() {
                var html = '\
                <div class="ma-date-box" ng-class="{\
                        \'ma-date-box-has-time\': hasTime,\
                        \'ma-date-box-is-invalid\': !_isValid,\
                        \'ma-date-box-is-disabled\': isDisabled,\
                        \'ma-date-box-is-resettable\': _isResettable,\
                        \'ma-date-box-is-focused\': isFocused,\
                        \'ma-date-box-is-touched\': isTouched\
                    }">\
                    <input class="ma-date-box-date" type="text" id="{{id}}"\
                        ng-disabled="isDisabled"\
                        ng-focus="onFocus()"\
                        ng-keydown="onKeydown($event)"\
                        ng-keyup="onKeyup($event)"\
                        ng-blur="onBlur()"/><input class="ma-date-box-hours"\
                            maxlength="2"\
                            ng-disabled="isDisabled"\
                            ng-show="hasTime"\
                            ng-focus="onFocus()"\
                            ng-keydown="onKeydown($event)"\
                            ng-keyup="onKeyup($event)"\
                            ng-blur="onBlur()"\
                            ng-keydown="onTimeKeydown($event)"\
                            /><div class="ma-date-box-colon" ng-if="hasTime">:</div><input \
                            class="ma-date-box-minutes" type="text"\
                            maxlength="2"\
                            ng-disabled="isDisabled"\
                            ng-show="hasTime"\
                            ng-focus="onFocus()"\
                            ng-keydown="onKeydown($event)"\
                            ng-keyup="onKeyup($event)"\
                            ng-blur="onBlur()"\
                            ng-keydown="onTimeKeydown($event)"/>\
                    <i class="ma-date-box-icon fa fa-calendar"></i>\
                    <ma-reset-value\
                        is-disabled="!isResetEnabled()"\
                        click="onReset()"\
                        ng-show="_isResettable">\
                    </ma-reset-value>\
                </div>';

                return html;
            },
            controller: ['$scope', 'maDateBoxConfiguration', function(scope, maDateBoxConfiguration) {
                scope.configuration = {};
                scope.configuration.displayFormat = (scope.displayFormat || maDateBoxConfiguration.displayFormat || 'dd MMM yyyy')
                    .replace(/Y/g, 'y').replace(/D/g, 'd');
                scope.configuration.format = (scope.format || maDateBoxConfiguration.format || 'yyyy-MM-ddTHH:mm:ssZ')
                    .replace(/Y/g, 'y').replace(/D/g, 'd');
                scope.configuration.timeZone = (scope.timeZone || maDateBoxConfiguration.timeZone || 'Z')
                    .replace(/GMT/g, '');
            }],
            link: function(scope, element) {
                var picker = null,
                    displayFormat = scope.configuration.displayFormat,
                    format = scope.configuration.format,
                    timeZone = scope.configuration.timeZone,
                    dateElement = angular.element(element[0].querySelector('.ma-date-box-date')),
                    hoursElement = angular.element(element[0].querySelector('.ma-date-box-hours')),
                    minutesElement = angular.element(element[0].querySelector('.ma-date-box-minutes')),
                    previousDate = null,
                    timeZoneOffset = moment().utcOffset(timeZone).utcOffset(),
                    initialDisplayDate,
                    // Variables keydownValue and keyupValue help track touched state.
                    keydownValue,
                    keyupValue,
                    initialDateOffset = 0,
                    validators = scope.validators ? angular.copy(scope.validators) : [],
                    isRequired = scope.isRequired,
                    hasIsNotEmptyValidator = false,
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

                        scope.date = date ? maDateConverter.format(date, format, timeZone) : null;
                        scope.change({
                            date: scope.date
                        });
                    },
                    hasDateChanged = function(date) {
                        if ((previousDate === null && date === null) || (previousDate && date && previousDate.diff(date) === 0)) {
                            return false;
                        }

                        scope.isTouched = true;

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
                            picker.setDate(date ? date.toDate() : null, true);
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
                    },
                    resetInitialDateOffset = function () {
                        // Override initial time zone offset after date has been changed.
                        initialDateOffset = timeZoneOffset;
                    },
                    initializePikaday = function() {
                        picker = new Pikaday({
                            field: angular.element(element[0].querySelector('.ma-date-box-icon'))[0],
                            position: 'bottom right',
                            onSelect: function() {
                                var date = maDateConverter.offsetUtc(picker.getDate());

                                if (scope.hasTime) {
                                    date = addTimeToDate(date);
                                    resetInitialDateOffset();
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
                    },
                    destroyPikaday = function() {
                        if (picker) {
                            picker.destroy();
                        }
                    };

                // Set up validators.
                for (var i = 0; i < validators.length; i++) {
                    if (validators[i].name === 'IsNotEmpty') {
                        hasIsNotEmptyValidator = true;
                        break;
                    }
                }

                if (!hasIsNotEmptyValidator && isRequired) {
                    validators.unshift(maValidators.isNotEmpty());
                }

                if (hasIsNotEmptyValidator) {
                    isRequired = true;
                }

                scope._isResettable = scope.isResettable === false ? false : true;
                scope.isFocused = false;
                scope._isValid = true;
                scope.isTouched = false;

                scope.isResetEnabled = function() {
                    return !scope.isDisabled && (dateElement.val() || hoursElement.val() !== '00' || minutesElement.val() !== '00');
                };

                scope.onFocus = function() {
                    scope.isFocused = true;
                };

                scope.onBlur = function() {
                    scope.isFocused = false;

                    var date = dateElement.val().trim(),
                        isEmpty = date === '',
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
                    } else {
                        scope._isValid = false;
                        return;
                    }

                    // Date is incorrect (has not been parsed) or is empty and touched.
                    if ((!isEmpty && !maDate.date) || (isEmpty && scope.isTouched && isRequired)) {
                        scope._isValid = false;
                        return;
                    }

                    if (maDate.date) {
                        if (scope.hasTime || (!scope.isTouched && initialDisplayDate === date)) {
                            // Substruct time zone offset.
                            maDate.date = addTimeToDate(maDate.date);
                            maDate.date = maDateConverter.offsetUtc(maDate.date, -(timeZoneOffset - initialDateOffset));
                        }
                    }

                    if (!hasDateChanged(maDate.date)) {
                        setDisplayDate(maDate);
                        scope._isValid = true;
                        return;
                    }

                    if (maDate.date) {
                        setDisplayDate(maDate);
                        previousDate = maDate.date;
                    }

                    // Run validators.
                    if (validators && validators.length) {
                        scope._isValid = true;

                        for (var i = 0; i < validators.length; i++) {
                            if (!validators[i].method(maDate.date)) {
                                scope._isValid = false;
                                break;
                            }
                        }
                    }

                    if (!scope._isValid) {
                        return;
                    }

                    onChange(maDate.date);
                };

                scope.onKeydown = function(event) {
                    // Ignore tab key.
                    if (event.keyCode === maHelper.keyCode.tab || event.keyCode === maHelper.keyCode.shift) {
                        return;
                    }

                    keydownValue = angular.element(event.target).val();
                };

                scope.onKeyup = function(event) {
                    // Ignore tab key.
                    if (event.keyCode === maHelper.keyCode.tab || event.keyCode === maHelper.keyCode.shift) {
                        return;
                    }

                    keyupValue = angular.element(event.target).val();

                    if (keydownValue !== keyupValue) {
                        scope.isTouched = true;
                        resetInitialDateOffset();
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
                    if (scope.isDisabled) {
                        return;
                    }

                    previousDate = null;

                    if (isRequired) {
                        scope._isValid = false;
                        setDisplayDate();
                    } else {
                        onChange();
                    }
                };

                // Set initial date.
                if (scope.date) {
                    var maDate = {
                        date: null,
                        offset: 0
                    };

                    maDate = maDateConverter.parse(scope.date, scope.culture) || maDate;
                    maDate.date = maDateConverter.offsetUtc(maDate.date);

                    if (!maDate.date) {
                        return;
                    }

                    setDisplayDate(maDate);
                    previousDate = maDate.date;
                    initialDateOffset = maDate.offset;
                }

                $timeout(function() {
                    if (!scope.isDisabled) {
                        initializePikaday();
                    }

                    // Move id to input.
                    element.removeAttr('id');
                    dateElement.attr('id', scope.id);
                });

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

                scope.$watch('isDisabled', function(newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    if (!scope.isDisabled) {
                        initializePikaday();
                    } else {
                        destroyPikaday();
                    }
                });

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.validate = function() {
                        scope.isTouched = true;

                        if (isRequired && !scope.date) {
                            scope._isValid = false;
                            return;
                        }

                        var maDate = parseDate(scope.date);

                        if (validators && validators.length) {
                            for (var i = 0; i < validators.length; i++) {
                                if (!validators[i].method(maDate)) {
                                    scope._isValid = false;
                                    break;
                                }
                            }
                        }
                    };

                    scope.instance.isValid = function() {
                        return scope._isValid;
                    };
                }
            }
        };
    }]);
