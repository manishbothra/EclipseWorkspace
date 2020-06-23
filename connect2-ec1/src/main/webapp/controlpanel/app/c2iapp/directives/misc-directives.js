'use strict';

define(['app'], function (app) {

    var ngEnter = function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    };

    app.directive('ngEnter', ngEnter);	
	
	var ngCollapseLink = function () {
        return function (scope, element, attrs) {
            element.bind("click", function (event) {
                console.log(attrs); var $BOX_PANEL = $(this).closest('.x_panel'),
					$ICON = $(this).find('i'),
					$BOX_CONTENT = $BOX_PANEL.find('.x_content');
				
				// fix for some div with hardcoded fix class
				if ($BOX_PANEL.attr('style')) {
					$BOX_CONTENT.slideToggle(200, function(){
						$BOX_PANEL.removeAttr('style');
					});
				} else {
					$BOX_CONTENT.slideToggle(200); 
					$BOX_PANEL.css('height', 'auto');  
				}

				$ICON.toggleClass('fa-chevron-up fa-chevron-down');
            });
        };
    };

    app.directive('collapseLink', ngCollapseLink);
	app.directive('fileModel', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;
				
				element.bind('change', function(){
					var fileInput =  element[0].files[0];
					console.log(fileInput.name);
					if(attrs.val=='logoPreview'){scope.brandDocs.logoName = fileInput.name;scope.$apply();}
					else if(attrs.val =='tagImagePreview'){scope.brandDocs.tagImageName = fileInput.name;scope.$apply();}
					else if(attrs.val =='brandCertiPreview'){scope.brandDocs.brandCertiName = fileInput.name;scope.$apply();}

					scope.$apply(function(){
						modelSetter(scope, element[0].files[0]);
					}); 
					var reader = new FileReader();
					reader.onload = function(loadEvent) {
						if(attrs.key!='undefined'){
                        scope.fileObject[attrs.key] = loadEvent.target.result;
                        scope.$apply();
                    	}
                    	else{
						scope.$apply(function() {
						  scope.fileData.filepreview = loadEvent.target.result;
						  modelSetter(scope, element[0].files[0]);
						});
					}
					};
					if(fileInput) {
						reader.readAsDataURL(fileInput);
					} else {
						scope.$apply(function() {
							scope.fileData.filepreview = undefined;
						});
					}
				});
			}
		};
	}]);
	
	app.directive('productInputTemplate', ['$parse','$templateCache','$http','$compile', function ($parse,$templateCache,$http,$compile) {
		return {
			restrict: 'E',
			require: '^steps',
			link: function(scope, element, attrs) {
				var templateName = attrs['categorytemplate'];
				var templateData = $templateCache.get(templateName);
				
				var processTemplate = function(templateName, tdata) {
					var templateData = angular.copy(tdata);					
					var frmEl = '<form name="' + attrs.name + '" ng-submit="' + attrs['submit'] + '" class="'+ attrs['class'] +'"/>';
					var $frmEl = $.parseHTML(frmEl);
					var $existingEls = element.children();
					templateData.appendTo($frmEl);
					$existingEls.appendTo($frmEl);
					
					// var ngcl = $existingEls.find('[attr-re-el="true"]');
					// if(ngcl && ngcl.length > 0) {
						// console.log('ngcl', ngcl);
					// }
										
					// templateData = $templateCache.get(templateName);
					var template = angular.element($frmEl);
					$compile(template)(scope);
					$(element).html(template);
					scope.productConfigTemplateLoaded = true;
					scope.templateInfo.productConfigTemplateLoaded = true;
				};
				
				if(templateData) {
					processTemplate(templateName, templateData);
				} else {				
					$http.get('/configTemplates/product/' + templateName).then(function(response) {
						var $html = $('<div/>').html(response.data);
						$templateCache.put(templateName,$html);
						processTemplate(templateName, $html);
						
					});
				}
			}
		};
	}]);
	
	app.directive('inputReqd', function () {
		return {
			restrict: 'A',
			compile: function (elmt) {
				elmt.append("<sup><i class='fa fa-asterisk required-field'></i></sup>");
			}
		};
	});


	app.directive('infoMsg',function(){
		return {
			restrict:'E',
			replace: true,
			template:`<span data-toggle="tooltip" data-placement="top" title="{{obj.labelInfo}}">
						<i class="fa fa-question-circle" style="cursor:pointer;"></i>
					  </span>`,
			link: function(scope,elem,attrs){
			}
		}
	})
});