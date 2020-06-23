'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', 'modalService','$filter','$http'];

    var shipmentTrackerController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, modalService,$filter,$http) {
       
    	$scope.shipmentForm= {};
		$scope.successMsg = '';

		$scope.trackingDetails = {};
		$scope.loadResults = false;
		
		$scope.TrackerList = function () {
            $http({
                method: 'GET',
                url: '/api/freight/getShippingLineDetails',
                data: {}
            }).success(function (response) {
                $scope.trackerList = response;
            });
        };
        
        $scope.TrackerList();
		 
		/*$scope.setShipmentData = function () {
			$scope.shipmentForm.cid=$scope.shipment.cid;
			$scope.shipmentForm.TrackerList=$scope.shipment.TrackerList;		
		};*/
		
		$scope.setShipmentTrackerData = function () {
			$scope.shipmentForm.trackingId="";
			$scope.shipmentForm.shippingLine="";	
            $scope.shipmentTrackForm.containerId.$touched=false;
            $scope.resultMsg ="";
            $scope.trackingDetails = {};		
		};
		
        $scope.shipmentTracker = function (isValid) {
			console.log($scope.shipmentForm);
			$scope.successMsg = '';
			
			if(isValid){
				
				var payload = angular.copy($scope.shipmentForm);
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
		
    };
  
    shipmentTrackerController.$inject = injectParams;
    app.register.controller('shipmentTrackerController', shipmentTrackerController);

});