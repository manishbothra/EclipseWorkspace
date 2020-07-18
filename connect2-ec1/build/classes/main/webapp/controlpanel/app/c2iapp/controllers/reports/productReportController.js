'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http'];

    var productReportController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http) {
       
		$scope.productReport = {name:'a'};
		$scope.url=$location.search();
		$scope.reportForm = {productType:'yourProducts', tradeType: 'export'};
		
		//$scope.url.name = 'a';	
		$scope.loading = false;
		$scope.responseQue = {
			total:false,
			table:false,
			chart:false
		};
		
		$scope.chartData = {
			qtyChart:{
				labels : [],
				datasets : [],
				title:' Export Quantity Trend'
			},
			valueChart: {
				labels : [],
				datasets : [],
				title:' Export Value Trend'
			}
		};
		
		
		$scope.loadReport = function() {	
			$rootScope.loadingData = true;
			$scope.responseQue.total=false;
			$scope.responseQue.table=false;
			$scope.responseQue.chart=false;
			
			$scope.productTitle = $scope.productReport.name == 'a' ? '' : $scope.productReport.name;
			
			dataService.getTradeByProductName($scope.productReport.name, 2016).then(function(data) {
					$scope.productData=data;		
				})['finally'](function() {
					$scope.responseQue.total=true;
				});
		
			dataService.getTradeCountryWiseByProductName($scope.productReport.name, ($scope.reportForm.tradeType || 'export'))
				.then(function(data){
					$scope.countryData=data;		
				})['finally'](function() {
					$scope.responseQue.table=true;
					$rootScope.loadingData = false;
				});
			
			dataService.getTradeYearWiseByProductName($scope.productReport.name, ($scope.reportForm.tradeType || 'export')).then(function(data) {
				
				$scope.qtyStats = data.qtyReport;
				$scope.valueStats = data.valueReport;
				
				if($scope.chartData['qtyChart']['chart']) {
					$scope.chartData['qtyChart']['chart'].update();
					$scope.chartData['qtyChart']['chart'].destroy();
				}
				if($scope.chartData['valueChart']['chart']) {
					$scope.chartData['valueChart']['chart'].update();
					$scope.chartData['valueChart']['chart'].destroy();
				}
				
				$scope.loadGraphs('qtyChart', $scope.qtyStats, 'quantity');
				$scope.loadGraphs('valueChart', $scope.valueStats, 'value');
			})['finally'](function() {
				$scope.responseQue.chart=true;
			});
			
		};
		
		
		$scope.$watch('responseQue', function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				console.log("responseQue", $scope.responseQue);
				if(newVal.total && newVal.table && newVal.chart) {
					$scope.loading = false;
				}
			}
		}, true);
				
		
		
		$scope.loadGraphs = function(chartType, data, typeValue) {
			//data = {2011: 6131801787,2012: 6660930983,2013: 5248284141,2014: 10800350839};
			$scope.chartData[chartType].labels = [];
			$scope.chartData[chartType].datasets = [];
			$scope.chartData[chartType].title = $scope.productTitle + " export " + typeValue + " trend";
			var total = 0;
			var segment = {
				fillColor: "rgba(220,220,220,0.2)",
				backgroundColor: "#EF9380",
				strokeColor: "#EF9380",
				pointColor: "#C1290A",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: []
			};
			angular.forEach(data, function(value, year) {
				$scope.chartData[chartType].labels.push(year);
				segment.data.push(value);
			});
			
			//$scope.chartData[chartType].labels.reverse();
			//segment.data.reverse();
			$scope.chartData[chartType].datasets.push(segment);
			
			$scope.$evalAsync(function() {
				var ctx = document.getElementById("canvas-"+chartType).getContext("2d");
				$scope.chartData[chartType]['chart'] = new Chart(ctx, {
					data: $scope.chartData[chartType],				
					type: 'line',
					options: {
						//responsive : true,
						//maintainAspectRatio: false,
						datasetFill : false,
						legend: {display:false}
					}
				});
				
			});
		};
		
		$scope.changeProduct = function () {
			if($scope.productReport.name && $scope.productReport.name.length > 2) {
				$scope.loadReport();
			}
			
		};
		
		$scope.myOption = {
			options: {
				html: true,
				focusOpen: false,
				onlySelectValid: false,
				source: function (request, response) {
					var data = [];
					if(request.term && request.term.length > 3) {
						$http.get('/api/search/productNames/' + request.term + "/5").then(function(data1){
								if(data1) {
									
									var productNames = data1.data
									angular.forEach(productNames, function(value, index) {
										data.push({
											label: value.value,
											value : value.value,
											category: 'Products'
										});
									});
									
									response(data);
								}
							});
					}                
				},
				select: function( event, ui ) {
					if(ui.item && ui.item.value && ui.item.value.length > 3) {
						$scope.productReport.name = ui.item.value;
						$scope.changeProduct();
					}				
				}
			},
			methods: {}
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
						$scope.companyProductNames.push(value.name);
					});
					$scope.productReport.name =  $scope.companyProductNames[0];
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
		$scope.loadReport();
    };

    productReportController.$inject = injectParams;
    app.register.controller('productReportController', productReportController);

});