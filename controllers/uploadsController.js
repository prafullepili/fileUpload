const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');



const uploadProductImage = async (req, res) => {
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

module.exports = {
    uploadProductImage
}
