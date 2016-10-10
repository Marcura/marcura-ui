angular.module('app.services').factory('api', api);

function api($http) {
    return {
        ports: function() {
            return $http.get('/api/ports');
        }
    };
}
