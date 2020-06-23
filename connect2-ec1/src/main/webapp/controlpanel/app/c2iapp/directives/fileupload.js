'use strict';

define(['app'], function (app) {
	var injectParams = ['$timeout','dataService'];
    var fileUploadDir = function ($timeout, dataService) {
        return {
            restrict: 'E',
            template: '<div><input type="file" id="inputFileProdImg" file-model="productImages.attachedFile"></div>',
            replace: true,
            transclude: true,
            scope: {
                headers: '=',
                ngModel: '=',
                disabled: '='
            },
            require: 'ngModel',
            link: function (scope, el, attr) {
                
                function upload(fileProperties, index, file) {
                    if (resize && maxWidth && maxHeight && (file.type.indexOf('image/') !== -1)) {
                        Resize(file, index, file.type);
                    } else {
                        uploadFile(file, index);
                    }
                    return angular.extend(scope.ngModel[index], {
                        name: fileProperties.name,
                        size: fileProperties.size,
                        type: fileProperties.type,
                        status: {},
                        percent: 0,
                        preview: null
                    });
                }

                function uploadFile(file, index) {
                    var fd = new FormData();
					fd.append('file', file);
					fd.append(scope[attr.uploadpayload].key, new Blob([JSON.stringify(scope[attr.uploadpayload].data)], {type: "application/json"}));
					dataService.uploadProductImage(fd).then(function(response) {
						console.log(response);
						if(response.name) {
							scope[attr.uploadedfilearray].push(response.name);
						}
					});

                    if (withPreview) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            scope.ngModel[index].preview = e.target.result;
                            scope.$apply();
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
        }
    };
	
    fileUploadDir.$inject = injectParams;

    app.directive('fileUpload', fileUploadDir);

});