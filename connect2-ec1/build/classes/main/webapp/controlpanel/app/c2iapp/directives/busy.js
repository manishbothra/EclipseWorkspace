'use strict';

define(['app'], function (app) {

    var injectParams = ['$rootScope'];

    var busy = function ($rootScope) {
        return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: '<div class="progressDialog"><div>{{busyMsg}}</div></div>',
			link: function(scope) {
				$rootScope.busyMsg = 'Please wait...';
			}
		  };
    };

    busy.$inject = injectParams;

    app.directive('busy', busy);

});