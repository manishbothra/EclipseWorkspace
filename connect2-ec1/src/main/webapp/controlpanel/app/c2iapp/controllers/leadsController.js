'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http', '$filter'];

    var leadsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http, $filter) {
		$scope.url=$location.search();
		$scope.loading = false;

		$scope.getAllLeads = function(){
			console.log('getting all leads');
			$rootScope.loadingData = true;
			dataService.getAllLeads().then(function (response) {
				$rootScope.loadingData = false;
				$scope.allLeads = response.data.data || [];
				$scope.allLeads = $filter('orderBy')($scope.allLeads,'createdDate',true);
				angular.forEach($scope.allLeads, function(value, index) {
					value.dateFormatted = moment(value.createdDate).format("DD MMM YYYY hh:mm a");
				});
			});
		};
		
		$scope.getLeadListTitle = function(index, lead) {
			var title = (index + 1) + ". " + lead.leadName + " - " + lead.dateFormatted;
			return title;
		};

		$scope.getAllLeads();
    };

    leadsController.$inject = injectParams;


    app.register.controller('leadsController', leadsController);

});