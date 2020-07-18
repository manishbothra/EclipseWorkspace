'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http', '$filter'];

    var monthwiseDemandController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http, $filter) {
		$scope.reportForm = {productType:'yourProducts'};
    $scope.tradeYears = [2019];
    //$scope.ALL_MONTHS = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decempber'];
    $scope.ALL_MONTHS = ['All', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];
    $scope.selectedMonth = 'October'; //moment().format('MMMM');
    $scope.selectedYear = $scope.tradeYears[0];
		$scope.searchCriteria = {tradeMonths:[$scope.selectedMonth], endYear: $scope.selectedYear};
		$scope.type="export";
		$scope.countryIdMap = {};
		$scope.filterRanges = {};
    $scope.drilldownLinks = [];
		if($routeParams.product || $routeParams.code) {
			$scope.routeProduct = {name: $routeParams.product, code: $routeParams.code};
		}

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
				}
			}
		}, true);

		$scope.setFilters = function (plan) {
		  if ('BASIC' === plan) {
				$scope.tradeYears = [2017];
			} else if ('ADVANCED' === plan) {
				$scope.tradeYears = [2017];
			}
		};

		if($rootScope.subscription) {
			$scope.setFilters($rootScope.subscription.planName);
		} else {
			$rootScope.$watch('subscription', function(newVal, oldVal) {
				if(newVal) {
					$scope.setFilters($rootScope.subscription.planName);
				}
			}, true);

		}

		$scope.filterData = {
			destinationCountry: 699,originCountry: 0
		};

		$scope.$watch('searchCriteria', function(newVal, oldVal) {
			$scope.loadData();
		}, true);

    $scope.processMainStatsResponse = function(rawProducts, outputList) {
      angular.forEach(rawProducts, function(val, idx) {
          var to = {
            id:val.id,
            productId:val.productId,
            name: val.name,
            value: val.value,
            qty: val.qty,
			unit: val.unit,
            country: val.country,
            originCountryId: val.originCountryId,
            tradeDate: val.tradeDate
          };

          if(val.statDetails && Object.keys(val.statDetails).length > 0) {
            angular.forEach(val.statDetails, function(iv, ix) {
              var toi = angular.copy(to);
              toi.value = iv.value;
              toi.qty = iv.qty;
			  toi.unit = iv.unit;
              toi.tradeDate = iv.tradeDate;
              toi.year = iv.year;
              outputList.push(toi);
            });
          } else {
              outputList.push(to);
          }

      });
    };

		$scope.fetchHistoricalDemandByProductCode = function () {
			$rootScope.loadingData = true;
			$scope.filterData = {
				destinationCountry: 699,
				outputType : "COUNTRY_WISE",
				parentId: $scope.searchCriteria.product,
				originCountry: 0,
				logAction:true,
        endYear: $scope.searchCriteria.endYear,
        tradeMonths : $scope.searchCriteria.tradeMonths || []
			};
			$scope.selectedProductId = $scope.searchCriteria.product;


			dataService.getMontiwiseTradeCountrywise($scope.searchCriteria.product, $scope.searchCriteria.productName, 'All', $scope.type, $scope.searchCriteria.endYear, $scope.searchCriteria.tradeMonths)
			.then(function(data){
				//$scope.products=data.stats;
				//$scope.products = $filter('orderBy')(data.stats, 'value', true);
				$scope.products1=data.stats;
        $scope.products=[];
        $scope.processMainStatsResponse($scope.products1, $scope.products);

				$scope.prepareCountryCharts(data.stats);

				if(data.filterData && data.filtersAllowed) {
					$scope.initializeFilter(data.filterData, data.filtersAllowed);
				} else {
					$rootScope.loadingData = false;
				}

				if($scope.selectedProductId && data.stats && data.stats.length > 0) {
					var sp = $filter('filter')(data.stats, {id: $scope.selectedProductId})[0];
					if(sp) {
						$scope.selectedProduct = sp.name;
					}
				}
				$scope.mainTitle = "India's "+$scope.type +' details for '+$scope.selectedProduct;
			});

			$scope.disableLocationFilter = false;
		};

		$scope.fetchHistoricalDemandByCountry = function () {
			$rootScope.loadingData = true;
			$scope.filterData = {
				destinationCountry: 699,
				outputType : "GROUP_BY_PARENT",
				originCountry: $scope.searchCriteria.originCountryId,
				logAction:true,
        endYear: $scope.searchCriteria.endYear,
        tradeMonths : $scope.searchCriteria.tradeMonths || []
			};

			// dataService.getHistoricalTradeForCountry('All', $scope.searchCriteria.country, 'export')
      dataService.getFilteredMonthwiseMontiwiseTradeData($scope.type, $scope.filterData)
    	.then(function(data1){
				//$scope.products=data1.stats;
				$scope.products1=data1.stats;
        $scope.products=[];
        $scope.processMainStatsResponse($scope.products1, $scope.products);

				$scope.prepareProductCharts(data1.stats);
				$scope.searchCriteriaCountryName = $scope.searchCriteria.country;
				if(data1.country) {
					$scope.region = '';
					$scope.countryIdMap[$scope.searchCriteria.country] = data1.country;
					$scope.country = data1.country;
				}

				if(data1.filterData && data1.filtersAllowed) {
					$scope.initializeFilter(data1.filterData, data1.filtersAllowed);
				} else {
					$rootScope.loadingData = false;
				}
				$scope.mainTitle = "India's "+$scope.type +' details for '+$scope.searchCriteria.country;
				//alert("2");
			});
			$scope.disableLocationFilter = false;
		};

		$scope.fetchHistoricalDemandByProductCodeNCountry = function (productCode, country) {
			$rootScope.loadingData = true;
			$scope.filterData = {
				destinationCountry: 699,
				outputType : "ALL_SUB",
				//regionName: 'All',
				parentId: productCode,
				originCountry: $scope.searchCriteria.originCountryId,
        endYear: $scope.searchCriteria.endYear,
        tradeMonths : $scope.searchCriteria.tradeMonths || []
			};

			dataService.getMonthwiseTradeForProductNCountryDetailed(productCode, $scope.searchCriteria.productName, $scope.searchCriteria.originCountryId, $scope.type, 'true', $scope.searchCriteria.endYear, $scope.searchCriteria.tradeMonths)
			.then(function(data){
				$scope.products1=data.stats;
        $scope.products=[];
        $scope.processMainStatsResponse($scope.products1, $scope.products);

        $scope.searchCriteriaCountryName = country;
				if(data.country) {
					$scope.region = '';
					$scope.countryIdMap[country] = data.country;
					$scope.country = data.country;
				}

				if(data.filterData && data.filtersAllowed) {
					$scope.initializeFilter(data.filterData, data.filtersAllowed);
				} else {
					$rootScope.loadingData = false;
				}
				$scope.prepareProductCharts(data.stats);
				$scope.mainTitle = "India's "+$scope.type +' details for '+country;
			});
			$scope.selectedProductId = productCode;
			$scope.disableLocationFilter = true;
		};

		$scope.loadData = function() {
			$scope.type="export";
			$scope.countryIdMap = {};
			$scope.sliderInitialized = false;
			$scope.filterInitialized = false;
			$scope.showOPortHeader = false;
			$scope.showDPortHeader = false;
			$scope.showCountryHeader = true;
			 /*  filter for Product  */
			$scope.selectedYear = "any";
			$scope.companyType = "any";

			console.log("Loading Data...");

			if($scope.searchCriteria.product){
        $scope.drilldownLinks = [{type:'product', productId:$scope.searchCriteria.product, originCountryId:$scope.searchCriteria.originCountryId, country: $scope.searchCriteria.country}];
				$scope.fetchHistoricalDemandByProductCode();
			} else if($scope.searchCriteria.country){
				$scope.fetchHistoricalDemandByCountry();
			}
			if($scope.searchCriteria.country1){
        	$scope.fetchHistoricalDemandByProductCodeNCountry($scope.searchCriteria.productId, $scope.searchCriteria.country1);
			}

			if($scope.searchCriteria.country2){
        $scope.fetchHistoricalDemandByProductCodeNCountry($scope.searchCriteria.productId, $scope.searchCriteria.country2);
			}

			if( !angular.equals({}, $scope.searchCriteria)) {
				$scope.loadMarketTrendData();
			 }

			if($scope.searchCriteria.product){
				$scope.getProductGeoChartData($scope.searchCriteria.product);
			}

		};

		$scope.loadCompanyProducts=function(){
			$scope.loading = true;
			authService.getControlPanelDetails().then(function(response){
				$scope.comppro=response.data[0].companyProducts.products;
				if($scope.comppro.length>0){
					if($scope.routeProduct) {
						if($scope.routeProduct.code) {
							var cp = $filter('filter')($scope.comppro, {code: $scope.routeProduct.code});
							if(cp && cp.length > 0){
								$scope.reportForm.selectedProduct=cp[0];
							}
						} else {
							var cp = $filter('filter')($scope.comppro, {name: $scope.routeProduct.name});
							if(cp && cp.length > 0){
								$scope.reportForm.selectedProduct=cp[0];
							}
						}

					}
					if(!$scope.reportForm.selectedProduct) {
						$scope.reportForm.selectedProduct=$scope.comppro[0];
					}
					$scope.searchCriteria.product =  $scope.reportForm.selectedProduct.code;
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
						//	alert("2");
					$http.get('/api/search/productNames1/' + request.term + "/10").then(function(data1){
						if(data1) {

							var productNames = data1.data;
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
							$scope.selectedProduct = ui.item.label;
							});
						$scope.searchformProduct(true, ui.item.value);

					}
					//alert(ui.item.label);
					//alert($scope.searchresultobject.product);
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

		$scope.prepareProductCharts = function(data) {

			if($scope.searchCriteria.country)
			$scope.con =	$scope.searchCriteria.country;
			if($scope.searchCriteria.country1)
				$scope.con =	$scope.searchCriteria.country1;
			if($scope.searchCriteria.country2)
				$scope.con =	$scope.searchCriteria.country2;

			// exportChartCountryOption.options.title = 'Top '+$scope.type+' products to '+$scope.con+' - by value in Million';
			importChartCountryOption.options.title = 'Top '+$scope.type+' products to '+$scope.con+' - by value in Million';

			$scope.pieChart.options.title.text = 'Top '+$scope.type+' products to '+$scope.con+' - by value in Million';

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

			// $scope.exportChartCountry.data = rData;
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

		$scope.loadMarketTrendData = function () {
			var trendCriteria = {
				"destinationCountry":699,"endYear":2018
			};

			if ($scope.searchCriteria.product || $scope.searchCriteria.productId) {
				trendCriteria['parentId'] = $scope.searchCriteria.product || $scope.searchCriteria.productId;
			} else {
				return;
			}

			trendCriteria['originCountryName'] = $scope.searchCriteria.country || $scope.searchCriteria.country1 || $scope.searchCriteria.country2;

			//if (trendCriteria['originCountryName']) {
				trendCriteria["outputType"] = "COUNTRY_WISE";//"GROUP_BY_TRADE_DATE_COUNTRY_WISE";
        //trendCriteria["outputTypeValue"] = 5;
        // trendCriteria["tradeMonths"]=["january"];
			//}
			// else {
				// trendCriteria["outputType"] = "GROUP_BY_TRADE_DATE";
			// }

			dataService.getMonthwiseDemandTrend($scope.type, trendCriteria)
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
					  "axisLabel": "Month"
					},
					"yAxis": {
					  "axisLabel": "Value (M USD)"
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

    $scope.trendChart.months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    $scope.trendChart.options.chart.xAxis.tickFormat = function(d){
        return $scope.trendChart.months[d];
    };


		$scope.trendChartSelectableOptions = [];
		$scope.$watch("selectedTrendChart", function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				var selectedChartObj = $scope.trendChartDataValues[newVal].data;
				$scope.trendChart['data']=selectedChartObj;
				console.log("trendChartData", selectedChartObj);
				$scope.$evalAsync(function(){
					$scope.trendChart.api.refresh();
				});
			}
		});

		$scope.prepareTrendChart = function(data, dataKey) {
			$scope.trendChartSelectableOptions = [];
			angular.forEach(data, function(obj, key) { //country,
				$scope.trendChart.options.title.text = 'Market Trend Analysis - ' + key;

				angular.forEach(obj, function(valueArr, key2) { //product
					$scope.trendChartDataValues[key2] = {};
					$scope.trendChartDataValues[key2]['data'] = [];

					var chartDataObj = {};
					chartDataObj['key'] = key2;
					chartDataObj['values'] = [];
					var maxYValue = 0;
					$scope.trendChartSelectableOptions.push(key2);

					angular.forEach(valueArr, function(value, index) {//array of stats
						var yValue = value.value.toFixed(2);
						chartDataObj['values'].push({x:$scope.trendChart.months.indexOf(value.date), y: parseFloat(yValue)});
						if(yValue > maxYValue) {
							maxYValue = yValue;
						}
					});

					var sortedValues=$filter('orderBy')(chartDataObj['values'], 'x');
					chartDataObj['values'] = sortedValues;

					$scope.trendChartDataValues[key2]['data'].push(chartDataObj);
					$scope.trendChartDataValues[key2]['maxY'] = maxYValue;
				});
			});

			// trendChartData.push(chartDataObj);
			if($scope.trendChartSelectableOptions.length > 0) {
				$scope.trendChartSelectableOptions = $filter('orderBy')($scope.trendChartSelectableOptions);
				$scope.selectedTrendChart = $filter('filter')($scope.trendChartSelectableOptions, 'All')[0];
			}

			//
		};


	/*------------ Geo CHART RELATED------------*/

		var chartGeoOption = {
			"type": "GeoChart",
			"options": {
			   backgroundColor: {fill: 'transparent'},
			  // 'width':700,
			  'height':380
			},
			  //cssStyle: "height:100%; width:100%;backgroundColor: {fill:transparent} ",
			  data: {}
		};

		var exportChartGeoOption = angular.copy(chartGeoOption);
		exportChartGeoOption.options.title = 'Export Market';

		$scope.exportChartGeo = exportChartGeoOption;

		/*dataService.getHistoricalTrendGeoChartData('export')
		.then(function(data) {
			$scope.exportChartGeo.data = data;
		});*/

		$scope.getProductGeoChartData = function(code) {
			   dataService.getProductHistoricalTrendGeoChartData('export', code)
		       .then(function(data) {
		           $scope.exportChartGeo.data = data;
		       });
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

		$scope.filterSearch = function () {
			$rootScope.loadingData = true;
			if($scope.searchCriteriaCountryName && (isNaN($scope.filterData.originCountry))) {
				$scope.filterData.originCountry = $scope.countryIdMap[$scope.searchCriteriaCountryName];
			}

			if('yesterday'==$scope.filterData.duration || 'last7days'==$scope.filterData.duration || 'lastMonth'==$scope.filterData.duration){

			} else {
				dataService.getFilteredMonthwiseMontiwiseTradeData($scope.type, $scope.filterData)
				.then(function(data){
					$scope.products1 =data.stats;
          $scope.products=[];
          $scope.processMainStatsResponse($scope.products1, $scope.products);

					$scope.showOPortHeader = false;
					$scope.showDPortHeader = false;
					$scope.showCountryHeader = true;

					if($scope.searchCriteria.product)
					$scope.prepareCountryCharts(data);
					else
					$scope.prepareProductCharts(data);

					if($scope.searchCriteria.product){
						 $scope.mainTitle = "India's "+$scope.type +' details for '+$scope.selectedProduct;
					}else if($scope.searchCriteria.country){
						$scope.mainTitle = "India's "+$scope.type +' details for '+$scope.searchCriteria.country;
					}else if($scope.searchCriteria.country1){
						 $scope.mainTitle = "India's "+$scope.type +' details for '+$scope.searchCriteria.country1;
					}else if($scope.searchCriteria.country2){
						 $scope.mainTitle = "India's "+$scope.type +' details for '+$scope.searchCriteria.country2;
					}
				})['finally'](function (){
					$rootScope.loadingData = false;
				});
			}
		};


		$scope.setSliderValue = function(key, min, max) {
			$scope.$evalAsync( function() {
				$scope.filterData[ 'min' + key ]= min;
				$scope.filterData[ 'max' + key ] = max;
				//$scope.filterData[ key + 'Range'] = newValue1 + "," + newValue2;
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
			//console.log("changeCompanyType:: ", value);
			$scope.country = value;
			if(!value) {
				value = {id:0};
				// $scope.filterData.displayCountry = 'All';
				$scope.filterData.regionName = $scope.region;
			} else {
				$scope.filterData.displayCountry = null;
				$scope.region = value.regionName;
				$scope.filterData.regionName = null;
			}

			$scope.filterData.displayRegion = null;
			$scope.filterData.originCountry = parseInt(value.id);
			// $scope.filterData.outputType = 'COUNTRY_WISE';
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
			// $scope.filterData.outputType = 'COUNTRY_WISE';
		};

		$scope.changeType = function(type) {

			$scope.type = type;
			$scope.filterSearch();
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

		$scope.changeMonth = function (value) {
				$scope.filterData.tradeMonths = [value]; //.toLowerCase()
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
			var selectedYear = $scope.filterRanges.selectedYear || 'any';
			$scope.selectedYear = selectedYear.toString();
			if($scope.filterRanges.selectedYear) {
				$scope.selectedDuration = $scope.filterRanges.selectedYear+','+$scope.filterRanges.selectedYear;
			}

			console.log("filters:: ",$scope.filterRanges);

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


		$scope.showData = function(event, type, countryName, productId, originCountryId) {

			if(event) {
				event.preventDefault();
			}

      $scope.searchCriteria['originCountryId'] = originCountryId;
			if ("country" === type) {
				$scope.searchCriteria['product'] = undefined;
				$scope.searchCriteria['country1'] = undefined;
				$scope.searchCriteria['country'] = countryName;
        var to = {type:'country', originCountryId:$scope.searchCriteria.originCountryId, country: $scope.searchCriteria.country};
        $scope.drilldownLinks = [to];
			} else if ('productId-country1' === type) {
				$scope.searchCriteria['productId'] = productId;
				$scope.searchCriteria['country1'] = countryName;
				$scope.searchCriteria['product'] = undefined;
				$scope.searchCriteria['country'] = undefined;
        var to = {type:'productId-country1', productId:$scope.searchCriteria.productId, originCountryId:$scope.searchCriteria.originCountryId, country: $scope.searchCriteria.country1};
        var find = $filter('filter')($scope.drilldownLinks, to)[0];
        if(!find) {
            $scope.drilldownLinks.push(to);
        }
			} else if('productId-country2' === type) {
				$scope.searchCriteria['productId'] = productId;
				$scope.searchCriteria['country1'] = countryName;
				$scope.searchCriteria['product'] = undefined;
				$scope.searchCriteria['country'] = undefined;
        var to = {type:'productId-country2', productId:$scope.searchCriteria.productId, originCountryId:$scope.searchCriteria.originCountryId, country: $scope.searchCriteria.country1};
        var find = $filter('filter')($scope.drilldownLinks, to)[0];
        if(!find) {
            $scope.drilldownLinks.push(to);
        }
			} else if('product' === type) {
				$scope.searchCriteria['product'] = productId;
				$scope.searchCriteria['country'] = undefined;
			}
		};

		$scope.loadCompanyProducts();
    };

    monthwiseDemandController.$inject = injectParams;
    app.register.controller('monthwiseDemandController', monthwiseDemandController);

});
