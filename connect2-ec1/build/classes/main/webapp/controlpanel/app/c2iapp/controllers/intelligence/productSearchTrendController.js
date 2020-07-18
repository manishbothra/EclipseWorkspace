'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http'];

    var productSearchTrendController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http) {
       	$scope.url=$location.search();
		$scope.reportForm = {productType:'yourProducts', tradeType: 'export'};
		
		//$scope.url.name = 'a';	
		$scope.loading = false;
		$scope.responseQue = {
			total:false,
			table:false,
			chart:false
		};
		
		
		
		$scope.loadReport = function() {
			/*-
			$rootScope.loadingData = true;
			var payload = {productId: $scope.productReport.productId};
			dataService.getProductSearchTrend(payload).then(function(response){
				$scope.details=response.data;
			})['finally'](function() {
				$rootScope.loadingData = false;	
			});
			*/
			
			$('#timeseries').empty();
			$('#geochart').empty();
			
			$('#embedableScripts').empty();
			
			var ts = '<script type="text\/javascript">' + 
			'trends.embed.renderExploreWidgetTo(document.getElementById("timeseries"), "TIMESERIES", {"comparisonItem":[{"keyword":"' + $scope.productReport.name + '","geo":"","time":"today 12-m"}],"category":0,"property":""}, {"exploreQuery":"q=' + $scope.productReport.name  +'&date=today 12-m","guestPath":"https://trends.google.com:443/trends/embed/"}); <\/script>';
			
			$('#embedableScripts').append(ts);
			
			
			var ts2 = '<script type="text\/javascript"> trends.embed.renderExploreWidgetTo(document.getElementById("geochart"), "GEO_MAP", {"comparisonItem":[{"keyword":"' + $scope.productReport.name + '","geo":"","time":"today 12-m"}],"category":0,"property":""}, {"exploreQuery":"q=' + $scope.productReport.name + '&date=today 12-m","guestPath":"https://trends.google.com:443/trends/embed/"}); <\/script> ';
			
			$('#embedableScripts').append(ts2);
			
		};
		
		
		$scope.$watch('responseQue', function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				console.log("responseQue", $scope.responseQue);
				if(newVal.total && newVal.table && newVal.chart) {
					$scope.loading = false;
				}
			}
		}, true);
				
		
		
		
		
		$scope.changeProduct = function () {
			if($scope.productReport.productId && $scope.productReport.productId > 0) {
				$scope.loadReport();
			}
			
		};
		
		$scope.loadCompanyProducts=function(){
			$scope.loading = true;
			/* Json for getting details of the company using company id  */
			authService.getControlPanelDetails().then(function(response){
				$scope.details=response.data;
				$scope.comppro=$scope.details[0].companyProducts.products;
				$scope.companyProductNames = [];
				
				if($scope.comppro.length>0){
					angular.forEach($scope.comppro, function(value, index) {
						$scope.companyProductNames.push({name: value.name, productId: value.product.id});
					});
					$scope.productReport =  $scope.companyProductNames[0];
					$scope.loadReport();
				} else{
					$scope.noProductAdded=true;
				}
				$scope.companyId=$scope.details[0].id;
			})['finally'](function() {
				$scope.loading = false;
			});
		};
		
		$scope.loadCompanyProducts();
    };

    productSearchTrendController.$inject = injectParams;
    app.register.controller('productSearchTrendController', productSearchTrendController);

});