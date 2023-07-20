const express = require('express');
const router = express.Router()

const { createProduct, getAllProducts } = require('../controllers/productController');
const { uploadProductImageLocal,
    uploadProductImageInCloudinary } = require('../controllers/uploadsController');

router.route('/').post(createProduct).get(getAllProducts)
router.route('/uploads').post(uploadProductImageInCloudinary)


module.exports = router;