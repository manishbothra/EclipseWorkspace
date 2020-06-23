'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope'];

    var toolsController = function ($scope, $location, $routeParams, authService, dataService, $rootScope) {
		$scope.result=1;

		$scope.tools = {exportDutyCalc: {}, globalExportDutyCalc: {},exportPriceCalc: {}, globalCustomDutyCalc:{}, customDutyCalc: {}, landedCost:{}, indianCustomDutyCalc:{}, drawbackDutyCalc:{}, indianDumpingDutyCalc:{}, freightRateCalc:{}, exportImportDoc:{}};

		var urlHash = $location.path();

		if ('/export-price-calculator' === urlHash.toLowerCase()) {
			$scope.toolName = 'exportPriceCalc';
		} else if ('/global-custom-duty-calculator' === urlHash.toLowerCase()) {
			$scope.toolName = 'globalCustomDutyCalc';
		} else if ('/custom-duty-calculator' === urlHash.toLowerCase()) {
			$scope.toolName = 'customDutyCalc';
		} else if ('/landed-cost-calculator' === urlHash.toLowerCase()) {
			$scope.toolName = 'landedCost';
		} else if ('/indian-custom-duty' === urlHash.toLowerCase() || '/gst-rate-finder' === urlHash.toLowerCase()) {
			$scope.toolName = 'indianCustomDutyCalc';
		} else if ('/drawback-duty' === urlHash.toLowerCase()) {
			$scope.toolName = 'drawbackDutyCalc';
		} else if ('/anti-dumping-duty' === urlHash.toLowerCase()) {
			$scope.toolName = 'indianDumpingDutyCalc';
		} else if ('/freight-rate-calculator' === urlHash.toLowerCase()) {
			$scope.toolName = 'freightRateCalc';
		}else if ('/export-duty-calculator' === urlHash.toLowerCase()) {
			$scope.toolName = 'exportDutyCalc';
		}else if ('/global-export-duty-calculator' === urlHash.toLowerCase()) {
			$scope.toolName = 'globalExportDutyCalc';
		}else if ('/export-import-documents' === urlHash.toLowerCase()) {
			$scope.toolName = 'exportImportDoc';
		}
		//Export Duty Calculator
		if ($scope.toolName === 'exportDutyCalc') {

			$scope.tools.exportDutyCalc.formData = {};
			$scope.getCustomDuties = function(isValid, code) {
				if(isValid){
					$scope.errMessage = '';
   			       $scope.loadingData = true;
				   dataService.getIndianCustomDuties(code,true)
					.then(function(data){
						if(data.success){
							$scope.tools.exportDutyCalc.customDuties = data.data;
						}
						else{
							$scope.cdMessage = data.message;
						}

					})['finally'](function() {$rootScope.loadingData = false;});
				}
			};

			$scope.getDrawbackDuties = function(isValid, code) {
				if(isValid){
					$scope.errMessage = '';
   			       $scope.loadingData = true;
				   dataService.getIndianDrawbackDuties(code,true)
					.then(function(data){
						if(data.success){
							$scope.tools.exportDutyCalc.drawbackDuties = data.data;
						}
						else{
							$scope.cdMessage = data.message;
						}

					})['finally'](function() {$rootScope.loadingData = false;});
				}
			};

			$scope.tools.exportDutyCalc.getExportsDuty = function(isValid) {
				if(isValid)
				{

			        $scope.getCustomDuties(true, $scope.tools.exportDutyCalc.formData.code);
					$scope.getDrawbackDuties(true,$scope.tools.exportDutyCalc.formData.code);
					//$scope.getExportDuties(true,$scope.tools.exportDutyCalc.formData.code);
				}
			};

		    $scope.productAutoComplete = {
			        options: {
			            html: true,
			            focusOpen: false,
			            onlySelectValid: false,
			            source: function (request, response) {
			                var data = [];

							if(request.term && request.term.length > 1) {

								var isProductCode =  /^\d+$/.test(request.term);
								var productParam = request.term + '/undefined';
							    if(isProductCode){
							    	productParam = request.term + '/undefined';
							    }
							    else{
							    	productParam = '0/' + request.term;
							    }

							    dataService.getProductExportCodes(request.term)
								.then(function(data1){
									if(data1) {

										var places = data1.data;
										angular.forEach(places, function(value, index) {
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
						select: function( event, ui ) {
							if(ui.item && ui.item.value && ui.item.value.length > 3) {
								$scope.tools.exportDutyCalc.formData.productCode = ui.item.value;
								$scope.tools.exportDutyCalc.formData.code = ui.item.value;
						//$scope.formData.productCode = ui.item.value + " - " + ui.item.name;
						//$scope.formData.productName = ui.item.name;

							}
						}
			        },
			        methods: {}
			    };


		}
		//HS Code finder
		$scope.searchHSByName = function(formData) {
	        $scope.submitted='True';

	        if(formData.name){
	    	    $rootScope.loadingData = true;
			    dataService.getHSCodeByName(formData.name)
				  .then(function(data){
				  $scope.result=0;
				  $scope.path=data;
			    })['finally'](function() {$rootScope.loadingData = false;});
		    }
		};

		$scope.searchHSByCode = function(formData) {
			$scope.submitted='True';

		    if(formData.code){
				$rootScope.loadingData = true;
				dataService.getHSCodeByName(formData.code)
				.then(function(data){
					$scope.result=0;
					$scope.path=data;
				})['finally'](function() {$rootScope.loadingData = false;});
			}

		};
		//HS code section end

		//NIC Section
		$scope.searchNICByName = function(formData) {
			$scope.submitted='True';

			if(formData.name){
				$rootScope.loadingData = true;
				dataService.getNicCodeByName(formData.name)
				.then(function(data){
					$scope.result=0;
					$scope.path=data;
				})['finally'](function() {$rootScope.loadingData = false;});
			}
		};

		$scope.searchNICByCode = function(formData) {
			$scope.submitted='True';

			if(formData.code){
				$rootScope.loadingData = true;
				dataService.getNicCodeByCode(formData.code)
				.then(function(data){
					$scope.result=0;
					$scope.path=data;
				})['finally'](function() {$rootScope.loadingData = false;});
			}

		};
		//NIC Section end

		//Export Price CALCULATOR
		if ($scope.toolName === 'exportPriceCalc') {

			$scope.tools.exportPriceCalc.formData = {};
			$scope.exportPriceFormData = {};

		    $scope.pagination = true;

		    $scope.tools.exportPriceCalc.getExportsPrice = function(isValid){

		    	if($scope.tools.exportPriceCalc.formData.incoterm == 'FOB'){
	    			$scope.tools.exportPriceCalc.formData.fobValue = $scope.tools.exportPriceCalc.formData.value;
	        	}
	        	else if($scope.tools.exportPriceCalc.formData.incoterm == 'CIF'){
	        		$scope.tools.exportPriceCalc.formData.cifValue = $scope.tools.exportPriceCalc.formData.value;
	        	}

		    	if(isValid){
					$scope.hide=false;
		    		dataService.getExportsPrice($scope.tools.exportPriceCalc.formData)
					.then(function(data){
						$scope.DutiesData=data.gstDuty;
		            	$scope.exportCost=data.price;
						if(!data.price)
						{
							$scope.hide=true;
						}
					});
		    	}

		    };

		    $scope.changeTab = function(){
		    	console.log($scope.tools.exportPriceCalc.formData.incoterm);

		    	if($scope.tools.exportPriceCalc.formData.incoterm == 'FOB'){
		    		$scope.isCIF = true;
		    	}
		    	else if($scope.tools.exportPriceCalc.formData.incoterm == 'CIF'){
		    		$scope.isCIF = false;
		    		$scope.tools.exportPriceCalc.formData.insuranceValue = 0;
		    		$scope.tools.exportPriceCalc.formData.freightValue = 0;
		    	}

		    };

		    $scope.productAutoComplete = {
			        options: {
			            html: true,
			            focusOpen: false,
			            onlySelectValid: false,
			            source: function (request, response) {
			                var data = [];

							if(request.term && request.term.length > 1) {

								var isProductCode =  /^\d+$/.test(request.term);
								var productParam = request.term + '/undefined';
							    if(isProductCode){
							    	productParam = request.term + '/undefined';
							    }
							    else{
							    	productParam = '0/' + request.term;
							    }

							    dataService.getProductExportCodes(request.term)
								.then(function(data1){
									if(data1) {

										var places = data1.data;
										angular.forEach(places, function(value, index) {
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
						select: function( event, ui ) {
							if(ui.item && ui.item.value && ui.item.value.length > 3) {
								$scope.tools.exportPriceCalc.formData.productCode = ui.item.value;
								//$scope.getCustomDuties(formData);
							}
						}
			        },
			        methods: {}
			    };

		    dataService.getSectorData()
			.then(function(data){
				$scope.sectrosData=data.data.industry;
			});

		    $scope.getSectorProducts = function(sectorName) {

		    	$scope.sectorProducts = [];
		    	angular.forEach($scope.sectrosData, function(item){

		        	if(item.name.toLowerCase()==sectorName.toLowerCase()){

		        		$scope.sectorProducts = item.products;

		        	};
		        });

		    };

		    $scope.selectCode = function(code){
		    	if(code){
		    		$scope.tools.exportPriceCalc.formData.productCode = code;
		    		$('#hscode').modal('hide');
		    		$scope.exportPriceResult=0;
		        	$scope.exportPriceResultProducts = [];
		    	}

		    };

		    $scope.closeHSModal = function(){
		    	$('#hscode').modal('hide');
		    	$scope.exportPriceResult=0;
		    	$scope.exportPriceResultProducts = [];
		    };

		    $scope.getChapterProducts = function(chapterCode) {

		    	$scope.exportPriceResultProducts = [];

		    	dataService.getProduct8DigitExportCodes(chapterCode)
				.then(function(data){
					$scope.exportPriceResult=1;
				    $scope.exportPriceResultProducts=data.data;
				});

		    };

		    $scope.getProductsByNameCode = function(type) {

		        if(type=='name'){

		        	dataService.getProduct8DigitExportCodes($scope.exportPriceFormData.name)
					.then(function(data){
						$scope.exportPriceResult=1;
					    $scope.exportPriceResultProducts=data.data;
					});

		        } else if(type=='code'){

		        	dataService.getProduct8DigitExportCodes($scope.exportPriceFormData.code)
					.then(function(data){
						$scope.exportPriceResult=1;
					    $scope.exportPriceResultProducts=data.data;
					});

		         }
		    };


		}
	     // Export Import Documents
		 if ($scope.toolName === 'exportImportDoc') {
			 $scope.tools.exportImportDoc.formData = {};
		    $scope.pagination = true;
		    $scope.fileSearch = true;
			$scope.countries = [];
			$scope.fileCountries = ['Azerbaijan', 'Bahrain', 'Bangladesh', 'Brunei Darussalam', 'Cambodia', 'China', 'Hong Kong', 'India', 'Indonesia', 'Iran',
    	'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Myanmar', 'Pakistan', 'Philippines',
    	'Qatar', 'Saudi Arabia', 'Singapore', 'Sri Lanka', 'Taiwan (ROC)', 'Thailand', 'United Arab Emirates', 'Vietnam', 'Botswana',
    	'Burundi', 'Egypt', 'Kenya', 'Lesotho', 'Morocco', 'Namibia', 'Nigeria', 'Rwanda', 'South Africa', 'Swaziland', 'Tanzania',
    	'Uganda', 'New Zealand', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru',
    	'Suriname', 'Uruguay', 'Venezuela', 'Barbados', 'Belize', 'Canada', 'Costa Rica', 'Dominica',
    	'Dominican Republic', 'El Salvador', 'Grenada', 'Guatemala', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua',
    	'Panama', 'Puerto Rico', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago',
    	'United States', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria',
    	'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland',
    	'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands',
    	'Norway', 'Oman', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland',
    	'Turkey', 'Ukraine', 'United Kingdom'];
		 $scope.getFormsCountries = function(){
		     angular.forEach($scope.fileCountries, function(item){
	   		       $scope.countries.push(item);
	   	     });
		 };
         $scope.changeTab = function(){
    	//console.log($scope.formCode.searchType);
    	$scope.cdMessage = '';
    	$scope.dutyResponse = '';
          };
         $scope.tools.exportImportDoc.getDocuments = function(isValid){
    	     if(isValid){
				  var match = $scope.fileCountries.indexOf($scope.tools.exportImportDoc.formData.country);
    	      if(match > -1){
				  $scope.hide=false;
    		     dataService.getDocumentsFromFile($scope.tools.exportImportDoc.formData.country)
        	               .then(function(data){
    	   	                                $scope.dutyResponse=data;
        	    });
    	      }
			  else
			  {
				  $scope.hide=true;
			  }
			 }

         };
         $scope.getFormsCountries();

		 }

		//CUSTOM DUTY CALCULATOR
		if ($scope.toolName === 'customDutyCalc') {

			$scope.tools.customDutyCalc.formData = {};
		    $scope.pagination = true;
		    //$scope.tools.customDutyCalc.formData.mode = 'Sea';
			$scope.fileSearch = true;
		    $scope.customDutyFormData = {};

		    /*dataService.getCustomDutiesCountries()
		    .then(function(data){
		    	$scope.countries=data.data;
		    });*/

		    $scope.countries = ["Albania","Algeria","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Bahamas","Bahrain","Bangladesh",
	    		"Barbados","Belarus","Belgium","Belize","Benin","Bolivia","Botswana","Brazil","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
	    		"Cameroon","Canada","Central African Republic","Chad","Chile","China","Chinese Taipei","Colombia","Congo","Costa Rica","Cote d Ivoire","Croatia","Cuba","Cyprus",
	    		"Czech Republic","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia",
	    		"European Union","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea Bissau","Guyana",
	    		"Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Republic of Korea",
	    		"Kuwait","Kyrgyz Republic","Lao People's Democratic Republic","Latvia","Lesotho","Liberia","Lithuania","Luxembourg","Macao","Madagascar","Malawi",
	    		"Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal",
	    		"Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
	    		"Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","Saudi Arabia","Senegal","Serbia",
	    		"Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","South Africa","Spain","Sri Lanka","Suriname","Sweden","Switzerland",
	    		"Tajikistan","Tanzania","Thailand","Macedonia","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Uganda","Ukraine",
	    		"United Arab Emirates","United Kingdom","United States","Uruguay","Vanuatu","Venezuela","Viet Nam","Yemen","Zambia","Zimbabwe"];

	    	//$scope.countries = $filter('orderBy')($scope.countries);

		    $scope.tools.customDutyCalc.getCustomDuties = function(isValid) {

    		   if(isValid){
        		$scope.hide=false;
		    		dataService.getCustomDuties($scope.tools.customDutyCalc.formData.country1,$scope.tools.customDutyCalc.formData.productCode)
					.then(function(data){
						$scope.DutiesData=data;
						if($scope.DutiesData.length==0){
							$scope.hide=true;
						}
					});
        	    }

		    };

		    $scope.productAutoComplete = {
			        options: {
			            html: true,
			            focusOpen: false,
			            onlySelectValid: false,
			            source: function (request, response) {
			                var data = [];

							if(request.term && request.term.length > 1) {

								var isProductCode =  /^\d+$/.test(request.term);
								var productParam = request.term + '/undefined';
							    if(isProductCode){
							    	productParam = request.term + '/undefined';
							    }
							    else{
							    	productParam = '0/' + request.term;
							    }

							    dataService.getCountryCodes($scope.tools.customDutyCalc.formData.country1, productParam)
								.then(function(data1){
									if(data1) {

										var places = data1;
										angular.forEach(places, function(value, index) {
											data.push({
												label: value.productCode + ' - ' + value.productName,
												value : value.productCode,
												name : value.productName,
												category: 'Products'
											});
										});

										response(data);
									}
								});

							}
			            },
						select: function( event, ui ) {
							if(ui.item && ui.item.value && ui.item.value.length > 3) {
								$scope.tools.customDutyCalc.formData.productCode = ui.item.value;
								//$scope.getCustomDuties(formData);
							}
						}
			        },
			        methods: {}
			    };

		    $scope.changeTab = function(){
		    	//console.log($scope.formCode.searchType);
		    	$scope.cdMessage = '';
				$scope.dutyResponse = '';
		    };

		    $scope.openHSModal = function(){

		    	$scope.customDutyResult=0;
			   	$scope.customDutyResultProducts = [];

			   	if($scope.tools.customDutyCalc.formData.country1){
			   		$('#hscode').modal('show');
			   	} else{
			   		$scope.cdMessage = 'Please Select Country';
			   	}
		   };

		   dataService.getSectorData()
			.then(function(data){
				$scope.sectrosData=data.data.industry;
			});

		   $scope.getSectorProducts = function(sectorName) {

		   		$scope.sectorProducts = [];
		   		angular.forEach($scope.sectrosData, function(item){

			       	if(item.name.toLowerCase()==sectorName.toLowerCase()){

			       		$scope.sectorProducts = item.products;

			       	};
		       });

		   };

		   $scope.selectCode = function(code){
			   	if(code){
			   		$scope.tools.customDutyCalc.formData.productCode = code;
			   		$('#hscode').modal('hide');
			   		$scope.customDutyResult=0;
			       	$scope.customDutyResultProducts = [];
			   	}

		   };

		   $scope.closeHSModal = function(){
			   	$('#hscode').modal('hide');
			   	$scope.customDutyResult=0;
			   	$scope.customDutyResultProducts = [];
		   };

		   $scope.getChapterProducts = function(chapterCode) {

			   	$scope.resultProducts = [];
			   	var productParam = chapterCode + '/productName';

			   	dataService.getCountryCodes($scope.tools.customDutyCalc.formData.country1, productParam)
				.then(function(data){
					$scope.customDutyResult=1;
				    $scope.customDutyResultProducts=data;
				});

		   };

		   $scope.getProductsByNameCode = function(type) {

		       if(type=='name'){

		    	   var productParam = '0/' + $scope.customDutyFormData.name;
		    	   dataService.getCountryCodes($scope.tools.customDutyCalc.formData.country1, productParam)
					.then(function(data){
						$scope.customDutyResult=1;
					    $scope.customDutyResultProducts=data;
					});

		       } else if(type=='code'){

		    	   var productParam = $scope.customDutyFormData.code + '/' + $scope.customDutyFormData.name;
		    	   dataService.getCountryCodes($scope.tools.customDutyCalc.formData.country1, productParam)
					.then(function(data){
						$scope.customDutyResult=1;
					    $scope.customDutyResultProducts=data;
					});

		        }
		   };


		}

		//GLOBAL CUSTOM DUTY CALCULATOR
		if ($scope.toolName === 'globalCustomDutyCalc') {

			$scope.tools.globalCustomDutyCalc.formData = {};
		    $scope.pagination = true;
		    //$scope.tools.customDutyCalc.formData.mode = 'Sea';
			$scope.fileSearch = true;
		    $scope.customDutyFormData = {};

		    /*dataService.getCustomDutiesCountries()
		    .then(function(data){
		    	$scope.countries=data.data;
		    });*/

		    $scope.countries = ["Albania","Algeria","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Bahamas","Bahrain","Bangladesh",
	    		"Barbados","Belarus","Belgium","Belize","Benin","Bolivia","Botswana","Brazil","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
	    		"Cameroon","Canada","Central African Republic","Chad","Chile","China","Chinese Taipei","Colombia","Congo","Costa Rica","Cote d Ivoire","Croatia","Cuba","Cyprus",
	    		"Czech Republic","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia",
	    		"European Union","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea Bissau","Guyana",
	    		"Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Republic of Korea",
	    		"Kuwait","Kyrgyz Republic","Lao People's Democratic Republic","Latvia","Lesotho","Liberia","Lithuania","Luxembourg","Macao","Madagascar","Malawi",
	    		"Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal",
	    		"Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
	    		"Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","Saudi Arabia","Senegal","Serbia",
	    		"Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","South Africa","Spain","Sri Lanka","Suriname","Sweden","Switzerland",
	    		"Tajikistan","Tanzania","Thailand","Macedonia","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Uganda","Ukraine",
	    		"United Arab Emirates","United Kingdom","United States","Uruguay","Vanuatu","Venezuela","Viet Nam","Yemen","Zambia","Zimbabwe"];

	    	//$scope.countries = $filter('orderBy')($scope.countries);

		    $scope.tools.globalCustomDutyCalc.getCustomDuties = function(isValid) {

    		   if(isValid){

    			   if($scope.tools.globalCustomDutyCalc.formData.country1 == $scope.tools.globalCustomDutyCalc.formData.country2){
    	    			$scope.cdMessage = 'Please Select different countries';
    	    			return;
    	    		}

    			   $scope.hide=false;
		    		dataService.getGlobalCustomDuties($scope.tools.globalCustomDutyCalc.formData.country1, $scope.tools.globalCustomDutyCalc.formData.country2, $scope.tools.globalCustomDutyCalc.formData.productCode)
					.then(function(data){
						$scope.DutiesData=data;
						if($scope.DutiesData.length==0){
							$scope.hide=true;
						}
					});
        	    }

		    };

		    $scope.productAutoComplete = {
			        options: {
			            html: true,
			            focusOpen: false,
			            onlySelectValid: false,
			            source: function (request, response) {
			                var data = [];

							if(request.term && request.term.length > 1) {

								var isProductCode =  /^\d+$/.test(request.term);
								var productParam = request.term + '/undefined';
							    if(isProductCode){
							    	productParam = request.term + '/undefined';
							    }
							    else{
							    	productParam = '0/' + request.term;
							    }

							    dataService.getCountryCodes($scope.tools.globalCustomDutyCalc.formData.country1, productParam)
								.then(function(data1){
									if(data1) {

										var places = data1;
										angular.forEach(places, function(value, index) {
											data.push({
												label: value.productCode + ' - ' + value.productName,
												value : value.productCode,
												name : value.productName,
												category: 'Products'
											});
										});

										response(data);
									}
								});

							}
			            },
						select: function( event, ui ) {
							if(ui.item && ui.item.value && ui.item.value.length > 3) {
								$scope.tools.globalCustomDutyCalc.formData.productCode = ui.item.value;
								//$scope.getCustomDuties(formData);
							}
						}
			        },
			        methods: {}
			    };

		    $scope.changeTab = function(){
		    	//console.log($scope.formCode.searchType);
		    	$scope.cdMessage = '';
				$scope.dutyResponse = '';
		        $scope.tools.globalCustomDutyCalc.formData.productCode = '';
		    };

		    $scope.openHSModal = function(){

		    	$scope.customDutyResult=0;
			   	$scope.customDutyResultProducts = [];

			   	if($scope.tools.globalCustomDutyCalc.formData.country1){
			   		$('#hscode').modal('show');
			   	} else{
			   		$scope.cdMessage = 'Please Select Country';
			   	}
		   };

		   dataService.getSectorData()
			.then(function(data){
				$scope.sectrosData=data.data.industry;
			});

		   $scope.getSectorProducts = function(sectorName) {

		   		$scope.sectorProducts = [];
		   		angular.forEach($scope.sectrosData, function(item){

			       	if(item.name.toLowerCase()==sectorName.toLowerCase()){

			       		$scope.sectorProducts = item.products;

			       	};
		       });

		   };

		   $scope.selectCode = function(code){
			   	if(code){
			   		$scope.tools.globalCustomDutyCalc.formData.productCode = code;
			   		$('#hscode').modal('hide');
			   		$scope.customDutyResult=0;
			       	$scope.customDutyResultProducts = [];
			   	}

		   };

		   $scope.closeHSModal = function(){
			   	$('#hscode').modal('hide');
			   	$scope.customDutyResult=0;
			   	$scope.customDutyResultProducts = [];
		   };

		   $scope.getChapterProducts = function(chapterCode) {

			   	$scope.resultProducts = [];
			   	var productParam = chapterCode + '/productName';

			   	dataService.getCountryCodes($scope.tools.globalCustomDutyCalc.formData.country1, productParam)
				.then(function(data){
					$scope.customDutyResult=1;
				    $scope.customDutyResultProducts=data;
				});

		   };

		   $scope.getProductsByNameCode = function(type) {

		       if(type=='name'){

		    	   var productParam = '0/' + $scope.customDutyFormData.name;
		    	   dataService.getCountryCodes($scope.tools.globalCustomDutyCalc.formData.country1, productParam)
					.then(function(data){
						$scope.customDutyResult=1;
					    $scope.customDutyResultProducts=data;
					});

		       } else if(type=='code'){

		    	   var productParam = $scope.customDutyFormData.code + '/' + $scope.customDutyFormData.name;
		    	   dataService.getCountryCodes($scope.tools.globalCustomDutyCalc.formData.country1, productParam)
					.then(function(data){
						$scope.customDutyResult=1;
					    $scope.customDutyResultProducts=data;
					});

		        }
		   };


		}
		
		//GLOBAL EXPORT DUTY CALCULATOR
		if ($scope.toolName === 'globalExportDutyCalc') {

			$scope.tools.globalExportDutyCalc.formData = {};
		    $scope.pagination = true;
		    //$scope.tools.customDutyCalc.formData.mode = 'Sea';
			$scope.fileSearch = true;
		    $scope.customDutyFormData = {};

		    /*dataService.getCustomDutiesCountries()
		    .then(function(data){
		    	$scope.countries=data.data;
		    });*/

		    $scope.countries = ["Anguilla","Antigua and Barbuda","Australia","Bahrain","Bangladesh","Barbados","Belize","Benin","Bermuda",
				"Bhutan","Brunei","Burkina Faso","Burundi","Cambodia","Cape Verde","Cayman Islands","China","Columbia","Cook Islands",
				"Cote D Ivoire","Dominica","Ethiopia","Fiji","Ghana","Grenada","Guinea","Guinea-Bissau","Guyana","Haiti","Hong Kong",
				"Indonesia","Iran","Jamaica","Jordan","Kenya","Laos","Liberia","Macau","Malawi","Malaysia","Mali","Mexico","Montserrat",
				"Myanmar","New Zealand","Niger","Nigeria","Pakistan","Peru","Philippines","Rwanda","Saint Kitts and Nevis",
				"Saint Lucia","Saint Vincent and the Grenadines","Saudi Arabia","Senegal","Sierra Leone","South Sudan","Suriname",
				"Tanzania","Thailand","The Bahamas","The Gambia","Togo","Trinidad and Tobago","Turks and Caicos Islands","Uganda",
				"United Arab Emirates","Vanuatu","Virgin Islands"];

	    	//$scope.countries = $filter('orderBy')($scope.countries);

		    $scope.tools.globalExportDutyCalc.getCustomDuties = function(isValid) {

    		   if(isValid){
        		//$scope.hide=false;
		    		dataService.getGlobalExportDuties($scope.tools.globalExportDutyCalc.formData.country1,$scope.tools.globalExportDutyCalc.formData.productCode)
					.then(function(data){
						$scope.DutiesData=data;
						if($scope.DutiesData.length==0){
							//$scope.hide=true;
						}
					});
        	    }

		    };

		    $scope.productAutoComplete = {
			        options: {
			            html: true,
			            focusOpen: false,
			            onlySelectValid: false,
			            source: function (request, response) {
			                var data = [];

							if(request.term && request.term.length > 1) {

								var isProductCode =  /^\d+$/.test(request.term);
								var productParam = request.term + '/undefined';
							    if(isProductCode){
							    	productParam = request.term + '/undefined';
							    }
							    else{
							    	productParam = '0/' + request.term;
							    }

							    dataService.getGlobalExportDutiesHsLevel($scope.tools.globalExportDutyCalc.formData.country1, request.term)
								.then(function(data1){
									if(data1) {

										var places = data1;
										angular.forEach(places, function(value, index) {
											data.push({
												label: value.productCode + ' - ' + value.productName,
												value : value.productCode,
												name : value.productName,
												category: 'Products'
											});
										});

										response(data);
									}
								});

							}
			            },
						select: function( event, ui ) {
							if(ui.item && ui.item.value && ui.item.value.length > 3) {
								$scope.tools.globalExportDutyCalc.formData.productCode = ui.item.value;
								//$scope.getCustomDuties(formData);
							}
						}
			        },
			        methods: {}
			    };

		    $scope.changeTab = function(){
		    	//console.log($scope.formCode.searchType);
		    	$scope.cdMessage = '';
				$scope.dutyResponse = '';
				$scope.DutiesData = [];
				$scope.tools.globalExportDutyCalc.formData.productCode = '';
		    };

		}

		//LANDED COST CALCULATOR
		if ($scope.toolName === 'landedCost') {

			$scope.tools.landedCost.formData={};
			$scope.tools.landedCost.result=1;
			//$scope.tools.landedCost.formData.transport='Sea';
			$scope.landedCostFormData = {};

      /* *
       * 
			dataService.getCustomDutiesCountries()
			  .success(function(data){
				  $scope.countries=data;
			});
      */

			$scope.changeTab = function(){
		    	console.log($scope.tools.landedCost.formData.incoterm);

		    	if($scope.tools.landedCost.formData.incoterm == 'FOB'){
		    		$scope.isCIF = true;
		    	}
		    	else if($scope.tools.landedCost.formData.incoterm == 'CIF'){
		    		$scope.isCIF = false;
		    		$scope.tools.landedCost.formData.insuranceValue = 0;
		    		$scope.tools.landedCost.formData.freightValue = 0;
		    	}
		    };

			   $scope.productAutoComplete = {
			        options: {
			            html: true,
			            focusOpen: false,
			            onlySelectValid: false,
			            source: function (request, response) {
			                var data = [];

							if(request.term && request.term.length > 1) {

								var isProductCode =  /^\d+$/.test(request.term);
								var productParam = request.term + '/undefined';
							    if(isProductCode){
							    	productParam = request.term + '/undefined';
							    }
							    else{
							    	productParam = '0/' + request.term;
							    }

							    dataService.getCountryCodes($scope.tools.landedCost.formData.country, productParam)
								.then(function(data1){
									if(data1) {

										var places = data1;
										angular.forEach(places, function(value, index) {
											data.push({
												label: value.productCode + '--' + value.productName,
										        value : value.productCode,
										        name : value.productName,
										        category: 'Products'
											});
										});

										response(data);
									}
								});

							}
			            },
						select: function( event, ui ) {
							if(ui.item && ui.item.value && ui.item.value.length > 3) {
								$scope.tools.landedCost.formData.productCode = ui.item.value;
							}
						}
			        },
			        methods: {}
			    };

			$scope.tools.landedCost.getLandedCost = function() {

				if($scope.tools.landedCost.formData.productCode){
					$scope.errMessage = '';
					$rootScope.loadingData = true;

					if($scope.tools.landedCost.formData.incoterm == 'FOB'){
						$scope.tools.landedCost.formData.fobValue = $scope.tools.landedCost.formData.value;
        	        } else if($scope.tools.landedCost.formData.incoterm == 'CIF'){
						$scope.tools.landedCost.formData.cifValue = $scope.tools.landedCost.formData.value;
                    }

					dataService.getLandedCostNew($scope.tools.landedCost.formData)
					.then(function(data) {
						$scope.tools.landedCost.result=0;
						if(data.success){
							$scope.tools.landedCost.customDuties = data.duties;
							$scope.tools.landedCost.details = data.value;
						}
						else{
							$scope.lcMessage = data.message;
						}
					})['finally'](function() {$rootScope.loadingData = false;});
				}
				else{
					$scope.errMessage = 'Please select product';
				}

			};

			$scope.changeCountry = function(){
		    	//console.log($scope.formCode.searchType);
		    	$scope.cdMessage = '';
		    };

		    $scope.openHSModal = function(){

		    	$scope.landedCostResult=0;
			   	$scope.landedCostResultProducts = [];

			   	if($scope.tools.landedCost.formData.country){
			   		$('#hscode').modal('show');
			   	} else{
			   		$scope.cdMessage = 'Please Select Country';
			   	}
		   };

		   dataService.getSectorData()
			.then(function(data){
				$scope.sectrosData=data.data.industry;
			});

		   $scope.getSectorProducts = function(sectorName) {

		   		$scope.sectorProducts = [];
		   		angular.forEach($scope.sectrosData, function(item){

			       	if(item.name.toLowerCase()==sectorName.toLowerCase()){

			       		$scope.sectorProducts = item.products;

			       	};
		       });

		   };

		   $scope.selectCode = function(code){
			   	if(code){
			   		$scope.tools.landedCost.formData.productCode = code;
			   		$('#hscode').modal('hide');
			   		$scope.landedCostResult=0;
			       	$scope.landedCostResultProducts = [];
			   	}

		   };

		   $scope.closeHSModal = function(){
			   	$('#hscode').modal('hide');
			   	$scope.landedCostResult=0;
			   	$scope.landedCostResultProducts = [];
		   };

		   $scope.getChapterProducts = function(chapterCode) {

			   	$scope.resultProducts = [];
			   	var productParam = chapterCode + '/productName';

			   	dataService.getCountryCodes($scope.tools.landedCost.formData.country, productParam)
				.then(function(data){
					$scope.landedCostResult=1;
				    $scope.landedCostResultProducts=data;
				});

		   };

		   $scope.getProductsByNameCode = function(type) {

		       if(type=='name'){

		    	   var productParam = '0/' + $scope.landedCostFormData.name;
		    	   dataService.getCountryCodes($scope.tools.landedCost.formData.country, productParam)
					.then(function(data){
						$scope.landedCostResult=1;
					    $scope.landedCostResultProducts=data;
					});

		       } else if(type=='code'){

		    	   var productParam = $scope.landedCostFormData.code + '/' + $scope.landedCostFormData.name;
		    	   dataService.getCountryCodes($scope.tools.landedCost.formData.country, productParam)
					.then(function(data){
						$scope.landedCostResult=1;
					    $scope.landedCostResultProducts=data;
					});

		        }
		   };

		}

		//INDIAN CUSTOM DUTY CALCULATOR
		if ($scope.toolName === 'indianCustomDutyCalc') {
			$scope.tools.indianCustomDutyCalc.formData={};

			$scope.tools.indianCustomDutyCalc.getCustomDuties = function() {

				if($scope.tools.indianCustomDutyCalc.formData.code){
					$scope.errMessage = '';
					$rootScope.loadingData = true;
					dataService.getIndianCustomDuties($scope.tools.indianCustomDutyCalc.formData.code)
					.then(function(data){
						$scope.tools.indianCustomDutyCalc.result=0;
						if(data.success){
							$scope.tools.indianCustomDutyCalc.customDuties = data.data;
						}
						else{
							$scope.cdMessage = data.message;
						}

					})['finally'](function() {$rootScope.loadingData = false;});
				}
				else{
					$scope.errMessage = 'Please select product';
				}
			};

			$scope.selectSearchAutoValue = function(searchObj) {
				if(searchObj && searchObj.code && searchObj.code.length > 2) {
					$scope.tools.indianCustomDutyCalc.formData.code = searchObj.code;
					$scope.tools.indianCustomDutyCalc.formData.productCode = searchObj.productCode;
					$scope.tools.indianCustomDutyCalc.formData.productName = searchObj.productName;
					$scope.tools.indianCustomDutyCalc.getCustomDuties($scope.tools.indianCustomDutyCalc.formData);
				}
			};

			$scope.dutyAutoOptions = dataService.getDutyProductsAutoComplete($scope.selectSearchAutoValue);


		}

		//DRAWBACK CUSTOM DUTY CALCULATOR
		if ($scope.toolName === 'drawbackDutyCalc') {
			$scope.tools.drawbackDutyCalc.formData={};

			$scope.tools.drawbackDutyCalc.getDuties = function() {

				if($scope.tools.drawbackDutyCalc.formData.code){
					$scope.errMessage = '';
					$rootScope.loadingData = true;
					dataService.getIndianDrawbackDuties($scope.tools.drawbackDutyCalc.formData.code)
					.then(function(data){
						$scope.tools.drawbackDutyCalc.result=0;
						if(data.success){
							$scope.tools.drawbackDutyCalc.duties = data.data;
						}
						else{
							$scope.cdMessage = data.message;
						}

					})['finally'](function() {$rootScope.loadingData = false;});
				}
				else{
					$scope.errMessage = 'Please select product';
				}
			};

			$scope.selectSearchAutoValue = function(searchObj) {
				if(searchObj && searchObj.code && searchObj.code.length > 2) {
					$scope.tools.drawbackDutyCalc.formData.code = searchObj.code;
					$scope.tools.drawbackDutyCalc.formData.productCode = searchObj.productCode;
					$scope.tools.drawbackDutyCalc.formData.productName = searchObj.productName;
					$scope.tools.drawbackDutyCalc.getDuties($scope.tools.drawbackDutyCalc.formData);
				}
			};

			$scope.dutyAutoOptions = dataService.getDutyProductsAutoComplete($scope.selectSearchAutoValue);


		}

		//DUMPING DUTY
		if ($scope.toolName === 'indianDumpingDutyCalc') {
			$scope.tools.indianDumpingDutyCalc.formData={};

			$scope.tools.indianDumpingDutyCalc.getDuties = function() {

				if($scope.tools.indianDumpingDutyCalc.formData.code){
					$scope.errMessage = '';
					$rootScope.loadingData = true;
					dataService.getIndianDumpingDuties($scope.tools.indianDumpingDutyCalc.formData.code)
					.then(function(data){
						$scope.tools.indianDumpingDutyCalc.result=0;
						if(data.success){
							$scope.tools.indianDumpingDutyCalc.duties = data.data;
						}
						else{
							$scope.cdMessage = data.message;
						}

					})['finally'](function() {$rootScope.loadingData = false;});
				}
				else{
					$scope.errMessage = 'Please select product';
				}
			};

			$scope.selectSearchAutoValue = function(searchObj) {
				if(searchObj && searchObj.code && searchObj.code.length > 2) {
					$scope.tools.indianDumpingDutyCalc.formData.code = searchObj.code;
					$scope.tools.indianDumpingDutyCalc.formData.productCode = searchObj.productCode;
					$scope.tools.indianDumpingDutyCalc.formData.productName = searchObj.productName;
					$scope.tools.indianDumpingDutyCalc.getDuties($scope.tools.indianDumpingDutyCalc.formData);
				}
			};

			$scope.dutyAutoOptions = dataService.getDutyProductsAutoComplete($scope.selectSearchAutoValue);

		}

		//FREIGHT RATE CALCULATOR
		if ($scope.toolName === 'freightRateCalc') {
			$scope.tools.freightRateCalc.formData={};
			//$scope.tools.landedCost.result=1;

			$scope.tools.freightRateCalc.getFreightRates = function(isValid) {

				if(isValid){

					if($scope.tools.freightRateCalc.formData){
						$scope.errMessage = '';
						$rootScope.loadingData = true;
						dataService.getFreightRates($scope.tools.freightRateCalc.formData)
						.then(function(data){
							//$scope.tools.landedCost.result=0;
							if(data.success){
								$scope.tools.freightRateCalc.rates = data.data;
							}
							else{
								$scope.frMessage = data.message;
							}
						})['finally'](function() {$rootScope.loadingData = false;});
					}
					else{
						$scope.errMessage = 'Please select product';
					}
				}

			};

			$scope.originPlaceAutoComplete = {
				options: {
					html: true,
					focusOpen: false,
					onlySelectValid: false,
					source: function (request, response) {
						var data = [];

						if(request.term && request.term.length > 1) {

							dataService.getFreightPlaceAutoComplete(request.term, undefined,'origin', 10).then(function(data1){
								if(data1) {
									var productNames = data1.data.places;
									angular.forEach(productNames, function(value, index) {
										data.push({
											label: value.parentValue,
											value : value.value,
											name : value.parentValue,
											country : value.type,
											category: 'Places'
										});
									});

									response(data);
								}
							});

						}
					},
					select: function( event, ui ) {
						if(ui.item && ui.item.value && ui.item.value.length > 3) {
							$scope.tools.freightRateCalc.formData.originPort = ui.item.value;
							$scope.tools.freightRateCalc.formData.originCountry = ui.item.country;
						}
					}
				},
				methods: {}
			};

			$scope.destPlacesAutoComplete = {
				options: {
					html: true,
					focusOpen: false,
					onlySelectValid: false,
					source: function (request, response) {
						var data = [];

						if(request.term && request.term.length > 1) {

							dataService.getFreightPlaceAutoComplete(request.term, $scope.tools.freightRateCalc.formData.originCountry, 'dest', 10).then(function(data1){
								if(data1) {
									var productNames = data1.data.places;
									angular.forEach(productNames, function(value, index) {
										data.push({
											label: value.parentValue,
											value : value.value,
											name : value.parentValue,
											country : value.type,
											category: 'Places'
										});
									});

									response(data);
								}
							});

						}
					},
					select: function( event, ui ) {
						if(ui.item && ui.item.value && ui.item.value.length > 3) {
							$scope.tools.freightRateCalc.formData.destinationPort = ui.item.value;
						}
					}
				},
				methods: {}
			};

		}


    };


    toolsController.$inject = injectParams;
    app.register.controller('toolsController', toolsController);

});
