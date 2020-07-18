'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope','$filter', 'modalService', 'StepsService', '$q'];

    var financeApplicationController = function ($scope, $location, $routeParams, authService, dataService, $rootScope,$filter, modalService, stepsService, $q) {
        $scope.successMsg = '';
		$scope.doneSteps = ['step1','step2','step3','step4','step5'];

		//{step1:{id: 1, name: 'Select Product'},step2:{id: 2, name: 'Select Target Market'},step3:{id: 3, name: 'Select Counterparts'},step4:{id: 4, name: 'Contact Counterparts'}};

		$scope.exportSteps = [{id: 1, name: 'Business Details', step: 'step1'},
            {id: 2, name: 'Products & Trade History', step: 'step2'},
            {id: 3, name: 'Preferred Export Timings', step: 'step3'},
            {id: 4, name: 'Risk Score', step: 'step4'}
        ];
		$scope.importSteps = $scope.exportSteps;
		$scope.stepMaps = {
			'export': $scope.exportSteps,
			'import': $scope.importSteps
		};

        $scope.financeTypes = [{label:'Post Shipment Finance'},{label:'P.O. Finance'}];
        $scope.tradeTypes = [{label:'Export', val:'export'},{label:'Import', val:'import'}];
		$scope.selectedStep = 'step1';
		$scope.selectedTradeId = $routeParams.id;
		$scope.tradeType = $routeParams.tradeType || 'export';
		$scope.pageTitle = 'Apply for Export Finance';
		$scope.finForm = {'tradeType': $scope.tradeType, iec:'031224578',companyName:'Test', product:'test', shipmentHistory:'test',exportTurnover:'testsettsete', };
		$scope.stepsValidated = {};
		$scope.allCurrencies = ['INR', 'USD', 'GBP', 'EUR', 'AUD'];

		$scope.isStepDone = function (step){
			return $scope.doneSteps.indexOf(step) >= 0;
		};

		$scope.setSelectedStep = function(step) {
			if($scope.isStepDone(step)) {
				$scope.selectedStep = step;
			}
		};

		$scope.setPageTitle = function() {


		};

		if($scope.selectedTradeId) {
			dataService.getTradeFinanceDetails($scope.selectedTradeId).then(function(resp) {
				$scope.tradeForm = resp.data.data;
				$scope.tradeType = $scope.tradeForm.tradeType;
				$scope.editTradeFlow = true;
				$scope.setPageTitle();
				var ss = $filter('filter')($scope.stepMaps[$scope.tradeType], {id : $scope.tradeForm.currentStep})[0];
				if(ss) {
					$scope.selectedStep = 'step' + ss.id;
					for(var i = 1; i <= ss.id; i++) {
						$scope.doneSteps.push('step' + i);
					}
				}
			});
		} else {
			$scope.setPageTitle();
		}

		$scope.$watch('selectedStep', function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				if('step1' == newVal && !$scope.stepsValidated['step1']) {
					// $scope.loadRecommendedProducts();
				} else if('step2' == newVal && !$scope.stepsValidated['step2']) {
					// $scope.loadRecommendedTargetMarkets();
				} else if('step3' == newVal && !$scope.stepsValidated['step3']) {
					// $scope.loadPriceTrend();
				} else if('step4' == newVal && !$scope.stepsValidated['step4']) {
					// $scope.loadRecommendedCounterparts();
				}
			}
		});

		$scope.goToPrevStep = function() {
			stepsService.steps().previous();
			console.log('back step');
		};


		$scope.validateAndSubmitBusinessDetailsStep = function() {
			if(!$scope.tradeForm) {
				$scope.errorMessage = 'Please select at least one target market.';
			} else {
				$scope.updateCurrentTrade($scope.finalizeSelectTargetMarket);
			}
		};

		$scope.updateCurrentTrade = function(callBack) {
			$scope.loadingData = true;
			if(!$scope.tradeForm.tradeType) {
				$scope.tradeForm.tradeType = $scope.tradeType;
			}
			var currentTradeStep = $filter('filter')($scope.stepMaps[$scope.tradeType], {step: $scope.selectedStep})[0];
			$scope.tradeForm.currentStep = currentTradeStep.id;
			$scope.tradeForm.currentStepName = currentTradeStep.name;
			dataService.updateOngoingTradeDetails($scope.tradeForm).then(function(resp) {
				if(resp.data.success && resp.data.id > 0) {
					$scope.tradeForm.activeTradeId = resp.data.id;
					if(callBack) {
						callBack();
					}
				} else if (!resp.data.success) {
					$scope.errorMessage = resp.data.message;
				}

			})['finally'](function() {
				$scope.loadingData = false;
			});
		};

		$scope.finalizeSelectProduct = function() {
			$scope.doneSteps.push('step1');
			$scope.stepsValidated['step1'] = true;
			stepsService.steps().next();
		};


		$scope.startStatusThread = function(tradeReq) {


		};


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

        $scope.monthwiseTrendChart.months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

        $scope.getMonthText = function(intValue) {
            return $scope.monthwiseTrendChart.months[intValue].toUpperCase();
        };

        $scope.monthwiseTrendChart.options.chart.xAxis.tickFormat = function(d){
            return $scope.monthwiseTrendChart.months[d].toUpperCase();
        };

        $scope.monthwiseTrendChartSelectableOptions = [];
        $scope.$watch("selectedMonthwiseTrendChart", function(newVal, oldVal) {
          if(newVal) {
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
            $scope.monthwiseTrendChart.options.title.text = ' ';

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
                chartDataObj['values'].push({x:$scope.monthwiseTrendChart.months.indexOf(value.date), y: parseFloat(yValue)});
                if(yValue > maxYValue) {
                  maxYValue = yValue;
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
                    "destinationCountry":699,"endYear":2018
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

            var mdata = JSON.parse('{"Rice, semi-milled or wholly mill...":{"All":[{"productCode":0,"name":"Rice, semi-milled or wholly mill...","region":null,"country":"All","qty":651721059,"value":3.8671000000000024,"price":0,"date":"MAY","qtyUnit":"KGS","originPort":null,"destinationPort":null},{"productCode":0,"name":"Rice, semi-milled or wholly mill...","region":null,"country":"All","qty":35146630,"value":0.14479999999999996,"price":0,"date":"MARCH","qtyUnit":"KGS","originPort":null,"destinationPort":null},{"productCode":0,"name":"Rice, semi-milled or wholly mill...","region":null,"country":"All","qty":764777149,"value":4.985399999999998,"price":0,"date":"FEBRUARY","qtyUnit":"KGS","originPort":null,"destinationPort":null},{"productCode":0,"name":"Rice, semi-milled or wholly mill...","region":null,"country":"All","qty":878395390,"value":6.332789999999994,"price":0,"date":"JANUARY","qtyUnit":"KGS","originPort":null,"destinationPort":null},{"productCode":0,"name":"Rice, semi-milled or wholly mill...","region":null,"country":"All","qty":920372280,"value":6.114299999999994,"price":0,"date":"JUNE","qtyUnit":"KGS","originPort":null,"destinationPort":null},{"productCode":0,"name":"Rice, semi-milled or wholly mill...","region":null,"country":"All","qty":751035868,"value":0.675399999999994,"price":0,"date":"APRIL","qtyUnit":"KGS","originPort":null,"destinationPort":null}]}}');
            $scope.prepareMonthwiseTrendChart(mdata);
		$scope.loadCompanyDetails(false);



    };

    financeApplicationController.$inject = injectParams;
    app.register.controller('financeApplicationController', financeApplicationController);

});
