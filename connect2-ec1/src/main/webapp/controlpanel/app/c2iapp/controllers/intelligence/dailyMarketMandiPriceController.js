'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http', '$filter'];

    var dailyMarketMandiPriceController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http, $filter) {
		$scope.reportForm = {productType:'yourProducts'};
    $scope.tradeYears = [2019];
    $scope.ALL_MONTHS = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decempber'];
    $scope.ALL_INDIAN_STATES = [];
    $scope.selectedMonth = moment().format('MMMM');
    $scope.selectedYear = $scope.tradeYears[0];
		$scope.searchCriteria = {tradeMonths:[$scope.selectedMonth], endYear: $scope.selectedYear};
		$scope.type="export";
		$scope.filterRanges = {};
    $scope.drilldownLinks = [];
		$scope.filterData = {	commodity:'onion', stateName:'Maharashtra', toDate : moment().subtract(1,'d').toDate(), fromDate : moment().subtract(3,'d').toDate()};

		if($routeParams.product || $routeParams.code) {
			$scope.routeProduct = {name: $routeParams.product, code: $routeParams.code};
		}


		$scope.dateModal = {};

		$scope.dateOptions = {
			startingDay: 1,
			showWeeks: false,
			maxDate: new Date(),
			minDate: new Date(1900, 1, 1),
		};

		$scope.disabled = function(date, mode) {
			return false;
		};

		$scope.openDateModal = function($event, elementOpened) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.dateModal[elementOpened] = !$scope.dateModal[elementOpened];
		};


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

		$scope.$watch('searchCriteria', function(newVal, oldVal) {
			$scope.loadData();
		}, true);

		$scope.loadData = function() {
			$scope.sliderInitialized = false;
			$scope.filterInitialized = false;
			console.log("Loading Data...");

		};

    $scope.loadInStates = function() {
      dataService.getIndianStates(false).then(function(data) {
        if(data) {
          $scope.ALL_INDIAN_STATES = [];
          angular.forEach(data, function(v, i) {
            $scope.ALL_INDIAN_STATES.push(v.name);
          });
        }

       })['finally'](function () {
       });
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


		$scope.pieChartOptions = {
			options :{
			  "chart": {
  				"type": "multiBarChart",
  				"height": 400,
  				"width": 1000,
  				"duration": 503,
          clipEdge: true,
          stacked: true,
  				"legend": {
  				  "margin": {
  					"top": 15,
  					"right": 5,
  					"bottom": 15,
  					"left": 40
  				  }
				   },
          x: function(d){return d[0];},
          y: function(d){return d[1];},
          "xAxis": {
            "axisLabel": "Market",
            "staggerLabels": false,
            "rotateLabels": 0,
          },
          "yAxis": {
            "axisLabel": "Price (INR)"
          },
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
  				  "bottom": 80,
  				  "left": 80
  				},
  				"labelType": "percent",
  				"noData": 'No data to show',
  				"showLegend": true,
  				"legendPosition": "top",
  				"tooltips": true
			  },
        caption:{},
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

    $scope.barChartXAxisLP = [];

    $scope.pieChartLP = angular.copy($scope.pieChartOptions);

    $scope.pieChartLP.options.chart.xAxis.tickFormat = function(d){
        return $scope.barChartXAxisLP[d];
    };

    $scope.pieChartLP.options.chart.tooltip = {
        keyFormatter: function(d) {
            return $scope.barChartXAxisLP[d];
        }
    };

		$scope.$watch("dataChangeForPieChartLP", function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				$scope.pieChartLP['data'] = newVal;
        console.log('$scope.pieChartLP',$scope.pieChartLP);
				$scope.$evalAsync(function(){
					if($scope.pieChartLP.api) {
						$scope.pieChartLP.api.refresh();
					}
				});
			}
		});

    $scope.allMarketNames = [];
    $scope.allDistrictNames = [];
		$scope.prepareLowestPriceCharts = function(data) {
			$scope.pieChartLP.options.caption.text = 'Marketwise prices for ' + $scope.filterData.commodity;
	    data = $filter('orderBy')(data, 'modalPrice');
			var count=0;
			var nvPieData = [];
			var nvPieDataMin = [];
			var nvPieDataMax = [];
      $scope.barChartXAxisLP = [];
      $scope.allMarketNames = [];
			angular.forEach(data, function(value, index) {
        if($scope.allMarketNames.indexOf(value.marketName) < 0) {
            $scope.allMarketNames.push(value.marketName);
        }

        if($scope.allDistrictNames.indexOf(value.districtName) < 0) {
            $scope.allDistrictNames.push(value.districtName);
        }

				if(value.modalPrice > 0 ) { //&& count < 10
          $scope.barChartXAxisLP.push(value.marketName);
				  nvPieData.push([count, value.modalPrice]);
				  nvPieDataMin.push([count, value.minPrice]);
				  nvPieDataMax.push([count, value.maxPrice]);
  				count = count + 1;
				}
			});

			$scope.dataChangeForPieChartLP = [];
			$scope.dataChangeForPieChartLP.push({"key" : "Modal Price" ,
              "bar": true,
              "values" : nvPieData
            });
			$scope.dataChangeForPieChartLP.push({"key" : "Min Price" ,
              "bar": true,
              "values" : nvPieDataMin
            });
			$scope.dataChangeForPieChartLP.push({"key" : "Max Price" ,
              "bar": true,
              "values" : nvPieDataMax
            });
		};

		var chartCriteria = {
		};

		$scope.loadMarketTrendData = function (marketName) {
			var trendCriteria = angular.copy($scope.filterData);
      trendCriteria.marketName = marketName;
      trendCriteria.fromDate = moment().subtract(7,'d').format('YYYY-MM-DD');
      trendCriteria.toDate = moment().format('YYYY-MM-DD');
			dataService.getDailyMandiPrice(trendCriteria)
			.then(function(resp){
					$scope.prepareTrendChart(resp.data.data);
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
					  "right": 80,
					  "bottom": 80,
					  "left": 100
					},
					"useInteractiveGuideline": true,
					"dispatch": {},
					"xAxis": {
					  "axisLabel": "Date"
					},
					"yAxis": {
					  "axisLabel": "Price (INR)"
					},
					noData:"No Data Available.",
          forceY:[]
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

    $scope.trendChart.dates = [];

    $scope.trendChart.options.chart.xAxis.tickFormat = function(d){
        return $scope.trendChart.dates[d];
    };


		$scope.trendChartSelectableOptions = [];
		$scope.$watch("selectedTrendChart", function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				$scope.trendChart['data']=newVal['data'];
		    // $scope.trendChart.options.chart.yAxis.scale().domain([0, newVal['maxY']]);
		    $scope.trendChart.options.chart.forceY = [0, newVal['maxY']];
				$scope.$evalAsync(function(){
					$scope.trendChart.api.refresh();
				});
			}
		});

		$scope.$watch("selectedTrendChartMarket", function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
        if($scope.trendChartDataValues[newVal] && $scope.trendChartDataValues[newVal]['data']) {
  				$scope.selectedTrendChart=$scope.trendChartDataValues[newVal];
        } else {
  			    $scope.loadMarketTrendData(newVal);
        }
			} else if(!newVal && oldVal) {
        $scope.selectedTrendChart={data:{},maxY:0};
      }
		});

		$scope.prepareTrendChart = function(data, dataKey) {
			$scope.trendChartSelectableOptions = [];
      var marketName = '';
      var chartDataObj = {};
      var maxYValue = 0;
      var dcount = 0;
			angular.forEach(data, function(val, idx) { //country,
				$scope.trendChart.options.title.text = 'Market Trend Analysis - ' + val.marketName;
        if(!$scope.trendChartDataValues[val.marketName]) {
          marketName = val.marketName;
          $scope.trendChartDataValues[val.marketName] = {};
          $scope.trendChartDataValues[val.marketName]['data'] = [];
          chartDataObj['key'] = val.marketName;
          chartDataObj['values'] = [];
        }

        var yValue = val.modalPrice.toFixed(2);
        $scope.trendChart.dates.push(val.arrivalDate);
        chartDataObj['values'].push({x:dcount++, y: parseFloat(yValue)});
        if(yValue > maxYValue) {
          maxYValue = yValue;
        }

        //var sortedValues=$filter('orderBy')(chartDataObj['values'], 'x');
        //chartDataObj['values'] = sortedValues;

			});

      $scope.trendChartDataValues[marketName]['data'].push(chartDataObj);
      $scope.trendChartDataValues[marketName]['maxY'] = maxYValue;
	     $scope.selectedTrendChart=$scope.trendChartDataValues[marketName];
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
      $scope.selectedTrendChartMarket='';
  		$scope.trendChartDataValues = {};
			dataService.getDailyMandiPrice($scope.filterData)
				.then(function(response){
					$scope.productPrices =response.data.data;
					$scope.prepareLowestPriceCharts($scope.productPrices);
				  $scope.mainTitle = 'Daily market price details for '+ $scope.filterData.commodity;
          $scope.filterRanges.states = $scope.ALL_INDIAN_STATES;
				})['finally'](function (){
					$rootScope.loadingData = false;
				});
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
    $scope.loadInStates();
		$scope.loadCompanyProducts();
  };

    dailyMarketMandiPriceController.$inject = injectParams;
    app.register.controller('dailyMarketMandiPriceController', dailyMarketMandiPriceController);

});
