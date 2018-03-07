angular.module('myApp').directive('imageDirective', [function () {
    return {
        controller: ['$scope', '$ImageFactory', function($scope, $ImageFactory) {
            $scope.allImages = [];
            $scope.showCarousel = false;
            $scope.activeCarouselImage = 0;
            $scope.initialImageUrl = 'https://s3.ap-south-1.amazonaws.com/akarimages/';
            $scope.uploadLabelText = "Upload Images";
            $scope.isFetching = true;

            $ImageFactory.getAllImages()
                .then(function(data) {
                    $scope.isFetching = false;
                    if(data.status) {
                        $scope.allImages = data.files;
                    } else {
                        alert('Something went wrong.');
                        console.log(data);
                    }
                })
                .catch(function (err) {
                    $scope.isFetching = false;
                    alert("Something went wrong");
                    console.log(err);
                });
            $scope.isUploading = false;

            this.upload=function(files){
                $scope.isUploading = true;
                $scope.uploadLabelText = "Uploading " + files.length + (files.length > 1 ? " images" : " image") + " ...";
                var formdata = new FormData();
                angular.forEach(files, function (value, key) {
                    formdata.append(key, value);
                });
                $ImageFactory.uploadImages(formdata)
                    .then(function(data) {
                        if(data.status) {
                            let alertMessage = '';
                            $scope.isUploading = false;
                            $scope.uploadLabelText = "Upload Images";
                            if(data.status && data.uploadedImages.length) {
                                alertMessage += data.uploadedImages.length + ' image(s) uploaded successfully.';
                                data.uploadedImages.forEach((image) => {
                                    $scope.allImages.unshift('images/' + image);
                                });
                            }

                            if(data.erroredImages.length) {
                                alertMessage += ' ' + data.erroredImages.length + ' image(s) failed to upload.';
                            }
                            alert(alertMessage);
                        } else {
                            alert("Something went wrong");
                            console.log(data);
                        }
                    })
                    .catch(function (err) {
                        alert("Something went wrong");
                        console.log(err);
                    });
            };

            $scope.showCarousel = function (index) {
                $scope.isShowCarousel = true;
                $scope.activeCarouselImage = index;
            };

            $scope.hideCarousel = function () {
                if($(event.target).hasClass('overlay')) {
                    $scope.isShowCarousel = false;
                }
            }
        }],
        templateUrl: '/templates/imageDirectiveTemplate.html'
    }
} ]);