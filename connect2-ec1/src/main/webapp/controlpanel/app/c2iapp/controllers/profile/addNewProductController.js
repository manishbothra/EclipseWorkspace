'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope','$filter', 'modalService', 'StepsService', '$q', '$sce'];

    var addNewProductController = function ($scope, $location, $routeParams, authService, dataService, $rootScope,$filter, modalService, stepsService, $q, $sce) {
        $scope.productImageSources = [];
		$scope.productForm = {imageSources:$scope.productImageSources,productMeta:{},product:{}, specifications:{}};
        $scope.availableProducts = {};
		$scope.successMsg = '';
		$scope.doneSteps = [];
		$scope.selectedStep = 'step1';
		$scope.originalCompanyProduct = undefined;
		$scope.allCurrencies = ['INR', 'USD', 'GBP', 'EUR', 'AUD'];
		$scope.allUnits = dataService.getAllProductUnits();
		
		$scope.paymentOptions = [{name:'L/C', selected: false}, {name:'Others', selected: false}];
		$scope.selectedProductId = $routeParams.id;
		$scope.additionalInfo = {basic:[], trade:[], logistics:[]};
		$scope.productDefSpecs = [{'name':'Grade', 'details':''},{'name':'Standard', 'details':''},{'name':'Certification','details':''}];
		$scope.templateInfo = {};
		$scope.categorySelectionOption = 'searchCategory';
		$scope.productFormTemplate = 'default';
		
		$scope.companyProductDataRequests = [];
		
		$scope.loadAllProducts = function () {
			var defer=$q.defer();		
			$rootScope.loadingData = true;
			dataService.getMasterProducts().then(function(data) {
				$scope.allProducts = data;
				defer.resolve({success:true});
			})['finally'](function () {
				$rootScope.loadingData = false;
				defer.resolve({success:true, type:'allProducts'});
			});
			$scope.companyProductDataRequests.push(defer.promise);
		};
		
		$scope.loadCompanyProduct = function() {
			var defer=$q.defer();		
			dataService.getCompanyProductById($scope.selectedProductId, true).then(function(response) {
				defer.resolve({success:true, data:response, type:'companyProduct'});				
			});
			$scope.companyProductDataRequests.push(defer.promise);
		};
		
		$scope.processCompanyProductDataResponse = function(response) {
			if(response.data) {
				$.extend($scope.productForm, response.data);
				$scope.originalCompanyProduct = angular.copy(response.data);
				$scope.productImageSources = response.data.imageSources || [];
				$scope.productForm.imageSources = $scope.productImageSources;
				if($scope.productForm.tradePaymentOptions) {
					var pOption = $scope.productForm.tradePaymentOptions || [];
					var pOptions = pOption.split('\|');
					var otherPayOption = $filter('filter')($scope.paymentOptions, {name: 'Others'})[0];
					angular.forEach(pOptions, function(val, idx) {
						var po = $filter('filter')($scope.paymentOptions, {name: val})[0];
						if(po) {
							po.selected = true;
						} else {
							otherPayOption.selected = true;
							$scope.productForm.otherTradePaymentOptions = val;
						}
					});
				}
				
				if($scope.productForm.specifications) {
					$scope.productDefSpecs = [];
					angular.forEach($scope.productForm.specifications, function(vl, ky) {
						$scope.productDefSpecs.push({'name':ky, 'details': vl});						
					});
				}
				
				if($scope.productForm.productMeta) {
					$.extend($scope.additionalInfo, $scope.productForm.productMeta);
				}
				
				$scope.addMoreDetailsRow('basic');
				$scope.addMoreDetailsRow('trade');
				$scope.addMoreDetailsRow('logistics');
				
				if(response.category) {
					var scat = response.category;
					$scope.availableProducts.pr = $filter('filter')($scope.allProducts, {id:scat.id})[0]; 
					if($scope.availableProducts.pr && $scope.availableProducts.pr.children && $scope.availableProducts.pr.children.length > 0){
						var sl1cat = scat.children[0];
						var catL1 = $filter('filter')($scope.availableProducts.pr.children, {id:sl1cat.id})[0];
						if(catL1.children.length == 0) {
							$scope.productForm.product.category = catL1.name;
							$scope.availableProducts.category1 = catL1;								
						} else {
							$scope.availableProducts.category1 = catL1;
							if($scope.availableProducts.category1.children && sl1cat.children.length > 0) {
								var sl2cat = sl1cat.children[0];
								var catL2 = $filter('filter')($scope.availableProducts.category1.children, {id:sl2cat.id})[0];
								if(catL2.children.length == 0) {
									$scope.productForm.product.category = catL2.name;
									$scope.availableProducts.category2 = catL2;	
								} else {
									$scope.availableProducts.category2 = catL2;
									if(catL2.children && catL2.children.length > 0) {
										$scope.availableProducts.category = $filter('filter')($scope.availableProducts.category2.children, {id:sl2cat.children[0].id})[0];
										$scope.productForm.product.category = $scope.availableProducts.category.name;
									}
								}
							}
						}
							
						if($scope.productForm.product.category) {
							$scope.categorySelectionOption = 'selectCategory';
						}
						//set selected categories
						$scope.setSelectTypeCategoryText();
					} else if(!$scope.productForm.product.category) {
						$scope.setSearchTypeCategoryText(response.category);
					}
					
					$scope.doneSteps.push('step1');
					$scope.doneSteps.push('step2');
					$scope.doneSteps.push('step3');
								
					$rootScope.$watch('companyProfile', function(newVal, oldVal) {
						if(newVal) {
							var ucname = $filter('spaceToDash')($rootScope.companyProfile.name);
							$scope.companyProductPublicProfileUrl = ucname +"/" + $rootScope.companyProfile.id +"/products/" +  $scope.originalCompanyProduct.urlFriendlyName + "/" + $scope.originalCompanyProduct.companyProductId;
						}
					}, true);
					
				}
			}
		};
		
		$scope.setSelectTypeCategoryText = function() {
			if(!$scope.selectedCategoryText) {
				$scope.selectedCategoryText = '';					
				if($scope.availableProducts && $scope.availableProducts.pr) {
					$scope.selectedCategoryText = $scope.availableProducts.pr.name;
					
					if($scope.availableProducts.category1 && $scope.availableProducts.category1.name) {
						$scope.selectedCategoryText += ' -> ' + $scope.availableProducts.category1.name;
					}
					if($scope.availableProducts.category2 && $scope.availableProducts.category2.name) {
						$scope.selectedCategoryText += ' -> ' + $scope.availableProducts.category2.name;
					}
					if($scope.availableProducts.category && $scope.availableProducts.category.name) {
						$scope.selectedCategoryText += ' -> ' + $scope.availableProducts.category.name;
					}
				}
			}
		};
		
		$scope.setSearchTypeCategoryText = function(product) {
			$scope.selectedCategoryText = product.code + '-' + product.name;
			if(product.children && product.children.length > 0) {
				product = product.children[0];
			} else {
				product = undefined;
			}
			var selectedCategory = undefined;
			while(product) {
				$scope.selectedCategoryText += ' -> ' + product.code + '-' + product.name;
				selectedCategory = product;
				if(product.children && product.children.length > 0) {
					product = product.children[0];
				} else {
					product = undefined;
				}
			}
			if (selectedCategory){
				$scope.productForm.category = selectedCategory.code + '-' + selectedCategory.name;;
			}
		};
		
		if($scope.selectedProductId && !isNaN($scope.selectedProductId)) {
			$scope.selectedProductId = parseInt($scope.selectedProductId);
			$scope.loadCompanyProduct();
		} else {
			$location.path('/add-product');
		}	
		
		$scope.isStepDone = function (step){
			return $scope.doneSteps.indexOf(step) >= 0;
		};
		
		$scope.setSelectedStep = function(step) {
			if($scope.isStepDone(step)) {
				$scope.selectedStep = step;
			}			
		};
		
		$scope.isPaymentOptionSelected = function(oname) {
			var po = $filter('filter')($scope.paymentOptions, {name: oname})[0];
			if(po) {
				return po.selected;
			} else {
				return false;
			}
			
		};
		$scope.modalOptions = {
			closeButtonText: 'Close',
			actionButtonText: 'Continue',
			headerText: 'Upload new image for your product',
			bodyText: ''
		};

		$scope.modalSelectProvider = {
		   backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: 'app/c2iapp/partials/file-modal.html',
			scope: $scope
		};
		
		$scope.productSelectionChanged = function (type) {
			$scope.productFormTemplate = $scope.availableProducts.pr.name;
		};
		
		$scope.resetForm = function() {
			$scope.productForm = {imageSources:$scope.productImageSources,productMeta:{},product:{}};
			$scope.availableProducts = {};
			$scope.productImageSources = [];
		};
		
		$scope.goToPrevStep = function() {
			stepsService.steps().previous();
			
			console.log('back step');
		};
		
		$scope.addSpecDetailsRow = function() {
			$scope.productDefSpecs.push({name:'', details:''});
		};
		
		$scope.removeSpecDetailsRow = function(name, elIndex) {
			var idx = -1;
			if (!name && elIndex >= 0) {
				idx = elIndex;
			} else if (name){
				var sobj = $filter('filter')($scope.productDefSpecs, {name: name})[0];
				idx = $scope.productDefSpecs.indexOf(sobj);
			}
			if(idx >= 0) {
				$scope.productDefSpecs.splice(idx, 1);
			}
		};
		
		$scope.addMoreDetailsRow = function(type) {
			var obj = $scope.additionalInfo[type];
			if(!obj) {
				obj = [];
				$scope.additionalInfo[type] = obj;
			}
			obj.push({name:'', value:''});
		};
		
		$scope.removeMoreDetailsRow = function(type, name, elIndex) {
			var obj = $scope.additionalInfo[type];
			if(obj) {
				var idx = -1;
				if(!name && elIndex >= 0) {
					idx = elIndex;
				} else if(name){
					var sobj = $filter('filter')(obj, {name: name})[0];
					idx = obj.indexOf(sobj);
				}
				if(idx >= 0) {
					obj.splice(idx, 1);
				}
			}
		};
		
		$scope.prepareProductPayload =function() {
			$scope.productForm.tradePaymentOptions = '';
			angular.forEach($scope.paymentOptions, function(value, index){
				if(value.selected){
					if(value.name == 'Others') {
						if($scope.productForm.tradePaymentOptions) {
							$scope.productForm.tradePaymentOptions += '|' + $scope.productForm.otherTradePaymentOptions;
						} else {
							$scope.productForm.tradePaymentOptions = $scope.productForm.otherTradePaymentOptions;
						}
					} else {
						if($scope.productForm.tradePaymentOptions) {
							$scope.productForm.tradePaymentOptions += '|' + value.name;
						} else {
							$scope.productForm.tradePaymentOptions = value.name;
						}
					}
				}
			});
			
			$scope.productForm.productMeta = {};
			angular.forEach($scope.additionalInfo, function(value, key) {
				$scope.productForm.productMeta[key] = [];
				angular.forEach(value, function(kp, index) {
					if(kp.name && kp.value && kp.name.trim().length > 0 && kp.value.trim().length > 0) {
						$scope.productForm.productMeta[key].push(kp);
					}
				});
				
			});
			
			$scope.productForm.specifications = {};
			angular.forEach($scope.productDefSpecs, function(val, idx) {
				if(val.name && val.details) {
					$scope.productForm.specifications[val.name] = val.details;
				}
				
			});
		};
		
		$scope.addProduct = function(isValid) {
			if (isValid) {
				$scope.prepareProductPayload();
				$rootScope.loadingData = true;
				dataService.addNewProduct($scope.productForm).then(function(response){
					if(!response.data.success) {
						$scope.errorMessage = response.data.message;
						if('subscription_upgradation_required' === response.data.message_key) {
							$scope.showUpgradeBtn = true;
						}
					} else {
						$scope.productForm.companyProductId = response.data.cp_id;
						/*
						if($scope.productForm.companyProductId > 0) {
							modalService.showInfoMessage('Success', 'Your product is successfully added.').then(function(result) {
								if (result === 'ok') {
									$location.path('/edit-product/' + $scope.productForm.companyProductId);
								}
							});
						}
						*/
						$scope.successMsg = 'Your product is added successfully. Add More Details for your product now.';
						$scope.doneSteps.push('step2');
						stepsService.steps().next();
					}
				})['finally'](function() {
					$rootScope.loadingData = false;
				});
			} else {
				$scope.errorMessage = 'Please enter all the required fields.';
				$(window).scrollTop(0,0);
			}
		};
		
		
		$scope.updateProduct = function(isValid, isDirty, formp) {
			if (isValid) {
				console.log('dirty: ', isDirty);
				if(isDirty) {
					$scope.prepareProductPayload();
					$rootScope.loadingData = true;
					dataService.updateCompanyProduct($scope.productForm).then(function(response){
						if(!response.success) {
							$scope.errorMessage = response.message;
							if('subscription_upgradation_required' === response.message_key) {
								$scope.showUpgradeBtn = true;
							}
						} else {
							$scope.successMsg = 'Your product is updated successfully.';
							$scope.doneSteps.push('step3');
							stepsService.steps().next();
						}
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
		
		
		$scope.fileData = {};
		
		$scope.cancelFileUpload = function() {
			$scope.$applyAsync(function() {
				$scope.fileData.attachedFile = '';
				$scope.fileData = {};
			});
			
		};
		$scope.modalOptions.close = function() {
		};
		
		$scope.fileUploadHolder = {key:'product', data:$scope.productForm};
		$scope.addProductImage = function(fileData) {
			
			var file = $scope.fileData.attachedFile;
			console.log("file", fileData);
			delete $scope.fileData.attachedFile;
			
			if(!file) {
				$scope.uibModalInstance.close();				
			} else {					
				var fd = new FormData();
				fd.append('file', file);
				fd.append('product', new Blob([JSON.stringify($scope.productForm)], {type: "application/json"}));
				// fd.append('product', $scope.productForm);
				$rootScope.loadingData = true;
				dataService.uploadProductImage(fd).then(function(response) {
					console.log(response);
					$rootScope.loadingData = false;
					if(response.name) {
						$scope.productImageSources.push(response.name);
					}
					$scope.uibModalInstance.close();
				})['finally'](function () {
					$rootScope.loadingData = false;
				});;
			}
		};
		
		$scope.addNewProductImage = function() {
			$scope.fileData.filepreview = undefined;
            modalService.showModal($scope.modalSelectProvider, $scope.modalOptions).then(function(result) {
				if (result === 'ok') {
					// $scope.addProductImage();
					$scope.uibModalInstance.close();
				}
				
			});			
		};
		
		$scope.removeProductImage = function(imageUrl) {
			var payload = {companyProductId: $scope.productForm.companyProductId, imageToDelete: imageUrl};
			dataService.deleteProductImage(payload).then(function(response) {
				console.log('Image deleted:', response.success);
				var index = $scope.productImageSources.indexOf(imageUrl);
				if(index >= 0) {
					$scope.productImageSources.splice(index, 1);
				}
			});
			
		};
		
		$scope.validateAndSubmitCategories = function (isValid) {
			console.log(isValid);
			$scope.errorMessage = '';
			if(isValid) {
				if(!$scope.productForm.product.category || $scope.productForm.product.id < 1) {
					if($scope.availableProducts.category) {
						$scope.productForm.product.id = $scope.availableProducts.category.id;
					} else if ($scope.availableProducts.category2 && $scope.availableProducts.category2.children.length == 0) {
						$scope.productForm.product.id = $scope.availableProducts.category2.id;
					} else if ($scope.availableProducts.category1 && $scope.availableProducts.category1.children.length == 0) {
						$scope.productForm.product.id = $scope.availableProducts.category1.id;
					} else if ($scope.availableProducts.pr && $scope.availableProducts.pr.children.length == 0) {
						$scope.productForm.product.id = $scope.availableProducts.pr.id;
					}
				}
				$scope.setSelectTypeCategoryText();
				if($scope.productForm.product.id > 0) {
					$scope.doneSteps.push('step1');
					stepsService.steps().next();
				} else if($scope.productForm.category){
					$scope.productForm.product.id = 1044687;
					//$scope.productForm.tradeType = 'export';
					$scope.productForm.productName = $scope.productForm.category;
					//$scope.doneSteps.push('step1');
					stepsService.steps().next();
					//$scope.addProduct(true);
				} else {
					$scope.errorMessage = 'Please select the product categories.';
				}				
			} else {
				$scope.errorMessage = 'Please select the product categories.';
			}
		};
		
		$scope.finishProductAdded = function(){
			
			authService.setProductSetupFlag(true);
			$location.path('/manage-products');
			/*-
			$rootScope.loadingData = true;
			authService.getControlPanelDetails(true).then(function(response) {
				$rootScope.loadingData = false;
				$location.path('/dashboard');
			})['finally'](function () {
				$rootScope.loadingData = false;
				$location.path('/dashboard');
			});
			*/
		};
		
		$scope.loadAllProducts();
		
		$scope.productUnitAutoOptions = {
		        options: {
		            html: true,
		            focusOpen: false,
		            onlySelectValid: false,
		            source: function (request, response) {
		                var data = [];

		                if(request.term && request.term.length > 0) {
		                	
		                	angular.forEach($scope.allUnits, function(value) {
		                		
		                		if(value.toLowerCase().startsWith(request.term.toLowerCase())){
		                			data.push({
	                                    label: value,
	                                    value : value,
	                                    category: 'Products'
	                                });
		                		}
			                	
                            });
		                	
		                	response(data);
		                }

		            },
		            select: function( event, ui ) {
		                if(ui.item && ui.item.value) {
		                 
		                }
		            }
		        },
		        methods: {}
		    };
			
		$scope.productAutoOptions = {
			options: {
				html: true,
				focusOpen: false,
				onlySelectValid: true,
				outHeight: 400,
				position: { my: "left top", at: "left bottom", collision: "none" },
				source: function (request, response) {
					var data = [];				
					if(request.term && request.term.length > 1) { 	
						dataService.getHSCodeByName(request.term).then(function(data1){
							if(data1) {
								var productNames = data1;
								angular.forEach(productNames, function(value, index) {
									var valueObj = {
										value: value.id+" - "+value.value,
										code : value.id,
										name : value.value,
										pid: parseInt(value.parentValue),
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
					if(ui.item && ui.item.value) {
						$scope.productForm.category = ui.item.category;
						$scope.productForm.code = ui.item.code;
						$scope.productForm.product.id = ui.item.pid;
						$scope.loadCategoryDetails();
					}
				}
			},
			methods: {}
		};
		
		$scope.loadCategoryDetails = function () {
			if($scope.productForm.code) {
				dataService.getProductAncestorChain($scope.productForm.code).then(function (response) {
					if(response.success) {
						var product = response.data;
						$scope.setSearchTypeCategoryText(product);
					}
				});
			}
		};
		
		$scope.showAddProductHelpVideos = function() {
			$scope.helpVideoSrc = $sce.trustAsHtml('<iframe width="100%" height="315" src="https://www.youtube.com/embed/c3tzgFwcFkA"></iframe>');
			$scope.modalOptions = {
				closeButtonText: 'Close',
				actionButtonText: 'Done',
				headerText: 'How to add a product',
				bodyText: $scope.helpVideoSrc,
				hideLoading : function() {
					console.log('loaded');
				}
			};

			$scope.modalSelectProvider = {
			   backdrop: true,
				keyboard: true,
				modalFade: true,
				templateUrl: 'app/c2iapp/partials/modal.html',
				scope: $scope,
				size: 'lg',
				windowClass: 'my-modal-popup'
			};
			
			
			modalService.showModal($scope.modalSelectProvider, $scope.modalOptions)
				.then(function(result) {
					if (result === 'ok') {
					}
				
			});			
		};
		
		$q.all($scope.companyProductDataRequests).then(function(values) {
			//
			if(values) {
				angular.forEach(values, function(value, index) {
					if('companyProduct' === value.type) {
						$scope.processCompanyProductDataResponse(value.data);	
					}
				});
				
			}
			console.log(values);
		 });
    };

    addNewProductController.$inject = injectParams;
    app.register.controller('addNewProductController', addNewProductController);

});