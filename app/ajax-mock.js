$.ajax = function(parameters) {
    if (parameters.url === '/api/ports') {
        var ports = [{
            id: 1,
            name: 'Tokai',
            country: {
                name: 'Japan'
            }
        }, {
            id: 2,
            name: 'Vladivostok',
            country: {
                name: 'Russia'
            }
        }, {
            id: 3,
            name: 'Navlakhi',
            country: {
                name: 'India'
            }
        }];

        parameters.success(ports);
    }
};
