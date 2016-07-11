module.exports = function(config) {
    config.set({
        basePath: './../../../',
        autoWatch: true,
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        plugins: [
            'karma-chrome-launcher',
            'karma-junit-reporter',
            'karma-jasmine'
        ],
        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-route/angular-route.js',
            'marcura-ui/*.js',
            'marcura-ui/services/*.js',
            'app/**/*.js',
            'tests/**/*.js'
        ]
    });
};
