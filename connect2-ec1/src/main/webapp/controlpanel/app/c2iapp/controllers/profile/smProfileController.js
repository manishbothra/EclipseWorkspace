'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http'];

    var smProfileController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http) {
		$scope.url=$location.search();
		$scope.loading = false;

		$scope.loadStats = function() {
			dataService.getDashboardStats().then(function(response) {
				$scope.dashboardStats = response.data.data || {};
				$scope.smProfiles = $scope.dashboardStats.smProfileNames || [];
			});
	   };
	   
		$scope.loadStats();
    };

    smProfileController.$inject = injectParams;
    app.register.controller('smProfileController', smProfileController);

});