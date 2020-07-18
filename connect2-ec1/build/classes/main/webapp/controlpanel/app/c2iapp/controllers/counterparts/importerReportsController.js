'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http'];

    var importerReportsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http) {
		$scope.url=$location.search();
		$scope.loading = false;
		$scope.noProductAdded=false;
		$scope.noDataFetched=false;
		$scope.comppro=[];
		$scope.reportForm = {};
		$scope.contactForm = {templateId:""};

		$scope.getGlobalImporterReports = function(){
			console.log('getting importers reports');
			$rootScope.loadingData = true;
			dataService.getPurchasedImpList().then(function (response) {
				$rootScope.loadingData = false;
				$scope.impReports = response.data.data || [];
				if($scope.impReports && $scope.impReports.length > 0) {
					angular.forEach($scope.impReports, function(value, index) {
						value.reportDateFormatted = moment(value.reportDate).format("DD MMM YYYY hh:mm a");
					});
					//$scope.selectedImpReport = $scope.impReports[0];
				}
			});
		};

		$scope.populateReport = function (report) {
			$scope.selectedImpReport = report;
			var reportId = report.reportId;
			$scope.impReport = {};
			$rootScope.loadingData = true;
			dataService.getReportDetails(reportId).then(function (response) {
				$rootScope.loadingData = false;
				if(response.data.success) {
					$scope.impReport = response.data.data;
					if($scope.impReport.reportDate) {
						$scope.impReport['reportDateFormatted'] = moment($scope.impReport.reportDate).format("DD MMM YYYY hh:mm a");
						
					}
					
					$scope.impReportData = {};
					if ($scope.impReport.reportData) {
						var reportJson = JSON.parse($scope.impReport.reportData);
						$scope.reportData = reportJson.data || reportJson.impData|| [];
						$scope.reportHeaders = reportJson.header || [];
						$scope.dataKeys = reportJson.dataKeys;
						
					}
					
					$('html,body').animate({scrollTop: $("#reportDetailedDiv").offset().top - 50},'slow');
				}
			});
		};
		
		$scope.contactCompany = function() {
			
			if($scope.contactForm.email && $scope.contactForm.message) {
				$rootScope.loadingData = true;
				dataService.contactCompany($scope.contactForm).then(function(response) {
					if(response.data.success) {
						$scope.contactForm.email = {};
						$scope.showContactCompanyForm = false;
						$scope.showContactCompanyTemplate = false;
						$scope.successMsg = 'Your messages have been succefully mailed to the importer.';
					} else {
						$scope.errorMessage = 'Sorry, we could not process your request. Please try later.';
					}
				})['finally'](function () {
					$rootScope.loadingData = false;
				});
			}
			
		};
		
		/*$scope.showContactCompany = function(templateData) {
			//$scope.contactForm = {};
			//$scope.contactForm['message'] = templateData;
			$scope.showContactCompanyTemplate = false;
			$scope.showContactCompanyForm = true;
			
			$('html,body').animate({scrollTop: $("#contactCompanyDiv").offset().top - 50},'slow');
			
		};*/
		
		$scope.showImporterTemplate = function(report) {
			
			if(report){
				$scope.contactForm = {};
				$scope.contactForm['templateId'] = "";
				$scope.contactForm['companyId'] = report.companyId;
				$scope.contactForm['email'] = report.email; //'ranjanmalakar2004@gmail.com'; 'vinny9321@gmail.com';//
				$scope.contactForm['companyName'] = report.companyName;
			}
			
			$scope.showContactCompanyForm = false;
			$scope.showContactCompanyTemplate = true;
			
		};
		
		$scope.changeTemplate = function() {
			var params = {};
			dataService.getImportersContactTemplate($scope.contactForm['templateId'], params).then(function (response) {
				$scope.templateData = response.data.templateData;
				
				$scope.contactForm['message'] = $scope.templateData;
				
				$scope.showContactCompanyForm = true;
				$('html,body').animate({scrollTop: $("#contactCompanyDiv").offset().top - 50},'slow');
			});
			
		};
		
		$scope.downloadReportFile = function (report) {
			var reportDocId = report.reportDoc.documentId;
			$scope.selectedImpReport = report;
			authService.getTempAuthToken().then(function(data) {
				$scope.reportSource = '/api/controlpanel/document/' + reportDocId + "?c2itkn=" + data.tkn;
				window.open($scope.reportSource);
			});
			
		};
		
		// $scope.$watch('selectedImpReport', function(newVal, oldVal) {
			// if(newVal && newVal != oldVal) {
				// $scope.populateReport(newVal.reportId);
			// }
		// }, true);
		
		$scope.isRowSelected = function (report) {
			return $scope.selectedImpReport && $scope.selectedImpReport.reportId == report.reportId
		};
		
		$scope.getGlobalImporterReports();
    };

    importerReportsController.$inject = injectParams;
    app.register.controller('importerReportsController', importerReportsController);

});