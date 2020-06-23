'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', 'modalService', '$http'];

    var mobileAppsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, modalService, $http) {
		$scope.url=$location.search();
		$scope.appRequestForm = {};
		
		if($routeParams.appId) {
			$scope.selectedAppId = $routeParams.appId.trim();
			console.log('seleted domain name:' + $scope.selectedDomain);
		}
		
		
		$scope.showInfoMessage = function(title, message) {			
            modalService.showInfoMessage(title, message).then(function(result) {
			});
		};
		
		$scope.getMobileApps = function() {
			$rootScope.loadingData = true;
			dataService.getMobileApps().then(function(response) {
				$rootScope.loadingData = false;
				if (response.data && response.data.success) {
					$scope.mobileApps = response.data.apps || [];
					$scope.hasMobileApps = $scope.mobileApps.length > 0;
				}
			});
		};
		
		
		$scope.requestMobileApp = function() {
			if($scope.appRequestForm.mobile) {
				$rootScope.loadingData = true;
				dataService.requestMobileApp($scope.appRequestForm).then(function(response) {
					console.log("response", response);
					$rootScope.loadingData = false;
					modalService.showInfoMessage('Success', 'Your request for Mobile App has been successfully submitted. We will get back to you shortly.');
					$scope.showAppRequestSuccess = true;
					if(response.data.success) {
						$scope.hasRequestedApp = true;
					}
				});
			}
		};
		
		
		$scope.sendPushNotification = function() {
			if($scope.messageForm.title && $scope.messageForm.message) {
				$rootScope.loadingData = true;
				dataService.sendPushNotification($scope.messageForm).then(function(response) {
					console.log("response", response);
					$rootScope.loadingData = false;
					if(response.data.success) {
						$scope.showInfoMessage('Request Submitted', 'Your request has been successfully submitted. Your app users will be notified.');
					}
				});
			}		
		};
		
		
		$scope.getMobileApps();
    };

    mobileAppsController.$inject = injectParams;


    app.register.controller('mobileAppsController', mobileAppsController);

});