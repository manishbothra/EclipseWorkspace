'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', 'modalService','$filter'];

    var tradeDocumentsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, modalService,$filter) {
        $scope.successMsg = '';
        $scope.activeTradeId=$routeParams.tradeId;

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

		$scope.loadTradeDocuments = function() {
			dataService.getTradeDocuments($scope.activeTradeId).then(function(resp) {
				$scope.tradeDocuments = resp.data.data || [];
                angular.forEach($scope.tradeDocuments, function(doc, i){
                    doc['iconClass'] = dataService.getFileTypeIcon(doc.documentName);
                    doc['displaySize'] = dataService.getDisplayFileSize(doc.documentSize);
                });
			});
		};

        $scope.downloadDocument = function(doc) {
            authService.getTempAuthToken().then(function(data){
                if (data.success && data.tkn) {
                   window.open('/api/controlpanel/activeTrade/downloadDocument/' + doc.tradeDocumentId + "?c2itkn="+data.tkn);
                } else {
					$scope.errorMsg = "Couldn't download the data. Please try again or contact support";
				}
            });
		};

		$scope.loadCompanyDetails(false);
		$scope.loadTradeDocuments();
    };

    tradeDocumentsController.$inject = injectParams;
    app.register.controller('tradeDocumentsController', tradeDocumentsController);

});
