'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'ecomService', '$rootScope', 'modalService','$filter','StepsService','$timeout'];

    var marketPlaceProductListingsController = function ($scope, $location, $routeParams, authService, ecomService, $rootScope, modalService,$filter,stepsService,$timeout) {
        $scope.productForm = {};
        // $scope.availableProducts = {};
		$scope.successMsg = '';
		$scope.updateStockPriceMsg = "";
		$scope.stockPriceShow = false;
		$rootScope.categoryObj={};
		$scope.updateObj = {sellingInfo:{}};
		$scope.showDialog =[];
		$scope.showDialog.length = 4;
		for(var i = 0;i<$scope.showDialog.length;i++){
			$scope.showDialog[i]=false;
		}
		$scope.viewProduct = function(id,mainCateg,categ1,categ2){
			$rootScope.categoryObj={
				mainCategory:mainCateg,
				category1: categ1,
				category2:categ2,
				ecProdSiId: id
			}
			$location.path('/marketplaces/product-details/:'+ id);
		}
		var obj = {};
		obj={
			ecStoreId: 5,
		}
		var arr=['Amazon','Flipkart','Ebay'];
		$scope.ecommProducts=[];
		$scope.selectedStep= 'step1';

		$scope.refreshProducts = function(){
			$rootScope.loadingData = true;
			ecomService.getAllProducts(obj).then(function(response){
					$rootScope.loadingData = false;
					if(response){
						$scope.$apply(function(){
							$scope.ecommProducts = response.data;
						})
					}

			})['finally'](function () {
					$rootScope.loadingData = false;
			});
		}
		$scope.updatePrice = function(obj,ind){
			$scope.showDialog[ind] = !$scope.showDialog[ind];
			$rootScope.loadingData = true;
			ecomService.updateProductPrice(obj).then(function(response){
				$rootScope.loadingData = false;
				$scope.updateStockPriceMsg = 'Price';
				$scope.stockPriceShow = true;
				$timeout(()=>{
					$scope.stockPriceShow = false;
				},7000);
			})
		}
		$scope.updateInventory = function(obj,ind){
			$scope.showDialog[ind] = !$scope.showDialog[ind];
			$rootScope.loadingData = true;
			ecomService.updateProductInventory(obj).then(function(response){
				$rootScope.loadingData = false;
				$scope.updateStockPriceMsg = 'Stock';
				$scope.stockPriceShow = true;
				$timeout(()=>{
					$scope.stockPriceShow = false;
				},7000);
			})
		}
		$scope.goBack= function(){
			let el = angular.element('.panel-collapse');
   			el.collapse('hide');
   			$scope.showIt=true;
			stepsService.steps().previous();
		}
		$scope.showBasicInfo = function($event){
        	$scope.showIt=false;
        	stepsService.steps().next();
		}
		function compareTwo(a, b) {
		  var first = a.ecProdId;
		  var second = b.ecProdId;
		  let  comparison = 0;
		  if (first > second) {
		    comparison = 1;
		  } else if (first < second) {
		    comparison = -1;
		  }
		  return comparison;
		}
		
		ecomService.getAllProducts(obj).then(function(response){
			var tempData = response.data;
			
			var final = [];
			if(tempData && tempData.length > 0){
				var list = tempData.sort(compareTwo)
				
				var prev= list[0].ecProdId;
				var temp = [];
				temp.push(list[0]);
				console.log(final);
				for(var i = 1;i<list.length;i++){
					if(list[i].ecProdId === prev){
						temp.push(list[i]);
					}
					else{
						final.push(temp);
						temp=[];
						temp.push(list[i])
						prev = list[i].ecProdId;
					}
				}
				final.push(temp);
			}
			
			$scope.ecommProducts = final;
		})

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

    marketPlaceProductListingsController.$inject = injectParams;
    app.register.controller('marketPlaceProductListingsController', marketPlaceProductListingsController);

});
