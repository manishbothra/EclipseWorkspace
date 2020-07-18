'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http', '$filter'];

    var financeCalculatorController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http, $filter) {

    	$scope.filterRanges = {};

		//$scope.advanceRate = 80;
		//$scope.factoryCommision = 0.5;

		$scope.filterData = {

				advanceRate : 80,
				factoryCommision : 0.5,
				minInvValue : 100000,
				maxInvValue : 10000000000,
				minDur : 30,
				maxDur : 180,
				minRate : 2,
				maxRate : 20,
				currency : 'USD'
		};

		$scope.filterSearch = function () {
			//$rootScope.loadingData = true;
			console.log('logic');

			$scope.advancedAmount = ($scope.filterData.advanceRate * $scope.filterRanges['invoice'].minValue) / 100;
			$scope.interestAmount = ($scope.advancedAmount * $scope.filterRanges['rate'].minValue * $scope.filterRanges['duration'].minValue) / 360;
			$scope.interestAmount = $scope.interestAmount / 100;
			$scope.commissionAmount = ($scope.filterData.factoryCommision * $scope.filterRanges['invoice'].minValue) / 100;
			$scope.totalAmount = $scope.interestAmount + $scope.commissionAmount;
			$scope.interestAmount = $scope.interestAmount.toFixed(2);
			$scope.totalAmount = $scope.totalAmount.toFixed(2);

		};


		$scope.setSliderValue = function(key, min, max) {
			$scope.$evalAsync( function() {
				$scope.filterData[ 'min' + key ]= min;
				$scope.filterData[ 'max' + key ] = max;
				//$scope.filterData[ key + 'Range'] = newValue1 + "," + newValue2;
			} );

		};

		$scope.qtyValueRangeFilter = function(item) {
			/*if(item.qty < $scope.filterData.minQty || item.qty > $scope.filterData.maxQty) {
				return false;
			}
			if(item.value < $scope.filterData.minValue || item.value > $scope.filterData.maxValue) {
				return false;
			}*/
			return true;
		};


		$scope.sliderInitialized = false;
		var qtyRangeSlider;

		$scope.initializeFilter = function (filterData) {

			$scope.filterRanges = filterData;
			console.log("filters:: ",$scope.filterRanges);

			var optionSlider = {
				minValue: 1,
				maxValue: 8,
				options: {
						ceil: 10,
						floor: 0,
						//step : 10000,
						draggableRange: true,
						showSelectionBarEnd : true
					}
			};

			var optionInvoice = angular.copy(optionSlider);
			optionInvoice.options['onEnd'] = function(sliderId, modelValue, highValue) {

				if($scope.filterInitialized) {
					$scope.setSliderValue('invoice', modelValue, highValue);
				}
			};


			var optionDuration = angular.copy(optionSlider);
			optionDuration.options['onEnd'] = function(sliderId, modelValue, highValue) {

				if($scope.filterInitialized) {
					$scope.setSliderValue('Value', modelValue, highValue);
				}
			};

//			optionValue.options['translate'] = function (value) {
//					return 'Rs. ' + value + " M";
//				};

			var optionRate = angular.copy(optionSlider);
			optionRate.options['onEnd'] = function(sliderId, modelValue, highValue) {

				if($scope.filterInitialized) {
					$scope.setSliderValue('Value', modelValue, highValue);
				}
			};

			optionInvoice.minValue = $scope.filterRanges.minInvValue;
			optionInvoice.maxValue = $scope.filterRanges.maxInvValue;
			optionInvoice.options.ceil = $scope.filterRanges.maxInvValue;
			optionInvoice.options.floor = $scope.filterRanges.minInvValue;
			optionInvoice.options.step = 25000;

			optionDuration.minValue = $scope.filterRanges.minDur;
			optionDuration.maxValue = $scope.filterRanges.maxDur;
			optionDuration.options.ceil = $scope.filterRanges.maxDur;
			optionDuration.options.floor = $scope.filterRanges.minDur;

			optionRate.minValue = $scope.filterRanges.minRate;
			optionRate.maxValue = $scope.filterRanges.maxRate;
			optionRate.options.ceil = $scope.filterRanges.maxRate;
			optionRate.options.floor = $scope.filterRanges.minRate;

			$scope.filterRanges['invoice']=optionInvoice;
			$scope.filterRanges['duration']=optionDuration;
			$scope.filterRanges['rate']=optionRate;

			$scope.filterInitialized = true;
			$scope.sliderInitialized = true;

			$scope.filterSearch();
			$rootScope.loadingData = false;
		};

		$scope.initializeFilter($scope.filterData);

		$scope.$watch("filterData", function(newVal, oldVal){
			//console.log("RM:Success:", newVal);
			if(newVal != oldVal && $scope.filterInitialized) {
				$scope.filterSearch();
			}
		}, true);

    };

    financeCalculatorController.$inject = injectParams;
    app.register.controller('financeCalculatorController', financeCalculatorController);

});
