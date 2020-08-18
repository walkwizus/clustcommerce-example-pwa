const axios = require('axios');
require('dotenv').config()

module.exports.config = {
    modules: [
        "clustcommerce-source-magento2"
    ],
    server: {
        port: 3334,
        index: './build/index.html'
    },
    source_magento: {
        base_url: process.env.MAGENTO2_URL,
        username: process.env.MAGENTO2_USER,
        password: process.env.MAGENTO2_PWD,
        customer_session_lifetime: process.env.MAGENTO2_SESSION_LIFETIME,
        websites: [{
            store_view_code: process.env.MAGENTO2_DEFAULT_STORE_CODE,
            base_url: 'http://localhost:3334'
        }]
    }
}

module.exports.init = async function(utils, config) {
    const {app} = utils;
    app.get('/cart', function (req, res) { res.sendFile(process.cwd() +'/build/index.html'); })
    app.get('/checkout', function (req, res) { res.sendFile(process.cwd() +'/build/index.html'); })
    app.get('/checkout-shipping', function (req, res) { res.sendFile(process.cwd() +'/build/index.html'); })
    app.get('/checkout-payment', function (req, res) { res.sendFile(process.cwd() +'/build/index.html'); })
    app.get('/checkout-summary', function (req, res) { res.sendFile(process.cwd() +'/build/index.html'); })
    app.get('/login', function (req, res) { res.sendFile(process.cwd() +'/build/index.html'); })
    app.get('/account', function (req, res) { res.sendFile(process.cwd() +'/build/index.html'); })
    app.get('/account/orders', function (req, res) { res.sendFile(process.cwd() +'/build/index.html'); })
}