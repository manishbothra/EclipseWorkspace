'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope','$filter', 'StepsService'];

    var companyProfileController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $filter, stepsService) {
        $scope.profileForm = {};
        $scope.addressForm = {};
        $scope.additionalDataForm = {};
        $scope.financeDataForm = {};
        $scope.additionalInfo = [{name: 'Why Us', value:''}, {name:'Our Team', value:''}, {name:'Our Expertise', value:''} ];
		$scope.successMsg = '';
		$scope.dateModal = {};
		$scope.maxDate = new Date(2020, 5, 22);
		$scope.ownershipTypes = [{label:'Private', value:'private'},{label:'Public', value:'public'},{label:'Proprietorship', value:'proprietorship'},{label:'Financial Lease Company as Public Limited', value:'Financial Lease Company as Public Limited'},{label:'Subsidiary of a Foreign Company as Private Limited Company', value:'Subsidiary of a Foreign Company as Private Limited Company'},{label:'General Association Public', value:'General Association Public'},{label:'General Association Private', value:'General Association Private'},{label:'Companies owned by Govt. Of India', value:'Companies owned by Govt. Of India'},{label:'Not For Profits License Company', value:'Not For Profits License Company'},{label:'Companies owned by State Govt.', value:'Companies owned by State Govt.'},{label:'Public Limited Company with Unlimited Liability', value:'Public Limited Company with Unlimited Liability'},{label:'Private Limited Company with Unlimited Liability', value:'Private Limited Company with Unlimited Liability'},{label:'One Person Company', value:'One Person Company'},{label:'Limited Liability Partnership', value:'Limited Liability Partnership'}];
		$scope.primaryBusinessTypes = [{label:'Manufacturer', value:'manufacturer'},{label:'Supplier', value:'supplier'},{label:'Exporter', value:'exporter'},{label:'Importer', value:'importer'},{label:'Distributor', value:'distributor'},{label:'Wholesaler', value:'wholesaler'},{label:'Trader', value:'trader'},{label:'Agency', value:'agency'}];
		$scope.additionalBusinessTypes = [{label:'Manufacturer', value:'manufacturer'},{label:'Supplier', value:'supplier'},{label:'Exporter', value:'exporter'},{label:'Importer', value:'importer'},{label:'Distributor', value:'distributor'},{label:'Wholesaler', value:'wholesaler'},{label:'Trader', value:'trader'},{label:'Agency', value:'agency'}];
		
		$scope.noOfEmployees = ['25','50','100','250','500'];
		$scope.mainLanguages = ['ENGLISH','HINDI','GERMAN','FRENCH','RUSSIAN','CHINESE', 'SPANISH'];
		$scope.allCountries = [];
		$scope.allStates = [];
		$scope.selectedDropdownValues = {};//using obj ref for model
		$scope.doneSteps = [];
		$scope.selectedStep = 'step1';
		$scope.setupProfile = 'setup-profile' === $routeParams.stepname;
		$scope.shipmentOptions = [{name:'By Road'}, {name: 'By Sea' }, {name: 'By Air' }];
		$scope.paymentOptions = [{name:'L/C', selected: false}, {name:'Cheque', selected: false}, {name:'Card', selected: false}, {name:'Online', selected: false}];
		
		$scope.dateOptions = {
			startingDay: 1
		};
		
		$scope.disabled = function(date, mode) {
			return false;
		};
		
		$scope.openDateModal = function($event, elementOpened) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.dateModal[elementOpened] = !$scope.dateModal[elementOpened];
		};
		
		
		$scope.isStepDone = function (step){
			return $scope.doneSteps.indexOf(step) >= 0;
		};
		
		$scope.setSelectedStep = function(step) {
			if($scope.isStepDone(step)) {
				$scope.selectedStep = step;
			}			
		};
		
		$scope.goToPrevStep = function() {
			stepsService.steps().previous();
			
			console.log('back step');
		};
		
		$scope.addMoreDetailsRow = function(type) {
			$scope.additionalInfo.push({name:'', value:''});
		};
		
		$scope.removeMoreDetailsRow = function(type, name, elIndex) {
			var idx = -1;
			if(!name && elIndex >= 0) {
				idx = elIndex;
			} else if(name){
				var sobj = $filter('filter')(obj, {name: name})[0];
				idx = $scope.additionalInfo .indexOf(sobj);
			}
			if(idx >= 0) {
				$scope.additionalInfo.splice(idx, 1);
			}
		};		
		
		$scope.setCompanyProfileData = function () {
			if($scope.companyDataLoaded && $scope.countryDataLoaded && $scope.stateDataLoaded ) {
				$scope.profileForm.name=$scope.companyProfile.name;
				$scope.profileForm.id=$scope.companyProfile.id;
				$scope.profileForm.title=$scope.companyProfile.title;
				$scope.profileForm.ownershipType=$scope.companyProfile.ownershipType;
				if ($scope.profileForm.ownershipType) {
					$scope.selectedDropdownValues.selectedOwnershipType = $filter('filter')($scope.ownershipTypes, {label: $scope.profileForm.ownershipType})[0];
				}
				
				$scope.profileForm.primaryBusinessType=$scope.companyProfile.primaryBusinessType;
				if ($scope.profileForm.primaryBusinessType) {
					$scope.selectedDropdownValues.selectedPrimaryBusinessType = $filter('filter')($scope.primaryBusinessTypes, {label: $scope.profileForm.primaryBusinessType})[0];
				}
				
				$scope.profileForm.additionalBusinessType = $scope.companyProfile.additionalBusinessType;
				if($scope.profileForm.additionalBusinessType) {
					angular.forEach($scope.profileForm.additionalBusinessType, function(val, idx) {
						var po = $filter('filter')($scope.additionalBusinessTypes, {value: val})[0];
						if(po) {
							po.selected = true;
						}
					});
					
					var ado = $filter('filter')($scope.additionalBusinessTypes, {value: $scope.profileForm.primaryBusinessType})[0];
					if($scope.additionalBusinessTypes.indexOf(ado) >= 0) {
						$scope.additionalBusinessTypes.splice(ado,1);
					}
				}
				
				
				$scope.profileForm.owner=$scope.companyProfile.owner;
				$scope.profileForm.date=$scope.companyProfile.date;
				if($scope.companyProfile.date) {
					$scope.profileForm.dateObj= moment($scope.companyProfile.date, 'DD/MM/YYYY').toDate();
				}
				$scope.profileForm.number=$scope.companyProfile.number;
				$scope.profileForm.annualTurnover=$scope.companyProfile.annualTurnover;
				
				if($scope.companyProfile.mainLanguage) {
					$scope.profileForm.mainLanguage=$scope.companyProfile.mainLanguage.toUpperCase();
				}
				
				if($scope.companyProfile.country) {
					$scope.profileForm.country = $scope.companyProfile.country;
					var cntry = $filter('filter')($scope.allCountries, {name: $scope.profileForm.country})[0];
					$scope.selectedDropdownValues.selectedCountry = cntry;
				}
				
				$scope.profileForm.shortDescription=$scope.companyProfile.shortDescription;
				$scope.profileForm.detailDescription=$scope.companyProfile.detailDescription;
				
				
				if($scope.companyProfile.companyAddress && $scope.companyProfile.companyAddress.registered 
					&& $scope.companyProfile.companyAddress.registered.length > 0) {
					var address = $scope.companyProfile.companyAddress.registered[0];
					$scope.addressForm.addressLine1 = address.addressLine1;
					$scope.addressForm.addressLine2 = address.addressLine2;
					$scope.addressForm.addressLine3 = address.addressLine3;
					$scope.addressForm.city = address.city;
					$scope.addressForm.state = address.state;
					$scope.addressForm.country = address.country;
					$scope.addressForm.id = address.id;
					$scope.addressForm.type = address.type;
					$scope.addressForm.pincode = address.pincode;
					$scope.addressForm.entityType = address.entityType;
				
					if(address.state) {
						if(address.country && address.country.toLowerCase() === 'india') {
							var res = $filter('filter')($scope.allStates['India'], {name: address.state});
							if(res && res.length > 0) {
								$scope.selectedDropdownValues.selectedState = res[0];
							}
						}
					}
				}
				
				if($scope.companyProfile.companyFinancials) {
					var companyFnData = $scope.companyProfile.companyFinancials;
					$scope.financeDataForm.id = companyFnData.id;
					$scope.financeDataForm.panNumber = companyFnData.panNumber;
					$scope.financeDataForm.cstNumber = companyFnData.cstNumber;
					$scope.financeDataForm.bankName = companyFnData.bankName;
					$scope.financeDataForm.vat = companyFnData.vat;
					$scope.financeDataForm.gstNumber = companyFnData.gstNumber;
					$scope.financeDataForm.tanNumber = companyFnData.tanNumber;
					$scope.financeDataForm.authorizedCapital = companyFnData.authorizedCapital;
					$scope.financeDataForm.paidUpCapital = companyFnData.paidUpCapital;
					$scope.financeDataForm.balanceSheetDate = companyFnData.balanceSheetDate;
					$scope.financeDataForm.lastAgmDate = companyFnData.lastAgmDate;
					$scope.financeDataForm.liabilities = companyFnData.liabilities;
					$scope.financeDataForm.assets = companyFnData.assets;
					$scope.financeDataForm.netWorth = companyFnData.netWorth;
					$scope.financeDataForm.annualTurnover = companyFnData.annualTurnover;
					
				}
				if($scope.companyProfile.companyProducts.products.length<1){
					$scope.setupProfile=true;
				}
				if($scope.companyProfile.companyAddnData) {
					var companyAddnData = $scope.companyProfile.companyAddnData;
					$scope.additionalDataForm.companyAbout = companyAddnData.companyAbout;
					$scope.additionalDataForm.gstNumber = companyAddnData.gstNumber;
					$scope.additionalDataForm.availablePaymentOptions = companyAddnData.availablePaymentOptions;
					$scope.additionalDataForm.modesOfShipment = companyAddnData.modesOfShipment;
					$scope.additionalDataForm.iecode = companyAddnData.iecode;
					$scope.additionalDataForm.tanNumber = companyAddnData.tanNumber;
					
					if(companyAddnData.availablePaymentOptions) {
						var pOption = companyAddnData.availablePaymentOptions || [];
						var pOptions = pOption.split(',');
						var otherPayOption = $filter('filter')($scope.paymentOptions, {name: 'Others'})[0];
						angular.forEach(pOptions, function(val, idx) {
							var po = $filter('filter')($scope.paymentOptions, {name: val})[0];
							if(po) {
								po.selected = true;
							} else {
								$scope.paymentOptions.push({name: val, selected: true});
							}
						});
					}
					if(companyAddnData.modesOfShipment) {
						var pOption = companyAddnData.modesOfShipment || [];
						var pOptions = pOption.split(',');
						angular.forEach(pOptions, function(val, idx) {
							var po = $filter('filter')($scope.shipmentOptions, {name: val})[0];
							if(po) {
								po.selected = true;
							}
						});
					}
					
					if(companyAddnData.moreDetails) {
						var caddData = [];
						angular.forEach(companyAddnData.moreDetails, function(value, key) {
							if(key) {
								caddData.push({name:key, value: value});
							}
						});
						
						if(caddData.length > 0) {
							$scope.additionalInfo = caddData;
						}
					}
					$scope.companyProfileStatus.hasAdditionalDetails = true;
				}
				
				if($scope.companyProfileStatus) {
					if($scope.companyProfileStatus.hasCountryDetails) {
						$scope.doneSteps.push('step1');
					} 
					if($scope.companyProfileStatus.hasCompleteAddress) {
						$scope.doneSteps.push('step2');
					}
					
					if($scope.companyProfileStatus.hasCountryDetails && $scope.companyProfileStatus.hasCompleteAddress) {
						$scope.doneSteps.push('step3');
					}
					
					if($scope.companyProfileStatus.hasAdditionalDetails) {
						$scope.doneSteps.push('step4');
					}
				}
			}
		};
		
		$scope.loadCompanyDetails = function(reload){
			$rootScope.loadingData = true;
			authService.getControlPanelDetails(reload).then(function(response) {
				$scope.companyProfile = response.data[0];
				$scope.companyProfileStatus = response.profileStatus;
				$scope.user=$scope.companyProfile.userDetails.user;
				$scope.companyDataLoaded = true;
				$scope.setCompanyProfileData();
			})['finally'](function () {
				$rootScope.loadingData = false;
			});
		};
		
		$scope.loadCountries = function() {
			$rootScope.loadingData = true;
			dataService.getAllCountries(false).then(function(data) {
				$scope.allCountries = data || [];
				$scope.countryDataLoaded = true;
				$scope.setCompanyProfileData();
			})['finally'](function () {
				$rootScope.loadingData = false;
			});			
		};
		
		$scope.loadIndianStates = function() {
			$rootScope.loadingData = true;
			dataService.getIndianStates(false).then(function(data) {
				$scope.allStates['India'] = data || [];
				$scope.stateDataLoaded = true;
				$scope.setCompanyProfileData();
			})['finally'](function () {
				$rootScope.loadingData = false;
			});			
		};
		
        $scope.updateProfile = function (isValid, isDirty) {
			console.log('updated profile status: ', isValid, isDirty);
			$scope.successMsg = '';
			$scope.errorMessage = '';
			if(isValid) {
				if(isDirty) {
					var payload = angular.copy($scope.profileForm);			
					if($scope.profileForm.dateObj) {
						payload.date = moment($scope.profileForm.dateObj).format('DD/MM/YYYY');;
					}					
					if($scope.selectedDropdownValues.selectedOwnershipType) {
						payload.ownershipType = $scope.selectedDropdownValues.selectedOwnershipType.value;
					}					
					if($scope.selectedDropdownValues.selectedPrimaryBusinessType) {
						payload.primaryBusinessType = $scope.selectedDropdownValues.selectedPrimaryBusinessType.value;
					}		
					
					payload.additionalBusinessType = [];
					angular.forEach($scope.additionalBusinessTypes, function(value, index){
						if(value.selected && value.value != payload.primaryBusinessType){							
							payload.additionalBusinessType.push(value.value);
						}
					});
					
					if($scope.selectedDropdownValues.selectedCountry) {
						payload.country = $scope.selectedDropdownValues.selectedCountry.name;
					}					
					$rootScope.loadingData = true;
					authService.updateCompanyProfile(payload).then(function(response) {
						if (response.data.success) {
							 if (response.data.success) {
								$scope.successMsg = 'Your Basic profile details have been updated successfully.';
								$scope.loadCompanyDetails(true);
								$scope.doneSteps.push('step1');
								stepsService.steps().next();
							 }	 
						} else {
							$scope.errorMessage = 'Error in updating company profile. Please try after sometime.';
						}
					})['catch'](function (data) {
						$scope.errorMessage = 'Error in updating company profile. Please try after sometime.';
					})['finally'](function(res) {
						$rootScope.loadingData = false;
					});
					
				} else {
					$scope.doneSteps.push('step1');
					stepsService.steps().next();
				}
				
			} else {
				$scope.errorMessage = 'Please enter all the required fields.';
			}
			
        };
		
		$scope.updateCompanyAddnDetails = function(isValid, isDirty) {
			console.log('updated profile addn details: ', isValid, isDirty);
			$scope.successMsg = '';
			$scope.errorMessage = '';
			if(isValid) {
				if(isDirty) {
					var payload = angular.copy($scope.additionalDataForm);
					payload.availablePaymentOptions = '';
					angular.forEach($scope.paymentOptions, function(value, index){
						if(value.selected){
							if(payload.availablePaymentOptions) {
								payload.availablePaymentOptions += ',' + value.name;
							} else {
								payload.availablePaymentOptions = value.name;
							}
						}
					});
					
					payload.modesOfShipment = '';
					angular.forEach($scope.shipmentOptions, function(value, index){
						if(value.selected){							
							if(payload.modesOfShipment) {
								payload.modesOfShipment += ',' + value.name;
							} else {
								payload.modesOfShipment = value.name;
							}
						}
					});
					
					payload.moreDetails = {};
					angular.forEach($scope.additionalInfo, function(kp, index) {
						if(kp.name && kp.value && kp.name.trim().length > 0 && kp.value.trim().length > 0) {
							payload.moreDetails[kp.name] = kp.value;
						}
						
					});
					
					$rootScope.loadingData = true;
					authService.updateCompanyAdditionalDetails(payload).then(function(response) {
						if (response.data.success) {
							 if (response.data.success) {
								$scope.successMsg = 'Your details have been updated successfully.';
								$scope.doneSteps.push('step4');
								stepsService.steps().next();
								//$scope.companyAddDetailsForm.$setPristine();
								$scope.finishBusinessSetup();
							 }	 
						} else {
							$scope.errorMessage = 'Error in updating company data. Please try after sometime.';
						}
					})['catch'](function (data) {
						$scope.errorMessage = 'Error in updating company data. Please try after sometime.';
					})['finally'](function() {
						$rootScope.loadingData = false;
					});
				} else {
					$scope.doneSteps.push('step4');
					stepsService.steps().next();
					$scope.finishBusinessSetup();
				}
			} else {
				$scope.errorMessage = 'Please enter all the required fields.';
			}
			
		};
		
		$scope.finishBusinessSetup = function() {
			/*if($scope.setupProfile) {
				$location.path('/manage-products');
			} else {
				$location.path('/dashboard');
			}*/
			
			authService.isProfileCompleted().then(function(data) {
				if(data.setupRequired) {
					$location.replace();
					if(data.type == 'productUpdateRequired') {
						$location.path('/add-product');
					} else {
						$location.path('/dashboard');
					}
					//$location.path('/business-profile/setup-profile');
				} else{
					$location.path('/dashboard');
				}
			});
			
		};
		
		$scope.updateCompanyAddress = function(isValid, isDirty) {
			console.log('updated profile address: ', isValid, isDirty);
			$scope.successMsg = '';
			$scope.errorMessage = '';
			if(isValid) {
				if(isDirty) {
					var payload = angular.copy($scope.addressForm);
					if($scope.selectedDropdownValues.selectedCountry) {
						payload.country = $scope.selectedDropdownValues.selectedCountry.name;
					}
					if( 'india'=== payload.country.toLowerCase() && $scope.selectedDropdownValues.selectedState) {
						payload.state = $scope.selectedDropdownValues.selectedState.name;
					}
					
					if(!payload.type) {
						payload.type='Registered';
					}
					
					$rootScope.loadingData = true;
					authService.updateCompanyAddress(payload).then(function(response) {
						if (response.data.success) {
							 if (response.data.success) {
								$scope.successMsg = 'Your address details have been updated successfully.';
								$scope.doneSteps.push('step2');
								stepsService.steps().next();
							 }	 
						} else {
							$scope.errorMessage = 'Error in updating company address. Please try after sometime.';
						}
					})['catch'](function (data) {
						$scope.errorMessage = 'Error in updating company address. Please try after sometime.';
					})['finally'](function() {
						$rootScope.loadingData = false;
					});
				} else {
					$scope.doneSteps.push('step2');
					stepsService.steps().next();
				}
			} else {
				$scope.errorMessage = 'Please enter all the required fields.';
			}
		};
		
		$scope.updateCompanyFinance = function(isValid, isDirty) {
			console.log('updated profile finance: ', isValid, isDirty);
			$scope.successMsg = '';
			$scope.errorMessage = '';
			if(isValid) {
				if(isDirty) {
					var payload = angular.copy($scope.financeDataForm);
					payload.companyId=$scope.companyProfile.id;
					$rootScope.loadingData = true;
					authService.updateCompanyFinancialsDetails(payload).then(function(response) {
						if (response.data.success) {
							 if (response.data.success) {
								$scope.successMsg = 'Your financial details have been updated successfully.';
								$scope.doneSteps.push('step3');
								stepsService.steps().next();
							 }	 
						} else {
							$scope.errorMessage = 'Error in updating company financial details. Please try after sometime.';
						}
					})['catch'](function (data) {
						$scope.errorMessage = 'Error in updating company financial details. Please try after sometime.';
					})['finally'](function() {
						$rootScope.loadingData = false;
					});
				} else {
					$scope.doneSteps.push('step2');
					stepsService.steps().next();
				}
			} else {
				$scope.errorMessage = 'Please enter all the required fields.';
			}
		};
		
		$scope.resetForm = function() {
			$scope.setCompanyProfileData();
		};
		
		$scope.loadCountries();
		$scope.loadIndianStates();
		$scope.loadCompanyDetails(true);
    };

    companyProfileController.$inject = injectParams;
    app.register.controller('companyProfileController', companyProfileController);

});