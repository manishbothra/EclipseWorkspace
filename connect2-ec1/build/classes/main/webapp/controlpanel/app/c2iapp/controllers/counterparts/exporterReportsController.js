'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http'];

    var exporterReportsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http) {
		$scope.url=$location.search();
		$scope.loading = false;
		$scope.noProductAdded=false;
		$scope.noDataFetched=false;
		$scope.comppro=[];
		$scope.reportForm = {};
		$scope.contactForm = {templateId:""};

		$scope.getGlobalExporterReports = function(){
			console.log('getting exporters reports');
			$rootScope.loadingData = true;
			dataService.getPurchasedExpList().then(function (response) {
				$rootScope.loadingData = false;
				$scope.expReports = response.data.data || [];
				if($scope.expReports && $scope.expReports.length > 0) {
					angular.forEach($scope.expReports, function(value, index) {
						value.reportDateFormatted = moment(value.reportDate).format("DD MMM YYYY hh:mm a");
					});
					//$scope.selectedImpReport = $scope.impReports[0];
				}
			});
		};

		$scope.populateReport = function (report) {
			$scope.selectedExpReport = report;
			var reportId = report.reportId;
			$scope.expReport = {};
			$rootScope.loadingData = true;
			dataService.getReportDetails(reportId).then(function (response) {
				$rootScope.loadingData = false;
				if(response.data.success) {
					$scope.expReport = response.data.data;
					if($scope.expReport.reportDate) {
						$scope.expReport['reportDateFormatted'] = moment($scope.expReport.reportDate).format("DD MMM YYYY hh:mm a");
						
					}
					
					$scope.expReportData = {};
					if ($scope.expReport.reportData) {
						var reportJson = JSON.parse($scope.expReport.reportData);
						$scope.reportData = reportJson.data || reportJson.expData|| [];
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
						$scope.successMsg = 'Your messages have been succefully mailed to the exporter.';
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
		
		$scope.showExporterTemplate = function(report) {
			
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
			dataService.getExportersContactTemplate($scope.contactForm['templateId'], params).then(function (response) {
				$scope.templateData = response.data.templateData;
				
				$scope.contactForm['message'] = $scope.templateData;
				
				$scope.showContactCompanyForm = true;
				$('html,body').animate({scrollTop: $("#contactCompanyDiv").offset().top - 50},'slow');
			});
			
		};
		
		$scope.downloadReportFile = function (report) {
			var reportDocId = report.reportDoc.documentId;
			$scope.selectedExpReport = report;
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
			return $scope.selectedExpReport && $scope.selectedExpReport.reportId == report.reportId
		};
		
		$scope.getGlobalExporterReports();
    };

    exporterReportsController.$inject = injectParams;
    app.register.controller('exporterReportsController', exporterReportsController);

});