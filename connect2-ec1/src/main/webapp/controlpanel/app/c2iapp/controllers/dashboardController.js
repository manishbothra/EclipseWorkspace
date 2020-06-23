'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope',  '$filter'];

    var dashboardController = function ($scope, $location, $routeParams, authService, dataService, $rootScope,$filter) {

    	$scope.reportForm = {};

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
        // exportChartGeoOption.options.legend = 'none';
        exportChartGeoOption.options.datalessRegionColor = '#b0ba7f';
        exportChartGeoOption.options.magnifyingGlass = {enable: true, zoomFactor: 7.5};
        exportChartGeoOption.options.backgroundColor = {fill: 'white'};

        $scope.exportChartGeo = exportChartGeoOption;

		$scope.resetAllData = function () {
			$scope.productTopCountries = {};
			$scope.productImporters = {};
			$scope.productDemandStats = {};
			$scope.productExportDuties = {};
			$scope.relatedProducts = {};
		};

    	$scope.filterData = {
				destinationCountry: 699,
				outputType : "GROUP_BY_TRADE_DATE_PORT_DATA_ALL_DETAILS",
				originCountry: 0,
				pageIndex:0,
				pageSize:5
			};

		$scope.loadCompanyDetails = function(){
			// $rootScope.loadingData = true;
			authService.getControlPanelDetails().then(function(response) {
				$scope.companyProfile = response.data;
				$scope.userCountry = $scope.companyProfile[0].country;
                $scope.profileStatus = response.profileStatus;
				$scope.subscriptionPackage = response.subscription;
				$scope.user=$scope.companyProfile[0].userDetails.user;
			})['finally'](function () {
				// $rootScope.loadingData = false;
			});
		};


	   $scope.loadStats = function() {
			dataService.getDashboardStats().then(function(response) {
				$scope.dashboardStats = response.data.data || {};
			});
	   };

	   $scope.loadRecentActivities = function() {
			dataService.getRecentActivities(5).then(function(response) {
				$scope.recentActivities = response.data.data || [];
				angular.forEach($scope.recentActivities, function(value, index) {
					value['dateFormatted'] = moment(value.date, "x").format("DD MMM YYYY hh:mm a");
				});
			});
	   };

	   $scope.loadCountries = function(productCode, productName, country, tradeType) {
		    $rootScope.loadingData = true;
			dataService.getHistoricalTradeCountrywise(productCode, productName, country, tradeType).then(function(response) {
			      $scope.productTopCountries = response.stats || {};
			      $scope.productTopCountries = $filter('orderBy')($scope.productTopCountries, 'value', true);
            })['finally'](function (){
	            $rootScope.loadingData = false;
            });


	   };

	   $scope.loadExportDuties = function(productCode, productValue, payload) {

			if($scope.userCountry.toLowerCase()=="india"){
				/*dataService.getExportDuties(productCode, productValue, payload).then(function(response) {
					$scope.productExportDuties = response || {};
				});*/
				dataService.getIndianCustomDuties (productCode,payload).then(function(response) {
					$scope.productExportDuties = response.data || {};
				});
			} else {
				dataService.getIndianCustomDuties (productCode,payload).then(function(response) {
					$scope.productExportDuties = response.data || {};
				});
			}
	   };

	   $scope.loadImporters = function(hsCode, productName,pageNo,pageSize, isBuyRequest) {
		   if($scope.userCountry.toLowerCase()=="india"){
			   dataService.getGlobalImporters(hsCode, productName,pageNo,pageSize, isBuyRequest).then(function(response) {
			         $scope.productImporters = response.data.data || {};
	           });
			} else {
				dataService.getIndianImporters(hsCode, productName,pageNo,pageSize, isBuyRequest).then(function(response) {
				     $scope.productImporters = response.data || {};
			    });
			}
	   };

	   $scope.loadDemandStats = function(tradeType, payload, isFilterRequired) {
	   		dataService.getFilteredPortDataDetailed(tradeType, payload, isFilterRequired).then(function(response) {
					$scope.productDemandStats = response.stats || {};
			});
	   };

	   $scope.loadRelatedProducts = function(name, type, page, size) {
			dataService.getRelatedProducts(name, type, page, size).then(function(response) {
				$scope.relatedProducts = response.data || {};
			});
	   };

	   $scope.getGeoChartData = function(tradeType) {
		    dataService.getHistoricalTrendGeoChartData(tradeType)
		    	.then(function(data) {
	            $scope.exportChartGeo.data = data;
	        });
	   };

	   $scope.getProductGeoChartData = function(code, tradeType) {
		   dataService.getProductHistoricalTrendGeoChartData(tradeType, code)
	       		.then(function(data) {
	            $scope.exportChartGeo.data = data;
	       });
	   };

	   $scope.loadCompanyProducts=function(){
			$scope.loading = true;
			authService.getControlPanelDetails().then(function(response){
				$scope.comppro=response.data[0].companyProducts.products;
				$scope.reportForm.selectedProduct=$scope.comppro[0];
				$scope.userCountry = response.data[0].country;
				$scope.changeProductSelection();
				/*if($scope.comppro.length>0){
					$scope.searchCriteria.product =  $scope.reportForm.selectedProduct.code;
				} else{
					$scope.noProductAdded=true;
				}*/
			})['finally'](function() {
				$scope.loading = false;
			});
		};

		/*$scope.$watch('reportForm', function(newVal, oldVal) {
			console.log("loading report data: ", newVal, oldVal);
			if(newVal && newVal != oldVal) {

			}
		}, true);*/

    /* ******
    ** TRENDS
    **
    **/
    $scope.trendChartOptions =
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
			options: angular.copy($scope.trendChartOptions.options)
		};

		$scope.trendChart.options.title.text = 'Market Trend Analysis ';
		$scope.trendChartDataValues = {};
		$scope.trendChart.options.chart.yAxis.tickFormat = function(d) {
			 return d3.format('.02f')(d);
		};

    $scope.refreshChart = function() {
  				$scope.$evalAsync(function(){
  					$scope.trendChart.api.refresh();
  				});
    };

		$scope.trendChartSelectableOptions = [];
		$scope.$watch("selectedTrendChart", function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				var selectedChartObj = $scope.trendChartDataValues[newVal].data;
				$scope.trendChart['data']=selectedChartObj;

        $scope.yearlyTrendSummary = {total:0, max:0};
        $scope.yearlyTrendSummary.data = $filter('limitTo')($filter('orderBy')($scope.trendChart.data[0].values, 'x', true), 6);
        angular.forEach($scope.yearlyTrendSummary.data, function(val, idx) {
          $scope.yearlyTrendSummary.total +=val.y;
          if(val.y > $scope.yearlyTrendSummary.max){
            $scope.yearlyTrendSummary.max = val.y;
          }
        });

				$scope.refreshChart();
			}
		});
    $scope.prepareTrendChart = function(data, dataKey) {
			$scope.trendChartSelectableOptions = [];
      $scope.refreshChart();
			angular.forEach(data, function(obj, key) { //country,
				$scope.trendChart.options.title.text = 'Market Trend Analysis - ' + key;
				angular.forEach(obj, function(valueArr, key2) { //product
					$scope.trendChartDataValues[key2] = {};
					$scope.trendChartDataValues[key2]['data'] = [];

					var chartDataObj = {};
					chartDataObj['key'] = key2;
					chartDataObj['values'] = [];
					chartDataObj['area'] = true;
					chartDataObj['color'] = "#0073b7";
					var maxYValue = 0;
					$scope.trendChartSelectableOptions.push(key2);

					angular.forEach(valueArr, function(value, index) {//array of stats
						var yValue = value.value.toFixed(2);
						chartDataObj['values'].push({x:parseInt(value.date.split("-")[0]), y: parseFloat(yValue)});
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
		};
    $scope.loadProductHistoricalTrend = function(payload, tradeType) {
        var trendCriteria = {
          "destinationCountry":699,"endYear":0
        };

        if (payload.parentId) {
          trendCriteria['parentId'] = payload.parentId;
        } else {
          return;
        }
        trendCriteria["outputType"] = "GROUP_BY_TRADE_DATE_COUNTRY_WISE";

        dataService.getHistoricalDemandTrend(tradeType, trendCriteria)
        .then(function(resp){
            $scope.prepareTrendChart(resp.data);
        });
    };

    /**
    ** Monthwise trends
    **/
    $scope.monthwiseTrendChart = {
      options: angular.copy($scope.trendChartOptions.options)
    };

    $scope.monthwiseTrendChart.options.title.text = 'Market Trend Analysis ';
    $scope.monthwiseTrendChart.options.chart.xAxis.axisLabel = "Month"
    $scope.monthwiseTrendChartDataValues = {};
    $scope.monthwiseTrendChart.options.chart.yAxis.tickFormat = function(d) {
       return d3.format('.02f')(d);
    };

    $scope.monthwiseTrendChart.months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    $scope.getMonthText = function(intValue) {
        return $scope.monthwiseTrendChart.months[intValue].toUpperCase();
    };

    $scope.monthwiseTrendChart.options.chart.xAxis.tickFormat = function(d){
        return $scope.monthwiseTrendChart.months[d].toUpperCase();
    };

    $scope.monthwiseTrendChartSelectableOptions = [];
    $scope.$watch("selectedMonthwiseTrendChart", function(newVal, oldVal) {
      if(newVal && newVal != oldVal) {
        var selectedChartObj = $scope.monthwiseTrendChartDataValues[newVal].data;
        $scope.monthwiseTrendChart['data']=selectedChartObj;
        $scope.monthwiseTrendSummary = {total:0,max:0};
        $scope.monthwiseTrendSummary.data = $filter('limitTo')($filter('orderBy')($scope.monthwiseTrendChart.data[0].values, 'x', true), 6);
        angular.forEach($scope.monthwiseTrendSummary.data, function(val, idx) {
          $scope.monthwiseTrendSummary.total +=val.y;
          if(val.y > $scope.monthwiseTrendSummary.max){
            $scope.monthwiseTrendSummary.max = val.y;
          }
        });
        console.log("monthwiseTrendChartData", selectedChartObj);
        $scope.$evalAsync(function(){
          $scope.monthwiseTrendChart.api.refresh();
        });
      }
    });

    $scope.prepareMonthwiseTrendChart = function(data, dataKey) {
      $scope.monthwiseTrendChartSelectableOptions = [];
      angular.forEach(data, function(obj, key) { //country,
        $scope.monthwiseTrendChart.options.title.text = 'Monthwise Market Trend Analysis - ' + key;

        angular.forEach(obj, function(valueArr, key2) { //product
          $scope.monthwiseTrendChartDataValues[key2] = {};
          $scope.monthwiseTrendChartDataValues[key2]['data'] = [];

          var chartDataObj = {};
          chartDataObj['key'] = key2;
          chartDataObj['values'] = [];
					chartDataObj['area'] = true;
					chartDataObj['color'] = "#dd4b39";
          var maxYValue = 0;
          $scope.monthwiseTrendChartSelectableOptions.push(key2);

          angular.forEach(valueArr, function(value, index) {//array of stats
            var yValue = value.value.toFixed(2);
            if(value.date) {
                chartDataObj['values'].push({x:$scope.monthwiseTrendChart.months.indexOf(value.date.toLowerCase()), y: parseFloat(yValue)});
                if(yValue > maxYValue) {
                  maxYValue = yValue;
                }
            }
          });

          var sortedValues=$filter('orderBy')(chartDataObj['values'], 'x');
          chartDataObj['values'] = sortedValues;

          $scope.monthwiseTrendChartDataValues[key2]['data'].push(chartDataObj);
          $scope.monthwiseTrendChartDataValues[key2]['maxY'] = maxYValue;
        });
      });

      if($scope.monthwiseTrendChartSelectableOptions.length > 0) {
        $scope.monthwiseTrendChartSelectableOptions = $filter('orderBy')($scope.monthwiseTrendChartSelectableOptions);
        $scope.selectedMonthwiseTrendChart = $filter('filter')($scope.monthwiseTrendChartSelectableOptions, 'All')[0];
      }
    };

    $scope.loadMonthwiseMarketTrendData = function (payload, tradeType) {
			var trendCriteria = {
				"destinationCountry":699,"endYear":2019
			};

			if (payload.parentId) {
				trendCriteria['parentId'] = payload.parentId;
			} else {
				return;
			}
      trendCriteria["outputType"] = "COUNTRY_WISE";//"GROUP_BY_TRADE_DATE_COUNTRY_WISE";

			dataService.getMonthwiseDemandTrend(tradeType, trendCriteria)
			.then(function(resp){
					$scope.prepareMonthwiseTrendChart(resp.data);
			});
		};
/**

**/
		$scope.changeProductSelection = function(){

			if ($scope.reportForm.selectedProduct) {
				$scope.resetAllData();

				var nc = '' + $scope.reportForm.selectedProduct.code;
				if(nc.length == 7 ) {
					nc = nc.substr(0, 5);
				} else if(nc.length == 8) {
					nc = nc.substr(0, 6);
				}

				console.log("code:"+nc);
				$scope.productCode = nc;

				if($scope.reportForm.selectedProduct.code && $scope.reportForm.selectedProduct.productName) {
					$scope.historicalDemandRef = '#/historical-demand-analysis/' + $scope.reportForm.selectedProduct.productName +
					'/' + $scope.reportForm.selectedProduct.code;
					$scope.currentDemandRef = '#/current-demand-analysis/' + $scope.reportForm.selectedProduct.productName +
					'/' + $scope.reportForm.selectedProduct.code;
					$scope.impSearchRef = '#/importers-search/' + $scope.reportForm.selectedProduct.productName +
					'/' + $scope.reportForm.selectedProduct.code;
				} else if($scope.reportForm.selectedProduct.productName) {
					$scope.historicalDemandRef = '#/historical-demand-analysis/' + $scope.reportForm.selectedProduct.productName;
					$scope.currentDemandRef = '#/current-demand-analysis/' + $scope.reportForm.selectedProduct.productName;
					$scope.impSearchRef = '#/importers-search/' + $scope.reportForm.selectedProduct.productName;
				} else {
					$scope.historicalDemandRef = '#/historical-demand-analysis';
					$scope.currentDemandRef = '#/current-demand-analysis';
					$scope.impSearchRef = '#/importers-search';
				}

				if(nc && nc!='0') {

					$scope.loadExportDuties($scope.productCode, 'undefined',{});
					$scope.loadImporters($scope.productCode, '', 1, 5, false);

					$scope.filterData['parentId'] = $scope.productCode;
					var payload = angular.copy($scope.filterData);

					$scope.selectedTrendChart = undefined;
					$scope.selectedMonthwiseTrendChart = undefined;
					$scope.loadRelatedProducts($scope.reportForm.selectedProduct.name, 'global_importers', 1, 5);
					$scope.loadTotalExportImportStats($scope.productCode);
					
					if($scope.userCountry.toLowerCase()=="india"){
						$scope.selectedTradeType = 'export';
						$scope.loadCountries($scope.productCode, 'undefined', 'All', 'export');
						$scope.loadDemandStats('export', payload, false);
						$scope.getProductGeoChartData($scope.productCode, 'export');
						$scope.loadProductHistoricalTrend(payload, 'export');
						
						$scope.loadMonthwiseMarketTrendData(payload, 'export');
					} else {
						$scope.selectedTradeType = 'import';
						$scope.loadCountries($scope.productCode, 'undefined', 'All', 'import');
						$scope.loadDemandStats('import', payload, false);
						$scope.getProductGeoChartData($scope.productCode, 'import');
					}
				} else {
					if($scope.userCountry.toLowerCase()=="india"){
						$scope.getGeoChartData('export');
					}	else{
						$scope.getGeoChartData('import');
					}
				}
			}
		};

    $scope.loadTotalExportImportStats = function(hsCode) {
      dataService.getTotalTradeStatsForProduct(hsCode).then(function(response) {
        $scope.totalTradeStats = response.data;
      });
    };

	   $scope.loadCompanyDetails();
	   $scope.loadStats();
	   $scope.loadRecentActivities();
	   $scope.loadCompanyProducts();

    };

    dashboardController.$inject = injectParams;
    app.register.controller('dashboardController', dashboardController);

});
