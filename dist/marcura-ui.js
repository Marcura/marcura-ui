(function(){angular.module('marcuraUI.services', []);
angular.module('marcuraUI.components', ['marcuraUI.services']);
angular.module('marcuraUI', ['marcuraUI.components']);

angular.element(document).ready(function () {
    // Detect IE9.
    var ie = (function () {
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
        $.fn.modal.Constructor.prototype.hideModal = function () {
            var that = this;
            this.$element.hide();
            this.backdrop(function () {
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

// Add a polyfill for String.prototype.endsWith().
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}})();
(function(){angular.module('marcuraUI.components').directive('maButton', ['MaHelper', '$sce', function (MaHelper, $sce) {
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
            modifier: '@',
            isLoading: '='
        },
        replace: true,
        template: function () {
            var html = '\
                <button class="ma-button"\
                    ng-click="onClick()"\
                    ng-disabled="isDisabled"\
                    ng-class="{\
                        \'ma-button-link\': isLink(),\
                        \'ma-button-has-left-icon\': hasLeftIcon,\
                        \'ma-button-has-right-icon\': hasRightIcon,\
                        \'ma-button-is-disabled\': isDisabled,\
                        \'ma-button-has-text\': hasText(),\
                        \'ma-button-is-loading\': isLoading\
                    }">\
                    <span class="ma-button-spinner" ng-if="isLoading">\
                        <div class="pace">\
                            <div class="pace-activity"></div>\
                        </div>\
                    </span>\
                    <span ng-if="leftIcon" class="ma-button-icon ma-button-icon-left">\
                        <i class="fa fa-{{leftIcon}}"></i>\
                        <span class="ma-button-rim" ng-if="isLink()"></span>\
                    </span><span class="ma-button-text" ng-bind-html="getText()"></span><span ng-if="rightIcon" class="ma-button-icon ma-button-icon-right">\
                        <i class="fa fa-{{rightIcon}}"></i>\
                        <span class="ma-button-rim" ng-if="isLink()"></span>\
                    </span>\
                    <span class="ma-button-rim" ng-if="!isLink()"></span>\
                </button>';

            return html;
        },
        link: function (scope, element) {
            scope.hasLeftIcon = false;
            scope.hasRightIcon = false;
            scope.size = scope.size ? scope.size : 'md';
            scope.hasLeftIcon = scope.leftIcon ? true : false;
            scope.hasRightIcon = scope.rightIcon ? true : false;
            element.addClass('ma-button-' + scope.size);

            var setModifiers = function (oldModifiers) {
                // Remove previous modifiers first.
                if (!MaHelper.isNullOrWhiteSpace(oldModifiers)) {
                    oldModifiers = oldModifiers.split(' ');

                    for (var i = 0; i < oldModifiers.length; i++) {
                        element.removeClass('ma-button-' + oldModifiers[i]);
                    }
                }

                var modifiers = '';

                if (!MaHelper.isNullOrWhiteSpace(scope.modifier)) {
                    modifiers = scope.modifier.split(' ');
                }

                for (var j = 0; j < modifiers.length; j++) {
                    element.addClass('ma-button-' + modifiers[j]);
                }
            };

            scope.onClick = function () {
                if (scope.isDisabled || scope.isLoading) {
                    return;
                }

                scope.click();
            };

            scope.isLink = function functionName() {
                return scope.kind === 'link';
            };

            scope.hasText = function () {
                return scope.text ? true : false;
            };

            scope.getText = function () {
                return $sce.trustAsHtml(scope.text ? scope.text : MaHelper.html.nbsp);
            };

            scope.$watch('modifier', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setModifiers(oldValue);
            });

            setModifiers();
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maCheckBox', ['MaHelper', '$timeout', '$parse', 'MaValidators', function (MaHelper, $timeout, $parse, MaValidators) {
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
        template: function () {
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
        link: function (scope, element, attributes) {
            var validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false;

            var setTabindex = function () {
                if (scope.isDisabled) {
                    element.removeAttr('tabindex');
                } else {
                    element.attr('tabindex', '0');
                }
            };

            var setText = function () {
                scope.hasText = scope.text ? true : false;
            };

            scope._size = scope.size ? scope.size : 'xs';
            scope.cssClass = ' ma-check-box-' + scope._size;
            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

            var getControllerScope = function () {
                var valuePropertyParts = null,
                    controllerScope = null,
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

                // Use parent scope by default if search is unsuccessful.
                return controllerScope || scope.$parent;
            };

            // When the component is inside ng-if, a normal binding like value="isEnabled" won't work,
            // as the value will be stored by Angular on ng-if scope.
            var controllerScope = getControllerScope();

            var validate = function () {
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

            scope.onChange = function () {
                if (scope.isDisabled) {
                    return;
                }

                // Handle nested properties or function calls with $parse service.
                // This is related to a case when the component is located inside ng-if,
                // but it works for other cases as well.
                var valueGetter = $parse(attributes.value),
                    valueSetter = valueGetter.assign,
                    value = !valueGetter(controllerScope);

                scope.value = value;
                valueSetter(controllerScope, value);
                validate();

                $timeout(function () {
                    scope.change({
                        maValue: scope.value
                    });
                });
            };

            scope.onFocus = function () {
                if (!scope.isDisabled) {
                    scope.isFocused = true;
                }
            };

            scope.onBlur = function () {
                if (scope.isDisabled) {
                    return;
                }

                scope.isFocused = false;
                validate();
            };

            scope.onKeypress = function (event) {
                if (event.keyCode === MaHelper.keyCode.space) {
                    // Prevent page from scrolling down.
                    event.preventDefault();

                    if (!scope.isDisabled) {
                        scope.onChange();
                    }
                }
            };

            scope.$watch('isDisabled', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (newValue) {
                    scope.isFocused = false;
                }

                setTabindex();
            });

            scope.$watch('text', function (newValue, oldValue) {
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
                validators.unshift(MaValidators.isNotEmpty());
            }

            if (hasIsNotEmptyValidator) {
                isRequired = true;
            }

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function () {
                    return scope.isValid;
                };

                scope.instance.validate = function () {
                    validate();
                };
            }

            setTabindex();
            setText();
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maCostsGrid', [function () {
    return {
        restrict: 'E',
        scope: {
            costItems: '='
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-grid ma-grid-costs"\
                costs grid\
            </div>';

            return html;
        },
        link: function (scope) {
            console.log('scope.costItems:', scope.costItems);
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components')
    .provider('maDateBoxConfiguration', function () {
        this.$get = function () {
            return this;
        };
    })
    .directive('maDateBox', ['$timeout', 'MaDate', 'MaHelper', 'MaValidators', function ($timeout, MaDate, MaHelper, MaValidators) {
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
                min: '=',
                max: '=',
                changeTimeout: '=',
                placeholder: '@',
                modifier: '@'
            },
            replace: true,
            template: function (element) {
                var html = '\
                <div class="ma-date-box" ng-class="{\
                        \'ma-date-box-has-time\': hasTime,\
                        \'ma-date-box-is-invalid\': !isValid,\
                        \'ma-date-box-is-disabled\': isDisabled,\
                        \'ma-date-box-is-focused\': isFocused,\
                        \'ma-date-box-is-touched\': isTouched,\
                        \'ma-date-box-can-reset\': canReset,\
                        \'ma-date-box-is-reset-disabled\': canReset && !isDisabled && !isResetEnabled(),\
                        \'ma-date-box-has-value\': hasValue()\
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
            controller: ['$scope', 'maDateBoxConfiguration', function (scope, maDateBoxConfiguration) {
                scope.configuration = {};
                scope.configuration.displayFormat = (scope.displayFormat || maDateBoxConfiguration.displayFormat || 'dd MMM yyyy')
                    .replace(/Y/g, 'y').replace(/D/g, 'd');
                scope.configuration.format = (scope.format || maDateBoxConfiguration.format || 'yyyy-MM-ddTHH:mm:ssZ')
                    .replace(/Y/g, 'y').replace(/D/g, 'd');
                scope.configuration.timeZone = (scope.timeZone || maDateBoxConfiguration.timeZone || 'Z')
                    .replace(/GMT/g, '');
            }],
            link: function (scope, element) {
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
                    minDate = new MaDate(scope.min),
                    maxDate = new MaDate(scope.max),
                    failedValidator = null,
                    changePromise,
                    changeTimeout = Number(scope.changeTimeout),
                    dateCaretPosition = 0,
                    hourCaretPosition = 0,
                    minuteCaretPosition = 0,
                    isDateFocused,
                    isHourFocused,
                    isMinuteFocused;

                var hasDateChanged = function (date) {
                    if (previousDate.isEqual(date)) {
                        return false;
                    }

                    scope.isTouched = true;

                    return true;
                };

                // Returns null if display date is invalid.
                var getDisplayDate = function () {
                    var displayDate = dateElement.val().trim(),
                        isEmpty = displayDate === '',
                        hour = Number(hourElement.val()),
                        minute = Number(minuteElement.val()),
                        date = MaDate.createEmpty();

                    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
                        return null;
                    }

                    if (isEmpty) {
                        return date;
                    }

                    date = new MaDate(displayDate);

                    // Date can't be parsed.
                    if (date.isEmpty()) {
                        return null;
                    }

                    date.add(hour, 'hour');
                    date.add(minute, 'minute');
                    date.offset(initialDateOffset);

                    return date;
                };

                var setDisplayDate = function (date) {
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

                        $timeout(function () {
                            addFocusEvent();
                            addBlurEvent();
                        });
                    }

                    // Set calendar date.
                    if (picker) {
                        picker.setDate(displayDate ? displayDate.toDate() : null, true);
                    }
                };

                var setMaxDate = function () {
                    if (!picker) {
                        return;
                    }

                    maxDate = new MaDate(scope.max);

                    // Pikaday does no support clearing maxDate by providing null value.
                    // So we just set maxDate to 100 years ahead.
                    if (maxDate.isEmpty()) {
                        maxDate = new MaDate().add(100, 'year');
                    }

                    picker.setMaxDate(maxDate.toDate());
                };

                var setMinDate = function () {
                    if (!picker) {
                        return;
                    }

                    minDate = new MaDate(scope.min);

                    // Pikaday does no support clearing minDate by providing null value.
                    // So we just set minDate to 100 years before.
                    if (minDate.isEmpty()) {
                        minDate = new MaDate().subtract(100, 'year');
                    }

                    picker.setMinDate(minDate.toDate());
                };

                var parseDate = function (date) {
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

                var setDateTime = function (date) {
                    date.hour(Number(hourElement.val()))
                        .minute(Number(minuteElement.val()))
                        .second(0);
                };

                var resetInitialDateOffset = function () {
                    // Override initial time zone offset after date has been changed.
                    initialDateOffset = timeZoneOffset;
                };

                var initializePikaday = function () {
                    picker = new Pikaday({
                        field: angular.element(element[0].querySelector('.ma-date-box-icon'))[0],
                        position: 'bottom right',
                        onSelect: function () {
                            var date = new MaDate(picker.getDate());
                            date.offset(timeZoneOffset);

                            if (scope.hasTime) {
                                setDateTime(date);
                                resetInitialDateOffset();
                            }

                            // Use $timeout to apply scope changes instead of $apply,
                            // which throws digest error at this point.
                            $timeout(function () {
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

                var destroyPikaday = function () {
                    if (picker) {
                        picker.destroy();
                    }
                };

                var validate = function (date, triggerEvent) {
                    scope.isValid = true;
                    failedValidator = null;
                    triggerEvent = triggerEvent !== undefined ? triggerEvent : true;
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

                var setValidators = function () {
                    var hasIsNotEmptyValidator = false;
                    validators = scope.validators ? angular.copy(scope.validators) : [];

                    for (var i = 0; i < validators.length; i++) {
                        if (validators[i].name === 'IsNotEmpty') {
                            hasIsNotEmptyValidator = true;
                            break;
                        }
                    }

                    if (!hasIsNotEmptyValidator && isRequired) {
                        validators.unshift(MaValidators.isNotEmpty());
                    }

                    if (hasIsNotEmptyValidator) {
                        isRequired = true;
                    }

                    if (!minDate.isEmpty()) {
                        validators.push(MaValidators.isGreaterOrEqual(minDate, true));
                    }

                    if (!maxDate.isEmpty()) {
                        validators.push(MaValidators.isLessOrEqual(maxDate, true));
                    }
                };

                var triggerChange = function (date) {
                    previousDate = date || MaDate.createEmpty();
                    scope.value = date ? date.format(format) : null;

                    // Postpone change event for $apply (which is being invoked by $timeout)
                    // to have time to take effect and update scope.value,
                    // so both maValue and scope.value have the same values eventually.
                    $timeout(function () {
                        scope.change({
                            maValue: scope.value
                        });
                    });
                };

                var triggerValidate = function (date) {
                    // Postpone the event to allow scope.value to be updated, so
                    // the event can operate relevant value.
                    $timeout(function () {
                        scope.validate({
                            maValue: date ? date.format(format) : null
                        });
                    });
                };

                var changeDate = function () {
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

                var focusDate = function () {
                    isDateFocused = true;
                    isHourFocused = false;
                    isMinuteFocused = false;
                    scope.onFocus();
                };

                var focusHour = function () {
                    isHourFocused = true;
                    isDateFocused = false;
                    isMinuteFocused = false;
                    scope.onFocus();
                };

                var focusMinute = function () {
                    isMinuteFocused = true;
                    isDateFocused = false;
                    isHourFocused = false;
                    scope.onFocus();
                };

                var blurDate = function () {
                    isDateFocused = false;
                    scope.onBlur();
                };

                var blurHour = function () {
                    isHourFocused = false;
                    scope.onBlur();
                };

                var blurMinute = function () {
                    isMinuteFocused = false;
                    scope.onBlur();
                };

                var addFocusEvent = function () {
                    // Remove the event in case it exists.
                    removeFocusEvent();
                    $('.ma-date-box-date', element).on('focus', focusDate);
                    $('.ma-date-box-hour', element).on('focus', focusHour);
                    $('.ma-date-box-minute', element).on('focus', focusMinute);
                };

                var removeFocusEvent = function () {
                    $('.ma-date-box-date', element).off('focus', focusDate);
                    $('.ma-date-box-hour', element).off('focus', focusHour);
                    $('.ma-date-box-minute', element).off('focus', focusMinute);
                };

                var addBlurEvent = function () {
                    // Remove the event in case it exists.
                    removeBlurEvent();
                    $('.ma-date-box-date', element).on('blur', blurDate);
                    $('.ma-date-box-hour', element).on('blur', blurHour);
                    $('.ma-date-box-minute', element).on('blur', blurMinute);
                };

                var removeBlurEvent = function () {
                    $('.ma-date-box-date', element).off('blur', blurDate);
                    $('.ma-date-box-hour', element).off('blur', blurHour);
                    $('.ma-date-box-minute', element).off('blur', blurMinute);
                };

                var setModifiers = function (oldModifiers) {
                    // Remove previous modifiers first.
                    if (!MaHelper.isNullOrWhiteSpace(oldModifiers)) {
                        oldModifiers = oldModifiers.split(' ');

                        for (var i = 0; i < oldModifiers.length; i++) {
                            element.removeClass('ma-date-box-' + oldModifiers[i]);
                        }
                    }

                    var modifiers = '';

                    if (!MaHelper.isNullOrWhiteSpace(scope.modifier)) {
                        modifiers = scope.modifier.split(' ');
                    }

                    for (var j = 0; j < modifiers.length; j++) {
                        element.addClass('ma-date-box-' + modifiers[j]);
                    }
                };

                setValidators();
                scope.isFocused = false;
                scope.isValid = true;
                scope.isTouched = false;

                scope.hasValue = function () {
                    return dateElement.val() || hourElement.val() !== '00' || minuteElement.val() !== '00';
                };

                scope.isResetEnabled = function () {
                    return !scope.isDisabled && (dateElement.val() || hourElement.val() !== '00' || minuteElement.val() !== '00');
                };

                scope.onFocus = function () {
                    // Use safeApply to avoid apply error when Reset icon is clicked.
                    MaHelper.safeApply(function () {
                        scope.isFocused = true;
                    });
                };

                scope.onBlur = function () {
                    // Cancel change if it is already in process to prevent the event from firing twice.
                    if (changePromise) {
                        $timeout.cancel(changePromise);
                    }

                    scope.$apply(function () {
                        scope.isFocused = false;
                        changeDate();
                    });
                };

                scope.onKeydown = function (event) {
                    // Ignore tab key.
                    if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
                        return;
                    }

                    keydownValue = angular.element(event.target).val();
                };

                scope.onKeyup = function (event) {
                    // Ignore tab key.
                    if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
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

                        changePromise = $timeout(function () {
                            changeDate();
                        }, changeTimeout);
                    }
                };

                scope.onTimeKeydown = function (event) {
                    if (
                        // Allow backspace, tab, delete.
                        $.inArray(event.keyCode, [MaHelper.keyCode.backspace, MaHelper.keyCode.tab, MaHelper.keyCode.delete]) !== -1 ||
                        // Allow left, right.
                        (event.keyCode === 37 || event.keyCode === 39)) {
                        return;
                    }

                    // Ensure that it is a number and stop the keypress.
                    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                        event.preventDefault();
                    }
                };

                scope.onReset = function () {
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

                $timeout(function () {
                    if (!scope.isDisabled) {
                        initializePikaday();
                    }

                    // Move id to input.
                    element.removeAttr('id');
                    dateElement.attr('id', scope.id);
                });

                scope.$watch('value', function (newDate, oldDate) {
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

                scope.$watch('isDisabled', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    if (!scope.isDisabled) {
                        initializePikaday();
                    } else {
                        destroyPikaday();
                    }
                });

                var minMaxDateWatcher = function (newValue, oldValue, dateName) {
                    if (newValue === oldValue) {
                        return;
                    }

                    var date = parseDate(dateElement.val().trim());
                    date.offset(timeZoneOffset);

                    if (dateName === 'max') {
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

                scope.$watch('max', function (newValue, oldValue) {
                    minMaxDateWatcher(newValue, oldValue, 'max');
                });

                scope.$watch('min', function (newValue, oldValue) {
                    minMaxDateWatcher(newValue, oldValue, 'min');
                });

                scope.$watch('modifier', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    setModifiers(oldValue);
                });

                setModifiers();

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.isInitialized = true;

                    scope.instance.validate = function () {
                        scope.isTouched = true;

                        // Use display date, as scope date can't be invalid, because
                        // we don't update scope value when display date is invalid.
                        var date = getDisplayDate();

                        if (!date || (isRequired && date.isEmpty())) {
                            scope.isValid = false;
                            return;
                        }

                        // Prevent loop that might occur if validate method is invoked
                        // from validate event from outside.
                        validate(date, false);
                    };

                    scope.instance.isValid = function () {
                        return scope.isValid;
                    };

                    scope.instance.failedValidator = function () {
                        return failedValidator;
                    };

                    scope.instance.refresh = function () {
                        var date = parseDate(scope.value);
                        setDisplayDate(date);
                        validate(date, false);
                    };
                }
            }
        };
    }]);})();
(function(){angular.module('marcuraUI.components').directive('maGridOrder', ['$timeout', function ($timeout) {
    return {
        // maGridOrder should always be located inside maGrid.
        require: '^^maGrid',
        restrict: 'E',
        scope: {
            orderBy: '@'
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-grid-order{{isVisible() ? \' ma-grid-order-\' + direction : \'\'}}"\
                ng-click="order()">\
                <i class="fa fa-sort-asc"></i>\
                <i class="fa fa-sort-desc"></i>\
            </div>';

            return html;
        },
        link: function (scope, element, attributes, grid) {
            var gridScope,
                headerColElement = element.closest('.ma-grid-header-col');

            var getGridScope = function () {
                var gridScope = null,
                    initialScope = scope.$parent;

                while (initialScope && !gridScope) {
                    if (initialScope.hasOwnProperty('componentName') && initialScope.componentName === 'maGrid') {
                        gridScope = initialScope;
                    } else {
                        initialScope = initialScope.$parent;
                    }
                }

                return gridScope;
            };

            scope.order = function () {
                if (!gridScope) {
                    return;
                }

                var isReverse = gridScope.orderBy.charAt(0) === '-';
                isReverse = !isReverse;

                gridScope.orderBy = isReverse ? '-' + scope.orderBy : scope.orderBy;
                scope.direction = isReverse ? 'desc' : 'asc';

                // Postpone the event to allow gridScope.orderBy to change first.
                $timeout(function () {
                    gridScope.order();
                });
            };

            var cleanOrderBy = function (orderBy) {
                return orderBy.charAt(0) === '-' ? orderBy.substring(1) : orderBy;
            };

            if (!headerColElement.hasClass('ma-grid-header-col-sortable')) {
                headerColElement.addClass('ma-grid-header-col-sortable');
            }

            // Set a timeout before searching for maGrid scope to make sure it's been initialized.
            $timeout(function () {
                gridScope = getGridScope();

                if (cleanOrderBy(gridScope.orderBy) === scope.orderBy) {
                    scope.direction = gridScope.orderBy.charAt(0) === '-' ? 'desc' : 'asc';
                }
            });

            scope.isVisible = function () {
                if (!gridScope) {
                    return false;
                }

                return cleanOrderBy(gridScope.orderBy) === scope.orderBy;
            };
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maGrid', ['MaHelper', function (MaHelper) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            orderBy: '=',
            modifier: '@',
            isResponsive: '=',
            responsiveSize: '@',
            order: '&'
        },
        replace: true,
        template: function () {
            var html = '\
            <div class="ma-grid">\
                <div class="ma-grid-inner"><ng-transclude></ng-transclude></div>\
            </div>';

            return html;
        },
        controller: ['$scope', function (scope) {
            scope.componentName = 'maGrid';
        }],
        link: function (scope, element) {
            var responsiveSize = scope.responsiveSize ? scope.responsiveSize : 'md';

            var setModifiers = function (oldModifiers) {
                // Remove previous modifiers first.
                if (!MaHelper.isNullOrWhiteSpace(oldModifiers)) {
                    oldModifiers = oldModifiers.split(' ');

                    for (var i = 0; i < oldModifiers.length; i++) {
                        element.removeClass('ma-grid-' + oldModifiers[i]);
                    }
                }

                var modifiers = '';

                if (!MaHelper.isNullOrWhiteSpace(scope.modifier)) {
                    modifiers = scope.modifier.split(' ');
                }

                for (var j = 0; j < modifiers.length; j++) {
                    element.addClass('ma-grid-' + modifiers[j]);
                }
            };

            var setModifier = function (modifierName, modifierValue) {
                var modifier;

                if (typeof modifierValue === 'boolean') {
                    modifier = 'ma-grid-' + modifierName;

                    if (modifierValue === true) {
                        element.addClass(modifier);
                    } else {
                        element.removeClass(modifier);
                    }
                } else if (modifierValue) {
                    // Clean existing classes.
                    element.removeClass(function (index, className) {
                        return (className.match(RegExp('ma-grid-' + modifierName + '-.+', 'ig')) || []).join(' ');
                    });

                    element.addClass('ma-grid-' + modifierName + '-' + modifierValue);
                }
            };

            scope.$watch('modifier', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setModifiers(oldValue);
            });

            scope.$watch('isResponsive', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setModifier('is-responsive', scope.isResponsive);
            });

            setModifiers();
            setModifier('is-responsive', scope.isResponsive);

            if (scope.isResponsive) {
                scope.$watch('responsiveSize', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    responsiveSize = newValue;
                    setModifier('responsive-size', responsiveSize);
                });

                setModifier('responsive-size', responsiveSize);
            }
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maLabel', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            cutOverflow: '=',
            for: '@',
            isRequired: '=',
            hasWarning: '=',
            hasHint: '='
        },
        replace: true,
        template: function () {
            var html = '\
                <div class="ma-label" ng-class="{\
                    \'ma-label-is-required\': isRequired,\
                    \'ma-label-has-content\': hasContent,\
                    \'ma-label-has-warning\': hasWarning,\
                    \'ma-label-has-hint\': hasHint,\
                    \'ma-label-cut-overflow\': cutOverflow\
                }">\
                    <label class="ma-label-text" for="{{for}}"><ng-transclude></ng-transclude></label><!--\
                    --><div class="ma-label-star" ng-if="isRequired">&nbsp;<i class="fa fa-star"></i></div><!--\
                    --><div class="ma-label-warning" ng-if="hasWarning">&nbsp;\
                    <i class="fa fa-exclamation-triangle"></i></div><div class="ma-label-hint" ng-if="hasHint">&nbsp;<div class="ma-label-hint-inner"><i class="fa fa-question"></i><div></div>\
                </div>';

            return html;
        },
        link: function (scope, element) {
            scope.hasContent = element.find('span').contents().length > 0;
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maMessage', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            type: '@',
            state: '@',
            size: '@',
            textAlign: '@',
            hasIcon: '='
        },
        replace: true,
        template: function () {
            var html = '\
                <div class="ma-message{{cssClass}}">\
                    <div class="ma-message-icon" ng-if="_hasIcon">\
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
        link: function (scope) {
            var type = scope.type || 'message',
                size = scope.size ? scope.size : 'sm';
            scope._hasIcon = scope.hasIcon === false ? false : true;

            var setState = function () {
                scope._state = scope.state || 'default';
            };

            var setCssClass = function () {
                scope.cssClass = ' ma-message-' + type + ' ma-message-' + scope._state + ' ma-message-' + size;

                if (scope.textAlign) {
                    scope.cssClass += ' ma-message-text-align-' + scope.textAlign;
                }

                if (scope._hasIcon) {
                    scope.cssClass += ' ma-message-has-icon';
                }
            };

            scope.$watch('state', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setState();
                setCssClass();
            });

            setState();
            setCssClass();
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maMultiCheckBox', ['$timeout', 'MaValidators', function ($timeout, MaValidators) {
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
        template: function () {
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
        link: function (scope, element) {
            var isObjectArray = scope.itemTextField || scope.itemValueField,
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                itemsMetadata = {};

            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

            var validate = function (value) {
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

            var setSelectedItems = function () {
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

            scope.getItemMetadata = function (item) {
                var itemValue = isObjectArray ? item[scope.itemValueField] : item;

                if (!itemsMetadata[itemValue]) {
                    itemsMetadata[itemValue] = {};
                    itemsMetadata[itemValue].item = item;
                }

                return itemsMetadata[itemValue];
            };

            scope.getItemText = function (item) {
                if (scope.itemTemplate) {
                    return scope.itemTemplate(item);
                } else if (!isObjectArray) {
                    return item;
                } else if (scope.itemTextField) {
                    return item[scope.itemTextField];
                }
            };

            scope.onChange = function (item) {
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

                $timeout(function () {
                    validate(scope.value);

                    scope.change({
                        maValue: scope.value,
                        maOldValue: oldValue
                    });
                });
            };

            scope.$watch('value', function (newValue, oldValue) {
                if (angular.equals(newValue, oldValue)) {
                    return;
                }

                setSelectedItems();
            });

            // Set initial value.
            $timeout(function () {
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
                validators.unshift(MaValidators.isNotEmpty());
            }

            if (hasIsNotEmptyValidator) {
                isRequired = true;
            }

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function () {
                    return scope.isValid;
                };

                scope.instance.validate = function () {
                    validate(scope.value);
                };
            }
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maProgress', [function () {
    return {
        restrict: 'E',
        scope: {
            steps: '=',
            currentStep: '='
        },
        replace: true,
        template: function () {
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
        link: function (scope) {
            scope.calculateLeft = function (stepIndex) {
                return 100 / (scope.steps.length - 1) * stepIndex;
            };

            scope.calculateProgress = function () {
                if (!scope.currentStep) {
                    return 0;
                }

                if (scope.currentStep > scope.steps.length) {
                    return 100;
                }

                return 100 / (scope.steps.length - 1) * (scope.currentStep - 1);
            };

            scope.isCurrentStep = function (stepIndex) {
                return (stepIndex + 1) <= scope.currentStep;
            };
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maRadioBox', ['MaHelper', '$timeout', '$sce', 'MaValidators', function (MaHelper, $timeout, $sce, MaValidators) {
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
            id: '@',
            modifier: '@'
        },
        replace: true,
        template: function () {
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
        link: function (scope, element, attributes) {
            var valuePropertyParts = null,
                isStringArray = !scope.itemTextField && !scope.itemValueField,
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false;

            var setModifiers = function (oldModifiers) {
                // Remove previous modifiers first.
                if (!MaHelper.isNullOrWhiteSpace(oldModifiers)) {
                    oldModifiers = oldModifiers.split(' ');

                    for (var i = 0; i < oldModifiers.length; i++) {
                        element.removeClass('ma-radio-box-' + oldModifiers[i]);
                    }
                }

                var modifiers = '';

                if (!MaHelper.isNullOrWhiteSpace(scope.modifier)) {
                    modifiers = scope.modifier.split(' ');
                }

                for (var j = 0; j < modifiers.length; j++) {
                    element.addClass('ma-radio-box-' + modifiers[j]);
                }
            };

            var setTabindex = function () {
                if (scope.isDisabled) {
                    element.removeAttr('tabindex');
                } else {
                    element.attr('tabindex', '0');
                }
            };

            var getControllerScope = function () {
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

            var validate = function (value) {
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

            scope.validateThis = function (value) {
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

            scope.getItemText = function () {
                if (scope.hideText) {
                    return MaHelper.html.nbsp;
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
                    text = MaHelper.html.nbsp;
                }

                return $sce.trustAsHtml(text);
            };

            scope.hasText = function () {
                return scope.getItemText() !== MaHelper.html.nbsp;
            };

            scope.isChecked = function () {
                if (isStringArray) {
                    return scope.item === scope.value;
                } else if (scope.itemValueField) {
                    return scope.item && scope.value &&
                        scope.item[scope.itemValueField] === scope.value[scope.itemValueField];
                }

                return false;
            };

            scope.onChange = function () {
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
                    $timeout(function () {
                        validate(scope.value);

                        scope.change({
                            maValue: scope.item,
                            maOldValue: oldValue
                        });
                    });
                }
            };

            scope.onFocus = function () {
                if (!scope.isDisabled) {
                    scope.isFocused = true;
                }
            };

            scope.onBlur = function () {
                if (scope.isDisabled) {
                    return;
                }

                scope.isFocused = false;

                validate(scope.value);
            };

            scope.onKeypress = function (event) {
                if (event.keyCode === MaHelper.keyCode.space) {
                    // Prevent page from scrolling down.
                    event.preventDefault();

                    if (!scope.isDisabled && !scope.isChecked()) {
                        scope.onChange();
                    }
                }
            };

            scope.$watch('isDisabled', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (newValue) {
                    scope.isFocused = false;
                }

                setTabindex();
            });

            scope.$watch('modifier', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setModifiers(oldValue);
            });

            // Set up validators.
            for (var i = 0; i < validators.length; i++) {
                if (validators[i].name === 'IsNotEmpty') {
                    hasIsNotEmptyValidator = true;
                    break;
                }
            }

            if (!hasIsNotEmptyValidator && isRequired) {
                validators.unshift(MaValidators.isNotEmpty());
            }

            if (hasIsNotEmptyValidator) {
                isRequired = true;
            }

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function () {
                    return scope.isValid;
                };

                scope.instance.validate = function () {
                    validate(scope.value);
                };
            }

            $timeout(function () {
                // Now id is used only for grouping radioBoxes, so remove it from the element.
                if (scope.id) {
                    element.removeAttr('id');
                }

                setModifiers();
            });

            setTabindex();
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maPager', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            page: '=',
            totalItems: '=',
            visiblePages: '=',
            showItemsPerPage: '=',
            allowAllItemsPerPage: '=',
            itemsPerPageNumbers: '=',
            itemsPerPageText: '@',
            itemsPerPage: '=',
            change: '&'
        },
        replace: true,
        template: function () {
            var html = '<div class="ma-pager" ng-class="{\
                \'ma-pager-has-pager\': _hasPager\
            }">\
                <div class="ma-pager-items-per-page" ng-if="_showItemsPerPage">\
                    <div class="ma-pager-items-per-page-text" ng-show="itemsPerPageText">{{itemsPerPageText}}</div><ma-select-box\
                        items="_itemsPerPageNumbers"\
                        value="_itemsPerPage"\
                        change="itemsPerPageChange(maValue, maOldValue)">\
                    </ma-select-box>\
                </div><div class="ma-pager-pager">\
                    <div class="ma-pager-start">\
                        <ma-button\
                            class="ma-button-first"\
                            text="First"\
                            size="xs"\
                            modifier="default"\
                            click="firstClick()"\
                            is-disabled="_page <= 1"\
                        ></ma-button><ma-button\
                            class="ma-button-previous"\
                            text="Previous"\
                            size="xs"\
                            modifier="default"\
                            click="previousClick()"\
                            is-disabled="_page <= 1">\
                        </ma-button>\
                    </div\
                    ><div class="ma-pager-middle">\
                        <ma-button\
                            class="ma-button-previous-range"\
                            text="..."\
                            size="xs"\
                            modifier="default"\
                            click="previousRangeClick()"\
                            is-disabled="isFirstRange"\
                        ></ma-button><div class="ma-pager-pages"><ma-button\
                            ng-repeat="rangePage in rangePages"\
                            class="ma-button-page"\
                            text="{{rangePage}}"\
                            size="xs"\
                            modifier="{{_page === rangePage ? \'selected\' : \'default\'}}"\
                            click="pageClick(rangePage)"></div></ma-button\
                        ><ma-button\
                            class="ma-button-next-range"\
                            text="..."\
                            size="xs"\
                            modifier="default"\
                            click="nextRangeClick()"\
                            is-disabled="isLastRange"\
                        ></ma-button>\
                    </div\
                    ><div class="ma-pager-end">\
                        <ma-button\
                            class="ma-button-next"\
                            text="Next"\
                            size="xs"\
                            modifier="default"\
                            click="nextClick()"\
                            is-disabled="_page >= totalPages"\
                        ></ma-button><ma-button\
                            class="ma-button-last"\
                            text="Last"\
                            size="xs"\
                            modifier="default"\
                            click="lastClick()"\
                            is-disabled="_page >= totalPages">\
                        </ma-button>\
                    </div>\
                </div>\
            </div>';

            return html;
        },
        link: function (scope) {
            scope._page = scope.page;
            scope._showItemsPerPage = scope.showItemsPerPage === false ? false : true;
            scope._itemsPerPageNumbers = ['25', '50', '75', '100'];
            scope._itemsPerPage = '25';
            scope.hasItemsPerPageChanged = false;
            scope._totalItems = scope.totalItems >= 0 ? scope.totalItems : 0;

            var setTotalPages = function () {
                scope.totalPages = Math.ceil(scope._totalItems / Number(scope._itemsPerPage));
            };

            var setItemsPerPage = function () {
                if (!scope._showItemsPerPage || !scope.itemsPerPage) {
                    return;
                }

                scope._itemsPerPage = scope.itemsPerPage.toString();
            };

            var setItemsPerPageNumbers = function () {
                if (!scope._showItemsPerPage) {
                    return;
                }

                if (angular.isArray(scope.itemsPerPageNumbers)) {
                    scope._itemsPerPageNumbers = scope.itemsPerPageNumbers;
                }

                if (scope.allowAllItemsPerPage) {
                    scope._itemsPerPageNumbers.push('All');
                }
            };

            var setRangePages = function () {
                scope._visiblePages = scope.visiblePages > 1 ? scope.visiblePages : 5;

                if (scope.totalPages < scope._visiblePages) {
                    scope._visiblePages = scope.totalPages || 1;
                }

                scope.rangePages = [];
                scope.range = Math.ceil(scope._page / scope._visiblePages) - 1;
                scope.isFirstRange = scope.range === 0;
                scope.isLastRange = scope.range === Math.ceil(scope.totalPages / scope._visiblePages) - 1;
                var startPage = scope.range * scope._visiblePages;

                for (var visiblePage = 1; visiblePage <= scope._visiblePages && startPage + visiblePage <= scope.totalPages; visiblePage++) {
                    scope.rangePages.push(startPage + visiblePage);
                }
            };

            var setHasPager = function () {
                if (scope._itemsPerPage === 'All') {
                    scope._hasPager = false;
                    return;
                }

                var itemsPerPage = Number(scope._itemsPerPage);
                scope._hasPager = !scope._showItemsPerPage || (scope.totalPages * itemsPerPage > itemsPerPage);
            };

            var onChange = function () {
                if (scope.page === scope._page && !scope.hasItemsPerPageChanged) {
                    return;
                }

                scope.page = scope._page || null;
                setRangePages();

                var value = {
                    maPage: scope.page
                };

                if (scope._showItemsPerPage) {
                    value.maItemsPerPage = scope._itemsPerPage === 'All' ? null : Number(scope._itemsPerPage);
                    scope.hasItemsPerPageChanged = false;

                    // If itemsPerPage is set update its value.
                    if (scope.itemsPerPage !== undefined) {
                        scope.itemsPerPage = value.maItemsPerPage;
                    }
                }

                // Postpone change event for $apply (which is being invoked by $timeout)
                // to have time to take effect and update scope.page.
                $timeout(function () {
                    scope.change(value);
                });
            };

            scope.itemsPerPageChange = function (itemsPerPage, oldItemsPerPage) {
                scope._itemsPerPage = itemsPerPage;
                scope.hasItemsPerPageChanged = true;
                var oldTotalPages = scope.totalPages;
                scope.totalPages = Math.ceil(scope._totalItems / Number(scope._itemsPerPage));

                if (oldItemsPerPage === 'All') {
                    scope._page = 1;
                } else {
                    var firstVisibleItem = (oldItemsPerPage * scope.page) - oldItemsPerPage + 1;
                    scope._page = Math.ceil(firstVisibleItem / itemsPerPage);
                }

                setHasPager();
                onChange();
            };

            scope.firstClick = function () {
                scope._page = 1;
                onChange();
            };

            scope.previousClick = function () {
                scope._page = scope._page <= 1 ? 1 : scope._page - 1;
                onChange();
            };

            scope.nextClick = function () {
                scope._page = scope._page >= scope.totalPages ? 1 : scope._page + 1;
                onChange();
            };

            scope.lastClick = function () {
                scope._page = scope.totalPages;
                onChange();
            };

            scope.pageClick = function (page) {
                scope._page = page;
                onChange();
            };

            scope.previousRangeClick = function () {
                scope._page = scope.range * scope._visiblePages;
                onChange();
            };

            scope.nextRangeClick = function () {
                scope._page = scope.range * scope._visiblePages + scope._visiblePages + 1;
                onChange();
            };

            scope.$watch('totalItems', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                scope._totalItems = scope.totalItems < 0 ? 0 : scope.totalItems;
                setTotalPages();

                // Correct the page and trigger change.
                if (scope._totalItems === 0 || scope._totalItems <= Number(scope._itemsPerPage)) {
                    scope._page = 1;
                    onChange();
                    setHasPager();
                    return;
                }

                setRangePages();
                setHasPager();
            });

            scope.$watch('visiblePages', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setRangePages();
            });

            scope.$watch('page', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                var page = scope.page;

                // Correct page.
                if (page < 1) {
                    page = 1;
                } else if (page > scope.totalPages) {
                    page = scope.totalPages;
                }

                // Correct page to 1 in case totalPages is 0 and page is 0.
                scope._page = page || 1;
                setRangePages();
                setHasPager();
            });

            scope.$watch('itemsPerPageNumbers', function (newValue, oldValue) {
                if (angular.equals(newValue, oldValue)) {
                    return;
                }

                setItemsPerPageNumbers();
            });

            scope.$watch('itemsPerPage', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                setItemsPerPage();
                setHasPager();
            });

            setItemsPerPageNumbers();
            setItemsPerPage();
            setTotalPages();
            setRangePages();
            setHasPager();
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maRadioButton', ['$timeout', 'MaValidators', 'MaHelper', function ($timeout, MaValidators, MaHelper) {
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
        template: function () {
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
        link: function (scope, element) {
            var isObjectArray = scope.itemTextField || scope.itemValueField,
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false;

            scope.isFocused = false;
            scope.isValid = true;
            scope.isTouched = false;

            var validate = function (value) {
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

            scope.getItemText = function (item) {
                if (scope.itemTemplate) {
                    return scope.itemTemplate(item);
                } else if (!isObjectArray) {
                    return item;
                } else if (scope.itemTextField) {
                    return item[scope.itemTextField];
                }
            };

            scope.isItemSelected = function (item) {
                if (!isObjectArray) {
                    return item === scope.value;
                } else if (scope.itemValueField) {
                    return item && scope.value &&
                        item[scope.itemValueField] === scope.value[scope.itemValueField];
                }

                return false;
            };

            scope.onChange = function (item) {
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
                    if (MaHelper.isNullOrUndefined(oldValue) && !MaHelper.isNullOrUndefined(item[scope.itemValueField])) {
                        hasChanged = true;
                    } else {
                        hasChanged = oldValue[scope.itemValueField] !== item[scope.itemValueField];
                    }
                } else {
                    // Compare objects if itemValueField is not provided.
                    if (MaHelper.isNullOrUndefined(oldValue) && !MaHelper.isNullOrUndefined(item)) {
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
                    $timeout(function () {
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
                validators.unshift(MaValidators.isNotEmpty());
            }

            if (hasIsNotEmptyValidator) {
                isRequired = true;
            }

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function () {
                    return scope.isValid;
                };

                scope.instance.validate = function () {
                    validate(scope.value);
                };
            }
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components')
    .filter('maSelectBoxOrderBy', ['orderByFilter', function (orderByFilter) {
        return function (items, orderByExpression) {
            if (orderByExpression) {
                return orderByFilter(items, orderByExpression);
            }

            return items;
        };
    }])
    .directive('maSelectBox', ['$document', '$timeout', 'MaHelper', function ($document, $timeout, MaHelper) {
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
                init: '&',
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
                isMultiple: '=',
                storeItemValueOnly: '='
            },
            replace: true,
            template: function (element, attributes) {
                var hasAjax = !MaHelper.isNullOrWhiteSpace(attributes.ajax),
                    isMultiple = attributes.isMultiple === 'true';

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
                            \'ma-select-box-is-loading\': isLoading,\
                            \'ma-select-box-has-value\': hasValue()\
                        }">\
                        <div class="ma-select-box-spinner" ng-if="isLoading && !isDisabled">\
                            <div class="pace">\
                                <div class="pace-activity"></div>\
                            </div>\
                        </div>';

                if (hasAjax) {
                    html += '<input class="ma-select-box-input" ma-select2="options"' + (isMultiple ? ' multiple' : '') + '\
                        ng-show="!isAddMode"\
                        ng-disabled="isDisabled"\
                        ng-change="onChange()"\
                        ng-model="selectedItem"/>';
                } else {
                    // Add an empty option <option></option> as first item for the placeholder to work.
                    // It's strange, but that's how Select2 works.
                    html += '\
                        <select ma-select2="options"' + (isMultiple ? ' multiple' : '') + '\
                            ng-show="!isAddMode"\
                            ng-disabled="isDisabled"\
                            ng-model="selectedItem"\
                            ng-change="onChange()"\
                            placeholder="{{placeholder}}">\
                            <option></option>\
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
                        ma-tooltip="{{getAddItemTooltip()}}"\
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
            controller: ['$scope', function (scope) {
                // Gets a value from itemValueField if an item is object.
                scope.getItemValue = function (item) {
                    if (MaHelper.isNullOrWhiteSpace(item) || !scope.itemValueField) {
                        return null;
                    }

                    // Item is already a value (an object might be passed as well).
                    if (scope.storeItemValueOnly) {
                        return (angular.isObject(item) ? item[scope.itemValueField] : item).toString();
                    }

                    // In case of a nested property binding like 'company.port.id'.
                    var parts = scope.itemValueField.split('.'),
                        value = item[parts[0]];

                    for (var i = 1; i < parts.length; i++) {
                        value = value[parts[i]];
                    }

                    if (MaHelper.isNullOrUndefined(value)) {
                        return null;
                    }

                    return value.toString();
                };

                scope.formatItem = function (item) {
                    if (scope.itemTemplate) {
                        return scope.itemTemplate(item);
                    }

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
                    scope.options.escapeMarkup = function (markup) {
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

                    if (scope.isMultiple) {
                        scope.options.formatSelection = function (item) {
                            return scope.formatItem(item);
                        };
                    }
                }
            }],
            link: function (scope, element) {
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
                    previousValue,
                    isObjectArray = scope.itemTextField || scope.itemValueField;

                // We need a copy of items. See 'scope.$watch('items', ...)' for an answer why.
                scope._items = angular.isArray(scope.items) ? angular.copy(scope.items) : [];
                scope.previousSelectedItem = scope.previousSelectedItem || null;
                scope.isAddMode = false;
                scope.isTextFocused = false;
                scope.isValid = true;
                scope.isTouched = false;
                scope.hasAjax = angular.isObject(scope.ajax);

                // A custom 'IsNotEmpty' validator, which also checks that
                // a selected item is in the list.
                var isNotEmptyAndInListValidator = {
                    name: 'IsNotEmpty',
                    validate: function (value) {
                        if (scope.isMultiple && angular.isArray(value)) {
                            return value.length > 0;
                        }

                        if (MaHelper.isNullOrWhiteSpace(value)) {
                            return false;
                        }

                        // For array of numbers.
                        if (!isObjectArray && !MaHelper.isNullOrWhiteSpace(value)) {
                            return true;
                        }

                        // In select mode check that a selected item is in the list.
                        // In AJAX mode there is no items array and we cannot check it.
                        if (!scope.hasAjax && !scope.isAddMode && !isExistingItem(value)) {
                            return false;
                        }

                        return true;
                    }
                };

                var setValidators = function () {
                    var emptyValidatorIndex = null;

                    for (var i = 0; i < validators.length; i++) {
                        if (validators[i].name === 'IsNotEmpty') {
                            emptyValidatorIndex = i;
                            validators[i] = isNotEmptyAndInListValidator;
                            break;
                        }
                    }

                    if (emptyValidatorIndex === null && scope.isRequired) {
                        validators.unshift(isNotEmptyAndInListValidator);
                    } else if (emptyValidatorIndex !== null && !scope.isRequired) {
                        validators.splice(emptyValidatorIndex, 1);
                    }
                };

                var isExistingItem = function (item) {
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

                var getItemByValue = function (itemValue) {
                    if (MaHelper.isNullOrWhiteSpace(itemValue)) {
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

                var getNewItem = function (itemText) {
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

                var setInternalValue = function (item) {
                    if (scope.isMultiple) {
                        var items = [],
                            i;

                        // Set Select2 value.
                        if (!scope.hasAjax) {
                            if (item && item.length) {
                                for (i = 0; i < item.length; i++) {
                                    items.push(scope.getItemValue(item[i]));
                                }
                            }
                        } else {
                            if (item && item.length) {
                                for (i = 0; i < item.length; i++) {
                                    items.push(item[i]);
                                }
                            }

                            items = JSON.stringify(items);
                        }

                        scope.selectedItem = items;
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
                            if (MaHelper.isNullOrWhiteSpace(item)) {
                                scope.selectedItem = null;
                            } else if (!scope.hasAjax) {
                                // Set Select2 value. In AJAX mode Select2 sets values by itself.
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

                var onFocusout = function (event, elementName) {
                    var elementTo = angular.element(event.relatedTarget);
                    scope.isTextFocused = false;

                    // Trigger change event for text element.
                    if (elementName === 'text') {
                        isFocusInside = false;

                        // Need to apply changes because onFocusout is triggered using jQuery
                        // (AngularJS does not have ng-focusout event directive).
                        scope.$apply(function () {
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
                                // Postpone change event for scope value to be updated before.
                                $timeout(function () {
                                    scope.change({
                                        maValue: scope.value,
                                        maOldValue: previousValue
                                    });
                                });
                            }
                        });
                    } else if (elementName === 'select') {
                        scope.$apply(function () {
                            scope.isTouched = true;
                        });
                    }

                    // Trigger blur event when focus goes to an element outside the component.
                    isFocusLost = !isFocusInside &&
                        elementTo[0] !== switchButtonElement[0] &&
                        elementTo[0] !== resetButtonElement[0] &&
                        elementTo[0] !== textElement[0] &&
                        elementTo[0] !== selectData.search[0];

                    if (scope.isMultiple) {
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
                            maValue: scope.storeItemValueOnly ? getItemByValue(scope.value) : scope.value
                        });
                    }

                    isFocusInside = false;
                };

                var validate = function (value) {
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

                var setFocus = function () {
                    // Focus the right element.
                    if (scope.isAddMode) {
                        textElement.focus();
                        scope.isTextFocused = true;
                    } else {
                        selectElement.select2('focus');
                    }
                };

                scope.hasValue = function () {
                    if (scope.isMultiple) {
                        return !MaHelper.isNullOrUndefined(scope.value) && scope.value.length;
                    }

                    if (scope.isAddMode) {
                        return !MaHelper.isNullOrWhiteSpace(scope.text);
                    }

                    return !MaHelper.isNullOrUndefined(scope.value) && !scope.isLoading;
                };

                scope.isResetEnabled = function () {
                    return !scope.isDisabled && scope.hasValue();
                };

                scope.reset = function () {
                    previousValue = scope.value;
                    scope.value = scope.isMultiple ? [] : null;
                };

                scope.onReset = function () {
                    scope.isTouched = true;
                    scope.reset();
                    setFocus();

                    $timeout(function () {
                        scope.change({
                            maValue: scope.value,
                            maOldValue: previousValue
                        });
                    });
                };

                scope.onFocus = function (elementName) {
                    if (elementName === 'text') {
                        scope.isTextFocused = true;
                    }

                    if (elementName === 'reset') {
                        element.removeClass('ma-select-box-is-select-focused');
                    }

                    if (isFocusLost) {
                        scope.focus({
                            maValue: scope.storeItemValueOnly ? getItemByValue(scope.value) : scope.value
                        });
                    }

                    isFocusLost = false;
                };

                textElement.focusout(function (event) {
                    onFocusout(event, 'text');
                });

                scope.getAddItemTooltip = function () {
                    if (!showAddItemTooltip) {
                        return '';
                    }

                    // \u00A0 Unicode character is used here like &nbsp;.
                    if (scope.isAddMode) {
                        return 'Back\u00A0to the\u00A0list';
                    }

                    return scope.addItemTooltip ? scope.addItemTooltip : 'Add new\u00A0item';
                };

                scope.getOptionValue = function (item) {
                    return scope.itemValueField ? scope.getItemValue(item) : item;
                };

                scope.toggleMode = function (mode) {
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
                        $timeout(function () {
                            // Trigger change event as user manually swithces between custom and selected item.
                            scope.change({
                                maValue: scope.value,
                                maOldValue: previousValue
                            });

                            setFocus();
                        });
                    }
                };

                scope.onChange = function () {
                    var item;

                    if (scope.isMultiple) {
                        var itemsValues = scope.selectedItem,
                            items = [];

                        if (scope.hasAjax) {
                            // Get selected items directly from Select2 component,
                            // because scope.selectedItem gives only an id of a currently selected item.
                            items = selectData.data();

                            // Value hasn't changed.
                            if (angular.equals(items, scope.value)) {
                                return;
                            }

                            previousValue = scope.value;
                        } else {
                            previousValue = scope.value;

                            for (var j = 0; j < itemsValues.length; j++) {
                                item = getItemByValue(itemsValues[j]);

                                if (item) {
                                    items.push(item);
                                }
                            }
                        }

                        scope.isTouched = true;
                        scope.value = items;

                        $timeout(function () {
                            scope.change({
                                maValue: items,
                                maOldValue: previousValue
                            });
                        });

                        // Invoke mouseleave on the list when it is closed for the next blur event to work properly.
                        selectData.dropdown.mouseleave();
                    } else {
                        // Validation is required if the item is a simple text, not a JSON object.
                        item = MaHelper.isJson(scope.selectedItem) ? JSON.parse(scope.selectedItem) : scope.selectedItem;

                        // In case if JSON.parse has parsed string to a number.
                        // This can happen when items is an array of numbers.
                        if (typeof item === 'number') {
                            item = scope.selectedItem;
                        }

                        // The change event works differently in AJAX mode.
                        if (scope.hasAjax) {
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
                        if (!scope.hasAjax) {
                            if (scope.itemValueField && !MaHelper.isNullOrWhiteSpace(item)) {
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

                        if (scope.storeItemValueOnly) {
                            scope.value = scope.getItemValue(item);
                            scope.previousSelectedItem = scope.value;
                            previousValue = getItemByValue(previousValue);
                        } else {
                            scope.value = item;
                            scope.previousSelectedItem = item;
                        }

                        $timeout(function () {
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
                    if (!scope.hasAjax || !selectData) {
                        return;
                    }

                    // If placeholder is set Select2 initSelection will not work and thus value will not be set.
                    // We need to add/remove placeholder accordingly.
                    selectData.opts.placeholder = scope.value ? '' : scope.placeholder;

                    scope.runInitSelection = true;
                    selectData.initSelection();
                };

                scope.$watch('items', function (newItems, oldItems) {
                    // When an array of items is completely replaced with a new array, ma-select2
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

                    // For some reason ma-select2 does not trigger change for selectedItem
                    // in this case, so we need to set it manually.
                    // See select-box/select2.js line 123.
                    $timeout(function () {
                        var itemValue,
                            item;

                        if (angular.isObject(scope.value)) {
                            if (scope.isMultiple && angular.isArray(scope.value)) {
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

                scope.$watch('value', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    initializeSelect2Value();
                    setInternalValue(newValue);
                });

                // Validate text while it is being typed.
                scope.$watch('text', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    scope.isTouched = true;
                    validate(newValue);
                });

                scope.$watch('isRequired', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    setValidators();
                    validate(scope.isAddMode ? scope.text : scope.value);
                });

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.isInitialized = true;

                    scope.instance.switchToSelectMode = function () {
                        if (scope.isAddMode) {
                            scope.toggleMode('select');
                        }
                    };

                    scope.instance.switchToAddMode = function () {
                        if (!scope.isAddMode) {
                            scope.toggleMode('add');
                        }
                    };

                    scope.instance.isValid = function () {
                        return scope.isValid;
                    };

                    scope.instance.validate = function () {
                        scope.isTouched = true;

                        validate(scope.isAddMode ? scope.text : scope.value);
                    };

                    scope.instance.clear = function () {
                        scope.reset();

                        $timeout(function () {
                            scope.isTouched = false;
                        });
                    };
                }

                setValidators();

                $timeout(function () {
                    // Add a search icon and spinner for Select2 input field.
                    if (scope.hasAjax) {
                        var elementForSpinner = angular.element(
                            element[0].querySelector(scope.isMultiple ? '.select2-search-field' : '.select2-search')
                        );

                        elementForSpinner.append('<div class="pace"><div class="pace-activity"></div></div>');

                        if (!scope.isMultiple) {
                            elementForSpinner.append('<i class="ma-select-box-input-search-icon fa fa-search"></i>');
                        }
                    }

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
                        $($document).on('click', 'label[for="' + scope.id + '"]', function () {
                            setFocus();
                        });
                    }

                    if (scope.isMultiple) {
                        selectData.search.on('focus', function () {
                            element.addClass('ma-select-box-is-select-focused');
                            scope.onFocus();
                        });

                        selectData.search.on('focusout', function (event) {
                            onFocusout(event, 'select');
                        });

                        // Track that the select is hovered to prevent focus lost when a selected item
                        // or selection is clicked.
                        selectData.selection.on('mouseenter', function () {
                            isSelectHovered = true;
                        });

                        selectData.selection.on('mouseleave', function () {
                            isSelectHovered = false;
                        });

                        selectData.dropdown.on('mouseenter', function () {
                            isSelectHovered = true;
                        });

                        selectData.dropdown.on('mouseleave', function () {
                            isSelectHovered = false;
                        });

                        selectData.dropdown.on('click', function () {
                            // Return focus to the input field for the next blur event to work properly.
                            selectData.search.focus();
                        });
                    } else {
                        // There is no focussser in multiple mode.
                        selectData.focusser.on('focus', function () {
                            scope.onFocus('select');
                        });

                        selectData.focusser.on('focusout', function (event) {
                            onFocusout(event, 'select');
                        });
                    }

                    selectData.dropdown.on('focus', '.select2-input', function () {
                        // This is required for IE to keep focus when an item is selected
                        // from the list using keyboard.
                        isFocusInside = true;
                        scope.onFocus();
                    });

                    selectData.dropdown.on('focusout', '.select2-input', function (event) {
                        onFocusout(event, 'select');
                    });

                    switchButtonElement.focusout(function (event) {
                        onFocusout(event);
                    });

                    resetButtonElement.focusout(function (event) {
                        onFocusout(event);
                    });

                    // Detect if item in the list is hovered.
                    // This is later used for triggering blur event correctly.
                    selectData.dropdown.on('mouseenter', '.select2-result', function () {
                        isFocusInside = true;
                    });

                    selectData.dropdown.on('mouseleave', '.select2-result', function () {
                        isFocusInside = false;
                    });

                    // Detect if select2 mask is hovered.
                    // This is later used for triggering blur event correctly in IE.
                    $($document).on('mouseenter', '.select2-drop-mask', function () {
                        if (!scope.isMultiple) {
                            isFocusInside = true;
                        }
                    });

                    scope.init({
                        maInstance: scope.instance
                    });
                });
            }
        };
    }]);})();
(function(){/**
 * This is a clone of https://www.npmjs.com/package/angular-ui-select2 package, which is no longer maintained.
 * It was copied so we can maintain it ourselves.
 *
 * When AJAX mode is on, your value will be an object (or an array of objects) of the data used by Select2.
 * This change is so that you do not have to do an additional query yourself on top of Select2 own query.
 */
angular.module('marcuraUI.components').value('maSelect2Config', {}).directive('maSelect2', ['maSelect2Config', '$timeout', 'MaHelper', function (maSelect2Config, $timeout, MaHelper) {
    // The configuration options passed to $.fn.select2(). See http://select2.github.io/select2/#documentation.
    var options = {};

    if (maSelect2Config) {
        angular.extend(options, maSelect2Config);
    }

    return {
        require: 'ngModel',
        priority: 1,
        compile: function (tElm, tAttrs) {
            var watch,
                repeatOption,
                repeatAttr,
                isSelect = tElm.is('select'),
                isMultiple = angular.isDefined(tAttrs.multiple);

            // Enable watching of the options dataset if in use
            if (tElm.is('select')) {
                repeatOption = tElm.find('optgroup[ng-repeat], optgroup[data-ng-repeat], option[ng-repeat], option[data-ng-repeat]');

                if (repeatOption.length) {
                    repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
                    watch = $.trim(repeatAttr.split('|')[0]).split(' ').pop();
                }
            }

            return function (scope, elm, attrs, controller) {
                // instance-specific options
                var opts = angular.extend({}, options, scope.$eval(attrs.maSelect2));

                // Convert from Select2 view-model to Angular view-model.
                var convertToAngularModel = function (select2_data) {
                    var model;

                    if (opts.simple_tags) {
                        model = [];

                        angular.forEach(select2_data, function (value, index) {
                            model.push(value.id);
                        });
                    } else {
                        model = select2_data;
                    }

                    return model;
                };

                // Convert from Angular view-model to Select2 view-model.
                var convertToSelect2Model = function (angular_data) {
                    var model = [];

                    if (!angular_data) {
                        return model;
                    }

                    if (opts.simple_tags) {
                        model = [];

                        angular.forEach(angular_data, function (value, index) {
                            model.push({ 'id': value, 'text': value });
                        });
                    } else {
                        model = angular_data;
                    }

                    return model;
                };

                if (isSelect) {
                    // Use <select multiple> instead
                    delete opts.multiple;
                    delete opts.initSelection;
                } else if (isMultiple) {
                    opts.multiple = true;
                }

                if (controller) {
                    // Watch the model for programmatic changes
                    scope.$watch(tAttrs.ngModel, function (current, old) {
                        if (!current) {
                            return;
                        }

                        if (current === old) {
                            return;
                        }

                        controller.$render();
                    }, true);

                    controller.$render = function () {
                        if (isSelect) {
                            elm.select2('val', controller.$viewValue);
                        } else {
                            if (opts.multiple) {
                                controller.$isEmpty = function (value) {
                                    return !value || value.length === 0;
                                };

                                var viewValue = controller.$viewValue;

                                if (opts.ajax) {
                                    viewValue = MaHelper.isJson(controller.$viewValue) ? JSON.parse(controller.$viewValue) : controller.$viewValue;

                                    // It might be an id of the item first time, the next time it's a real item.
                                    if (angular.isObject(viewValue)) {
                                        elm.select2('data', viewValue);
                                    }
                                } else if (angular.isString(viewValue)) {
                                    viewValue = viewValue.split(',');
                                    elm.select2('data', convertToSelect2Model(viewValue));
                                }
                            } else {
                                if (angular.isObject(controller.$viewValue)) {
                                    elm.select2('data', controller.$viewValue);
                                } else if (!controller.$viewValue) {
                                    elm.select2('data', null);
                                } else {
                                    elm.select2('val', controller.$viewValue);
                                }
                            }
                        }
                    };

                    // Watch the options dataset for changes
                    if (watch) {
                        scope.$watch(watch, function (newVal, oldVal, scope) {
                            if (angular.equals(newVal, oldVal)) {
                                return;
                            }

                            // Delayed so that the options have time to be rendered
                            $timeout(function () {
                                elm.select2('val', controller.$viewValue);

                                // Refresh angular to remove the superfluous option
                                controller.$render();

                                if (newVal && !oldVal && controller.$setPristine) {
                                    controller.$setPristine(true);
                                }
                            });
                        });
                    }

                    // Update valid and dirty statuses
                    controller.$parsers.push(function (value) {
                        var div = elm.prev();
                        div.toggleClass('ng-invalid', !controller.$valid)
                            .toggleClass('ng-valid', controller.$valid)
                            .toggleClass('ng-invalid-required', !controller.$valid)
                            .toggleClass('ng-valid-required', controller.$valid)
                            .toggleClass('ng-dirty', controller.$dirty)
                            .toggleClass('ng-pristine', controller.$pristine);

                        return value;
                    });

                    if (!isSelect) {
                        // Set the view and model value and update the angular template manually for the ajax/multiple select2.
                        elm.bind('change', function (e) {
                            e.stopImmediatePropagation();

                            if (scope.$$phase || scope.$root.$$phase) {
                                return;
                            }

                            scope.$apply(function () {
                                controller.$setViewValue(convertToAngularModel(elm.select2('data')));
                            });
                        });

                        if (opts.initSelection) {
                            var initSelection = opts.initSelection;

                            opts.initSelection = function (element, callback) {
                                initSelection(element, function (value) {
                                    var isPristine = controller.$pristine;

                                    // Don't set a value here for AJAX/multiple or it loops.
                                    // Value setting for this case is handled in select-box.js.
                                    if (!(opts.ajax && opts.multiple)) {
                                        controller.$setViewValue(convertToAngularModel(value));
                                    }

                                    callback(value);

                                    if (isPristine) {
                                        controller.$setPristine();
                                    }

                                    elm.prev().toggleClass('ng-pristine', controller.$pristine);
                                });
                            };
                        }
                    }
                }

                elm.bind('$destroy', function () {
                    elm.select2('destroy');
                });

                attrs.$observe('disabled', function (value) {
                    elm.select2('enable', !value);
                });

                attrs.$observe('readonly', function (value) {
                    elm.select2('readonly', !!value);
                });

                if (attrs.ngMultiple) {
                    scope.$watch(attrs.ngMultiple, function (newVal) {
                        attrs.$set('multiple', !!newVal);
                        elm.select2(opts);
                    });
                }

                // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
                $timeout(function () {
                    elm.select2(opts);

                    // Set initial value - I'm not sure about this but it seems to need to be there
                    elm.select2('data', controller.$modelValue);

                    // important!
                    controller.$render();

                    // Not sure if I should just check for !isSelect OR if I should check for 'tags' key
                    if (!opts.initSelection && !isSelect) {
                        var isPristine = controller.$pristine;
                        controller.$pristine = false;
                        controller.$setViewValue(convertToAngularModel(elm.select2('data')));

                        if (isPristine) {
                            controller.$setPristine();
                        }

                        elm.prev().toggleClass('ng-pristine', controller.$pristine);
                    }
                });
            };
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maSpinner', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            isVisible: '=',
            size: '@',
            position: '@'
        },
        replace: true,
        template: function () {
            var html = '\
                <div class="ma-spinner{{cssClass}}" ng-show="isVisible">\
                    <div class="pace">\
                        <div class="pace-activity"></div>\
                    </div>\
                </div>';

            return html;
        },
        link: function (scope) {
            var size = scope.size ? scope.size : 'xs',
                position = scope.position ? scope.position : 'center';
            scope.cssClass = ' ma-spinner-' + size + ' ma-spinner-' + position;
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maTabs', ['$state', 'MaHelper', '$timeout', function ($state, MaHelper, $timeout) {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            select: '&',
            useState: '='
        },
        replace: true,
        template: function () {
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
        link: function (scope, element, attributes) {
            scope.$state = $state;
            var useState = scope.useState === false ? false : true;

            scope.isItemSelected = function (item) {
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

            scope.onSelect = function (item) {
                if (item.isDisabled || item.isSelected) {
                    return;
                }

                if (useState) {
                    if (item.state && item.state.name) {
                        $state.go(item.state.name, item.state.parameters);
                    }
                } else {
                    angular.forEach(scope.items, function (item) {
                        item.isSelected = false;
                    });
                    item.isSelected = true;

                    scope.select({
                        maItem: item
                    });
                }
            };

            scope.onKeypress = function (event, item) {
                if (event.keyCode === MaHelper.keyCode.enter) {
                    scope.onSelect(item);
                }
            };

            scope.onFocus = function (item) {
                item.isFocused = true;
            };

            scope.onBlur = function (item) {
                item.isFocused = false;
            };

            $timeout(function () {
                var itemElements = angular.element(element[0].querySelectorAll('.ma-tabs-item'));

                itemElements.each(function (itemIndex, itemElement) {
                    var item = scope.items[itemIndex];

                    if (!item.isDisabled) {
                        angular.element(itemElement).attr('tabindex', '0');
                    }
                });
            });
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components').directive('maTextArea', ['$timeout', '$window', 'MaHelper', 'MaValidators', function ($timeout, $window, MaHelper, MaValidators) {
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
            change: '&',
            blur: '&',
            focus: '&'
        },
        replace: true,
        template: function () {
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
        link: function (scope, element) {
            var valueElement = angular.element(element[0].querySelector('.ma-text-area-value')),
                validators = scope.validators ? angular.copy(scope.validators) : [],
                isRequired = scope.isRequired,
                hasIsNotEmptyValidator = false,
                // Variables keydownValue and keyupValue help track touched state.
                keydownValue,
                keyupValue,
                previousValue,
                focusValue;
            scope.isFocused = false;
            scope.isTouched = false;

            var getValueElementStyle = function () {
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

            var resize = function () {
                if (!scope.fitContentHeight) {
                    return;
                }

                var valueElementStyle = getValueElementStyle(),
                    textHeight = MaHelper.getTextHeight(valueElement.val(), valueElementStyle.font, valueElementStyle.width + 'px', valueElementStyle.lineHeight),
                    height = (textHeight + valueElementStyle.paddingHeight + valueElementStyle.borderHeight);

                if (height < 40) {
                    height = 30;
                }

                valueElement[0].style.height = height + 'px';
                element[0].style.height = height + 'px';
            };

            var validate = function () {
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

            var changeValue = function () {
                var value = valueElement.val();

                if (previousValue === value) {
                    return;
                }

                previousValue = scope.value;
                scope.value = value;

                $timeout(function () {
                    scope.change({
                        maValue: scope.value,
                        maOldValue: previousValue
                    });
                });
            };

            // Set up validators.
            for (var i = 0; i < validators.length; i++) {
                if (validators[i].name === 'IsNotEmpty') {
                    hasIsNotEmptyValidator = true;
                    break;
                }
            }

            if (!hasIsNotEmptyValidator && isRequired) {
                validators.unshift(MaValidators.isNotEmpty());
            }

            if (hasIsNotEmptyValidator) {
                isRequired = true;
            }

            scope.onFocus = function () {
                scope.isFocused = true;
                focusValue = scope.value;

                scope.focus({
                    maValue: scope.value
                });
            };

            scope.onBlur = function () {
                scope.isFocused = false;
                scope.isTouched = true;
                validate();

                scope.blur({
                    maValue: scope.value,
                    maOldValue: focusValue,
                    maHasValueChanged: focusValue !== scope.value
                });
            };

            scope.onKeydown = function (event) {
                // Ignore tab key.
                if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
                    return;
                }

                keydownValue = angular.element(event.target).val();
            };

            scope.onKeyup = function (event) {
                // Ignore tab key.
                if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
                    return;
                }

                keyupValue = angular.element(event.target).val();

                if (keydownValue !== keyupValue) {
                    scope.isTouched = true;
                }
            };

            // Use input event to support value change from Enter key, and contextual menu,
            // e.g. mouse right click + Cut/Copy/Paste etc.
            valueElement.on('input', function (event) {
                var hasChanged = false;
                keyupValue = angular.element(event.target).val();

                if (keydownValue !== keyupValue) {
                    hasChanged = true;
                }

                // Change value after a timeout while the user is typing.
                if (!hasChanged) {
                    return;
                }

                validate();
                resize();

                if (scope.isValid) {
                    scope.$apply(function () {
                        changeValue();
                    });
                }
            });

            angular.element($window).on('resize', function () {
                resize();
            });

            $timeout(function () {
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

                        parentScope.$watch(hiddenParent.attr('ng-show'), function (isVisible) {
                            if (isVisible) {
                                // Wait for the hidden element to appear first.
                                $timeout(function () {
                                    resize();
                                });
                            }
                        });
                    }
                }
            });

            scope.$watch('value', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                scope.isValid = true;
                scope.isTouched = false;

                // IE 11.0 version moves the caret at the end when textarea value is fully replaced.
                // In IE 11.126+ the issue has been fixed.
                var caretPosition = valueElement.prop('selectionStart');
                valueElement.val(newValue);

                // Restore caret position if text area is visible.
                var isVisible = $(element).is(':visible');

                if (isVisible) {
                    valueElement.prop({
                        selectionStart: caretPosition,
                        selectionEnd: caretPosition
                    });
                }

                resize();
            });

            // Set initial value.
            valueElement.val(scope.value);
            validate();
            previousValue = scope.value;

            // Prepare API instance.
            if (scope.instance) {
                scope.instance.isInitialized = true;

                scope.instance.isValid = function () {
                    return scope.isValid;
                };

                scope.instance.focus = function () {
                    if (!scope.isFocused) {
                        valueElement.focus();
                    }
                };
            }
        }
    };
}]);})();
(function(){angular.module('marcuraUI.components')
    .provider('maTextBoxConfiguration', function () {
        this.$get = function () {
            return this;
        };
    })
    .directive('maTextBox', ['$timeout', 'MaHelper', 'MaValidators', function ($timeout, MaHelper, MaValidators) {
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
                changeWhenIsInvalid: '=',
                blur: '&',
                focus: '&',
                changeTimeout: '=',
                canReset: '=',
                placeholder: '@',
                hasShowPasswordButton: '=',
                trim: '=',
                max: '=',
                min: '=',
                decimals: '=',
                reset: '&',
                defaultValue: '='
            },
            replace: true,
            template: function (element, attributes) {
                var type = attributes.type === 'password' ? 'password' : 'text';

                if (type === 'number' || type === 'email') {
                    type = 'text';
                }

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
                    \'ma-text-box-is-toggle-password-disabled\': canTogglePassword && !isDisabled && !isTogglePasswordEnabled(),\
                    \'ma-text-box-has-value\': hasValue()\
                }">\
                <input class="ma-text-box-value" type="' + type + '" id="{{id}}"\
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
            controller: ['$scope', 'maTextBoxConfiguration', function (scope, maTextBoxConfiguration) {
                scope.configuration = {};

                if (scope.decimals >= 0) {
                    scope.configuration.decimals = scope.decimals;
                } else if (maTextBoxConfiguration.decimals >= 0) {
                    scope.configuration.decimals = maTextBoxConfiguration.decimals;
                } else {
                    scope.configuration.decimals = 2;
                }
            }],
            link: function (scope, element, attributes) {
                var valueElement = angular.element(element[0].querySelector('.ma-text-box-value')),
                    resetButtonElement = angular.element(element[0].querySelector('.ma-button-reset')),
                    togglePasswordButtonElement = angular.element(element[0].querySelector('.ma-button-toggle-password')),
                    validators = [],
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
                    isInternalChange = false,
                    failedValidator = null,
                    decimals = scope.configuration.decimals,
                    hasDefaultValue = attributes.defaultValue !== undefined,
                    defaultValue = MaHelper.isNullOrUndefined(scope.defaultValue) ? '' : scope.defaultValue,
                    hasMin = typeof scope.min === 'number',
                    hasMax = typeof scope.max === 'number';

                if (scope.type === 'number') {
                    defaultValue = typeof scope.defaultValue === 'number' ? scope.defaultValue : null;
                }

                var setPreviousValue = function (value) {
                    value = MaHelper.isNullOrUndefined(value) ? '' : value;

                    if (scope.type !== 'number' && trim) {
                        value = value.trim();
                    }

                    previousValue = value;
                };

                var getValue = function () {
                    var value = valueElement.val();
                    return scope.type === 'number' ? parseNumber(value) : value;
                };

                var validate = function () {
                    scope.isValid = true;
                    failedValidator = null;
                    // Use raw value for validators.
                    var value = valueElement.val();

                    if (scope.type === 'number') {
                        value = removeCommasFromNumber(value);
                    }

                    if (validators && validators.length) {
                        for (var i = 0; i < validators.length; i++) {
                            if (!validators[i].validate(value)) {
                                scope.isValid = false;
                                failedValidator = validators[i];
                                break;
                            }
                        }
                    }
                };

                var triggerChange = function (value) {
                    if (!hasValueChanged(value)) {
                        return;
                    }

                    isInternalChange = true;
                    var oldValue = previousValue;

                    if (scope.type !== 'number' && trim) {
                        oldValue = oldValue.trim();
                        value = value.trim();
                    }

                    if (hasDefaultValue) {
                        if (MaHelper.isNullOrUndefined(value)) {
                            value = defaultValue;
                        }

                        if (MaHelper.isNullOrUndefined(oldValue)) {
                            oldValue = defaultValue;
                        }
                    }

                    scope.value = value;
                    setPreviousValue(value);

                    $timeout(function () {
                        scope.change({
                            maValue: value,
                            maOldValue: oldValue
                        });
                    });
                };

                var hasValueChanged = function (value) {
                    value = MaHelper.isNullOrUndefined(value) ? '' : value;
                    var oldValue = MaHelper.isNullOrUndefined(previousValue) ? '' : previousValue,
                        hasChanged = false;

                    if (scope.type !== 'number' && trim) {
                        hasChanged = oldValue.trim() !== value.trim();
                    } else {
                        hasChanged = oldValue !== value;
                    }

                    return hasChanged;
                };

                var changeValue = function () {
                    scope.isTouched = true;

                    if (!hasValueChanged(getValue())) {
                        validate();
                        return;
                    }

                    validate();

                    if (scope.isValid || scope.changeWhenIsInvalid) {
                        triggerChange(getValue());
                    }
                };

                var parseNumber = function (value, keepDecimals) {
                    if (MaHelper.isNullOrWhiteSpace(value)) {
                        return null;
                    }

                    value = parseFloat(removeCommasFromNumber(value));

                    if (!keepDecimals) {
                        value = parseFloat(value.toFixed(decimals));
                    }

                    if (isNaN(value)) {
                        return null;
                    }

                    return value;
                };

                var addCommasToNumber = function (value) {
                    if (MaHelper.isNullOrWhiteSpace(value)) {
                        return '';
                    }

                    var decimalDigits = value.indexOf('.') == -1 ? '' : value.replace(/^-?\d+(?=\.)/, ''),
                        wholeDigits = value.replace(/(\.\d+)$/, ''),
                        commas = wholeDigits.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                    return '' + commas + decimalDigits;
                };

                var removeCommasFromNumber = function (value) {
                    if (MaHelper.isNullOrWhiteSpace(value)) {
                        return '';
                    }

                    return value.trim().replace(/,/g, '');
                };

                var formatValue = function (value) {
                    if (MaHelper.isNullOrWhiteSpace(value)) {
                        return value;
                    }

                    var formattedValue = value;

                    if (scope.type === 'number') {
                        value = typeof value === 'number' ? value : Number(value);
                        formattedValue = addCommasToNumber(value.toFixed(decimals));
                    }

                    return formattedValue;
                };

                var setValidators = function () {
                    var hasIsNotEmptyValidator = false;
                    validators = scope.validators ? angular.copy(scope.validators) : [];

                    for (var i = 0; i < validators.length; i++) {
                        if (validators[i].name === 'IsNotEmpty') {
                            hasIsNotEmptyValidator = true;
                            break;
                        }
                    }

                    if (!hasIsNotEmptyValidator && scope.isRequired) {
                        validators.unshift(MaValidators.isNotEmpty());
                    }

                    if (scope.type === 'number') {
                        validators.push(MaValidators.isNumber(true));
                    }

                    if (hasMin) {
                        if (scope.type === 'number') {
                            validators.push(MaValidators.isGreaterOrEqual(scope.min, true));
                        } else {
                            validators.push(MaValidators.isLengthGreaterOrEqual(scope.min, true));
                        }
                    }

                    if (hasMax) {
                        if (scope.type === 'number') {
                            validators.push(MaValidators.isLessOrEqual(scope.max, true));
                        } else {
                            validators.push(MaValidators.isLengthLessOrEqual(scope.max, true));
                        }
                    }

                    if (scope.type === 'email') {
                        validators.push(MaValidators.isEmail(true));
                    }
                };

                setValidators();
                scope.isValueFocused = false;
                scope.isTouched = false;
                scope.canTogglePassword = false;
                scope.isPasswordVisible = false;

                if (scope.type === 'password') {
                    scope.canTogglePassword = scope.hasShowPasswordButton !== false;
                }

                scope.hasValue = function () {
                    if (scope.type === 'number') {
                        var value = valueElement.val();

                        if (value !== '' && !MaHelper.isNumber(value)) {
                            return true;
                        }

                        return parseNumber(value, true) !== defaultValue && value !== '';
                    }

                    return valueElement.val() !== defaultValue;
                };

                scope.isResetEnabled = function () {
                    if (scope.isDisabled) {
                        return false;
                    }

                    if (scope.type === 'number') {
                        var value = valueElement.val();

                        if (value !== '' && !MaHelper.isNumber(value)) {
                            return true;
                        }

                        return parseNumber(value, true) !== defaultValue && value !== '';
                    }

                    return valueElement.val() !== defaultValue;
                };

                scope.doReset = function () {
                    setPreviousValue(getValue());
                    valueElement.val(defaultValue);
                };

                scope.onReset = function () {
                    if (scope.isDisabled) {
                        return;
                    }

                    scope.doReset();
                    scope.isTouched = true;
                    triggerChange(defaultValue);
                    validate();
                    valueElement.focus();

                    // Postpone reset event to fire after change event.
                    $timeout(function () {
                        scope.reset();
                    });
                };

                scope.onFocus = function (elementName) {
                    if (elementName === 'value') {
                        scope.isValueFocused = true;

                        if (scope.type === 'number' && !MaHelper.isNullOrUndefined(scope.value) && scope.isValid) {
                            // Remove commas from the number.
                            valueElement.val(scope.value.toFixed(decimals));
                        }
                    }

                    if (isFocusLost) {
                        focusValue = scope.value;

                        scope.focus({
                            maValue: scope.value
                        });
                    }

                    isFocusLost = false;
                };

                valueElement.focusout(function (event) {
                    onFocusout(event, 'value');
                });

                resetButtonElement.focusout(function (event) {
                    onFocusout(event);
                });

                togglePasswordButtonElement.focusout(function (event) {
                    onFocusout(event);
                });

                scope.togglePassword = function () {
                    scope.isPasswordVisible = !scope.isPasswordVisible;
                    valueElement[0].type = scope.isPasswordVisible ? 'text' : 'password';
                };

                scope.isTogglePasswordEnabled = function () {
                    return !scope.isDisabled && valueElement.val() !== '';
                };

                var onFocusout = function (event, elementName) {
                    var elementTo = angular.element(event.relatedTarget),
                        value = valueElement.val();

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

                    if (elementName === 'value') {
                        if (hasDefaultValue && value.trim() === '') {
                            // Prevent value watcher from triggering twice.
                            // It'll be triggered later in isFocusLost condition by the sequence of method calls: changeValue -> triggerChange.
                            // We need to suppress the trigger or change event won't fire if isRequired is set to true
                            // and the user clears the value.
                            // E.g., value is 0, user types 1, and then removes the value.
                            isInternalChange = true;
                            value = defaultValue;
                            scope.value = value;
                            valueElement.val(formatValue(value));
                        }

                        if (!scope.isResetEnabled() && elementTo[0] === resetButtonElement[0]) {
                            isFocusLost = true;
                        }

                        validate();

                        if (scope.isValid) {
                            // Format value when a user has finished editing it.
                            valueElement.val(formatValue(value));
                        }
                    }

                    // Use safeApply to avoid apply error when Reset icon is clicked.
                    MaHelper.safeApply(function () {
                        scope.isValueFocused = false;
                    });

                    if (isFocusLost) {
                        changeValue();

                        MaHelper.safeApply(function () {
                            scope.blur({
                                maValue: scope.value,
                                maOldValue: focusValue,
                                maHasValueChanged: focusValue !== scope.value
                            });
                        });
                    }
                };

                scope.onKeydown = function (event) {
                    // No need to save keydown value when the user is navigating with tab key.
                    if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
                        return;
                    }

                    keydownValue = angular.element(event.target).val();

                    if (scope.type === 'number') {
                        if (
                            // Allow backspace, tab, delete.
                            $.inArray(event.keyCode, [MaHelper.keyCode.backspace, MaHelper.keyCode.delete, MaHelper.keyCode.home, MaHelper.keyCode.end, MaHelper.keyCode.period, MaHelper.keyCode.numLock.period, MaHelper.keyCode.dash, MaHelper.keyCode.dash2]) !== -1 ||
                            // Allow left, right.
                            (event.keyCode === 37 || event.keyCode === 39)) {
                            return;
                        }

                        // Don't allow to enter not numbers.
                        if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                            event.preventDefault();
                        }
                    }
                };

                // Use input event to support value change from contextual menu,
                // e.g. mouse right click + Cut/Copy/Paste etc.
                valueElement.on('input', function (event) {
                    // Ignore tab key.
                    if (event.keyCode === MaHelper.keyCode.tab || event.keyCode === MaHelper.keyCode.shift) {
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
                    changePromise = $timeout(function () {
                        changeValue();
                    }, changeTimeout);
                });

                $timeout(function () {
                    // Move id to input.
                    element.removeAttr('id');

                    if (scope.id) {
                        valueElement.attr('id', scope.id);
                    } else {
                        valueElement.removeAttr('id');
                    }
                });

                scope.$watch('value', function (newValue, oldValue) {
                    if (isInternalChange) {
                        isInternalChange = false;
                        return;
                    }

                    if (newValue === oldValue) {
                        return;
                    }

                    if (hasValueChanged(newValue)) {
                        scope.isTouched = true;
                    }

                    var caretPosition = valueElement.prop('selectionStart');
                    setPreviousValue(newValue);
                    valueElement.val(formatValue(newValue));
                    validate();

                    // Restore caret position.
                    if (scope.isValueFocused) {
                        valueElement.prop({
                            selectionStart: caretPosition,
                            selectionEnd: caretPosition
                        });
                    }
                });

                scope.$watch('isRequired', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    setValidators();
                    validate();
                });

                var minMaxWatcher = function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    var value = getValue();

                    setValidators();

                    // Run only min/max validators to avoid the component being highligthed as invalid
                    // by other validators like IsNotEmpty, when min/max is changed.
                    var minMaxValidators = [];

                    for (var i = 0; i < validators.length; i++) {
                        if (validators[i].name === 'IsGreaterOrEqual' || validators[i].name === 'IsLessOrEqual') {
                            minMaxValidators.push(validators[i]);
                        }
                    }

                    if (minMaxValidators.length) {
                        // Empty failedValidator if it is min/max validator.
                        if (failedValidator && (failedValidator.name === 'IsGreaterOrEqual' || failedValidator.name === 'IsLessOrEqual')) {
                            failedValidator = null;
                            scope.isValid = true;
                        }

                        for (i = 0; i < minMaxValidators.length; i++) {
                            if (!minMaxValidators[i].validate(value)) {
                                scope.isValid = false;
                                failedValidator = minMaxValidators[i];
                                break;
                            }
                        }

                        if (!scope.isValid) {
                            scope.isTouched = true;
                        }
                    }

                    if (scope.isValid || scope.changeWhenIsInvalid) {
                        triggerChange(value);
                    }
                };

                scope.$watch('max', function (newValue, oldValue) {
                    minMaxWatcher(newValue, oldValue);
                });

                scope.$watch('min', function (newValue, oldValue) {
                    minMaxWatcher(newValue, oldValue);
                });

                // Set initial value.
                if (hasDefaultValue && MaHelper.isNullOrUndefined(scope.value)) {
                    scope.value = defaultValue;
                }

                valueElement.val(formatValue(scope.value));
                validate();
                setPreviousValue(scope.value);

                // Prepare API instance.
                if (scope.instance) {
                    scope.instance.isInitialized = true;

                    scope.instance.validate = function () {
                        scope.isTouched = true;
                        validate();
                    };

                    scope.instance.isValid = function () {
                        return scope.isValid;
                    };

                    scope.instance.focus = function () {
                        if (!scope.isValueFocused) {
                            valueElement.focus();
                        }
                    };

                    scope.instance.failedValidator = function () {
                        return failedValidator;
                    };

                    scope.instance.clear = function () {
                        scope.doReset();

                        $timeout(function () {
                            scope.isTouched = false;
                        });
                    };
                }
            }
        };
    }]);})();
(function(){angular.module('marcuraUI.components')
    /**
     * The MaTooltip service creates tooltip- and popover-like directives as well as
     * houses global options for them.
     */
    .provider('MaTooltip', function () {
        // The default options tooltip and popover.
        var defaultOptions = {
            position: 'top',
            animation: true,
            delay: 0,
            // TODO:  It might have something to do with templating and transcluding.
            // Maybe it can be used later.
            useContentExp: false
        };

        // Default hide triggers for each show trigger
        var triggerMap = {
            'mouseenter': 'mouseleave',
            'click': 'click',
            'focus': 'blur'
        };

        // The options specified to the provider globally.
        var globalOptions = {};

        /**
         * `options({})` allows global configuration of all tooltips in the
         * application.
         *
         *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( MaTooltipProvider ) {
         *     // place tooltips left instead of top by default
         *     MaTooltipProvider.options( { position: 'left' } );
         *   });
         */
        this.options = function (value) {
            angular.extend(globalOptions, value);
        };

        /**
         * Returns the actual instance of the MaTooltip service.
         * TODO support multiple triggers
         */
        this.$get = ['$window', '$compile', '$timeout', '$document', '$interpolate', 'MaPosition', 'MaHelper', function ($window, $compile, $timeout, $document, $interpolate, MaPosition, MaHelper) {
            return function MaTooltip(defaultTriggerShow, options) {
                options = angular.extend({}, defaultOptions, globalOptions, options);

                /**
                 * Returns an object of show and hide triggers.
                 *
                 * If a trigger is supplied,
                 * it is used to show the tooltip; otherwise, it will use the `trigger`
                 * option passed to the `MaTooltipProvider.options` method; else it will
                 * default to the trigger supplied to this directive factory.
                 *
                 * The hide trigger is based on the show trigger. If t.he `trigger` option
                 * was passed to the `MaTooltipProvider.options` method, it will use the
                 * mapped trigger from `triggerMap` or the passed trigger if the map is
                 * undefined; otherwise, it uses the `triggerMap` value of the show
                 * trigger; else it will just use the show trigger.
                 */
                var getTriggers = function (trigger) {
                    var show = trigger || options.trigger || defaultTriggerShow,
                        hide = triggerMap[show] || show;

                    return {
                        show: show,
                        hide: hide
                    };
                };

                var startSymbol = $interpolate.startSymbol(),
                    endSymbol = $interpolate.endSymbol();

                var template = '\
                    <div ma-tooltip-popup\
                        ' + (options.useContentExp ? 'content-exp="contentExp()" ' : 'content="' + startSymbol + 'content' + endSymbol + '" ') + '\
                        position="' + startSymbol + 'position' + endSymbol + '"\
                        popup-class="' + startSymbol + 'popupClass' + endSymbol + '"\
                        animation="animation"\
                        is-visible="isVisible"\
                        can-close="canClose"\
                        origin-scope="origScope"\
                        tooltip-scope="getTooltipScope">\
                    </div>';

                return {
                    restrict: 'EA',
                    compile: function (tElem, tAttrs) {
                        var tooltipLinker = $compile(template);

                        return function link(scope, element, attributes, tooltipController) {
                            var tooltip,
                                tooltipLinkedScope,
                                transitionTimeout,
                                popupTimeout,
                                triggers = getTriggers(),
                                hasIsDisabled = angular.isDefined(attributes.maTooltipIsDisabled),
                                tooltipScope = scope.$new(true),
                                animation = scope.$eval(attributes.maTooltipAnimation),
                                canClose = scope.$eval(attributes.maTooltipCanClose),
                                delay = parseInt(attributes.maTooltipDelay),
                                instance = scope.$eval(attributes.maTooltipInstance);

                            tooltipScope.delay = isNaN(delay) ? options.delay : delay;
                            tooltipScope.popupClass = attributes.maTooltipClass;
                            tooltipScope.position = attributes.maTooltipPosition ? attributes.maTooltipPosition : options.position;
                            tooltipScope.animation = animation !== undefined ? !!animation : options.animation;
                            tooltipScope.isVisible = false;
                            tooltipScope.canClose = canClose !== undefined ? !!canClose : false;
                            // Set up the correct scope to allow transclusion later.
                            tooltipScope.origScope = scope;
                            tooltipScope.contentExp = function () {
                                return scope.$eval(attributes.maTooltip);
                            };
                            tooltipScope.getTooltipScope = function () {
                                return tooltipScope;
                            };

                            var setPosition = function () {
                                if (!tooltip) {
                                    return;
                                }

                                var position = MaPosition.positionElements(element, tooltip, tooltipScope.position, false);
                                position.top += 'px';
                                position.left += 'px';

                                // Now set the calculated positioning.
                                tooltip.css(position);
                            };

                            var onToggle = function () {
                                if (tooltipScope.isVisible) {
                                    hide();
                                } else {
                                    if (!tooltipScope.isVisible) {
                                        show();
                                    }
                                }
                            };

                            var onShow = function () {
                                if (!tooltipScope.isVisible) {
                                    show();
                                }
                            };

                            // Show the tooltip with delay if specified, otherwise show it immediately.
                            var show = function () {
                                if (hasIsDisabled && scope.$eval(attributes.maTooltipIsDisabled)) {
                                    return;
                                }

                                if (tooltipScope.delay) {
                                    // Do nothing if the tooltip was already scheduled to pop-up.
                                    // This happens if show is triggered multiple times before any hide is triggered.
                                    if (!popupTimeout) {
                                        popupTimeout = $timeout(doShow, tooltipScope.delay, false);
                                        popupTimeout.then(function (reposition) {
                                            reposition();
                                        });
                                    }
                                } else {
                                    doShow()();
                                }
                            };

                            // Show the tooltip popup element.
                            var doShow = function () {
                                popupTimeout = null;

                                // If there is a pending remove transition, we must cancel it, lest the
                                // tooltip be mysteriously removed.
                                if (transitionTimeout) {
                                    $timeout.cancel(transitionTimeout);
                                    transitionTimeout = null;
                                }

                                // Don't show empty tooltips.
                                if (!(options.useContentExp ? tooltipScope.contentExp() : tooltipScope.content)) {
                                    return angular.noop;
                                }

                                create();

                                // Set the initial positioning.
                                tooltip.css({ top: 0, left: 0, display: 'block' });

                                setPosition();

                                // And show the tooltip.
                                MaHelper.safeApply(function () {
                                    tooltipScope.isVisible = true;
                                });

                                // Return positioning function as promise callback for correct
                                // positioning after draw.
                                return setPosition;
                            };

                            // Hide the tooltip popup element.
                            var hide = function () {
                                MaHelper.safeApply(function () {
                                    tooltipScope.isVisible = false;

                                    // If tooltip is going to be shown after delay, we must cancel this.
                                    $timeout.cancel(popupTimeout);
                                    popupTimeout = null;

                                    // And now we remove it from the DOM. However, if we have animation, we
                                    // need to wait for it to expire beforehand.
                                    // FIXME: this is a placeholder for a port of the transitions library.
                                    if (tooltipScope.animation) {
                                        if (!transitionTimeout) {
                                            transitionTimeout = $timeout(remove, 500);
                                        }
                                    } else {
                                        remove();
                                    }
                                });
                            };

                            tooltipScope.close = function () {
                                hide();
                            };

                            var create = function () {
                                // There can only be one tooltip element per directive shown at once.
                                if (tooltip) {
                                    remove();
                                }
                                tooltipLinkedScope = tooltipScope.$new();
                                tooltip = tooltipLinker(tooltipLinkedScope, function (tooltip) {
                                    element.after(tooltip);
                                });

                                tooltipLinkedScope.$watch(function () {
                                    $timeout(setPosition, 0, false);
                                });

                                if (options.useContentExp) {
                                    tooltipLinkedScope.$watch('contentExp()', function (val) {
                                        if (!val && tooltipScope.isVisible) {
                                            hide();
                                        }
                                    });
                                }
                            };

                            var remove = function () {
                                transitionTimeout = null;

                                if (tooltip) {
                                    tooltip.remove();
                                    tooltip = null;
                                }

                                if (tooltipLinkedScope) {
                                    tooltipLinkedScope.$destroy();
                                    tooltipLinkedScope = null;
                                }
                            };

                            var setTriggers = function () {
                                removeTriggers();
                                triggers = getTriggers(attributes.maTooltipOn);

                                if (triggers.show === triggers.hide) {
                                    element.bind(triggers.show, onToggle);
                                } else {
                                    element.bind(triggers.show, onShow);

                                    // Leave it to user to close tooltip.
                                    if (!tooltipScope.canClose) {
                                        element.bind(triggers.hide, hide);
                                    }
                                }
                            };

                            var removeTriggers = function () {
                                element.unbind(triggers.show, onShow);
                                element.unbind(triggers.hide, hide);
                            };

                            attributes.$observe('maTooltip', function (content) {
                                tooltipScope.content = content;

                                if (!content && tooltipScope.isVisible) {
                                    hide();
                                }
                            });

                            if (attributes.maTooltipCanClose) {
                                scope.$watch(attributes.maTooltipCanClose, function (newValue, oldValue) {
                                    if (newValue === oldValue) {
                                        return;
                                    }

                                    tooltipScope.canClose = newValue;
                                    setTriggers();

                                    if (!tooltipScope.canClose && tooltipScope.isVisible) {
                                        hide();
                                    }
                                });
                            }

                            setTriggers();

                            $timeout(function () {
                                // Check for scope as it might be already destroyed when, for example,
                                // user switches between router states quickly.
                                if (tooltipScope && tooltipScope.isVisible) {
                                    show();
                                }
                            });

                            // Prepare API instance.
                            if (instance) {
                                instance.isInitialized = true;

                                instance.show = function () {
                                    if (!tooltipScope.isVisible) {
                                        show();
                                    }
                                };

                                instance.hide = function () {
                                    if (tooltipScope.isVisible) {
                                        hide();
                                    }
                                };
                            }

                            // Make sure tooltip is destroyed and removed.
                            scope.$on('$destroy', function onDestroyTooltip() {
                                $timeout.cancel(transitionTimeout);
                                $timeout.cancel(popupTimeout);
                                removeTriggers();
                                remove();
                                tooltipScope = null;
                            });
                        };
                    }
                };
            };
        }];
    })
    .directive('maTooltipPopup', ['$sce', function ($sce) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                content: '@',
                position: '@',
                popupClass: '@',
                animation: '&',
                isVisible: '&',
                canClose: '&',
                tooltipScope: '='
            },
            template: function () {
                var html = '<div class="ma-tooltip" ma-tooltip-animation-class="fade" ma-tooltip-classes\
                    ng-class="{\
                        \'in\': isVisible(),\
                        \'ma-tooltip-can-close\': canClose()\
                    }">\
                    <div class="ma-tooltip-arrow"></div>\
                    <div class="ma-tooltip-inner" ng-bind-html="getContent()"></div>\
                    <div class="ma-tooltip-close" ng-if="canClose()" ng-click="tooltipScope().close()">\
                        <i class="fa fa-close"></i>\
                    </div>\
                </div>';

                return html;
            },
            link: function (scope) {
                scope.getContent = function () {
                    return $sce.trustAsHtml(scope.content);
                };
            }
        };
    }])
    .directive('maTooltip', ['MaTooltip', function (MaTooltip) {
        return MaTooltip('mouseenter');
    }])
    /**
     * Note that it's intentional that these classes are *not* applied through $animate.
     * They must not be animated as they're expected to be present on the tooltip on
     * initialization.
     */
    .directive('maTooltipClasses', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attribites) {
                if (scope.position) {
                    element.addClass(scope.position);
                }

                if (scope.popupClass) {
                    element.addClass(scope.popupClass);
                }

                if (scope.animation()) {
                    element.addClass(attribites.maTooltipAnimationClass);
                }
            }
        };
    });
    // This is mostly ngInclude code but with a custom scope
    // .directive('maTooltipTemplateTransclude', ['$animate', '$sce', '$compile', '$templateRequest',
    //     function ($animate, $sce, $compile, $templateRequest) {
    //         return {
    //             link: function (scope, elem, attributes) {
    //                 var origScope = scope.$eval(attributes.maTooltipTemplateTranscludeScope),
    //                     changeCounter = 0,
    //                     currentScope,
    //                     previousElement,
    //                     currentElement;

    //                 var cleanupLastIncludeContent = function () {
    //                     if (previousElement) {
    //                         previousElement.remove();
    //                         previousElement = null;
    //                     }
    //                     if (currentScope) {
    //                         currentScope.$destroy();
    //                         currentScope = null;
    //                     }
    //                     if (currentElement) {
    //                         $animate.leave(currentElement).then(function () {
    //                             previousElement = null;
    //                         });
    //                         previousElement = currentElement;
    //                         currentElement = null;
    //                     }
    //                 };

    //                 scope.$watch($sce.parseAsResourceUrl(attributes.maTooltipTemplateTransclude), function (src) {
    //                     var thisChangeId = ++changeCounter;

    //                     if (src) {
    //                         //set the 2nd param to true to ignore the template request error so that the inner
    //                         //contents and scope can be cleaned up.
    //                         $templateRequest(src, true).then(function (response) {
    //                             if (thisChangeId !== changeCounter) { return; }
    //                             var newScope = origScope.$new();
    //                             var template = response;

    //                             var clone = $compile(template)(newScope, function (clone) {
    //                                 cleanupLastIncludeContent();
    //                                 $animate.enter(clone, elem);
    //                             });

    //                             currentScope = newScope;
    //                             currentElement = clone;

    //                             currentScope.$emit('$includeContentLoaded', src);
    //                         }, function () {
    //                             if (thisChangeId === changeCounter) {
    //                                 cleanupLastIncludeContent();
    //                                 scope.$emit('$includeContentError', src);
    //                             }
    //                         });
    //                         scope.$emit('$includeContentRequested', src);
    //                     } else {
    //                         cleanupLastIncludeContent();
    //                     }
    //                 });

    //                 scope.$on('$destroy', cleanupLastIncludeContent);
    //             }
    //         };
    //     }])
    // .directive('maTooltipTemplate', ['MaTooltip', function (MaTooltip) {
    //     return MaTooltip('maTooltipTemplate', 'mouseenter', {
    //         useContentExp: true
    //     });
    // }])
    // .directive('maTooltipHtml', ['MaTooltip', function (MaTooltip) {
    //     return MaTooltip('maTooltipHtml', 'mouseenter', {
    //         useContentExp: true
    //     });
    // }]);
})();
(function(){angular.module('marcuraUI.services').factory('MaDate', [function () {
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

    var isInteger = function (value) {
        return value === parseInt(value, 10);
    };

    var isDate = function (value) {
        if (!value) {
            return false;
        }

        return Object.prototype.toString.call(value) === '[object Date]' && value.getTime && !isNaN(value.getTime());
    };

    var isMaDate = function (value) {
        return value instanceof MaDate || (!!value && value._isMaDate);
    };

    var isMatch = function (date, substring) {
        return date.match(new RegExp(substring, 'i'));
    };

    var getTotalDate = function (year, month, day, hours, minutes, seconds, milliseconds, offset) {
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

    var getDayAndMonth = function (day, month, culture) {
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

    var parse = function (value, culture) {
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

    var formatNumber = function (number, length) {
        var string = '';

        for (var i = 0; i < length; i++) {
            string += '0';
        }

        return (string + number).slice(-length);
    };

    var isValidTimeZoneOffset = function (offset) {
        return offset >= -720 && offset <= 840;
    };

    var offsetToTimeZone = function (offset) {
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
    var format = function (date) {
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
        var checkDatePart = function (dateChar) {
            var datePart = '';

            // Try-catch construction because some sub-formats may be not listed.
            try {
                datePart = format.match(new RegExp(dateChar + '+', ''))[0];
            } catch (error) { }

            return datePartFormats[dateChar].indexOf(datePart);
        };

        // Formats date parts.
        var formatDatePart = function (datePartFormat) {
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

    var parseTimeZone = function (timeZone) {
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
        - new MaDate()
        - new MaDate(useLocalTimeZone)
        - new MaDate(Date)
        - new MaDate(MaDate)
        - new MaDate(dateString)
        - new MaDate(dateString, culture)
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
            } else if (typeof date === 'boolean') {
                this._date = new Date();
                this._offset = -this._date.getTimezoneOffset();
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

    MaDate.createEmpty = function () {
        return new MaDate(null);
    };

    MaDate.createLocal = function () {
        return new MaDate(true);
    };

    MaDate.prototype.copy = function () {
        return new MaDate(this);
    };

    MaDate.prototype.toDate = function () {
        return this._date;
    };

    MaDate.prototype.offset = function (offset) {
        if (arguments.length === 0) {
            return this._offset;
        }

        this._offset = offset;
        return this;
    };

    MaDate.prototype.toUtc = function () {
        if (this.isEmpty() || this._offset === 0) {
            return this;
        }

        this.subtract(this._offset, 'minute');
        this._offset = 0;

        return this;
    };

    MaDate.prototype.isEmpty = function () {
        return !this._date;
    };

    MaDate.prototype.isUtc = function () {
        return !this.isEmpty() && this._offset === 0;
    };

    MaDate.prototype.isEqual = function (date) {
        return this.difference(date) === 0;
    };

    MaDate.prototype.isLess = function (date) {
        return this.difference(date) < 0;
    };

    MaDate.prototype.isLessOrEqual = function (date) {
        return this.difference(date) <= 0;
    };

    MaDate.prototype.isGreater = function (date) {
        return this.difference(date) > 0;
    };

    MaDate.prototype.isGreaterOrEqual = function (date) {
        return this.difference(date) >= 0;
    };

    MaDate.prototype.isBetween = function (startDate, endDate, isInclusive) {
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

    MaDate.prototype.difference = function (date) {
        return this.valueOf() - new MaDate(date).valueOf();
    };

    MaDate.prototype.valueOf = function () {
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

    MaDate.prototype.format = function (_format) {
        if (this.isEmpty()) {
            return null;
        }

        return format(this._date, _format, this._offset);
    };

    MaDate.prototype.add = function (number, unit) {
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

    MaDate.prototype.subtract = function (number, unit) {
        return this.add(number * -1, unit);
    };

    MaDate.prototype.millisecond = function (millisecond) {
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

    MaDate.prototype.second = function (second) {
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

    MaDate.prototype.minute = function (minute) {
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

    MaDate.prototype.hour = function (hour) {
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

    MaDate.prototype.date = function (date) {
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

    MaDate.prototype.month = function (month) {
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

    MaDate.prototype.year = function (year) {
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

    MaDate.prototype.startOf = function (unit) {
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

    MaDate.prototype.endOf = function (unit) {
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
}]);})();
(function(){angular.module('marcuraUI.services').factory('MaHelper', ['MaDate', '$rootScope', function (MaDate, $rootScope) {
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
}]);})();
(function(){/**
* A set of utility methods that can be use to retrieve position of DOM elements.
* It is meant to be used where we need to absolute-position DOM elements in
* relation to other, existing elements (this is the case for tooltips, popovers,
* typeahead suggestions etc.).
*/
angular.module('marcuraUI.services').factory('MaPosition', ['$document', '$window', function ($document, $window) {
    function getStyle(el, cssprop) {
        // IE
        if (el.currentStyle) {
            return el.currentStyle[cssprop];
        } else if ($window.getComputedStyle) {
            return $window.getComputedStyle(el)[cssprop];
        }

        // finally try and get inline style
        return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
        return (getStyle(element, 'position') || 'static') === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
        var docDomEl = $document[0];
        var offsetParent = element.offsetParent || docDomEl;
        while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
            offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docDomEl;
    };

    return {
        /**
         * Provides read-only equivalent of jQuery's position function:
         * http://api.jquery.com/position/
         */
        position: function (element) {
            var elBCR = this.offset(element);
            var offsetParentBCR = { top: 0, left: 0 };
            var offsetParentEl = parentOffsetEl(element[0]);
            if (offsetParentEl != $document[0]) {
                offsetParentBCR = this.offset(angular.element(offsetParentEl));
                offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
                offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
            }

            var boundingClientRect = element[0].getBoundingClientRect();
            return {
                width: boundingClientRect.width || element.prop('offsetWidth'),
                height: boundingClientRect.height || element.prop('offsetHeight'),
                top: elBCR.top - offsetParentBCR.top,
                left: elBCR.left - offsetParentBCR.left
            };
        },

        /**
         * Provides read-only equivalent of jQuery's offset function:
         * http://api.jquery.com/offset/
         */
        offset: function (element) {
            var boundingClientRect = element[0].getBoundingClientRect();
            return {
                width: boundingClientRect.width || element.prop('offsetWidth'),
                height: boundingClientRect.height || element.prop('offsetHeight'),
                top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
            };
        },

        /**
         * Provides coordinates for the targetEl in relation to hostEl
         */
        positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

            var positionStrParts = positionStr.split('-');
            var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

            var hostElPos,
                targetElWidth,
                targetElHeight,
                targetElPos;

            hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

            targetElWidth = targetEl.prop('offsetWidth');
            targetElHeight = targetEl.prop('offsetHeight');

            var shiftWidth = {
                center: function () {
                    return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
                },
                left: function () {
                    return hostElPos.left;
                },
                right: function () {
                    return hostElPos.left + hostElPos.width;
                }
            };

            var shiftHeight = {
                center: function () {
                    return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
                },
                top: function () {
                    return hostElPos.top;
                },
                bottom: function () {
                    return hostElPos.top + hostElPos.height;
                }
            };

            switch (pos0) {
                case 'right':
                    targetElPos = {
                        top: shiftHeight[pos1](),
                        left: shiftWidth[pos0]()
                    };
                    break;
                case 'left':
                    targetElPos = {
                        top: shiftHeight[pos1](),
                        left: hostElPos.left - targetElWidth
                    };
                    break;
                case 'bottom':
                    targetElPos = {
                        top: shiftHeight[pos0](),
                        left: shiftWidth[pos1]()
                    };
                    break;
                default:
                    targetElPos = {
                        top: hostElPos.top - targetElHeight,
                        left: shiftWidth[pos1]()
                    };
                    break;
            }

            return targetElPos;
        }
    };
}]);})();
(function(){angular.module('marcuraUI.services').factory('MaValidators', ['MaHelper', 'MaDate', function (MaHelper, MaDate) {
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
                name: 'IsLengthGreaterOrEqual',
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
                name: 'IsLengthLessOrEqual',
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
}]);})();