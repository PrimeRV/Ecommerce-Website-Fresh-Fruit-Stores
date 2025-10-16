const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        id: String,
        title: String,
        price: String,
        img: String,
        weight: String,
        quantity: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    userDetails: {
        name: String,
        email: String,
        phone: String,
        address: String
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'upi', 'card'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('orders', OrderSchema);