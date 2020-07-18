'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', 'modalService'];

    var changePwdController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, modalService) {
        var path = '/';
        $scope.pwdForm = {};

        $scope.changePassword = function () {

            if ($scope.pwdForm.newPwd != $scope.pwdForm.confirmPwd) {
                $scope.errorMessage = 'New password and confirm new password should be same.';
                return;
            }
			
            authService.changePassword($scope.pwdForm.oldPwd, $scope.pwdForm.newPwd, $scope.pwdForm.confirmPwd).then(function (response) {
                if (!response.data.success) {
                    $scope.errorMessage = response.data.message || 'Invalid password.';
                    return;
                } else if (response.data.success) {
					 modalService.showInfoMessage('Success!', 'Your password is changed successfully. Please login again with your new password to continue.').then(function(result) {
						if (result === 'ok') {
							$rootScope.loggedInUser = {};
							window.location.reload();
						}
					});
				}
            });
        };
		
		$scope.resetForm = function() {
			$scope.pwdForm = {};
		};
		
    };

    changePwdController.$inject = injectParams;


    app.register.controller('changePwdController', changePwdController);

});