'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'ecomService', '$rootScope', 'modalService','$filter'];

    var marketPlacesDashboardController = function ($scope, $location, $routeParams, authService, ecomService, $rootScope, modalService,$filter) {
        $scope.productForm = {};
        // $scope.availableProducts = {};
		$scope.successMsg = '';

        $scope.ecommerceDetails = [{name:'Flipkart', products:10, orders:2},
    {name:'Amazon', products:10, orders:2},
{name:'Ebay', products:4, orders:2},];

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

    marketPlacesDashboardController.$inject = injectParams;
    app.register.controller('marketPlacesDashboardController', marketPlacesDashboardController);

});
