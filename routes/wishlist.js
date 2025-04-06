// routes/wishlist.js
const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');

// Thêm sản phẩm vào danh sách yêu thích
router.post('/', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [productId] });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            }
        }

        const savedWishlist = await wishlist.save();
        res.status(201).json(savedWishlist);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.get('/:userId', async (req, res) => {
    try {
        console.log(`Fetching wishlist for userId: ${req.params.userId}`);
        const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate('products');
        
        if (!wishlist) {
            console.log("Wishlist not found");
            return res.status(404).json({ message: 'Danh sách yêu thích không tồn tại.' });
        }
        
        res.status(200).json(wishlist);
    } catch (err) {
        console.error("Error fetching wishlist:", err);
        res.status(500).json(err);
    }
});
// Xóa sản phẩm khỏi danh sách yêu thích
router.delete('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const wishlist = await Wishlist.findOne({ userId });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
            await wishlist.save();
            res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi danh sách yêu thích.' });
        } else {
            res.status(404).json({ message: 'Danh sách yêu thích không tồn tại.' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;