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
				$rootScope.$watch('companyProfile', function(newVal, oldVal) {
					if(newVal) {
						var ucname = $filter('spaceToDash')($rootScope.companyProfile.name);
						$scope.companyProductsPublicProfileUrl = ucname +"/" + $rootScope.companyProfile.id +'/products';
					}
				}, true);
				
			})['finally'](function () {
				$rootScope.loadingData = false;
			});
		};
		
		$scope.deleteProduct = function(cProductId){
			
			if(window.confirm(('Are you sure you want to delete this product?'))) {
				$rootScope.loadingData = true;
				dataService.deleteProduct({companyProductId:cProductId}).then(function(data){
					$scope.loadCompanyDetails(true);
				})['finally'](function() {
					$rootScope.loadingData = false;
				});
			}
		};
		
		$scope.editProduct=function(cProductId) {
			$location.path('/edit-product/' + cProductId);
		};
		
		$scope.loadCompanyDetails(true);
    };

    manageProductsController.$inject = injectParams;
    app.register.controller('manageProductsController', manageProductsController);

});