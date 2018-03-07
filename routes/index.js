let router = (packages) => {
    let imageManagementRouter = packages.express.Router();
    let imageManagementController = require('../controllers/imageController')(packages);

    imageManagementRouter.route('/upload/image')
        .post(imageManagementController.uploadImages);

    imageManagementRouter.route('/all/images')
        .get(imageManagementController.fetchImages);

    packages.app.use(imageManagementRouter);
};

module.exports = router;