let imageController = ({AWS, fs}) => {
    const formidable = require('formidable');
    const path = require('path');

    const uploadFilesToS3 = function (files) {
        return new Promise((resolve, reject) => {
            let s3= new AWS.S3();
            let erroredImages = [];
            let uploadedImages = [];
            files.forEach((file) => {
                var fileStream = fs.createReadStream(file.path);
                fileStream.on('error', function(err) {
                    if (err) {
                        reject(err);
                    }
                });

                fileStream.on('open', function() {
                    s3.putObject({
                        Bucket: 'akarimages',
                        Key: 'images/' + file.name,
                        Body: fileStream,
                        ACL: 'public-read'
                    }, function(err, result) {
                        if (err) {
                            erroredImages.push(file);
                        } else {
                            uploadedImages.push(file.name);
                            fs.unlink(file.path, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                        if(files.length === (erroredImages.length + uploadedImages.length)) {
                            resolve({erroredImages, uploadedImages});
                        }
                    });
                });
            });
        });
    };

    const uploadImages = (req, res) => {
        new Promise((resolve, reject) => {
            let form = new formidable.IncomingForm(),
                files = [],
                filePath;

            form.multiples = true;
            form.keepExtensions = true;
            form.uploadDir = path.join(__dirname, '../client/static');

            form
                .on('file', function (field, file) {
                    let fileName = new Date().getTime() + Math.random()*100 + '_' + file.name;
                    file.name = fileName;
                    filePath = path.join(form.uploadDir, fileName);
                    file.filePath = filePath;
                    files.push({name: file.name, path: file.path});
                })
                .on('end', function () {
                    resolve(files);
                })
                .on('error', function () {
                    reject(err);
                });

            form.parse(req);
        })
            .then((result) => {
                uploadFilesToS3(result)
                    .then((result) => {
                        res.send({status: true, erroredImages: result.erroredImages, uploadedImages: result.uploadedImages});
                    })
                    .catch((err) => {
                        res.status(500).send({status: false, error: err});
                    });
            })
            .catch((err) => {
                res.status(500).send({status: false, error: err});
            });
    };

    const fetchImages = (req, res) => {
        let files = [];
        let s3 = new AWS.S3();
        let params = {
            Bucket: "akarimages"
        };
        
        s3.listObjects(params, function(err, data) {
            if (err) {
                res.status(500).send({status: false, error: err, message: err.message || 'Something went wrong'})
            } else {
                if(data) {
                    data.Contents.sort((a,b) => {
                        return (new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime())
                    });
                    data.Contents.pop();
                    data.Contents.forEach((img, i) => {
                        files.push(img.Key);
                    });
                }
                res.send({status: true, files});
            }

        });
    };

    return {
        uploadImages,
        fetchImages
    }
};

module.exports = imageController;