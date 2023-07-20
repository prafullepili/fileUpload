const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadProductImageLocal = async (req, res) => {
    if (!req.files) {
        throw new CustomError.BadRequestError('No File Uploaded')
    }
    const productImageObj = req.files.image;
    if (!productImageObj.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please uplaod image')
    }
    const maxSize = 1000;
    if (productImageObj.size > maxSize) {
        throw new CustomError.BadRequestError('Please upload image smaller 1KB')
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImageObj.name}`)
    await productImageObj.mv(imagePath);
    return res.status(StatusCodes.OK).json({ image: { src: `/uploads/${productImageObj.name}` } })
};

const uploadProductImageInCloudinary = async (req, res) => {
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true,
        folder: 'file-upload',
    });
    fs.unlinkSync(req.files.image.tempFilePath)
    return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
};

module.exports = {
    uploadProductImageLocal,
    uploadProductImageInCloudinary
}


// uploadImgreturn = {
//     asset_id: '56a064e8a42421f99b97432e589a6a13',
//   public_id: 'file-upload/tmp-1-1689842675620_gab5wb',
//   version: 1689842676,
//   version_id: '05c9f64f47c73eb2bd2e91c34861fef7',
//   signature: '92fbb6993619d32c383f892d0689b43f0185156f',
//   width: 1000,
//   height: 1407,
//   format: 'jpg',
//   resource_type: 'image',
//   created_at: '2023-07-20T08:44:36Z',
//   tags: [],
//   bytes: 104249,
//   type: 'upload',
//   etag: 'e80224005f893df43535c37edfe85ca0',
//   placeholder: false,
//   url: 'http://res.cloudinary.com/dplsiljc2/image/upload/v1689842676/file-upload/tmp-1-1689842675620_gab5wb.jpg',
//   secure_url: 'https://res.cloudinary.com/dplsiljc2/image/upload/v1689842676/file-upload/tmp-1-1689842675620_gab5wb.jpg',
//   folder: 'file-upload',
//   original_filename: 'tmp-1-1689842675620',
//   api_key: '536843255232282'
// }
