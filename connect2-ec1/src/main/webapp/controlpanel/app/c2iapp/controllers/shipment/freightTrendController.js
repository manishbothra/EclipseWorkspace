'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', 'modalService','$filter'];

    var freightTrendController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, modalService,$filter) {
        $scope.successMsg = '';
		$scope.freightForm = {originPort:'INNSA', destinationPort:'AESHJ', loadType:'container20',commodity:'pulses',containterType:'standard'};
		
		var ldate = moment().subtract('days',30).format("MM/DD/YYYY");
		$scope.calendarDateRange = ldate + "-" + moment().format("MM/DD/YYYY");
		
		$scope.originPlaceAutoComplete = {
			options: {
				html: true,
				focusOpen: false,
				onlySelectValid: false,
				source: function (request, response) {
					var data = [];
					
					if(request.term && request.term.length > 1) {
						
						dataService.getFreightPlaceAutoComplete(request.term, undefined,'origin', 10).then(function(data1){
							if(data1) {
								var productNames = data1.data.places;
								angular.forEach(productNames, function(value, index) {
									data.push({
										label: value.parentValue,
										value : value.value,
										name : value.parentValue,
										country : value.type,
										category: 'Places'
									});
								});									
								response(data);
							}
						});							  
					}                
				},
				select: function( event, ui ) {
					if(ui.item && ui.item.value && ui.item.value.length > 3) {
						$scope.freightForm.originPort = ui.item.value;
						$scope.freightForm.originCountry = ui.item.country;
					}				
				}
			},
			methods: {}
		};
		
		$scope.destPlacesAutoComplete = {
			options: {
				html: true,
				focusOpen: false,
				onlySelectValid: false,
				source: function (request, response) {
					var data = [];
					
					if(request.term && request.term.length > 1) {
						
						dataService.getFreightPlaceAutoComplete(request.term, $scope.freightForm.originCountry, 'dest', 10).then(function(data1){
							if(data1) {
								var productNames = data1.data.places;
								angular.forEach(productNames, function(value, index) {
									data.push({
										label: value.parentValue,
										value : value.value,
										name : value.parentValue,
										country : value.type,
										category: 'Places'
									});
								});									
								response(data);
							}
						});							  
					}                
				},
				select: function( event, ui ) {
					if(ui.item && ui.item.value && ui.item.value.length > 3) {
						$scope.freightForm.destinationPort = ui.item.value;
					}				
				}
			},
			methods: {}
		};
		
		var DATE_FORMAT_SLASH = "MM/DD/YYYY";
		var DATE_FORMAT_DASH = "YYYY-MM-DD";
		$scope.dateRangeChanged = function(fromDate, toDate) {
			console.log("date range changed: ", fromDate, toDate);
			var dateRange = fromDate.format(DATE_FORMAT_SLASH) + '-' + toDate.format(DATE_FORMAT_SLASH);
			$scope.searchCriteriaFriendlyDuration = fromDate.format(DATE_FORMAT_DASH) + '/' + toDate.format(DATE_FORMAT_DASH);
			$scope.freightForm.rateStartDate = fromDate;
			$scope.freightForm.rateEndDate = toDate;
		};
		
		$scope.getFreightTrends = function(isValidFormData) {
			if(isValidFormData) {
				$rootScope.loadingData = true;
				dataService.getFreightRatesTrend($scope.freightForm).then(function(response) {
					if(response.data.success) {
						$scope.freightResultList = response.data.data || [];
						$scope.loadGraphs('valueChart', $scope.freightResultList, 'value');
					}
					
				})['finally'](function() {
					$rootScope.loadingData = false;
				});;				
			}
		};
				
		$scope.chartData = {
			valueChart: {
				labels : [],
				datasets : [],
				title:' Freight Rate Trend (value in USD)'
			}
		};
		
		var colors = ["#EF9380","#41b3a3","#85dcb"];
		
		$scope.loadGraphs = function(chartType, trends, typeValue) {
			var key = 'trendData';
				
			$scope.chartData[key] = {};
			$scope.chartData[key][chartType] = {};
			$scope.chartData[key][chartType].labels = [];
			$scope.chartData[key][chartType].datasets = [];
			$scope.chartData[key][chartType].title = typeValue + " trend";
			
			var dataSample = {
				label: "",
				fill: false,
				fillColor: "rgba(220,220,220,0.2)",
				backgroundColor: "#EF9380",
				strokeColor: "#EF9380",
				pointColor: "#C1290A",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: []			
			};
			
			var ci = 0;
			angular.forEach(trends, function(stats, key){
				var dt = angular.copy(dataSample);
				dt.label = key;
				dt.data = [];
				if(ci >= colors.length) {
					ci = 0;
				}
				dt.strokeColor = colors[ci];
				dt.backgroundColor = colors[ci];
				dt.borderColor = colors[ci];
				angular.forEach(stats, function(value, idx) {
					$scope.chartData['trendData'][chartType].labels.push(value.rateStartDate);
					dt.data.push(value.minAmount);
				});
				$scope.chartData['trendData'][chartType].datasets.push(dt);
				ci++;
			});
			
			var options = {  
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						},
						scaleLabel: {
							 display: true,
							 labelString: 'Freight Rate ($)',
							 fontSize: 15 
						  }
					}]            
				},  
				datasetFill : false, 
				layout: {
					padding: {
						left: 0,
						right: 0,
						top: 0,
						bottom: 20
					}
				}
			};
			
			console.log($scope.chartData[key][chartType]);
			$scope.$watch(function() {
				if(document.getElementById("canvas-"+chartType + '-' + key)) {
					return true;
				} else {
					return false;
				}
			}, function(newVal, oldVal) {
				if(newVal) { // && newVal != oldVal
					$scope.$evalAsync(function() {
						var ctx = document.getElementById("canvas-"+chartType + '-' + key).getContext("2d");
						$scope.chartData[key][chartType]['chart'] = new Chart(ctx, {
							type: 'line',
							data: $scope.chartData[key][chartType],
							options: options
							
						});
					});
				}
			});			
		};
		
		
    };

    freightTrendController.$inject = injectParams;
    app.register.controller('freightTrendController', freightTrendController);

});