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
        base_url: 'http://m2.recommerce.local:8040',
        username: 'Jperrin',
        password: 'u69Y6;#wPf'
    }
}

module.exports.init = function(utils, config) {

}