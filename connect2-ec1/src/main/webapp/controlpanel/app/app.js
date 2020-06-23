/*
  #####################################
  ######################################
  ######################################
  ######################################
*/

'use strict';

define(['c2iapp/services/routeResolver'], function () {

    var app = angular.module('c2iapp', ['ngRoute', 'ngAnimate', 'routeResolverServices',
		  'ui.bootstrap', 'ngSanitize', 'angAccordion','ui.autocomplete','googlechart','rzModule','nvd3', 'ngTagsInput','angular-steps', 'textAngular']);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider',

        function ($routeProvider, routeResolverProvider, $controllerProvider,
                  $compileProvider, $filterProvider, $provide, $httpProvider) {


            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            var route = routeResolverProvider.route;

			//route.resolve(baseTemplateName, baseControllerName, path\dir name, isSecure, subscriptionPageKey, controllerJsPath)
			//define subscriptionPageKey only when that page is part of subscriptions
            $routeProvider
                .when('/dashboard', route.resolve('dashboard', 'dashboard', '', true, ''))
                .when('/manage-website/:domainName', route.resolve('manage-website', 'website', '', true, 'manage-website'))
                .when('/websites', route.resolve('websites', 'website', '', true, 'websites'))
                .when('/social-media', route.resolve('smprofiles', 'smProfile', 'profile/', true, 'social-media'))
                .when('/manage-products', route.resolve('manage-products', 'manageProducts', 'profile/', true, ''))
                .when('/add-product', route.resolve('add-new-product', 'addNewProduct', 'profile/', true, ''))
                .when('/edit-product/:id', route.resolve('edit-product', 'addNewProduct', 'profile/', true, ''))
                .when('/new-website', route.resolve('new-website', 'newWebsite', '', true, 'new-website'))
                .when('/web-analytics', route.resolve('analytics', 'analytics', '', true, ''))

                .when('/mobile-apps', route.resolve('mobile-apps', 'mobileApps', '', true, 'mobile-apps'))
                .when('/push-notification', route.resolve('push-notification', 'mobileApps', '', true, 'push-notification'))
                .when('/product-report', route.resolve('product-report','productReport', 'reports/', true, 'product-report'))
                .when('/product-search-trend', route.resolve('product-search-trend','productSearchTrend', 'intelligence/', true, '',''))
                .when('/trade-summary', route.resolve('trade-summary','tradeSummary', 'intelligence/', true, ''))
                .when('/historical-demand-analysis/:product?/:code?', route.resolve('historical-demand','historicalDemand', 'intelligence/', true, ''))
                .when('/monthwise-demand-analysis/:product?/:code?', route.resolve('monthwise-demand','monthwiseDemand', 'intelligence/', true, ''))
                .when('/daily-market-price/:product?/:market?', route.resolve('daily-market-mandi-price','dailyMarketMandiPrice', 'intelligence/', true, ''))
                .when('/current-demand-analysis/:product?/:code?', route.resolve('current-demand','currentDemand', 'intelligence/', true, 'current-demand-analysis'))
                .when('/global-demand-analysis', route.resolve('global-current-demand','globalCurrentDemand', 'intelligence/', true, ''))
                .when('/current-demand-report', route.resolve('current-demand-report', 'currentDemandReport', 'reports/', true, 'current-demand-report'))
                .when('/price-analysis', route.resolve('price-analysis','priceAnalysis', 'intelligence/', true, 'price-analysis'))
                .when('/global-trade', route.resolve('global-trade','globalTrade', 'intelligence/', true, ''))
                .when('/compare-trade-stats', route.resolve('stats-compare','compareStats', 'intelligence/', true, 'compare-trade-stats'))
                .when('/predictive-analysis', route.resolve('stats-predictive','predictiveStats', 'intelligence/', true, 'predictive-analysis'))
                .when('/importers-search/:product?/:code?', route.resolve('importers-search','searchImporters', 'counterparts/', true, ''))
                .when('/importers-purchased', route.resolve('importers-purchased','importerReports', 'counterparts/', true, ''))
				.when('/exporters-search/:product?/:code?', route.resolve('exporters-search','searchExporters', 'counterparts/', true, ''))
                .when('/exporters-purchased', route.resolve('exporters-purchased','exporterReports', 'counterparts/', true, ''))

                .when('/holistic-view/:id', route.resolve('holistic-view','holisticView', 'counterparts/', true, ''))
                .when('/reports-purchased', route.resolve('reports-purchased','reports', 'reports/', true, 'reports-purchased'))
                .when('/leads', route.resolve('leads','leads', '', true, 'leads'))
                .when('/inbox', route.resolve('inbox','inbox', '', true, '', 'mail'))
                .when('/trash', route.resolve('deleted-mails','trash', '', true, '', 'mail'))
                .when('/personal-profile', route.resolve('personal-profile','personalProfile', 'profile/', true, ''))
                .when('/business-profile/:stepname', route.resolve('company-profile','companyProfile', 'profile/', true, ''))
                .when('/business-profile', route.resolve('company-profile','companyProfile', 'profile/', true, ''))
                .when('/change-password', route.resolve('change-pwd','changePwd', 'profile/', true, ''))
                .when('/lead-notification-config', route.resolve('lead-configuration','leadConfig', 'profile/', true, 'lead-notification-config'))
                .when('/google-rank', route.resolve('rank-checker','rankChecker', 'tools/', true, 'google-rank'))
                .when('/hs-code-finder', route.resolve('hs-code-finder','tools', 'tools/', true, ''))
                .when('/nic-code-finder', route.resolve('nic-code-finder','tools', 'tools/', true, ''))
                .when('/export-price-calculator', route.resolve('export-price-calculator','tools', 'tools/', true, ''))
		        .when('/export-import-documents', route.resolve('export-import-documents','tools', 'tools/', true, ''))
                .when('/export-duty-calculator', route.resolve('export-duty-calculator','tools', 'tools/', true, ''))
                .when('/custom-duty-calculator', route.resolve('custom-duty-calculator','tools', 'tools/', true, ''))
                .when('/global-custom-duty-calculator', route.resolve('global-custom-duty-calculator','tools', 'tools/', true, ''))
                .when('/global-export-duty-calculator', route.resolve('global-export-duty-calculator','tools', 'tools/', true, ''))
                //.when('/landed-cost-calculator', route.resolve('landed-cost-calculator','tools', 'tools/', true, ''))
                .when('/freight-rate-calculator', route.resolve('freight-rate-calculator','tools', 'tools/', true, ''))
                .when('/indian-custom-duty', route.resolve('indian-custom-duty','tools', 'tools/', true, ''))
                .when('/gst-rate-finder', route.resolve('gst-rate-finder','tools', 'tools/', true, ''))
                .when('/drawback-duty', route.resolve('drawback-duty','tools', 'tools/', true, ''))
                .when('/anti-dumping-duty', route.resolve('anti-dumping-duty','tools', 'tools/', true, ''))
                .when('/trade-finance-calculator', route.resolve('trade-finance-calculator','financeCalculator', 'tools/', true, ''))

	            .when('/book-shipment', route.resolve('book-shipment','shipmentBooking', 'shipment/', true, ''))
                .when('/bookings', route.resolve('bookings','bookings', 'shipment/', true, ''))
                .when('/freight-trend', route.resolve('freight-trend','freightTrend', 'shipment/', true, ''))
                .when('/subscribe', route.resolve('subscribe','main'))
                .when('/fyp/:tkn', route.resolve('fyp','login'))
                .when('/login/:redirect*?', route.resolve('login','login'))
                .when('/register/:redirect*?', route.resolve('register','login'))
				.when('/shipment-tracker', route.resolve('shipment-tracker','shipmentTracker', 'tools/', true, ''))
				.when('/trade', route.resolve('active-trade','activeTrade', 'trade/', true, ''))
				.when('/start-new-trade/:tradeType', route.resolve('start-new-trade','startNewTrade', 'trade/', true, ''))
				.when('/update-trade/:id', route.resolve('start-new-trade','startNewTrade', 'trade/', true, ''))
				.when('/trade-documents/:tradeId', route.resolve('trade-documents','tradeDocuments', 'trade/', true, ''))
				.when('/apply-for-finance', route.resolve('apply-for-finance','applyExportPSFinance', 'finance/', true, ''))
				.when('/finances', route.resolve('finance-history','finances', 'finance/', true, ''))
				.when('/finance/:id', route.resolve('apply-for-finance','applyExportPSFinance', 'finance/', true, ''))


                .when('/marketplaces/store-details',route.resolve('store-details','marketPlacesStore', 'business-setup/', true, ''))
                .when('/marketplaces/dashboard', route.resolve('market-places-dashboard','marketPlacesDashboard', 'business-setup/', true, ''))
                .when('/marketplaces/products', route.resolve('product-listings','marketPlaceProductListings', 'business-setup/', true, ''))
                .when('/marketplaces/product-details/:id', route.resolve('product-details','marketPlaceProductDetails', 'business-setup/', true, ''))
                .when('/marketplaces/add-product', route.resolve('add-product','marketPlaceAddProduct', 'business-setup/', true, ''))
                .when('/marketplaces/orders', route.resolve('orders','marketPlaceOrders', 'business-setup/', true, ''))
                .when('/marketplaces/orders/:id', route.resolve('order-details','marketPlaceOrder', 'business-setup/', true, ''))
                .when('/marketplaces/store/:id', route.resolve('store-details','marketPlacesStore', 'business-setup/', true, ''))
                .when('/marketplaces/add-store',route.resolve('add-store','marketPlacesStore','business-setup/',true,''))
                .when('/marketplaces/distributors', route.resolve('offline-dashboard','offlineDashboard', 'business-setup/', true, ''))
                .when('/marketplaces/campaigns', route.resolve('campaigns','campaigns', 'business-setup/', true, ''))

                .otherwise({ redirectTo: '/dashboard' });

    }]);

    app.run(['$q', '$rootScope', '$location', 'authService','$http',
        function ($q, $rootScope, $location, authService,$http) {
			var token = window.localStorage.getItem('c2iSession'); if(token) {$http.defaults.headers.common['X-Auth-Token'] = token;}
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
				$rootScope.busyMsg = 'Please wait...';
                if (next && next.$$route && next.$$route.secure) {
                    if (!authService.checkIfAuthenticated()) {
                        authService.redirectToLogin();
                    } else if (next.$$route.subscriptionCheckNeeded) {
						if($rootScope.cpDetailsLoaded) {
							authService.isSubscribedComponentPromise(next.$$route.subscriptionPageKey).then(function(data) {
								if(!data.subscribed) {
									$location.replace();
									$location.path('/subscribe');
								}
							});
						} else {
							$rootScope.$watch('cpDetailsLoaded', function(newVal, oldVal) {
								if(newVal && newVal != oldVal) {
									authService.isSubscribedComponentPromise(next.$$route.subscriptionPageKey).then(function(data) {
										if(!data.subscribed) {
											$location.replace();
											$location.path('/subscribe');
										}
									});
								}
							});
						}
					} else {
						authService.isProfileCompleted().then(function(data) {
							if(data.setupRequired) {
								$location.replace();
								//console.log("--->>" + $location.url());// && "/importers-search"!=$location.url()
								if(data.type == 'productUpdateRequired') {
									$location.path('/add-product');

								} else if (data.type == 'profileUpdateRequired') {
									$location.path('/business-profile/setup-profile');

								}
								//$location.path('/business-profile/setup-profile');
							}
						});
					}
                }
            });

    }]);

	app.filter('spaceToDash',function() {
		return function(inputStr) {
			if (inputStr) {
				return inputStr.replace(/\s+/g, '-').replace(/\//g,'-').replace(/\?/g,'-').replace(/\%/g,'-');
			}
		};
	});

	app.filter('as_trusted', ['$sce', function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}]);

	app.filter('as_trusted_url', ['$sce', function($sce){
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	}]);

	app.filter('formatDate', function(){
		return function(input) {
			if(input) {
				return moment(input).format('YYYY-MM-DD');
			}
		};
	});
    return app;

});
