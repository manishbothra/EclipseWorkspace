'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http', '$filter','$q'];

    var predictiveStatsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http, $filter, $q) {
		
		$scope.allData = {};
		$scope.tableHeader = [];
		$scope.tradeYears = ['2011','2012','2013','2014','2015','2016', '2017'];
		
		$scope.type="export";
		$scope.countryIdMap = {};
		$scope.productCodeNames = {};
		
		$scope.statsComparisontypes = ['Value', 'Quantity'];
		$scope.tagPlaceholder = 'Enter Product name or HS code';
		$scope.tags = [];
		$scope.compareParams = {
			predictionType: 'Value',
			tradeType: 'export',
			outputType:"GROUP_BY_TRADE_DATE",
			tradeYears:[2018,2019],
			yearTags:[2018,2019],
			productIds: []
		};
		
		$scope.getProductName = function(code) {
			return $scope.productCodeNames[code];
		};
				
		$scope.validateCompareParams = function () {
			return true;
		};
		
		$scope.predictStats = function () {
			console.log("compare stats called.");
			$scope.errorMessage = '';
			if(!$scope.validateCompareParams()) {
				return;
			}
			
			$scope.filterData = {};
			$scope.allData = {};
			$scope.filterData.parentId = 0;
			$scope.filterData['productIds'] = [];
			$scope.filterData.outputType = 'GROUP_BY_TRADE_DATE';
			$scope.filterData.tradeYears = [];
			$scope.filterData.tradeType = $scope.compareParams.tradeType;
			
			angular.forEach($scope.compareParams.productTags, function(tag, index) {
				if(tag.value) {
					$scope.filterData['productIds'].push(tag.value);
					$scope.productCodeNames[parseInt(tag.value)] = tag.label;
				}
			});
			
			
			if($scope.filterData.productIds.length == 0) {
				$scope.errorMessage = 'Please input a product';
				return;
			}
			$rootScope.loadingData = true;
			$scope.tableHeader = angular.copy($scope.tradeYears);
			
			angular.forEach($scope.compareParams.yearTags, function(tag, index) {
				if(tag.label) {
					$scope.filterData['tradeYears'].push(parseInt(tag.label));
					$scope.tableHeader.push(tag.label);
				} else {
					$scope.filterData['tradeYears'].push(tag);
					$scope.tableHeader.push(tag);
				}
			});
			
			var type = $scope.compareParams.predictionType.toLowerCase();
			dataService.predictTradeData($scope.compareParams.predictionType.toLowerCase(), $scope.filterData)
			.then(function(response){
				$scope.selectedPredictionType = $scope.compareParams.predictionType;
				$rootScope.loadingData = false;
				if(response.data && response.data.success) {
					$scope.processResponse(response.data, type);
				}
				
			})['finally'](function (){
				$scope.loadingData = false;
			});
						
		};		
		
		
		$scope.processResponse = function(data, type) {
			var current = data['current-values'] || [];
			var predictions = data['predictions'] || [];
			$scope.allData = {};
			console.log("predictions: ", predictions);
			$scope.tableTitle = $scope.selectedPredictionType + ' Prediction'
			angular.forEach(current, function(value, key) {
				$scope.allData[key] = {};		
				angular.forEach(value, function(obj, index) {
					$scope.allData[key]['' + obj.year] = obj;
				});	
			});
			
			angular.forEach(predictions, function(value, key) {
				angular.forEach(value, function(obj, index) {
					$scope.allData[key]['' + obj.year] = obj;
				});			
			});
			
			$scope.dataAvailable = Object.keys($scope.allData).length > 0;
			
			$scope.preparePredictionChart(type);
		};
		
		$scope.loadYearTags = function (query) {
			console.log("query.", query);
			 var deferred = $q.defer();
			 var results = [];
			 
			var filterd = $filter('filter')($scope.compareParams.tradeYears, query);
			deferred.resolve(filterd);
			
			return deferred.promise;
		};
		 
		
		$scope.loadTags = function (query) {
			console.log("query.", query);
			 var deferred = $q.defer();
			 var results = [];
			
			dataService.getProductsForAutocomplete(query, 10).then(function(data1){
				if(data1) {
					var productNames = data1.data;
					var codeLength = -1;
					angular.forEach($scope.compareParams.productTags, function(tag, index) {
						if(tag.value) {
							codeLength = ("" + tag.value).length;
						}
					});
					
					angular.forEach(productNames, function(value, index) {
						var pclen = ("" + value.id).length;
						if(codeLength == pclen || codeLength == -1) {
							results.push({
								label: value.id+" - "+value.value,
								value : value.id,
								category: 'Products'
							});
						}
					});
					deferred.resolve(results);
				}
			});
			return deferred.promise;
		};
		
		$scope.myOption = {
			
			options: {
				html: true,
				focusOpen: false,
				onlySelectValid: false,
				source: function (request, response) {
					var data = [];
					
					if(request.term && request.term.length > 1) {
					dataService.getProductsForAutocomplete(request.term, 10).then(function(data1){
						if(data1) {
							
							var productNames = data1.data
							angular.forEach(productNames, function(value, index) {
								var valueObj = {
									label: value.id+" - "+value.value,
									value : value.id,
									category: 'Products'
								};
								if($scope.selectedProductId == value.id) {
									$scope.selectedProduct = valueObj.label;
								}
								data.push(valueObj);
							});
							
							response(data);
						}
					});
				  }	
								   
				},
				select: function( event, ui ) {
					//alert(ui.item.value);
					if(ui.item && ui.item.value && ui.item.value>0) {
						$scope.$evalAsync(function() {
							$scope.compareParams.productName = ui.item.label;
							});
						$scope.compareParams.product = ui.item.value;
						
					}
				}
			},
			methods: {}
		};
		
		/*------------CHART RELATED------------*/
		
		$scope.setSelectedTab = function (value) {
			if('infographics' === value) {
				
			}
		};
		
		var chartCriteria = {
				tradeType : $scope.type,
				destinationLocationId: 699,
				years: [2015,2016,2017,2018,2019],
				itemCodes: []
			};
		
		
			$scope.yAxisDomain = [];
			
			$scope.yForceLowestForPredict = function() {
				console.log("ranjan malakar");
				return function() {
					return [$scope.yAxisDomain[0], $scope.yAxisDomain[$scope.yAxisDomain.length -1]];//$scope.yAxisDomain[0];
				}
			};
			
			$scope.yAxisDomainForPredict = function() {
				return function() {
					return [$scope.yAxisDomain[0], $scope.yAxisDomain[$scope.yAxisDomain.length -1]];
				}
			};
			
			$scope.predictionChart = 
				{options:{
					"chart": {
						"type": "lineChart",
						"height": 300,
						"width": 600,
						"margin": {
						  "top": 20,
						  "right": 20,
						  "bottom": 40,
						  "left": 100
						},
						"useInteractiveGuideline": true,
						"dispatch": {},
						"xAxis": {
						  "axisLabel": "Year"
						},
						"yAxis": {
						  "axisLabel": "Value (M USD)"
						},
						noData:"No Data Available."	
						
					},
					"title": {
						"enable": false,
						"text": "Market Trend Analysis",
						"css": {
						  "text-align": "center",
						  "color": "#333",
						  "font-weight":"bold",
						  "margin-bottom": "17px",
						  "text-decoration":"underline"
						}
					},
					"styles": {
						"classes": {
						  "with-3d-shadow": true,
						  "with-transitions": true,
						  "gallery": true
						},
						"css": {}
					}	
				}
			};
			$scope.nvChartConfig={ deepWatchData: true };
			
			$scope.$watch("predictionChart", function(newVal, oldVal) {
				if(newVal && newVal != oldVal) {
					$scope.$evalAsync(function(){			
						$scope.predictionChart.api.refresh();			
					});
				}
			}, true);
			
			$scope.preparePredictionChart = function(type) {
				var predictionChartData = [];
				
				angular.forEach($scope.allData, function(valueArr, key) {
					var chartDataObj = {};
					chartDataObj['key'] = key;
					chartDataObj['values'] = [];
					angular.forEach(valueArr, function(value, index) {
						var yValue = value.value.toFixed(2);
						if('quantity' === type) {
							yValue = value.qty;
						}
						chartDataObj['values'].push({x:parseInt(value.year), y:parseFloat(yValue)});
						$scope.yAxisDomain.push(parseFloat(yValue));
					});
					
					predictionChartData.push(chartDataObj);
				});
				
				if('quantity' === type) {
					$scope.predictionChart['options']['chart']['yAxis']['axisLabel'] = 'Quantity';
				} else {
					$scope.predictionChart['options']['chart']['yAxis']['axisLabel'] = 'Value (M USD)';
				}
				
				$scope.predictionChart['data']=predictionChartData;
				console.log("predictionChartData", predictionChartData);
				$scope.yAxisDomain = $filter('filter')($scope.yAxisDomain);
			};
		
			$scope.trendChart = {
				options: angular.copy($scope.predictionChart.options)
			};
			
			$scope.trendChart.options.title.text = 'Market Trend Analysis ';
			$scope.trendChartDataValues = {};
			$scope.trendChart.options.chart.yAxis.tickFormat = function(d) {
				 return d3.format('.02f')(d);
			};
			
			$scope.changeType = function(type) {				
				$scope.compareParams.tradeType = type;		
				if($scope.compareParams.tradeType == 'export') {
					$scope.compareParams.years = $scope.tradeYears['export'];
				} else {
					$scope.compareParams.years = $scope.tradeYears['import'];
				}				
			};
				
    };

    predictiveStatsController.$inject = injectParams;
    app.register.controller('predictiveStatsController', predictiveStatsController);

});