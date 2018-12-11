/**
 * This is a clone of https://www.npmjs.com/package/angular-ui-select2 package, which is no longer maintained.
 * It was copied so we can maintain it ourselves.
 *
 * When AJAX mode is on, your value will be an object (or an array of objects) of the data used by Select2.
 * This change is so that you do not have to do an additional query yourself on top of Select2 own query.
 */
angular.module('marcuraUI.components').directive('maSelectBoxWrapper', ['$timeout', 'MaHelper', function ($timeout, MaHelper) {
    // The options passed to $.fn.select2(). See http://select2.github.io/select2/#documentation.
    var options = {};

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
                repeatOption = tElm.find('optgroup[ng-repeat], option[ng-repeat]');

                if (repeatOption.length) {
                    repeatAttr = repeatOption.attr('ng-repeat');
                    watch = $.trim(repeatAttr.split('|')[0]).split(' ').pop();
                }
            }

            return function (scope, elm, attrs, controller) {
                // instance-specific options
                var opts = angular.extend({}, options, scope.$eval(attrs.maSelectBoxWrapper));

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

                    if (!isSelect) {
                        // Set the view and model value and update the angular template manually for the ajax/multiple select2.
                        elm.bind('change', function (e) {
                            e.stopImmediatePropagation();

                            if (scope.$$phase || scope.$root.$$phase) {
                                return;
                            }

                            controller.$setViewValue(convertToAngularModel(elm.select2('data')));
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
                    }
                });
            };
        }
    };
}]);