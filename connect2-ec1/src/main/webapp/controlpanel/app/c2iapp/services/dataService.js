'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope', '$q', '$filter'];

    var dataService = function ($http, $rootScope, $q, $filter) {
        var serviceBase = '/api/controlpanel/';

		var dataFactory = {
			cacheData: {},
			resetCache: function() {
				dataFactory['cacheData'] = {};
				dataFactory.cpCountryLoading = false;
			}
		};

		dataFactory.getDashboardStats = function (fromDate, toDate) {
            return $http.post(serviceBase + 'dashboard', {fromDate: fromDate, toDate: toDate}).then(
                function (results) {
                   return results;
                });
        };

		dataFactory.getRecentActivities = function (limit, fromDate, toDate) {
			limit = !limit? 10: limit;
            return $http.post(serviceBase + 'recentActivities', {fromDate: fromDate, toDate: toDate, limit: limit}).then(
                function (results) {
                   return results;
                });
        };

		dataFactory.getPurchasedImpList = function (fromDate, toDate) {
            return $http.post(serviceBase + 'purchasedReports', {loadDetails:false, type:'IMPORTERS_DATA', fromDate: fromDate, toDate: toDate
			}).then(
                function (results) {
                   return results;
                });
        };

		dataFactory.getPurchasedReportList = function (fromDate, toDate) {
            return $http.post(serviceBase + 'purchasedReports', {loadDetails:false, fromDate: fromDate, toDate: toDate
			}).then(
                function (results) {
                   return results;
                });
        };

		dataFactory.getReportDetails = function (reportId) {
            return $http.get(serviceBase + 'report/' + reportId).then(
                function (results) {
                   return results;
                });
        };

		dataFactory.getAllLeads = function (reportId, fromDate, toDate) {
            return $http.post(serviceBase + 'getLeads', {fromDate: fromDate, toDate: toDate}).then(
                function (results) {
                   return results;
                });
        };

		dataFactory.addNewProduct = function (productForm) {
            return $http.post(serviceBase + 'addProduct', productForm).then(
                function (results) {
                   return results;
                });
        };

		dataFactory.deleteProduct = function (payload) {
            return $http.post(serviceBase + 'deleteProduct', payload).then(
                function (results) {
                   return results;
                });
        };

		dataFactory.getCompanyDomains = function() {
			return $http.get('/api/controlpanel/getUserDomains').success(function(response) {
				return response;
			});
		};

		dataFactory.getImportersContactTemplate = function(templateId, params) {
			return $http.post('/api/controlpanel/counterpartContactTemplate/'+templateId, params).success(function(response) {
				return response;
			});
		};

		dataFactory.getProductExportCodes = function(requestTerm) {
			return $http.get('/api/search/digit8ProductExport/' + requestTerm + '/10').success(function(response) {
				return response;
			});
		};

		dataFactory.getProduct8DigitExportCodes = function(requestTerm) {
			return $http.get('/api/search/india8DigitProductCodes/' + requestTerm + '/100').success(function(response) {
				return response.data;
			});
		};

		dataFactory.checkRank = function (payload) {
            return $http.post(serviceBase + 'getKeywordRank', payload || {}).then(
                function (results) {
                   return results;
                });
        };

		dataFactory.getIndianImporters = function(hsCode, productName,pageNo,pageSize, isBuyRequest) {
			var payload = {
					"name":productName,
				    "extra":"c2imask",
					"page": pageNo,
					"type":"import",
					"pageSize":pageSize,
					 filtersRequired:false,
					 logAction: true
				};
			if (hsCode) {
				payload["hscodes"] = ["" + hsCode];
				payload["name"] = "";
			}

			var url='/api/search/all/india';
			return $http.post(url, payload).then(function(response) {
					return response.data['import'];
			});
		};

		dataFactory.getGlobalImporters = function(hsCode, productName,pageNo,pageSize, isBuyRequest) {
			var payload = {
					"term":productName,
					"type":"import",
					"page_number": pageNo,
					tradeLocation:"Overseas",
					"page_size":pageSize,
					"buyRequest" : isBuyRequest || false,
					"excludeLocations":['India'],
					'extraFlag':"scache",
					filtersRequired:false,
					logAction: true
				};
			if (hsCode) {
				payload["hscodes"] = ["" + hsCode];
			}
			var url = '/api/search/filter/all/'+ pageNo + '/'+ pageSize + '/false';
			return $http.post(url, payload).then(function(response) {
					return response;
			});
		};

		dataFactory.getGlobalImporters1 = function(hsCode, productName,pageNo,pageSize, ageRange,countries,country,ownerShipType,hasRegistrationDetails,hasTradeDetails,hasShipmentDetails,tradeLocation, code,sortOption,isBuyRequest) {

			var payload = {
			    "ageRange":ageRange,
				"companyType":"",
				"countries":countries,
				"term":productName,
				"type":"import,buyer",
				"page_number": pageNo,
				tradeLocation:tradeLocation,
				"page_size":pageSize,
				"country":country,
				//"buyRequest" : isBuyRequest || false,
				"excludeLocations":['India'],
				'extraFlag':"scache",
				filtersRequired:true,
				logAction: true
			};

			if (code) {
				payload["hscodes"] = ["" + code];
				payload["term"] = "";
			}

			if (sortOption) {
				payload["sortOption"] = sortOption;
			}
			if (ownerShipType) {
				payload["ownerShipType"] = ownerShipType;
			}
			if (hasRegistrationDetails) {
				payload["hasRegistrationDetails"] = hasRegistrationDetails;
				payload["hasTradeDetails"] = hasTradeDetails;
				payload["hasShipmentDetails"] = hasShipmentDetails;
			}

			else if (hasTradeDetails) {
				payload["hasRegistrationDetails"] = hasRegistrationDetails;
				payload["hasTradeDetails"] = hasTradeDetails;
				payload["hasShipmentDetails"] = hasShipmentDetails;
			}
			else if (hasShipmentDetails) {
				payload["hasRegistrationDetails"] = hasRegistrationDetails;
				payload["hasTradeDetails"] = hasTradeDetails;
				payload["hasShipmentDetails"] = hasShipmentDetails;
			}

			var url = '/api/search/filter/all/'+ pageNo + '/'+ pageSize + '/true';
			return $http.post(url, payload).then(function(response) {
					return response;
			});
		};

		dataFactory.getWebsiteData = function(domainName) {
			return $http.get('/api/controlpanel/websiteData/').then(function(response) {
				return response;
			});
		};

		dataFactory.getMobileApps = function(domainName) {
			return $http.post('/api/controlpanel/mobileAppData', {}).then(function(response) {
				return response;
			});
		};

		dataFactory.sendPushNotification = function(payload) {
			return $http.post(serviceBase + 'pushNotification',payload).then(function(response) {
				return response;
			});
		};

		dataFactory.requestMobileApp = function(payload) {
			return $http.post(serviceBase + 'requestForMobileApp',payload).then(function(response) {
				return response;
			});
		};

		dataFactory.getProductsForAutocomplete = function (searchKey, limit) {
			limit = limit || 10;
			return $http.get('/api/search/productNames1/' + searchKey + "/" + limit).then(function(response) {
				return response;
			});
		};

		dataFactory.getProductAncestorChain = function (hscode) {
			return $http.get('/api/search/getProductAncestorChain/' + hscode).then(function(response) {
				return response.data;
			});
		};

		dataFactory.get8digitProductsForAutocomplete = function (searchKey, limit) {
			limit = limit || 10;
			return $http.get('/api/search/digit8ProductImport/' + searchKey + "/" + limit).then(function(response) {
				return response;
			});
		};

		dataFactory.getDutyProductsForAutocomplete = function (searchKey, limit) {
			limit = limit || 10;
			return $http.get('/api/search/dutyProducts/import/' + searchKey + "/" + limit).then(function(response) {
				return response;
			});
		};

		dataFactory.getLocationsAutocomplete = function (searchKey, limit) {
			limit = limit || 10;
			return $http.get('/api/search/locationNames/' + searchKey + "/" + limit).then(function(response) {
				return response;
			});
		};

		dataFactory.getAllCountries = function(reload) {
			if (!dataFactory.cpCountryLoading) {
				dataFactory.countryListDeffered = $q.defer();
				if(dataFactory['cacheData']['countryList'] && !reload) {
					dataFactory.countryListDeffered.resolve(dataFactory['cacheData']['countryList']);
				} else {
					dataFactory.cpCountryLoading = true;
					var api = '/api/search/locations/countries/all';
					$http.get(api).then(function(response) {
						if(response.data.success) {
							var dataList = response.data.data || [];
							if(dataList) {
								var inc = $filter('filter')(dataList, {name:'India'})[0];
								dataList = $filter('orderBy')(dataList, 'name');
								dataList.unshift(inc);
							} else {
								dataList.unshift({name:'India'});
							}
							dataFactory['cacheData']['countryList'] = dataList;
							dataFactory.countryListDeffered.resolve(dataList);
						} else {
							dataFactory.countryListDeffered.resolve({});
						}
						dataFactory.cpCountryLoading = false;
					});

				}
			}
			return dataFactory.countryListDeffered.promise;
		};

		dataFactory.getIndianStates = function(reload) {
			if (!dataFactory.cpStateLoading) {
				dataFactory.stateListDeffered = $q.defer();
				if(dataFactory['cacheData']['indianStates'] && !reload) {
					dataFactory.stateListDeffered.resolve(dataFactory['cacheData']['indianStates']);
				} else {
					dataFactory.cpStateLoading = true;
					var api = '/api/search/locations/states/india/all';
					$http.get(api).then(function(response) {
						if(response.data.success) {
							var dataList = response.data.data || [];
							dataFactory['cacheData']['indianStates'] = dataList;
							dataFactory.stateListDeffered.resolve(dataList);
						} else {
							dataFactory.stateListDeffered.resolve({});
						}
						dataFactory.cpStateLoading = false;
					});

				}
			}
			return dataFactory.stateListDeffered.promise;
		};

		dataFactory.getAllCountryNames = function () {
			return $http.get('/api/trade/countrydetails').then(function(response) {
				return response.data;
			});
		};

		dataFactory.getHSCodeProductsAutocomplete = function (searchKey, limit) {
			limit = limit || 10;
			return $http.get('/api/search/HSproductNames/' + searchKey + "/" + limit).then(function(response) {
				return response;
			});
		};

		dataFactory.getProductsWithHsCode = function (searchKey, limit) {
			limit = limit || 10;
			return $http.get('/api/search/productsWithHsCode/' + searchKey + "/" + limit).then(function(response) {
				return response;
			});
		};


		dataFactory.filterPortData = function(tradeType, payload) {
			var api = '/api/trade/filter/' + tradeType;
			return $http.post(api,payload).then(function(response) {
				return response;
			});
		};

		dataFactory.predictTradeData = function(predictionType, payload) {
			var api = '/api/trade/stats/predict/' + predictionType;
			return $http.post(api, payload).then(function(response) {
				return response;
			});
		};


		dataFactory.getGlobalTradeData = function(tradeType, payload) {
			var api = '/api/globalTrade/getTradeData/' + tradeType;
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getGlobalTradeLocations = function(tradeType, payload) {
			var api = '/api/globalTrade/locations';
			return $http.get(api).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getMasterProducts = function() {
			var def = $q.defer();
			if(dataFactory['masterProductsData']) {
				def.resolve(dataFactory['masterProductsData']);
			} else {
				$http.get('/api/search/getProducts').then(function(response){
					if(response.data) {
						dataFactory['masterProductsData'] = response.data;
					}
					def.resolve(response.data);
				});
			}
			return def.promise;
		};

		dataFactory.getCompanyConfig = function (configType) {
			return $http.get('/api/controlpanel/getCompanyConfig/' + configType).then(function(response) {
				return response;
			});
		};

		dataFactory.contactCompany = function(payload) {
			var api = serviceBase +  'contactCompany';
			return $http.post(api,payload).then(function(response) {
				return response;
			});
		};

		dataFactory.getCompanyMails = function(payload) {
			return $http.get(serviceBase +  'mails/').then(function(response) {
				return response.data;
			});
		};

		/* ***** PRODUCT REPORT APIS ****** */
		dataFactory.getTradeByProductName = function(productName, year) {
			return $http.get('/api/trade/productNameDetails/'+productName+'/' + year).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getTradeCountryWiseByProductName = function(productName, tradeType) {
			return $http.get('/api/trade/productTopCountries/' + tradeType + '/'+productName).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getTradeYearWiseByProductName = function(productName, tradeType) {
			return $http.get('/api/trade/productStats/'+productName+'/' + tradeType + '/all').then(function(response) {
				return response.data;
			});
		};

		/* *** CURRENT DEMAND APIS*** */
		dataFactory.getCurrentDemands = function(tradeType, payload) {
			var api = '/api/trade/currentDemand/' + tradeType;
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getDailyDemandTrend = function(tradeType, payload) {
			var api = '/api/trade/analysis/daily-trend/' + tradeType;
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getFilteredPortDataDetailed = function(tradeType, payload, isFilterRequired) {
			var api = '/api/trade/filterPort/' + tradeType + '/' + isFilterRequired;
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getFilteredPortDataList = function(tradeType, payload) {
			var api = '/api/trade/filterPort/' + tradeType;
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		/* *** HISTORICAL DEMAND APIS*** */

		dataFactory.getHistoricalTradeCountrywise = function(productCode, productName, country, tradeType) {
			return $http.get('/api/trade/countryproduct/'+productCode+'/' + country + '/' + productName + '/'+tradeType).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getHistoricalTradeForCountry = function(productName, country, tradeType) {
			return $http.get('/api/trade/newexim/' + tradeType + '/' + productName + '/'+ country).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getHistoricalTradeForProductNCountryDetailed = function(productCode, productName, country, tradeType, isFilterRequired) {
			return $http.get('/api/trade/newtrade/'+productCode+'/'+country+'/' + productName + '/'+ tradeType +'/' + isFilterRequired).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getHistoricalTradeForProductNCountryList = function(productCode, productName, country, tradeType) {
			return $http.get('/api/trade/newtrade/'+productCode+'/'+country+'/' + productName + '/'+ tradeType).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getHistoricalTrendGeoChartData = function(tradeType) {
			return $http.get('/api/trade/mapchart/' + tradeType + '/All').then(function(response) {
				return response.data;
			});
		};

		dataFactory.getProductHistoricalTrendGeoChartData = function(tradeType, code) {
			return $http.get('/api/trade/mapproductchart/' + tradeType + '/' + code).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getHistoricalDemandTrend = function(tradeType, payload) {
			var api = '/api/trade/analysis/trend/' + tradeType;
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getFilteredTradeData = function(tradeType, payload) {
			var api = '/api/trade/filter/' + tradeType;
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};
	/* *** HISTORICAL APIS END*** */

  	/* *** MONTHWISE APIS*** */
    dataFactory.getMontiwiseTradeCountrywise = function(productCode, productName, country, tradeType, year, tradeMonths) {
      var payload = {
          destinationCountry: 699,
          outputType: "COUNTRY_WISE",
          logAction: true,
          parentId:productCode,
          populateFilterData: true,
          endYear: year,
          tradeMonths : tradeMonths || []
        };

      return $http.post('/api/trade/monthwiseHistoricalStats/'+tradeType, payload).then(function(response) {
        return response.data;
      });
    };

    dataFactory.getMonthwiseTradeForProductNCountryDetailed = function(productCode, productName, country, tradeType, isFilterRequired, year, tradeMonths) {
      var payload = {
          destinationCountry: 699,
          outputType: "ALL_SUB", //"COUNTRY_WISE",
  				originCountry: country,
          logAction: true,
          parentId:productCode,
          populateFilterData: isFilterRequired,
          endYear: year,
          tradeMonths : tradeMonths || []
        };
      return $http.post('/api/trade/monthwiseHistoricalStats/'+tradeType, payload).then(function(response) {
        return response.data;
      });
    };

		dataFactory.getFilteredMonthwiseMontiwiseTradeData = function(tradeType, payload) {
			var api = '/api/trade/monthwiseHistoricalStats/' + tradeType;
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getMonthwiseDemandTrend = function(tradeType, payload) {
			var api = '/api/trade/analysis/monthwiseTrend/' + tradeType;
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

  	/* *** MONTHWISE APIS END*** */
		/* *** TOOLS APIS*** */

		dataFactory.getHSCodeByName = function(name) {
			return $http.get('/api/search/hscodefinder/'+ name).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getNicCodeByName = function(name) {
			return $http.get('/api/search/nicNameSearch/'+ name).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getNicCodeByCode = function(code) {
			return $http.get('/api/search/nicCodeSearch/'+ code).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getExportPrice = function(formData) {
			return $http({
			   method  : "POST",
			   url     : '/api/trade/calc',
			   data    : $.param(formData),
			   headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		   }).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getCustomDuties = function(productCode, payload) {
			var api = '/api/trade/getGlobalExportDuties/' + productCode;
			if(!payload) {payload = {};}
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getLandedCost = function(productCode, productValue, payload) {
			var api = '/api/trade/landedcost/' + productValue + '/' + productCode;
			if(!payload) {payload = {};}
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};
		dataFactory.getLandedCostNew = function(payload) {
			var api = '/api/trade/getLandedCost';
			if(!payload) {payload = {};}
			return $http.post(api,payload).then(function(response) {
				return response.data;
			});
		};
		dataFactory.getExportDuties = function(productCode, productValue, payload) {
			var api = '/api/trade/getAllProductsExportDuty/' + productCode + '/' + productValue;
			if(!payload) {payload = {};}
			return $http.get(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getIndianCustomDuties = function(productCode, payload) {
			var api = '/api/trade/getIndianImportDuty/' + productCode;
			if(!payload) {payload = {};}
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getIndianDrawbackDuties = function(productCode, payload) {
			var api = '/api/trade/getDrawbackDuty/' + productCode;
			if(!payload) {payload = {};}
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getIndianDumpingDuties = function(productCode, payload) {
			var api = '/api/trade/getDumpingDuty/' + productCode;
			if(!payload) {payload = {};}
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getFreightRates = function(payload) {
			var api = '/api/freight/freightRates';
			if(!payload) {payload = {};}
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getRelatedProducts = function(name, type, page, size) {
			return $http.get('/api/search/relatedProductNames/'+ name + '/' + type + '/' + page + '/' + size).then(function(response) {
				return response;
			});
		};

		/* *** GLOBAL CURRENT DEMAND APIS*** */

		dataFactory.getGlobalCurrentDemand = function(tradeType, payload, targetLocationId) {
			var api = '/api/globalTrade/globalCurrentDemand/' + targetLocationId + '/' + tradeType;
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		/* ** PRODUCT CATALOG CHANGES *** */
		dataFactory.uploadProductImage = function(formData) {
			var uploadUrl = '/api/controlpanel/uploadProductImage';
			return $http.post(uploadUrl, formData, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getCompanyProductById = function(companyProductId, loadParentProductMappings) {
			var api = '/api/controlpanel/companyProduct/' + companyProductId;
			return $http.post(api, {'loadParentProductMappings': loadParentProductMappings}).then(function(response) {
				return response.data;
			});
		};

		dataFactory.deleteProductImage = function(payload) {
			var api = '/api/controlpanel/deleteProductImage';
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.updateCompanyProduct = function(payload) {
			var api = '/api/controlpanel/updateProduct';
			return $http.post(api, payload).then(function(response) {
				return response.data;
			});
		};

		dataFactory.getFreightPlaceAutoComplete = function (searchKey, country, type, limit) {
			limit = limit || 10;
			return $http.get('/api/freight/getFreightPlaces/' + searchKey + "/" + country + "/" + type + "/" + limit).then(function(response) {
				return response;
			});
		};

		dataFactory.trackShipment = function (payload) {
            return $http.post('/api/freight/trackShipment', payload || {}).then(
                function (results) {
                   return results.data;
				});
        };

        dataFactory.getExportsPrice = function (payload) {
            return $http.post('/api/trade/getIndiaExportPrice', payload || {}).then(
                function (results) {
                   return results.data;
				});
        };

        dataFactory.getProfileAnalytics = function (payload) {
            return $http.post('/api/controlpanel/profileAnalytics', payload || {}).then(
                function (results) {
                   return results.data;
				});
        };
        dataFactory.getCustomDutiesFromFile = function(country1){
	    	return  $http.get('/files/duties/' + country1 + '.html')
	    	.then(function(response){
	    		return response.data;
	    	});
	    };
		 dataFactory.getDocumentsFromFile = function(country){
	    	return  $http.get('/files/forms/' + country + '.html')
	    	.then(function(response){
	    		return response.data;
	    	});
	    };
        dataFactory.getCustomDuties = function(country1, productCode){
	    	return $http.get('/api/trade/getCustomDutiesTaxesNew/' + country1 + '/' + productCode)
	    	.then(function(response){
	    		return response.data;
	    	});
	    };

	    dataFactory.getGlobalCustomDuties = function(country1, country2, productCode){
	    	return $http.get('/api/trade/getAllCountriesDuties/' + country1 + '/' + country2 + '/' + productCode)
	    	.then(function(response){
	    		return response.data;
	    	});
	    };

		dataFactory.getGlobalExportDuties = function(country1, productCode) {
			return $http.get('/api/trade/getGlobalExportDuties/' + country1 + '/' + productCode)
	    	.then(function(response){
	    		return response.data;
	    	});
		};

		dataFactory.getGlobalExportDutiesHsLevel = function(country1, productCode) {
			return $http.get('/api/trade/getGlobalExportDutiesHsLevel/' + country1 + '/' + productCode + '/10')
	    	.then(function(response){
	    		return response.data;
	    	});
		};

	    dataFactory.getAllProducts = function(){
	    	return $http.get('/api/search/getMainProductsCodes/0')
	    	.then(function(response){
	    		return response.data;
	    	});
	    };
		dataFactory.getCustomDutiesCountries = function(){
	    	/*return $http.get('/api/trade/getCustomDutiesCountries')
	    	.success(function(response){
	    		return response;
	    	});*/
	    };

	    dataFactory.getDigit4Codes = function(code){
	    	return $http.get('/api/search/getSublevel/'+code)
	    	 .then(function(response){
	    		 return response.data;
	    	 });
	    };

	    dataFactory.getCountryHSCodes = function(country1, code, name){
	    	return $http.get('/api/trade/getCountryHSCodes/' + country1 + '/' + code + '/' + name + '/100')
	    	.then(function(response){
	    		return response.data;
	    	});
	    };

		dataFactory.getSectorData = function(){
	    	return $http.get('/files/json/sectors.json')
	    	.success(function(response){
	    		return response.data;
	    	});
	    };

	    dataFactory.getCountryCodes = function(country1, productParam){
	    	return $http.get('/api/trade/getCountryHSCodes/' + country1 + '/' + productParam + '/10')
	    	.then(function(response){
	    		return response.data;
	    	});
	    };
	    
	    dataFactory.topExportProducts = function(){
	    	return $http.get('/api/trade/productchart1/export')
			.then(function(response) {
				return response.data;
			});
	    };

	    dataFactory.topImportProducts = function(){
	    	return $http.get('/api/trade/productchart1/import')
			.then(function(response) {
				return response.data;
			});
	    };

	    dataFactory.topImportCountries = function(){
	    	return $http.get('/api/trade/country/import/All')
			.then(function(response) {
				return response.data;
			});
	    };

	    dataFactory.topExportCountries = function(){
	    	return $http.get('/api/trade/country/export/All')
			.then(function(response) {
				return response.data;
			});
	    };
	    
	    dataFactory.topExportPorts = function(payload){
	    	return $http.post('/api/trade/filterPort/export', payload || {}).then(
    			function (results) {
                    return results.data;
 				});
	    }

	    dataFactory.topImportPorts = function(payload){
	    	return $http.post('/api/trade/filterPort/import', payload || {}).then(
    			function (results) {
                    return results.data;
 				});
	    }

		dataFactory.getDutyProductsAutoComplete = function(callbackFn) {
			var myOption = {
				options: {
					html: true,
					focusOpen: false,
					onlySelectValid: false,
					source: function(request, response) {
						var data = [];
						if (request.term && request.term.length > 3) {
							$http.get("/api/search/dutyProducts/import/" + request.term + "/10").then(function(data1) {
								if (data1) {
									var productNames = data1.data;
									angular.forEach(productNames, function(value, index) {
										data.push({
											label: value.value + '--' + value.parentValue,
											value : value.value,
											name : value.parentValue,
											category: 'Products'
										});
									});
									response(data);
								}
							});
						}
					},
					select: function(event, ui) {
						if (ui.item && ui.item.value && ui.item.value.length > 3) {
							var formObj = {};
							formObj.code = ui.item.value;
							formObj.productCode = ui.item.value + " - " + ui.item.name;
							formObj.productName = ui.item.name;
							callbackFn(formObj);
						}
					}
				},
				methods: {}
			};
			return myOption;
		};

		/* *****************************
		****ACTIVE TRADE RELATED APIS***
		********************************
		********************************/


		dataFactory.getAllOngoingTrades = function() {
			return $http.get('/api/controlpanel/activeTrades/all').success(function(response) {
				return response.data;
			});
		};


		dataFactory.getOngoingTradeDetails = function(activeTradeId) {
			return $http.post('/api/controlpanel/activeTrade', {activeTradeId: activeTradeId}).success(function(response) {
				return response.data;
			});
		};

		dataFactory.updateOngoingTradeDetails = function(activeTrade) {
			return $http.post('/api/controlpanel/activeTrade/update', activeTrade).success(function(response) {
				return response.data;
			});
		};

		dataFactory.deleteOngoingTradeDetails = function(activeTrade) {
			return $http.post('/api/controlpanel/activeTrade/delete', activeTrade).success(function(response) {
				return response.data;
			});
		};

		dataFactory.requestTradeFinance = function(activeTrade) {
			return $http.post('/api/controlpanel/activeTrade/finance', activeTrade).success(function(response) {
				return response.data;
			});
		};

		dataFactory.getTradeContactRequests = function(activeTrade) {
			return $http.post('/api/controlpanel/activeTrade/requests', activeTrade).success(function(response) {
				return response.data;
			});
		};

		dataFactory.contactTradeCounterparts = function(activeTrade) {
			return $http.post('/api/controlpanel/activeTrade/contact', activeTrade).success(function(response) {
				return response;
			});
		};

		dataFactory.getTradeRecommendations = function(criteria) {
			return $http.post('/api/controlpanel/recommendations', criteria).success(function(response) {
				return response.data;
			});
		};

		dataFactory.getPriceForActiveTrade = function(criteria) {
			return $http.post('/api/controlpanel/activeTrade/getPrice', criteria).success(function(response) {
				return response.data;
			});
		};

		dataFactory.getTradePurchaseOrder = function(criteria) {
			return $http.get('/api/controlpanel/activeTrade/po/' + criteria.activeTradeId).success(function(response) {
				return response.data;
			});
		};

    dataFactory.getTradeDocuments = function(activeTradeId) {
			return $http.get('/api/controlpanel/activeTrade/documents/' + activeTradeId).success(function(response) {
				return response.data;
			});
		};

		dataFactory.bookActiveTradeShipment = function(criteria) {
			return $http.post('/api/controlpanel/activeTrade/shipment/bookshipment', criteria).success(function(response) {
				return response.data;
			});
		};

		/* *****************************
		****FREIGHT SHIPMENT MANAGEMENT APIS***
		********************************
		********************************/


		dataFactory.getFreightCharges = function(criteria) {
			return $http.post('/api/freight/shippingLineFreightRates/1/-1', criteria).success(function(response) {
				return response.data;
			});
		};

		dataFactory.getFreightRatesTrend = function(criteria) {
			return $http.post('/api/controlpanel/freightRatesTrend', criteria).success(function(response) {
				return response.data;
			});
		};

		dataFactory.bookShipment = function(criteria) {
			return $http.post('/api/controlpanel/bookShipment', criteria).success(function(response) {
				return response.data;
			});
		};

		dataFactory.getShipmentBookings = function(criteria) {
			return $http.post('/api/controlpanel/getShipmentBookings', criteria).success(function(response) {
				return response.data;
			});
		};

		dataFactory.getShippingLines = function(criteria) {
			return $http.get('/api/freight/getShippingLineDetails', criteria).success(function(response) {
				return response.data;
			});
		};


		dataFactory.allProductUnits = ["Acre/Acres","Ampere/Amperes","Bag/Bags","Barrel/Barrels","Blade/Blades","Box/Boxes","Bushel/Bushels","Carat/Carats","Carton/Cartons","Case/Cases","Centimeter/Centimeters","Chain/Chains","Combo/Combos","Cubic Centimeter/Cubic Centimeters","Cubic Foot/Cubic Feet","Cubic Inch/Cubic Inches","Cubic Meter/Cubic Meters","Cubic Yard/Cubic Yards","Degrees Celsius","Degrees Fahrenheit","Dozen/Dozens","Dram/Drams","Fluid Ounce/Fluid Ounces","Foot/Feet","Forty-Foot Container ","Furlong/Furlongs","Gallon/Gallons","Gill/Gills","Grain/Grains","Gram/Grams","Gross","Hectare/Hectares","Hertz","Inch/Inches","Kiloampere/Kiloamperes","Kilogram/Kilograms","Kilohertz","Kilometer/Kilometers","Kiloohm/Kiloohms","Kilovolt/Kilovolts","Kilowatt/Kilowatts","Liter/Liters","Long Ton/Long Tons","Megahertz","Meter/Meters","Metric Ton/Metric Tons","Mile/Miles","Milliampere/Milliamperes","Milligram/Milligrams","Millihertz","Milliliter/Milliliters","Millimeter/Millimeters","Milliohm/Milliohms","Millivolt/Millivolts","Milliwatt/Milliwatts","Nautical Mile/Nautical Miles","Ohm/Ohms","Ounce/Ounces","Pack/Packs","Pair/Pairs","Pallet/Pallets","Parcel/Parcels","Perch/Perches","Piece/Pieces","Pint/Pints","Plant/Plants","Pole/Poles","Pound/Pounds","Quart/Quarts","Quarter/Quarters","Rod/Rods","Roll/Rolls","Set/Sets","Sheet/Sheets","Short Ton/Short Tons","Square Centimeter/Square Centimeters","Square Foot/Square Feet","Square Inch/Square Inches","Square Meter/Square Meters","Square Mile/Square Miles","Square Yard/Square Yards","Stone/Stones","Strand/Strands","Ton/Tons","Tonne/Tonnes","Tray/Trays","Twenty-Foot Container","Unit/Units","Volt/Volts","Watt/Watts","Wp","Yard/Yards"];

		dataFactory.getAllProductUnits = function() {
			return dataFactory.allProductUnits;
		};

		dataFactory.getProductSearchTrend = function(criteria) {
			return $http.post('/api/controlpanel/productTrend', criteria).success(function(response) {
				return response.data;
			});
		};

    dataFactory.getTotalTradeStatsForProduct = function(hsCode) {
      return $http.get("/api/trade/productDetails/" + hsCode).success(function(response) {
          return response;
      });
    };

    dataFactory.getDailyMandiPrice = function(criteria) {
      return $http.post("/api/controlpanel/getDailylMandiPrice", criteria).success(function(response) {
          return response.data;
      });
    };

        /** utils functions
        */
        dataFactory.getDisplayFileSize = function (bytes) {
            var thresh = 1024;
            if(Math.abs(bytes) < thresh) {
                return bytes + ' bytes';
            }
            var units = ['KB','MB','GB','TB','PB','EB','ZB','YB'];
            var u = -1;
            do {
                bytes /= thresh;
                ++u;
            } while(Math.abs(bytes) >= thresh && u < units.length - 1);
            return bytes.toFixed(1)+' '+units[u];
        };

        dataFactory.getFileTypeIcon = function(docName) {
            var cl = "fa-file";
            if(docName.endsWith('.pdf')) {
                cl = "fa-file-pdf-o";
            } else if(docName.endsWith('.xls') || docName.endsWith('.xlsx')) {
                cl = "fa-file-excel-o";
            } else if(docName.endsWith('.doc') || docName.endsWith('.docx')) {
                cl = "fa-file-word-o";
            } else if(docName.endsWith('.txt')) {
                cl = "fa-file-text";
            }
            return cl;
        };

		return dataFactory;
    };

    dataService.$inject = injectParams;
    app.factory('dataService',dataService);

});
