'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$filter'];

    var priceAnalysisController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $filter) {
		$scope.searchCriteria = {};
		$scope.reportForm = {productType:'yourProducts'};
		$scope.selectedDuration = "last30days";
		$scope.selectedUrlDuration = "last30days";
		$scope.durationParam = '&duration=last30days';

		$scope.type="export";
		$scope.countryIdMap = {};
		
		
		$scope.$watch('reportForm.productType', function(newVal, oldVal) {
			if(newVal) {
				if(newVal != 'yourProducts') {
					$scope.reportForm.selectedProduct = undefined;
				}
			}
		});
		$scope.$watch('reportForm', function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				if ($scope.reportForm.selectedProduct) {
					$scope.searchCriteria.product = $scope.reportForm.selectedProduct.code;
					$scope.selectedProductName = $scope.reportForm.selectedProduct.name;
				}
			}
		}, true);
		
		
		$scope.$watch('searchCriteria', function(newVal, oldVal) {
			$scope.loadData();
		}, true);
		
	
		$scope.loadData = function() {	
			$scope.type=$scope.searchCriteria.type||"export";	
			$scope.countryIdMap = {};
			$scope.sliderInitialized = false;
			$scope.filterInitialized = false;
			$scope.showOPortHeader = true;
			$scope.showDPortHeader = true;
			$scope.showCountryHeader = false;
			$scope.pageSize = 50;
			$scope.pageIndex = 0;
			$scope.currentPage = 1;
			$scope.totalResults = 0;
			 /*  filter for Product  */
			$scope.selectedOPort = "any";
			$scope.selectedDPort = "any";
			var ldate = moment().subtract('days',30).format("MM/DD/YYYY");
			$scope.calendarDateRange = ldate + "-" + moment().format("MM/DD/YYYY");
			
			if(angular.equals($scope.searchCriteria, {})) {
				return;
			}
			
			$scope.currentDemandCriteria = {};

			var	productName = '';
			if($scope.searchCriteria.duration) {
				$scope.selectedUrlDuration = $scope.searchCriteria.duration;
				$scope.currentDemandCriteria['duration'] = $scope.searchCriteria.duration;
			} else if($scope.searchCriteria.sd && $scope.searchCriteria.ed) {
				$scope.selectedUrlDuration = $scope.searchCriteria.sd + '/' + $scope.searchCriteria.ed;
				productName = '/undefined';
				$scope.calendarDateRange = moment($scope.searchCriteria.sd).format("MM/DD/YYYY") + "-" + moment($scope.searchCriteria.ed).format("MM/DD/YYYY");
				$scope.currentDemandCriteria['startDate'] = moment($scope.searchCriteria.sd).format("MM/DD/YYYY");
				$scope.currentDemandCriteria['endDate'] = moment($scope.searchCriteria.ed).format("MM/DD/YYYY");
			}
			
			
			$scope.currentDemandCriteria['type'] = $scope.type;
			$scope.currentDemandCriteria['destinationCountry'] = $scope.searchCriteria.country;
			$scope.currentDemandCriteria['productCode'] = parseInt($scope.searchCriteria.product);
			$scope.currentDemandCriteria['filterRequired'] = true;
			$scope.currentDemandCriteria['pageSize'] = $scope.pageSize;
			$scope.currentDemandCriteria['pageIndex'] = $scope.currentPage;
			$scope.currentDemandCriteria['duration'] = $scope.selectedUrlDuration;
			$scope.currentDemandCriteria['logAction']=true;
			
			
			if($scope.searchCriteria.product && !($scope.searchCriteria.oport || $scope.searchCriteria.dport)){
				$scope.filterData = {
					destinationCountry: 699,
					outputType : "GROUP_BY_TRADE_DATE_PORT_DATA_ALL_DETAILS",
					parentId: $scope.searchCriteria.product,
					originCountry: 0,
					pageIndex:0,
					pageSize:$scope.pageSize
				};
				$scope.selectedProductId = $scope.searchCriteria.product;
			} else if($scope.searchCriteria.oport){
				 $scope.filterData = {
					destinationCountry: 699,
					outputType : "GROUP_BY_TRADE_DATE_PORT_DATA_ALL_DETAILS",
					parentId: $scope.searchCriteria.product,
					originPortName: decodeURI($scope.searchCriteria.oport),
					pageIndex:0,
					pageSize:$scope.pageSize
				};
				
				$scope.selectedOPort = decodeURI($scope.searchCriteria.oport);
				$scope.searchCriteria.oport = decodeURI($scope.searchCriteria.oport);
				$scope.currentDemandCriteria['oport'] = $scope.searchCriteria.oport;
				
			} else if($scope.searchCriteria.dport){
				 $scope.filterData = {
					destinationCountry: 699,
					outputType : "GROUP_BY_TRADE_DATE_PORT_DATA_ALL_DETAILS",
					parentId: $scope.searchCriteria.product,
					destinationPortName: decodeURI($scope.searchCriteria.dport),
					pageIndex:0,
					pageSize:$scope.pageSize
				};
				$scope.selectedDPort = decodeURI($scope.searchCriteria.dport);
				
				$scope.searchCriteria.dport = decodeURI($scope.searchCriteria.dport);
				$scope.currentDemandCriteria['dport'] = $scope.searchCriteria.dport;
			}
			
			if($scope.searchCriteria.name) {
				$scope.searchCriteria.name = decodeURI($scope.searchCriteria.name);
				$scope.selectedProduct = $scope.searchCriteria.product + " - " + $scope.searchCriteria.name;
			}
			
			$rootScope.loadingData = true;
			dataService.getCurrentDemands($scope.type, $scope.currentDemandCriteria)
			.then(function(data1){
					$scope.products=data1.stats;
					$scope.prepareProductCharts(data1.stats);
					if(data1.filterData && data1.filtersAllowed) {
						$scope.initializeFilter(data1.filterData, data1.filtersAllowed);
					} else {
						$rootScope.loadingData = false;
					}
					 $scope.mainTitle = $scope.type.toUpperCase() +' price details of ' + $scope.selectedProductName;
					 $scope.totalResults = data1.filterData.totalResults;
					 
					 $scope.uniqueProducts = [{code:$scope.searchCriteria.product, label: 'All', display:$scope.searchCriteria.product + ' - All'} ];
						$scope.uniquePorts = ['All'];
						if($scope.products && $scope.products.length > 0) {
							angular.forEach($scope.products, function(val, idx) {
								var ad = $filter('filter')($scope.uniqueProducts, {name:val.description})[0];
								if(!ad) {
									$scope.uniqueProducts.push({label:val.description.trim(), code:val.id});
								}
								if($scope.uniquePorts.indexOf(val.oport) < 0) {
									$scope.uniquePorts.push(val.oport);
								}
							});							
						}
						$scope.loadMarketTrendData();
				})['finally'](function (){
					$rootScope.loadingData = false;
				});
				
			$scope.disableLocationFilter = false; 	 
			
		};
		
		$scope.loadCompanyProducts=function(){
			$scope.loading = true;
			authService.getControlPanelDetails().then(function(response){
				$scope.comppro=response.data[0].companyProducts.products;
				$scope.reportForm.selectedProduct=$scope.comppro[0];
				if($scope.comppro.length>0){
					$scope.searchCriteria.product =  $scope.reportForm.selectedProduct.code;
					$scope.selectedProductName = $scope.reportForm.selectedProduct.name;
				} else{
					$scope.noProductAdded=true;
				}
			})['finally'](function() {
				$scope.loading = false;
			});
		};
		
	$scope.searchformProduct = function(isValid, id) {
		$scope.submitted = 'True';
		if (isValid) {
			$scope.busy = true;
			$scope.showData(null, 'product', '', id);
		}
	};
	
	$scope.getDataForAutocomplete = function(key) {
		var data = [];
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
							var productNames = data1.data;
							angular.forEach(productNames, function(value, index) {
								var valueObj = {
									value: value.id+" - "+value.value,
									label: value.id+" - "+value.value,
									code : value.id,
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
				if(ui.item && ui.item.code && ui.item.code>0) {
					$scope.$evalAsync(function() {
						$scope.selectedProduct = ui.item.label;
						});
					$scope.selectedProductName = ui.item.label;
					$scope.searchformProduct(true, ui.item.code);
				}
			}
		},
		methods: {}
	};
	 
	/*------------CHART RELATED------------*/
			
	var chartCountryOption = {
		"type": "PieChart", 
		"options": {
		   backgroundColor: {fill: 'transparent'},
		  'width':700,
		  'height':380
		},
		  cssStyle: "height:100%; width:100%;backgroundColor: {fill:transparent} ",
		  data: {}
	};
    
    var chartCountryOption1 = {
    		
    		"options": {
    		   backgroundColor: {fill: 'transparent'},
    		  'width':700,
    		  'height':380,
    		  hAxis: {
    	            slantedText: 'true',
    	        },
    	        vAxis: {
    	          }
    		},
    		cssStyle: "height:100%; width:100%;backgroundColor: {fill:transparent} ",
    		data: {}
    	};
	
	var exportChartCountryOption = angular.copy(chartCountryOption);
	
	var importChartCountryOption = angular.copy(chartCountryOption1);
	
	$scope.exportChartCountry = exportChartCountryOption;
	$scope.importChartCountry =importChartCountryOption;
	
	 $scope.exportChartCountry.type="PieChart";
	 $scope.importChartCountry.type="ColumnChart";
	
	$scope.pieChart = {
		options :{
		  "chart": {
			"type": "pieChart",
			"height": 400,
			"duration": 503,
			"labelSunbeamLayout": true,
			x: function(d){
				var name = d.key;
				return name;
			},
			y: function(d){return d.y;},
			"legend": {
			  "margin": {
				"top": 15,
				"right": 5,
				"bottom": 5,
				"left": 20
			  }
			},
			"dispatch": {
				renderEnd: function(e){ 
				}
			},
			"width": 700,
			"cornerRadius": 0,
			"donutRatio": 0.5,
			"labelsOutside": false,
			"donut": false,
			"growOnHover": true,
			"pieLabelsOutside": false,
			"donutLabelsOutside": false,
			"margin": {
			  "top": 5,
			  "right": 20,
			  "bottom": 20,
			  "left": 20
			},
			"labelType": "percent",
			"noData": 'No data to show',
			"showLegend": true,
			"legendPosition": "top",
			"tooltips": true
		  },
		  "title": {
			"enable": true,
			"text": "",
			"className": "h4",
			"css": {
				"width" : "100%",
			  "textAlign": "center",
			  "font-weight" : "bold"
			}
		  },
		  "styles": {
			"classes": {
			  "with-3d-shadow": true,
			  "with-transitions": true,
			  "gallery": false
			},
			"css": {}
		  }
		}	
	};
	
	$scope.setSelectedTab = function (value) {
		if('infographics' === value) {
			if(!$scope.showPie) {
				setTimeout(function(){
					if($scope.pieChart.api) {
						$scope.pieChart.api.refresh();
					}
				}, 500);	
			}
					
			$scope.showPie = true;
		}
	};

	$scope.$watch("dataChangeForPieChart", function(newVal, oldVal) {
		if(newVal && newVal != oldVal) {			
			$scope.pieChart['data'] = newVal;		
			$scope.$evalAsync(function(){	
				if($scope.pieChart.api) {
					$scope.pieChart.api.refresh();	
				}				
			});
		}
	});
	
	$scope.$watch("dataChangeForTopPortChart", function(newVal, oldVal) {
		if(newVal && newVal != oldVal) {			
			$scope.topPortChart['data'] = newVal;		
			$scope.$evalAsync(function(){	
				if($scope.topPortChart.api) {
					$scope.topPortChart.api.refresh();	
				}				
			});
		}
	});
		
	$scope.topPortChart = angular.copy($scope.pieChart);
	$scope.topPortChart.options.title.text = 'Top Origin Ports - by value in Million';
	$scope.prepareTopPortChart = function(data) {
		var key = 'oport';
		if($scope.searchCriteria.oport) {
			$scope.topPortChart.options.title.text = 'Top Origin Ports - by value in Million';
			key = 'oport';
		} else if ($scope.searchCriteria.dport) {
			$scope.topPortChart.options.title.text = 'Top Destination Ports - by value in Million';
			key = 'dport';
		}
		
		var nvPieData = [];
		angular.forEach(data, function(value, index) {
			nvPieData.push({key: value[key], y:value.value});
		});
		
		$scope.dataChangeForTopPortChart = nvPieData;
	};
	
	$scope.prepareProductCharts = function(data) {
	
		importChartCountryOption.options.title = 'Top products - by value in Million';
		$scope.pieChart.options.title.text = 'Top products - by value in Million';
		
		var rData = {"cols": [
				{id: "t", label: "Product", type: "string"},
				{id: "s", label: "Values", type: "number"}
			], "rows": []
		};
		
		data = $filter('orderBy')(data, 'value', true);
		$scope.count=1;
		
		var nvPieData = [];
		angular.forEach(data, function(value, index) {
			if(value.value > 0 && $scope.count < 11) {
				$scope.count = $scope.count + 1;
				rData.rows.push(
					{
						c: [
								{v: value.name},
								{v: value.value}
							]
					}	
				);		
				nvPieData.push({key: value.name, y:value.value});
			}
			
		
		});
		
		$scope.importChartCountry.data = rData;
		$scope.dataChangeForPieChart = nvPieData;
	};
	
	$scope.prepareCountryCharts = function(data) {
		
		importChartCountryOption.options.title = 'Top '+$scope.type+' countries'+' - by value in Million';
		$scope.pieChart.options.title.text = 'Top '+$scope.type+' countries'+' - by value in Million';
		
		data = $filter('orderBy')(data, 'value', true);
		var rData = {"cols": [
				{id: "t", label: "Country", type: "string"},
				{id: "s", label: "Values", type: "number"}
			], "rows": []
		};
		$scope.count=1;
		var nvPieData = [];
		angular.forEach(data, function(value, index) {
			if(value.value > 0 && $scope.count < 11) {
				$scope.count = $scope.count + 1;
				rData.rows.push(
					{
						c: [
								{v: value.country},
								{v: value.value}
							]
					}	
				);		
				nvPieData.push({key: value.country, y:value.value});
			}
		});
		
		$scope.importChartCountry.data = rData;
		$scope.dataChangeForPieChart = nvPieData;
		
	};
	
	var chartCriteria = {
			tradeType : $scope.type,
			destinationLocationId: 699,
			years: [2015,2016,2017,2018,2019],
			itemCodes: [parseInt($scope.searchCriteria.product)]
		};
	
	
		
	$scope.loadMarketTrendData = function (selectedProduct) {
		
		if(!$scope.uniqueProducts && $scope.uniqueProducts.length < 1) {
			return;
		}
		
		var trendCriteria = {
			outputType: 'GROUP_BY_TRADE_DATE_PORT_DATA',
			duration: $scope.selectedDuration
		};
		
		$scope.selectedPriceTrendProduct = selectedProduct || $scope.uniqueProducts[0];
		
		if ($scope.searchCriteria.product || $scope.searchCriteria.productId) {
			trendCriteria['parentId'] = $scope.searchCriteria.product || $scope.searchCriteria.productId;
			if($scope.selectedPriceTrendProduct.label && 'all' != $scope.selectedPriceTrendProduct.label.toLowerCase()) {
				trendCriteria['productNames'] = [$scope.selectedPriceTrendProduct.label];
			}
		}
		
		$scope.trendFilterSelectionLabel = 'Origin Port: ';
		if($scope.searchCriteria.oport) {
			trendCriteria['originPortName'] = $scope.searchCriteria.oport;
			$scope.trendFilterSelectionLabel = 'Destination Port: ';
		} else if($scope.trendChartSelectedOption.oport && 'all' != $scope.trendChartSelectedOption.oport.toLowerCase()){
			trendCriteria['originPortName'] = $scope.trendChartSelectedOption.oport;
		} else {
			trendCriteria['originPortName'] = null;
		}
		
		if($scope.searchCriteria.dport) {
			trendCriteria['destinationPortName'] = $scope.searchCriteria.dport;
			$scope.trendFilterSelectionLabel = 'Origin Port: ';
		} else if($scope.trendChartSelectedOption.dport && 'all' != $scope.trendChartSelectedOption.dport.toLowerCase()){
			trendCriteria['destinationPortName'] = $scope.trendChartSelectedOption.dport;
		}  else {
			trendCriteria['destinationPortName'] = null;
		}
		
		
		trendCriteria = angular.copy(trendCriteria);
		trendCriteria['outputType'] = 'TRADE_PORT_PRICE_TREND';//'GROUP_BY_TRADE_DATE_PORT_DATA_ALL_DETAILS';
		dataService.getDailyDemandTrend($scope.type,trendCriteria)
		.then(function(resp){
			$scope.prepareTrendChart(resp.data);
		});
		
	};	
		
		$scope.yAxisDomain = [];
		
		$scope.yForceLowestForPredict = function() {
			console.log("ranjan malakar");
			return function() {
				return [$scope.yAxisDomain[0], $scope.yAxisDomain[$scope.yAxisDomain.length -1]];//$scope.yAxisDomain[0];
			};
		};
		
		$scope.yAxisDomainForPredict = function() {
			return function() {
				return [$scope.yAxisDomain[0], $scope.yAxisDomain[$scope.yAxisDomain.length -1]];
			};
		};
		
		$scope.predictionChart = 
			{options:{
				"chart": {
					"type": "lineChart",
					"forceY": 0,
					"height": 300,
					"width": 600,
					"margin": {
					  "top": 20,
					  "right": 20,
					  "bottom": 40,
					  "left": 140
					},
					"useInteractiveGuideline": true,
					"dispatch": {},
					"xAxis": {
					  "axisLabel": "Date",
						  "showMaxMin" : false
					},
					"yAxis": {
					  "axisLabel": "Value (INR in Million)",
					  "axisLabelDistance": 20
					},
					noData:"No Data Available."	
					
				},
				"title": {
					"enable": true,
					"text": "Market Prediction",
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
		$scope.trendChart.options.chart.x = function(d){ 
			return d['x']; 
		};
		$scope.trendChart.options.chart.y = function(d){ 
			return d['y']; 
		};
		$scope.trendChart.options.chart.xAxis.tickFormat = function(d) {
			return d3.time.format('%m/%d/%y')(new Date(d));
		};
		
		
		$scope.trendChartSelectableOptions = [];
		var keyValue = 'Value';
		var keyQty = 'Quantity';
		var keyPrice = 'Price';
				
		$scope.trendChartSelectedOption = {
			product:'',
			oport:'All',
			dport:'All',
			key: keyValue
		};
		
		$scope.$watch('repaintChart', function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				$scope.paintPriceTrendChart($scope.trendChartSelectedOption);
			}
		});
		
		$scope.paintPriceTrendChart = function(newVal) {
			
				var product=newVal.product.label;
				var oport = newVal.oport;
				if(oport != 'All') {
					oport = oport.toLowerCase();
				}
				var key = keyPrice; //newVal.key;
				var selectedChartObj;
				$scope.trendChart.options.title.text = '';
				
				/*
				if(newVal.product.ports.indexOf(oport) == -1) {
					oport = "All";
					newVal.oport = "All";
				}*/
				
				if($scope.trendChartDataValues[product] && $scope.trendChartDataValues[product][oport]) {
					if($scope.trendChartDataValues[product][oport] && $scope.trendChartDataValues[product][oport][key]) {
						selectedChartObj = $scope.trendChartDataValues[product][oport][key].data;
						//var chartXAxisValues = $scope.trendChartDataValues[product][oport][key].xAxisValues;
						var titlePart = '';
						if($scope.type.toUpperCase() === 'EXPORT') {
							titlePart = 'Export from ' + ($scope.searchCriteria.oport || $scope.searchCriteria.dport || 'All Ports');
						} else if($scope.type.toUpperCase() === 'IMPORT') {
							titlePart = 'Import to ' + ($scope.searchCriteria.oport || $scope.searchCriteria.dport || 'All Ports');
						}
						$scope.trendChart.options.title.text = ' Price Trend Analysis - ' + titlePart;
						//$scope.trendChart.options.chart.xAxis['tickValues'] = chartXAxisValues || [] //will use if required.
					}
					$scope.trendChart['data']=selectedChartObj;
					console.log("trendChartData", selectedChartObj);
					$scope.selectedTrendChartKey = product;
					if(keyValue == key) {
						$scope.trendChart.options.chart.yAxis.axisLabel = 'Value (INR in Million)';
					} else if (keyQty == key) {
						$scope.trendChart.options.chart.yAxis.axisLabel = 'Quantity';
					} else if (keyPrice == key) {
						$scope.trendChart.options.chart.yAxis.axisLabel = 'Price (INR)';
					}
					
					$scope.$evalAsync(function(){			
						$scope.trendChart.api.refresh();			
					});
					
					console.log("selected: ", product, $scope.trendChart['data']);					
				} else {
					$scope.trendChartDataValues = {};
					$scope.trendChart['data']=[];
					
					$scope.$evalAsync(function(){			
						$scope.trendChart.api.refresh();			
					});
				}
				
				
		};
		
		$scope.$watch("trendChartSelectedOption", function(newVal, oldVal) {
			if(newVal && newVal.product && newVal != oldVal) {
				console.log('trendchartselection**************');
				//$scope.loadMarketTrendData(newVal.product);
			}
		}, true);
		
		$scope.setNewChartSelection=function() {
			if($scope.trendChartSelectedOption.product) {
				console.log('trendchartselection manual**************');
				$scope.loadMarketTrendData($scope.trendChartSelectedOption.product);
			}
		};
		
		 
		$scope.prepareTrendChart = function(dataPerPort) {
			var dataForAll, dataPortwise;
			$scope.trendChartSelectableOptions = {
				products:[],
				oport:['All'],
				keys:[keyValue, keyQty, keyPrice]
			};
			
			if(dataPerPort) {				
				angular.forEach(dataPerPort, function(value, key) { //product<port<date,data>,
					var productOptions = {label: key, ports: []};
					$scope.trendChartSelectableOptions['products'].push(productOptions);
					angular.forEach(value, function(valuePortwise, key2) { //oport<date,data>
						var chartDataObj = {};
						chartDataObj[keyValue] = {};
						chartDataObj[keyQty] = {};
						chartDataObj[keyPrice] = {};
						
						chartDataObj[keyValue]['key'] = key;
						chartDataObj[keyValue]['values'] = [];
						chartDataObj[keyQty]['key'] = key;
						chartDataObj[keyQty]['values'] = [];
						chartDataObj[keyPrice]['key'] = key;
						chartDataObj[keyPrice]['values'] = [];
						
						var maxYValue = 0;
						var oOpIndex = productOptions['ports'].indexOf(key2);
						if(oOpIndex == -1) {
							productOptions['ports'].push(key2);
						}
						
						if(!$scope.trendChartDataValues[key]) {
							$scope.trendChartDataValues[key] = {};
						}
						
						$scope.trendChartDataValues[key][key2] = {};
						$scope.trendChartDataValues[key][key2][keyValue] = {};
						$scope.trendChartDataValues[key][key2][keyQty] = {};
						$scope.trendChartDataValues[key][key2][keyPrice] = {};
						
						$scope.trendChartDataValues[key][key2][keyValue]['data'] = [];
						$scope.trendChartDataValues[key][key2][keyValue]['xAxisValues'] = [];
						$scope.trendChartDataValues[key][key2][keyQty]['data'] = [];
						$scope.trendChartDataValues[key][key2][keyQty]['xAxisValues'] = [];
						$scope.trendChartDataValues[key][key2][keyPrice]['data'] = [];
						$scope.trendChartDataValues[key][key2][keyPrice]['xAxisValues'] = [];
						
						angular.forEach(valuePortwise, function(value, index) {//<date,data>
							
							var yValue = value.value.toFixed(2);
							var dateParts = value.date.split("-");
							var date = new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
							
							var index = $scope.trendChartDataValues[key][key2][keyValue]['xAxisValues'].indexOf(value.date);
							if (index == -1) {
								$scope.trendChartDataValues[key][key2][keyValue]['xAxisValues'].push(date);
								$scope.trendChartDataValues[key][key2][keyQty]['xAxisValues'].push(date);
								$scope.trendChartDataValues[key][key2][keyPrice]['xAxisValues'].push(date);
							}
							
							chartDataObj[keyValue]['values'].push({x:date, y: parseFloat(yValue)});
							chartDataObj[keyQty]['values'].push({x:date, y: parseFloat(value.qty)});
							var price = 0;
							if(value.qty>0) {
								price = (value.value * 1000000)/value.qty;
							}
							chartDataObj[keyPrice]['values'].push({x:date, y: parseFloat(price)});
							
							if(yValue > maxYValue) {
								maxYValue = yValue;
							}
						});
						chartDataObj[keyValue]['values'] = $filter('orderBy')(chartDataObj[keyValue]['values'], 'x');
						chartDataObj[keyQty]['values'] = $filter('orderBy')(chartDataObj[keyQty]['values'], 'x');
						chartDataObj[keyPrice]['values'] = $filter('orderBy')(chartDataObj[keyPrice]['values'], 'x');
						
						$scope.trendChartDataValues[key][key2][keyValue]['data'].push(chartDataObj[keyValue]);
						$scope.trendChartDataValues[key][key2][keyQty]['data'].push(chartDataObj[keyQty]);
						$scope.trendChartDataValues[key][key2][keyPrice]['data'].push(chartDataObj[keyPrice]);
						
						$scope.trendChartDataValues[key][key2]['maxY'] = maxYValue;
					});
					
					var allPortOption = productOptions['ports'][0];
					productOptions['ports'].shift();
					productOptions['ports']= $filter('orderBy')(productOptions['ports']);
					productOptions['ports'].unshift(allPortOption);
				});
			}
			
			if($scope.trendChartSelectableOptions.products.length > 0 && !$scope.selectedPriceTrendProduct) {	
				var allOption = $scope.trendChartSelectableOptions.products[0];
				$scope.trendChartSelectableOptions.products.shift();
 				$scope.trendChartSelectableOptions.products = $filter('orderBy')($scope.trendChartSelectableOptions.products, 'label');
				$scope.trendChartSelectableOptions.products.unshift(allOption);
 				$scope.trendChartSelectedOption.product = $scope.trendChartSelectableOptions.products[0];
				
				
			}else {
				$scope.trendChartSelectedOption.product = $scope.selectedPriceTrendProduct;
			}
			//
			$scope.trendChartSelectableOptions.product = $scope.selectedPriceTrendProduct;
			//$scope.paintPriceTrendChart($scope.trendChartSelectableOptions);
			$scope.repaintChart = $scope.type + "-" + $scope.trendChartSelectedOption.product.code + "-" + $scope.trendChartSelectedOption.oport + "-" + $scope.trendChartSelectedOption.dport;
			
			//
		};
		
			
	   $scope.filterLocation = function(location) {
			
		   if(location.country && ($scope.region =='' || location.regionName == $scope.region)) {
				return true;
			}
			
			if(location.port && ($scope.country =='' || location.country == $scope.country)) {
				return true;
			}
			
			return false;
		};
		
		$scope.filterSearch = function (newPageIndex) {
			$rootScope.loadingData = true;
			$scope.mainTitle = $scope.type.toUpperCase() +' price details of ' + $scope.selectedProductName;
			var payload = angular.copy($scope.filterData);
			payload['pageIndex'] = 0;
			if(newPageIndex) {
				payload['pageIndex'] = newPageIndex;
			}
			
			dataService.getFilteredPortDataDetailed($scope.type, payload, 'true')
			.then(function(data){
					$scope.products = data.stats;
					$scope.showOPortHeader = true;
					$scope.showDPortHeader = true;
					$scope.showCountryHeader = false;
					if(data.filterData) {
						$scope.totalResults = data.filterData.totalResults;
					}
					$scope.prepareProductCharts($scope.products);
					$scope.uniqueProducts = [{code:$scope.searchCriteria.product, label: 'All', display:$scope.searchCriteria.product + ' - All'} ];
					$scope.uniquePorts = ['All'];
					if($scope.products && $scope.products.length > 0) {
						if($scope.searchCriteria.product && !isNaN($scope.searchCriteria.product) && $scope.searchCriteria.product.length == 8) {
							//$scope.uniqueProducts.push({});
						}
						angular.forEach($scope.products, function(val, idx) {
							var ad = $filter('filter')($scope.uniqueProducts, {name:val.description})[0];
							if(!ad) {
								$scope.uniqueProducts.push({label:val.description.trim(), code:val.id});
							}
							if($scope.uniquePorts.indexOf(val.oport) < 0) {
								$scope.uniquePorts.push(val.oport);
							}
						});
						$scope.loadMarketTrendData();
					}
				})['finally'](function (){
					$rootScope.loadingData = false;
				});
			if(!newPageIndex) {
				//$scope.loadMarketTrendData();
			}
			
		};
		
		$scope.setSliderValue = function(key, min, max) {
			$scope.$evalAsync( function() {
				$scope.filterData[ 'min' + key ]= min;
				$scope.filterData[ 'max' + key ] = max;
			} );
			
		};

		$scope.qtyValueRangeFilter = function(item) {
			if(item.qty < $scope.filterData.minQty || item.qty > $scope.filterData.maxQty) {
				return false;
			}
			if(item.value < $scope.filterData.minValue || item.value > $scope.filterData.maxValue) {
				return false;
			}
			return true;
		};
		
		
		$scope.changeCountry = function(value) {
			$scope.country = value;
			if(!value) {
				value = {id:0};
				$scope.filterData.regionName = $scope.region;
			} else {
				$scope.filterData.displayCountry = null;
				$scope.region = value.regionName;
				$scope.filterData.regionName = null;
			}
			
			$scope.filterData.displayRegion = null;
			$scope.filterData.originCountry = parseInt(value.id);
		};
			
		$scope.changeRegion = function(region) {
			$scope.region = region;
			if('' == region) {
				region = 'All';
			}
			$scope.country = '';
		
			$scope.filterData.displayCountry = null;
			$scope.filterData.originCountry = null;
			$scope.filterData.regionName = region;
		};
		
		$scope.changeType = function(type) {
			$scope.type = type;
			$scope.filterSearch();
		};
		
		$scope.changePort = function(type, value) {
			if(!value || 'any'=== value) {
				value='';
			}
			if('origin' === type) {
				$scope.filterData.originPortName = value.trim();
			} else {
				$scope.filterData.destinationPortName = value.trim();
			}
			
		};
		
		var DATE_FORMAT_SLASH = "MM/DD/YYYY";
		var DATE_FORMAT_DASH = "YYYY-MM-DD";
		$scope.dateRangeChanged = function(fromDate, toDate) {
			console.log("date range changed: ", fromDate, toDate);
			var dateRange = fromDate.format(DATE_FORMAT_SLASH) + '-' + toDate.format(DATE_FORMAT_SLASH);
			$scope.durationParam = '&sd=' + fromDate.format(DATE_FORMAT_DASH) + '&ed=' + toDate.format(DATE_FORMAT_DASH);
			$scope.searchCriteriaFriendlyDuration = fromDate.format(DATE_FORMAT_DASH) + '/' + toDate.format(DATE_FORMAT_DASH);
			$scope.changeDuration(dateRange);
		};
		
		$scope.changeDuration = function (value) {
			if(!value || 'any'==value) {
				$scope.filterData.startYear = 0;
				$scope.filterData.endYear = 0;
			} 
			else {
				$scope.filterData.duration = value;
				$scope.filterData.outputTypeValue = 2;
				$scope.filterData.customDateRange = true;
				$scope.selectedYear = 'any';
			}
			
			$scope.selectedDuration = $scope.filterData.duration;		
		};
		
		
		
		$scope.sliderInitialized = false;
		var qtyRangeSlider;
		
		$scope.initializeFilter = function (filterData, filtersAllowed) {
			
			$scope.filterDisableMessage = 'Please subscribe to enable this filter';
			$scope.filterDisableMessage1 = 'Please regsiter to enable this filter';
			
			$scope.filterRanges = filterData;
			$scope.productsFilter = $scope.filterRanges.products || {};
			if(!$scope.searchCriteriaCountryName) {
				$scope.country = '';
				$scope.region = '';
			} else {
				$scope.$evalAsync(function(){
					$scope.country = $filter('filter')($scope.filterRanges.country, {country: $scope.searchCriteriaCountryName})[0]; //{id: $scope.countryIdMap[$scope.searchCriteriaCountryName]}
					$scope.region = $filter('filter')($scope.filterRanges.regions, $scope.country.regionName)[0];
				});
			}
			
			$scope.destinationPort = 'any';
			$scope.originPort = 'any';
			
			var years = $scope.filterRanges.year;
			$scope.filterRanges.durations = [
				{value: 'yesterday', label:'Last Day'},
				{value: 'last7days', label:'Last 7 days'},
				{value: 'last30days', label:'Last 1 month'}
			];
			
			$scope.selectedYear = $scope.filterRanges.selectedYear || 'any';
			if($scope.filterRanges.selectedYear) {
				$scope.selectedDuration = $scope.filterRanges.selectedYear+','+$scope.filterRanges.selectedYear;
			}
			
			console.log($scope.filterRanges);
			
			var searchFilters = filtersAllowed || {};
			$scope.allowedFilters = {};
			angular.forEach(searchFilters, function(value,key) {
				var name = value['name'];
				$scope.allowedFilters[name] = true;
			});		
			
			var optionSlider = {
				minValue: 1,
				maxValue: 8,
				options: {
						ceil: 10,
						floor: 0,
						draggableRange: true
					}
			};
			
			var optionQty = angular.copy(optionSlider);
			optionQty.options['onEnd'] = function(sliderId, modelValue, highValue) {
					
				if($scope.filterInitialized) {
					$scope.setSliderValue('Qty', modelValue, highValue);
				}
			};
			
			
			var optionValue = angular.copy(optionSlider);
			optionValue.options['onEnd'] = function(sliderId, modelValue, highValue) {
					
				if($scope.filterInitialized) {
					$scope.setSliderValue('Value', modelValue, highValue);
				}
			};
			
			optionValue.options['translate'] = function (value) {
					return 'Rs. ' + value + " M";
				};
			
			optionQty.minValue = $scope.filterRanges.minQty;
			optionQty.maxValue = $scope.filterRanges.maxQty;
			optionQty.options.ceil = $scope.filterRanges.maxQty;
			optionQty.options.floor = $scope.filterRanges.minQty;
			optionQty.disable = !$scope.allowedFilters['quantity'];
			
			optionValue.minValue = $scope.filterRanges.minValue;
			optionValue.maxValue = $scope.filterRanges.maxValue;
			optionValue.options.ceil = $scope.filterRanges.maxValue;
			optionValue.options.floor = $scope.filterRanges.minValue;
			optionValue.disable = !$scope.allowedFilters['value'];
			
			$scope.filterRanges['quantity']=optionQty;
			$scope.filterRanges['value']=optionValue;
							
			$scope.filterInitialized = true;
			$scope.sliderInitialized = true;
			$rootScope.loadingData = false;
		};		
				
		$scope.$watch("filterData", function(newVal, oldVal){
			//console.log("RM:Success:", newVal);
			if(newVal != oldVal && $scope.filterInitialized) {
				$scope.filterSearch();
			}
		}, true);
		
		$scope.sortList = function(listname, property, value) {
			$scope[listname] = $filter('orderBy')($scope[listname], property, $scope[value]);
			$scope[value] = !$scope[value];
			$scope[value + 'Default'] = false;
			$scope.selectedSorting = value;
		};
		
		$scope.showData = function(event, type, portName, productId, countryName) {
			
			if(event) {
				event.preventDefault();
			}
			
			if('product' === type) {
				$scope.searchCriteria['product'] = productId;
			} else if('oport' === type) {
				$scope.searchCriteria['oport'] = encodeURIComponent(portName);
				$scope.searchCriteria['product'] = productId;
			} else if('dport' === type) {
				$scope.searchCriteria['dport'] = encodeURIComponent(portName);
				$scope.searchCriteria['product'] = productId;
			}else if ("country" === type) {
				$scope.searchCriteria['country'] = countryName;
			} 
			
			if($scope.searchCriteriaFriendlyDuration) {
				var dates = $scope.searchCriteriaFriendlyDuration.split("/");
				if(dates && dates.length > 1) {
					$scope.searchCriteria['sd'] = dates[0];
					$scope.searchCriteria['ed'] = dates[1];
				}
			}
			$scope.searchCriteria['type'] = $scope.type;
		};
		
		$scope.loadCompanyProducts();
		$scope.loadData();
		
		$scope.changePage = function(currentPage){
			console.log("changing page:", $scope.currentPage, currentPage);
			$scope.currentPage = currentPage;
			//$scope.filterData.duration = $scope.selectedDuration;
			$scope.filterSearch($scope.currentPage - 1);
		};	
				
    };

    priceAnalysisController.$inject = injectParams;
    app.register.controller('priceAnalysisController', priceAnalysisController);

});