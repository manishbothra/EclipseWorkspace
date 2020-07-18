'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', 'modalService','$filter'];

    var bookingsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, modalService,$filter) {
        $scope.successMsg = '';
		$scope.freightForm = {};
		
		var ldate = moment().subtract('days',30).format("MM/DD/YYYY");
		$scope.calendarDateRange = ldate + "-" + moment().format("MM/DD/YYYY");
		
		
		
		var DATE_FORMAT_SLASH = "MM/DD/YYYY";
		var DATE_FORMAT_DASH = "YYYY-MM-DD";
		$scope.dateRangeChanged = function(fromDate, toDate) {
			console.log("date range changed: ", fromDate, toDate);
			var dateRange = fromDate.format(DATE_FORMAT_SLASH) + '-' + toDate.format(DATE_FORMAT_SLASH);
			$scope.searchCriteriaFriendlyDuration = fromDate.format(DATE_FORMAT_DASH) + '/' + toDate.format(DATE_FORMAT_DASH);
			$scope.freightForm.rateStartDate = fromDate;
			$scope.freightForm.rateEndDate = toDate;
		};
		
		$scope.loadShipments = function() {
			$rootScope.loadingData = true;
			dataService.getShipmentBookings($scope.freightForm).then(function(response) {
				if(response.data.success) {
					$scope.shipments = response.data.data || [];
				}
				
			})['finally'](function() {
				$rootScope.loadingData = false;
			});
		};
		
		$scope.loadShipments();
		
		
    };

    bookingsController.$inject = injectParams;
    app.register.controller('bookingsController', bookingsController);

});