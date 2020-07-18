'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope','$filter', 'modalService', 'StepsService', '$q'];

    var applyExportPSFinanceController = function ($scope, $location, $routeParams, authService, dataService, $rootScope,$filter, modalService, stepsService, $q) {
        $scope.successMsg = '';
		$scope.doneSteps = [];

		//{step1:{id: 1, name: 'Select Product'},step2:{id: 2, name: 'Select Target Market'},step3:{id: 3, name: 'Select Counterparts'},step4:{id: 4, name: 'Contact Counterparts'}};

		$scope.exportSteps = [{id: 1, name: 'Business Details', step: 'step1'},
            {id: 2, name: 'Risk Assessment', step: 'step2'},
            {id: 3, name: 'Agreement', step: 'step3'},
            {id: 4, name: 'Upload Invoice', step: 'step4'},
            {id: 5, name: 'Shipment', step: 'step5'},
            {id: 6, name: 'Invoice Payment', step: 'step6'},
            {id: 7, name: 'Balance Settlement', step: 'step7'}
            // {id: 7, name: 'Realtime Status', step: 'step7'}
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
		$scope.tradeForm = {'tradeType': $scope.tradeType};
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

		$scope.loadCompanyDetails(false);
    };

    applyExportPSFinanceController.$inject = injectParams;
    app.register.controller('applyExportPSFinanceController', applyExportPSFinanceController);

});
