'use strict';

define([ 'app' ], function(app) {

	var injectParams = [ '$scope', '$location', '$routeParams', 'authService',
			'dataService', '$rootScope', '$filter', '$timeout' ];

	var tradeSummaryController = function($scope, $location, $routeParams,
			authService, dataService, $rootScope, $filter, $timeout) {
		
		$scope.url = $location.search();
		
		
		dataService.topExportProducts().then(function(response){
			$scope.exportTopProduct = response;
		});
		
		dataService.topImportProducts().then(function(response){
			$scope.importTopProduct = response;
		});
		
		dataService.topImportCountries().then(function(response){
			$scope.importTopCountry = response;
		});
		
		dataService.topExportCountries().then(function(response){
			$scope.exportTopCountry = response;
		});
		
		var trendCriteria = {
			duration : '10/01/2016-10/31/2016',
			outputTypeValue : 5
		};
		trendCriteria['outputType'] = 'VALUE_TOP_ORIGIN_PORT';
		
		dataService.topExportPorts(trendCriteria).then(function(response){
			$scope.topExportPorts = response;
		});
		
		dataService.topImportPorts(trendCriteria).then(function(response){
			$scope.topImportPorts = response;
		});

	};

	tradeSummaryController.$inject = injectParams;
	app.register.controller('tradeSummaryController', tradeSummaryController);
});
