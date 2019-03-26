angular.module('marcuraUI.components')
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
         * // place tooltips left instead of top by default
         * MaTooltipProvider.options( { position: 'left' } );
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
                        <i class="fa fa-times"></i>\
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
