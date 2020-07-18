'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'ecomService', '$rootScope', 'modalService','$filter'];

    var marketPlaceOrdersController = function ($scope, $location, $routeParams, authService, ecomService, $rootScope, modalService,$filter) {
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

		$scope.loadCompanyDetails(false);
    };

    marketPlaceOrdersController.$inject = injectParams;
    app.register.controller('marketPlaceOrdersController', marketPlaceOrdersController);

});
