'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http'];

    var analyticsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http) {
		
		$scope.loadAnalytics = function() {
			$rootScope.loading = true;
			dataService.getProfileAnalytics().then(function(response) {
				$scope.stats = response.data;				
			})['finally'](function() {
				$rootScope.loading = false;
				
			});;
		};

		$scope.loadAnalytics();
    };

    analyticsController.$inject = injectParams;
    app.register.controller('analyticsController', analyticsController);

});