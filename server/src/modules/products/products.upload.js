const fs = require('fs');
const path = require('path');

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const env = require('../../config/env');
const ApiError = require('../../utils/api-error');

const productImagesDir = path.resolve(process.cwd(), env.uploadDir, 'products');

fs.mkdirSync(productImagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, productImagesDir);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase() || '.png';
    callback(null, `product-${uuidv4()}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    callback(new ApiError(400, 'Only image files are allowed'));
    return;
  }

  callback(null, true);
};

const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  productImagesDir,
  uploadProductImage,
};
