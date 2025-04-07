// controllers/orderController.js
const Order = require('../models/orders');

module.exports = {
    createOrder: async (userId, products, totalAmount) => {
        const newOrder = new Order({ userId, products, totalAmount });
        return await newOrder.save();
    },

    getUserOrders: async (userId) => {
        return await Order.find({ userId });
    },

    deleteOrder: async (orderId) => {
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            throw new Error("Order not found");
        }
        return deletedOrder;
    }
};
