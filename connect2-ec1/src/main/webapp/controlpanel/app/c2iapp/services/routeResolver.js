'use strict';

define([], function () {

    var routeResolver = function () {

        this.$get = function () {
            return this;
        };

        this.routeConfig = function () {
            var viewsDirectory = 'app/c2iapp/views/',
                controllersDirectory = 'app/c2iapp/controllers/',

            setBaseDirectories = function (viewsDir, controllersDir) {
                viewsDirectory = viewsDir;
                controllersDirectory = controllersDir;
            },

            getViewsDirectory = function () {
                return viewsDirectory;
            },

            getControllersDirectory = function () {
                return controllersDirectory;
            };

            return {
                setBaseDirectories: setBaseDirectories,
                getControllersDirectory: getControllersDirectory,
                getViewsDirectory: getViewsDirectory
            };
        }();

        this.route = function (routeConfig) {

            var resolve = function (baseTemplateName, baseControllerName, path, isSecure, subscriptionPageKey, controllerJsPath) {
                if (!path) path = '';
				if(!controllerJsPath) {
					controllerJsPath = baseControllerName;
				}
				
                var routeDef = {};
                routeDef.templateUrl = routeConfig.getViewsDirectory() + path + baseTemplateName + '.html' + "?" + APPLICATION_VERSION;
                routeDef.controller = baseControllerName + 'Controller';
                routeDef.secure = (isSecure) ? isSecure : false;
				routeDef.subscriptionCheckNeeded = subscriptionPageKey ? true: false;
				routeDef.subscriptionPageKey = subscriptionPageKey;
                routeDef.resolve = {
                    load: ['$q', '$rootScope', function ($q, $rootScope) {
                        var dependencies = [routeConfig.getControllersDirectory() + path + controllerJsPath + 'Controller.js'];
                        return resolveDependencies($q, $rootScope, dependencies);
                    }]
                };

                return routeDef;
            },

            resolveDependencies = function ($q, $rootScope, dependencies) {
                var defer = $q.defer();
				$rootScope.loadingData = true;
                require(dependencies, function () {
                    defer.resolve();
					$rootScope.loadingData = false;
                    $rootScope.$apply();
                });

                return defer.promise;
            };

            return {
                resolve: resolve
            };
        }(this.routeConfig);

    };

    var servicesApp = angular.module('routeResolverServices', []);

    servicesApp.provider('routeResolver', routeResolver);
});
