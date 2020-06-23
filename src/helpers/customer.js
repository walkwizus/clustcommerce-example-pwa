import cache from "../tools/cache";

export default {
  getCurrentCustomer: () => {
    return cache.get('CLUST_CUSTOMER');
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
  }
}