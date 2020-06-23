var APPLICATION_VERSION = 'v=1.1';
var APPLICATION_CACHE_HEADER = 'bust=v=1.1';
require.config({
	waitSeconds : 30,
	baseUrl: '/controlpanel/app',
	urlArgs: APPLICATION_VERSION
});

require(
    [
        'app',
        'c2iapp/directives/misc-directives',
        // 'c2iapp/directives/accordion',
        'c2iapp/directives/daterangepicker',
        'c2iapp/directives/navbar',
        'c2iapp/directives/busy',
        'c2iapp/directives/cicpassistant.min',
        'c2iapp/services/routeResolver',
        'c2iapp/services/authService',
        'c2iapp/services/dataService',
        'c2iapp/services/ecomService',
        'c2iapp/services/modalService',
        'c2iapp/services/httpInterceptors',
        'c2iapp/controllers/mainController',
        'c2iapp/controllers/navController'
    ],
    function () {
        angular.bootstrap(document, ['c2iapp']);
    });
