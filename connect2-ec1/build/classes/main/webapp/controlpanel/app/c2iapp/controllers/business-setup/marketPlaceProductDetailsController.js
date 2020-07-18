'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'ecomService', '$rootScope', 'modalService','$filter'];

    var marketPlaceProductDetailsController = function ($scope, $location, $routeParams, authService, ecomService, $rootScope, modalService,$filter) {
        $scope.productForm = {};
		$scope.successMsg = ''; 
	
  		$scope.formtempvalue=[];
		$scope.formObject={};
		$scope.imageCount = 0;
		$scope.data1=[{"child": [], "attributeDisplayName": "HSN","key":"hsn"},  {"child": [], "attributeDisplayName": "Manufacturer Details","key":"manufacturerDetails"}, {"child": [], "attributeDisplayName": "Luxury Cess","key":"luxuryCess"},{"child": [], "attributeDisplayName": "Package Height","key":"packageHeight"} ,{"child": [], "attributeDisplayName": "Package Length","key":"packageLength"},{"child": [], "attributeDisplayName": "Package Breadth","key":"packageBreadth"},{"child": [], "attributeDisplayName": "Package Weight","key":"packageWeight"}, {"child": [], "attributeDisplayName": "Manufacturing Date","key":"manufacturingDate"},{"child": [], "attributeDisplayName": "Shelf Life","key":"shelfLife"}, {"child": [], "attributeDisplayName": "Packer Details","key":"packerDetails"},  {"child": [], "attributeDisplayName": "Importer Details","key":"importerDetails"}, {"child": ["Guyana", "Canada", "Svalbard and Jan Mayen Islands", "Armenia", "Afghanistan", "Palestinian Territory", "Malta", "Antarctica", "Madagascar", "Poland", "Maldives", "Gabon", "Russian Federation", "Belarus", "Azerbaijan", "Bhutan", "Bosnia and Herzegovina", "Cook Islands", "Saint Lucia", "Marshall Islands", "Equatorial Guinea", "Singapore", "Finland", "Panama", "French Southern Territories", "Sweden", "Tokelau", "Bahamas", "Swaziland", "Japan", "Nigeria", "Trinidad and Tobago", "British Indian Ocean Territory", "San Marino", "Belgium", "Bouvet Island", "Qatar", "Indonesia", "Macao, SAR China", "Burkina Faso", "Micronesia", "Brunei Darussalam", "Haiti", "Bangladesh", "Philippines", "Rwanda", "Romania", "Somalia", "Luxembourg", "Suriname", "Ghana", "Netherlands Antilles", "Turkmenistan", "Palau", "Netherlands", "US Minor Outlying Islands", "Germany", "Saint-Martin (French part)", "Myanmar", "Zambia", "Dominican Republic", "Bahrain", "Brazil", "Namibia", "Oman", "Cambodia", "Saint-Barthélemy", "Argentina", "Pakistan", "Sao Tome and Principe", "Isle of Man", "Solomon Islands", "Hong Kong, SAR China", "Serbia", "Malaysia", "Austria", "Iceland", "Iraq", "Italy", "Saint Helena", "Congo (Brazzaville)", "Liberia", "Costa Rica", "Viet Nam", "Jersey", "Eritrea", "Chad", "France", "Hungary", "El Salvador", "Tajikistan", "Ecuador", "Mozambique", "United Arab Emirates", "Norfolk Island", "Kiribati", "South Africa", "Lao PDR", "Niger", "Aruba", "China", "Wallis and Futuna Islands", "Venezuela (Bolivarian Republic)", "Guinea", "Monaco", "Congo, (Kinshasa)", "Nauru", "Korea (North)", "Kyrgyzstan", "Thailand", "Paraguay", "Syrian Arab Republic (Syria)", "Kazakhstan", "Estonia", "Botswana", "Mauritius", "Nepal", "Togo", "Burundi", "Seychelles", "Antigua and Barbuda", "Israel", "Egypt", "Ireland", "Mongolia", "Norway", "Tuvalu", "New Caledonia", "Mauritania", "Heard and Mcdonald Islands", "Latvia", "Saint Kitts and Nevis", "Guadeloupe", "Andorra", "Aland Islands", "Zimbabwe", "Czech Republic", "Macedonia", "Jamaica", "Nicaragua", "Saudi Arabia", "Cyprus", "Gambia", "Comoros", "Liechtenstein", "Turkey", "Uganda", "Switzerland", "Martinique", "Cocos (Keeling) Islands", "Kenya", "Barbados", "Western Sahara", "Papua New Guinea", "Albania", "Samoa", "Benin", "Tanzania", "Guatemala", "Colombia", "British Virgin Islands", "Sudan", "Grenada", "Tunisia", "Guinea-Bissau", "Bolivia", "Malawi", "South Sudan", "Iran", "Cameroon", "Algeria", "French Polynesia", "Denmark", "Honduras", "Northern Mariana Islands", "Réunion", "Faroe Islands", "Moldova", "Uzbekistan", "Guernsey", "Angola", "Côte dIvoire", "United Kingdom", "Chile", "Anguilla", "Libya", "Mali", "Belize", "Montenegro", "Yemen", "Lesotho", "Taiwan", "Australia", "Kuwait", "Montserrat", "Slovenia", "American Samoa", "United States of America", "Korea (South)", "Uruguay", "Christmas Island", "Puerto Rico", "Saint Vincent and Grenadines", "Ukraine", "Cape Verde", "French Guiana", "Sri Lanka", "India", "Greece", "Lebanon", "Niue", "Fiji", "Turks and Caicos Islands", "Vanuatu", "Cayman Islands", "Peru", "Guam", "New Zealand", "Lithuania", "South Georgia and the South Sandwich Islands", "Mayotte", "Senegal", "Greenland", "Jordan", "Timor-Leste", "Virgin Islands, US", "Spain", "Central African Republic", "Cuba", "Croatia", "Slovakia", "Djibouti", "Mexico", "Gibraltar", "Portugal", "Falkland Islands (Malvinas)", "Holy See (Vatican City State)", "Ethiopia", "Dominica", "Pitcairn", "Saint Pierre and Miquelon", "Georgia", "Morocco", "Bermuda", "Tonga", "Bulgaria", "Sierra Leone"], "attributeDisplayName": "Country of Origin","key":"countryOfOrigin"},  {"child": [], "attributeDisplayName": "Seller SKU ID","key":"sku"}, {"child": [], "attributeDisplayName": "Stock available for buyers","key":"stockAvailableForBuyers"}, {"child": ["GST_0", "GST_3", "GST_5", "GST_12", "GST_18", "GST_28", "GST_APPAREL"], "attributeDisplayName": "Tax Code","key":"taxCode"}, {"child": [], "attributeDisplayName": "Stock ","key":"stock"} ];
		$scope.temp = [{"child": ["instock"], "attributeDisplayName": "Procurement type","key":"procurementType"},{"child": ["Seller", "Seller Smart"], "attributeDisplayName": "Fullfilment by","key":"fullfilmentBy"},{"child": ["Seller", "Flipkart", "Seller and Flipkart"], "attributeDisplayName": "Shipping provider","key":"shippingProvider"},{"child": [], "attributeDisplayName": "Local delivery charge","key":"localDeliveryCharge"},{"child": [], "attributeDisplayName": "Procurement SLA","key":"procurementSla"},{"child": ["Active", "Inactive"], "attributeDisplayName": "Listing Status","key":"listingStatus"},{"child": [], "attributeDisplayName": "National delivery charge","key":"nationalDeliveryCharge"},{"child": [], "attributeDisplayName": "MRP","key":"mrp"},{"child": [], "attributeDisplayName": "Zonal delivery charge","key":"zonalDeliveryCharge"},{"child": [], "attributeDisplayName": "Your selling price","key":"sellingPrice"}];
		$scope.toCamelCase = function(str){
	     	var arr=str.split(' ');
			var ans=[];
			ans[0]=arr[0].toLowerCase();
			for(var i = 1;i<arr.length;i++){
				ans[i]=arr[i].substr(0,1).toUpperCase() + arr[i].substr(1).toLowerCase();
			}
			return ans.join('');
	     }
	    
		ecomService.getForm($rootScope.categoryObj).then(function(response){
			$scope.data2 = response.data.uiFormMeta2;
			angular.forEach($scope.data2,function(value,key){
		        value['key']= $scope.toCamelCase(value.attributeDisplayName);
	      	})
			$scope.data3 = response.data.uiFormMeta3;
			angular.forEach($scope.data3,function(value,key){
		        value['key']= $scope.toCamelCase(value.attributeDisplayName);
	      	})
		})
		var detail={};
		detail={
			sellingInfo : {
				ecProdSiId: $rootScope.categoryObj.ecProdSiId,
			}
			
		}
		ecomService.getProductData(detail).then(function(response){
			$scope.formObject = response.data;
		})
		var file ={} ;
	    $scope.formObj={};
	    var arr = ['preview1','preview2','preview3','preview4','preview5'];
		$scope.updateProd = function(){
			$rootScope.loadingData = true;
     		$scope.formObject['mainCategory']= $rootScope.categoryObj.mainCategory;
     		$scope.formObject['category1']=     $rootScope.categoryObj.category1;
     		$scope.formObject['category2']=     $rootScope.categoryObj.category2;
	   			
     		ecomService.updateProduct($scope.formObject).then(function(response){
     			$scope.updateSuccessMsg = true;
     			$rootScope.loadingData = false;
     			file.ecProdId =  response.data.ecProdId;
     			//to get images
     			ecomService.getProductImages(file.ecProdId).then(function(response){
     				var data = response.data;
     				angular.forEach(arr,function(key,values){
     					$scope.fileObject[values] = data[key];
     				})
     			})
     		})
		}

		$scope.updateProductImage = function(file_model){
	     	if(file_model){
		     	var fd= new FormData();
		     	fd.append('ecProdId',file.ecProdId);
		     	fd.append('imageFile',file_model);
		     	$scope.imageCount++;
		     	$rootScope.loadingData = true;
		     	ecomService.updateProductImage(fd,'images').then(function(response){
		          $rootScope.loadingData = false;
		          $scope.uploadSuccessMsg = true;
		        })['finally'](function () {
		          $rootScope.loadingData = false;
		        });
		     	}
		    }


		$scope.loadCompanyDetails = function(reload){
			$rootScope.loadingData = true;
			authService.getControlPanelDetails(reload).then(function(response) {
				$scope.companyProfile = response.data[0];
				$scope.user=$scope.companyProfile.userDetails.user;
				$scope.companyProducts = $scope.companyProfile.companyProducts.products;
				if(response.subscription) {
					var productsAllowed = response.subscription.enabledFeatures.noOfProductsAllowed;
					if(productsAllowed <= $scope.companyProducts.length) {
						$scope.disableProductAdd = true;
						$scope.showUpgradeBtn = true;
						$scope.errorMessage = 'You need to upgrade your subscription to add more products';
					} else {
						$scope.disableProductAdd = false;
						$scope.showUpgradeBtn = false;
						$scope.errorMessage = '';
					}
				}

			})['finally'](function () {
				$rootScope.loadingData = false;
			});
		};

		$scope.loadCompanyDetails(false);
    };

    marketPlaceProductDetailsController.$inject = injectParams;
    app.register.controller('marketPlaceProductDetailsController', marketPlaceProductDetailsController);

});
