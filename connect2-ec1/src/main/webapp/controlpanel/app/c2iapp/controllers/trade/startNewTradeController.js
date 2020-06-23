'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope','$filter', 'modalService', 'StepsService', '$q'];

    var addNewProductController = function ($scope, $location, $routeParams, authService, dataService, $rootScope,$filter, modalService, stepsService, $q) {
        $scope.successMsg = '';
		$scope.doneSteps = [];

		//{step1:{id: 1, name: 'Select Product'},step2:{id: 2, name: 'Select Target Market'},step3:{id: 3, name: 'Select Counterparts'},step4:{id: 4, name: 'Contact Counterparts'}};

		$scope.exportSteps = [{id: 1, name: 'Find Target Market', step: 'step1'}
        ,{id: 2, name: 'Identify trade counterparts', step: 'step2'}
        ,{id: 3, name: 'Arrange Export Orders', step: 'step3'}
		,{id: 4, name: 'Get Purchase Order', step: 'step4'}
        ,{id: 5, name: 'Complete Pre-Shipment Activities', step: 'step5'}
        ,{id: 6, name: 'Arrange Logistics', step: 'step6'}
		,{id: 7, name: 'Secure Payment', step: 'step7'}];
		$scope.importSteps = $scope.exportSteps;
		$scope.stepMaps = {
			'export': $scope.exportSteps,
			'import': $scope.importSteps
		};
		$scope.selectedTradeId = $routeParams.id;
		$scope.c2iRecommendedProduct=undefined;
		$scope.tradeType = $routeParams.tradeType || 'export';
		$scope.pageTitle = 'Start New Trade';
		$scope.tradeForm = {'tradeType': $scope.tradeType};
		$scope.recommendations = {};
		$scope.recommendations.productRecommendationType = 'recommended';
		$scope.recommendedCountries = [];
		$scope.recommendedCounterparts = [];
		$scope.recommendedLeads = [];
		$scope.stepsValidated = {};
		$scope.priceForm = {};
		$scope.allCurrencies = ['INR', 'USD', 'GBP', 'EUR', 'AUD'];
		$scope.priceForm.localPriceCurrency = $scope.allCurrencies[1];

		$scope.contactForm = {};
		$scope.contactableCounterparts = [];
		$scope.allUnits = dataService.getAllProductUnits();

		$scope.isStepDone = function (step){
			return true; //$scope.doneSteps.indexOf(step) >= 0;
		};

		$scope.setSelectedStep = function(step) {
			if($scope.isStepDone(step)) {
				$scope.selectedStep = step;
			}
		};

		$scope.setPageTitle = function() {
			if($scope.editTradeFlow) {
				if('export' == $scope.tradeType) {
					$scope.pageTitle = 'Update Export - ' +  $scope.tradeForm.productName + '(Trade Id: ' + $scope.tradeForm.activeTradeId+ ')';
				} else if('import' == $scope.tradeType) {
					$scope.pageTitle = 'Update Import - ' +  $scope.tradeForm.productName + '(Trade Id: ' + $scope.tradeForm.activeTradeId+ ')'
				}
			} else {
				if('export' == $scope.tradeType) {
					$scope.pageTitle = 'Start New Export';
				} else if('import' == $scope.tradeType) {
					$scope.pageTitle = 'Start New Import';
				}
			}

		};


		$scope.loadRecommendedProducts = function () {
			$rootScope.loadingData = true;
			$rootScope.busyMsg = 'Loading recommended products for you.';
			var criteria = {type: 'product', tradeType: $scope.tradeType};
			dataService.getTradeRecommendations(criteria).then(function(resp) {
				var data = resp.data.data;
				if(data && data.length > 0) {

					$scope.companyOtherProducts = data;
					if($scope.tradeForm.productId > 0) {
						if('recommended' === $scope.tradeForm.productSelectionType) {
							$scope.c2iRecommendedProduct = $filter('filter')(data, {id: $scope.tradeForm.productId})[0];
							//$scope.companyOtherProducts.splice($scope.c2iRecommendedProduct, 1);
							$scope.recommendations.productRecommendationType = 'recommended';
						} else {
							$scope.recommendations.userSelectedProduct = $filter('filter')(data, {id: $scope.tradeForm.productId})[0];
							$scope.recommendations.productRecommendationType = 'userSelected';
						}
					} else {
						$scope.c2iRecommendedProduct = data[0];
						//$scope.companyOtherProducts.splice($scope.c2iRecommendedProduct, 1);
						$scope.recommendations.productRecommendationType = 'recommended';
					}

				}

			})['finally'](function(){
				$rootScope.loadingData = false;
				$rootScope.busyMsg = 'Please wait...';
			});

            if($scope.editTradeFlow && $scope.tradeForm.hsCode) {
                $scope.loadRecommendedTargetMarkets();
            }
		};

        if($scope.selectedTradeId) {
			dataService.getOngoingTradeDetails($scope.selectedTradeId).then(function(resp) {
				$scope.tradeForm = resp.data.data;
				$scope.tradeType = $scope.tradeForm.tradeType;
				$scope.editTradeFlow = true;
				$scope.setPageTitle();
				var ss = $filter('filter')($scope.stepMaps[$scope.tradeType], {id : $scope.tradeForm.currentStep})[0];
				if(ss) {
					//Object.keys($scope.stepMaps).length
					$scope.selectedStep = 'step' + ((ss.id + 1) >= $scope.exportSteps.length ? ss.id: ss.id + 1);
					for(var i = 1; i <= ss.id; i++) {
						$scope.doneSteps.push('step' + i);
					}
				} else {
                    $scope.selectedStep = 'step1'
                }
			});
		} else {
			$scope.setPageTitle();
    		$scope.selectedStep = 'step1';
            $scope.loadRecommendedProducts();
		}

		$scope.loadRecommendedTargetMarkets = function () {
			$rootScope.loadingData = true;
			$rootScope.busyMsg = 'Finding best target market for your product.';
			var criteria = {
						type: 'country',
						tradeType: $scope.tradeType,
						hsCode: $scope.tradeForm.hsCode,
						productId: $scope.tradeForm.productId,
						loadDetailedStats : true
					};
			dataService.getTradeRecommendations(criteria).then(function(resp) {
				var data = resp.data.data;
				$scope.recommendedCountries = [];
				//$scope.tradeForm.targetCountries = [];
				if(data && data.length > 0) {
					var editFlow = $scope.tradeForm.targetCountries && $scope.tradeForm.targetCountries.length > 0;
					angular.forEach(data, function(country, idx) {
						if(editFlow) {
							var alreadySelected = $filter('filter')($scope.tradeForm.targetCountries, {name: country.country})[0];
							if(alreadySelected) {
								country.selected = true;
							}
						} else {
							$scope.selectTargetMarget(country);
						}
						if(country.stats) {
							//fix the year order.
							var stats = [];
							angular.forEach(country.stats, function(val, key) {
								stats.push(val);
							});

							stats = $filter('orderBy')(stats, 'year', true);
							country['stats'] = stats;
						}
						$scope.recommendedCountries.push(country);
						$scope.loadGraphs('valueChart', country, 'value');
					});
				}
			})['finally'](function(){
				$rootScope.loadingData = false;
				$rootScope.busyMsg = 'Please wait...';
			});
		};

		$scope.loadRecommendedCounterparts = function () {
			$rootScope.loadingData = true;
			$rootScope.busyMsg = 'Getting best counterparts from 2 Million+ counterparts.';
			var tcs = [];
			angular.forEach($scope.tradeForm.targetCountries, function(country, index) {
				tcs.push(country.name);
			});
			var criteria = {
						type: 'counterparts|leads',
						tradeType: $scope.tradeType,
						hsCode: $scope.tradeForm.hsCode,
						productId: $scope.tradeForm.productId,
						countries: tcs
					};

			$scope.recommendedCounterparts = [];
			if($scope.tradeForm.targetCounterparts) {
				angular.forEach($scope.tradeForm.targetCounterparts, function(cp, idx) {
					var cm = {id: cp.companyId, name:cp.companyName, country:cp.country, selected: true};
					if(!cp.dateContacted) {
						cp.contactable = true;
						cp.contacted = false;
					} else {
						cp.contacted = true;
					}
					cp.selected = true;
					$scope.recommendedCounterparts.push(cp);
				});
			}
			dataService.getTradeRecommendations(criteria).then(function(resp) {
				var data = resp.data.counterparts;
				var leads = resp.data.leads || [];
				if(data && data.length > 0) {
					var editFlow = $scope.tradeForm.targetCounterparts && $scope.tradeForm.targetCounterparts.length > 0;
					angular.forEach(data, function(cont, idx) {
						if(editFlow) {
							var alreadySelected = $filter('filter')($scope.tradeForm.targetCounterparts, {companyId: cont.id})[0];
							if(alreadySelected) {
								cont.selected = true;
								alreadySelected.counterpartBehavior = cont.counterpartBehavior;
								alreadySelected.counterpartPrediction = cont.counterpartPrediction;
								alreadySelected.counterpartRisk = cont.counterpartRisk;
								alreadySelected.counterpartSentiment = cont.counterpartSentiment;
							} else {
								$scope.recommendedCounterparts.push(cont);
							}
						} else {
							$scope.selectCounterpart(cont);
							$scope.recommendedCounterparts.push(cont);
						}
					});
				}

				angular.forEach(leads, function(cont, idx) {
					var fcp = {id: cont.companyId, name: cont.companyName, country: cont.country};
					if(editFlow) {
						var alreadySelected = $filter('filter')($scope.tradeForm.targetCounterparts, {companyId: fcp.id})[0];
						if(alreadySelected) {
							fcp.selected = true;
						} else {
							$scope.recommendedLeads.push(fcp);
						}
					} else {
						$scope.selectCounterpart(fcp);
						$scope.recommendedLeads.push(fcp);
					}
				});

			})['finally'](function(){
				$rootScope.loadingData = false;
				$rootScope.busyMsg = 'Please wait...';
			});
		};

		$scope.isContacted = function(comp) {
			var cn = false;
			if($scope.tradeRequestHistory && $filter('filter')($scope.tradeRequestHistory, {companyId: comp.companyId})[0]) {
				cn = true;
				comp.contacted = true;
				comp.contactable = false;
			}

			return cn;
		};

		$scope.isNotContactedYet = function(comp) {
			return !$scope.isContacted(comp);
		};

		$scope.loadContactRequestHistory = function() {
			dataService.getTradeContactRequests($scope.tradeForm).then(function(resp) {
				if(resp.data.success) {
					$scope.tradeRequestHistory = resp.data.data;
				}

			});
		};

        $scope.loadPurchaseOders = function() {
			dataService.getTradePurchaseOrder($scope.tradeForm).then(function(resp) {
				if(resp.data.success) {
					$scope.tradePurchaseOrders = resp.data.data || [];
                    angular.forEach($scope.tradePurchaseOrders, function(val, index) {
                        $scope.getPOFileURL(val);
                    });
				}

			});
		};

		$scope.$watch('selectedStep', function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				if('step1' == newVal && !$scope.stepsValidated['step1']) {
					$scope.loadRecommendedProducts();
				} else if('step2' == newVal && !$scope.stepsValidated['step2']) {
					$scope.loadRecommendedCounterparts();
				} else if('step3' == newVal && !$scope.stepsValidated['step3']) {
					$scope.priceForm.originPort = $scope.tradeForm.originPort;
					$scope.priceForm.userPrice = $scope.tradeForm.userPrice;
					$scope.priceForm.userQty = $scope.tradeForm.userQty;
					$scope.priceForm.numberOfContainers = $scope.tradeForm.numberOfContainers;
					$scope.priceForm.qtyUnit = $scope.tradeForm.qtyUnit;
					$scope.priceForm.containerSize = $scope.tradeForm.containerSize;
					if($scope.priceForm.userPrice > 0) {
						$scope.calculatePrice(true);
                        $scope.userPriceSet = true;
					}
					$scope.loadPriceTrend();
                    if($scope.editTradeFlow) {
                        $scope.loadContactRequestHistory();
                    }
				} else if('step4' == newVal && !$scope.stepsValidated['step4']) {
                    if($scope.editTradeFlow){
                        $scope.loadPurchaseOders();
                    }
				} else if('step6' == newVal && !$scope.stepsValidated['step6']) {
                    $scope.TrackerList();
                    if($scope.editTradeFlow && $scope.tradeForm.shipmentBooked && $scope.tradeForm.shipmentBooked.bookingId > 0){
                        $scope.loadShipments( $scope.tradeForm.shipmentBooked.bookingId);
                    }
				}
			}
		});

		$scope.goToPrevStep = function() {
			stepsService.steps().previous();
			console.log('back step');
		};

		$scope.selectTargetMarget = function(country) {
			if(!$scope.tradeForm.targetCountries) {
				$scope.tradeForm.targetCountries = [];
			}

			var tm = {type:'country', name: country.country};
			$scope.tradeForm.targetCountries.push(tm);
			country['selected'] = true;
		};

		$scope.removeTargetMarget = function(country) {
			if($scope.tradeForm.targetCountries && $scope.tradeForm.targetCountries.length > 0) {
				var rtm = $filter('filter')($scope.tradeForm.targetCountries, {name: country.country})[0];
				var indx = $scope.tradeForm.targetCountries.indexOf(rtm);
				if(indx >= 0) {
					$scope.tradeForm.targetCountries.splice(indx, 1);
				}
				country['selected'] = false;
			}
		};

		$scope.selectCounterpart = function(comp) {
			if(!$scope.tradeForm.targetCounterparts) {
				$scope.tradeForm.targetCounterparts = [];
			}
			var cp = {companyId: comp.id, companyName: comp.name, country: comp.country, lastTradeMonth: comp.lastTradeMonth};
			var selected = $filter('filter')($scope.tradeForm.targetCounterparts, {companyId: comp.id})[0];
			if(!selected) {
				cp.contactable = true;
				$scope.tradeForm.targetCounterparts.push(cp);
			}
			comp['selected'] = true;
		};

		$scope.selectCounterpartToContact = function(comp, selected) {
			comp['contactable'] = selected;
		};

		$scope.removeCounterpart = function(comp) {
			if($scope.tradeForm.targetCounterparts && $scope.tradeForm.targetCounterparts.length > 0) {
				var rcp = $filter('filter')($scope.tradeForm.targetCounterparts, {companyId: comp.id})[0];
				if(rcp) {
					var indx = $scope.tradeForm.targetCounterparts.indexOf(rcp);
					$scope.tradeForm.targetCounterparts.splice(indx, 1);
				}
				comp['selected'] = false;
			}
		};

		$scope.validateAndSubmitTargetMarket = function() {
			if(!$scope.tradeForm.targetCountries || $scope.tradeForm.targetCountries.length == 0) {
				$scope.errorMessage = 'Please select at least one target market.';
			} else {
				$scope.updateCurrentTrade($scope.finalizeSelectTargetMarket);
			}
		};

		$scope.validateAndSubmitCounterparts = function() {
			if(!$scope.tradeForm.targetCounterparts || $scope.tradeForm.targetCounterparts.length == 0) {
				$scope.errorMessage = 'Please select at least one counterpart.';
			} else {
				$scope.updateCurrentTrade($scope.finalizeSelectTargetCounterparts);
			}
		};

		$scope.validateAndSubmitPrice = function() {
			if(!$scope.priceForm.userPrice) {
				$scope.errorMessage = 'Please set price for your product.';
			} else {
				$scope.updateCurrentTrade($scope.finalizePriceSetup);
			}
		};

		$scope.validateAndSubmitContacts = function() {
			if(!$scope.priceForm.userPrice && !$scope.userPriceSet) {
				$scope.errorMessage = 'Please set price for your product.';
			} else {
                $scope.doneSteps.push('step3');
    			$scope.stepsValidated['step3'] = true;
    			stepsService.steps().next();;
			}
		};

        $scope.goToNextStep = function() {
            $scope.doneSteps.push($scope.selectedStep);
            $scope.stepsValidated[$scope.selectedStep] = true;
            stepsService.steps().next();
        };

		$scope.validateAndSubmit = function() {
            var valid = false;
            if($scope.selectedStep == 'step4')  {
                if($scope.tradePurchaseOrders && $scope.tradePurchaseOrders.length > 0) {
                    valid = true;
                } else {
                    valid = false;
                    $scope.errorMessage = 'This step is not yet completed.';
                }
            } else {
                valid = true;
            }
			if(valid) {
                $scope.updateCurrentTrade($scope.goToNextStep, true);
			}
		};

		$scope.updateCurrentTrade = function(callBack, udateOnlyStep) {
			$scope.loadingData = true;
			if(!$scope.tradeForm.tradeType) {
				$scope.tradeForm.tradeType = $scope.tradeType;
			}
			var currentTradeStep = $filter('filter')($scope.stepMaps[$scope.tradeType], {step: $scope.selectedStep})[0];
			$scope.tradeForm.currentStep = currentTradeStep.id;
			$scope.tradeForm.currentStepName = currentTradeStep.name;
            var payload = $scope.tradeForm
            if(udateOnlyStep) {
                payload = {activeTradeId: $scope.tradeForm.activeTradeId,
                        currentStep: $scope.tradeForm.currentStep, currentStepName: $scope.tradeForm.currentStepName};
            }
			dataService.updateOngoingTradeDetails(payload).then(function(resp) {
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
			$scope.productSelected=true;
            $scope.loadRecommendedTargetMarkets();
		};

		$scope.finalizeSelectTargetMarket = function() {
            if(!$scope.editTradeFlow && $scope.tradeForm.activeTradeId > 0) {
                $location.path(/update-trade/ + $scope.tradeForm.activeTradeId);
            } else {
    			$scope.doneSteps.push('step1');
    			$scope.stepsValidated['step1'] = true;
    			stepsService.steps().next();
            }
		};

		$scope.finalizePriceSetup = function() {
			$scope.userPriceSet=true;
			//$scope.doneSteps.push('step3');
			//$scope.stepsValidated['step3'] = true;
			//stepsService.steps().next();
		};

		$scope.finalizeSelectTargetCounterparts = function() {
			$scope.doneSteps.push('step2');
			$scope.stepsValidated['step2'] = true;
			stepsService.steps().next();
		};

		$scope.startStatusThread = function(tradeReq) {


		};

		$scope.validateAndSubmitProduct = function () {
			$scope.errorMessage = '';
            var isValid = $scope.recommendations.userSelectedProduct || $scope.c2iRecommendedProduct;
			console.log(isValid);
			if(isValid) {
				var selectedProd = undefined;
				if($scope.recommendations.productRecommendationType == 'userSelected') {
					selectedProd = $scope.recommendations.userSelectedProduct;
					$scope.tradeForm.productSelectionType = 'userSelected';
				} else if($scope.recommendations.productRecommendationType == 'recommended') {
					selectedProd = $scope.c2iRecommendedProduct;
					$scope.tradeForm.productSelectionType = 'recommended';
				}
				if(selectedProd) {
					$scope.tradeForm.productId = selectedProd.id;
					$scope.tradeForm.productName = selectedProd.name;
					if(selectedProd.hsCode) {
						$scope.tradeForm.hsCode = '' + selectedProd.hsCode;
					}
				}
				if($scope.tradeForm.productId > 0) {
					// $scope.updateCurrentTrade($scope.finalizeSelectProduct);
                    $scope.finalizeSelectProduct();
				} else {
					$scope.errorMessage = 'Please select a product.';
				}
			} else {
				$scope.errorMessage = 'Please select a product.';
			}
		};

		$scope.showContactBtn = function() {
			var show = false;
			angular.forEach($scope.tradeForm.targetCounterparts, function(cp, idx) {
				if(!$scope.isContacted(cp)) {
					show = true;
				}
			});

			return show;
		};

		$scope.showContactForm = function() {
			$scope.showContactFormLayout = true;
		};

		$scope.contactCounterpart = function(comp) {

		};

		$scope.contactAllCounterparts = function() {
			var cpsToContact = [];
			if($scope.tradeForm.targetCounterparts) {
				angular.forEach($scope.tradeForm.targetCounterparts, function(cp, index) {
					if(!cp.contacted && cp.contactable) {
						cpsToContact.push(cp);
					}
				});

				if(cpsToContact.length > 0) {
					$rootScope.loadingData = true;
					$rootScope.busyMsg = 'Contacting counterparts...';
					var payload = angular.copy($scope.contactForm);
					payload.activeTrade = $scope.tradeForm;
					payload.activeTrade.targetCounterparts = cpsToContact;

					dataService.contactTradeCounterparts(payload).then(function(resp) {
						if(resp.data.success) {
							$scope.successMsg = 'Successfully contacted the selected counterparts';
							$scope.showContactFormLayout = false;
							$scope.loadContactRequestHistory();
						}
					})['finally'](function() {
						$rootScope.loadingData = false;
					})['finally'](function(){
						$rootScope.loadingData = false;
						$rootScope.busyMsg = 'Please wait...';
					});
				} else {
					console.log('Nothing to contact.');
				}
			}
		};

		$scope.changeTemplate = function() {
			var params = {};
			params.productName = $scope.tradeForm.productName;
			params.productId = $scope.tradeForm.productId;
			params.hsCode = $scope.tradeForm.hsCode;
			dataService.getImportersContactTemplate($scope.contactForm['templateId'], params).then(function (response) {
				$scope.templateData = response.data.templateData;
				$scope.contactForm['message'] = $scope.templateData;
				$scope.showContactCompanyForm = true;
				$('html,body').animate({scrollTop: $("#divContactContainer").offset().top - 50}, 'slow');
			});

		};

		$scope.loadCompanyDetails = function(reload){
			$rootScope.loadingData = true;
			authService.getControlPanelDetails(reload).then(function(response) {
				$scope.companyProfile = response.data[0];
				$scope.user=$scope.companyProfile.userDetails.user;
				$scope.companyProducts = $scope.companyProfile.companyProducts.products;
			})['finally'](function () {
				$rootScope.loadingData = false;
			});
		};

		/* *price related **/
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
						$scope.priceForm.originPort = ui.item.value;
						$scope.priceForm.originCountry = ui.item.country;
					}
				}
			},
			methods: {}
		};

		$scope.calculatePrice = function(isValid) {
            $scope.errorMessage = '';
			if(isValid){
				if($scope.priceForm){
                    if($scope.priceForm.userPrice < 1) {
                        $scope.errorMessage = 'Invalid User price.';
                        return;
                    } else if($scope.priceForm.userQty < 1) {
                        $scope.errorMessage = 'Enter a valid quantity.';
                        return;
                    } else if($scope.priceForm.numberOfContainers < 1) {
                        $scope.errorMessage = 'Enter a valid number of container.';
                        return;
                    }
					$rootScope.loadingData = true;
					$rootScope.busyMsg = 'Calculating freight charges and taxes...';

					$scope.tradeForm.originPort = $scope.priceForm.originPort;
					$scope.tradeForm.userPrice = $scope.priceForm.userPrice;
					$scope.tradeForm.userQty = $scope.priceForm.userQty;
					$scope.tradeForm.numberOfContainers = $scope.priceForm.numberOfContainers;
					$scope.tradeForm.qtyUnit = $scope.priceForm.qtyUnit;
					$scope.tradeForm.containerSize = $scope.priceForm.containerSize;
					$scope.priceDataLoading = true;
					dataService.getPriceForActiveTrade($scope.tradeForm)
					.then(function(resp){
						//process and set in $scope.calculatedPrices
						$scope.calculatedPrices = resp.data.data || [];
					})['finally'](function() {
						$rootScope.loadingData = false;
						$scope.priceDataLoading = false;
						$rootScope.busyMsg = 'Please wait...';
					});
				}
				else{
					$scope.errorMessage = 'Please select product price';
				}
			}

		};

		$scope.hidePriceTrend = function() {
			$scope.showPriceTrend = false;
		};

		$scope.loadPriceTrend=function(showTrend) {
			//priceTrends
			$scope.countryIdMap = {};
			$scope.showOPortHeader = true;
			$scope.showDPortHeader = true;
			$scope.showCountryHeader = false;
			$scope.pageSize = 50;
			$scope.pageIndex = 0;
			$scope.currentPage = 1;
			//$scope.totalResults = 0;
			 /*  filter for Product  */
			$scope.selectedOPort = "any";
			$scope.selectedDPort = "any";
			var ldate = moment().subtract('days',30).format("MM/DD/YYYY");
			$scope.calendarDateRange = ldate + "-" + moment().format("MM/DD/YYYY");

			$scope.currentDemandCriteria = {};


			$scope.currentDemandCriteria['type'] = $scope.tradeType;
			//$scope.currentDemandCriteria['destinationCountry'] = $scope.searchCriteria.country;
			$scope.currentDemandCriteria['productCode'] = parseInt($scope.tradeForm.hsCode);
			$scope.currentDemandCriteria['filterRequired'] = true;
			$scope.currentDemandCriteria['pageSize'] = $scope.pageSize;
			$scope.currentDemandCriteria['pageIndex'] = $scope.currentPage;
			$scope.currentDemandCriteria['duration'] = $scope.selectedUrlDuration;
			$scope.currentDemandCriteria['logAction']=true;
			$scope.currentDemandCriteria['startDate'] = moment(ldate).format("MM/DD/YYYY");
			$scope.currentDemandCriteria['endDate'] = moment().format("MM/DD/YYYY");

			if($scope.currentDemandCriteria.productCode && !($scope.currentDemandCriteria.oport || $scope.currentDemandCriteria.dport)){
				$scope.filterData = {
					destinationCountry: 699,
					outputType : "GROUP_BY_TRADE_DATE_PORT_DATA_ALL_DETAILS",
					parentId: $scope.currentDemandCriteria.productCode,
					originCountry: 0,
					pageIndex:0,
					pageSize:$scope.pageSize
				};
			}

			if($scope.currentDemandCriteria['productCode'] < 1) {
				return;
			}

			$rootScope.loadingData = true;
			dataService.getCurrentDemands($scope.tradeType, $scope.currentDemandCriteria)
			.then(function(data1){
				$scope.priceTrends=data1.stats;
				$scope.totalResults = data1.filterData.totalResults;
				$scope.showPriceTrend = showTrend;
				$scope.uniqueProducts = [];
				$scope.uniquePorts = [];
				if($scope.priceTrends && $scope.priceTrends.length > 0) {
					angular.forEach($scope.priceTrends, function(val, idx) {
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
				if(!$scope.trendDataLoading && !$scope.priceDataLoading) {
					$rootScope.loadingData = false;
				}
			});
		};

		///MARKET TREND CHART AND DATA

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
					  //rotateLabels: -45
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
				$scope.paintPriceTrendChart($scope.trendChartSelectableOptions);
			}
		});

		$scope.paintPriceTrendChart = function(newVal) {
			var product=newVal.product.label;
			var oport = newVal.oport;
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
					if($scope.tradeType.toUpperCase() === 'EXPORT') {
						//titlePart = 'Export from ' + ($scope.url.oport || $scope.url.dport || 'All Ports');
					} else if($scope.tradeType.toUpperCase() === 'IMPORT') {
						//titlePart = 'Import to ' + ($scope.url.oport || $scope.url.dport || 'All Ports');
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
			$scope.repaintChart = $scope.selectedPriceTrendProduct.label;
		};

		$scope.loadMarketTrendData = function (selectedProduct) {

			if(!$scope.uniqueProducts || $scope.uniqueProducts.length < 1) {
				return;
			}

			var trendCriteria = {
				outputType: 'GROUP_BY_TRADE_DATE_PORT_DATA',
				duration: $scope.selectedDuration
			};

			$scope.selectedPriceTrendProduct = selectedProduct || {label: 'All'};

			if ($scope.tradeForm.hsCode) {
				trendCriteria['parentId'] = $scope.tradeForm.hsCode;
			}

			$scope.trendFilterSelectionLabel = 'Origin Port: ';
			trendCriteria['originPortName'] = null;
			trendCriteria['destinationPortName'] = null;
			trendCriteria = angular.copy(trendCriteria);
			trendCriteria['outputType'] = 'TRADE_PORT_PRICE_TREND';//'GROUP_BY_TRADE_DATE_PORT_DATA_ALL_DETAILS';

			var ldate = moment('08/31/2018', 'MM/DD/YYYY').subtract('days',60).format("MM/DD/YYYY");
			$scope.calendarDateRange = ldate + "-" + moment().format("MM/DD/YYYY");
			trendCriteria['duration'] = moment(ldate).format("MM/DD/YYYY") + "-" + moment().format("MM/DD/YYYY");

			/*-
			var dayPortwiseForAll = $http({
				url: '/api/trade/analysis/daily-trend/' + $scope.type,
				data: trendCriteria,
				method: 'POST'
			}).success(function(resp){
				$scope.prepareTrendChart(resp.data);
			});
			*/

			dataService.getDailyDemandTrend($scope.tradeType, trendCriteria).then(function(resp) {
				$scope.prepareTrendChart(resp.data);
				if(resp.data['All'] && resp.data['All']['All']) {
					var dts = resp.data['All'] && resp.data['All']['All'];
					if(dts){
						angular.forEach(dts, function(val, key) {
							if(val.price && !$scope.priceFromTrend && (!$scope.priceForm.userPrice || $scope.priceForm.userPrice <1)) {
								$scope.priceFromTrend = parseInt(val.price);
								$scope.priceForm.userPrice = $scope.priceFromTrend;
								if(!$scope.priceForm.numberOfContainers || $scope.priceForm.numberOfContainers < 1) {
									$scope.priceForm.numberOfContainers = 1;
								}
								if(!$scope.priceForm.qtyUnit) {
									//$scope.priceForm.qtyUnit = $filter('filter')($scope.allUnits, val.qtyUnit)[0];
								}
								if(!$scope.priceForm.userQty || $scope.priceForm.userQty <1) {
									$scope.priceForm.userQty = 10;
								}

								if(!$scope.priceForm.containerSize) {
									$scope.priceForm.containerSize = 'container20';
								}

								if(!$scope.priceForm.originPort) {
									$scope.priceForm.originPort = 'INNSA1'
								}
								$scope.calculatePrice(true);
							}
						});
					}
				}
			});
		};

		$scope.modalOptions = {
			closeButtonText: 'Close',
			actionButtonText: 'Continue',
			headerText: 'Upload new image for your product',
			bodyText: ''
		};

		$scope.modalSelectProvider = {
		   backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: 'app/c2iapp/partials/file-modal.html',
			scope: $scope
		};

		$scope.modalOptions.close = function() {
		};


		///////////////////////////////////////////
		//////target market trend graph////////////
		//////////////////////////////////////////

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

		$scope.loadGraphs = function(chartType, countryDetails, typeValue) {
			//data = {2011: 6131801787,2012: 6660930983,2013: 5248284141,2014: 10800350839};
			var key = countryDetails.originCountryId;
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

			var stats = $filter('orderBy')(countryDetails.stats, 'year');

			angular.forEach(stats, function(value, idx) {
				$scope.chartData[key][chartType].labels.push(value.year);
				segment.data.push(value.value);
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
							datasetFill : false,
							legend: {display:false}
						}
					});

				});
				}
			});
		};

		$scope.downloadPO = function(po) {
            authService.getTempAuthToken().then(function(data){
                if (data.success && data.tkn) {
                   window.open('/api/controlpanel/activeTrade/downloadDocument/' + po.documentId + "?c2itkn="+data.tkn);
                } else {
					$scope.errorMsg = "Couldn't download the data. Please try again or contact support";
				}
            });
		};

        $scope.pdfUrl = '/controlpanel/assets/sample.pdf';
		$scope.getPOFileURL = function(po) {
            authService.getTempAuthToken().then(function(data){
                if (data.success && data.tkn) {
                  po.documentUrl = '/api/controlpanel/activeTrade/downloadDocument/' + po.documentId + "?c2itkn="+data.tkn;
                } else {
					$scope.errorMsg = "Couldn't download the data. Please try again or contact support";
				}
            });
		};

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

		$scope.showFinishFreightBookingDialog = function(bookingId) {
            $scope.loadShipments(bookingId);
			 modalService.showInfoMessage('Success!',
				'You have successfully placed your request for booking this shipment.', 'Ok').then(function(result) {
				if (result === 'ok') {
					// $location.path('/bookings');
				}
			});
		};

        $scope.loadShipments = function(bookingId) {
			$rootScope.loadingData = true;
            var spayload = {bookingId: bookingId};
			dataService.getShipmentBookings(spayload).then(function(response) {
				if(response.data.success) {
                    $scope.shipmentBooked = true;
					$scope.bookedShipments = response.data.data || [];
				}

			})['finally'](function() {
				$rootScope.loadingData = false;
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
                var payload = {activeTradeId: $scope.tradeForm.activeTradeId
                            , currentStep: $scope.tradeForm.currentStep
                            , currentStepName: $scope.tradeForm.currentStepName
                            , shipmentBooked: fbPayload
                        ,};
				dataService.bookActiveTradeShipment(payload).then(function(response) {
					if(response.data.success) {
						$scope.showFinishFreightBookingDialog(response.data.bookingId);
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
								$scope.loadShipmentGraphs('valueChart', shl, trendData, 'value');
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

		$scope.loadShipmentGraphs = function(chartType, shippingLine, trendData, typeValue) {
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
        /* ***********
            shipment tracker starts
        */
        $scope.shipmentTrackerForm= {};
        $scope.successMsg = '';

        $scope.trackingDetails = {};
        $scope.loadResults = false;

        $scope.TrackerList = function () {
            dataService.getShippingLines().then(function(response) {
                $scope.trackerList = response.data;
            });
        };

        $scope.setShipmentTrackerData = function () {
            $scope.shipmentTrackerForm.trackingId="";
            $scope.shipmentTrackerForm.shippingLine="";
            $scope.shipmentTrackForm.containerId.$touched=false;
            $scope.resultMsg ="";
            $scope.trackingDetails = {};
        };

        $scope.shipmentTracker = function (isValid) {
            console.log($scope.shipmentTrackerForm);
            $scope.successMsg = '';

            if(isValid){

                var payload = angular.copy($scope.shipmentTrackerForm);
                $rootScope.loadingData = true;
                dataService.trackShipment(payload).then(function(response){

                     $scope.loadResults = true;
                     if (response) {
                        //$scope.successMsg =  response.data['statusCode'];
                        $scope.resultMsg =  response.data['resultMessage'];
                        $scope.trackingDetails =  response.data;
                     }

                })['finally'](function() {
                    $rootScope.loadingData = false;
                });

            }

        };

        $scope.resetForm = function() {
            $scope.setShipmentTrackerData();
        };

        /* ***********
            shipment tracker starts
        */
		$scope.loadCompanyDetails(false);
    };

    addNewProductController.$inject = injectParams;
    app.register.controller('startNewTradeController', addNewProductController);

});
