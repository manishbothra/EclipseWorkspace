'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'ecomService','$parse', '$rootScope', 'modalService','$filter','StepsService','$timeout'];

    var marketPlacesStoreController = function ($scope, $location, $routeParams, authService, ecomService,$parse, $rootScope, modalService,$filter,stepsService,$timeout) {
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

		$scope.loadCompanyDetails(false);
    $scope.filedata = {};
    $scope.uploadCount = 0;
    var file = {};
    $scope.uploadDocFiles = function(file_model,type){
      if(file_model){
      var fd = new FormData();
      fd.append('storeDoc',file_model);
      $scope.uploadCount++;
      fd.append('documentType', type);
      fd.append('ecStoreId', file.ecStoreId);
      $rootScope.loadingData = true;
      ecomService.uploadProductImage(fd,'data-files').then(function(response) {
        console.log(response);
        $rootScope.loadingData = false;
        $scope.uploadSuccessMsg = true;
        $timeout(()=>{
          $scope.uploadSuccessMsg = false;
        },8000)
      })['finally'](function () {
        $rootScope.loadingData = false;
      });
      }
    }


		$scope.sellerStoreData = {};
        $scope.getStoreData = {}; 
        $scope.doneSteps = [];
        $scope.selectedStep = 'step1';
        $scope.backButton = false;
        $scope.businessTypeList = ['Proprietor','Company'];
        //getting data
        var storeData = ecomService.getStore().then(function(response){
          $scope.getStoreData = response;
        });
       

        $scope.goToNextStep = function(currentstep){
          if(currentstep == 'step5'){
            return;
          }
           $scope.doneSteps.push(currentstep);
          if(currentstep == 'step1'){
            $scope.backButton = true;
            $scope.selectedStep = 'step2';
          }
          if(currentstep == 'step2')$scope.selectedStep = 'step3';
          else if(currentstep == 'step3')$scope.selectedStep = 'step4';
          else if(currentstep =='step4'){
            $scope.selectedStep = 'step5';
            $rootScope.loadingData = true;
            ecomService.addStore($scope.sellerStoreData).then(function(response){
            file.ecStoreId = response.data.ecStoreId;
            stepsService.steps().next();
            $rootScope.loadingData = false;
          });
          }
         
          stepsService.steps().next();
        }
        $scope.finalStoreCreated = function(){
          $location.path('/marketplaces/store-details');
        }
        $scope.currentStepDone = function(stepval){
          return $scope.doneSteps.indexOf(stepval)>=0;
        }
        $scope.goBack = function(stepval){
          $scope.doneSteps.pop();
          console.log('hello');
          if(stepval == 'step1'){
            $scope.backButton = false;
          }
          stepsService.steps().previous();
        }
        $scope.goTo = function(dest_step){
            if($scope.doneSteps.indexOf(dest_step)>=0){
            var ind = $scope.doneSteps.indexOf(dest_step);
            var len = $scope.doneSteps.length - ind;
            $scope.doneSteps.splice(ind,len);
            stepsService.steps().goTo(dest_step);
          }
        }
        // PAN Card validation 
        $scope.validate = function () {
          if($scope.sellerStoreData.gst == 'already'){
            $scope.goToNextStep('step3');
          }
          else
          {
            var panVal = $scope.sellerStoreData.panNumber;
            var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
            if (panVal.search(regpan) == -1){
               alert('Incorrect PAN NUmber');
            } 
            else $scope.goToNextStep('step3');
          }
        }
    };

    marketPlacesStoreController.$inject = injectParams;
    app.register.controller('marketPlacesStoreController', marketPlacesStoreController);

});
