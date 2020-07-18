'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', 'modalService','$filter'];

    var shipmentBookingController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, modalService,$filter) {
        $scope.successMsg = '';
		
		$scope.dateModal = {};
		
		$scope.dateOptions = {
			startingDay: 1,
			showWeeks: false,
			// maxDate: new Date(),
			minDate: new Date(),
		};
		
		$scope.freightForm = {originPort:'INNSA', destinationPort:'AESHJ', loadType:'container20',commodity:'Rice', quantity:1,containterType:'standard'};
		
		$scope.disabled = function(date, mode) {
			return false;
		};
		
		$scope.openDateModal = function($event, elementOpened) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.dateModal[elementOpened] = !$scope.dateModal[elementOpened];
		};
		
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
						$scope.freightForm.originPortLabel = ui.item.value + '-' + ui.item.name;
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
		
		$scope.getFreightRates = function(isValidFormData) {
			if(isValidFormData) {
				$rootScope.loadingData = true;
				dataService.getFreightCharges($scope.freightForm).then(function(response) {
					if(response.data.success) {
						$scope.freightResultList = response.data.data || [];
						$scope.getFreightTrends();
					}
					
				})['finally'](function() {
					$rootScope.loadingData = false;
				});	

			}
		};		
		
		$scope.showFinishFreightBookingDialog = function() {
			 modalService.showInfoMessage('Success!', 
				'You have successfully placed your request for booking this shipment.', 'View your bookings').then(function(result) {
				if (result === 'ok') {
					$location.path('/bookings');
				}
			});
		};
		
		
		$scope.bookContainer = function(freight) {
			if(freight) {
				var fbPayload = {
					freightRate: freight,
					shippingLineId: freight.shippingLine.shippingLineId
				};
				if(!freight.sailingDate) {
					freight.sailingDate = $scope.freightForm.sailingDate;
				}
				$rootScope.loadingData = true;
				dataService.bookShipment(fbPayload).then(function(response) {
					if(response.data.success) {
						$scope.showFinishFreightBookingDialog();
					}
					
				})['finally'](function() {
					$rootScope.loadingData = false;
				});
				
			}
			
		};
		
		$scope.showCostBreakDown = function(freight) {
			var modalDefaults = {
				backdrop: true,
				keyboard: true,
				modalFade: true,
				templateUrl: 'app/c2iapp/partials/modal-freight-cost-breakup.html',
				scope: $scope
			};
				
				
			var modalOptions = {
				closeButtonText: 'Close',
				actionButtonText: 'OK',
				headerText: 'Cost Breakdown',
				bodyText: '',
				tempSelFreight: freight
			};
			
			modalService.show(modalDefaults, modalOptions).then(function(result) {
				if (result === 'ok') {
					
				}
			});
			
		};
		
		$scope.getFreightTrends = function() {
			var payload = angular.copy($scope.freightForm);
			delete payload['sailingDate'] ;
			dataService.getFreightRatesTrend(payload).then(function(response) {
					if(response.data.success) {
						$scope.freightTrends = response.data.data || {};

						angular.forEach($scope.freightResultList, function(val, idx) {
							var shl = val.shippingLine.name;
							var trendData = $scope.freightTrends[shl];
							if(trendData) {
								$scope.loadGraphs('valueChart', shl, trendData, 'value');
							}
						});						
					}
					
				})['finally'](function() {
					$rootScope.loadingData = false;
				});
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
		
		$scope.loadGraphs = function(chartType, shippingLine, trendData, typeValue) {
			//data = {2011: 6131801787,2012: 6660930983,2013: 5248284141,2014: 10800350839};
			var key = shippingLine;
			if($scope.chartData[key] && $scope.chartData[key][chartType] && $scope.chartData[key][chartType]['chart']) {
				$scope.chartData[key][chartType]['chart'].update();
				$scope.chartData[key][chartType]['chart'].destroy();
			}
				
			$scope.chartData[key] = {};
			$scope.chartData[key][chartType] = {};
			$scope.chartData[key][chartType].labels = [];
			$scope.chartData[key][chartType].datasets = [];
			$scope.chartData[key][chartType].title = typeValue + " trend"; // $scope.productTitle + " export " +
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
			
			angular.forEach(trendData, function(value, idx) {
				$scope.chartData[key][chartType].labels.push(value.rateStartDate);
				segment.data.push(value.minAmount);
			});
			
			//$scope.chartData[chartType].labels.reverse();
			//segment.data.reverse();
			$scope.chartData[key][chartType].datasets.push(segment);
			
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
						data: $scope.chartData[key][chartType],
						type: 'line',
						options: {
							//responsive : true,
							//maintainAspectRatio: false,
							scales: {
								yAxes: [{
									ticks: {
										beginAtZero:true
									},
									scaleLabel: {
										 display: true,
										 labelString: 'Freight Rate ($)',
										 fontSize: 12 
									  }
								}]            
							},  
							datasetFill : false,
							legend: {display:false},
							layout: {
								padding: {
									left: 0,
									right: 0,
									top: 10,
									bottom: 0
								}
							}
						}
					});
					
				});
				}
			});			
		};
		
		
    };

    shipmentBookingController.$inject = injectParams;
    app.register.controller('shipmentBookingController', shipmentBookingController);

});