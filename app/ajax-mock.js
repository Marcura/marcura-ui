window.marcuraApp = {
    ports: [{
        id: 0,
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
    }]
};

$.ajax = function(parameters) {
    if (parameters.url === '/api/ports') {
        parameters.success(window.marcuraApp.ports);
    }
};
