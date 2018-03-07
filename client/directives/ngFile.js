angular.module('myApp').directive('ngFiles', ['$ImageFactory', function ($ImageFactory) {
    return {
        require: '^^imageDirective',
        link: function(scope, element, attrs, controller) {
            element.on('change', function (event) {
                if(!scope.isUploading) {
                    var files = event.target.files;
                    var filesToUpload;
                    var validMimeTypes = attrs.fileDropzone;

                    filesToUpload = $ImageFactory.validImagesToUpload(files, validMimeTypes, attrs.maxFileSize);

                    $(event.target).val("");
                    if(filesToUpload.length) {
                        controller.upload(filesToUpload);
                    }
                }
            });
        }
    }
}])