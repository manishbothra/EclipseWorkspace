'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http'];

    var newWebsiteController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http) {
		
		$scope.doneSteps = [];
		$scope.domainForm = {};
		$scope.templates = [{id: 1, templateUrl:'/editable-templates/product-template-1/index.html', thumb:'/hosted/editable-templates/product-template-1/images/template.jpg', templateName: 'product-template-1'}];
		$scope.selectedStep = 'step1';
		
		$scope.setSelectedStep = function(step) {
			if($scope.isStepDone(step)) {
				$scope.selectedStep = step;
			}
			
		};
		
		$scope.setSelectedTemplate = function(template) {
			$scope.selectedTemplate = template;
		};
		
		$scope.showTemplateStep = function(step, nextStep, isValid) {
			if(isValid) {
				$scope.doneSteps.push(step);
				$scope.selectedStep = nextStep;
			}
		}
		
		$scope.isStepDone = function (step){
			return $scope.doneSteps.indexOf(step) >= 0;
		};
		
		$scope.createWebsite = function() {
			console.log($scope.domainForm);
			if(!$scope.domainForm.domainName || !$scope.domainForm.companyName || !$scope.selectedTemplate) {
				$scope.errorMessage = 'Please choose the template to continue';
				return;
			}
			
			var payload = {};
			var domainResources = {};
			var resourceBundle = {};
			
			
			domainResources.domain = $scope.domainForm.domainName;
			resourceBundle.domain = $scope.domainForm.domainName;
			resourceBundle.companyName = $scope.domainForm.companyName;
			resourceBundle.fullAddress = $scope.domainForm.fullAddress;
			resourceBundle.contactNos = $scope.domainForm.contactNos;
			domainResources.resouceBundle = JSON.stringify(resourceBundle);
			
			payload.domainName = $scope.domainForm.domainName;
			if($scope.selectedTemplate) {
				payload.editTemplateUrl = $scope.selectedTemplate.templateUrl;
				payload.editTemplateName = $scope.selectedTemplate.templateName;
			}
			
			payload.domainResources = domainResources;
			
			authService.createNewWebsite(payload).then(function(response) {
				if (response.data.success) {
					console.log(response);
					$scope.updateUrl = response.data.editUrl;
					$scope.showResults = true;
					$scope.successMsg = 'Your website has been successfully created.';
				}
			});
			
		};
		
		$scope.setDomainData = function() {
			$scope.domainForm.domainName = $scope.companyProfile.name.replace(/\\s/g, '').toLowerCase();
			$scope.domainForm.companyName = $scope.companyProfile.name;
		};
		
		$scope.loadCompanyDetails = function(){
			$rootScope.loadingData = true;
			authService.getControlPanelDetails().then(function(response) {
				$scope.companyProfile = response.data[0];
				$scope.setDomainData();
			})['finally'](function () {
				$rootScope.loadingData = false;
			});
		};		
		
		
		$scope.getWebsites = function() {
			$rootScope.loadingData = true;
			dataService.getCompanyDomains().then(function(response) {
				$rootScope.loadingData = false;
				if(response.data.success && response.data.data) {
					$scope.domains = response.data.data || [];
					if($scope.domains.length > 0) {
						$location.path('/websites');
					}
				}
			});
		};

		$scope.getWebsites();		
		$scope.loadCompanyDetails();
    };

    newWebsiteController.$inject = injectParams;
    app.register.controller('newWebsiteController', newWebsiteController);

});