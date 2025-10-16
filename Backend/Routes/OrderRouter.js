const { createOrder, getUserOrders, cancelOrder } = require('../controllers/OrderController');
const ensureAuthenticated = require('../Middleware/Auth');

const router = require('express').Router();

router.post('/create', ensureAuthenticated, createOrder);
router.get('/user-orders', ensureAuthenticated, getUserOrders);
router.put('/cancel/:orderId', ensureAuthenticated, cancelOrder);

module.exports = router;