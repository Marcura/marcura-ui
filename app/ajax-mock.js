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
    }, {
        id: 4,
        name: 'Cayman Brac',
        country: {
            id: 4,
            name: 'Cayman Islands'
        }
    }, {
        id: 5,
        name: 'Areia Branca',
        country: {
            id: 5,
            name: 'Brazil'
        }
    }, {
        id: 6,
        name: 'Port Ibrahim',
        country: {
            id: 6,
            name: 'Egypt'
        }
    }, {
        id: 7,
        name: 'Brahestad',
        country: {
            id: 7,
            name: 'Finland'
        }
    }, {
        id: 8,
        name: 'Brake',
        country: {
            id: 8,
            name: 'Germany'
        }
    }]
};

$.ajax = function(parameters) {
    if (parameters.url === '/api/ports') {
        parameters.success(window.marcuraApp.ports);
    }
};
