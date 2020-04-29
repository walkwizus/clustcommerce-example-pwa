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
        password: 'pwd'
    }
}

module.exports.init = function(utils, config) {

}