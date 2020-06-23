'use strict';

define(['app'], function (app) {

    app.config(['$httpProvider', function ($httpProvider) {

        var injectParams = ['$q', '$rootScope'];

        var httpInterceptor401 = function ($q, $rootScope) {

			return {
				request: function($config) {
					var tk = window.localStorage.getItem("c2iSession");
					if(tk) {
						$config.headers['X-Auth-Token'] = tk;
					}
					return $config;
				},
				responseError: function(rejection) {
				  if (rejection.status === 0) {
					console.log("SERVER NOT REACHABLE.");
					$rootScope.$broadcast('serverExceptionEvent', {event:'notReachable'});
					return;
				  } else if (rejection.status === 401) {
					$rootScope.$broadcast('serverExceptionEvent', {event:'sessionExpired'});
					return;
				  }
				  return $q.reject(rejection);
				}
			};
		};
        httpInterceptor401.$inject = injectParams;

        $httpProvider.interceptors.push(httpInterceptor401);

    }]);
    
});