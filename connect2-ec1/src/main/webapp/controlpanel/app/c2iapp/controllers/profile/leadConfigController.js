'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope'];

    var leadConfigController = function ($scope, $location, $routeParams, authService, dataService, $rootScope) {
        $scope.leadConfigForm = {notificationNumbers:[],notificationEmails:[], configType: 'LEAD'};
		$scope.successMsg = '';
		
		$scope.getWebsites = function() {
			dataService.getCompanyDomains().then(function(response) {
				if(response.data.success && response.data.data) {
					$scope.domains = response.data.data || [];
					angular.forEach($scope.domains, function(value, index) {
						var domainDisplayname = value.domain;
						if (value.mappedDomains && value.mappedDomains.length > 0) {
							domainDisplayname = value.mappedDomains[0] || domainDisplayname;
						}
						value.domainDisplayname = domainDisplayname;
					});
					
					if($scope.domains.length > 0) {
						$scope.selectedDomain = $scope.domains[0];
						$scope.leadConfigForm.domainName = $scope.selectedDomain.domain;
					}
				}
			});
		};
		
		$scope.setConfigData = function () {
			if(!$scope.dbConfig) {
				$scope.leadConfigForm = {notificationNumbers:[],notificationEmails:[], configType: 'LEAD'};
			} else {
				$scope.leadConfigForm = angular.copy($scope.dbConfig);
			}
		};
		
		$scope.loadCompanyConfig = function () {
			$rootScope.loadingData = true;
			dataService.getCompanyConfig('LEAD').then(function(response) {
				if(response.data.success && response.data.data) {
					$scope.dbConfig = response.data.data;
					$scope.setConfigData();
				}
			})['finally'](function() {
				$rootScope.loadingData = false;
			});
		};
		
        $scope.updateLeadConfig = function () {
			$scope.successMsg = '';
			var payload = angular.copy($scope.leadConfigForm);
			$rootScope.loadingData = true;
			authService.updateLeadConfig(payload).then(function(response) {
				if (response.data.success) {
					if (response.data.success) {
						$scope.successMsg = 'New configurations have been updated successfully.';
					}	 
				}
			})['finally'](function() {
				$rootScope.loadingData = false;
			});
        };
		
		$scope.resetForm = function() {
			$scope.setConfigData();
		};
		
		$scope.loadCompanyConfig();
		$scope.getWebsites();
    };

    leadConfigController.$inject = injectParams;
    app.register.controller('leadConfigController', leadConfigController);

});