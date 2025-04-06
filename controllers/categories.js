let productsSchema = require('../models/products');
let categoriesSchema = require('../models/categories');
let jwt = require('jsonwebtoken')
let constants = require('../Utils/constants')

module.exports = {
    createCategories : async function (categoryName,description){
        let newCate = new categoriesSchema({
            categoryName: categoryName,
            description:description,
        });
        await newCate.save();    
        return newCate;  
    }
}