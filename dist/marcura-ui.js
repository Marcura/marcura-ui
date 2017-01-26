(function(){angular.module('marcuraUI.services', []);
angular.module('marcuraUI.components', ['marcuraUI.services']);
angular.module('marcuraUI', ['marcuraUI.components']);

angular.element(document).ready(function() {
    // Detect IE9.
    var ie = (function() {
        var version = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');

        while (div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->', all[0]);

        return version > 4 ? version : null;
    }());

    if (ie) {
        var body = angular.element(document.getElementsByTagName('body')[0]);
        body.addClass('ma-ie' + ie);
    }

    // Override angular-modal hideModal method so it does not remove
    // 'modal-open' CSS-class from body if there are opened modals.
    // E.g. when bootbox modal is displayed above angular-modal.
    if ($.fn.modal) {
        $.fn.modal.Constructor.prototype.hideModal = function() {
            var that = this;
            this.$element.hide();
            this.backdrop(function() {
                that.resetAdjustments();
                that.resetScrollbar();
                that.$element.trigger('hidden.bs.modal');

                // Remove CSS-class if only there no opened modals.
                if ($('.modal').length === 0) {
                    that.$body.removeClass('modal-open');
                }
            });
        };
    }
});
})();
(function(){angular.module('marcuraUI.components').directive('maButton', ['maHelper', function(maHelper) {
    return {
        restrict: 'E',
        scope: {
            text: '@',
            kind: '@',
            leftIcon: '@',
            rightIcon: '@',
            isDisabled: '=',
            click: '&',
            size: '@',
            modifier: '@'
        },
        replace: true,
        template: function() {
            var html = '\
                <button class="ma-button"\
                    ng-click="onClick()"\
                    ng-disabled="isDisabled"\
                    ng-class="{\
                        \'ma-button-link\': isLink(),\
                        \'ma-button-has-left-icon\': hasLeftIcon,\
                        \'ma-button-has-right-icon\': hasRightIcon,\
                        \'ma-button-is-disabled\': isDisabled,\
                        \'ma-button-has-text\': hasText\
                    }">\
                    <span ng-if="leftIcon" class="ma-button-icon ma-button-icon-left">\
                        <i class="fa fa-{{leftIcon}}"></i>\
                        <span class="ma-button-rim" ng-if="isLink()"></span>\
                    </span><span class="ma-button-text">{{text || \'&nbsp;\'}}</span><span ng-if="rightIcon" class="ma-button-icon ma-button-icon-right">\
                        <i class="fa fa-{{rightIcon}}"></i>\
                        <span class="ma-button-rim" ng-if="isLink()"></span>\
                    </span>\
                    <span class="ma-button-rim" ng-if="!isLink()"></span>\
                </button>';

            return html;
        },
        link: function(scope, element) {
            scope.hasText = false;
            scope.hasLeftIcon = false;
            scope.hasRightIcon = false;
            scope.size = scope.size ? scope.size : 'md';
            scope.hasLeftIcon = scope.leftIcon ? true : false;
            scope.hasRightIcon = scope.rightIcon ? true : false;
            scope.hasText = scope.text ? true : false;
            var modifiers = '';

            if (!maHelper.isNullOrWhiteSpace(scope.modifier)) {
                modifiers = scope.modifier.split(' ');
            }

            for (var i = 0; i < modifiers.length; i++) {
                element.addClass('ma-button-' + modifiers[i]);
            }

            element.addClass('ma-button-' + scope.size);

            // if (scope.modifier) {
            //     element.addClass('ma-button-' + scope.modifier);
            // }

            scope.onClick = function() {
                if (!scope.isDisabled) {
                    scope.click();
                }
            };

            scope.isLink = function functionName() {
                return scope.kind === 'link';
            };
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maCheckBox', ['maHelper', '$timeout', 'maValidators', function(maHelper, $timeout, maValidators) {
    return {
        restrict: 'E',
        scope: {
            text: '@',
            value: '=',
            isDisabled: '=',
            change: '&',
            size: '@',
            rtl: '=',
            isRequired: '=',
            validators: '=',
            instance: '=',
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-check-box{{cssClass}}"\
                ng-focus="onFocus()"\
                ng-blur="onBlur()"\
                ng-keypress="onKeypress($event)"\
                ng-click="onChange()"\
                ng-class="{\
                    \'ma-check-box-is-checked\': value === true,\
                    \'ma-check-box-is-disabled\': isDisabled,\
                    \'ma-check-box-has-text\': hasText,\
                    \'ma-check-box-rtl\': rtl,\
                    \'ma-check-box-is-focused\': isFocused,\
                    \'ma-check-box-is-invalid\': !isValid,\
                    \'ma-check-box-is-touched\': isTouched\
                }">\
                <span class="ma-check-box-text">{{text || \'&nbsp;\'}}</span>\
                <div class="ma-check-box-inner"></div>\
                <i class="ma-check-box-icon fa fa-check" ng-show="value === true"></i>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false;

            var setTabindex = function() {
                if (scope.isDisabled) {
                    element.removeAttr('tabindex');
                } else {
                    element.attr('tabindex', '0');
                }
            };

            var setText = function() {
                scope.hasText = scope.text ? true : false;
            };

            scope._size = scope.size ? scope.size : 'xs';
            scope.cssClass = ' ma-check-box-' + scope._size;
            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

            var validate = function() {
                scope.isValid = true;
                scope.isTouched = true;

                // Remove 'false' value for 'IsNotEmpty' to work correctly.
                var value = scope.value === false ? null : scope.value;

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        var validator = validators[i];

                        if (!validator.validate(validator.name === 'IsNotEmpty' ? value : scope.value)) {
                            scope.isValid = false;
                            break;
                        }
                    }
                }
            };

            scope.onChange = function() {
                if (!scope.isDisabled) {
                    scope.value = !scope.value;
                    validate();

                    $timeout(function() {
                        scope.change({
                            maValue: scope.value
                        });
                    });
                }
            };

            scope.onFocus = function() {
                if (!scope.isDisabled) {
                    scope.isFocused = true;
                }
            };

            scope.onBlur = function() {
                if (scope.isDisabled) {
                    return;
                }

                scope.isFocused = false;

                validate();
            };

            scope.onKeypress = function(event) {
                if (event.keyCode === maHelper.keyCode.space) {
                    // Prevent page from scrolling down.
                    event.preventDefault();

                    if (!scope.isDisabled) {
                        scope.onChange();
                    }
                }
            };

            scope.$watch('isDisabled', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (newValue) {
                    scope.isFocused = false;
                }

                setTabindex();
            });

            scope.$watch('text', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setText();
            });

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

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function() {
                    return scope.isValid;
                };

                scope.instance.validate = function() {
                    validate();
                };
            }

            setTabindex();
            setText();
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maCostsGrid', [function() {
    return {
        restrict: 'E',
        scope: {
            costItems: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-grid ma-grid-costs"\
                costs grid\
            </div>';

            return html;
        },
        link: function(scope) {
            console.log('scope.costItems:', scope.costItems);
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components')
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
                validate: '&',
                canReset: '=',
                displayFormat: '=',
                format: '=',
                hasTime: '=',
                parser: '=',
                validators: '=',
                instance: '=',
                minDate: '=',
                maxDate: '=',
                changeTimeout: '=',
                placeholder: '@'
            },
            replace: true,
            template: function(element) {
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
                            placeholder="{{placeholder}}"\
                            ng-disabled="isDisabled"\
                            ng-keydown="onKeydown($event)"\
                            ng-keyup="onKeyup($event)"/><input class="ma-date-box-hour"\
                                maxlength="2"\
                                ng-disabled="isDisabled"\
                                ng-show="hasTime"\
                                ng-keyup="onKeyup($event)"\
                                ng-keydown="onTimeKeydown($event)"\
                                /><div class="ma-date-box-colon" ng-if="hasTime">:</div><input \
                                class="ma-date-box-minute" type="text"\
                                maxlength="2"\
                                ng-disabled="isDisabled"\
                                ng-show="hasTime"\
                                ng-keyup="onKeyup($event)"\
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
                    hourElement = angular.element(element[0].querySelector('.ma-date-box-hour')),
                    minuteElement = angular.element(element[0].querySelector('.ma-date-box-minute')),
                    previousDate = MaDate.createEmpty(),
                    timeZoneOffset = MaDate.parseTimeZone(timeZone),
                    initialDisplayDate,
                    // Variables keydownValue and keyupValue help track touched state.
                    keydownValue,
                    keyupValue,
                    initialDateOffset = 0,
                    validators = [],
                    isRequired = scope.isRequired,
                    minDate = new MaDate(scope.minDate),
                    maxDate = new MaDate(scope.maxDate),
                    failedValidator = null,
                    changePromise,
                    changeTimeout = Number(scope.changeTimeout),
                    dateCaretPosition = 0,
                    hourCaretPosition = 0,
                    minuteCaretPosition = 0,
                    isDateFocused,
                    isHourFocused,
                    isMinuteFocused;

                var hasDateChanged = function(date) {
                    if (previousDate.isEqual(date)) {
                        return false;
                    }

                    scope.isTouched = true;

                    return true;
                };

                var setDisplayDate = function(date) {
                    var displayDate = null;

                    if (date && !date.isEmpty()) {
                        // Adjust display date offset.
                        displayDate = date.copy().toUtc().add(timeZoneOffset, 'minute');
                        dateElement.val(displayDate.format(displayFormat));
                        hourElement.val(displayDate.format('HH'));
                        minuteElement.val(displayDate.format('mm'));

                        if (!initialDisplayDate) {
                            initialDisplayDate = dateElement.val();
                        }
                    } else {
                        dateElement.val('');
                        hourElement.val('00');
                        minuteElement.val('00');
                    }

                    // Restore caret position if the component has focus.
                    if (scope.isFocused) {
                        // In IE setting selectionStart/selectionEnd properties triggers focus/blur event.
                        // Remove the events while properties are being set and then restore them.
                        removeFocusEvent();
                        removeBlurEvent();

                        // Set caret for an appropriate field.
                        if (isDateFocused) {
                            dateElement.prop({
                                selectionStart: dateCaretPosition,
                                selectionEnd: dateCaretPosition
                            });
                        }

                        if (isHourFocused) {
                            hourElement.prop({
                                selectionStart: hourCaretPosition,
                                selectionEnd: hourCaretPosition
                            });
                        }

                        if (isMinuteFocused) {
                            minuteElement.prop({
                                selectionStart: minuteCaretPosition,
                                selectionEnd: minuteCaretPosition
                            });
                        }

                        $timeout(function() {
                            addFocusEvent();
                            addBlurEvent();
                        });
                    }

                    // Set calendar date.
                    if (picker) {
                        picker.setDate(displayDate ? displayDate.toDate() : null, true);
                    }
                };

                var setMaxDate = function() {
                    if (!picker) {
                        return;
                    }

                    maxDate = new MaDate(scope.maxDate);

                    // Pikaday does no support clearing maxDate by providing null value.
                    // So we just set maxDate to 100 years ahead.
                    if (maxDate.isEmpty()) {
                        maxDate = new MaDate().add(100, 'year');
                    }

                    picker.setMaxDate(maxDate.toDate());
                };

                var setMinDate = function() {
                    if (!picker) {
                        return;
                    }

                    minDate = new MaDate(scope.minDate);

                    // Pikaday does no support clearing minDate by providing null value.
                    // So we just set minDate to 100 years before.
                    if (minDate.isEmpty()) {
                        minDate = new MaDate().subtract(100, 'year');
                    }

                    picker.setMinDate(minDate.toDate());
                };

                var parseDate = function(date) {
                    var parsedDate = MaDate.createEmpty();

                    if (!date) {
                        return parsedDate;
                    }

                    if (scope.parser) {
                        parsedDate = scope.parser(date);
                    } else {
                        parsedDate = MaDate.parse(date, scope.culture);
                    }

                    return parsedDate;
                };

                var setDateTime = function(date) {
                    date.hour(Number(hourElement.val()))
                        .minute(Number(minuteElement.val()))
                        .second(0);
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
                            var date = new MaDate(picker.getDate());
                            date.offset(timeZoneOffset);

                            if (scope.hasTime) {
                                setDateTime(date);
                                resetInitialDateOffset();
                            }

                            // Use $timeout to apply scope changes instead of $apply,
                            // which throws digest error at this point.
                            $timeout(function() {
                                validate(date);
                            });

                            if (!hasDateChanged(date)) {
                                // Refresh display date in case the following scenario.
                                // 1. maxDate is set to 30/10/2016.
                                // 2. The user enteres greater date by hand 31/10/2016, which
                                // will not be excepted and become invalid.
                                // 3. The user then selects the same 30/10/2016 date from the calendar,
                                // but display date will not be changed as previous date is still 30/10/2016
                                // (hasDateChanged will return false).
                                setDisplayDate(date);
                                return;
                            }

                            triggerChange(date);
                        }
                    });

                    setDisplayDate(previousDate);
                    setMaxDate();
                    setMinDate();
                };

                var destroyPikaday = function() {
                    if (picker) {
                        picker.destroy();
                    }
                };

                var validate = function(date, triggerEvent) {
                    scope.isValid = true;
                    failedValidator = null;
                    var formattedDate = date ? date.format(format) : null;

                    if (validators && validators.length) {
                        for (var i = 0; i < validators.length; i++) {
                            if (!validators[i].validate(formattedDate)) {
                                scope.isValid = false;
                                failedValidator = validators[i];
                                break;
                            }
                        }
                    }

                    if (triggerEvent !== false) {
                        triggerValidate(date);
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
                        validators.push(maValidators.isGreaterOrEqual(minDate, true));
                    }

                    if (!maxDate.isEmpty()) {
                        validators.push(maValidators.isLessOrEqual(maxDate, true));
                    }
                };

                var triggerChange = function(date) {
                    previousDate = date || MaDate.createEmpty();
                    scope.value = date ? date.format(format) : null;

                    // Postpone change event for $apply (which is being invoked by $timeout)
                    // to have time to take effect and update scope.value,
                    // so both maValue and scope.value have the same values eventually.
                    $timeout(function() {
                        scope.change({
                            maValue: scope.value
                        });
                    });
                };

                var triggerValidate = function(date) {
                    // Postpone the event to allow scope.value to be updated, so
                    // the event can operate relevant value.
                    $timeout(function() {
                        scope.validate({
                            maValue: date ? date.format(format) : null
                        });
                    });
                };

                var changeDate = function() {
                    scope.isTouched = true;

                    var displayDate = dateElement.val().trim(),
                        isEmpty = displayDate === '',
                        hour = Number(hourElement.val()),
                        minute = Number(minuteElement.val()),
                        date = MaDate.createEmpty();

                    // Check time.
                    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
                        date = parseDate(displayDate);
                        date.offset(initialDateOffset);
                    } else {
                        scope.isValid = false;
                        return;
                    }

                    // Date is empty and remains unchanged.
                    if (isEmpty && previousDate.isEmpty()) {
                        validate(null);
                        return;
                    }

                    // Date has been emptied.
                    if (isEmpty) {
                        validate(date);

                        if (scope.isValid) {
                            setDisplayDate(null);
                            triggerChange();
                        }

                        return;
                    }

                    // Failed to parse the date.
                    if (date.isEmpty()) {
                        scope.isValid = false;
                        return;
                    }

                    if (!date.isEmpty() && (scope.hasTime || initialDisplayDate === displayDate)) {
                        setDateTime(date);

                        // Substruct time zone offset.
                        date.subtract(timeZoneOffset - initialDateOffset, 'minute');
                    }

                    validate(date);

                    if (!hasDateChanged(date)) {
                        // Refresh diplay date in case the user changed its format, e.g.
                        // from 12 Oct 16 to 12Oct16. We need to set it back to 12 Oct 16.
                        setDisplayDate(date);
                        return;
                    }

                    if (!date.isEmpty()) {
                        setDisplayDate(date);
                    }

                    if (!scope.isValid) {
                        return;
                    }

                    triggerChange(date);
                };

                var focusDate = function() {
                    isDateFocused = true;
                    isHourFocused = false;
                    isMinuteFocused = false;
                    scope.onFocus();
                };

                var focusHour = function() {
                    isHourFocused = true;
                    isDateFocused = false;
                    isMinuteFocused = false;
                    scope.onFocus();
                };

                var focusMinute = function() {
                    isMinuteFocused = true;
                    isDateFocused = false;
                    isHourFocused = false;
                    scope.onFocus();
                };

                var blurDate = function() {
                    isDateFocused = false;
                    scope.onBlur();
                };

                var blurHour = function() {
                    isHourFocused = false;
                    scope.onBlur();
                };

                var blurMinute = function() {
                    isMinuteFocused = false;
                    scope.onBlur();
                };

                var addFocusEvent = function() {
                    // Remove the event in case it exists.
                    removeFocusEvent();
                    $('.ma-date-box-date', element).on('focus', focusDate);
                    $('.ma-date-box-hour', element).on('focus', focusHour);
                    $('.ma-date-box-minute', element).on('focus', focusMinute);
                };

                var removeFocusEvent = function() {
                    $('.ma-date-box-date', element).off('focus', focusDate);
                    $('.ma-date-box-hour', element).off('focus', focusHour);
                    $('.ma-date-box-minute', element).off('focus', focusMinute);
                };

                var addBlurEvent = function() {
                    // Remove the event in case it exists.
                    removeBlurEvent();
                    $('.ma-date-box-date', element).on('blur', blurDate);
                    $('.ma-date-box-hour', element).on('blur', blurHour);
                    $('.ma-date-box-minute', element).on('blur', blurMinute);
                };

                var removeBlurEvent = function() {
                    $('.ma-date-box-date', element).off('blur', blurDate);
                    $('.ma-date-box-hour', element).off('blur', blurHour);
                    $('.ma-date-box-minute', element).off('blur', blurMinute);
                };

                setValidators();
                scope.isFocused = false;
                scope.isValid = true;
                scope.isTouched = false;

                scope.isResetEnabled = function() {
                    return !scope.isDisabled && (dateElement.val() || hourElement.val() !== '00' || minuteElement.val() !== '00');
                };

                scope.onFocus = function() {
                    // Use safeApply to avoid apply error when Reset icon is clicked.
                    maHelper.safeApply(function() {
                        scope.isFocused = true;
                    });
                };

                scope.onBlur = function() {
                    // Cancel change if it is already in process to prevent the event from firing twice.
                    if (changePromise) {
                        $timeout.cancel(changePromise);
                    }

                    scope.$apply(function() {
                        scope.isFocused = false;
                        changeDate();
                    });
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

                    var hasValueChanged = false;
                    keyupValue = angular.element(event.target).val();

                    if (keydownValue !== keyupValue) {
                        hasValueChanged = true;
                        scope.isTouched = true;
                        resetInitialDateOffset();
                    }

                    // Change value after a timeout while the user is typing.
                    if (hasValueChanged && changeTimeout > 0) {
                        dateCaretPosition = dateElement.prop('selectionStart');
                        hourCaretPosition = hourElement.prop('selectionStart');
                        minuteCaretPosition = minuteElement.prop('selectionStart');

                        if (changePromise) {
                            $timeout.cancel(changePromise);
                        }

                        changePromise = $timeout(function() {
                            changeDate();
                        }, changeTimeout);
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

                    previousDate = MaDate.createEmpty();
                    scope.isTouched = true;
                    validate(null);

                    triggerChange();
                    setDisplayDate(null);
                    dateElement.focus();
                };

                // Set initial date.
                if (scope.value) {
                    var date = parseDate(scope.value);

                    if (date.isEmpty()) {
                        return;
                    }

                    setDisplayDate(date);
                    previousDate = date;
                    initialDateOffset = date.offset();
                }

                addFocusEvent();
                addBlurEvent();

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

                    var date = parseDate(newDate);

                    if (date.isEmpty()) {
                        previousDate = MaDate.createEmpty();
                        setDisplayDate(null);
                    }

                    if (!hasDateChanged(date)) {
                        setDisplayDate(date);
                        return;
                    }

                    // Validate date to make it valid in case it was invalid before or vice versa.
                    // Pass false as second parameter to avoid loop from triggering validate event.
                    validate(date, false);
                    setDisplayDate(date);
                    previousDate = date;
                    initialDateOffset = date.offset();
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

                    var date = parseDate(dateElement.val().trim());
                    date.offset(timeZoneOffset);

                    if (dateName === 'maxDate') {
                        setMaxDate();
                    } else {
                        setMinDate();
                    }

                    setValidators();

                    // Run only min/max validators to avoid the component being highligthed as invalid
                    // by other validators like IsNotEmpty, when minDate/maxDate is changed.
                    var minMaxValidators = [];

                    for (var i = 0; i < validators.length; i++) {
                        if (validators[i].name === 'IsGreaterOrEqual' || validators[i].name === 'IsLessOrEqual') {
                            minMaxValidators.push(validators[i]);
                        }
                    }

                    if (minMaxValidators.length) {
                        var formattedDate = date.format(format);

                        // Empty failedValidator if it is min/max validator.
                        if (failedValidator && (failedValidator.name === 'IsGreaterOrEqual' || failedValidator.name === 'IsLessOrEqual')) {
                            failedValidator = null;
                            scope.isValid = true;
                        }

                        for (i = 0; i < minMaxValidators.length; i++) {
                            if (!minMaxValidators[i].validate(formattedDate)) {
                                scope.isValid = false;
                                failedValidator = minMaxValidators[i];
                                break;
                            }
                        }

                        if (!scope.isValid) {
                            scope.isTouched = true;
                        }

                        triggerValidate(date);
                    }

                    if (scope.isValid && hasDateChanged(date)) {
                        triggerChange(date);
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

                        validate(parseDate(scope.value));
                    };

                    scope.instance.isValid = function() {
                        return scope.isValid;
                    };

                    scope.instance.failedValidator = function() {
                        return failedValidator;
                    };

                    scope.instance.refresh = function() {
                        var date = parseDate(scope.value);
                        setDisplayDate(date);
                        validate(date, false);
                    };
                }
            }
        };
    }]);
})();
(function(){angular.module('marcuraUI.components').directive('maGridOrder', [function() {
    return {
        restrict: 'E',
        scope: {
            orderBy: '@',
            sorting: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-grid-order ma-grid-order-{{sorting.direction}}"\
                ng-show="sorting.orderedBy === orderBy || (sorting.orderedBy === \'-\' + orderBy)">\
                <i class="fa fa-sort-{{sorting.direction}}"></i>\
            </div>';

            return html;
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maMessage', [function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            type: '@',
            state: '@'
        },
        replace: true,
        template: function() {
            var html = '\
                <div class="ma-message{{cssClass}}">\
                    <div class="ma-message-icon">\
                        <i class="fa" ng-class="{\
                            \'fa-info-circle\': _state === \'info\',\
                            \'fa-check-circle\': _state === \'success\',\
                            \'fa-exclamation-triangle\': _state === \'warning\',\
                            \'fa-times-circle\': _state === \'danger\'\
                        }"></i>\
                    </div>\
                    <div class="ma-message-text"><ng-transclude></ng-transclude></div>\
                </div>';

            return html;
        },
        link: function(scope) {
            scope._type = scope.type || 'message';
            scope._state = scope.state || 'info';
            scope.cssClass = ' ma-message-' + scope._type + ' ma-message-' + scope._state;
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maMultiCheckBox', ['$timeout', 'maValidators', function($timeout, maValidators) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            itemTemplate: '=',
            itemTextField: '@',
            itemValueField: '@',
            value: '=',
            change: '&',
            isDisabled: '=',
            isRequired: '=',
            validators: '=',
            instance: '='
        },
        replace: true,
        template: function() {
            var html = '\
                <div class="ma-multi-check-box" ng-class="{\
                        \'ma-multi-check-box-is-disabled\': isDisabled,\
                        \'ma-multi-check-box-is-invalid\': !isValid,\
                        \'ma-multi-check-box-is-touched\': isTouched\
                    }">\
                    <div class="ma-multi-check-box-item" ng-repeat="item in items">\
                        <div class="ma-multi-check-box-background" ng-click="onChange(item)"></div>\
                        <ma-check-box\
                            size="sm"\
                            value="getItemMetadata(item).isSelected"\
                            is-disabled="isDisabled">\
                        </ma-check-box><div class="ma-multi-check-box-text">{{getItemText(item)}}</div>\
                    </div>\
                </div>';

            return html;
        },
        link: function(scope, element) {
            var isObjectArray = scope.itemTextField || scope.itemValueField,
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                itemsMetadata = {};

            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

            var validate = function(value) {
                scope.isValid = true;

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        if (!validators[i].validate(value)) {
                            scope.isValid = false;
                            break;
                        }
                    }
                }
            };

            var setSelectedItems = function() {
                if (scope.value && scope.value.length && scope.items && scope.items.length) {
                    for (var j = 0; j < scope.value.length; j++) {
                        for (var k = 0; k < scope.items.length; k++) {
                            if (!isObjectArray) {
                                if (scope.items[k] === scope.value[j]) {
                                    scope.getItemMetadata(scope.items[k]).isSelected = true;
                                }
                            } else if (scope.itemValueField) {
                                if (scope.items[k][scope.itemValueField] === scope.value[j][scope.itemValueField]) {
                                    scope.getItemMetadata(scope.items[k]).isSelected = true;
                                }
                            }
                        }
                    }
                }
            };

            scope.getItemMetadata = function(item) {
                var itemValue = isObjectArray ? item[scope.itemValueField] : item;

                if (!itemsMetadata[itemValue]) {
                    itemsMetadata[itemValue] = {};
                    itemsMetadata[itemValue].item = item;
                }

                return itemsMetadata[itemValue];
            };

            scope.getItemText = function(item) {
                if (scope.itemTemplate) {
                    return scope.itemTemplate(item);
                } else if (!isObjectArray) {
                    return item;
                } else if (scope.itemTextField) {
                    return item[scope.itemTextField];
                }
            };

            scope.onChange = function(item) {
                if (scope.isDisabled) {
                    return;
                }

                var oldValue = scope.value,
                    value = [],
                    itemMetadata = scope.getItemMetadata(item);

                itemMetadata.isSelected = !itemMetadata.isSelected;

                for (var itemValue in itemsMetadata) {
                    if (itemsMetadata.hasOwnProperty(itemValue)) {
                        if (itemsMetadata[itemValue].isSelected) {
                            value.push(itemsMetadata[itemValue].item);
                        }
                    }
                }

                scope.value = value.length ? value : null;

                $timeout(function() {
                    validate(scope.value);

                    scope.change({
                        maValue: scope.value,
                        maOldValue: oldValue
                    });
                });
            };

            scope.$watch('value', function(newValue, oldValue) {
                if (angular.equals(newValue, oldValue)) {
                    return;
                }

                setSelectedItems();
            });

            // Set initial value.
            $timeout(function() {
                setSelectedItems();
            });

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

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function() {
                    return scope.isValid;
                };

                scope.instance.validate = function() {
                    validate(scope.value);
                };
            }
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maPager', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            page: '=',
            totalPages: '=',
            change: '&'
        },
        replace: true,
        template: function() {
            var html = '<div class="ma-pager"\
                ><ma-button\
                    class="ma-button-previous"\
                    right-icon="chevron-left"\
                    size="xs"\
                    modifier="default"\
                    click="previousClick()"\
                    is-disabled="getPage(internalPage) <= 1"\
                ></ma-button\
                ><ma-text-box\
                    class="ma-pager-value"\
                    change="onChange(maValue, maOldValue)"\
                    value="internalPage">\
                </ma-text-box><div class="ma-pager-text">of {{getPage(totalPages)}} pages</div\
                ><ma-button\
                    class="ma-button-next"\
                    right-icon="chevron-right"\
                    size="xs"\
                    modifier="default"\
                    click="nextClick()"\
                    is-disabled="getPage(internalPage) >= getPage(totalPages)">\
                </ma-button></div>';

            return html;
        },
        link: function(scope) {
            var pageCorrected = false;

            var triggerChange = function(page) {
                scope.page = page;

                // Postpone change event for $apply (which is being invoked by $timeout)
                // to have time to take effect and update scope.value,
                $timeout(function() {
                    scope.change({
                        maPage: page
                    });
                });
            };

            scope.previousClick = function() {
                var page = scope.getPage(scope.internalPage);
                scope.internalPage = page <= 1 ? 1 : page - 1;
                triggerChange(scope.internalPage);
            };

            scope.nextClick = function() {
                var page = scope.getPage(scope.internalPage);
                scope.internalPage = page >= scope.totalPages ? 1 : page + 1;
                triggerChange(scope.internalPage);
            };

            scope.onChange = function(newValue, oldValue) {
                var page = scope.getPage(newValue),
                    oldPage = scope.getPage(oldValue);

                if (page === oldPage) {
                    return;
                }

                if (page < 1 || page > scope.getPage(scope.totalPages)) {
                    scope.internalPage = oldPage;
                    pageCorrected = true;
                    return;
                }

                if (!pageCorrected) {
                    triggerChange(page);
                }

                pageCorrected = false;
            };

            $timeout(function() {
                // Set initial value.
                scope.internalPage = scope.page;
            });

            scope.getPage = function(page) {
                page = Number(page);

                return typeof page !== 'number' || isNaN(page) ? 0 : page;
            };
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maProgress', [function() {
    return {
        restrict: 'E',
        scope: {
            steps: '=',
            currentStep: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-progress">\
                <div class="ma-progress-inner">\
                    <div class="ma-progress-background"></div>\
                    <div class="ma-progress-bar" ng-style="{\
                        width: (calculateProgress() + \'%\')\
                    }">\
                    </div>\
                    <div class="ma-progress-steps">\
                        <div class="ma-progress-step"\
                            ng-style="{\
                                left: (calculateLeft($index) + \'%\')\
                            }"\
                            ng-repeat="step in steps"\
                            ng-class="{\
                                \'ma-progress-step-is-current\': isCurrentStep($index)\
                            }">\
                            <div class="ma-progress-text">{{$index + 1}}</div>\
                        </div>\
                    </div>\
                </div>\
                <div class="ma-progress-labels">\
                    <div ng-repeat="step in steps"\
                        class="ma-progress-label">\
                        {{step.text}}\
                    </div>\
                </div>\
            </div>';

            return html;
        },
        link: function(scope) {
            scope.calculateLeft = function(stepIndex) {
                return 100 / (scope.steps.length - 1) * stepIndex;
            };

            scope.calculateProgress = function() {
                if (!scope.currentStep) {
                    return 0;
                }

                if (scope.currentStep > scope.steps.length) {
                    return 100;
                }

                return 100 / (scope.steps.length - 1) * (scope.currentStep - 1);
            };

            scope.isCurrentStep = function(stepIndex) {
                return (stepIndex + 1) <= scope.currentStep;
            };
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maRadioBox', ['maHelper', '$timeout', '$sce', 'maValidators', function(maHelper, $timeout, $sce, maValidators) {
    var radioBoxes = {};

    return {
        restrict: 'E',
        scope: {
            item: '=',
            itemTemplate: '=',
            itemTextField: '@',
            itemValueField: '@',
            value: '=',
            isDisabled: '=',
            hideText: '=',
            change: '&',
            size: '@',
            isRequired: '=',
            validators: '=',
            instance: '=',
            id: '@'
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-radio-box{{cssClass}}"\
                ng-focus="onFocus()"\
                ng-blur="onBlur()"\
                ng-keypress="onKeypress($event)"\
                ng-click="onChange()"\
                ng-class="{\
                    \'ma-radio-box-is-checked\': isChecked(),\
                    \'ma-radio-box-is-disabled\': isDisabled,\
                    \'ma-radio-box-has-text\': hasText(),\
                    \'ma-radio-box-is-focused\': isFocused,\
                    \'ma-radio-box-is-invalid\': !isValid,\
                    \'ma-radio-box-is-touched\': isTouched\
                }">\
                <span class="ma-radio-box-text" ng-bind-html="getItemText()"></span>\
                <div class="ma-radio-box-inner"></div>\
                <i class="ma-radio-box-icon" ng-show="isChecked()"></i>\
            </div>';

            return html;
        },
        link: function(scope, element, attributes) {
            var nbspCharacter = '&nbsp;',
                valuePropertyParts = null,
                isStringArray = !scope.itemTextField && !scope.itemValueField,
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false;

            var setTabindex = function() {
                if (scope.isDisabled) {
                    element.removeAttr('tabindex');
                } else {
                    element.attr('tabindex', '0');
                }
            };

            var getControllerScope = function() {
                var controllerScope = null,
                    initialScope = scope.$parent,
                    property = attributes.value;

                // In case of a nested property binding like 'company.port.id'.
                if (property.indexOf('.') !== -1) {
                    valuePropertyParts = property.split('.');
                    property = valuePropertyParts[0];
                }

                while (initialScope && !controllerScope) {
                    if (initialScope.hasOwnProperty(property)) {
                        controllerScope = initialScope;
                    } else {
                        initialScope = initialScope.$parent;
                    }
                }

                return controllerScope;
            };

            var controllerScope = getControllerScope();

            scope._size = scope.size ? scope.size : 'xs';
            scope.cssClass = ' ma-radio-box-' + scope._size;
            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

            if (scope.id) {
                if (!radioBoxes[scope.id]) {
                    radioBoxes[scope.id] = [];
                }

                radioBoxes[scope.id].push(scope);
            }

            var validate = function(value) {
                if (radioBoxes[scope.id]) {
                    // Validate a group of components.
                    for (var i = 0; i < radioBoxes[scope.id].length; i++) {
                        var radioBox = radioBoxes[scope.id][i];
                        radioBox.isTouched = true;
                        radioBox.validateThis(radioBox.value);
                    }
                } else {
                    // Validate only the current component.
                    scope.isTouched = true;
                    scope.validateThis(value);
                }
            };

            scope.validateThis = function(value) {
                scope.isValid = true;

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        if (!validators[i].validate(value)) {
                            scope.isValid = false;
                            break;
                        }
                    }
                }
            };

            scope.getItemText = function() {
                if (scope.hideText) {
                    return nbspCharacter;
                }

                var text;

                if (scope.itemTemplate) {
                    text = scope.itemTemplate(scope.item);
                } else if (isStringArray) {
                    text = scope.item;
                } else if (scope.itemTextField) {
                    text = scope.item[scope.itemTextField];
                }

                if (!angular.isString(text) || !text) {
                    text = nbspCharacter;
                }

                return $sce.trustAsHtml(text);
            };

            scope.hasText = function() {
                return scope.getItemText() !== nbspCharacter;
            };

            scope.isChecked = function() {
                if (isStringArray) {
                    return scope.item === scope.value;
                } else if (scope.itemValueField) {
                    return scope.item && scope.value &&
                        scope.item[scope.itemValueField] === scope.value[scope.itemValueField];
                }

                return false;
            };

            scope.onChange = function() {
                if (scope.isDisabled) {
                    return;
                }

                var valueProperty,
                    oldValue = scope.value;
                scope.value = scope.item;

                if (controllerScope && valuePropertyParts) {
                    // When the component is inside ng-repeat normal binding like
                    // value="port" won't work.
                    // This is to workaround the problem.
                    valueProperty = controllerScope;

                    // Handle nested property binding.
                    for (var i = 0; i < valuePropertyParts.length; i++) {
                        valueProperty = valueProperty[valuePropertyParts[i]];
                    }

                    valueProperty = scope.item;
                } else {
                    valueProperty = controllerScope[attributes.value];
                    controllerScope[attributes.value] = scope.item;
                }

                // Check that value has changed.
                var hasChanged = true;

                if (isStringArray) {
                    hasChanged = oldValue !== scope.item;
                } else if (scope.itemValueField) {
                    if (!oldValue && scope.item[scope.itemValueField]) {
                        hasChanged = true;
                    } else {
                        hasChanged = oldValue[scope.itemValueField] !== scope.item[scope.itemValueField];
                    }
                } else {
                    // Compare objects if itemValueField is not provided.
                    if (!oldValue && scope.item) {
                        hasChanged = true;
                    } else {
                        hasChanged = JSON.stringify(oldValue) === JSON.stringify(scope.item);
                    }
                }

                if (hasChanged) {
                    $timeout(function() {
                        validate(scope.value);

                        scope.change({
                            maValue: scope.item,
                            maOldValue: oldValue
                        });
                    });
                }
            };

            scope.onFocus = function() {
                if (!scope.isDisabled) {
                    scope.isFocused = true;
                }
            };

            scope.onBlur = function() {
                if (scope.isDisabled) {
                    return;
                }

                scope.isFocused = false;

                validate(scope.value);
            };

            scope.onKeypress = function(event) {
                if (event.keyCode === maHelper.keyCode.space) {
                    // Prevent page from scrolling down.
                    event.preventDefault();

                    if (!scope.isDisabled && !scope.isChecked()) {
                        scope.onChange();
                    }
                }
            };

            scope.$watch('isDisabled', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (newValue) {
                    scope.isFocused = false;
                }

                setTabindex();
            });

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

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function() {
                    return scope.isValid;
                };

                scope.instance.validate = function() {
                    validate(scope.value);
                };
            }

            $timeout(function() {
                // Now id is used only for grouping radioBoxes, so remove it from the element.
                if (scope.id) {
                    element.removeAttr('id');
                }
            });

            setTabindex();
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maResetValue', [function() {
    return {
        restrict: 'E',
        scope: {
            isDisabled: '=',
            click: '&'
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-reset-value" ng-class="{\
                    \'ma-reset-value-is-disabled\': isDisabled\
                }"\
                ng-click="onClick()">\
                <i class="fa fa-times"></i>\
            </div>';

            return html;
        },
        link: function(scope, element, attributes) {
            scope.onClick = function() {
                if (!scope.isDisabled) {
                    scope.click();
                }
            };
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maRadioButton', ['$timeout', 'maValidators', 'maHelper', function($timeout, maValidators, maHelper) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            itemTemplate: '=',
            itemTextField: '@',
            itemValueField: '@',
            value: '=',
            change: '&',
            isDisabled: '=',
            isRequired: '=',
            validators: '=',
            instance: '=',
            canUnselect: '='
        },
        replace: true,
        template: function() {
            var html = '\
                <div class="ma-radio-button" ng-class="{\
                        \'ma-radio-button-is-disabled\': isDisabled,\
                        \'ma-radio-button-is-invalid\': !isValid,\
                        \'ma-radio-button-is-touched\': isTouched,\
                        \'ma-radio-button-can-unselect\': canUnselect\
                    }">\
                    <div class="ma-radio-button-item" ng-class="{\
                            \'ma-radio-button-item-is-selected\': isItemSelected(item)\
                        }" ng-style="{ width: (100 / items.length) + \'%\' }"\
                        ng-repeat="item in items">\
                        <ma-button\
                            class="ma-button-radio"\
                            text="{{getItemText(item)}}"\
                            modifier="simple"\
                            size="xs"\
                            is-disabled="isDisabled"\
                            click="onChange(item)">\
                        </ma-button>\
                    </div>\
                </div>';

            return html;
        },
        link: function(scope, element) {
            var isObjectArray = scope.itemTextField || scope.itemValueField,
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false;

            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

            var validate = function(value) {
                scope.isValid = true;

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        if (!validators[i].validate(value)) {
                            scope.isValid = false;
                            break;
                        }
                    }
                }
            };

            scope.getItemText = function(item) {
                if (scope.itemTemplate) {
                    return scope.itemTemplate(item);
                } else if (!isObjectArray) {
                    return item;
                } else if (scope.itemTextField) {
                    return item[scope.itemTextField];
                }
            };

            scope.isItemSelected = function(item) {
                if (!isObjectArray) {
                    return item === scope.value;
                } else if (scope.itemValueField) {
                    return item && scope.value &&
                        item[scope.itemValueField] === scope.value[scope.itemValueField];
                }

                return false;
            };

            scope.onChange = function(item) {
                if (scope.isDisabled) {
                    return;
                }

                var oldValue = scope.value,
                    hasChanged = true;
                scope.value = item;

                // Check that value has changed.
                if (!isObjectArray) {
                    hasChanged = oldValue !== item;
                } else if (scope.itemValueField) {
                    if (maHelper.isNullOrUndefined(oldValue) && !maHelper.isNullOrUndefined(item[scope.itemValueField])) {
                        hasChanged = true;
                    } else {
                        hasChanged = oldValue[scope.itemValueField] !== item[scope.itemValueField];
                    }
                } else {
                    // Compare objects if itemValueField is not provided.
                    if (maHelper.isNullOrUndefined(oldValue) && !maHelper.isNullOrUndefined(item)) {
                        hasChanged = true;
                    } else {
                        hasChanged = JSON.stringify(oldValue) === JSON.stringify(item);
                    }
                }

                // Remove selection if the same item is selected.
                if (scope.canUnselect && !hasChanged) {
                    scope.value = null;
                }

                if (hasChanged || (scope.canUnselect && !hasChanged)) {
                    $timeout(function() {
                        validate(scope.value);

                        scope.change({
                            maValue: scope.value,
                            maOldValue: oldValue
                        });
                    });
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

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function() {
                    return scope.isValid;
                };

                scope.instance.validate = function() {
                    validate(scope.value);
                };
            }
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components')
    .filter('maSelectBoxOrderBy', ['orderByFilter', function(orderByFilter) {
        return function(items, orderByExpression) {
            if (orderByExpression) {
                return orderByFilter(items, orderByExpression);
            }

            return items;
        };
    }])
    .directive('maSelectBox', ['$document', '$timeout', 'maHelper', 'maValidators', function($document, $timeout, maHelper, maValidators) {
        return {
            restrict: 'E',
            scope: {
                id: '@',
                items: '=',
                value: '=',
                isLoading: '=',
                change: '&',
                blur: '&',
                focus: '&',
                itemTemplate: '=',
                itemTextField: '@',
                itemValueField: '@',
                isDisabled: '=',
                isRequired: '=',
                validators: '=',
                canAddItem: '=',
                addItemTooltip: '@',
                showAddItemTooltip: '=',
                instance: '=',
                orderBy: '=',
                ajax: '=',
                canReset: '=',
                placeholder: '@',
                textPlaceholder: '@',
                multiple: '='
            },
            replace: true,
            template: function(element, attributes) {
                var isAjax = !maHelper.isNullOrWhiteSpace(attributes.ajax),
                    multiple = attributes.multiple === 'true';

                var html = '\
                    <div class="ma-select-box"\
                        ng-class="{\
                            \'ma-select-box-can-add-item\': canAddItem,\
                            \'ma-select-box-is-text-focused\': isTextFocused,\
                            \'ma-select-box-is-disabled\': isDisabled,\
                            \'ma-select-box-is-invalid\': !isValid,\
                            \'ma-select-box-is-touched\': isTouched,\
                            \'ma-select-box-mode-add\': isAddMode,\
                            \'ma-select-box-mode-select\': !isAddMode,\
                            \'ma-select-box-can-reset\': canReset,\
                            \'ma-select-box-is-reset-disabled\': canReset && !isDisabled && !isResetEnabled(),\
                            \'ma-select-box-is-loading\': isLoading\
                        }">\
                        <div class="ma-select-box-spinner" ng-if="isLoading && !isDisabled">\
                            <div class="pace">\
                                <div class="pace-activity"></div>\
                            </div>\
                        </div>';

                if (isAjax) {
                    html += '<input class="ma-select-box-input" ui-select2="options"\
                        ng-show="!isAddMode"\
                        ng-disabled="isDisabled"\
                        ng-change="onChange()"\
                        ng-model="selectedItem"/>';
                } else {
                    // Add an empty option (<option></option>) as first item for the placeholder to work.
                    // It's strange, but that's how Select2 works.
                    html += '\
                        <select ui-select2="options"' + (multiple ? ' multiple' : '') + '\
                            ng-show="!isAddMode"\
                            ng-disabled="isDisabled"\
                            ng-model="selectedItem"\
                            ng-change="onChange()"\
                            placeholder="{{placeholder}}">' + (!multiple ? '<option></option>' : '') + '\
                            <option ng-repeat="item in _items | maSelectBoxOrderBy:orderBy" value="{{getOptionValue(item)}}">\
                                {{formatItem(item)}}\
                            </option>\
                        </select>';
                }

                html += '\
                    <input class="ma-select-box-text" type="text" ng-show="isAddMode"\
                        ng-model="text"\
                        ng-disabled="isDisabled"\
                        ng-focus="onFocus(\'text\')"\
                        placeholder="{{textPlaceholder}}"/>\
                    <ma-button class="ma-button-switch"\
                        ng-show="canAddItem" size="xs" modifier="simple"\
                        tooltip="{{getAddItemTooltip()}}"\
                        right-icon="{{isAddMode ? \'bars\' : \'plus\'}}"\
                        click="toggleMode()"\
                        ng-focus="onFocus()"\
                        is-disabled="isDisabled">\
                    </ma-button>\
                    <ma-button class="ma-button-reset"\
                        ng-show="canReset" size="xs" modifier="simple"\
                        right-icon="times-circle"\
                        click="onReset()"\
                        ng-focus="onFocus(\'reset\')"\
                        is-disabled="!isResetEnabled()">\
                    </ma-button>\
                </div>';

                return html;
            },
            controller: ['$scope', function(scope) {
                // Gets a value from itemValueField if an item is object.
                scope.getItemValue = function(item) {
                    if (!item || !scope.itemValueField) {
                        return null;
                    }

                    // In case of a nested property binding like 'company.port.id'.
                    var parts = scope.itemValueField.split('.'),
                        value = item[parts[0]];

                    for (var i = 1; i < parts.length; i++) {
                        value = value[parts[i]];
                    }

                    if (maHelper.isNullOrUndefined(value)) {
                        return null;
                    }

                    return value.toString();
                };

                scope.formatItem = scope.itemTemplate ||
                    function(item) {
                        if (!item) {
                            return '';
                        }

                        return scope.itemTextField ? item[scope.itemTextField] : item.toString();
                    };

                // Setting Select2 options does not work from link function, so they are set here.
                scope.options = {};
                scope.runInitSelection = true;

                // AJAX options.
                if (scope.ajax) {
                    scope.options.ajax = scope.ajax;
                    scope.options.minimumInputLength = 3;
                    scope.options.escapeMarkup = function(markup) {
                        return markup;
                    };
                    scope.options.initSelection = function initSelection(element, callback) {
                        // Run init function only when it is required to update Select2 value.
                        if (scope.runInitSelection && scope.getItemValue(scope.value)) {
                            var item = angular.copy(scope.value);
                            item.text = scope.formatItem(item);
                            item.id = scope.getItemValue(item);
                            scope.previousSelectedItem = item;
                            callback(item);
                        } else {
                            callback();
                        }

                        scope.runInitSelection = false;
                    };
                }
            }],
            link: function(scope, element) {
                var textElement = angular.element(element[0].querySelector('.ma-select-box-text')),
                    previousAddedItem = null,
                    switchButtonElement,
                    resetButtonElement,
                    selectElement,
                    selectData,
                    labelElement,
                    isFocusLost = true,
                    isFocusInside = false,
                    isSelectHovered = false,
                    showAddItemTooltip = scope.showAddItemTooltip === false ? false : true,
                    validators = scope.validators ? angular.copy(scope.validators) : [],
                    isRequired = scope.isRequired,
                    hasIsNotEmptyValidator = false,
                    previousValue,
                    isObjectArray = scope.itemTextField || scope.itemValueField;

                // We need a copy of items. See 'scope.$watch('items', ...)' for an answer why.
                scope._items = angular.isArray(scope.items) ? angular.copy(scope.items) : [];
                scope.previousSelectedItem = scope.previousSelectedItem || null;
                scope.isAddMode = false;
                scope.isTextFocused = false;
                scope.isValid = true;
                scope.isTouched = false;
                scope.isAjax = angular.isObject(scope.ajax);

                var isExistingItem = function(item) {
                    if (!angular.isArray(scope._items)) {
                        return false;
                    }

                    var isItemObject = scope.getItemValue(item) !== null;

                    for (var i = 0; i < scope._items.length; i++) {
                        if (isItemObject) {
                            // Search by value field.
                            if (scope.getItemValue(scope._items[i]) === scope.getItemValue(item)) {
                                return true;
                            }
                        } else {
                            // Search by item itself as text.
                            if (scope._items[i] === item) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                var getItemByValue = function(itemValue) {
                    if (!itemValue) {
                        return null;
                    }

                    // The list is an array of strings, so value is item itself.
                    if (!isObjectArray) {
                        return itemValue;
                    }

                    if (angular.isArray(scope._items)) {
                        for (var i = 0; i < scope._items.length; i++) {
                            if (scope.getItemValue(scope._items[i]) === itemValue.toString()) {
                                return scope._items[i];
                            }
                        }
                    }

                    return null;
                };

                var getNewItem = function(itemText) {
                    // The list is an array of strings, so item should be a simple string.
                    if (!isObjectArray) {
                        return itemText;
                    }

                    // The list is an array of objects, so item should be an object.
                    if (itemText) {
                        var item = {};
                        item[scope.itemTextField] = itemText;
                        return item;
                    }

                    return null;
                };

                var setInternalValue = function(item) {
                    if (scope.multiple) {
                        var itemsValues = [];

                        if (item && item.length) {
                            for (var i = 0; i < item.length; i++) {
                                itemsValues.push(scope.getItemValue(item[i]));
                            }
                        }

                        scope.selectedItem = itemsValues;
                        validate(item);
                    } else {
                        if (scope.canAddItem && item) {
                            // Switch mode depending on whether provided item exists in the list.
                            // This allows the component to be displayed in correct mode, let's say, in add mode,
                            // when scope.value is initially a custom value not presented in the list.
                            scope.isAddMode = !isExistingItem(item);
                        }

                        validate(item);

                        if (scope.isAddMode) {
                            if (!item) {
                                scope.text = null;
                            } else {
                                if (scope.itemTextField && item[scope.itemTextField]) {
                                    // Item is an object.
                                    scope.text = item[scope.itemTextField].toString();
                                } else {
                                    // Item is a string.
                                    scope.text = item;
                                }
                            }

                            previousAddedItem = item;
                            scope.toggleMode('add');
                        } else {
                            if (!item) {
                                scope.selectedItem = null;
                            } else if (!scope.isAjax) {
                                // Set select value.
                                // When in AJAX mode Select2 sets values by itself.
                                if (scope.getItemValue(item) !== null) {
                                    // Item is an object.
                                    scope.selectedItem = scope.getItemValue(item);
                                } else if (typeof item === 'string') {
                                    // Item is a string.
                                    scope.selectedItem = item;
                                }
                            }

                            scope.previousSelectedItem = item;
                            scope.toggleMode('select');
                        }
                    }
                };

                var onFocusout = function(event, elementName) {
                    var elementTo = angular.element(event.relatedTarget);
                    scope.isTextFocused = false;

                    // Trigger change event for text element.
                    if (elementName === 'text') {
                        isFocusInside = false;

                        // Need to apply changes because onFocusout is triggered using jQuery
                        // (AngularJS does not have ng-focusout event directive).
                        scope.$apply(function() {
                            scope.isTouched = true;
                            var value;

                            if (scope.itemTextField) {
                                if (scope.value && scope.value[scope.itemTextField] === scope.text) {
                                    return;
                                }

                                value = getNewItem(scope.text);
                            } else {
                                if (scope.value === scope.text) {
                                    return;
                                }

                                value = scope.text;
                            }

                            validate(value);

                            if (!scope.isValid) {
                                return;
                            }

                            previousValue = scope.value || null;
                            scope.value = value;
                            previousAddedItem = scope.value;

                            if (scope.isValid) {
                                scope.change({
                                    maValue: scope.value,
                                    maOldValue: previousValue
                                });
                            }
                        });
                    } else if (elementName === 'select') {
                        scope.$apply(function() {
                            scope.isTouched = true;
                        });
                    }

                    // Trigger blur event when focus goes to an element outside the component.
                    isFocusLost = !isFocusInside &&
                        elementTo[0] !== switchButtonElement[0] &&
                        elementTo[0] !== resetButtonElement[0] &&
                        elementTo[0] !== textElement[0] &&
                        elementTo[0] !== selectData.search[0];

                    if (scope.multiple) {
                        if (isSelectHovered) {
                            isFocusLost = false;
                        }
                    } else {
                        // There is no focussser in multiple mode.
                        if (!isFocusInside && elementTo[0] === selectData.focusser[0]) {
                            isFocusLost = false;
                        }
                    }

                    if (isFocusLost) {
                        element.removeClass('ma-select-box-is-select-focused');

                        scope.blur({
                            maValue: scope.value
                        });
                    }

                    isFocusInside = false;
                };

                var validate = function(value) {
                    scope.isValid = true;

                    if (validators && validators.length) {
                        for (var i = 0; i < validators.length; i++) {
                            if (!validators[i].validate(value)) {
                                scope.isValid = false;
                                break;
                            }
                        }
                    }
                };

                var setFocus = function() {
                    // Focus the right element.
                    if (scope.isAddMode) {
                        textElement.focus();
                        scope.isTextFocused = true;
                    } else {
                        selectElement.select2('focus');
                    }
                };

                scope.isResetEnabled = function() {
                    if (scope.isDisabled) {
                        return false;
                    }

                    if (scope.multiple) {
                        return !maHelper.isNullOrUndefined(scope.value) && scope.value.length;
                    }

                    // When in add mode check scope.text as user changes it.
                    if (scope.isAddMode) {
                        return !maHelper.isNullOrWhiteSpace(scope.text);
                    }

                    return !maHelper.isNullOrUndefined(scope.value);
                };

                scope.onReset = function() {
                    scope.isTouched = true;
                    previousValue = scope.value;
                    scope.value = scope.multiple ? [] : null;
                    setFocus();

                    $timeout(function() {
                        scope.change({
                            maValue: scope.value,
                            maOldValue: previousValue
                        });
                    });
                };

                scope.onFocus = function(elementName) {
                    if (elementName === 'text') {
                        scope.isTextFocused = true;
                    }

                    if (elementName === 'reset') {
                        element.removeClass('ma-select-box-is-select-focused');
                    }

                    if (isFocusLost) {
                        scope.focus({
                            maValue: scope.value
                        });
                    }

                    isFocusLost = false;
                };

                textElement.focusout(function(event) {
                    onFocusout(event, 'text');
                });

                scope.getAddItemTooltip = function() {
                    if (!showAddItemTooltip) {
                        return '';
                    }

                    // \u00A0 Unicode character is used here like &nbsp;.
                    if (scope.isAddMode) {
                        return 'Back\u00A0to the\u00A0list';
                    }

                    return scope.addItemTooltip ? scope.addItemTooltip : 'Add new\u00A0item';
                };

                scope.getOptionValue = function(item) {
                    return scope.itemValueField ? scope.getItemValue(item) : item;
                };

                scope.toggleMode = function(mode) {
                    if (!scope.canAddItem) {
                        return;
                    }

                    if (scope.isAddMode && mode === 'add' || !scope.isAddMode && mode === 'select') {
                        return;
                    }

                    var isInternalCall = false;
                    previousValue = scope.value || null;

                    if (mode === 'select') {
                        scope.isAddMode = false;
                        isInternalCall = true;
                    } else if (mode === 'add') {
                        scope.isAddMode = true;
                        isInternalCall = true;
                    } else {
                        scope.isAddMode = !scope.isAddMode;
                    }

                    // Restore previously selected or added item.
                    if (scope.isAddMode) {
                        // Sometimes select2 remains opened after it has lost focus.
                        // Make sure that it is closed in add mode.
                        if (selectElement) {
                            // selectElement is undefined when scope.toggleMode method
                            // is invoked from setInternalValue initially.
                            selectElement.select2('close');
                        }

                        scope.previousSelectedItem = getItemByValue(scope.selectedItem);
                        scope.value = previousAddedItem;

                        if (scope.value) {
                            scope.text = typeof scope.value === 'string' ? scope.value : scope.value[scope.itemTextField];
                        }
                    } else {
                        previousAddedItem = getNewItem(scope.text);
                        scope.value = scope.previousSelectedItem;
                    }

                    if (!isInternalCall) {
                        $timeout(function() {
                            // Trigger change event as user manually swithces between custom and selected item.
                            scope.change({
                                maValue: scope.value,
                                maOldValue: previousValue
                            });

                            setFocus();
                        });
                    }
                };

                scope.onChange = function() {
                    var item;

                    if (scope.multiple) {
                        var itemsValues = scope.selectedItem,
                            items = [];

                        for (var j = 0; j < itemsValues.length; j++) {
                            item = getItemByValue(itemsValues[j]);

                            if (item) {
                                items.push(item);
                            }
                        }

                        scope.isTouched = true;
                        scope.value = items;

                        $timeout(function() {
                            scope.change({
                                maValue: items
                            });
                        });

                        // Invoke mouseleave on the list when it is closed for the next blur event to work properly.
                        selectData.dropdown.mouseleave();
                    } else {
                        // Validation is required if the item is a simple text, not a JSON object.
                        item = maHelper.isJson(scope.selectedItem) ? JSON.parse(scope.selectedItem) : scope.selectedItem;

                        // In case if JSON.parse has parsed string to a number.
                        // This can happen when items is an array of numbers.
                        if (typeof item === 'number') {
                            item = scope.selectedItem;
                        }

                        // The change event works differently in AJAX mode.
                        if (scope.isAjax) {
                            // The change event fires first time even if scope.value has not changed.
                            if (item === scope.previousSelectedItem) {
                                return;
                            }

                            // When item is selected, change event fires multiple times.
                            // The last time, when item is an object, is the correct one - all others must be ignored.
                            if (!angular.isObject(item)) {
                                return;
                            }
                        }

                        // Get selected item from items by value field.
                        // There is no items array in AJAX mode.
                        if (!scope.isAjax) {
                            if (scope.itemValueField && !maHelper.isNullOrWhiteSpace(item)) {
                                for (var i = 0; i < scope._items.length; i++) {

                                    if (scope.getItemValue(scope._items[i]) === item.toString()) {
                                        item = scope._items[i];
                                        break;
                                    }
                                }
                            }
                        }

                        if (!item && !scope.value) {
                            return;
                        }

                        if (scope.itemValueField) {
                            var value = scope.getItemValue(scope.value);

                            if (value && value === scope.getItemValue(item)) {
                                return;
                            }
                        } else if (item === scope.value) {
                            return;
                        }

                        previousValue = scope.value;
                        scope.value = item;
                        scope.previousSelectedItem = item;

                        $timeout(function() {
                            scope.change({
                                maValue: item,
                                maOldValue: previousValue
                            });
                        });
                    }
                };

                // Runs initSelection to force Select2 to refresh its displayed value.
                // This is only required in AJAX mode.
                var initializeSelect2Value = function functionName() {
                    if (!scope.isAjax || !selectData) {
                        return;
                    }

                    // If placeholder is set Select2 initSelection will not work and thus value will not be set.
                    // We need to add/remove placeholder accordingly.
                    selectData.opts.placeholder = scope.value ? '' : scope.placeholder;
                    selectData.setPlaceholder();
                    scope.runInitSelection = true;
                    selectData.initSelection();
                };

                scope.$watch('items', function(newItems, oldItems) {
                    // When an array of items is completely replaced with a new array, angular-ui-select2
                    // triggers a watcher which sets the value to undefined, which we do not want.
                    // So instead of replacing an array, we clear it and repopulate with new items.
                    if (angular.equals(newItems, oldItems)) {
                        return;
                    }

                    scope._items.splice(0, scope._items.length);

                    // Push new items to the array.
                    Array.prototype.push.apply(scope._items, newItems);

                    // Set value to refresh displayed value and mode.
                    // 1 scenario:
                    // Initial value is 'Vladivostok' and items is an empty array, so mode is 'add'.
                    // Then items is set to an array containing 'Vladivostok', so
                    // mode should be switched to 'select', because 'Vladivostok' is now exists in the list.
                    // 2 scenario:
                    // Initial value is 'Vladivostok' and items is an empty array. Select2 displays empty value.
                    // Then items are loaded asynchronously and Select2 value needs to be refreshed.
                    setInternalValue(scope.value);

                    // For some reason angular-ui-select2 does not trigger change for selectedItem
                    // in this case, so we need to set it manually.
                    // See node_modules\angular-ui-select2\src\select2.js line 121.
                    $timeout(function() {
                        var itemValue,
                            item;

                        if (angular.isObject(scope.value)) {
                            if (scope.multiple && angular.isArray(scope.value)) {
                                var items = [];

                                for (var i = 0; i < scope.value.length; i++) {
                                    // An item might only contain value field, which might not be enough to format the item.
                                    // So we need to get a full item from items.
                                    itemValue = scope.getItemValue(scope.value[i]);
                                    item = angular.copy(getItemByValue(itemValue) || scope.value[i]);
                                    item.text = scope.formatItem(item);
                                    item.id = itemValue;

                                    if (item) {
                                        items.push(item);
                                    }
                                }

                                selectData.data(items);
                            } else {
                                itemValue = scope.getItemValue(scope.value);
                                item = angular.copy(getItemByValue(itemValue) || scope.value);
                                item.text = scope.formatItem(item);
                                item.id = itemValue;
                                selectData.data(item);
                            }
                        } else if (!scope.value) {
                            selectData.data(null);
                        } else {
                            selectData.val(scope.value);
                        }
                    });
                }, true);

                scope.$watch('value', function(newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    initializeSelect2Value();
                    setInternalValue(newValue);
                });

                // Validate text while it is being typed.
                scope.$watch('text', function(newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    scope.isTouched = true;
                    validate(newValue);
                });

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.isInitialized = true;

                    scope.instance.switchToSelectMode = function() {
                        if (scope.isAddMode) {
                            scope.toggleMode('select');
                        }
                    };

                    scope.instance.switchToAddMode = function() {
                        if (!scope.isAddMode) {
                            scope.toggleMode('add');
                        }
                    };

                    scope.instance.isValid = function() {
                        return scope.isValid;
                    };

                    scope.instance.validate = function() {
                        scope.isTouched = true;

                        validate(scope.value);
                    };
                }

                // Create a custom 'IsNotEmpty' validator, which also checks that
                // a selected item is in the list.
                var isNotEmptyAndInListValidator = {
                    name: 'IsNotEmpty',
                    validate: function(value) {
                        if (scope.multiple && angular.isArray(value)) {
                            return value.length > 0;
                        }

                        if (maHelper.isNullOrWhiteSpace(value)) {
                            return false;
                        }

                        // In select mode check that a selected item is in the list.
                        // In AJAX mode there is no items array and we can not check it.
                        if (!scope.isAjax && !scope.isAddMode && !isExistingItem(value)) {
                            return false;
                        }

                        return true;
                    }
                };

                // Set up validators.
                for (var i = 0; i < validators.length; i++) {
                    if (validators[i].name === 'IsNotEmpty') {
                        hasIsNotEmptyValidator = true;
                        validators[i] = isNotEmptyAndInListValidator;
                        break;
                    }
                }

                if (!hasIsNotEmptyValidator && isRequired) {
                    validators.unshift(isNotEmptyAndInListValidator);
                }

                if (hasIsNotEmptyValidator) {
                    isRequired = true;
                }

                $timeout(function() {
                    // Set initial value.
                    // Value is set inside timeout to ensure that we get the latest value.
                    // If put outside timeout then there could be issues when value is set
                    // from directive's link function, not from controller.
                    setInternalValue(scope.value);

                    selectElement = angular.element(element[0].querySelector('.select2-container'));
                    selectData = selectElement.data().select2;
                    labelElement = $('label[for="' + scope.id + '"]');
                    switchButtonElement = angular.element(element[0].querySelector('.ma-button-switch'));
                    resetButtonElement = angular.element(element[0].querySelector('.ma-button-reset'));

                    initializeSelect2Value();

                    // Focus the component when label is clicked.
                    if (labelElement.length > 0) {
                        $($document).on('click', 'label[for="' + scope.id + '"]', function() {
                            setFocus();
                        });
                    }

                    if (scope.multiple) {
                        selectData.search.on('focus', function() {
                            element.addClass('ma-select-box-is-select-focused');
                            scope.onFocus();
                        });

                        selectData.search.on('focusout', function(event) {
                            onFocusout(event, 'select');
                        });

                        // Track that the select is hovered to prevent focus lost when a selected item
                        // or selection is clicked.
                        selectData.selection.on('mouseenter', function() {
                            isSelectHovered = true;
                        });

                        selectData.selection.on('mouseleave', function() {
                            isSelectHovered = false;
                        });

                        selectData.dropdown.on('mouseenter', function() {
                            isSelectHovered = true;
                        });

                        selectData.dropdown.on('mouseleave', function() {
                            isSelectHovered = false;
                        });

                        selectData.dropdown.on('click', function() {
                            // Return focus to the input field for the next blur event to work properly.
                            selectData.search.focus();
                        });
                    } else {
                        // There is no focussser in multiple mode.
                        selectData.focusser.on('focus', function() {
                            scope.onFocus('select');
                        });

                        selectData.focusser.on('focusout', function(event) {
                            onFocusout(event, 'select');
                        });
                    }

                    selectData.dropdown.on('focus', '.select2-input', function() {
                        // This is required for IE to keep focus when an item is selected
                        // from the list using keyboard.
                        isFocusInside = true;
                        scope.onFocus();
                    });

                    selectData.dropdown.on('focusout', '.select2-input', function(event) {
                        onFocusout(event, 'select');
                    });

                    switchButtonElement.focusout(function(event) {
                        onFocusout(event);
                    });

                    resetButtonElement.focusout(function(event) {
                        onFocusout(event);
                    });

                    // Detect if item in the list is hovered.
                    // This is later used for triggering blur event correctly.
                    selectData.dropdown.on('mouseenter', '.select2-result', function() {
                        isFocusInside = true;
                    });

                    selectData.dropdown.on('mouseleave', '.select2-result', function() {
                        isFocusInside = false;
                    });

                    // Detect if select2 mask is hovered.
                    // This is later used for triggering blur event correctly in IE.
                    $($document).on('mouseenter', '.select2-drop-mask', function() {
                        if (!scope.multiple) {
                            isFocusInside = true;
                        }
                    });
                });
            }
        };
    }]);
})();
(function(){angular.module('marcuraUI.components').directive('maSideMenu', ['$state', function($state) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            select: '&',
            useState: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-side-menu">\
                <div class="ma-side-menu-item" ng-repeat="item in items" ng-hide="item.hidden" ng-class="{\
                        \'ma-side-menu-item-is-selected\': isItemSelected(item),\
                        \'ma-side-menu-item-is-disabled\': item.isDisabled\
                    }"\
                    ng-click="onSelect(item)">\
                    <i ng-if="item.icon" class="fa fa-{{item.icon}}"></i>\
                    <div class="ma-side-menu-text">{{item.text}}</div>\
                    <div class="ma-side-menu-new" ng-if="item.new">{{item.new}}</div>\
                </div>\
            </div>';

            return html;
        },
        link: function(scope, element, attributes) {
            scope.$state = $state;
            var useState = scope.useState === false ? false : true;

            scope.isItemSelected = function(item) {
                if (item.selector) {
                    return item.selector();
                }

                if (useState) {
                    if (item.state && item.state.name) {
                        return $state.includes(item.state.name);
                    }
                } else {
                    return item.isSelected;
                }

                return false;
            };

            scope.onSelect = function(item) {
                if (item.isDisabled) {
                    return;
                }

                if (useState) {
                    if (item.state && item.state.name) {
                        $state.go(item.state.name, item.state.parameters);
                    }
                } else {
                    angular.forEach(scope.items, function(item) {
                        item.isSelected = false;
                    });
                    item.isSelected = true;

                    scope.select({
                        item: item
                    });
                }
            };
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.services').factory('MaDate', [function() {
    var months = [{
            language: 'en',
            full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }],
        weekDays = [{
            language: 'en',
            full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        }],
        daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var isInteger = function(value) {
        return value === parseInt(value, 10);
    };

    var isDate = function(value) {
        if (!value) {
            return false;
        }

        return Object.prototype.toString.call(value) === '[object Date]' && value.getTime && !isNaN(value.getTime());
    };

    var isMaDate = function(value) {
        return value instanceof MaDate || (!!value && value._isMaDate);
    };

    var isMatch = function(date, substring) {
        return date.match(new RegExp(substring, 'i'));
    };

    var getTotalDate = function(year, month, day, hours, minutes, seconds, milliseconds, offset) {
        var finalMonth,
            maDate = MaDate.createEmpty();
        day = day.toString();
        month = month.toString();
        hours = Number(hours) || 0;
        minutes = Number(minutes) || 0;
        seconds = Number(seconds) || 0;
        milliseconds = Number(milliseconds) || 0;
        offset = offset || 0;

        // Convert YY to YYYY.
        if (year <= 99) {
            if (year >= 0 && year < 30) {
                year = '20' + year;
            } else {
                year = '19' + year;
            }
        }

        // Detect leap year and change amount of days in daysPerMonth for February.
        var isLeap = new Date(year, 1, 29).getMonth() === 1;

        if (isLeap) {
            daysPerMonth[1] = 29;
        } else {
            daysPerMonth[1] = 28;
        }

        // Convert month to number.
        if (month.match(/([^\u0000-\u0080]|[a-zA-Z])$/) !== null) {
            for (var j = 0; j < months.length; j++) {
                for (var i = 0; i < months[j].full.length; i++) {
                    if (isMatch(month, months[j].full[i].slice(0, 3))) {
                        finalMonth = i + 1;
                        break;
                    }
                }
            }

            if (!finalMonth) {
                return maDate;
            }

            month = finalMonth;
        }

        if (month > 12) {
            return maDate;
        }

        if (day > daysPerMonth[month - 1]) {
            return maDate;
        }

        var date = new Date(Number(year), Number(month - 1), Number(day), hours, minutes, seconds);
        date.setMilliseconds(milliseconds);

        maDate = new MaDate(date);
        maDate.offset(offset);

        return maDate;
    };

    var getDayAndMonth = function(day, month, culture) {
        var dayAndMonth = {
            day: day,
            month: month,
            isValid: true
        };

        // Handle difference between en-GB and en-US culture formats.
        if (culture === 'en-GB' && month > 12) {
            dayAndMonth.isValid = false;
        }

        if (culture === 'en-US') {
            dayAndMonth.day = month;
            dayAndMonth.month = day;

            if (day > 12) {
                dayAndMonth.isValid = false;
            }
        }

        // Give priority to en-GB if culture is not set.
        if (!culture && month > 12) {
            dayAndMonth.day = month;
            dayAndMonth.month = day;
        }

        return dayAndMonth;
    };

    var parse = function(value, culture) {
        var pattern, parts, dayAndMonth,
            date = MaDate.createEmpty();

        // Check if a date requires parsing.
        if (isDate(value) || isMaDate(value)) {
            return value;
        }

        if (typeof value !== 'string') {
            return date;
        }

        // Replace multiple whitespaces with a single one.
        value = value.replace(/\s+/g, ' ');

        // 21
        pattern = /^\d{1,2}$/;

        if (value.match(pattern) !== null) {
            var currentDate = new Date();

            return getTotalDate(currentDate.getFullYear(), currentDate.getMonth() + 1, value);
        }

        // 21-02
        pattern = /^(\d{1,2})(\/|-|\.|\s|)(\d{1,2})$/;

        if (value.match(pattern) !== null) {
            parts = pattern.exec(value);
            dayAndMonth = getDayAndMonth(parts[1], parts[3], culture);

            if (!dayAndMonth.isValid) {
                return date;
            }

            return getTotalDate(new Date().getFullYear(), dayAndMonth.month, dayAndMonth.day);
        }

        // 21 Feb 15
        // 21 February 2015
        pattern = /^(\d{1,2})(\/|-|\.|\s|)([^\u0000-\u0080]|[a-zA-Z]{1,12})(\/|-|\.|\s|)(\d{2,4}\b)/;

        if (value.match(pattern) !== null) {
            parts = pattern.exec(value);

            return getTotalDate(parts[5], parts[3], parts[1]);
        }

        // Feb 21, 15
        // Feb 21, 2015
        pattern = /([^\u0000-\u0080]|[a-zA-Z]{3})(\s|)(\d{1,2})(,)(\s|)(\d{2,4})$/;

        if (value.match(pattern) !== null) {
            parts = pattern.exec(value);

            return getTotalDate(parts[6], parts[1], parts[3]);
        }

        // Feb 21 15
        // February 21 2015
        pattern = /^([^\u0000-\u0080]|[a-zA-Z]{1,12})(\/|-|\.|\s|)(\d{1,2})(\/|-|\.|\s|)(\d{2,4}\b)/;

        if (value.match(pattern) !== null) {
            parts = pattern.exec(value);

            return getTotalDate(parts[5], parts[1], parts[3]);
        }

        // 2015-02-21
        pattern = /^(\d{4})(\/|-|\.|\s)(\d{1,2})(\/|-|\.|\s)(\d{1,2})$/;

        if (value.match(pattern) !== null) {
            parts = pattern.exec(value);

            return getTotalDate(parts[1], parts[3], parts[5]);
        }

        // 21-02-15
        // 21-02-2015
        pattern = /^(\d{1,2})(\/|-|\.|\s|)(\d{1,2})(\/|-|\.|\s|)(\d{2,4})$/;

        if (value.match(pattern) !== null) {
            parts = pattern.exec(value);
            dayAndMonth = getDayAndMonth(parts[1], parts[3], culture);

            if (!dayAndMonth.isValid) {
                return date;
            }

            return getTotalDate(parts[5], dayAndMonth.month, dayAndMonth.day);
        }

        // 2015-February-21
        pattern = /^(\d{4})(\/|-|\.|\s|)([^\u0000-\u0080]|[a-zA-Z]{1,12})(\/|-|\.|\s|)(\d{1,2})$/;

        if (value.match(pattern) !== null) {
            parts = pattern.exec(value);

            return getTotalDate(parts[1], parts[3], parts[5]);
        }

        // 2015-02-21T10:00:00Z
        // 2015-02-21T10:00:00.652+03:00
        pattern = /^(\d{4})(\/|-|\.|\s)(\d{1,2})(\/|-|\.|\s)(\d{1,2})T(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)(\.(\d{3}))?(?:Z|([+-])(2[0-3]|[01][0-9]):([0-5][0-9]))$/;

        if (value.match(pattern) !== null) {
            parts = pattern.exec(value);
            var offset = 0;

            // Get time zone offset.
            if (parts.length === 14) {
                offset = (Number(parts[12]) || 0) * 60 + (Number(parts[13]) || 0);

                if (parts[11] === '-' && offset !== 0) {
                    offset = -offset;
                }
            }

            return getTotalDate(parts[1], parts[3], parts[5], parts[6], parts[7], parts[8], parts[10], offset);
        }

        return date;
    };

    var formatNumber = function(number, length) {
        var string = '';

        for (var i = 0; i < length; i++) {
            string += '0';
        }

        return (string + number).slice(-length);
    };

    var isValidTimeZoneOffset = function(offset) {
        return offset >= -720 && offset <= 840;
    };

    var offsetToTimeZone = function(offset) {
        if (offset === 0) {
            return 'Z';
        }

        if (!isInteger(offset)) {
            return null;
        }

        // Time zones vary from -12:00 to 14:00.
        if (offset < -720 || offset > 840) {
            return null;
        }

        var sign = '+';

        if (offset < 0) {
            offset *= -1;
            sign = '-';
        }

        var minutes = offset % 60,
            hours = (offset - minutes) / 60;

        return sign + formatNumber(hours, 2) + ':' + formatNumber(minutes, 2);
    };

    /*
        Overloads:
        - format(date)
        - format(MaDate)
        - format(date, format)
        - format(MaDate, format)
        - format(date, offset)
        - format(MaDate, offset)
        - format(date, format, offset)
        - format(MaDate, format, offset)
    */
    var format = function(date) {
        if (!isDate(date) && !isMaDate(date)) {
            return null;
        }

        var parameters = arguments,
            format,
            offset = 0;

        if (parameters.length === 2) {
            if (typeof parameters[1] === 'string') {
                format = parameters[1];
            } else {
                offset = parameters[1];

                if (!isValidTimeZoneOffset(offset)) {
                    return null;
                }
            }
        } else if (parameters.length === 3) {
            format = parameters[1];
            offset = parameters[2];

            if (!isValidTimeZoneOffset(offset)) {
                return null;
            }
        }

        format = format || 'yyyy-MM-ddTHH:mm:ssZ';

        var languageIndex = 0,
            timeZone = offsetToTimeZone(offset),
            _date = isMaDate(date) ? date.toDate() : date,
            // Possible formats of date parts (day, month, year).
            datePartFormats = {
                f: ['fff'],
                s: ['ss'],
                m: ['mm'],
                H: ['HH'],
                d: ['d', 'dd', 'ddd', 'dddd'],
                M: ['M', 'MM', 'MMM', 'MMMM'],
                y: ['yy', 'yyyy'],
                Z: ['Z']
            },
            day = _date.getDate(),
            dayOfWeek = _date.getDay(),
            month = _date.getMonth(),
            year = _date.getFullYear(),
            hours = _date.getHours(),
            minutes = _date.getMinutes(),
            seconds = _date.getSeconds(),
            milliseconds = _date.getMilliseconds();

        // Checks format string parts on conformity with available date formats.
        var checkDatePart = function(dateChar) {
            var datePart = '';

            // Try-catch construction because some sub-formats may be not listed.
            try {
                datePart = format.match(new RegExp(dateChar + '+', ''))[0];
            } catch (error) {}

            return datePartFormats[dateChar].indexOf(datePart);
        };

        // Formats date parts.
        var formatDatePart = function(datePartFormat) {
            var datePart = '';

            switch (datePartFormat) {
                case datePartFormats.d[0]:
                    // d
                    {
                        datePart = day;
                        break;
                    }
                case datePartFormats.d[1]:
                    // dd
                    {
                        datePart = formatNumber(day, 2);
                        break;
                    }
                case datePartFormats.d[2]:
                    // ddd
                    {
                        datePart = weekDays[languageIndex].short[dayOfWeek];
                        break;
                    }
                case datePartFormats.d[3]:
                    // dddd
                    {
                        datePart = weekDays[languageIndex].full[dayOfWeek];
                        break;
                    }
                case datePartFormats.M[0]:
                    // M
                    {
                        datePart = month + 1;
                        break;
                    }
                case datePartFormats.M[1]:
                    // MM
                    {
                        datePart = formatNumber(month + 1, 2);
                        break;
                    }
                case datePartFormats.M[2]:
                    // MMM
                    {
                        datePart = months[languageIndex].short[month];
                        break;
                    }
                case datePartFormats.M[3]:
                    // MMMM
                    {
                        datePart = months[languageIndex].full[month];
                        break;
                    }
                case datePartFormats.y[0]:
                    // yy
                    {
                        datePart = formatNumber(year, 2);
                        break;
                    }
                case datePartFormats.y[1]:
                    // yyyy
                    {
                        datePart = year;
                        break;
                    }
                case datePartFormats.H[0]:
                    // HH
                    {
                        datePart = formatNumber(hours, 2);
                        break;
                    }
                case datePartFormats.m[0]:
                    // mm
                    {
                        datePart = formatNumber(minutes, 2);
                        break;
                    }
                case datePartFormats.s[0]:
                    // ss
                    {
                        datePart = formatNumber(seconds, 2);
                        break;
                    }
                case datePartFormats.f[0]:
                    // fff
                    {
                        datePart = formatNumber(milliseconds, 3);
                        break;
                    }
                case datePartFormats.Z[0]:
                    // Z
                    {
                        datePart = timeZone || 'Z';
                        break;
                    }
                default:
                    {
                        return '';
                    }
            }

            return datePart;
        };

        // Check format of each part of the obtained format.
        var dateParts = {
            days: formatDatePart(datePartFormats.d[checkDatePart('d')]),
            months: formatDatePart(datePartFormats.M[checkDatePart('M')]),
            years: formatDatePart(datePartFormats.y[checkDatePart('y')]),
            hours: formatDatePart(datePartFormats.H[checkDatePart('H')]),
            minutes: formatDatePart(datePartFormats.m[checkDatePart('m')]),
            seconds: formatDatePart(datePartFormats.s[checkDatePart('s')]),
            milliseconds: formatDatePart(datePartFormats.f[checkDatePart('f')]),
            timeZone: formatDatePart(datePartFormats.Z[0]),
            separator: /^\w+([^\w])/.exec(format)
        };

        // Return formatted date string.
        return format
            .replace(/d+/, dateParts.days)
            .replace(/y+/, dateParts.years)
            .replace(/M+/, dateParts.months)
            .replace(/H+/, dateParts.hours)
            .replace(/m+/, dateParts.minutes)
            .replace(/s+/, dateParts.seconds)
            .replace(/f+/, dateParts.milliseconds)
            .replace(/Z+/, dateParts.timeZone);
    };

    var parseTimeZone = function(timeZone) {
        if (!timeZone) {
            return 0;
        }

        timeZone = timeZone.replace(/GMT/gi, '');

        var parts = /^(?:Z|([+-]?)(2[0-3]|[01][0-9]):([0-5][0-9]))$/.exec(timeZone);

        if (!parts || parts.length !== 4) {
            return 0;
        }

        if (parts[0] === 'Z') {
            return 0;
        }

        // Calculate time zone offset in minutes.
        var offset = Number(parts[2]) * 60 + Number(parts[3]);

        if (offset !== 0 && parts[1] === '-') {
            offset *= -1;
        }

        return offset;
    };

    /*
        Overloads:
        - new MaDate() +
        - new MaDate(Date) +
        - new MaDate(MaDate) +
        - new MaDate(dateString) +
        - new MaDate(dateString, culture) +
        - new MaDate(year)
        - new MaDate(year, month)
        - new MaDate(year, month, date)
        - new MaDate(year, month, date, hour)
        - new MaDate(year, month, date, hour, minute)
        - new MaDate(year, month, date, hour, minute, second)
    */
    function MaDate() {
        var parameters = arguments,
            date;
        this._date = null;
        this._offset = 0;
        this._isMaDate = true;

        if (parameters.length === 0) {
            // Create a current date.
            this._date = new Date();
        } else if (parameters.length === 1) {
            date = parameters[0];

            if (isDate(date)) {
                this._date = new Date(date.valueOf());
            } else if (isMaDate(date)) {
                // MaDate is provided - copy it.
                if (!date.isEmpty()) {
                    this._date = new Date(date.toDate().valueOf());
                }

                this._offset = date.offset();
            } else if (typeof date === 'string') {
                // Parse date.
                date = parse(date);
                this._date = date.toDate();
                this._offset = date.offset();
            } else if (isInteger(date)) {
                // Year.
                this._date = new Date(date, 0, 1, 0, 0, 0);
            }
        } else if (parameters.length === 2) {
            // Date string and culture.
            if (typeof parameters[0] === 'string' && typeof parameters[1] === 'string') {
                date = parse(parameters[0], parameters[1]);
                this._date = date.toDate();
                this._offset = date.offset();
            } else if (isInteger(parameters[0]) && isInteger(parameters[1])) {
                // Year and month.
                this._date = new Date(parameters[0], parameters[1], 1, 0, 0, 0);
            }
        } else if (parameters.length === 3 && isInteger(parameters[0]) && isInteger(parameters[1]) && isInteger(parameters[2])) {
            // Year, month and date.
            this._date = new Date(parameters[0], parameters[1], parameters[2], 0, 0, 0);
        } else if (parameters.length === 4 && isInteger(parameters[0]) && isInteger(parameters[1]) && isInteger(parameters[2]) && isInteger(parameters[3])) {
            // Year, month and date.
            this._date = new Date(parameters[0], parameters[1], parameters[2], parameters[3], 0, 0);
        } else if (parameters.length === 5 && isInteger(parameters[0]) && isInteger(parameters[1]) && isInteger(parameters[2]) && isInteger(parameters[3]) &&
            isInteger(parameters[4])) {
            // Year, month and date.
            this._date = new Date(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], 0);
        } else if (parameters.length === 6 && isInteger(parameters[0]) && isInteger(parameters[1]) && isInteger(parameters[2]) && isInteger(parameters[3]) &&
            isInteger(parameters[4]) && isInteger(parameters[5])) {
            // Year, month and date.
            this._date = new Date(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5]);
        }
    }

    MaDate.createEmpty = function() {
        return new MaDate(null);
    };

    MaDate.prototype.copy = function() {
        return new MaDate(this);
    };

    MaDate.prototype.toDate = function() {
        return this._date;
    };

    MaDate.prototype.offset = function(offset) {
        if (arguments.length === 0) {
            return this._offset;
        }

        this._offset = offset;
        return this;
    };

    MaDate.prototype.toUtc = function() {
        if (this.isEmpty() || this._offset === 0) {
            return this;
        }

        this.subtract(this._offset, 'minute');
        this._offset = 0;

        return this;
    };

    MaDate.prototype.isEmpty = function() {
        return !this._date;
    };

    MaDate.prototype.isUtc = function() {
        return !this.isEmpty() && this._offset === 0;
    };

    MaDate.prototype.isEqual = function(date) {
        return this.difference(date) === 0;
    };

    MaDate.prototype.isLess = function(date) {
        return this.difference(date) < 0;
    };

    MaDate.prototype.isLessOrEqual = function(date) {
        return this.difference(date) <= 0;
    };

    MaDate.prototype.isGreater = function(date) {
        return this.difference(date) > 0;
    };

    MaDate.prototype.isGreaterOrEqual = function(date) {
        return this.difference(date) >= 0;
    };

    MaDate.prototype.isBetween = function(startDate, endDate, isInclusive) {
        var _startDate = new MaDate(startDate),
            _endDate = new MaDate(endDate);

        if (this.isEmpty() || _startDate.isEmpty() || _endDate.isEmpty()) {
            return false;
        }

        if (isInclusive) {
            return this.isGreaterOrEqual(_startDate) && this.isLessOrEqual(_endDate);
        }

        return this.isGreater(_startDate) && this.isLess(_endDate);
    };

    MaDate.prototype.difference = function(date) {
        return this.valueOf() - new MaDate(date).valueOf();
    };

    MaDate.prototype.valueOf = function() {
        if (this.isEmpty()) {
            return 0;
        }

        var time = this._date.valueOf();

        // Add offset which is in minutes, and thus should be converted to milliseconds.
        if (this._offset !== 0) {
            time -= this._offset * 60000;
        }

        return time;
    };

    MaDate.prototype.format = function(_format) {
        if (this.isEmpty()) {
            return null;
        }

        return format(this._date, _format, this._offset);
    };

    MaDate.prototype.add = function(number, unit) {
        if (this.isEmpty() || !number) {
            return this;
        }

        // Don't change original date.
        var date = new Date(this._date);

        switch (unit) {
            case 'year':
                date.setFullYear(date.getFullYear() + number);
                break;
            case 'quarter':
                date.setMonth(date.getMonth() + 3 * number);
                break;
            case 'month':
                date.setMonth(date.getMonth() + number);
                break;
            case 'week':
                date.setDate(date.getDate() + 7 * number);
                break;
            case 'day':
                date.setDate(date.getDate() + number);
                break;
            case 'hour':
                date.setTime(date.getTime() + number * 3600000);
                break;
            case 'minute':
                date.setTime(date.getTime() + number * 60000);
                break;
            case 'second':
                date.setTime(date.getTime() + number * 1000);
                break;
            case 'millisecond':
                date.setTime(date.getTime() + number);
                break;
        }

        this._date = date;

        return this;
    };

    MaDate.prototype.subtract = function(number, unit) {
        return this.add(number * -1, unit);
    };

    MaDate.prototype.millisecond = function(millisecond) {
        if (this.isEmpty()) {
            return 0;
        }

        if (arguments.length === 0) {
            return this._date.getMilliseconds();
        } else {
            this._date.setMilliseconds(millisecond);
            return this;
        }
    };

    MaDate.prototype.second = function(second) {
        if (this.isEmpty()) {
            return 0;
        }

        if (arguments.length === 0) {
            return this._date.getSeconds();
        } else {
            this._date.setSeconds(second);
            return this;
        }
    };

    MaDate.prototype.minute = function(minute) {
        if (this.isEmpty()) {
            return 0;
        }

        if (arguments.length === 0) {
            return this._date.getMinutes();
        } else {
            this._date.setMinutes(minute);
            return this;
        }
    };

    MaDate.prototype.hour = function(hour) {
        if (this.isEmpty()) {
            return 0;
        }

        if (arguments.length === 0) {
            return this._date.getHours();
        } else {
            this._date.setHours(hour);
            return this;
        }
    };

    MaDate.prototype.date = function(date) {
        if (this.isEmpty()) {
            return 0;
        }

        if (arguments.length === 0) {
            return this._date.getDate();
        } else {
            this._date.setDate(date);
            return this;
        }
    };

    MaDate.prototype.month = function(month) {
        if (this.isEmpty()) {
            return 0;
        }

        if (arguments.length === 0) {
            return this._date.getMonth();
        } else {
            this._date.setMonth(month);
            return this;
        }
    };

    MaDate.prototype.year = function(year) {
        if (this.isEmpty()) {
            return 0;
        }

        if (arguments.length === 0) {
            return this._date.getFullYear();
        } else {
            this._date.setFullYear(year);
            return this;
        }
    };

    MaDate.prototype.startOf = function(unit) {
        switch (unit) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'month':
                this.date(1);
                /* falls through */
            case 'day':
                this.hour(0);
                /* falls through */
            case 'hour':
                this.minute(0);
                /* falls through */
            case 'minute':
                this.second(0);
                /* falls through */
            case 'second':
                this.millisecond(0);
        }

        return this;
    };

    MaDate.prototype.endOf = function(unit) {
        if (!unit) {
            return this;
        }

        return this.startOf(unit).add(1, unit).subtract(1, 'millisecond');
    };

    MaDate.parse = parse;
    MaDate.parseTimeZone = parseTimeZone;
    MaDate.offsetToTimeZone = offsetToTimeZone;
    MaDate.isDate = isDate;
    MaDate.isMaDate = isMaDate;

    return MaDate;
}]);
})();
(function(){angular.module('marcuraUI.services').factory('maHelper', ['MaDate', '$rootScope', function(MaDate, $rootScope) {
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
            up: 38
        },

        isEmail: function(value) {
            var pattern = /^([\+\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return pattern.test(value);
        },

        isNullOrWhiteSpace: function(value) {
            if (value === null || value === undefined) {
                return true;
            }

            if (angular.isArray(value)) {
                return false;
            }

            // Convert value to string in case if it is not.
            return value.toString().replace(/\s/g, '').length < 1;
        },

        isNullOrUndefined: function(value) {
            return value === null || angular.isUndefined(value);
        },

        formatString: function(value) {
            // Source: http://ajaxcontroltoolkit.codeplex.com/SourceControl/latest#Client/MicrosoftAjax/Extensions/String.js
            var formattedString = '';

            for (var i = 0;;) {
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

                if (typeof(arg) === 'undefined' || arg === null) {
                    arg = '';
                }

                formattedString += arg.toString();
                i = close + 1;
            }

            return formattedString;
        },

        changeSortingOrder: function(sorting, orderBy) {
            if (orderBy.charAt(0) === '-') {
                if (sorting.orderedBy !== orderBy) {
                    sorting.direction = 'desc';
                    sorting.orderedBy = orderBy;
                } else {
                    sorting.direction = 'asc';
                    sorting.orderedBy = orderBy.substr(1);
                }
            } else {
                if (sorting.orderedBy !== orderBy) {
                    sorting.direction = 'asc';
                    sorting.orderedBy = orderBy;
                } else {
                    sorting.direction = 'desc';
                    sorting.orderedBy = '-' + orderBy;
                }
            }
        },

        getTextHeight: function(text, font, width, lineHeight) {
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

        isGreater: function(value, valueToCompare) {
            var date1 = new MaDate(value),
                date2 = new MaDate(valueToCompare);

            if (!date1.isEmpty() && !date2.isEmpty()) {
                return date1.isGreater(date2);
            }

            return value > valueToCompare;
        },

        isGreaterOrEqual: function(value, valueToCompare) {
            var date1 = new MaDate(value),
                date2 = new MaDate(valueToCompare);

            if (!date1.isEmpty() && !date2.isEmpty()) {
                return date1.isGreaterOrEqual(date2);
            }

            return value >= valueToCompare;
        },

        isLess: function(value, valueToCompare) {
            var date1 = new MaDate(value),
                date2 = new MaDate(valueToCompare);

            if (!date1.isEmpty() && !date2.isEmpty()) {
                return date1.isLess(date2);
            }

            return value < valueToCompare;
        },

        isLessOrEqual: function(value, valueToCompare) {
            var date1 = new MaDate(value),
                date2 = new MaDate(valueToCompare);

            if (!date1.isEmpty() && !date2.isEmpty()) {
                return date1.isLessOrEqual(date2);
            }

            return value <= valueToCompare;
        },

        isJson: function(value) {
            try {
                JSON.parse(value);
                return true;
            } catch (error) {
                return false;
            }
        },

        safeApply: function(method) {
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
})();
(function(){angular.module('marcuraUI.services').factory('maValidators', ['maHelper', 'MaDate', function(maHelper, MaDate) {
    var formatValueToCompare = function(value) {
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

        isGreater: function(valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field can not be less than or equal to ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsGreater',
                message: message,
                validate: function(value) {
                    if (allowEmpty && maHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return maHelper.isGreater(value, valueToCompare);
                }
            };
        },

        isGreaterOrEqual: function(valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field can not be less than ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsGreaterOrEqual',
                message: message,
                validate: function(value) {
                    if (allowEmpty && maHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return maHelper.isGreaterOrEqual(value, valueToCompare);
                }
            };
        },

        isLess: function(valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field can not be greater than or equal to ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsLess',
                message: message,
                validate: function(value) {
                    if (allowEmpty && maHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return maHelper.isLess(value, valueToCompare);
                }
            };
        },

        isLessOrEqual: function(valueToCompare, allowEmpty) {
            var message = null;

            if (valueToCompare) {
                message = 'This field can not be greater than ' + formatValueToCompare(valueToCompare) + '.';
            }

            return {
                name: 'IsLessOrEqual',
                message: message,
                validate: function(value) {
                    if (allowEmpty && maHelper.isNullOrWhiteSpace(value)) {
                        return true;
                    }

                    return maHelper.isLessOrEqual(value, valueToCompare);
                }
            };
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maTabs', ['$state', 'maHelper', '$timeout', function($state, maHelper, $timeout) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            select: '&',
            useState: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-tabs">\
                <ul class="ma-tabs-list clearfix">\
                    <li class="ma-tabs-item" ng-repeat="item in items"\
                        ng-focus="onFocus(item)"\
                        ng-blur="onBlur(item)"\
                        ng-keypress="onKeypress($event, item)"\
                        ng-class="{\
                            \'ma-tabs-item-is-selected\': isItemSelected(item),\
                            \'ma-tabs-item-is-disabled\': item.isDisabled,\
                            \'ma-tabs-item-is-focused\': item.isFocused\
                        }"\
                        ng-click="onSelect(item)">\
                        <a class="ma-tabs-link" href="" tabindex="-1">\
                            <span class="ma-tabs-text">{{item.text}}</span>\
                        </a>\
                    </li>\
                </ul>\
            </div>';

            return html;
        },
        link: function(scope, element, attributes) {
            scope.$state = $state;
            var useState = scope.useState === false ? false : true;

            scope.isItemSelected = function(item) {
                if (item.selector) {
                    return item.selector();
                }

                if (useState) {
                    if (item.state && item.state.name) {
                        return $state.includes(item.state.name);
                    }
                } else {
                    return item.isSelected;
                }

                return false;
            };

            scope.onSelect = function(item) {
                if (item.isDisabled || item.isSelected) {
                    return;
                }

                if (useState) {
                    if (item.state && item.state.name) {
                        $state.go(item.state.name, item.state.parameters);
                    }
                } else {
                    angular.forEach(scope.items, function(item) {
                        item.isSelected = false;
                    });
                    item.isSelected = true;

                    scope.select({
                        item: item
                    });
                }
            };

            scope.onKeypress = function(event, item) {
                if (event.keyCode === maHelper.keyCode.enter) {
                    scope.onSelect(item);
                }
            };

            scope.onFocus = function(item) {
                item.isFocused = true;
            };

            scope.onBlur = function(item) {
                item.isFocused = false;
            };

            $timeout(function() {
                var itemElements = angular.element(element[0].querySelectorAll('.ma-tabs-item'));

                itemElements.each(function(itemIndex, itemElement) {
                    var item = scope.items[itemIndex];

                    if (!item.isDisabled) {
                        angular.element(itemElement).attr('tabindex', '0');
                    }
                });
            });
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maTextBox', ['$timeout', 'maHelper', 'maValidators', function($timeout, maHelper, maValidators) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@',
            value: '=',
            isDisabled: '=',
            isRequired: '=',
            validators: '=',
            instance: '=',
            change: '&',
            blur: '&',
            focus: '&',
            changeTimeout: '=',
            canReset: '=',
            placeholder: '@',
            hasShowPasswordButton: '=',
            trim: '='
        },
        replace: true,
        template: function(element, attributes) {
            var type = attributes.type === 'password' ? 'password' : 'text';

            var html = '\
            <div class="ma-text-box"\
                ng-class="{\
                    \'ma-text-box-is-disabled\': isDisabled,\
                    \'ma-text-box-is-focused\': isValueFocused,\
                    \'ma-text-box-is-invalid\': !isValid,\
                    \'ma-text-box-is-touched\': isTouched,\
                    \'ma-text-box-can-reset\': canReset,\
                    \'ma-text-box-is-reset-disabled\': canReset && !isDisabled && !isResetEnabled(),\
                    \'ma-text-box-can-toggle-password\': canTogglePassword,\
                    \'ma-text-box-is-toggle-password-disabled\': canTogglePassword && !isDisabled && !isTogglePasswordEnabled()\
                }">\
                <input class="ma-text-box-value" type="' + type + '" id="{{id}}"\
                    type="text"\
                    autocomplete="off"\
                    placeholder="{{placeholder}}"\
                    ng-focus="onFocus(\'value\')"\
                    ng-keydown="onKeydown($event)"\
                    ng-disabled="isDisabled"/>\
                <ma-button class="ma-button-toggle-password"\
                    ng-show="canTogglePassword" size="xs" modifier="simple"\
                    right-icon="{{isPasswordVisible ? \'eye-slash\' : \'eye\'}}"\
                    click="togglePassword()"\
                    ng-focus="onFocus()"\
                    is-disabled="!isTogglePasswordEnabled()">\
                </ma-button>\
                <ma-button class="ma-button-reset"\
                    ng-show="canReset" size="xs" modifier="simple"\
                    right-icon="times-circle"\
                    click="onReset()"\
                    ng-focus="onFocus()"\
                    is-disabled="!isResetEnabled()">\
                </ma-button>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var valueElement = angular.element(element[0].querySelector('.ma-text-box-value')),
                resetButtonElement = angular.element(element[0].querySelector('.ma-button-reset')),
                togglePasswordButtonElement = angular.element(element[0].querySelector('.ma-button-toggle-password')),
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                // Variables keydownValue and keyupValue help track touched state.
                keydownValue,
                keyupValue,
                previousValue,
                changePromise,
                changeTimeout = Number(scope.changeTimeout),
                // Value at the moment of focus.
                focusValue,
                isFocusLost = true,
                trim = scope.trim === false ? false : true,
                isInternalChange = false;

            var setPreviousValue = function(value) {
                // Convert the value to string if it's a number, for example,
                // because a number cannot be trimmed.
                value = (maHelper.isNullOrUndefined(value) ? '' : value).toString();

                if (trim) {
                    value = value.trim();
                }

                previousValue = value;
            };

            var validate = function() {
                scope.isValid = true;
                var value = valueElement.val();

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        if (!validators[i].validate(value)) {
                            scope.isValid = false;
                            break;
                        }
                    }
                }
            };

            var triggerChange = function(value) {
                if (!hasValueChanged(value)) {
                    return;
                }

                isInternalChange = true;
                var oldValue = trim ? previousValue.trim() : previousValue;
                value = trim ? value.trim() : value;
                scope.value = value;
                setPreviousValue(value);

                $timeout(function() {
                    scope.change({
                        maValue: value,
                        maOldValue: oldValue
                    });
                });
            };

            var hasValueChanged = function(value) {
                value = maHelper.isNullOrUndefined(value) ? '' : value;
                var oldValue = maHelper.isNullOrUndefined(previousValue) ? '' : previousValue;

                if (trim) {
                    return oldValue.trim() !== value.trim();
                }

                return oldValue !== value;
            };

            var changeValue = function() {
                scope.isTouched = true;

                if (!hasValueChanged(valueElement.val())) {
                    validate();
                    return;
                }

                validate();

                if (scope.isValid) {
                    triggerChange(valueElement.val());
                }
            };

            scope.isValueFocused = false;
            scope.isTouched = false;
            scope.canTogglePassword = false;
            scope.isPasswordVisible = false;

            if (scope.type === 'password') {
                scope.canTogglePassword = scope.hasShowPasswordButton !== false;
            }

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

            scope.isResetEnabled = function() {
                return !scope.isDisabled && valueElement.val() !== '';
            };

            scope.onReset = function() {
                if (scope.isDisabled) {
                    return;
                }

                setPreviousValue(valueElement.val());
                scope.isTouched = true;
                valueElement.val('');
                triggerChange('');
                validate();
                valueElement.focus();
            };

            scope.onFocus = function(elementName) {
                if (elementName === 'value') {
                    scope.isValueFocused = true;
                }

                if (isFocusLost) {
                    focusValue = scope.value;

                    scope.focus({
                        maValue: scope.value
                    });
                }

                isFocusLost = false;
            };

            valueElement.focusout(function(event) {
                onFocusout(event);
            });

            resetButtonElement.focusout(function(event) {
                onFocusout(event);
            });

            togglePasswordButtonElement.focusout(function(event) {
                onFocusout(event);
            });

            scope.togglePassword = function() {
                scope.isPasswordVisible = !scope.isPasswordVisible;
                valueElement[0].type = scope.isPasswordVisible ? 'text' : 'password';
            };

            scope.isTogglePasswordEnabled = function() {
                return !scope.isDisabled && valueElement.val() !== '';
            };

            var onFocusout = function(event) {
                var elementTo = angular.element(event.relatedTarget);

                // Trigger blur event when focus goes to an element outside the component.
                if (scope.canTogglePassword) {
                    isFocusLost = elementTo[0] !== valueElement[0] &&
                        elementTo[0] !== togglePasswordButtonElement[0] &&
                        elementTo[0] !== resetButtonElement[0];
                } else {
                    isFocusLost = elementTo[0] !== valueElement[0] &&
                        elementTo[0] !== resetButtonElement[0];
                }

                // Cancel change if it is already in process to prevent the event from firing twice.
                if (changePromise) {
                    $timeout.cancel(changePromise);
                }

                // Use safeApply to avoid apply error when Reset icon is clicked.
                maHelper.safeApply(function() {
                    scope.isValueFocused = false;
                });

                if (isFocusLost) {
                    changeValue();

                    maHelper.safeApply(function() {
                        scope.blur({
                            maValue: scope.value,
                            maOldValue: focusValue,
                            maHasValueChanged: focusValue !== scope.value
                        });
                    });
                }
            };

            scope.onKeydown = function(event) {
                // Ignore tab key.
                if (event.keyCode === maHelper.keyCode.tab || event.keyCode === maHelper.keyCode.shift) {
                    return;
                }

                keydownValue = angular.element(event.target).val();
            };

            // Use input event to support value change from contextual menu,
            // e.g. mouse right click + Cut/Copy/Paste etc.
            valueElement.on('input', function(event) {
                // Ignore tab key.
                if (event.keyCode === maHelper.keyCode.tab || event.keyCode === maHelper.keyCode.shift) {
                    return;
                }

                var hasChanged = false;
                keyupValue = angular.element(event.target).val();

                if (keydownValue !== keyupValue) {
                    hasChanged = true;
                }

                // Change value after a timeout while the user is typing.
                if (!hasChanged) {
                    return;
                }

                if (changePromise) {
                    $timeout.cancel(changePromise);
                }

                // $timeout is required here to apply scope changes, even if changeTimeout is 0.
                changePromise = $timeout(function() {
                    changeValue();
                }, changeTimeout);
            });

            $timeout(function() {
                // Move id to input.
                element.removeAttr('id');
                valueElement.attr('id', scope.id);
            });

            scope.$watch('value', function(newValue, oldValue) {
                if (isInternalChange) {
                    isInternalChange = false;
                    return;
                }

                if (newValue === oldValue) {
                    return;
                }

                var caretPosition = valueElement.prop('selectionStart');
                setPreviousValue(newValue);
                valueElement.val(newValue);
                validate();

                // Restore caret position.
                if (scope.isValueFocused) {
                    valueElement.prop({
                        selectionStart: caretPosition,
                        selectionEnd: caretPosition
                    });
                }
            });

            // Set initial value.
            valueElement.val(scope.value);
            validate();
            setPreviousValue(scope.value);

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.validate = function() {
                    scope.isTouched = true;
                    validate();
                };

                scope.instance.isValid = function() {
                    return scope.isValid;
                };

                scope.instance.focus = function() {
                    if (!scope.isValueFocused) {
                        valueElement.focus();
                    }
                };
            }
        }
    };
}]);
})();
(function(){angular.module('marcuraUI.components').directive('maTextArea', ['$timeout', '$window', 'maHelper', 'maValidators', function($timeout, $window, maHelper, maValidators) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            value: '=',
            isDisabled: '=',
            fitContentHeight: '=',
            isResizable: '=',
            isRequired: '=',
            validators: '=',
            instance: '=',
            updateOn: '@',
            change: '&'
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-text-area"\
                ng-class="{\
                    \'ma-text-area-is-disabled\': isDisabled,\
                    \'ma-text-area-is-focused\': isFocused,\
                    \'ma-text-area-fit-content-height\': fitContentHeight,\
                    \'ma-text-area-is-invalid\': !isValid,\
                    \'ma-text-area-is-touched\': isTouched\
                }">\
                <textarea class="ma-text-area-value"\
                    type="text"\
                    ng-focus="onFocus()"\
                    ng-blur="onBlur()"\
                    ng-keydown="onKeydown($event)"\
                    ng-keyup="onKeyup($event)"\
                    ng-disabled="isDisabled">\
                </textarea>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var valueElement = angular.element(element[0].querySelector('.ma-text-area-value')),
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                // Variables keydownValue and keyupValue help track touched state.
                keydownValue,
                keyupValue,
                previousValue,
                updateOn = scope.updateOn ? scope.updateOn : 'input';

            var getValueElementStyle = function() {
                var style = $window.getComputedStyle(valueElement[0], null),
                    properties = {},
                    paddingHeight = parseInt(style.getPropertyValue('padding-top')) + parseInt(style.getPropertyValue('padding-bottom')),
                    paddingWidth = parseInt(style.getPropertyValue('padding-left')) + parseInt(style.getPropertyValue('padding-right')),
                    borderHeight = parseInt(style.getPropertyValue('border-top-width')) + parseInt(style.getPropertyValue('border-bottom-width')),
                    borderWidth = parseInt(style.getPropertyValue('border-left-width')) + parseInt(style.getPropertyValue('border-right-width'));

                properties.width = parseInt($window.getComputedStyle(valueElement[0], null).getPropertyValue('width')) - paddingWidth;
                properties.height = parseInt($window.getComputedStyle(valueElement[0], null).getPropertyValue('height')) - paddingHeight;
                properties.paddingHeight = paddingHeight;
                properties.paddingWidth = paddingWidth;
                properties.borderHeight = borderHeight;
                properties.borderWidth = borderWidth;
                properties.lineHeight = style.getPropertyValue('line-height');

                // IE and Firefox do not support 'font' property, so we need to get it ourselves.
                properties.font = style.getPropertyValue('font-style') + ' ' +
                    style.getPropertyValue('font-variant') + ' ' +
                    style.getPropertyValue('font-weight') + ' ' +
                    style.getPropertyValue('font-size') + ' ' +
                    style.getPropertyValue('font-height') + ' ' +
                    style.getPropertyValue('font-family');

                return properties;
            };

            var resize = function() {
                if (!scope.fitContentHeight) {
                    return;
                }

                var valueElementStyle = getValueElementStyle(),
                    textHeight = maHelper.getTextHeight(valueElement.val(), valueElementStyle.font, valueElementStyle.width + 'px', valueElementStyle.lineHeight),
                    height = (textHeight + valueElementStyle.paddingHeight + valueElementStyle.borderHeight);

                if (height < 40) {
                    height = 30;
                }

                valueElement[0].style.height = height + 'px';
                element[0].style.height = height + 'px';
            };

            var validate = function() {
                scope.isValid = true;

                if (validators && validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        if (!validators[i].validate(valueElement.val())) {
                            scope.isValid = false;
                            break;
                        }
                    }
                }
            };

            var onChange = function(value) {
                if (previousValue === value) {
                    return;
                }

                previousValue = value;

                $timeout(function() {
                    scope.change({
                        maValue: value
                    });
                });
            };

            scope.isFocused = false;
            scope.isTouched = false;

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

            scope.onFocus = function() {
                scope.isFocused = true;
            };

            scope.onBlur = function() {
                scope.isFocused = false;
                scope.isTouched = true;

                if (scope.isValid && updateOn === 'blur') {
                    scope.value = valueElement.val();
                    onChange(scope.value);
                }

                validate();
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
                }
            };

            // We are forced to use input event because scope.watch does
            // not respond to Enter key when the cursor is in the end of text.
            valueElement.on('input', function(event) {
                validate();
                resize();

                if (scope.isValid && updateOn === 'input') {
                    scope.$apply(function() {
                        scope.value = valueElement.val();
                    });
                }
            });

            angular.element($window).on('resize', function() {
                resize();
            });

            $timeout(function() {
                resize();

                if (scope.isResizable === false) {
                    valueElement.css('resize', 'none');
                }

                // Move id to input.
                element.removeAttr('id');
                valueElement.attr('id', scope.id);

                // If TextArea is hidden initially with ng-show then after appearing
                // it's height is calculated incorectly. This code fixes the issue.
                if (scope.fitContentHeight) {
                    var hiddenParent = $(element[0]).closest('.ng-hide[ng-show]');

                    if (hiddenParent.length === 1) {
                        var parentScope = hiddenParent.scope();

                        parentScope.$watch(hiddenParent.attr('ng-show'), function(isVisible) {
                            if (isVisible) {
                                // Wait for the hidden element to appear first.
                                $timeout(function() {
                                    resize();
                                });
                            }
                        });
                    }
                }
            });

            scope.$watch('value', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                scope.isValid = true;
                scope.isTouched = false;

                // IE 11.0 version moves the caret at the end when textarea value is fully replaced.
                // In IE 11.126+ the issue has been fixed.
                var caretPosition = valueElement.prop('selectionStart');
                valueElement.val(newValue);

                // Restore caret position.
                valueElement.prop({
                    selectionStart: caretPosition,
                    selectionEnd: caretPosition
                });

                resize();
            });

            // Set initial value.
            valueElement.val(scope.value);
            validate();
            previousValue = scope.value;

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function() {
                    return scope.isValid;
                };

                scope.instance.focus = function() {
                    if (!scope.isFocused) {
                        valueElement.focus();
                    }
                };
            }
        }
    };
}]);
})();