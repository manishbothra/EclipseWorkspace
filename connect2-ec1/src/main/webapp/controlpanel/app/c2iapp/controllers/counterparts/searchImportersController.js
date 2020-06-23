'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http', '$sce', '$filter'];

    var searchImportersController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http, $sce,$filter) {
		$scope.searchObj=$location.search();
		$scope.noProductAdded=false;
		$scope.noDataFetched=false;
		$scope.comppro=[];
		$scope.searchForm = {};
		$scope.pageNo = 1;
		$scope.pageSize = 10;
		
		 $scope.tab1head="Buyers";
    
	    $scope.contact=[];
	    $scope.company2={};
		$scope.cloak1="Results per page:";
		$scope.cloak2="No results found.";
		$scope.cloak3="Please search again";
		$scope.cloak5="Sign-Up or login";
		$scope.cloak6="complete your profile to contact the companies ";
		//$scope.cloak7="your limit for contact companies has exceeded ";
		$scope.cloak10="We will get back to you shortly with more details ";
	
		$scope.contactlimit="false";
		
		$scope.sort=['5', '10','20','50','100'];
		//$scope.sort1=['By Relevance','By Name','By Date'];
		$scope.sort1=['1','2','3'];
		
		$scope.contact=[];
		 $scope.user={
				 "service":[]
		 };
	 
		 $scope.filterInitialized = {};
		 $scope.linkTrack={
	        'prelink':$rootScope.preLink1,
	        'root':$rootScope.crossDomainRoot1,
	        'global':$rootScope.crossDomainGlobal1
		 };
		 $scope.mapInitialized = false;
	 
		 $scope.selectedTab = "tab1";
		 $scope.overseasFilterData = {};
		 $scope.notAuthStatus = {};	
		
		 //var obj=$location.search();
		 $scope.cloak4="Sign up or login to view more results for "+$scope.searchObj.name+" importers";
		 $scope.result3=$scope.sort1[0];
			
		 $scope.result2=$scope.sort[0];
		 
		 $scope.currentpage1=1;
		 $scope.startresult1=1;
			
		 $scope.contact=[];
		 $scope.user={
				"service":[]
		 };
			 
		$scope.filterRanges={
			tab1:{}
		};
		/*-------search result filters ------*/
		
		//{value:'none', label:'Sort By: '},
		$scope.sortOptions = [
			{value:'relevance', label:'Relevance'},
			{value:'tradeActivityDesc', label:'Trade Activity (High -> Low)'},
			{value:'tradeActivityAsc', label:'Trade Activity (Low -> High)'},
			{value:'lastTradeDateDesc', label:'Recent Trade Date'},
			{value:'lastTradeDateAsc', label:'Oldest Trade Date'}
			//{value:'companyNameAsc', label:'Company Name(A-Z)'},
			//{value:'companyNameDesc', label:'Company Name(Z-A)'}
		];
	    
		$scope.sortPref = {
				tab1:"relevance"
			};
	   
	    $scope.ageRange = {
			tab1: $scope.searchObj.age || "any"
		};
		
		 $scope.companyType = {
			tab1: $scope.searchObj.ownershipType || "any"
		};
		
		$scope.rawFilterData = {
			ageRange: "",
			companyType : "",
			type : "",
			term: $scope.searchObj.name,
			country: $scope.searchObj.country,
			locations: [],
			countries:[],
			page_size:$scope.result2,
			tradeLocation: 'Overseas',
			page_number:1,
			ownerShipType:"",
			hasRegistrationDetails: false,
			hasTradeDetails: false,
			hasShipmentDetails: false
		};
			
		$scope.filterData = {
			tab1: angular.copy($scope.rawFilterData)			
		};
		
		if(!$scope.searchObj.country ) {
				$scope.searchObj.country = 'All';
		}
		
		 /*----- variables end------*/
		 $scope.setOverseasLocationFilter = function(data, tabIndex, loadIndiaDetails) {
			$scope.objParams=$scope.filterData[$scope.selectedTab];
			$scope.overseasFilterData[tabIndex] = data;
				if($scope.overseasFilterData[tabIndex].locations) {
					var locations = $filter('filter')($scope.overseasFilterData[tabIndex].locations, {type: 'country'});
					var count = 0;
					var countries = [];
					angular.forEach(locations, function(value, key){
						if(value.country != 'India') {
							count +=value.count;
							countries.push(value.country);
						}
						if($scope.objParams.countries && $scope.objParams.countries.indexOf(value.country.toLowerCase()) != -1) {
							value.selectedValue=true;
						}
						if(value.country == 'United Kingdom' && $scope.objParams.countries && $scope.objParams.countries.indexOf("uk") != -1) {
							value.selectedValue=true;
						}
						//value.selectedValue=true;
					}) ;
					if ( count > 0 ) {
						var allValue={
							count: count, //data.totalResults,
							country: 'All',
							name: 'All',
							type: 'country',
							countries: countries
						};
						if($scope.objParams.countries && $scope.objParams.countries.indexOf('all') > -1) {
							allValue.selectedValue=true;
						}
						$scope.overseasFilterData[tabIndex].locations.push(allValue);
					}
					
					$scope.overseasFilterData[tabIndex].locations = $filter('orderBy')($scope.overseasFilterData[tabIndex].locations, 'count', true);
				}
				var locsForCount = data.locations;
				var compareCountry = 'india';
				
				if(!$scope.no_location_selected) {
					var oCount = 0;
					angular.forEach(locsForCount, function(value,key) {
						var vCountry = value.country.toLowerCase();
						if( vCountry!= compareCountry && vCountry != 'india' && vCountry !='all') {
							oCount += value.count;
						}
						
					});
					
				//	$scope.resultsTotalHeading[tabIndex].overseasCount = oCount;
				}
			//	$scope.resultsTotalHeading[tabIndex].overseasData = true;
				//$scope.setResultHeadingVisibility();
		};
		
		 $scope.setTabLocation = function (location, value) {
			var name = location.name;
			if(value) {
				if(location.type === 'city' || location.type === 'state') {
					$scope.filterData[$scope.selectedTab].countries = [];
					$scope.filterData[$scope.selectedTab].countries.push(location.country.toLowerCase());
					$scope.filterData[$scope.selectedTab].country=location.name;				
					$scope.filterData[$scope.selectedTab].locations.push(name.toLowerCase());	
					$scope.toggleLocationSelection($scope.overseasFilterData[$scope.selectedTab].locations, false, 'India');			
					
				} else if(location.type === 'country') {
					var index = $scope.filterData[$scope.selectedTab].countries.indexOf("india"); //$scope.searchObj.country.toLowerCase()
					if (index !== -1) {
						$scope.filterData[$scope.selectedTab].countries.splice(index, 1);
						$scope.toggleLocationSelection($scope.filterRanges[$scope.selectedTab].locations, false);
					}
					
					if('all' === location.country.toLowerCase() && location.countries) {
						/*angular.forEach(location.countries, function(value, index){
							$scope.filterData[$scope.selectedTab].countries.push(value.toLowerCase());
						});*/
						$scope.filterData[$scope.selectedTab].countries.push("all");
					} else {
						$scope.filterData[$scope.selectedTab].countries.push(name.toLowerCase());
						var index = $scope.filterData[$scope.selectedTab].countries.indexOf("all");
						if (index !== -1) {
							$scope.filterData[$scope.selectedTab].countries.splice(index, 1);
						}
					}
					
					$scope.filterData[$scope.selectedTab].locations = [];
					$scope.filterData[$scope.selectedTab].country=location.name;
					var allValue = $filter('filter')($scope.overseasFilterData[$scope.selectedTab].locations, {name:'All'})[0];
					if(name.toLowerCase() != 'all') {
						allValue.selectedValue = false;
					}
					
				var countryIndex = $scope.filterData[$scope.selectedTab].countries.indexOf("all");
				if (countryIndex !== -1){
					$scope.filterData[$scope.selectedTab].country = 'all';
					$scope.filterData[$scope.selectedTab].countries = ['all'];
					}
				
					
				}
			} else {
				if(location.type === 'city' || location.type === 'state') {
					var index = $scope.filterData[$scope.selectedTab].locations.indexOf(name.toLowerCase());
					if (index !== -1) {
						$scope.filterData[$scope.selectedTab].locations.splice(index, 1);
					}
					if($scope.filterData[$scope.selectedTab].locations.length == 0) {
						var index = $scope.filterData[$scope.selectedTab].countries.indexOf(location.country.toLowerCase());
						if (index !== -1) {
							$scope.filterData[$scope.selectedTab].countries.splice(index, 1);
						}
						if($scope.filterData[$scope.selectedTab].countries.length == 0) {
							$scope.filterData[$scope.selectedTab].country=$scope.searchObj.country;
						}
					}
				} else {
					
						if('all' === location.country.toLowerCase() && location.countries) {
							/*angular.forEach(location.countries, function(value, index){
								var index = $scope.filterData[$scope.selectedTab].countries.indexOf(value.toLowerCase());
								if (index !== -1) {
									$scope.filterData[$scope.selectedTab].countries.splice(index, 1);
								}
							});*/
							var index = $scope.filterData[$scope.selectedTab].countries.indexOf("all");
							if (index !== -1) {
								$scope.filterData[$scope.selectedTab].countries.splice(index, 1);
							}
						} else {
							var index = $scope.filterData[$scope.selectedTab].countries.indexOf(name.toLowerCase());
							if (index !== -1) {
								$scope.filterData[$scope.selectedTab].countries.splice(index, 1);
							}
						}
						
						
						if($scope.filterData[$scope.selectedTab].countries.length == 0) {
							$scope.filterData[$scope.selectedTab].country=$scope.searchObj.country;
						} else {
							$scope.filterData[$scope.selectedTab].country=$scope.filterData[$scope.selectedTab].countries[0];	
						}
					}
				//$scope.filterData[$scope.selectedTab].country = $scope.searchObj.country;
				
			}
		};
		 
		 $scope.$watch("filterData", function(newVal, oldVal){
			console.log("RM:Success:", newVal);
			if(newVal != oldVal && $scope.filterInitialized[$scope.selectedTab]) {
				$scope.currentpage1 = 1;
				//$scope.filterSearch(0);
				console.log(newVal+'FilterData : Used'+oldVal);
				
				//$scope.searchForm.selectedProduct1.code = $scope.productReport.name;
				//$scope.searchForm.selectedProduct1.name = $scope.productReport.code;
				
				$scope.getGlobalImporters($scope.productReport.code, $scope.productReport.name,$scope.pageNo,$scope.pageSize);
			}
		}, true);
		 
		var urlCount = undefined;
		if($scope.searchObj.c && !isNaN($scope.searchObj.c)) {
			urlCount = parseInt($scope.searchObj.c);
		}	
		
		$scope.downloadableCount = urlCount || 25;
		$scope.count = urlCount || 25;
		$scope.downloadAllowed = urlCount || 25;
		$scope.importersToDownload = "pageDefault";
		$scope.UNIT_PRICE = 250;
		$scope.searchForm = {productType:'yourProducts'};
		if($routeParams.product || $routeParams.code) {
			$scope.routeProduct = {name: $routeParams.product, code: $routeParams.code};
		}
		
		$scope.sampleSeachProducts = [{name: 'Stainless Steel', code: 7218},{name: 'Rubber', code: 40},{name: 'Tea', code: 902},{name: 'Coffee', code: 901},{name: 'Cotton', code: 52},{name: 'Footwear', code: 64},{name: 'Copper Wire', code: 7408},{name: 'Beans', code: 70820}];
	
		$scope.orderType = 'IMPORTER_DATA';
		$scope.agreementSigned = false;
		
		$scope.$watch('searchForm.productType', function(newVal, oldVal) {
			if(newVal) {
				if(newVal != 'yourProducts') {
					$scope.searchForm.selectedProduct1 = undefined;
				}
			}
		});
		
		$scope.loadCompanyProducts=function(){
			$scope.loading = true;
			authService.getControlPanelDetails().then(function(response) {
				$scope.details=response.data;
				$scope.userCountry = response.data[0].country;
				
				$scope.comppro=$scope.details[0].companyProducts.products;
				if($scope.comppro.length>0){					
					if($scope.routeProduct) {
						if($scope.routeProduct.code) {
							var cp = $filter('filter')($scope.comppro, {code: $scope.routeProduct.code});
							if(cp && cp.length > 0){
								$scope.searchForm.selectedProduct1=cp[0];
							
					
							}		
						} else {
							var cp = $filter('filter')($scope.comppro, {name: $scope.routeProduct.name});
							if(cp && cp.length > 0){
								$scope.searchForm.selectedProduct1=cp[0];
							}	
						}
								
					}
					if(!$scope.searchForm.selectedProduct1) {
						$scope.searchForm.selectedProduct1=$scope.comppro[0];
					}
					$scope.productReport.name =$scope.searchForm.selectedProduct1.productName;			
					//$scope.searchForm.selectedProduct1=$scope.comppro[0];
				} else{
					$scope.noProductAdded=true;
				}
				
				$scope.companyId=$scope.details[0].id;
				$scope.loading = false;
			});
		};
			
		$scope.initializeFilter = function (tabIndex) {
		
			console.log('Filter initialized');
			
			$scope.filterDisableMessage = 'Please subscribe to enable this filter';
			$scope.filterDisableMessage1 = 'Please register to enable this filter';
			
			
			$scope.setOverseasLocationFilter($scope.filterRanges[tabIndex], tabIndex);
			
			if(tabIndex == 'tab1'){
				//alert(tabIndex);
			$scope.products = $scope.filterRanges[tabIndex].products || {};
			}
			
			var searchFilters = $scope.filterRanges[tabIndex].searchFilters || {};
			$scope.allowedFilters = {};
			angular.forEach(searchFilters, function(value,key) {
				var name = value['name'];
				$scope.allowedFilters[name] = true;
			});
			
			$scope.selectableProducts = [];
			$scope.tempProducts = [];
			angular.forEach($scope.products, function(parent,key) {
				$scope.selectableProducts.push(parent);
				$scope.tempProducts.push(parent.name);
				parent['selected'] = false;
				angular.forEach(parent.children, function(level1,key) {
					$scope.tempProducts.push(level1.name);
					level1['selected'] = false;
					angular.forEach(level1.children, function(level2,key) {
						$scope.tempProducts.push(level2.name);
						level2['selected'] = false;
					});
				});
			});
			//$scope.filterData[$scope.selectedTab].products = $scope.tempProducts;
			$scope.selectAllProducts = false;
			var optionSlider = {
				from: 0,
				to: 100,
				step: 100,
				format: 'Rs %s',
				width: 300,
				scale: [0,25,50, 75, 100],
				showLabels: true,
				isRange : true,
				theme: "theme-blue"
			};
			
			var optionAnnualTO = angular.copy(optionSlider);
			optionAnnualTO['onstatechange'] = function(value) {
					
				if($scope.filterInitialized[tabIndex]) {
					$scope.setSliderValue('annualTurnOver', value);
				}
				//console.log("turnover::", value, $scope.filterInitialized);
			};
			var optionAssets = angular.copy(optionSlider);
			optionAssets['onstatechange'] = function(value) {
				if($scope.filterInitialized[tabIndex]) {
					$scope.setSliderValue('assets', value);
				}
				//console.log("assets::", value, $scope.filterInitialized);
					
			};
			var optionNetWorth = angular.copy(optionSlider);
			optionNetWorth['onstatechange'] = function(value) {
				if($scope.filterInitialized[tabIndex]) {
					$scope.setSliderValue('netWorth', value);
				}
				//console.log("networth::", value, $scope.filterInitialized);
				
			};
			var optionLiabilities = angular.copy(optionSlider);
			optionLiabilities['onstatechange'] = function(value) {
				if($scope.filterInitialized[tabIndex]) {
					$scope.setSliderValue('liabilities', value);
				}
				//console.log("liablities::", value, $scope.filterInitialized);
			};
			
			optionAnnualTO.from = $scope.filterRanges[tabIndex].minTO;
			//optionAnnualTO.to = $scope.filterRanges[tabIndex].maxTO;
			optionAnnualTO.to = 100000000;
			optionAnnualTO.disable = !$scope.allowedFilters['annualTurnover'];
			
			optionNetWorth.from = $scope.filterRanges[tabIndex].minNW;
			//optionNetWorth.to = $scope.filterRanges[tabIndex].maxNW;
			optionNetWorth.to = 100000000;
			optionNetWorth.disable = !$scope.allowedFilters['netWorth'];
			
			optionAssets.from = $scope.filterRanges[tabIndex].minAsset;
			//optionAssets.to = $scope.filterRanges[tabIndex].maxAsset;
			optionAssets.to = 100000000;
			optionAssets.disable = !$scope.allowedFilters['assets'];
			
			optionLiabilities.from = $scope.filterRanges[tabIndex].minLiablities;
			//optionLiabilities.to = $scope.filterRanges[tabIndex].maxLiablities;
			optionLiabilities.to = 100000000;
			optionLiabilities.disable = !$scope.allowedFilters['liabilities'];
			/*
			$('#annualTO' +'_' + tabIndex).jRange(optionAnnualTO);
			$('#assets' +'_' + tabIndex).jRange(optionAssets);
			$('#net_worth' +'_' + tabIndex).jRange(optionNetWorth);
			$('#liabilities' +'_' + tabIndex).jRange(optionLiabilities);*/
		    
			//var toRange = $scope.filterRanges[tabIndex].minTO + "," + $scope.filterRanges[tabIndex].maxTO;
			//var assetRange = $scope.filterRanges[tabIndex].minAsset + "," + $scope.filterRanges[tabIndex].maxAsset;
			//var nwRange = $scope.filterRanges[tabIndex].minNW + "," + $scope.filterRanges[tabIndex].maxNW;
			//var lRange = $scope.filterRanges[tabIndex].minLiablities + "," + $scope.filterRanges[tabIndex].maxLiablities;
		
			var toRange = $scope.filterRanges[tabIndex].minTO + "," + 100000000;
			var assetRange = $scope.filterRanges[tabIndex].minAsset + "," + 100000000;
			var nwRange = $scope.filterRanges[tabIndex].minNW + "," + 100000000;
			var lRange = $scope.filterRanges[tabIndex].minLiablities + "," + 100000000;
			
			/*$('#annualTO' +'_' + tabIndex).jRange('setValue', toRange);
			$('#assets' +'_' + tabIndex).jRange('setValue', assetRange);
			$('#net_worth' +'_' + tabIndex).jRange('setValue', nwRange);
			$('#liabilities' +'_' + tabIndex).jRange('setValue', lRange);*/
			$scope.filterInitialized[tabIndex] = true;
		};	
		
		$scope.productTreeOnSelect = function(product) {
			if(!$scope.filterData[$scope.selectedTab].hscodes) {
				$scope.filterData[$scope.selectedTab].hscodes = [];
			}
			if(product.selected) {
				$scope.filterData[$scope.selectedTab].hscodes.push(product.hscode);
				angular.forEach(product.children, function(level1,key) {
					
				});
				//$scope.filterData[$scope.selectedTab]['hscodeSearchType']= 'exact';
			} else {
				var index = $scope.filterData[$scope.selectedTab].hscodes.indexOf(product.hscode);
				if (index !== -1) {
					$scope.filterData[$scope.selectedTab].hscodes.splice(index, 1);
				}
				
				angular.forEach(product.children, function(level1,key) {
					
				});
				
				
			}
			//console.log("products:", $scope.filterData[$scope.selectedTab].products);
		};
		
		$scope.toggleProductClass = function(index, index2, index3) {
			index = ''+index+index2+index3;
			var key = 'p' + index + 'l' + index + 'toggle';
			var keyDisplay = 'p' + index + 'l' + index + 'Display';
			$scope[key] = !$scope[key];
			if($scope[key]) {
				$scope[keyDisplay] = {display:'block'};
			} else {
				$scope[keyDisplay] = {display:'none'};
			}
		};
		
		$scope.changePage=function(value){
			$scope.filterData[$scope.selectedTab].page_number = value;
		};
		
		$scope.changePageSize=function(value){
			$scope.filterData[$scope.selectedTab].page_size = value;
		};
		
		$scope.changeSorting = function(value) {
			$scope.filterData[$scope.selectedTab].sortOption = value;
		};
		
		$scope.notAuthStatus[$scope.selectedTab] = {};
		
		$scope.getGlobalImporters = function(code, productName,pageNo,pageSize){
			var ageRange="";
			var countries=[];
			var country="All";
			var hasRegistrationDetails=false;
			var hasTradeDetails=false;
			var hasShipmentDetails=false;
			var tradeLocation="Overseas";
			var hsCode=undefined;
			var sortOption="";
			
            if($scope.filterData[$scope.selectedTab].sortOption){
				sortOption=$scope.filterData[$scope.selectedTab].sortOption;
			}
			
			if($scope.filterData[$scope.selectedTab].hscodes){
				hsCode=$scope.filterData[$scope.selectedTab].hscodes;
			} else if(code > 0) {
				hsCode = [""+code];
			}
			
			if($scope.filterData[$scope.selectedTab].tradeLocation){
				tradeLocation=$scope.filterData[$scope.selectedTab].tradeLocation;
			}
			
			if($scope.filterData[$scope.selectedTab].hasRegistrationDetails){
				hasRegistrationDetails=$scope.filterData[$scope.selectedTab].hasRegistrationDetails;
			}
			
			if($scope.filterData[$scope.selectedTab].hasTradeDetails){
				hasTradeDetails=$scope.filterData[$scope.selectedTab].hasTradeDetails;
			}
			
			if($scope.filterData[$scope.selectedTab].hasShipmentDetails){
				hasShipmentDetails=$scope.filterData[$scope.selectedTab].hasShipmentDetails;
			}
			
			if($scope.filterData[$scope.selectedTab].ageRange && $scope.filterData[$scope.selectedTab].ageRange.length>1){
				ageRange=$scope.filterData[$scope.selectedTab].ageRange;
			}
			
			var ownerShipType='';
			if($scope.filterData[$scope.selectedTab].ownerShipType && $scope.filterData[$scope.selectedTab].ownerShipType.length>1){
				ownerShipType=$scope.filterData[$scope.selectedTab].ownerShipType;
			}
			
			if($scope.filterData[$scope.selectedTab].page_size && $scope.filterData[$scope.selectedTab].page_size.length>1){
				pageSize=$scope.filterData[$scope.selectedTab].page_size;
			}
			
			if($scope.filterData[$scope.selectedTab].page_number && $scope.filterData[$scope.selectedTab].page_number.length>1){
			pageNo=$scope.filterData[$scope.selectedTab].page_number;
			}
			
			if($scope.filterData[$scope.selectedTab].countries && $scope.filterData[$scope.selectedTab].countries.length>1){
			countries=$scope.filterData[$scope.selectedTab].countries;
			}
			
			if($scope.filterData[$scope.selectedTab].country && $scope.filterData[$scope.selectedTab].country.length>1){
			country=$scope.filterData[$scope.selectedTab].country;
			}
			
			console.log('getting global importers for '+productName);	
			
			$rootScope.loadingData = true;
			
			dataService.getGlobalImporters1(code, productName,pageNo,pageSize, ageRange,countries,country,ownerShipType,hasRegistrationDetails,hasTradeDetails,hasShipmentDetails,tradeLocation,hsCode,sortOption,true).then(function(response){
				$rootScope.loadingData = false;
				if(response.status === 'not_authorized') {
					$scope.notAuthStatus[$scope.selectedTab] = {msg: response.message, restrict: true};					
					return;
				}
				var data = response.data;
				$scope.globalImporters=data.data;
				if($scope.globalImporters.length==0){
					$scope.noDataFetched=true;
				} else{
					$scope.totalresult=data.filter.totalResults;
					$scope.noDataFetched=false;
				}
                 
				$scope.startresult1=(($scope.currentpage1-1)*$scope.result2)+1;
				$scope.endresult1=(($scope.startresult1*1)+($scope.result2*1))-1;
				if($scope.endresult1>$scope.totalresult) {
					$scope.endresult1=$scope.totalresult;
				}
				$scope.titleProduct = productName;
				/*if(code) {
					$scope.titleProduct += ' (' + code + ')';
				}*/
                $scope.filterRanges["tab1"] = data.filter;
				   
				$scope.initializeFilter("tab1");
			});
		};
		
		$scope.getIndianImporters = function(code, productName,pageNo,pageSize){
			console.log('getting indian importers for '+productName);	
			$rootScope.loadingData = true;
			dataService.getIndianImporters(code, productName,pageNo,pageSize,true).then(function(response){
				$rootScope.loadingData = false;
				var data = response.data;
				$scope.indianImporters=data;
				if($scope.indianImporters && $scope.indianImporters.length<1){
					$scope.noDataFetched=true;
				} else{
					$scope.noDataFetched=false;
				}

				$scope.titleProduct = productName;
				if(code) {
					$scope.titleProduct += ' (' + code + ')';
				}

			});
		};

		$scope.productReport = {};
		
		$scope.myOption = {
		
			options: {
				html: true,
				focusOpen: false,
				onlySelectValid: false,
				source: function (request, response) {
					var data = [];
					
					if(request.term && request.term.length > 1) { 	
						//	alert("2");					
					dataService.getProductsForAutocomplete(request.term, 10).then(function(data1){
						if(data1) {
							
							var productNames = data1.data;
							angular.forEach(productNames, function(value, index) {
								var valueObj = {
									value: value.id+" - "+value.value,
									code : value.id,
									name : value.value,
									category: 'Products'
								};
								data.push(valueObj);
							});
							
							response(data);
						}
					});
				  }	  
				},
				select: function( event, ui ) {
					//alert(ui.item.value);
					if(ui.item && ui.item.code && ui.item.code>0) {
						$scope.selectedProductLabel = ui.item.value;
						$scope.productReport.name = ui.item.name;
						$scope.productReport.code = ui.item.code;
						$scope.changeProduct($scope.productReport);
					}
				}
			},
			methods: {}
	
		};
	
		$scope.changeCompanyType = function(value) {
		//console.log("changeCompanyType:: ", value);
			if('any' == value) {
				value = '';
			}
			$scope.filterData[$scope.selectedTab].ownerShipType = value;
		};
		$scope.changeCompanyAge = function(value) {
			//console.log("filterData.age:: ", value);
			if('any' == value) {
				value = '';
			}
			$scope.filterData[$scope.selectedTab].ageRange = value;
		};
		
		$scope.changeProduct = function (product, isSample) {
			if(!product) {
				return;
			}
			
			if(product.name) {
				$scope.selectedProductLabel = product.name;
				if(isSample) {
					$scope.productReport.code = product.code;
					$scope.productReport.name = product.name;
				}
				if($scope.productReport.code && $scope.productReport.code  > 0) {
					
					$scope.searchType = 'manual';
					if($scope.userCountry.toLowerCase()=="india"){
					   $scope.getGlobalImporters($scope.productReport.code, $scope.productReport.name,$scope.pageNo,$scope.pageSize);
					} else {
						$scope.getIndianImporters($scope.productReport.code, $scope.productReport.name,$scope.pageNo,$scope.pageSize);
					}
					
				}
			} else {
				$scope.selectedProductLabel = product;
				if (product && product.length  > 2) {
					$scope.searchType = 'manual';
					$scope.productReport.name = product;
					$scope.productReport.code = undefined;
					if($scope.userCountry.toLowerCase()=="india"){
					    $scope.getGlobalImporters(undefined, product,$scope.pageNo,$scope.pageSize);
					} else {
						$scope.getIndianImporters(undefined, product,$scope.pageNo,$scope.pageSize);
					}
				}
			}
			
			
		};
		
		$scope.onHoverBlurText = function(company) {
			company.blurText = "The full importer name will be shown when you buy these records.";
		};
		
		$scope.onMouseLeaveBlurText = function(company) {
			company.blurText = "******";
		};
		
		$scope.$watch('globalImporters', function(newValue, oldValue) {
			if(newValue && newValue.length > 0 ) {
				var resCount = $scope.globalImporters.length;
				$scope.downloadButtonText = 'Buy ' + resCount + ' records for Rs. ' + ($scope.UNIT_PRICE * resCount);
			} else {
				$scope.downloadButtonText = 'Buy 100 records';
			}
		});

		$scope.$watch('indianImporters', function(newValue, oldValue) {
			if(newValue && newValue.length > 0 ) {
				var resCount = $scope.indianImporters.length;
				$scope.downloadButtonText = 'Buy ' + resCount + ' records for Rs. ' + ($scope.UNIT_PRICE * resCount);
			} else {
				$scope.downloadButtonText = 'Buy 100 records';
			}
		});
		
		$scope.$watch('searchForm', function(newVal, oldVal) {
			if(newVal) {
				if(newVal.selectedProduct1 && (newVal.selectedProduct1.code || newVal.selectedProduct1.name)){
					$scope.searchType = 'select';
					if($scope.userCountry.toLowerCase()=="india"){
						$scope.getGlobalImporters(newVal.selectedProduct1.code, newVal.selectedProduct1.name,1,10);
					} else {
						$scope.getIndianImporters(newVal.selectedProduct1.code, newVal.selectedProduct1.name,1,10);
					}
				}
			}
		}, true);
		
		/* ******BUY DATA RELATED ************/
		$scope.buyImporterDetails = function () {
			
		};
		
		var name = "";
		// if($scope.searchForm.selectedProduct1.code && $scope.searchForm.selectedProduct1.code.length > 0) {
			// name = 'HS Code ' + $scope.searchForm.selectedProduct1.code;
		// }
		
		$scope.orderDetails = $scope.downloadableCount + ' Overseas Importers of ' + name;
		
		$scope.cartProduct = {name: 'Importers', title:'Overseas Importers of ' + name, unitPrice:$scope.UNIT_PRICE, items:[], type: 'single', bulkQty: 0, qty : 0,
			changeQuantity: function(changeType) {
				if("bulk" === changeType) {
					var tempQty = this.qty;
					this.clearItem();				
					this.type = 'bulk';
					$scope.cart.type = 'bulkImporters';
					this.bulkQty = tempQty;
					this.qty = tempQty;
					$scope.cartProduct.bulkCriteria = $scope.filterData.tab1;
				} 
			},
			getTotalQuantity: function() {
				if('bulk' != this.type) {
					this.qty = $scope.cartProduct.items.length;
					return this.qty;
				} else if('bulk' === this.type) {
					this.qty = this.bulkQty;
					return this.bulkQty;
				}
			}, getTotalPrice : function () {
				var total = $scope.cartProduct.unitPrice * $scope.cartProduct.getTotalQuantity();
				return total;
			}, clearItem : function () {
				this.type = 'single';
				this.items=[];
				this.bulkQty = 0;
				this.qty = 0;
			}, getBulkCriteria: function () {
				return this.bulkCriteria;
			},
			getUnitPrice: function() {
				return this.unitPrice;
			},
			validateItem: function() {
				if('bulk' === this.type) {
					if(!this.bulkCriteria) {
						return false;
					} else if(!this.bulkCriteria.term || this.bulkCriteria.term.length < 1) {
						return false;
					} 
				}
				
				return true;
			}
		};
		
		$scope.cart = {cartItems:[$scope.cartProduct], clearCart: function(){
				$scope.cart.cartItems = [];
				$scope.cart.type = undefined;
				$scope.cartProduct.clearItem();
				window.localStorage.removeItem("cart");
			}, persistItems: function() {
				window.localStorage.setItem("cart", btoa(JSON.stringify($scope.cart)));
			},showSubItems:false
		};
		$rootScope.cart = $scope.cart;
		
		var cartdata = window.localStorage.getItem("cart");
		if(cartdata) {
			try{
				var cartJson = JSON.parse(atob(cartdata));
				if(cartJson && cartJson.cartItems) {				
					var cartImporters =  $filter('filter')(cartJson.cartItems, {title:'Importers'});
					if(cartImporters) {
						$scope.cartProduct.items = cartImporters[0].items;
					}				
				}
			} catch(err) {
				window.localStorage.removeItem("cart");
			}
		};
		
		$scope.addToCart = function (company, showCart) {
			console.log("ADDING TO CART: ", company, $scope.cart.cartItems.length);
			
			if ($scope.cart['type'] === 'bulkImporters') {
				$scope.cart.clearCart();
			}
			
			var found = false;
			$scope.cartProduct.items.forEach(function (item) {
				if (item.id === company.id) {
					found = true;
				}
			});
			if (!found) {
				var citem = {name:company.name, id:company.id, productCode:company.productCode, productId: company.productId};
				$scope.cartProduct.items.push(citem);
				if($scope.cart.cartItems.length == 0) {
					$scope.cart.cartItems.push($scope.cartProduct);
				}
				
				$scope.cartProduct.quantity = $scope.cartProduct.getTotalQuantity();
				$scope.cart.persistItems();
			}
			if(showCart) {
				$scope.checkout();
			}
		};
		
		$scope.downloadAll = function () {
			/*
			if($scope.downloadableCount > $scope.globalImporters.length) {
				$scope.errMessage = 'Please select ' + $scope.downloadableCount + ' Importers to continue.';
				return;
			}*/
			$scope.previewList = $scope.globalImporters;
			$rootScope.showingCart = true;
			$scope.cart.clearCart();
			if($scope.globalImporters && $scope.globalImporters.length > 0) {
				angular.forEach($scope.globalImporters, function(company, index) {
					$scope.addToCart(company);
				});
			}
			
			var name = $scope.titleProduct;
			// if($scope.searchObj.code && $scope.searchObj.code.length > 0) {
				// name = 'HS Code ' + $scope.searchObj.code;
			// }
			
			$scope.orderDetails = $scope.globalImporters.length + ' Overseas Importers of ' + name;
			
			$scope.checkoutStep = 'cart';
			window.scrollTo(0,0);
			 if(typeof ga != "undefined") {
				console.log("ga is alive:");
				ga('set', 'page', window.location.href + '&segment=order');
				ga('send', 'pageview');
			}
		};
		
		$scope.closeCart = function() {
			$scope.checkoutStep = 'search';
			$rootScope.showingCart = false;
		};
		
		$scope.getCartQuantities = function () {
			var total = 0;
			angular.forEach($scope.cart.cartItems, function(item, index) {
				total += item.getTotalQuantity();
			});
			
			return total;
		};
		
		$scope.getCartPrice = function () {
			var total = 0;
			angular.forEach($scope.cart.cartItems, function(item, index) {
				total += item.getTotalPrice();
			});
			return total;
		};
		
		$scope.getCart = function() {
			return $scope.cart;
		};
		
		/* ********* BY DATA RELATED END **************/
		/* *********PAYMENT RELATED *************/
		$scope.agreementChecked = function() {
			if(!$scope.agreementSigned) {
				$scope.valid = false;
				$scope.errMsg = 'Please indicate that you have read and agree to the Terms and Conditions';
			} else {
				$scope.valid = true;
				$scope.errMsg = '';
			}
		};
	
		$scope.submitPaymentRequest = function(isPaytmPayment) {
			$scope.errMsg = '';
			$scope.valid = true;
			if(!$scope.agreementSigned) {
				$scope.valid = false;
				$scope.errMsg = 'Please indicate that you have read and agree to the Terms and Conditions';
				return;
			}
			
			$scope.loadingData = true;
			var orderData = {};
			var orderDetails = {details:$scope.orderDetails, 'ref_url' : '/controlpanel/index.html#/importers-purchased'};
			var cids = [];
			orderData['impData'] = cids;
			angular.forEach($scope.cart.cartItems, function(item, index) {
				if('Importers' === item.name) {
					angular.forEach(item.items, function(company, index) {
						var tempData = {'company_id' : company.id, 'product_id': company.productId};
						if (company.productCode) {
							tempData['product_code'] = company.productCode;
						}
						cids.push(tempData);
					});
				}
			});
			
			var payload = {email: $scope.searchObj.email, tkn: $scope.searchObj.tkn, orderType: $scope.orderType,
							orderData:JSON.stringify(orderData),orderDetails:JSON.stringify(orderDetails)
							};
			$http({
				method  : "POST",
				url     : '/api/payment/createOrderAndPaymentAuth',
				data	: payload
			}).success(function(response){
				if (response.success) {
					if(!isPaytmPayment) {
						if (response.accessCode) {
							//secure / test
							$scope.myText = $sce.trustAsHtml('<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"  ><input type="hidden" name="access_code" id="access_code" value="'+ response.accessCode.trim() +'" style="display:none;" ><input type="hidden" id="encRequest" name="encRequest" value="'+ response.encRequest.trim() +'" style="display:none;" ><script language="javascript">document.redirect.submit();</script></form>');     
						}
					} else {
						window.open("https://pay.paytm.com/Eximat94798237865951", "Paytm Payments", "width=600,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes, left=100, top=50");
					}
					
				} else {
					$scope.valid = false;
					$scope.errMsg = 'Invalid Link.';
				}
				
			}).error(function (){
				$scope.loadingData = false;
			})['finally'](function() {
				$scope.loadingData = false;
			});
		};
		/* *********PAYMENT RELATED END*************/
		
		$scope.loadCompanyProducts();

    };

    searchImportersController.$inject = injectParams;


    app.register.controller('searchImportersController', searchImportersController);

});