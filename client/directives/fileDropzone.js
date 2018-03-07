angular.module('myApp').directive('fileDropzone', ['$ImageFactory', function($ImageFactory) {
    return {
        restrict: 'A',
        require: '^^imageDirective',
        scope: {
            file: '=',
            fileName: '='
        },
        link: function(scope, element, attrs, controller) {
            var processDragOverOrEnter,
                validMimeTypes;

            processDragOverOrEnter = function (event) {
                if (event != null) {
                    event.preventDefault();
                }
                $(event.currentTarget).addClass('over');
                event.dataTransfer.effectAllowed = 'copy';
                return false;
            };

            validMimeTypes = attrs.fileDropzone;

            element.on('dragover', processDragOverOrEnter);
            element.on('dragenter', processDragOverOrEnter);
            element.on('dragleave', function (event) {
                if (event != null) {
                    event.preventDefault();
                }
                $(event.currentTarget).removeClass('over');
            });

            element.on('drop', function(event) {
                var files,
                    filesToUpload;

                if(!scope.isUploading) {
                    if (event != null) {
                        event.preventDefault();
                    }
                    $(event.currentTarget).removeClass('over');
                    files = event.dataTransfer.files;
                    filesToUpload = $ImageFactory.validImagesToUpload(files, validMimeTypes, attrs.maxFileSize);
                    event.dataTransfer.clearData();
                    if(filesToUpload.length) {
                        controller.upload(filesToUpload);
                    }

                }
            });
        }
    };
}]);
