'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http','$sce', '$timeout', '$filter'];

    var holisticViewController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http,$sce, $timeout, $filter) {
		$scope.url=$location.search();
		$scope.loading = false;

        $scope.url.id = $routeParams.id;

        $scope.getTradeHistory = function () {
    		$http.get('/api/company/getCompanyTradeHistory/'+$scope.url.id)
    		.success(function(data){
    			$scope.companyTradeHistory = data;
    		});
    	};


    	$scope.getCompanyScore = function () {
    		$http.post('/api/company/getCompanyScore/'+$scope.url.id, {})
    		.success(function(response){
    			$scope.companyScores = [];
    			$scope.behaviors = [];
    			if(response.success) {
    				angular.forEach(response.data, function(value, index) {
    					var analysis = JSON.parse(value.analysisJson);
    					if(value.scoreName == 'SENTIMENT_SCORE') {
    						$scope.companyScores.push({
    							scoreName: value.scoreName.replace(/_/g, ' '),
    							score: value.score,
    							category: analysis.category,
    							scoreValue: value.scoreValue,
    							details: analysis.details
    						});
    					} else if (value.scoreName == 'IMPORT_BEHAVIOUR') {
    						var analysis = JSON.parse(value.analysisJson);
    						var bh = {'Product': analysis.Product, 'Monthly Order Trend' : [], 'Monthly Price Trend' : [], 'Monthly Quantity Trend' : []};
    						var order_size_trend = analysis.order_size_trend || [];
    						angular.forEach(order_size_trend, function(value, key) {
    							if(value > 0) {bh['Monthly Order Trend'].push({key:value});}
    						});

    						var monthly_price_trend = analysis.monthly_price_trend || [];
    						angular.forEach(monthly_price_trend, function(value, key) {
    							if(value > 0) {bh['Monthly Price Trend'].push({key:value});}
    						});

    						var monthly_quantity_trend = analysis.monthly_quantity_trend || [];
    						angular.forEach(monthly_quantity_trend, function(value, key) {
    							if(value > 0) {bh['Monthly Quantity Trend'].push({key:value});}
    						});

    						var mp = analysis.major_port || {};
    						bh['Major Port'] = {'Name' : mp.port_name, 'Engagement' : mp.engagement_percent + ' %'};
    						bh['Importing from Repeated Exporters'] = analysis.percent_repeated_exporters + ' %';
    						$scope.behaviors.push(bh);
    						console.log(JSON.stringify($scope.behaviors));
    					}

    				});
                    $scope.otherScores = response.otherScores;
    			}
    			$scope.showScoreTab = $scope.behaviors.length > 0 || $scope.companyScores.length > 0;
    		});
    	};

        $scope.getCompanyContactDetails = function () {
    		$http.get('/api/company/getCompanyContactDetails/'+$scope.url.id)
    		.success(function(data){
    			$scope.companyContacts = data;
    			if(data.success && data['personal']){
    				$scope.companyContactsDetails = $scope.companyContacts.data['personal'];
    			}

    		});
    	};

    	$scope.getCompanyWhois=function() {
    		$http.post('/api/company/getCompanyWhois/'+$scope.url.id, {})
    		.success(function(response){
    			$scope.whoisdata = [];
    			if(response.success) {
    				angular.forEach(response.data, function(value, index) {
    					var analysis = JSON.parse(value.whoisDataJson);
    					$scope.whoisdata.push(analysis);
    				});
    			}

    		});
    	};

        $scope.setOwlCarousel = function() {
            console.log('setting product carousel');
            $('.owl-carousel').owlCarousel({
               loop:true,
               margin:10,
               nav:true,
               autoplay:true,
               autoplayTimeout:2500,
               responsive:{
                   0:{
                       items:1
                   },
                   600:{
                       items:3
                   },
                   1000:{
                       items:3
                   }
               }
           });
        };

        $scope.companyChargeList = [];
        $http.get('/api/company/companyDetails/'+$scope.url.id)
        .success(function(data){
        	//alert("yes");
            $scope.company=data[0];
            $scope.tradeType=$scope.company.tradeId;
            if($scope.company.companyFeatures && $scope.company.companyFeatures['charges']) {
				$scope.companyChargeList = $scope.company.companyFeatures['charges'];
			}
			if($scope.company.contact && $scope.company.contact['personal']) {
				$scope.companyContactList = $scope.company.contact['personal'];
			}
            $scope.prepareTradeChart($scope.company.tradeProducts);
			$scope.prepareFinancialChart($scope.company.financials);

			$scope.setNewsFeeds($scope.company.name);

			if($scope.company.companyAddress) {
				 $scope.setAddressMapView($scope.company.companyAddress);
			}
			if($scope.company.country) {
				var lc = $scope.company.country.toLowerCase();

				if('uk' === lc) {
					$scope.company.formattedCountry = 'United kingdom';
				} else  if ('united states' === lc || 'united states of america' === lc) {
					$scope.company.formattedCountry = 'USA';
				} else {
					$scope.company.formattedCountry = $scope.company.country;
				}
			}

			var companyProducts = $scope.company.companyProducts;

			if(companyProducts) {
                $scope.summaryProduct = '';
				angular.forEach(companyProducts, function(value, key) {
					angular.forEach(value, function(prodList, key2) {

						if(prodList && prodList.length > 0) {
							var prod = prodList[0];
							$scope.prodCodeForDailyData = prod['mainCode'];
                            if(key2==0){
                                $scope.summaryProduct = prod['description'];
                            } else{
                                $scope.summaryProduct = $scope.summaryProduct+', '+prod['description'];
                            }
						} else {
                            if(key2==0){
                                $scope.summaryProduct = prodList['name'] || prodList['description'];
                            } else{
                                $scope.summaryProduct = $scope.summaryProduct+', ' + (prodList['name'] || prodList['description']);
                            }
                        }
					});
				});
                if($scope.summaryProduct.length>0){
                    $scope.summaryProduct = 'The company deals in following products: '+$scope.summaryProduct;
                }
				if(!$scope.prodCodeForDailyData && companyProducts.Products && companyProducts.Products.length > 0){
					$scope.prodNameForDailyData = companyProducts.Products[0].name;
				}
                $timeout($scope.setOwlCarousel, 5000);
			}

			if($scope.prodCodeForDailyData) {
				$scope.loadDailyData($scope.prodCodeForDailyData);
				$scope.loadHistoricalData($scope.prodCodeForDailyData);
			} else if($scope.prodNameForDailyData) {
				$scope.loadDailyData($scope.prodCodeForDailyData,$scope.prodNameForDailyData);
				$scope.loadHistoricalData($scope.prodCodeForDailyData,$scope.prodNameForDailyData);
			}

			$scope.companyBasicDetailsLoaded = true;
			console.log('basic details loaded');
        });

        $scope.setOtherDetails = function(companyData) {
    		$scope.newsUrl = $sce.trustAsResourceUrl('http://www.google.com/uds/modules/elements/newsshow/iframe.html?format=300x250&&q=' + companyData.name.trim());
    		$scope.sample_video_url = 'https://s3-us-west-2.amazonaws.com/company-resources/sample_video.mp4';
    		$scope.videoUrl = companyData.videoUrl || $sce.trustAsResourceUrl($scope.sample_video_url); //'/in/images/sample_video.mp4';
    		//$scope.facebook_url="https://www.facebook.com/Connect2india";

    		$scope.twitter_name = 'Connect2group';
    		// $scope.getTwitteAnchor($scope.twitter_name);

    		$scope.setNewsFeeds(companyData.name.trim());
    		//$scope.setMediaData(companyData);

    		$scope.$watch(function() {
    			return window.fbInitialized;
    		}, function(newVal, oldVal) {
    			console.log("rendering fb: ", newVal);
    			if(newVal) {
    				$scope.facebook_url= "https://www.facebook.com/" + 'Connect2india'; //companyData.name.trim();
    			}
    		});

    		$scope.getTwitteAnchor($scope.twitter_name);
    		$.getScript('/js/twitter-sdk.min.js', function() {
                console.log("twitter is ready.");;
            });
    	};

	$scope.setAddressMapView = function(companyAddress) {
		if(!companyAddress.registered) {
			return;
		}

		var address = companyAddress.registered[0];
		var mAddr = '';
		if(address.lat && address.lng) {
			mAddr = address.lat + "," + address.lng;
		} else {
			mAddr = address.displayAddress;
		}

		var addrMapUrl = "https://www.google.com/maps/embed/v1/search?q=" + window.encodeURIComponent(mAddr)
		+ "&zoom=13&maptype=roadmap&key=AIzaSyDaDls-sTwGkVK4YKV9D4RPDnz1HLGvdKs";
		$scope.companyAddrMapLink = $sce.trustAsResourceUrl('https://www.google.com/maps/place/' + window.encodeURIComponent(mAddr));
		$scope.companyAddrMapUrl = addrMapUrl;
		$scope.displayAddr = address.displayAddress.replace(",", "<br>");
		$scope.displayAddrStr = address.displayAddress;

	};

	$scope.setNewsFeeds = function(name) {
		$http.get('/api/search/feeds/news/' + name).success(function(response){
			var data = response.result;
			$scope.feedRes = [];  //$sce.trustAsHtml
			if(data) {
				angular.forEach(data, function(value, index) {
					var obj = {
						url: value.url,
						title: value.title,
						contentSnippet: value.content,
						link: value.url,
						dateVal: value.date,
						date: new Date(value.date).toLocaleString()//.toString("MMM dd")
					};
					$scope.feedRes.push(obj);
				});
			}
		});
	};

	$scope.showFeed = function(url, elemIndex) {
		//$scope.feedUrl = $sce.trustAsResourceUrl(url);
		new GFdynamicFeedControl(url, 'feedControl' + elemIndex);
	};

	$scope.getTwitteAnchor = function (name) {
		var str = '<a class="twitter-timeline" href="https://twitter.com/' + name +'" data-widget-id="662203302545756160" data-screen-name="' + name +'"></a>';
		$('#twitterFeed').prepend(str);
	};

	$scope.gplusRendered = false;

	$scope.renderGpWidget = function () {
		if(!$scope.gplusRendered) {
			gapi.post.render("g-widget-div", {'href' : 'https://plus.google.com/+Connect2india/posts/ZUbGmjyowJH'} );
			$scope.gplusRendered = true;
		}

    };



	$scope.mediaInfo = [];

	//media related
	$scope.setMediaData = function (companyData) {
		var mediaLocPrefix = 'http://maps.googleapis.com/maps/api/staticmap?size=500x250'
		+ '&key=AIzaSyDkR8jPRh2Eb-W9dqgC4sBpVyeTtnW8Irg&path=color:0x0000ff|weight:5|';

		$http.get('/api/company/mediaDetails/' + companyData.id).success(function(response) {

			var mdata = response.data;
			var prefix = response.data_path + "/";
			angular.forEach(mdata, function(value, index) {

				if(value.mediaPath) {
					var info = {
						url: $sce.trustAsResourceUrl(prefix + value.mediaPath),
						time: new Date(value.dateCreated).toLocaleString(),
						type: value.type
					};

					if(value.metaData) {
						var meta = JSON.parse(value.metaData);
						var locs = meta.latlngs;
						if(locs) {
							var points = JSON.parse(locs);
							info['locs'] = points;
							var mediaLocation = mediaLocPrefix;
							angular.forEach(points, function(value, key) {
								mediaLocation += key + "," + value + "|";
							});
							mediaLocation = mediaLocation.slice(0, -1);
							info['locPath'] = mediaLocation;
							if(meta.mailId) {
								info['email'] = meta.mailId;
							}

							if(meta.address) {
								info['address'] = meta.address;
							}

							if(meta.deviceInfo) {
								info['deviceInfo'] = meta.deviceInfo;
							}
						}

					}
					$scope.mediaInfo.push(info);
				}
			});

			console.log('media-data', $scope.mediaInfo);
		});

	};



	// chart related0
	var totalProductsToShow = 5;

	//var xAxis = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7, "Aug":8,"Sep":9,"Oct":10,"Nov":11, "Dec" : 12};
	var xAxis = ["Jan","Feb","Mar","Apr","May","Jun","Jul", "Aug","Sep","Oct","Nov", "Dec"];

	$scope.tradeChart = {
		'import': {},
		'export': {}
	};

	var nvChartOption = {
		"chart": {
			"type": "lineChart",
			"height": 300,
			"width": 600,
			"margin": {
			  "top": 20,
			  "right": 20,
			  "bottom": 40,
			  "left": 100
			},
			"useInteractiveGuideline": true,
			"dispatch": {},
			"xAxis": {
			  "axisLabel": "Year"
			},
			"yAxis": {
			  "axisLabel": "Activity"
			},
			noData:"No Data Available."
		},
		"title": {
			"enable": true,
			"text": "Trade Activity of top " + totalProductsToShow + " products",
			"css": {
			  "text-align": "center",
			  "color": "#333",
			  "font-weight":"bold",
			  "margin-bottom": "17px",
			  "text-decoration":"underline"
			}
		},
		"styles": {
			"classes": {
			  "with-3d-shadow": true,
			  "with-transitions": true,
			  "gallery": true
			},
			"css": {}
		}
	};

	$scope.nvChartConfig={ deepWatchData: true };
	$scope.tradeYears = {'import':[], 'export':[]};
	$scope.tradeChart['import']['options']=angular.copy(nvChartOption);
	$scope.tradeChart['export']['options']=angular.copy(nvChartOption);
	$scope.monthWiseTradeChart = {'import': {}, 'export': {}};

	$scope.monthWiseTradeChart['import']['options']=angular.copy(nvChartOption);
	$scope.monthWiseTradeChart['import']['options'].title.text = 'Trade Activity - Month wise';
	$scope.monthWiseTradeChart['import']['options'].chart.yAxis.axisLabel = 'Activity';
	$scope.monthWiseTradeChart['import']['options'].chart.xAxis = { 	axisLabel: "Month",
																	tickFormat: function(d) {
																		var dx = xAxis[d];
																		return dx;
																	},
																	tickValues: [0,1,2,3,4,5,6,7,8,9,10,11]
																};

	$scope.monthWiseTradeChart['export']['options']=angular.copy($scope.monthWiseTradeChart['import']['options']);

	$scope.financialChart = {};
	$scope.financialChart['options'] = angular.copy(nvChartOption);
	$scope.financialChart['options'].chart.xAxis.axisLabel = 'Year';
	$scope.financialChart['options'].chart.yAxis.axisLabel = 'Value (M USD)';
	$scope.financialChart['options'].title.text = 'Financial Trends';



	$scope.xMonthFunction = function(){
		return function(d){
			return xAxis.indexOf(d[0]) + 1;
		};
	};

	$scope.xAxisTickFormatFunction = function(){
         return function(d){
             return xAxis[d-1]; //d3.time.format('%x')(new Date(d));  //uncomment for date format
         };
     };



	$scope.prepareTradeChart = function(data) {

		$scope.displayTradeImportChart = false;
		$scope.displayTradeExportChart = false;

		var predictionChartData = {'import': {}, 'export': {}};
		$scope.formatedTradeChartData = {'import': [], 'export': []};
		var types =['import', 'export'];

		for(var typeIndex in types) {
            var type = types[typeIndex];
            var cdatas = data.tradeMap[type];
			angular.forEach(cdatas, function(value, key) {
				var durationMap = value.durationMap;
				var totalCountForProduct=0;
				var productData = [];
				var years = [];
				angular.forEach(durationMap, function(val, ky) {
                    if(type =='export') {
                        $scope.displayTradeExportChart = true;
                    } else {
                        $scope.displayTradeImportChart = true;
                    }
					totalCountForProduct +=val.length;
					productData.push({x:ky, y:val.length});
					years.push(ky);
					if($scope.tradeYears[type].indexOf(ky) < 0) {
						$scope.tradeYears[type].push(ky);
					}
				});


				value['totalCount'] = totalCountForProduct;
				value['key'] = key;
				value['data'] = productData;
				value['years'] = years;
				$scope.formatedTradeChartData[type].push(value);
			});


			if($scope.displayTradeImportChart || $scope.displayTradeExportChart) {
				var tempData = {};
				var tempFormattedData = [];
				var count = 0;
				var sortedData = $filter('orderBy')($scope.formatedTradeChartData[type], 'totalCount', true);

				var chartData = [];

				angular.forEach(sortedData, function(value, index) {

					if(count < totalProductsToShow) {
						var chartDataObj = {};
						chartDataObj['key'] = value.key;
						chartDataObj['values'] = value.data;
						chartData.push(chartDataObj);
						tempFormattedData.push(value);
					}
					count++;

				});
				$scope.tradeChart[type]['data'] = chartData;
				$scope.tradeChart[type]['options'].title.text = (type == 'export'? 'Export': 'Import') + " Activity of top " + totalProductsToShow + " products";
				$scope.formatedTradeChartData[type] = tempFormattedData;
				//console.log("tempData", JSON.stringify(tempData));
			}
		}
	};

	$scope.$watch('selectedImportYear', function(newVal, oldVal) {
		if(newVal && newVal != oldVal) {
			$scope.showTradeMonthwiseChart('import', newVal);
		}
	});


	$scope.showTradeMonthwiseChart = function (type, selectedYear) {
		var monthChartData = {};
		$scope.monthWiseTradeChart[type]['data'] = [];
		angular.forEach($scope.formatedTradeChartData[type], function(value, index){
			var monthData = value.durationMap[selectedYear];
			if(monthData) {
				var monthValues = {};
				angular.forEach(monthData, function(month, index2) {
					var monthIndex = month.trim();
					if(monthIndex.indexOf(' ') >= 0) {
						monthIndex = monthIndex.split(' ')[0];
					}
					if(!monthValues[monthIndex]) {
						monthValues[monthIndex] = 0;
					}
					monthValues[monthIndex] = monthValues[monthIndex]+1;
				});
				monthChartData[value.key] = monthValues;
			}

		});

		var monthWiseFormattedData = [];
		angular.forEach(monthChartData, function(value, key) {
			var chartDataObj = {};
			chartDataObj['key'] = key;
			chartDataObj['values'] = [];
			angular.forEach(xAxis, function(month, index) {
				var value2 = value[month] || 0;
				var xVal = xAxis.indexOf(month);
				chartDataObj['values'].push({x:xVal, y:value2});
			});
			monthWiseFormattedData.push(chartDataObj);

		});

		$scope.monthWiseTradeChart[type]['data'] = monthWiseFormattedData;
		$scope.displayMonthwiseTradeImportChart = true;

		$scope.$evalAsync(function(){
			$scope.monthWiseTradeChart[type].api.refresh();
		});

		// console.log("monthWiseFormattedData", JSON.stringify($scope.monthWiseTradeChart[type]['data']));
	//	console.log("trade", JSON.stringify($scope.tradeChart['export'].data));
	};



	$scope.displayFinancialChart = false;

	$scope.prepareFinancialChart = function(financialsData) {
		$scope.displayFinancialChart = false;
		var chartData = [];

		angular.forEach(financialsData, function(value, key) {
			var chartDataObj = {};
			chartDataObj['key'] = key;
			chartDataObj['values'] = [];
			angular.forEach(value, function(val, ky) {
				$scope.displayFinancialChart = true;
				chartDataObj['values'].push({x:ky, y:(val/1000000)});
			});
			chartData.push(chartDataObj);
		});

		if($scope.displayFinancialChart) {
			$scope.financialChart['data'] = chartData;
			$scope.financialChartData = chartData;
			$scope.financialChart.data = chartData;
			//console.log("chartData", chartData);
		}

	};

	$scope.submitContactCompanyDetails = function(isValid) {
		if(isValid) {
			$http({
				method  : "POST",
				url     : '/api/search/contactCompany/'+$scope.ccFormData.companyId,
				data	: $scope.ccFormData
			}).success(function(data){
				 if(data.success){
					 $scope.contactCompanySuccess = 'true';
					 $scope.contactCompanyStatusMsg = 'Thank you for contacting this company.';
				 }
				 else
				  {
					 $scope.contactCompanySuccess = 'false';
					 $scope.contactCompanyStatusMsg = data.message;
					 //alert("you can contact only 1 company. For contact more companies , please subscribe.");
				  }
			});
		}
	};

	$scope.companycontact=function(id){
		if($scope.session==8){
			$('#contactCompany').modal('show');
		}
		else{
			$scope.ccFormData = {companyId : id};
			$('#contactCompanyMsgModal').modal('show');
		}
   };

   $scope.closeContactCompanyDetails = function() {
	    $scope.contactCompanyStatus = '';
		$scope.contactCompanySuccess = false;
	   $('#contactCompanyMsgModal').modal('hide');
   };

   $scope.loadDailyData = function(productCode, productName) {
		//$scope.url.product
	   if(!productCode) {
		   productCode = '0';
	   }
	  //api/trade/currentData/cn/export/undefined/0/steel/last30days/1/80
	   var getUrl = '/api/trade/currentData/cn/export/undefined/'+ productCode + '/' + productName + '/last30days/1/10';
	   $http.get(getUrl).success(function(data1){
			$scope.demandproducts=data1.stats;
	   });
   };

	$scope.loadHistoricalData = function(productCode, productName) {
		//$scope.url.product
	   if(!productCode && !productName) {
		   return;
	   }

		var filterData = {
			destinationCountry: 699,
			outputType : "ALL_SUB",
			parentId: 0,
			displayCountry: 'All',
			endYear: $scope.year || 2016,
			searchType: 'COMPANY-' + $scope.company.id,
			randomize: true
		};

		if(productCode) {
		   filterData['parentId'] = productCode;
		} else if(productName) {
			filterData['productNames'] = productName.split(" ");
		}


		$http(
				{
					method: "POST",
					url:'/api/trade/filter/export',
					data    : filterData
				}
			).success(function(data){
				$scope.historicalProductDemand = data;
			});
		};


	$scope.showInspectCompany = function(company) {
		$scope.insepectCompanyStatus = '';
		$scope.insepectCompanySuccess = false;
	   $('#inspectionModal').modal('show');
	};

	$scope.closeInspectCompanyDetails = function() {
	    $scope.insepectCompanyStatus = '';
		$scope.insepectCompanySuccess = false;
	   $('#inspectionModal').modal('hide');
   };

	$scope.inspectCompany = function(company) {
		var extraInfo = {};
		extraInfo['trackingId'] = 'inspection.c2i.com';
		extraInfo['type'] = 'leads';
		extraInfo['number'] = 'Number: ' + $scope.inspectForm.phone;
		extraInfo['source'] = 'Inspection-leads-inspect.c2i.com:' + JSON.stringify($scope.inspectForm);
		var validated;
		var getUrl = '';
		var regData = {};

		getUrl = '/api/register/addLeads';
		regData['email'] = $scope.inspectForm.email;
		regData['companyName'] = $scope.inspectForm.companyName;
		regData['extraInfo'] = extraInfo;
		validated = true;

		if(validated && getUrl.length > 0) {
			$scope.loadingData = true;
			$http({
				method: "POST",
				url: getUrl,
				data: regData
			}).success(function(response) {
				$scope.loadingData = false;
				if(response.success){
					 $scope.insepectCompanySuccess = 'true';
					 $scope.inspectCompanyStatusMsg = 'You have successfully submitted the reqest for inspection. We will get back to you shortly';
				 }
				 else
				  {
					 $scope.insepectCompanySuccess = 'false';
					 $scope.inspectCompanyStatusMsg = response.message;
				  }
			}).error(function(response) {
				console.log("ERROR PRORCESSING REQUEST.");
				 $scope.insepectCompanySuccess = 'false';
				$scope.inspectCompanyStatusMsg = 'Sorry, we could not process your request. Please try after some time.';
				$scope.loadingData = false;
			});
		}
	   };

        $scope.getTradeHistory();
    	$scope.getCompanyContactDetails();
    	$scope.getCompanyScore();
    	$scope.getCompanyWhois();

    };

    holisticViewController.$inject = injectParams;
    app.register.controller('holisticViewController', holisticViewController);

});
