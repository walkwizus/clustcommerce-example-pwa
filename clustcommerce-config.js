const axios = require('axios');

module.exports.config = {
    modules: [
        "clustcommerce-source-magento2"
    ],
    server: {
        port: 3334,
        index: './build/index.html'
    },
    source_magento: {
        base_url: 'http://demo.magento.local',
        username: 'admin',
        password: 'pwd',
        websites: [{
            store_view_code: 'store_code',
            base_url: 'http://localhost:3334'
        }]
    }
}

module.exports.init = function(utils, config) {
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