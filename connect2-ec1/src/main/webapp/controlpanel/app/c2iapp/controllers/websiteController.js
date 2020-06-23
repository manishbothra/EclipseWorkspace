'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$window'];

    var websiteController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $window) {
		$scope.url=$location.search();
		if($routeParams.domainName) {
			$scope.selectedDomain = $routeParams.domainName.trim();
			console.log('seleted domain name:' + $scope.selectedDomain);
		}
		$scope.getWebsites = function() {
			$rootScope.loadingData = true;
			dataService.getCompanyDomains().then(function(response) {
				$rootScope.loadingData = false;
				if(response.data.success && response.data.data) {
					$scope.domains = response.data.data || [];
					angular.forEach($scope.domains, function(value, index) {
						var domainDisplayname = value.domain;
						if (value.mappedDomains && value.mappedDomains.length > 0) {
							domainDisplayname = value.mappedDomains[0] || domainDisplayname;
						}
						value.domainDisplayname = domainDisplayname;
					});
				}
			});
		};

		
		$scope.selectWebsiteForEdit = function (domain) {
			$scope.selectedDomain = domain.domain;
			//$location.path('/manage-website/'+ domain.domain);
			authService.getOneTimeLoginToken().then(function(response) {
				if(response.data.success) {
					console.log(response.data.rtkn);
					var updateUrl = "http://edit." + $scope.selectedDomain + ".connect2india.com?rtkn=" + response.data.rtkn;
					window.location.href=updateUrl;
				}
			});
		};
		
		$scope.getWebsiteDetials = function () {
			if($scope.selectedDomain) {
				dataService.getWebsiteData($scope.selectedDomain).then( function(response) {
					var data = response.data;
					$scope.domainTemplate = data.template;
					var wdata= JSON.parse(data.data);
					$scope.userStatus=data.status;
					jQuery.extend($scope.doainResources, wdata);
				});
			}
		};
		
		$scope.getWebsites();
		$scope.getWebsiteDetials();
    };

    websiteController.$inject = injectParams;


    app.register.controller('websiteController', websiteController);

});