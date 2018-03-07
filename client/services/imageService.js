angular.module('myApp').service('$ImageFactory', ['$http', '$q', function($http, $q) {
    this.checkImageSize = function(size, maxFileSize) {
        var _ref;
        if ((size / 1024) / 1024 < maxFileSize) {
            return true;
        } else {
            alert("File size must not be greater than 3MB");
            return false;
        }
    };

    this.isTypeValid = function(validMimeTypes, type) {
        if (validMimeTypes.indexOf(type) > -1) {
            return true;
        } else {
            alert("Supported file types are jpeg and png");
            return false;
        }
    };

    this.validImagesToUpload = function (images, validMimeTypes, maxFileSize) {
        var filesToUpload = [];
        var _this = this;
        Array.prototype.forEach.call(images, function(image) {
            if(_this.isTypeValid(validMimeTypes, image.type) && _this.checkImageSize(image.size, maxFileSize)) {
                filesToUpload.push(image);
            }
        });

        return filesToUpload;
    };

    this.uploadImages = function (data) {
        var deferred = $q.defer();
        var headers = {
            'content-type': undefined
        };
        var API_PATH = "/upload/image";
        return $http.post(API_PATH, data, {transformRequest: angular.identity, headers: headers})
            .then(function (response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function (response) {
                deferred.reject(response);
                return deferred.promise;
            });
    };

    this.getAllImages = function () {
        var deferred = $q.defer();
        var headers = {
            'content-type': 'application/json'
        };
        var API_PATH = "/all/images";
        return $http.get(API_PATH, headers)
            .then(function (response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function (response) {
                deferred.reject(response);
                return deferred.promise;
            });
    };
}]);