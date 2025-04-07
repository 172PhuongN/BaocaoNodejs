// controllers/wishlistController.js
const Wishlist = require('../models/wishlist');
const Product = require('../models/products');

module.exports = {
    addToWishlist: async (userId, productId) => {
        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [productId] });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            }
        }
        return await wishlist.save();
    },

    getWishlist: async (userId) => {
        return await Wishlist.findOne({ userId }).populate('products');
    },

    removeFromWishlist: async (userId, productId) => {
        const wishlist = await Wishlist.findOne({ userId });
        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
            return await wishlist.save();
        }
        throw new Error("Wishlist not found");
    }
};