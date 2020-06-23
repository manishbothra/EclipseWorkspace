'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', 'authService', '$compile', '$rootScope', 'dataService', '$http', '$filter','$timeout'];

    var mainController = function ($scope, $location, authService, $compile, $rootScope, dataService, $http, $filter, $timeout) {
		console.log("RANJAN: IN MAIN CNTRLR: ", $location.$$path);
		
		$scope.showNavBar = true;
        $scope.nonSecureFlow = false;
        if ($location.$$path.indexOf("/login") >= 0 || $location.$$path.indexOf("/fyp") >= 0
            || $location.$$path.indexOf("/activate") >= 0
            || $location.$$path.indexOf("/register") >= 0) {
            $scope.nonSecureFlow = true;
			$scope.showNavBar = false;
			$rootScope.showNavBar = false;
        }
		
		
		
		$scope.loadCompanyDetails = function(){
			$rootScope.loadingData = true;
			authService.getControlPanelDetails(true).then(function(response) {
				$scope.companyProfile = response.data[0];
				$rootScope.companyProfile = response.data[0];
				$scope.user=$scope.companyProfile.userDetails.user;
				$scope.subscription = response.subscription;
				if ($scope.subscription) {
					$rootScope.panelFeatures = $scope.subscription.enabledFeatures.panelFeatures;
				}
				
				if(response.profileStatus && response.profileStatus.profileUpdateRequired) {
					$location.path('/business-profile/setup-profile');
					//$location.path('/add-product');
				}
				
				$rootScope.subscription = $scope.subscription;
				$scope.navEvaluated = true;
				$scope.showNavBar = true;
				$rootScope.showNavBar = true;
				$scope.requestAlertStatuses();
			})['finally'](function () {
				$rootScope.loadingData = false;
			});
		};
		
		$scope.requestAlertStatuses = function () {
			dataService.getCompanyMails().then(function(data){
				$rootScope.allMails=data;
				var inboxItems = $filter('orderBy')($rootScope.allMails.incoming, 'date', true);
				var newItems = $filter('filter')(inboxItems, {status: 'new'});
				if(newItems) {
					$rootScope.alertCount = newItems.length;
				}
				$timeout($scope.requestAlertStatuses, 300000);
			});
		};
		
		$rootScope.$on('$locationChangeSuccess', function () {
			console.log("url changed", $location.path());
			if (typeof dataLayer != "undefined") {
				dataLayer.push({
					event: 'ngRouteChange',
					attributes: {
					  route: '/controlpanel' + $location.path()
					}
				});
			$rootScope.selectedNavModule = $location.path().replace('/', '');
				//ga('set', 'page', '/controlpanel' + $location.path());
				//ga('send', 'pageview');
				// ga('set', 'userId', USER_ID);
			}
		});

       // if (!$scope.nonSecureFlow) {
            console.log("validating auth");
            authService.validateToken().then(function (response) {
                var loggedIn = response.data.loggedIn;
                $rootScope.isLoggedIn = loggedIn;
				authService.checkIfAuthenticated();
				
				if (typeof ga != "undefined") {
					ga('set', 'userId', response.data['_c2iga']);
				}
				
                if(loggedIn) {
                    $rootScope.loggedInUser = authService.getLoggedInUserData();
					$.extend($rootScope.loggedInUser, response.data);
					if($location.$$path.indexOf('/login/') >=0) {
						var path = $location.$$path.replace('/login/', '/');
						$location.replace();
						$location.path(path);
					}
                } else {
                    redirectToLogin();
                }
            });
        //}
		
		$rootScope.$watch('isLoggedIn', function(newVal, oldVal) {
			console.log("$rootScope.isLoggedIn:: ", $rootScope.isLoggedIn);
			if(newVal) {
				$scope.loadCompanyDetails();
			}
		});
		
        $scope.loginOrOut = function () {
            setLoginLogoutText();
			authService.logout().then(function () {
				$location.path('/login');
				return;
			});
        };

        function redirectToLogin() {
			var path;
			if ($location.$$path.indexOf("/login") >= 0 || $location.$$path.indexOf("/fyp") >= 0
                || $location.$$path.indexOf("/activate") >= 0
                || $location.$$path.indexOf("/register") >= 0) {
				path = $location.$$path;
			} else {
				path = '/login' + $location.$$path;
			}
            $location.replace();
            $location.path(path);
        }
		
        $scope.$on('loginStatusChanged', function (event, loggedIn) {
			$scope.isLoggedIn = loggedIn;
            setLoginLogoutText(loggedIn);
        });

		$rootScope.$watch('showNavBar', function (newVal, oldVal) {
			$scope.showNavBar = newVal;
        });

		
        $scope.$on('redirectToLogin', function () {
            redirectToLogin();
        });

		$scope.$on('serverExceptionEvent', function(event, data) {
			if ('sessionExpired' === data.event) {
				$scope.isLoggedIn = false;
				redirectToLogin();
			}
		});
		
        function setLoginLogoutText() {
            $scope.loginLogoutText = (authService.user.isAuthenticated) ? 'Logout' : 'Login';
        }

		//$scope.isLoggedIn = authService.checkIfAuthenticated();
       // $rootScope.isLoggedIn = $scope.isLoggedIn;
		//console.log("$scope.isLoggedIn:: ", $scope.isLoggedIn);
       // setLoginLogoutText();



        /*------------ Geo CHART RELATED (copied from historical demand controller)------------*/

        /*var chartGeoOption = {
            "type": "GeoChart",
            "options": {
                backgroundColor: {fill: 'transparent'},
                // 'width':700,
                'height':380
            },
            //cssStyle: "height:100%; width:100%;backgroundColor: {fill:transparent} ",
            data: {}
        };

        var exportChartGeoOption = angular.copy(chartGeoOption);
        exportChartGeoOption.options.title = 'Export Market';
        exportChartGeoOption.options.legend = 'none';
        exportChartGeoOption.options.datalessRegionColor = '#b0ba7f';
        exportChartGeoOption.options.magnifyingGlass = {enable: true, zoomFactor: 7.5};
        exportChartGeoOption.options.backgroundColor = {fill: 'white'};

        $scope.exportChartGeo = exportChartGeoOption;

        dataService.getHistoricalTrendGeoChartData('export')
            .then(function(data) {
                $scope.exportChartGeo.data = data;
            });*/




    };

    mainController.$inject = injectParams;

    app.controller('mainController', mainController);

});