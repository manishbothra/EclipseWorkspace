'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', 'modalService','$filter'];

    var manageProductsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, modalService,$filter) {
        $scope.productForm = {};
        // $scope.availableProducts = {};
		$scope.successMsg = '';
		
		
		$scope.loadCompanyDetails = function(reload){
			$rootScope.loadingData = true;
			authService.getControlPanelDetails(reload).then(function(response) {
				$scope.companyProfile = response.data[0];
				$scope.user=$scope.companyProfile.userDetails.user;
				$scope.companyProducts = $scope.companyProfile.companyProducts.products;
				if(response.subscription) {
					var productsAllowed = response.subscription.enabledFeatures.noOfProductsAllowed;
					if(productsAllowed <= $scope.companyProducts.length) {
						$scope.disableProductAdd = true;
						$scope.showUpgradeBtn = true;
						$scope.errorMessage = 'You need to upgrade your subscription to add more products';
					} else {
						$scope.disableProductAdd = false;
						$scope.showUpgradeBtn = false;
						$scope.errorMessage = '';
					}
				}
				
			})['finally'](function () {
				$rootScope.loadingData = false;
			});
		};
		
		$scope.loadOngoinginTrades = function() {
			dataService.getAllOngoingTrades().then(function(resp) {
				$scope.ongoingTrades = resp.data.data;
			});
		};
		
		$scope.deleteTrade = function(ot) {
			if(confirm("Delete trade with id: " + ot.activeTradeId + " ?")) {
				dataService.deleteOngoingTradeDetails(ot).then(function(resp) {
					if(resp.data.success) {
						$scope.loadOngoinginTrades();
					}
				});
			}
		};
		
		$scope.financeTrade = function(ot) {
			//start finance flow.
			var at = {activeTradeId: ot.activeTradeId, financeRequired: true};
			dataService.requestTradeFinance(at).then(function(resp) {
				if(resp.data.success) {
					alert('Your request has successfully been submitted. We will get back to you shortly.');
					$scope.loadOngoinginTrades();
				}
			});
			
		};
		
		$scope.loadCompanyDetails(true);
		$scope.loadOngoinginTrades();
    };

    manageProductsController.$inject = injectParams;
    app.register.controller('activeTradeController', manageProductsController);

});