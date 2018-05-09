var asiaRegion = {
    id: 1,
    name: 'Asia'
};
var caribbeanRegion = {
    id: 2,
    name: 'Caribbean'
};
var southAmericaRegion = {
    id: 3,
    name: 'South America'
};
var africaRegion = {
    id: 4,
    name: 'Africa'
};
var europeRegion = {
    id: 5,
    name: 'Europe'
};

window.marcuraApp = {
    ports: [{
        id: 0,
        name: 'Tokai',
        isEnabled: true,
        country: {
            id: 0,
            name: 'Japan'
        },
        region: asiaRegion
    }, {
        id: 2,
        name: 'Vladivostok',
        isEnabled: true,
        country: {
            id: 2,
            name: 'Russia'
        },
        region: asiaRegion
    }, {
        id: 3,
        name: 'Navlakhi',
        isEnabled: true,
        country: {
            id: 3,
            name: 'India'
        },
        region: asiaRegion
    }, {
        id: 4,
        name: 'Cayman Brac',
        isEnabled: true,
        country: {
            id: 4,
            name: 'Cayman Islands'
        },
        region: caribbeanRegion
    }, {
        id: 5,
        name: 'Areia Branca',
        isEnabled: true,
        country: {
            id: 5,
            name: 'Brazil'
        },
        region: southAmericaRegion
    }, {
        id: 6,
        name: 'Port Ibrahim',
        isEnabled: true,
        country: {
            id: 6,
            name: 'Egypt'
        },
        region: africaRegion
    }, {
        id: 7,
        name: 'Brahestad',
        isEnabled: true,
        country: {
            id: 7,
            name: 'Finland'
        },
        region: europeRegion
    }, {
        id: 8,
        name: 'Brake',
        isEnabled: true,
        country: {
            id: 8,
            name: 'Germany'
        },
        region: europeRegion
    }]
};

$.ajax = function (parameters) {
    if (parameters.url === '/api/ports') {
        setTimeout(function () {
            parameters.success(window.marcuraApp.ports);
        }, 1000);
    }
};