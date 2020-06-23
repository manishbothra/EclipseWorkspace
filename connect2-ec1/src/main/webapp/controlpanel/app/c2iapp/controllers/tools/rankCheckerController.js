'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http'];

    var rankCheckerController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http) {
       
	$scope.domains = [];

	$scope.loadData = function() {
		$rootScope.loadingData = true;
		dataService.getCompanyDomains().then(function(response) {
			$rootScope.loadingData = false;
			if(response.data.success && response.data.data) {
				$scope.domains = [];
				angular.forEach(response.data.data, function(value, index) {
					if(value.mappedDomains) {
						angular.forEach(value.mappedDomains, function(md, ix) {
							if(md) {
								$scope.domains.push(md);
							}
						});
					}
					
				});
				
				if($scope.domains && $scope.domains.length > 0) {
					$scope.selectedDomain = $scope.domains[0];
				}
			}
		});
	};


	$scope.checkRank = function() {
		$rootScope.loadingData = true;
		if($scope.selectedDomain && $scope.keyword) {
			var payload = {domainName: $scope.selectedDomain, keyword: $scope.keyword};
			dataService.checkRank(payload).then(function(response) {
				$rootScope.loadingData = false;
				if(response.data.success && response.data.ranks) {
					$scope.ranks = response.data.ranks;
				}
			});
		}
		
	};


	$scope.loadData();


    };

    rankCheckerController.$inject = injectParams;

    app.register.controller('rankCheckerController', rankCheckerController);

});