$.ajax = function(parameters) {
    if (parameters.url === '/api/ports') {
        var ports = [{
            id: 1,
            name: 'Tokai'
        }, {
            id: 2,
            name: 'Vladivostok'
        }, {
            id: 3,
            name: 'Navlakhi'
        }];

        parameters.success(ports);
    }
};
