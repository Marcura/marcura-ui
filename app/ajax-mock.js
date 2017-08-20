window.marcuraApp = {
    ports: [{
        id: 0,
        name: 'Tokai',
        isEnabled: true,
        country: {
            id: 0,
            name: 'Japan'
        }
    }, {
        id: 2,
        name: 'Vladivostok',
        isEnabled: true,
        country: {
            id: 2,
            name: 'Russia'
        }
    }, {
        id: 3,
        name: 'Navlakhi',
        isEnabled: true,
        country: {
            id: 3,
            name: 'India'
        }
    }, {
        id: 4,
        name: 'Cayman Brac',
        isEnabled: true,
        country: {
            id: 4,
            name: 'Cayman Islands'
        }
    }, {
        id: 5,
        name: 'Areia Branca',
        isEnabled: true,
        country: {
            id: 5,
            name: 'Brazil'
        }
    }, {
        id: 6,
        name: 'Port Ibrahim',
        isEnabled: true,
        country: {
            id: 6,
            name: 'Egypt'
        }
    }, {
        id: 7,
        name: 'Brahestad',
        isEnabled: true,
        country: {
            id: 7,
            name: 'Finland'
        }
    }, {
        id: 8,
        name: 'Brake',
        isEnabled: true,
        country: {
            id: 8,
            name: 'Germany'
        }
    }]
};

$.ajax = function (parameters) {
    if (parameters.url === '/api/ports') {
        setTimeout(function () {
            parameters.success(window.marcuraApp.ports);
        }, 1000);
    }
};