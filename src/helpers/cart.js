import cache from "../tools/cache";
import customerHelper from "./customer"

let helper = {
  getCart: () => {
    let cart = cache.get('CLUST_CART');

    if (cart === null) {
      cart = {
        cartToken: null,
        items: []
      }

      cache.set('CLUST_CART', cart);
    }

    return cart;
  },
  addProductToCart: (sku, qty) => {
    const cart = helper.getCart();
    const customer = customerHelper.getCurrentCustomer()
    const customerToken = customer !== null ? customer.authToken : '';

    const url = cart.cartToken !== null && cart.cartToken !== undefined
      ? '/__internal/source-magento2/add-to-cart?cartToken=' + cart.cartToken + '&customerToken=' + customerToken
      : '/__internal/source-magento2/add-to-cart?customerToken=' + customerToken

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('accept', 'application/json');
    myHeaders.append('content-type', 'application/json');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'post',
        headers: myHeaders,
        body: JSON.stringify({sku: sku, qty: qty})
      }).then(function(response) {
        console.log('ok');
        return response.json();
      }).then(function(data) {
        console.log('ok2');

        if (!data.error) {
          cache.set('CLUST_CART', data.cart);
          resolve();
        } else {
          reject(data.error);
        }
      });
    });
  }
}

export default helper;