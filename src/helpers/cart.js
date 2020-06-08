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
  setAddress: (address) => {
    cache.set('CLUST_CHECKOUT_ADDRESS', address);
  },
  getAddress() {
    return cache.get('CLUST_CHECKOUT_ADDRESS');
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
        return response.json();
      }).then(function(data) {
        cache.set('CLUST_CART', data.cart);

        if (!data.error) {
          cache.set('CLUST_CART', data.cart);
          resolve();
        } else {
          reject(data.error);
        }
      });
    });
  },
  getShippingMethods: (address) => {
    const cart = helper.getCart();
    const customer = customerHelper.getCurrentCustomer()
    const customerToken = customer !== null ? customer.authToken : '';

    const url = cart.cartToken !== null && cart.cartToken !== undefined
      ? '/__internal/source-magento2/shipping-methods?cartToken=' + cart.cartToken + '&customerToken=' + customerToken
      : '/__internal/source-magento2/shipping-methods?customerToken=' + customerToken

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('accept', 'application/json');
    myHeaders.append('content-type', 'application/json');

    let addr = {...address}
    addr.street = [addr.street];

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'post',
        headers: myHeaders,
        body: JSON.stringify(addr)
      }).then(function (response) {
        resolve(response.json());
      });
    });
  },
  setShippingInformations: (address, shippingMethodCode, shippingCarrierCode) => {
    const cart = helper.getCart();
    const customer = customerHelper.getCurrentCustomer()
    const customerToken = customer !== null ? customer.authToken : '';

    const url = cart.cartToken !== null && cart.cartToken !== undefined
      ? '/__internal/source-magento2/shipping-information?cartToken=' + cart.cartToken + '&customerToken=' + customerToken
      : '/__internal/source-magento2/shipping-information?customerToken=' + customerToken

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('accept', 'application/json');
    myHeaders.append('content-type', 'application/json');

    let addr = {...address}
    addr.street = [addr.street];

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'post',
        headers: myHeaders,
        body: JSON.stringify({
          shipping_address: addr,
          billing_address: addr,
          shipping_method_code: shippingMethodCode,
          shipping_carrier_code: shippingCarrierCode
        })
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        cache.set('CLUST_CART', data.cart);

        resolve();
      });
    });
  }
}

export default helper;