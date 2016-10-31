angular.module('marcuraUI.components')
    .provider('maDateBoxConfiguration', function() {
        this.$get = function() {
            return this;
        };
    })
    .directive('maDateBox', ['$timeout', 'MaDate', 'maHelper', 'maValidators', function($timeout, MaDate, maHelper, maValidators) {
        return {
            restrict: 'E',
            scope: {
                id: '@',
                value: '=',
                timeZone: '=',
                culture: '=',
                isDisabled: '=',
                isRequired: '=',
                change: '&',
                canReset: '=',
                displayFormat: '=',
                format: '=',
                hasTime: '=',
                parser: '=',
                validators: '=',
                instance: '=',
                minDate: '=',
                maxDate: '='
            },
            replace: true,
            template: function(element, attributes) {
                var html = '\
                <div class="ma-date-box" ng-class="{\
                        \'ma-date-box-has-time\': hasTime,\
                        \'ma-date-box-is-invalid\': !isValid,\
                        \'ma-date-box-is-disabled\': isDisabled,\
                        \'ma-date-box-is-focused\': isFocused,\
                        \'ma-date-box-is-touched\': isTouched,\
                        \'ma-date-box-can-reset\': canReset,\
                        \'ma-date-box-is-reset-disabled\': canReset && !isDisabled && !isResetEnabled()\
                    }">\
                    <div class="ma-date-box-inner">\
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
                    </div>\
                    <ma-button class="ma-button-reset"\
                        ng-show="canReset" size="xs" modifier="simple"\
                        right-icon="times-circle"\
                        click="onReset()"\
                        is-disabled="!isResetEnabled()">\
                    </ma-button>\
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
                    timeZoneOffset = MaDate.parseTimeZone(timeZone),
                    initialDisplayDate,
                    // Variables keydownValue and keyupValue help track touched state.
                    keydownValue,
                    keyupValue,
                    initialDateOffset = 0,
                    validators = [],
                    isRequired = scope.isRequired,
                    minDate = new MaDate(scope.minDate),
                    maxDate = new MaDate(scope.maxDate);

                var onChange = function(internalDate) {
                    var date = null;
                    previousDate = internalDate;

                    if (internalDate) {
                        date = moment(new Date());

                        date.year(internalDate.year())
                            .month(internalDate.month())
                            .date(internalDate.date())
                            .hours(internalDate.hours())
                            .minutes(internalDate.minutes())
                            .seconds(0);
                    }

                    scope.value = date ? MaDate.format(date, format, timeZone) : null;

                    // Postpone change event for $apply (which is being invoked by $timeout)
                    // to have time to take effect and update scope.value,
                    // so both maValue and scope.value have the same values eventually.
                    $timeout(function() {
                        scope.change({
                            maValue: scope.value
                        });
                    });
                };

                var hasDateChanged = function(date) {
                    if ((previousDate === null && date === null) || (previousDate && date && previousDate.diff(date) === 0)) {
                        return false;
                    }

                    scope.isTouched = true;

                    return true;
                };

                var setDisplayDate = function(maDate) {
                    var displayDate = null;

                    if (maDate && maDate.date) {
                        // Adjust time zone offset.
                        displayDate = MaDate.offsetUtc(maDate.date, timeZoneOffset - maDate.offset);
                        dateElement.val(MaDate.format(displayDate, displayFormat));
                        hoursElement.val(MaDate.format(displayDate, 'HH'));
                        minutesElement.val(MaDate.format(displayDate, 'mm'));

                        if (!initialDisplayDate) {
                            initialDisplayDate = dateElement.val();
                        }
                    } else {
                        dateElement.val('');
                        hoursElement.val('00');
                        minutesElement.val('00');
                    }

                    setCalendarDate(displayDate);
                };

                var setCalendarDate = function(date) {
                    if (picker) {
                        picker.setDate(date ? date.toDate() : null, true);
                    }
                };

                var setMaxDate = function() {
                    if (!picker) {
                        return;
                    }

                    maxDate = new MaDate(scope.maxDate);
                    var date = maxDate.date;

                    // Pikaday does no support clearing maxDate by providing null value.
                    // So we just set maxDate to 100 years ahead.
                    if (!date) {
                        date = new Date();
                        date = new Date(date.setFullYear(date.getFullYear() + 100));
                    }

                    picker.setMaxDate(date);
                };

                var setMinDate = function() {
                    if (!picker) {
                        return;
                    }

                    minDate = new MaDate(scope.minDate);
                    var date = minDate.date;

                    // Pikaday does no support clearing minDate by providing null value.
                    // So we just set minDate to 100 years before.
                    if (!date) {
                        date = new Date();
                        date = new Date(date.setFullYear(date.getFullYear() - 100));
                    }

                    picker.setMinDate(date);
                };

                var parseDate = function(date) {
                    var maDate = new MaDate();

                    if (!date) {
                        return maDate;
                    }

                    if (scope.parser) {
                        maDate = scope.parser(date);
                    } else {
                        maDate = MaDate.parse(date, scope.culture);
                    }

                    if (!maDate.isEmpty()) {
                        maDate.date = moment(maDate.date);
                    }

                    return maDate;
                };

                var addTimeToDate = function(date) {
                    var _date = moment(date);

                    return moment([_date.year(), _date.month(), _date.date(), Number(hoursElement.val()), Number(minutesElement.val()), 0]);
                };

                var resetInitialDateOffset = function() {
                    // Override initial time zone offset after date has been changed.
                    initialDateOffset = timeZoneOffset;
                };

                var initializePikaday = function() {
                    picker = new Pikaday({
                        field: angular.element(element[0].querySelector('.ma-date-box-icon'))[0],
                        position: 'bottom right',
                        onSelect: function() {
                            var maDate = new MaDate(picker.getDate());
                            maDate.date = MaDate.offsetUtc(maDate.date);

                            if (scope.hasTime) {
                                maDate.date = addTimeToDate(maDate.date);
                                resetInitialDateOffset();
                            }

                            // Use $timeout to apply scope changes instead of $apply,
                            // which throws digest error at this point.
                            $timeout(function() {
                                validate(maDate.date);
                            });

                            if (!hasDateChanged(maDate.date)) {
                                // Refresh display date in case the following scenario.
                                // 1. maxDate is set to 30/10/2016.
                                // 2. The user enteres greater date by hand 31/10/2016, which
                                // will not be excepted and become invalid.
                                // 3. The user then selects the same 30/10/2016 date from the calendar,
                                // but display date will not be changed as previous date is still 30/10/2016
                                // (hasDateChanged will return false).
                                setDisplayDate(maDate);
                                return;
                            }

                            onChange(maDate.date);
                        }
                    });

                    setCalendarDate(previousDate);
                    setMaxDate();
                    setMinDate();
                };

                var destroyPikaday = function() {
                    if (picker) {
                        picker.destroy();
                    }
                };

                var failedValidator = null;

                var validate = function(date) {
                    scope.isValid = true;
                    failedValidator = null;

                    // Date comes in Moment format which we do not want to expose,
                    // so convert it to string.
                    var dateString = date ? MaDate.format(date, format) : null;

                    if (validators && validators.length) {
                        for (var i = 0; i < validators.length; i++) {
                            if (!validators[i].validate(dateString)) {
                                scope.isValid = false;
                                failedValidator = validators[i];
                                break;
                            }
                        }
                    }
                };

                var setValidators = function() {
                    var hasIsNotEmptyValidator = false;
                    validators = scope.validators ? angular.copy(scope.validators) : [];

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

                    if (!minDate.isEmpty()) {
                        validators.push(maValidators.isGreaterThanOrEqual(minDate));
                    }

                    if (!maxDate.isEmpty()) {
                        validators.push(maValidators.isLessThanOrEqual(maxDate, true));
                    }
                };

                setValidators();
                scope.isFocused = false;
                scope.isValid = true;
                scope.isTouched = false;

                scope.isResetEnabled = function() {
                    return !scope.isDisabled && (dateElement.val() || hoursElement.val() !== '00' || minutesElement.val() !== '00');
                };

                scope.onFocus = function() {
                    scope.isFocused = true;
                };

                scope.onBlur = function() {
                    scope.isFocused = false;
                    scope.isTouched = true;

                    var date = dateElement.val().trim(),
                        isEmpty = date === '',
                        hours = Number(hoursElement.val()),
                        minutes = Number(minutesElement.val()),
                        maDate = new MaDate();

                    // Check time.
                    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                        maDate = parseDate(date);
                        maDate.offset = initialDateOffset;
                    } else {
                        scope.isValid = false;
                        return;
                    }

                    // Date has been emptied.
                    if (isEmpty) {
                        validate(maDate.date);

                        if (scope.isValid) {
                            setDisplayDate();
                            onChange();
                        }

                        return;
                    }

                    // Failed to parse the date.
                    if (!maDate.date) {
                        scope.isValid = false;
                        return;
                    }

                    if (maDate.date && (scope.hasTime || initialDisplayDate === date)) {
                        // Substruct time zone offset.
                        maDate.date = addTimeToDate(maDate.date);
                        maDate.date = MaDate.offsetUtc(maDate.date, -(timeZoneOffset - initialDateOffset));
                    }

                    validate(maDate.date);

                    if (!hasDateChanged(maDate.date)) {
                        // Refresh diplay date in case the user changed its format, e.g.
                        // from 12 Oct 16 to 12Oct16. We need to set it back to 12 Oct 16.
                        setDisplayDate(maDate);
                        return;
                    }

                    if (maDate.date) {
                        setDisplayDate(maDate);
                    }

                    if (!scope.isValid) {
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
                    scope.isTouched = true;
                    validate(null);

                    onChange();
                    setDisplayDate();
                    dateElement.focus();
                };

                // Set initial date.
                if (scope.value) {
                    var maDate = MaDate.parse(scope.value, scope.culture);
                    maDate.date = MaDate.offsetUtc(maDate.date);

                    if (maDate.isEmpty()) {
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

                scope.$watch('value', function(newDate, oldDate) {
                    if (newDate === null && oldDate === null) {
                        return;
                    }

                    var maDate = parseDate(newDate);

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

                var minMaxDateWatcher = function(newValue, oldValue, dateName) {
                    if (newValue === oldValue) {
                        return;
                    }

                    var maDate = parseDate(dateElement.val().trim());

                    if (dateName === 'maxDate') {
                        setMaxDate();
                    } else {
                        setMinDate();
                    }

                    setValidators();
                    validate(maDate.date);

                    if (scope.isValid) {
                        onChange(maDate.date);
                    }
                };

                scope.$watch('maxDate', function(newValue, oldValue) {
                    minMaxDateWatcher(newValue, oldValue, 'maxDate');
                });

                scope.$watch('minDate', function(newValue, oldValue) {
                    minMaxDateWatcher(newValue, oldValue, 'minDate');
                });

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.isInitialized = true;

                    scope.instance.validate = function() {
                        scope.isTouched = true;

                        if (isRequired && !scope.value) {
                            scope.isValid = false;
                            return;
                        }

                        validate(parseDate(scope.value).date);
                    };

                    scope.instance.isValid = function() {
                        return scope.isValid;
                    };

                    scope.instance.failedValidator = function() {
                        return failedValidator;
                    };
                }
            }
        };
    }]);
