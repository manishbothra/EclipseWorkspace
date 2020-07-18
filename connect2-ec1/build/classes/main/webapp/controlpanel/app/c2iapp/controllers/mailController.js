'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http', '$filter','$timeout'];

    var inboxController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http, $filter, $timeout) {
		$scope.url=$location.search();
		$scope.selectedMailIds = [];
		
		$scope.loadAllMails = function (reload) {
			dataService.getCompanyMails().then(function(data){
				$scope.setFreshItems(data);
			});
		};
		
		$rootScope.$watch('allMails', function(newVal, oldVal) {
			if (newVal) {
				$scope.setFreshItems(newVal);
			}
		}, true);
		
		$scope.setFreshItems = function(data) {
			if(!$scope.inAction) {
				$scope.mails=data;
				$scope.inboxItems = $filter('orderBy')($scope.mails.incoming, 'date', true);
				$scope.deletedItems = $filter('orderBy')($scope.mails.deleted, 'date', true);
				$scope.sentItems = $scope.mails.outgoing;
				var newItems = $filter('filter')($scope.inboxItems, {status: 'new'});
				if(newItems) {
					$scope.newMailCounts = newItems.length;
					$rootScope.alertCount = $scope.newMailCounts;
				}
			}		
		};
		
		$scope.refreshItems = function() {
			$scope.inAction = false;
			$scope.selectedMailIds = [];
			$scope.loadAllMails(true);
			$scope.selectedMsg = undefined;
		};
		
		$scope.isMailSelected = function(mailId) {
			return $scope.selectedMailIds.indexOf(mailId) >= 0;
		};
		
		$scope.showMailContents = function(mid) {
			$scope.selectedMsg = $filter('filter')($scope.inboxItems, {id: mid})[0];
			$scope.showMsgContents = true;
			$scope.selectedMailIds = [mid];
			if($scope.selectedMsg.status.toLowerCase() === 'new') {
				$scope.markAsRead(true);
			}		
			$scope.inAction = true;
		};
		
		$scope.getFormattedTime = function(date) {
			var dateF = moment(date, "YYYY-MM-DD hh:mm:ss.SSSS").fromNow();
			return dateF;
		};
		$scope.markAsRead = function(inBackground) {
			$scope.busy = !inBackground;
			$scope.changeMailStatus('received');		
		};
		
		$scope.deleteMails = function() {
			$scope.changeMailStatus('deleted');
		};
		
		$scope.deleteMail = function(id) {
			$scope.selectedMailIds = [id];
			$scope.changeMailStatus('deleted');
		};
		
		$scope.changeMailStatus = function(status1) {
			if ($scope.selectedMailIds.length > 0) {			
				var payload = {
					status : status1,
					ids : $scope.selectedMailIds
				};
				$http({
					method: 'POST',
					url: '/api/controlpanel/mails/update/',
					data: payload
				}).success(function(data){
					if('deleted' === status1) {
						$scope.refreshItems(true);
					} else if('received' === status1) {
						$scope.newMailCounts = $scope.newMailCounts - 1;
						$scope.selectedMsg.status = 'received';
						$rootScope.alertCount = $scope.newMailCounts;
					}
					$scope.busy=false;				
				}).error(function(error) {
					$scope.busy = false;
					$scope.errorMsg = 'Could not update mail(s). Please try again later.';
				});
			}
		};
		
		$scope.loadAllMails(true);
    };

    inboxController.$inject = injectParams;
    app.register.controller('inboxController', inboxController);

	/* ******************************************************************************** */
	/* ******************************************************************************** */
	/* ******************************************************************************** */
	var trashController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http, $filter, $timeout) {
		$scope.url=$location.search();
		$scope.selectedMailIds = [];
		$scope.deletedItems = [];
		
		$scope.loadDeletedMails = function(addTimer) {
			$http.get('/api/controlpanel/mails/')
				.success(function(data){
					
					$scope.setFreshItems(data);
					$scope.busy=false;
					
					$timeout($scope.loadDeletedMails, 300000);	
				}).error(function(err) {
					$scope.busy=false;	
				});
		};
		
		$scope.setFreshItems = function(data) {
			if(!$scope.inAction) {
				$scope.mails=data;
				$scope.deletedItems = $filter('orderBy')($scope.mails.deleted, 'date', true);
			}		
		};
		
		$scope.refreshItems = function() {
			$scope.inAction = false;
			$scope.selectedMailIds = [];
			$scope.loadDeletedMails(true);
			$scope.selectedMsg = undefined;
		};
		
		$scope.isMailSelected = function(mailId) {
			return $scope.selectedMailIds.indexOf(mailId) >= 0;
		};
		
		$scope.showMailContents = function(mid) {
			$scope.selectedMsg = $filter('filter')($scope.deletedItems, {id: mid})[0];
			$scope.showMsgContents = true;
			$scope.selectedMailIds = [mid];
			$scope.inAction = true;
		};
		
		$scope.getFormattedTime = function(date) {
			var dateF = moment(date, "YYYY-MM-DD hh:mm:ss.SSSS").fromNow();
			return dateF;
		};
		
		$scope.moveToInbox = function(id) {
			$scope.selectedMailIds = [id];
			$scope.changeMailStatus('received');		
		};
		
		$scope.changeMailStatus = function(status1) {
			if ($scope.selectedMailIds.length > 0) {			
				var payload = {
					status : status1,
					ids : $scope.selectedMailIds
				};
				$http({
					method: 'POST',
					url: '/api/controlpanel/mails/update/',
					data: payload
				}).success(function(data){
					if('received' === status1) {
						$scope.refreshItems();
					}
					$scope.busy=false;				
				}).error(function(error) {
					$scope.busy = false;
					$scope.errorMsg = 'Could not update mail(s). Please try again later.';
				});
			}
		};
		
		$scope.loadDeletedMails(true, true);
    };

    trashController.$inject = injectParams;
    app.register.controller('trashController', trashController);
});