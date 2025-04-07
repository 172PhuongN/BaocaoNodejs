var express = require('express');
var router = express.Router();
let categorySchema = require('../models/categories'); // Import đúng schema

// Lấy tất cả danh mục
router.get('/', async function(req, res, next) {
  try {
    let categories = await categorySchema.find({});
    res.send(categories);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Lấy danh mục theo ID
router.get('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ success: false, message: 'Category not found' });
    }
    res.status(200).send({ success: true, data: category });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Thêm mới danh mục
router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let newCategory = new categorySchema({
      categoryName: body.categoryName,
      description: body.description || '' // Thêm description nếu có
    });
    await newCategory.save();
    res.status(201).send(newCategory);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Cập nhật danh mục theo ID
router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let category = await categorySchema.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

// Xóa danh mục theo ID
router.delete('/:id', async function(req, res, next) {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await categorySchema.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
