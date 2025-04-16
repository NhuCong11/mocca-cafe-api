const multer = require('multer');
const express = require('express');

const { uploadService } = require('../../services');
const { categoryController } = require('../../controllers');
const { categoryValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const upload = multer();
const categoryRouter = express.Router();

categoryRouter
  .route('/')
  .get(validate(categoryValidation.getCategories), categoryController.getCategories)
  .post(
    auth,
    authorize('admin'),
    uploadService.uploadImage.single('image'),
    validate(categoryValidation.createCateogry),
    categoryController.createCategory,
  );

categoryRouter.get(
  '/exports',
  auth,
  authorize('admin'),
  validate(categoryValidation.getCategories),
  categoryController.exportExcel,
);

categoryRouter.post(
  '/imports',
  auth,
  authorize('admin'),
  upload.single('file'),
  categoryController.importCategoriesFromExcelFile,
);

categoryRouter
  .route('/:categoryId')
  .get(validate(categoryValidation.getCategory), categoryController.getCategoryById)
  .put(
    auth,
    authorize('admin'),
    uploadService.uploadImage.single('image'),
    validate(categoryValidation.updateCategory),
    categoryController.updateCategory,
  )
  .delete(auth, authorize('admin'), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = categoryRouter;
