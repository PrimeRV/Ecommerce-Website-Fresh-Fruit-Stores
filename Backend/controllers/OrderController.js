const OrderModel = require('../Model/Order');

const createOrder = async (req, res) => {
    try {
        console.log('Create order request received');
        console.log('Request body:', req.body);
        console.log('User from token:', req.user);
        
        const { items, totalAmount, userDetails } = req.body;
        const userId = req.user._id;
        
        console.log('Extracted data:', { items, totalAmount, userDetails, userId });
        
        const orderId = 'ORD' + Date.now();
        
        const order = new OrderModel({
            userId,
            orderId,
            items,
            totalAmount,
            userDetails
        });
        
        console.log('Order object created:', order);
        
        await order.save();
        
        console.log('Order saved successfully');
        
        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            orderId: order.orderId
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order',
            error: error.message
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const orders = await OrderModel.find({ userId }).sort({ orderDate: -1 });
        
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;
        
        const order = await OrderModel.findOne({ orderId, userId });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        if (order.status === 'delivered' || order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel this order'
            });
        }
        
        order.status = 'cancelled';
        await order.save();
        
        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    cancelOrder
};