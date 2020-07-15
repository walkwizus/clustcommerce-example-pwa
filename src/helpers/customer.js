import cache from "../tools/cache";
import customerHelper from "./customer"

export default {
  getCurrentCustomer: () => {
    return cache.get('CLUST_CUSTOMER');
  },
  logout: () => {
    cache.remove('CLUST_CUSTOMER');
  },
  login: (username, password) => {
    const url = '/__internal/source-magento2/login';

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('accept', 'application/json');
    myHeaders.append('content-type', 'application/json');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'post',
        headers: myHeaders,
        body: JSON.stringify({
          'username': username,
          'password': password
        })
      }).then(function (response) {
        return response.json();
      }).then(function(data) {
        if (data.error) {
          reject(data.error)
          return;
        }

        cache.set('CLUST_CUSTOMER', data)
        resolve(data);
      });
    });
  },
  getOrders: () => {
    const url = '/__internal/source-magento2/account/orders';
    const customerToken = customerHelper.getCurrentCustomer().customerToken;

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('x-clustcommerce-magento-customer-token', customerToken);
    myHeaders.append('accept', 'application/json');
    myHeaders.append('content-type', 'application/json');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'get',
        headers: myHeaders
      }).then(function (response) {
        return response.json();
      }).then(function(data) {
        if (data.error) {
          reject(data.error)
          return;
        }

        resolve(data.items);
      });
    });
  },
  register: (firstname, lastname, email, password) => {
    const url = '/__internal/source-magento2/register';

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('accept', 'application/json');
    myHeaders.append('content-type', 'application/json');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'post',
        headers: myHeaders,
        body: JSON.stringify({
          'customer': {
            'firstname': firstname,
            'lastname': lastname,
            'email': email
          },
          'password': password
        })
      }).then(function (response) {
        return response.json();
      }).then(function(data) {
        if (data.error) {
          reject(data.error)
          return;
        }
        
        cache.set('CLUST_CUSTOMER', data)
        resolve(data);
      });
    });
  },
  update: (customer) => {
    const customerToken = customerHelper.getCurrentCustomer().customerToken;

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('x-clustcommerce-magento-customer-token', customerToken);
    myHeaders.append('accept', 'application/json');
    myHeaders.append('content-type', 'application/json');

    return new Promise((resolve, reject) => {
      fetch("/__internal/source-magento2/account/update", {
        method: 'post',
        headers: myHeaders,
        body: JSON.stringify({customer: customer})
      }).then(function (response) {
        return response.json();
      }).then(function(data) {
        if (data.error) {
          reject(data.error)
          return;
        }

        cache.set('CLUST_CUSTOMER', data)
        resolve(data);
      });
    });
  },
  updatePassword: (passwords) => {
    const customerToken = customerHelper.getCurrentCustomer().customerToken;

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('x-clustcommerce-magento-customer-token', customerToken);
    myHeaders.append('accept', 'application/json');
    myHeaders.append('content-type', 'application/json');

    return new Promise((resolve, reject) => {
      fetch("/__internal/source-magento2/account/update-password", {
        method: 'post',
        headers: myHeaders,
        body: JSON.stringify(passwords)
      }).then(function (response) {
        return response.json();
      }).then(function(data) {
        if (data.error) {
          reject(data.error)
          return;
        }

        cache.set('CLUST_CUSTOMER', data)
        resolve(data);
      });
    });
  }
}