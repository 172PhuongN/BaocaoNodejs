const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let productSchema = require('../models/products')
let BuildQueies = require('../Utils/BuildQuery')
let Category = require('../models/categories'); // Đảm bảo đường dẫn đúng

//http://localhost:3000/products?name=iph&price[$gte]=1600&price[$lte]=3000
/* GET users listing. */
router.get('/', async function(req, res, next) {
  let queries = req.query;
  let products = await productSchema.find(BuildQueies.QueryProduct(queries)).populate("categoryID");
  res.send(products);
});
router.get('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    res.status(200).send({
      success:true,
      data:product
    });
  } catch (error) {
    res.status(404).send({
      success:fail,
      message:error.message
    })
  }
});
router.post('/', async function(req, res, next) {
  let body = req.body;
  console.log(body);
  let newProduct = new productSchema({
    productName: body.productName,
    price: body.price,
    quantity: body.quantity,
    categoryID: body.categoryID 
  });
  await newProduct.save();
  res.status(201).send(newProduct); 
});
router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let product = await productSchema.findByIdAndUpdate(req.params.id,
      body,{new:true});
    res.status(200).send({
      success:true,
      data:product
    });
  } catch (error) {
    res.status(404).send({
      success:fail,
      message:error.message
    })
  }
  // let body = req.body;
  // console.log(body);
  // let newProduct = new productSchema({
  //   productName: body.productName,
  //   price: body.price,
  //   quantity: body.quantity,
  //   categoryID: body.category
  // })
  // await newProduct.save()
  // res.send(newProduct);
});
// Xóa sản phẩm theo ID
router.delete('/:id', async function(req, res, next) {
  try {
    const productId = req.params.id;
    const deletedProduct = await productSchema.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
