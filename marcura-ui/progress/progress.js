angular.module('marcuraUI.components').directive('maProgress', [function() {
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
