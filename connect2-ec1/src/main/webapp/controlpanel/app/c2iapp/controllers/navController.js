'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataService', '$rootScope','$q'];
    
	
	
    var navController = function ($scope, $location, $filter, $window,
                                        $timeout, authService, dataService, $rootScope, $q) {
		
		console.log("RANJAN: NAV CONTROLLER");
			
		$scope.selectedModule = $scope.selectedModule;
		$rootScope.panelFeatures = {};
		
		$scope.showModule = function (module) {
			$scope.selectedModule = module;
			$rootScope.selectedModule = module;
			$rootScope.$broadcast("moduleChaged", {moduleName: module});
			$location.path("/" + module);
		};
		
		$scope.logout = function () {
			authService.logout().then(function(response) {
				if(response.data.success) {
					$rootScope.showNavBar = false;
					window.location.reload();
				}
			});
		};
		
		$scope.isSubscribed = function (key) {
			//console.log('check of subscription: ', key);
			return authService.checkSubscribedComponent(key);
		};
		
		
		$rootScope.$watch('showNavBar', function(newVal, oldVal) {
			console.log("showNavBar", newVal, authService.getCachedData());
			
		});
		
		
    };

    navController.$inject = injectParams;

    app.controller('navController', navController);

});