'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http', '$filter'];

    var globalTradeController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http, $filter) {
       
		$scope.url=$location.search();	
		$scope.loading = false;
		$scope.noProductAdded=false;
		$scope.resultLoaded=false;
		
		$scope.comppro=[];
		$scope.tradeType='export';
		$scope.reportForm = {"frequency":"annual", "period": "2018", productType:'yourProducts',tradeType: $scope.tradeType};
		$scope.reportPayload = {};
		
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
			
			if(!$scope.reportForm.productCode && $scope.selectedProductName && !isNaN($scope.selectedProductName)) {
				$scope.reportForm.productCode = $scope.selectedProductName;
			}
			$scope.reportPayload = {
				"frequency": $scope.reportForm.frequency || "annual",
				"productCode": '' + $scope.reportForm.productCode,
				"period": $scope.reportForm.period || "2017", 
				"sourceLocation": $scope.reportForm.sourceLocation, 
				"targetLocation": $scope.reportForm.targetLocation
			};
			
			if($scope.reportForm.productType === 'yourProducts' && $scope.reportForm.selectedProduct) {
				$scope.reportPayload.productCode = "" + $scope.reportForm.selectedProduct.code;
				$scope.productReportTitle = $scope.reportForm.selectedProduct.name + ' ( ' + $scope.reportForm.selectedProduct.code + ' )';
			} else if ($scope.reportForm.productType === 'newProduct') {
				$scope.reportPayload.productCode = '' + $scope.reportForm.productCode;
				$scope.productReportTitle = $scope.reportForm.name + ' ( ' + $scope.reportForm.productCode + ' )';
			}
			
			
			if($scope.reportPayload.productCode.length == 3 || $scope.reportPayload.productCode.length == 5 ) {
				//$scope.reportPayload.productCode = '0' + $scope.reportPayload.productCode;
			}
			
			if( !$scope.reportPayload.productCode || "undefined" == $scope.reportPayload.productCode || !$scope.reportForm.sourceLocation || !$scope.reportForm.targetLocation) {
				console.log("INVALID QUERY:");
				return;
			}
			
			$scope.reportPayload['logAction']=true;
			$rootScope.loadingData = true;
			
			dataService.getGlobalTradeData($scope.reportForm.tradeType, $scope.reportPayload).then(function(response){
				if(response.success) {
					$scope.productReport = response.data || [];
					$scope.totalTradeValue = 0;
					$scope.showQty = false;
					angular.forEach($scope.productReport, function(value,index) {
						try {
							value['tradeValue'] = parseFloat(value.value);
							$scope.totalTradeValue += value['tradeValue'];
							if(parseFloat(value.qty) > 0) {
								$scope.showQty = true;
							}
						} catch (err) {
							
						};
					});
					$scope.productReport = $filter('orderBy')($scope.productReport, 'tradeValue', true);
					console.log("TOTAL TRADE VALUE: " + $scope.totalTradeValue);
				}		
			})['finally'](function() {
				$rootScope.loadingData = false;
				$scope.resultLoaded=true;
			});
		};
				
		
		
		$scope.loadGraphs = function(chartType, data) {
			//data = {2011: 6131801787,2012: 6660930983,2013: 5248284141,2014: 10800350839};
			$scope.chartData[chartType].labels = [];
			$scope.chartData[chartType].datasets = [];
			$scope.chartData[chartType].title = $scope.productTitle + " " + $scope.chartData[chartType].title;
			var total = 0;
			var segment = {
				fillColor: "rgba(220,220,220,0.2)",
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
				$scope.chartData[chartType]['chart'] = new Chart(ctx).Line($scope.chartData[chartType], {
					responsive : true,
					datasetFill : false
				});
				
			});
		};
		
		
		
		$scope.myOption = {
			options: {
				html: true,
				focusOpen: false,
				onlySelectValid: true,
				source: function (request, response) {
					var data = [];
					$scope.reportForm.productCode = undefined;
					$scope.reportForm.name = '';
					if(request.term && request.term.length > 0) {
						dataService.getProductsForAutocomplete(request.term, 10).then(function(data1){
								if(data1) {
									
									var productNames = data1.data
									angular.forEach(productNames, function(value, index) {
										data.push({
											label: value.id + '-' + value.value,
											value : value.value,
											id: value.id,
											category: 'Products'
										})
									});
									
									response(data);
								}
							});
					}                
				},
				select: function( event, ui ) {
					if(ui.item && ui.item.value && ui.item.value.length > 3) {
						$scope.reportForm.name = ui.item.value;
						$scope.reportForm.productCode = ui.item.id;
						$scope.loadReport();
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
				if($scope.comppro.length>0){
					$scope.selectedProduct=$scope.comppro[0];
					// $scope.reportForm.selectedProduct1=$scope.comppro[0];
					
//                    $scope.getDailyDataExport($scope.selectedProduct.id,$scope.tradeType);
					$scope.reportForm.productCode =  $scope.selectedProduct.code;
					$scope.reportForm.selectedProduct =  $scope.selectedProduct;
					$scope.reportForm.tradeType = $scope.tradeType;
					
					if($scope.reportForm.sourceLocation && $scope.reportForm.targetLocation) {
						$scope.loadReport();
					}
					
				} else{
					$scope.noProductAdded=true;
				}
				$scope.tradeType='export';
				$scope.reportForm.tradeType = $scope.tradeType;
				$scope.companyId=$scope.details[0].id;
			})['finally'](function() {
				$scope.loading = false;
			});
		};


		$scope.tradeTypeChanged=function(tradeType){
			console.log('type changed to  ' + tradeType);
			$scope.reportForm.tradeType = tradeType;
			$scope.loadReport();
		};

		
		$scope.sortBy = function(sortKey) {
			$scope[sortKey] = !$scope[sortKey];
			$scope.productReport = $filter('orderBy')($scope.productReport, sortKey, $scope[sortKey]);
		};

		// $scope.$watch('reportForm', function(newVal, oldVal) {
			// if(newVal && newVal != oldVal) {
				// $scope.productChanged(newVal.selectedProduct1, $scope.tradeType);
			// }
		// }, true);
		
		
		$scope.loadLocations = function() {
			dataService.getGlobalTradeLocations().then(function(response){
					$scope.locations = response.data || [];
					$scope.sourceLocations = angular.copy($scope.locations);
					$scope.targetLocations = angular.copy($scope.locations);
					$scope.reportForm.targetLocation = $scope.targetLocations[0];
					$scope.reportForm.sourceLocation = $scope.sourceLocations[0];
					
					if($scope.reportForm.productCode) {
						$scope.loadReport();
					}
				});
		};
		
		$scope.$watch('reportForm.sourceLocation', function(newVal, oldVal) {
			if(newVal && "all" != newVal.toLowerCase()) {
				var targetLocations = angular.copy($scope.locations);
				var index = targetLocations.indexOf(newVal);
				if(index > 1) {
					targetLocations.splice(index, 1);  
				}
				
				$scope.targetLocations = targetLocations;
			}
		});
		
		$scope.$watch('reportForm.targetLocation', function(newVal, oldVal) {
			if(newVal && "all" != newVal.toLowerCase()) {
				var sourceLocations = angular.copy($scope.locations);
				var index = sourceLocations.indexOf(newVal);
				if(index > 1) {
					sourceLocations.splice(index, 1);  
				}
				
				$scope.sourceLocations = sourceLocations;
			}
		});
		
		$scope.loadLocations();
		$scope.loadCompanyProducts();

    };

    globalTradeController.$inject = injectParams;


    app.register.controller('globalTradeController', globalTradeController);

});