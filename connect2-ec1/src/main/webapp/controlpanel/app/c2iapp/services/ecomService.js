'use strict';

define(['app'], function (app) {
    var injectParams = ['$http', '$rootScope', '$q', '$filter'];

    var ecomService = function ($http, $rootScope, $q, $filter) {
        var serviceBase = '/api/ecomm/';

		var dataFactory = {
			cacheData: {}
		};

		dataFactory.addStore = function (store) {
            return $http.post(serviceBase + 'createStore', store).then(
                function (results) {
                   return results;
                });
        };
        dataFactory.getStore = function(){
            return $http.get(serviceBase +'getStoreDetails').then(function(response){
                return response.data;
            },function(error){})
        };
        dataFactory.checkProductBrand = function(brand){
            return $http.post(serviceBase + 'brandApproval',brand).then(function(response){
                return response;
            })
        }
        dataFactory.insertBrandDetails = function(obj){
            return $http.post(serviceBase + 'insertBrandDetails',obj,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response){
                return response.data;
            })
        }
        dataFactory.getForm = function(product_info){
            return $http.post(serviceBase+'getProductForms',product_info).then(function(response){
                return response;
            },function(error){console.log(error)})
        };
        dataFactory.insertProductData = function(data){
            return $http.post(serviceBase + 'insertProduct',data).then(function(results){
                return results;
            });
        };
        dataFactory.getProductData = function(storeId){
            return $http.post(serviceBase + 'getProductDetails/false',storeId).then(function(results){
                return results;
            });
        };
        dataFactory.updateProduct = function(data){
            return $http.post(serviceBase+'updateProduct',data).then(function(results){
                return results;
            })
        };
        dataFactory.getAllProducts = function(storeId){
            return $http.post(serviceBase + 'getProducts/false',storeId).then(function(results){
                return results;
            })
        }
        dataFactory.updateProductPrice = function(obj){
            return $http.post(serviceBase + 'updateProductPrice',obj).then(function(response){
                return response;
            })
        }
        dataFactory.updateProductInventory = function(obj){
            return $http.post(serviceBase + 'updateProductInventory',obj).then(function(response){
                return response;
            })
        }
        dataFactory.getOrder = function(){
            return $http.post(serviceBase + 'getOrderDetails').then(function(response){
                return response;
            })
        }
        dataFactory.cancelOrder = function(cancelObj){
            return $http.post(serviceBase + 'cancelOrder',cancelObj).then(function(response){
                return results;
            })
        }

        dataFactory.uploadProductImage = function(formData,files) {
            var value="";
            if(files=='data-files'){
                value='insertStoreDocs';
            }
            else{
                value='insertProductImages';
            }
            return $http.post(serviceBase + value, formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response) {
                return response.data;
            });
        };
        dataFactory.getProductImages = function(){
            return $http.post(serviceBase + 'getProductImages').then(function(response){
                return results;
            })
        };
        dataFactory.updateProductImage = function(formData,files) {
          
            return $http.post(serviceBase + 'uploadProductImage', formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response) {
                return response.data;
            });
        };
		return dataFactory;
    };

    ecomService.$inject = injectParams;
    app.factory('ecomService',ecomService);
});
