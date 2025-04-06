let productsSchema = require('../models/products');
let categoriesSchema = require('../models/categories');
let jwt = require('jsonwebtoken')
let constants = require('../Utils/constants')

module.exports = {
    createProducts : async function (productName,price,quantity,description,imgURL,category,isDeleted){
         let categoriesCheck = await categoriesSchema.findOne({categoryName:category});
         let salecheck = await saleSchema.findOne({saleName:sale});
                if(categoriesCheck){
                    let newProduct = new productsSchema({
                        productName: productName,
                        price: price,
                        quantity: quantity,
                        description:description,
                        imgURL:imgURL,
                        category: categoriesCheck._id,
                    });
                    await newProduct.save();    
                    return newProduct;  
                }else{    
                    throw new Error("Cate khong ton tai");
                }
    }
}