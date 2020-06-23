'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$filter','$q'];

    var compareStatsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $filter, $q) {
		$scope.url=$location.search();
		$scope.reportForm = {productType:'yourProducts'};
		
		$scope.type="export";
		$scope.anyDuration = {value: 'any', label:'Any'};
		$scope.selectedDuration = $scope.anyDuration;
		$scope.countryIdMap = {};
		
		$scope.statsComparisontypes = ['Products by Value', 'Countries by Value','Products by Quantity', 'Countries by Quantity' ];
		$scope.tagPlaceholder = 'Enter Product name or HS code';
		$scope.tags = [];
		$scope.compareParams = {
			type: $scope.statsComparisontypes[1],
			simplifiedType : 'country', //country,product
			tradeType: 'export',
			durations : [
				$scope.anyDuration,
				{value: '2016,2016', label:'Last Year'},
				{value: '2015,2016', label:'Last 2 Years'},
				{value: '2012,2016', label:'Last 5 Years'}
			],
			years:[2011,2012,2013,2014,2015,2016],
			comparionValue : 'value',
			selectedYear: 'any'
		};
		
		$scope.compareParams.selectedDuration = $scope.compareParams.durations[0].value;
		
		$scope.$watch('reportForm.productType', function(newVal, oldVal) {
			if(newVal) {
				if(newVal != 'yourProducts') {
					$scope.reportForm.selectedProduct = undefined;
				}
			}
		});
		
		$scope.filterData = {
			destinationCountry: 699,
			outputType : "GROUP_BY_TRADE_DATE_COUNTRY_WISE",
			parentId: 0,
			originCountry: 0,
			endYear: 0
		};
				
		$scope.$watch('compareParams', function(newVal, oldVal) {
			if (newVal != oldVal) {
				if('Products by Value' === newVal.type || 'Products by Quantity' === newVal.type) {
					$scope.compareParams.simplifiedType = 'product';
					if('Products by Quantity' === newVal.type) {
						$scope.compareParams.comparionValue = 'qty';
						$scope.tableTitle = 'Comparison of Products by Quantity';
					} else {
						$scope.compareParams.comparionValue = 'value';
						$scope.tableTitle = 'Comparison of Products by Value (in USD Million)';
					}
					
					if(newVal.country && newVal.productTags && newVal.productTags.length > 0) {
						$scope.enableCompareBtn = true;
					} else {
						$scope.enableCompareBtn = false;
					}
					
				} else {
					$scope.compareParams.simplifiedType = 'country';
					if('Countries by Quantity' === newVal.type) {
						$scope.compareParams.comparionValue = 'qty';
						$scope.tableTitle = 'Comparison of Countries by Quantity';
					} else {
						$scope.compareParams.comparionValue = 'value';
						$scope.tableTitle = 'Comparison of Countries by Value (in USD Million)';
					}
					
					if(newVal.product && newVal.countryTags && newVal.countryTags.length > 0) {
						$scope.enableCompareBtn = true;
					} else {
						$scope.enableCompareBtn = false;
					}
				}
			}
		}, true);
			
		$scope.validateCompareParams = function () {
			if($scope.compareParams.simplifiedType == 'product') {
				if($scope.compareParams.country && $scope.compareParams.productTags && $scope.compareParams.productTags.length > 0) {
					return true;
				}
			} else {
				if($scope.compareParams.product && $scope.compareParams.countryTags && $scope.compareParams.countryTags.length > 0) {
					return true;
				}
			}
			
			return false;
		};
		
		$scope.compareStats = function () {
			console.log("compare stats called.");
			if(!$scope.validateCompareParams()) {
				return;
			}
			
			$scope.loadingData = true;
			
			
			if( $scope.compareParams.selectedDuration != 'any') {
				$scope.filterData['duration'] = $scope.compareParams.selectedDuration;
			} else {
				$scope.filterData['duration'] = null;
			}
			
			if( $scope.compareParams.selectedYear != 'any') {
				$scope.filterData['endYear'] = $scope.compareParams.selectedYear;
			} else {
				$scope.filterData['duration'] = null;
			}
			
			if($scope.compareParams.simplifiedType == 'product') {
				$scope.filterData.parentId = 0;
				$scope.filterData.originCountry = $scope.compareParams.country;
				$scope.filterData['originCountries'] = null;
				$scope.filterData['productIds'] = [];
				$scope.filterData.outputType = 'GROUP_BY_TRADE_DATE';
				$scope.tableHeader = [];
				angular.forEach($scope.compareParams.productTags, function(tag, index) {
					if(tag.value) {
						$scope.filterData['productIds'].push(tag.value); 
						$scope.tableHeader.push(tag);
						$scope.filterData.parentId=tag.value;
					}
				});
				
			} else {
				$scope.filterData.parentId = $scope.compareParams.product;
				$scope.filterData.originCountry = 0;
				$scope.filterData['originCountries'] = [];
				$scope.filterData['productIds'] = null;
				$scope.filterData.outputType = 'GROUP_BY_TRADE_DATE_COUNTRY_WISE';
				$scope.tableHeader = [];
				angular.forEach($scope.compareParams.countryTags, function(tag, index) {
					if(tag.value) {
						$scope.filterData['originCountries'].push(tag.value); 
						$scope.tableHeader.push(tag);
					}
				});
			}
			
			dataService.filterPortData($scope.compareParams.tradeType, $scope.filterData).then(function(response){
				if(response.data && response.data.length > 0) {
					$scope.processResponse(response.data);
				}
			})['finally'](function (){
				$scope.loadingData = false;
			});
						
		};		
				
		$scope.processResponse = function(data) {
			$scope.products = data;
			$scope.resultMap = {};
			console.log("compare data: ", data);
			if($scope.compareParams.simplifiedType == 'product') {
				angular.forEach($scope.products, function(product, index) {
					var date = product.tradeDates[0].split("-")[0];
					if(!$scope.resultMap[date]) {
						$scope.resultMap[date] = {};
					}
					$scope.resultMap[date][product.id] = product[$scope.compareParams.comparionValue];				
				});
			} else {
				angular.forEach($scope.products, function(product, index) {
					var date = product.tradeDates[0].split("-")[0];
					if(!$scope.resultMap[date]) {
						$scope.resultMap[date] = {};
					}
					$scope.resultMap[date][product.originCountryId] = product[$scope.compareParams.comparionValue];				
				});
			}
			
			$scope.prepareTrendChart();
		};
	
	
		$scope.loadTags = function (query) {
			console.log("query.", query);
			 var deferred = $q.defer();
			 var results = [];
			 if($scope.compareParams.simplifiedType === 'country') {
				dataService.getLocationsAutocomplete(query, 10).then(function(data1){
					if(data1) {
						
						var locations = data1.data;
						angular.forEach(locations, function(value, index) {
							results.push({
								label: value.value,
								value : value.id,
								category: 'Locations'
							});
						});
						
						deferred.resolve(results);
						
					}
				});
			 } else {
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
			 }
			return deferred.promise;
		};
	
		$scope.autoCountryOptions = {
			options: {
				html: true,
				focusOpen: false,
				onlySelectValid: false,
				source: function (request, response) {
					var data = [];
					if(request.term && request.term.length >= 1) {
						dataService.getLocationsAutocomplete(request.term, 10).then(function(data1){
						if(data1) {
							
							var locations = data1.data
							angular.forEach(locations, function(value, index) {
								data.push({
									label: value.value,
									value : value.id,
									category: 'Locations'
								})
							});
							
							response(data);
						}
					});
					}                
				},
				select: function( event, ui ) {
					if(ui.item && ui.item.value) {
						$scope.$evalAsync(function() {
							$scope.compareParams.countryName = ui.item.label;
						});
						
					}	
					$scope.compareParams.country = ui.item.value;
				},
				change :function(event,ui) {
					if (ui.item==null) {
					$scope.$evalAsync(function() {
						$scope.compareParams.country = '';
					});
				 }
				}
			},
			methods: {}
			
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
			
	var chartCriteria = {
			tradeType : $scope.type,
			destinationLocationId: 699,
			years: [2015,2016,2017,2018,2019],
			itemCodes: [parseInt($scope.url.product)]
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
		
		$scope.trendChart = {
			options: angular.copy($scope.predictionChart.options)
		};
		
		$scope.trendChart.options.title.text = 'Market Trend Analysis ';
		$scope.trendChartDataValues = {};
		$scope.trendChart.options.chart.yAxis.tickFormat = function(d) {
			 return d3.format('.02f')(d);
		};
		
		
		$scope.trendChartSelectableOptions = [];
		$scope.$watch("selectedTrendChart", function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				$scope.trendChart['data']=newVal;
				$scope.$evalAsync(function(){			
					$scope.trendChart.api.refresh();			
				});
			}
		});
		
		$scope.prepareTrendChart = function() {
			// $scope.trendChart.options.title.text = 'Market Trend Analysis';
			if($scope.compareParams.comparionValue === 'value') {
				$scope.trendChart.options.chart.yAxis.axisLabel = 'Value (M USD)';
			} else {
				$scope.trendChart.options.chart.yAxis.axisLabel = 'Quantity';
			}
			var data = $scope.resultMap; //$scope.products; //;
			var chartData = [];
			angular.forEach($scope.tableHeader, function(header, key) {
				chartData.push({
					key: header.label,
					id: header.value,
					values: []
				});
					
			});
			
			$scope.trendChartSelectableOptions = [];
			angular.forEach(data, function(valueObj, date) { // data -{date: {countryId: value}}
				angular.forEach(chartData, function(chData, index) { 
					var yValue = valueObj[chData.id] || 0;
					chData.values.push({
						x:parseInt(date), y: parseFloat(yValue)
					});
				
				});
			});
			
			$scope.selectedTrendChart = chartData;
			//
		};
		
		$scope.changeType = function(type) {				
			$scope.compareParams.tradeType = type;		
			if($scope.compareParams.tradeType == 'export') {
				$scope.compareParams.years = $scope.tradeYears['export'];
			} else {
				$scope.compareParams.years = $scope.tradeYears['import'];
			}				
		};
		
		
		$scope.changeYear = function (value) {
			//console.log("filterData.age:: ", value);
			if('any' == value) {
				value = 0;
			}
			$scope.selectedDuration = 'any';
			$scope.filterData.duration = '';
			$scope.filterData.endYear = parseInt(value);
		};
		
		$scope.changeDuration = function (value) {
			if(!value || 'any'==value) {
				$scope.filterData.startYear = 0;
				$scope.filterData.endYear = 0;
			} else {
				var yrs = value.split(",");
				$scope.selectedYear = 'any';
				$scope.filterData.duration = '';
				$scope.filterData.startYear = yrs[0];
				$scope.filterData.endYear = yrs[1];
			}			
		};
			
			
		$scope.$watch("filterData", function(newVal, oldVal){
			//console.log("RM:Success:", newVal);
			if(newVal != oldVal && $scope.filterInitialized) {
				$scope.compareStats();
			}
		}, true);
		
		$scope.sortList = function(listname, property, value) {
			$scope[listname] = $filter('orderBy')($scope[listname], property, $scope[value]);
			$scope[value] = !$scope[value];
			$scope[value + 'Default'] = false;
			$scope.selectedSorting = value;
		};
		
		
    };

    compareStatsController.$inject = injectParams;
    app.register.controller('compareStatsController', compareStatsController);

});