'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', 'modalService', '$http'];

    var loginController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, modalService, $http) {
        var path = $routeParams.redirect || '/';
        $scope.userName = null;
        $scope.password = null;
        $scope.errorMessage = null;
        $scope.isEmailValid = true;

        $scope.fyp = {
            userID : ''
        };

		$scope.login = {};
		$scope.regForm = {};
		$scope.vfForm = {};
		$scope.verificationForm = {};
		$scope.submitFormData={};

		$rootScope.loadingData = false;
		$scope.showNavBar = false;
		$rootScope.showNavBar = false;
		$scope.showLoginForm = true;
		$scope.showRegForm = true;
		$scope.submitVerificationForm= false;
		console.log('in login controller');
		$('#initLoadingDiv').remove();

        $scope.login = function () {
			$scope.showNavBar = false;
			$rootScope.showNavBar = false;
            if (!$scope.login.userName) {
                $scope.errorMessage = 'Please enter your Username.';
                return;
            } else if (!$scope.login.password) {
                $scope.errorMessage = 'Please enter your Password.';
                return;
            }
            authService.login($scope.login.userName, $scope.login.password).then(function (response) {
                if (!response.data.success) {
                    $scope.errorMessage = 'Invalid username or password.';
                    return;
                }
				$rootScope.isLoggedIn = response.data.success;

				if (!$rootScope.isLoggedIn) {
					$location.path("/dashboard");
					$scope.showNavBar = false;
					$rootScope.showNavBar = false;
				} else {
					$scope.showNavBar = true;
					$rootScope.showNavBar = true;
				}

                $location.path(path);
            });
        };
        
        $scope.initiateVerification = function() {
			$scope.errorMessage = '';
			$scope.submitVerificationForm = false;
			$scope.showVerificationForm = true;
			$scope.pwdResetSuccessfull = false;
			$scope.showLoginForm = false;
			$scope.showResetPwdForm = false;
			$scope.showVerifyForm = false;
		};

		$scope.initiateFyp = function() {
			$scope.errorMessage = '';
			$scope.fypForm = {};
			$scope.showFypForm = true;
			$scope.pwdResetSuccessfull = false;
			$scope.showLoginForm = false;
			$scope.showResetPwdForm = false;
			$scope.showVerifyForm = false;
			$scope.submitVerificationForm = false;
			$scope.showVerificationForm = false;
		};

		$scope.initiateLogin = function() {
			$scope.errorMessage = '';
			$scope.showFypForm = false;
			$scope.showResetPwdForm = false;
			$scope.showLoginForm = true;
			$scope.showVerifyForm = false;
			$scope.submitVerificationForm = false;
			$scope.showVerificationForm = false;
		};

		$scope.initiateSignUp = function() {
			$scope.errorMessage = '';
			$scope.showFypForm = false;
			$scope.showResetPwdForm = false;
			$scope.showLoginForm = true;
			$scope.showVerifyForm = false;
			$scope.showRegForm = true;
			$scope.submitVerificationForm = false;
			$scope.showVerificationForm = false;
		};

		$scope.initiateVfToken = function() {
			$scope.errorMessage = '';
			$scope.showFypForm = false;
			$scope.pwdResetSuccessfull = false;
			$scope.showLoginForm = false;
			$scope.showResetPwdForm = false;
			$scope.showVerifyForm = true;
			$scope.showRegForm = false;
			$scope.submitVerificationForm = false;
			$scope.showVerificationForm = false;
		};
		
		$scope.initiateVerifyToken = function() {
			$scope.errorMessage = '';
			$scope.submitVerificationForm= true;
			$scope.showVerificationForm= false;
			$scope.loadingData = false;
			$scope.showResetPwdForm = false;
			$scope.showFypForm = false;
			$scope.showLoginForm = false;
		};

		$scope.requestFyp = function(isValid) {
			$scope.resetForm = {};
			if(!isValid) {
				return;
			}
			if(!$scope.fypForm.email) {
				$scope.errorMessage = 'Please provide valid email address.';
				return;
			}
			$rootScope.loadingData = true;
			authService.requestFypOTP($scope.fypForm.email).then(function(response) {
				if(response.success) {
					$scope.showResetPwdForm = true;
					$scope.showFypForm = false;
					$scope.showLoginForm = false;
					$scope.resetForm.email=$scope.fypForm.email;
				} else{
					$scope.errorMessage = response.message;
				}
			})['finally'](function() {
				$rootScope.loadingData = false;
			});
		};

		$scope.resetPwd = function(isValid) {
			if(!isValid) {
				return;
			}
			$scope.errorMessage = '';
			if(!$scope.resetForm.token) {
				$scope.errorMessage = 'Please provide the security code.';
				return;
			}

			if($scope.resetForm.password != $scope.resetForm.confirmedPassword) {
				$scope.errorMessage = 'Password and confirmed password should match.';
				return;
			}

			$rootScope.loadingData = true;
			authService.resetPasswordOtp($scope.resetForm).then(function(response) {
				if(response.success) {
					$scope.pwdResetSuccessfull = true;
					$scope.showResetPwdForm = false;
					$scope.showFypForm = false;
					$scope.showLoginForm = true;
				} else {
					if(response.key === 'token_expired') {
						$scope.errorMessage = 'Invalid verification coode.';
					} else {
						$scope.errorMessage = response.message;
					}
				}
			})['finally'](function() {
				$rootScope.loadingData = false;
			});
		};

        $scope.showFYPModal = function () {
            var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'Submit',
                headerText: 'Forgot Your Password ',
                bodyText: 'Please enter your Username'

            };

            var modalSelectProvider = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: 'app/c2iapp/partials/modal-forgot-pwd.html',
                scope: $scope
            };

            modalService.showModal(modalSelectProvider, modalOptions);

        };

        $scope.closeModal = function () {
            $scope.modalInstance.close('ok');
        };

        $scope.submitFyp = function () {
            if ($scope.fyp.userId) {
                authService.fyp($scope.fyp.userId).then(function(response) {
                    if(response.data.status === 'success') {
                        $scope.closeModal();
                        $scope.showOkModal('We have sent an email to reset your password. Please check your email.');
                    }

                });
            }

        };

        $scope.showOkModal = function (msg) {
            var modalOptions = {
                actionButtonText: 'OK',
                headerText: 'Forgot Your Password ',
                bodyText: msg

            };

            var modalSelectProvider = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: 'app/c2iapp/partials/modal.html'
            };

            modalService.showModal(modalSelectProvider, modalOptions);

        };

		 ///REGISTRATION FLOW
		 $scope.createAccount = function (isValid) {

			//$scope.showNavBar = false;
			//$rootScope.showNavBar = false;

			if(isValid){

				authService.createAccount($scope.regForm).then(function (response) {
	                if(response.success){
						$rootScope.manageEmail = $scope.regForm.email;
						$scope.initiateVfToken();
					}
					else{
						$scope.registerMessage=response.message;
					}

	            });

			}

        };
        
        $scope.requestVerification = function(isValid) {

			$scope.submittedrv='True';
			if(isValid){

				var optFrm = {'email': $scope.verificationForm.email};

				$scope.loadingData = true;
				authService.requestVerification(optFrm).then(function (response) {
	                if(response.success){
	                	$rootScope.manageEmail = $scope.verificationForm.email;
						$scope.initiateVerifyToken();
					}
					else{
						$scope.errorMessage = response.message;
					}

	            });
			}
		};
		
         ///VERIFY USER
		 $scope.verifyAccount = function (isValid) {

			//$scope.showNavBar = false;
			//$rootScope.showNavBar = false;

			if(isValid){
				var payload = {'autoLogin': true, 'token': $scope.vfForm.otp, email: $rootScope.manageEmail, sendEmail: true};//'email': $scope.rvlFormData.email
				authService.verifyAccount(payload).then(function (response) {
					if (response.success) {
						$scope.message11=response.message;
						window.localStorage.setItem('c2iSession', response.tkn);
						var udata = {userName:response.email_address
										, first_name: response.first_name
										, last_name:response.last_name
										, loggedIn: response.loggedIn,
										subscription: response.subscription};

						$rootScope.userInfo = udata;
						$scope.userInfo = udata;
						$rootScope.isLoggedIn = udata.loggedIn;

						window.localStorage.setItem('c2iSessionInfo', btoa(JSON.stringify(udata)));
						$http.defaults.headers.common['X-Auth-Token'] = response.tkn;

						//window.location.reload();
						$location.path("/dashboard");

					} else{
						$scope.tokenMessage11=response.message || 'Unable to verify your account. Please try again with valid code.';
					}

	            });

			}

       };

    };

    loginController.$inject = injectParams;


    app.register.controller('loginController', loginController);

});
