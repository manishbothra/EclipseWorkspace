'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope', '$q'];

    var authService = function ($http, $rootScope, $q) {
        var serviceBase = '/api/login/',
            authFactory = {
                loginPath: '/login',
                user: {
                    roles: null
                },
				cacheData: {},
				resetCache: function() {
					authFactory['cacheData'] = {};
					authFactory.cpDetailsRequesting = false;
				}
            };
				
        authFactory.validateToken = function () {
			return $http.get(serviceBase + 'info').then(
                function (response) {
                    if(!response.data) {
                        return false;
                    }
					if(response.data.loggedIn) {
						var udata = window.localStorage.getItem("c2iSessionInfo");
						if(udata) {
							try{
								var udata = JSON.parse(atob(udata));
								var merged = $.extend({}, $rootScope.loggedInUser, udata);
								$rootScope.loggedInUser = merged;	
							} catch(err) {
								window.localStorage.removeItem("c2iSessionInfo");
							}
						} else {
							try{
								var merged = response.data;
								window.localStorage.setItem('c2iSession', merged.tkn);
								var udata = {userName: merged.email
										, first_name: merged.first_name
										, last_name:merged.last_name
										, loggedIn: merged.loggedIn,
										subscription: merged.subscription};
										
								$rootScope.loggedInUser = merged;
								window.localStorage.setItem("c2iSessionInfo", btoa(JSON.stringify(merged)));			
							} catch(err) {
								window.localStorage.removeItem("c2iSessionInfo");
							}
						}
					}
                    return response;
                });
        };

        authFactory.login = function (email, password, tenant) {
			return $http.post(serviceBase + 'mlogin', { userName: email, password: password}).then(
                function (response) {
					var data = response.data;
                    if(data.success) {
						window.localStorage.setItem('c2iSession', data.tkn);
						var udata = {userName:email
										, first_name: data.first_name
										, last_name:data.last_name
										, loggedIn: data.loggedIn,
										subscription: data.subscription,'status':data['status']};
						
						$rootScope.loggedInUser = udata;
						
						window.localStorage.setItem('c2iSessionInfo', btoa(JSON.stringify(udata)));
					}
                    //
                    return response;
                });
        };

        authFactory.changePassword = function (oldPwd, newPwd, confirmPwd) {
			return $http.post('/api/controlpanel/changePassword', { oldPwd: oldPwd, newPwd: newPwd, confirmPwd:confirmPwd}).then(
                function (response) {
					var data = response.data;
                    if(data.success) {
						window.localStorage.removeItem('c2iSession');
                    }
                    return response;
                });
        };

        authFactory.logout = function () {

		   return $http.post(serviceBase + 'out', {}).then(
                function (results) {
                    var loggedOut = results.data.success;
					if(loggedOut) {
        				$rootScope.loggedInUser = {};
                        changeAuth(false);
						authFactory.resetCache();
						window.localStorage.removeItem('c2iSession');
						//window.location.reload();
					}
                    return results;
                });
        };
		
		authFactory.updateUserProfile = function (payload) {
            return $http.post('/api/controlpanel/updateUserProfile', payload || {}).then(
                function (results) {
                   return results;
				});
        };
		
		authFactory.updateCompanyProfile = function (payload) {
            return $http.post('/api/controlpanel/updateCompanyProfile', payload || {}).then(
                function (results) {
                   return results;
				});
        };
		
		authFactory.updateCompanyAddress = function (payload) {
            return $http.post('/api/controlpanel/updateCompanyAddress', payload || {}).then(
                function (results) {
                   return results;
				});
        };
		
		authFactory.updateCompanyFinancialsDetails = function (payload) {
            return $http.post('/api/controlpanel/updateCompanyFinancialsDetails', payload || {}).then(
                function (results) {
                   return results;
				});
        };
		
		authFactory.updateCompanyAdditionalDetails = function (payload) {
            return $http.post('/api/controlpanel/updateCompanyAdditionalDetails', payload || {}).then(
                function (results) {
                   return results;
				});
        };
		
		authFactory.createNewWebsite = function (payload) {
            return $http.post('/api/controlpanel/createNewWebsite', payload || {}).then(
                function (results) {
                   return results;
				});
        };
		
		authFactory.getOneTimeLoginToken = function (payload) {
			return $http.post('/api/controlpanel/getOneTimeLoginToken', payload || {}).then(function(results) {
				return results;
			});
		};
		
		
		authFactory.updateLeadConfig = function (payload) {
			return $http.post('/api/controlpanel/insertCompanyConfig', payload || {}).then(function(results) {
				return results;
			});
		};
		
        authFactory.fyp = function (userID) {
            return $http.post(serviceBase + 'fyp', { username: userID }).then(
                function (results) {
                    return results;
                });
        };

		
		authFactory.requestFypOTP = function(email) {
			var optFrm = {'email': email};
			return $http.post('/api/login/requestFYPOtp', optFrm)
			.then(function(response){
				return response.data;
			});
		};
	
		authFactory.resetPasswordOtp = function(payload) {
			return $http.post('/api/login/resetPasswordOtp', payload)
			.then(function(response){
				return response.data;
			});
		};
	
        authFactory.changePwd = function (curPwd, newPwd) {
            return $http.post(serviceBase + 'changepwd', { pwd: curPwd, newPwd: newPwd }).then(
                function (results) {
                    return results;
                });
        };


        authFactory.resetPwd = function (token, pwd) {
            return $http.post(serviceBase + 'resetPwd', {tkn:token, newPwd: pwd }).then(
                function (results) {
                    return results;
                });
        };

        authFactory.activateUser = function (token, pwd) {
            return $http.post(serviceBase + 'activateUser', {tkn:token, newPwd: pwd }).then(
                function (results) {
                    return results;
                });
        };

        authFactory.redirectToLogin = function () {
            $rootScope.$broadcast('redirectToLogin', null);
        };

		authFactory.checkIfAuthenticated = function () {
			//get the user deatils..
            var tk = window.localStorage.getItem("c2iSession");
			if(tk && 'undefined' != tk) {
				return true;
			}
			changeAuth(false);
			return false;
		};

        authFactory.getLoggedInUserData = function () {
			if(window.localStorage.getItem("c2iSessionInfo")) {
				var udata = window.atob(window.localStorage.getItem("c2iSessionInfo"));
				return JSON.parse(udata);
			} else {
				return {};
			}
        };
		
		authFactory.getCachedData = function () {
			return authFactory.cacheData;
		};

        authFactory.setLoggedInUserData = function (data) {
            window.localStorage.setItem("c2iSessionInfo", window.btoa(JSON.stringify(data)));
        };
		
		authFactory.getControlPanelDetails = function(reload) {
			if (!authFactory.cpDetailsRequesting) {
				authFactory.cpDetailsDeffered = $q.defer();
				if(authFactory['cacheData']['controlPanelDetails'] && !reload) {
					authFactory.cpDetailsDeffered.resolve(authFactory['cacheData']['controlPanelDetails']);
				} else {
					authFactory.cpDetailsRequesting = true;
					$http.get('/api/controlpanel/details').then(function(response){
						if(response && response.data.success) {
							authFactory['cacheData']['controlPanelDetails'] = response.data;
							authFactory['cacheData']['subscriptionDetails'] = response.data.subscription;
							authFactory['cacheData']['profileStatus'] = response.data.profileStatus || {};
							if (authFactory.cacheData.subscriptionDetails && authFactory.cacheData.subscriptionDetails.enabledFeatures
								&& authFactory.cacheData.subscriptionDetails.enabledFeatures.panelFeatures ) {
									authFactory['cacheData']['enabledPages'] = authFactory.cacheData.subscriptionDetails.enabledFeatures.panelFeatures.pages;
								}
							if(response.data.data.length > 0 && response.data.data[0].companyProducts) {
								var cprs = response.data.data[0].companyProducts.products;
								if(cprs && cprs.length > 0) {
									angular.forEach(cprs, function(companyProduct, index) {
										var code = companyProduct.product.code;
										if (code > 0) {
											code = '' + code;
											if(code.length > 6) {
												code = code.substr(0, 6);
												code = parseInt(code);
											}
										}
										companyProduct.product['code_org'] = companyProduct.product.code;
										companyProduct.product.code = code;
										companyProduct['code_org'] = companyProduct.product['code_org'];
										companyProduct.code = code;
										companyProduct.name=companyProduct.productName;
										
									});
								}
							}
							authFactory.cpDetailsDeffered.resolve(response.data);
						} else {
							authFactory.cpDetailsDeffered.resolve({});
						}
						authFactory.cpDetailsRequesting = false;
						$rootScope.cpDetailsLoaded = true;
					});
				}
			}
			
			return authFactory.cpDetailsDeffered.promise;
		};
		
		authFactory.checkSubscribedComponent = function(key, defer) {
			var retVal = {subscribed:false};
			if (authFactory['cacheData']['enabledPages'] && key) {
				if (angular.isArray(authFactory['cacheData']['enabledPages'])) {
					if (authFactory['cacheData']['enabledPages'].indexOf(key) > -1 || 
						authFactory['cacheData']['enabledPages'].indexOf(key.toLowerCase()) > -1 ) {
						//return true;
						 retVal = {subscribed:true};
					} else if (authFactory['cacheData']['enabledPages'].indexOf('all') > -1) {
						//return true;
						 retVal = {subscribed:true};
					} else {
						 retVal = {subscribed:false};
					}
				} else {
					//return mainObj[key];
					 retVal = {subscribed: mainObj[key]};
				}
			} else {
				 retVal = {subscribed:false};
			}
			
			if(defer) {
				defer.resolve(retVal);
			} else {
				return  retVal.subscribed;
			}
		};
		
		authFactory.isSubscribedComponentPromise = function (key) {
			var defer = $q.defer();
			if(!authFactory.cpDetailsRequesting) {
				authFactory.checkSubscribedComponent(key, defer);
			} else {
				authFactory.getControlPanelDetails().then(function(response) {
					authFactory.checkSubscribedComponent(key, defer);
				});
			}
			
			return defer.promise;
		};
		
		
		authFactory.isProfileCompleted = function () {
			var defer = $q.defer();
			if(!authFactory.cpDetailsRequesting) {
				if (authFactory['cacheData']['profileStatus']) {
					
					if(authFactory['cacheData']['profileStatus'].profileUpdateRequired) {
						defer.resolve({setupRequired: true, type: 'profileUpdateRequired'});
					} else if(!authFactory['cacheData']['profileStatus'].hasProductDetails) {
						defer.resolve({setupRequired: true, type: 'productUpdateRequired'});
					} else{
						defer.resolve({setupRequired: false});
					}
					
				} else {
					defer.resolve({setupRequired: false});
				}
			} else {
				authFactory.getControlPanelDetails().then(function(response) {
					if (authFactory['cacheData']['profileStatus']) {
						
						if(authFactory['cacheData']['profileStatus'].profileUpdateRequired) {
							defer.resolve({setupRequired: true, type: 'profileUpdateRequired'});
						} else if(!authFactory['cacheData']['profileStatus'].hasProductDetails) {
							defer.resolve({setupRequired: true, type: 'productUpdateRequired'});
						} else{
							defer.resolve({setupRequired: false});
						}
						
					} else {
						defer.resolve({setupRequired: false});
					}
				});
			}
			
			return defer.promise;
		};
		
		authFactory.setProductSetupFlag = function(isSetup) {
			authFactory['cacheData']['profileStatus']['hasProductDetails'] = isSetup;
		};
		
		authFactory.getTempAuthToken = function() {
			return $http.get('/api/controlpanel/getTempToken').then(function(response) {
				return response.data;
			});
		};
		
		function changeAuth(loggedIn) {
			authFactory.user.isAuthenticated = loggedIn;
			$rootScope.$broadcast('loginStatusChanged', loggedIn);
		}
		
		authFactory.createAccount = function (regForm) {
			return $http.post('/api/register/registerBusinessProfile/true', regForm)
			.then(function(response){
				return response.data;
			});
        };
		
		authFactory.requestVerification = function (payload) {
			return $http.post('/api/login/requestVerifyOtp', payload)
			.then(function(response){
				return response.data;
			});
        };
        
        authFactory.verifyAccount = function (payload) {
			return $http.post('/api/verify/userMailOTP', payload)
			.then(function(response){
				return response.data;
			});
        };

        return authFactory;
    };

    authService.$inject = injectParams;
    app.factory('authService', authService);

});
