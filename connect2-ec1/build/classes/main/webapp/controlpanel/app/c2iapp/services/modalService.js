"use strict";

define(['app'], function (app) {

    var injectParams = ['$uibModal'];

    var modalService = function ($uibModal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'app/c2iapp/partials/modal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            var tempModalDefaults = {};
            var tempModalOptions = {};

            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
			
				if(tempModalDefaults.controllerFn) {
					tempModalDefaults.controller = tempModalDefaults.controllerFn;
				}else {
					tempModalDefaults.controller = function ($scope, $uibModalInstance) {
						$scope.modalOptions = tempModalOptions;
						$scope.modalOptions.ok = function (result) {
							$uibModalInstance.close('ok');
						};
						$scope.modalOptions.close = function (result) {
							$uibModalInstance.close('cancel');
						};
					};
				}
				tempModalDefaults.controller.$inject = ['$scope', '$uibModalInstance'];
            } 

			if(customModalDefaults.scope) {
				customModalDefaults.scope['uibModalInstance'] = $uibModal.open(tempModalDefaults);
				return customModalDefaults.scope['uibModalInstance'].result;
			} else {
				return $uibModal.open(tempModalDefaults).result;
			}
        };
		
		this.showInfoMessage = function(title, message, okBtnText, closeBtnText) {
			 var modalOptions = {
				headerText: title,
                bodyText: message,
				closeButtonText: closeBtnText || 'Close',
				actionButtonText: okBtnText || 'OK'
            };
			return this.showModal({}, modalOptions);
		};
		
		
    };

    modalService.$inject = injectParams;

    app.service('modalService', modalService);

});
