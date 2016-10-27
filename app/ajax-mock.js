window.marcuraApp = {
    ports: [{
        id: 0,
        name: 'Tokai',
        country: {
            id: 0,
            name: 'Japan'
        }
    }, {
        id: 2,
        name: 'Vladivostok',
        country: {
            id: 2,
            name: 'Russia'
        }
    }, {
        id: 3,
        name: 'Navlakhi',
        country: {
            id: 3,
            name: 'India'
        }
    }]
};

$.ajax = function(parameters) {
    if (parameters.url === '/api/ports') {
        parameters.success(window.marcuraApp.ports);
    }
};
