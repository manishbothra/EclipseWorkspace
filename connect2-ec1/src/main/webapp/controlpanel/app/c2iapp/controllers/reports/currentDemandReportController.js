'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams', 'authService', 'dataService', '$rootScope', '$http'];

    var currentDemandReportController = function ($scope, $location, $routeParams, authService, dataService, $rootScope, $http) {
       
		$scope.url=$location.search();
		$scope.loading = false;
		$scope.noProductAdded=false;
		$scope.noDailyData=false;
		$scope.comppro=[];
		$scope.reportForm = {};

		$scope.loadCompanyProducts=function(){
			$scope.loading = true;
			authService.getControlPanelDetails().then(function(response) {
				$scope.details=response.data;
				$scope.comppro=$scope.details[0].companyProducts.products;
				if ($scope.comppro.length>0){
					$scope.selectedProduct=$scope.comppro[0];
					$scope.reportForm.selectedProduct1=$scope.comppro[0];
					$scope.tradeType='export';
				} else{
					$scope.noProductAdded=true;
				}
				$scope.companyId=$scope.details[0].id;
				$scope.loading = false;
			});
		};


		$scope.chartOptionOport = {
			"type": "ColumnChart",
			"options": {
				"title":"Origin ports for export of "+$scope.url.product,
				backgroundColor: {fill: 'transparent'},
				'height':350
				/*vAxis: {
				 viewWindow:{ min:200, max:300.00},
				 gridlines: {count:10}
				 }*/

			},
			cssStyle: "height:100%; width:100%;backgroundColor: {fill:transparent} ",
			data: {}
		};
		$scope.chartOptionDport = {
			"type": "ColumnChart",
			"options": {
				"title":"Destination ports for export of "+$scope.url.product,
				backgroundColor: {fill: 'transparent'},
				'height':350
				/*vAxis: {
				 viewWindow:{ min:200, max:300.00},
				 gridlines: {count:10}
				 }*/

			},
			cssStyle: "height:100%; width:100%;backgroundColor: {fill:transparent} ",
			data: {}
		};

		$scope.chartOptionProduct = {
			"type": "PieChart",
			"options": {
				"title":"Top export shipments of "+$scope.url.product,
				backgroundColor: {fill: 'transparent'},
				'height':350
				/*vAxis: {
				 viewWindow:{ min:200, max:300.00},
				 gridlines: {count:10}
				 }*/

			},
			cssStyle: "height:100%; width:100%;backgroundColor: {fill:transparent} ",
			data: {}
		};



		$scope.prepareChartData= function(data){
			var oportData = {"cols": [
				{id: "t", label: "Port", type: "string"},
				{id: "s", label: "Values", type: "number"}
			], "rows": []
			};

			var dportData = {"cols": [
				{id: "t", label: "Port", type: "string"},
				{id: "s", label: "Values", type: "number"}
			], "rows": []
			};

			var productData = {"cols": [
				{id: "t", label: "Port", type: "string"},
				{id: "s", label: "Values", type: "number"}
			], "rows": []
			};

			for(var i=0; i<5; i++) {

				if(data[i]){
					oportData.rows.push(
						{
							c: [
								{v:data[i].oport},
								{v:data[i].value}
							]
						}
					);

					dportData.rows.push(
						{
							c: [
								{v:data[i].dport},
								{v:data[i].value}
							]
						}
					);

					productData.rows.push(
						{
							c: [
								{v:data[i].name},
								{v:data[i].value}
							]
						}
					);
				}
			}
			$scope.chartOptionOport.data = oportData;
			$scope.chartOptionDport.data = dportData;
			$scope.chartOptionProduct.data = productData;
			$scope.loading = false;
		};

		$scope.productReport = {};
		$scope.myOption = {
			options: {
				html: true,
				focusOpen: false,
				onlySelectValid: false,
				source: function (request, response) {
					var data = [];
					if(request.term && request.term.length > 3) {
						$http.get('/api/search/productNames1/' + request.term + "/10").then(function(data1){
							if(data1) {

								var productNames = data1.data;
								angular.forEach(productNames, function(value, index) {
									data.push({
										label: value.value,
										value : value.value,
										id: value.id,
										category: 'Products'
									})
								});

								response(data);
							}
						});
					}
				},
				select: function( event, ui ) {
					if(ui.item && ui.item.value && ui.item.value.length > 0) {
						$scope.productReport.name = ui.item.label;
						$scope.productReport.id = ui.item.id;
					}
				}
			},
			methods: {}
		};



		$scope.getDailyDataExport=function(productCode,tradeType){
			$scope.loading = true;
			console.log('getting real time data for '+productCode);
			var postObject = {"type":tradeType,
				"productCode":productCode,
				"filterRequired":false,
				"pageSize":50,
				"pageIndex":1,
				"duration":"last30days"};



			$http({
				method: "POST",
				url: '/api/trade/currentDemand/'+tradeType,
				data    : postObject
			}).success(function(data){
				$scope.products=data.stats;
				if(data.stats.length==0){
					$scope.noDailyData=true;
					console.log('no data is found for '+productCode);
				} else{
					console.log('real time data fetched');
					$scope.noDailyData=false;
				}
				$scope.prepareChartData(data);
			});
		};

		$scope.productChanged=function(product,tradeType){
			console.log('product changed '+product.code+' '+tradeType);
			$scope.selectedProduct = product;
			$scope.getDailyDataExport(parseInt(product.code),tradeType);
		};

		$scope.changeProduct = function (product,tradeType) {
			$scope.selectedProduct = product;
			if($scope.productReport.name && $scope.productReport.name.length > 3) {
				$scope.getDailyDataExport(product.code,tradeType);
			}
		};

		$scope.$watch('reportForm', function(newVal, oldVal) {
			if(newVal && newVal != oldVal) {
				$scope.productChanged(newVal.selectedProduct1, $scope.tradeType);
			}
		}, true);

		$scope.loadCompanyProducts();

		$scope.detailedAnalysis=function(){
			console.log('fn');
			window.open('https://connect2india.com/global/stats-current-demand.html?product='+$scope.selectedProduct.id+'&name='+$scope.selectedProduct.name, '_blank');
		};

    };

    currentDemandReportController.$inject = injectParams;


    app.register.controller('currentDemandReportController', currentDemandReportController);

});