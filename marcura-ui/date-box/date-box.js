angular.module('marcuraUI.components').directive('maDateBox', maDateBox);

function maDateBox($timeout) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            date: '=',
            timeZone: '=',
            isRequired: '=',
            change: '&',
            format: '@',
            hasTime: '=',
            parser: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-date-box" ng-class="{\
                \'ma-date-box-has-time\': hasTime\
                }">\
                <div class="ma-date-box-wrapper">\
                    <input class="ma-date-box-date form-control input-sm" type="text" id="{{id}}"\
                        ng-required="isRequired"/>\
                    <i class="ma-date-box-icon fa fa-calendar"></i>\
                </div><select ui-select2="{ minimumResultsForSearch: -1 }"\
                    class="ma-date-box-hours"\
                    ng-model="hours"\
                    ng-if="hasTime">\
                    <option ng-repeat="hour in hoursList" value="{{hour}}">{{hour}}</option>\
                </select><select ui-select2="{ minimumResultsForSearch: -1 }"\
                    class="ma-date-box-minutes"\
                    ng-model="minutes"\
                    ng-if="hasTime">\
                    <option ng-repeat="minute in minutesList" value="{{minute}}">{{minute}}</option>\
                </select>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var picker = null,
                dateElement = angular.element(element[0].querySelector('.ma-date-box-date')),
                previousDate = null,
                getNumbers = function(count) {
                    var numbers = [];

                    for (var i = 0; i <= count; i++) {
                        numbers.push((i < 10 ? '0' + i : i).toString());
                    }

                    return numbers;
                },
                getTimeZoneDate = function(date) {
                    date = scope.timeZone ? moment(date).utcOffset(scope.timeZone) : moment(date);

                    return date.isValid() ? date : null;
                },
                onChange = function(internalDate) {
                    var date = null,
                        hours = scope.hours ? parseInt(scope.hours) : 0,
                        minutes = scope.minutes ? parseInt(scope.minutes) : 0;

                    if (internalDate) {
                        date = moment(new Date());

                        if (scope.timeZone) {
                            date = date.utcOffset(scope.timeZone);
                        }

                        date.year(internalDate.year())
                            .month(internalDate.month())
                            .date(internalDate.date())
                            .hour(hours)
                            .minutes(minutes)
                            .seconds(0);
                    }

                    scope.$apply(function() {
                        scope.change({
                            date: date,
                            hours: hours,
                            minutes: minutes
                        });
                    });
                },
                hasDateChanged = function(date) {
                    if ((previousDate === null && date === null) || (previousDate && date && previousDate.diff(date) === 0)) {
                        return false;
                    }

                    return true;
                };

            scope.format = scope.format ? scope.format : 'YYYY-MM-DD';
            scope.hoursList = getNumbers(23);
            scope.minutesList = getNumbers(59);

            $timeout(function() {
                picker = new Pikaday({
                    field: angular.element(element[0].querySelector('.ma-date-box-icon'))[0],
                    position: 'bottom right',
                    minDate: null,
                    maxDate: null,
                    onSelect: function() {
                        var date = getTimeZoneDate(picker.getDate());
                        dateElement.val(date.format(scope.format));

                        if (!hasDateChanged(date)) {
                            return;
                        }

                        previousDate = date;
                        onChange(date);
                    }
                });
            });

            dateElement.on('blur', function() {
                var date = dateElement.val();
                date = scope.parser ? scope.parser(date) : getTimeZoneDate(moment(date));

                if (!hasDateChanged(date)) {
                    return;
                }

                if (date) {
                    dateElement.val(date.format(scope.format));
                    previousDate = date;
                }

                onChange(date);
            });

            if (scope.date) {
                var date = getTimeZoneDate(scope.date);
                dateElement.val(date.format(scope.format));
                previousDate = date;

                if (scope.hasTime) {
                    scope.hours = date.format('HH');
                    scope.minutes = date.format('mm');
                }
            }

            // TODO: Fix time functionality
            // if (scope.hasTime) {
            //     scope.$watch('hours', function() {
            //         onChange();
            //     });
            //
            //     scope.$watch('minutes', function() {
            //         onChange();
            //     });
            // }
        }
    };
}
