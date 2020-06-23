'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope'];

    var personalProfileController = function ($scope, $location, $routeParams, authService, dataService, $rootScope) {
        $scope.profileForm = {};
		$scope.successMsg = '';
		$scope.dateModal = {};
		
		$scope.dateOptions = {
			startingDay: 1,
			showWeeks: false,
			maxDate: new Date(),
			minDate: new Date(1900, 1, 1),
		};
		
		$scope.disabled = function(date, mode) {
			return false;
		};
		
		$scope.openDateModal = function($event, elementOpened) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.dateModal[elementOpened] = !$scope.dateModal[elementOpened];
		};
		  
		
		$scope.setUserData = function () {
			$scope.profileForm.id=$scope.user.id;
			$scope.profileForm.firstName=$scope.user.firstName;
			$scope.profileForm.lastName=$scope.user.lastName;
			$scope.profileForm.email=$scope.user.email;
			$scope.profileForm.date=$scope.user.date;
			if($scope.user.date) {
				$scope.profileForm.dateObj= moment($scope.user.date, 'DD/MM/YYYY').toDate(); //new Date($scope.profileForm.date);
			}
			
			$scope.profileForm.profile=$scope.user.profile;
			if($scope.user.mobile) {
				$scope.profileForm.mobile=parseInt($scope.user.mobile);
			}
			if($scope.user.phone) {
				$scope.profileForm.phone=parseInt($scope.user.phone);
			}
			
			$scope.profileForm.id=$scope.user.id;
			$scope.profileForm.date=$scope.user.date;
		};
		
		$scope.loadCompanyDetails = function(){
			$rootScope.loadingData = true;
			authService.getControlPanelDetails().then(function(response) {
				$scope.companyProfile = response.data;
				$scope.user=$scope.companyProfile[0].userDetails.user;
				$scope.setUserData();
			})['finally'](function () {
				$rootScope.loadingData = false;
			});
		};
		
        $scope.updateProfile = function () {
			$scope.successMsg = '';
			if($scope.profileForm.dateObj) {
				if(moment($scope.profileForm.dateObj).isValid ()) {
					$scope.profileForm.date =  moment($scope.profileForm.dateObj).format('DD/MM/YYYY');
				} else {
					$scope.profileForm.date = $scope.profileForm.dateObj;
				}
			}
			
			var payload = angular.copy($scope.profileForm);
			payload.mobile = "" + payload.mobile;
			payload.phone = "" + payload.phone;
			$rootScope.loadingData = true;
			authService.updateUserProfile(payload).then(function(response) {
				if (response.data.success) {
					if (response.data.success) {
						$scope.successMsg = 'Your profile has been updated successfully.';
					}	 
				}
			})['finally'](function() {
				$rootScope.loadingData = false;
			});
        };
		
		$scope.resetForm = function() {
			$scope.setUserData();
		};
		
		$scope.loadCompanyDetails();
    };

    personalProfileController.$inject = injectParams;
    app.register.controller('personalProfileController', personalProfileController);

});