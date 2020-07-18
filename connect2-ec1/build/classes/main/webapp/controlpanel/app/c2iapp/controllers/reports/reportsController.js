'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http'];

    var reportsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http) {
		$scope.url=$location.search();
		$scope.loading = false;
		$scope.noProductAdded=false;
		$scope.noDataFetched=false;
		$scope.comppro=[];
		$scope.reportForm = {};

		$scope.getReports = function(){
			console.log('getting importers reports');
			dataService.getPurchasedReportList().then(function (response) {
				$scope.pReports = response.data.data || [];
				if($scope.pReports && $scope.pReports.length > 0) {
					angular.forEach($scope.pReports, function(value, index) {
						value.reportDateFormatted = moment(value.reportDate).format("DD MMM YYYY hh:mm a");
					});
					$scope.selectedReport = $scope.pReports[0];
				}
			});
		};

		$scope.populateReport = function (reportId) {
			$scope.preport = {};
			dataService.getReportDetails(reportId).then(function (response) {
				if(response.data.success) {
					$scope.preport = response.data.data;
					if($scope.preport.reportDate) {
						$scope.preport['reportDateFormatted'] = moment($scope.preport.reportDate).format("DD MMM YYYY hh:mm a");
					}
					
					$scope.preportData = {};
					if ($scope.preport.reportData) {
						var reportJson = JSON.parse($scope.preport.reportData);
						$scope.reportData = reportJson.data || [];
						$scope.reportHeaders = reportJson.header || [];
						$scope.dataKeys = reportJson.dataKeys;
						
					}
				}
			});
		};
		
		$scope.downloadReportFile = function (reportDocId) {
			$http.get('/api/controlpanel/getTempToken').success(function(data) {
				$scope.reportSource = '/api/controlpanel/document/' + reportDocId + "?c2itkn=" + data.tkn;
				window.open($scope.reportSource);
			});
			
		};
		
		$scope.$watch('selectedReport', function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				//$scope.downloadReportFile(newVal.reportDoc.documentId);
			}
		}, true);

		$scope.getReports();
    };

    reportsController.$inject = injectParams;


    app.register.controller('reportsController', reportsController);

});