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
  setCart: (cart) => {
    cache.set('CLUST_CART', cart);
  },
  setAddress: (address) => {
    cache.set('CLUST_CHECKOUT_ADDRESS', address);
  },
  getAddress: () => {
    return cache.get('CLUST_CHECKOUT_ADDRESS');
  },
  getLastOrder: () => {
    return cache.get('CLUST_LAST_ORDER');
  },
  addProductToCart: (sku, qty, productOptions) => {
    const cart = helper.getCart();
    const customer = customerHelper.getCurrentCustomer()
    const customerToken = customer !== null ? customer.customerToken : '';

    const url = cart.cartToken !== null && cart.cartToken !== undefined
      ? '/__internal/source-magento2/add-to-cart?cartToken=' + cart.cartToken
      : '/__internal/source-magento2/add-to-cart'

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('x-clustcommerce-magento-customer-token', customerToken);
    myHeaders.append('accept', 'application/json');
    myHeaders.append('content-type', 'application/json');

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'post',
        headers: myHeaders,
        body: JSON.stringify({sku: sku, qty: qty, product_option: {extension_attributes: productOptions}})
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
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
    const customerToken = customer !== null ? customer.customerToken : '';

    const url = cart.cartToken !== null && cart.cartToken !== undefined
      ? '/__internal/source-magento2/shipping-methods?cartToken=' + cart.cartToken
      : '/__internal/source-magento2/shipping-methods'

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('x-clustcommerce-magento-customer-token', customerToken);
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
    const customerToken = customer !== null ? customer.customerToken : '';

    const url = cart.cartToken !== null && cart.cartToken !== undefined
      ? '/__internal/source-magento2/shipping-information?cartToken=' + cart.cartToken
      : '/__internal/source-magento2/shipping-information'

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('x-clustcommerce-magento-customer-token', customerToken);
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
        data.cart.shipping = {
          methodCode: shippingMethodCode,
          carrierCode: shippingCarrierCode
        }

        data.cart.paymentMethods = data.paymentMethods

        cache.set('CLUST_CART', data.cart);

        resolve();
      });
    });
  },
  placeOrder: (paymentMethod) => {
    const cart = helper.getCart();
    const customer = customerHelper.getCurrentCustomer()
    const customerToken = customer !== null ? customer.customerToken : '';

    const url = cart.cartToken !== null && cart.cartToken !== undefined
      ? '/__internal/source-magento2/place-order?cartToken=' + cart.cartToken
      : '/__internal/source-magento2/place-order'

    var myHeaders = new Headers();
    myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
    myHeaders.append('x-clustcommerce-magento-customer-token', customerToken);
    myHeaders.append('accept', 'application/json');
    myHeaders.append('content-type', 'application/json');

    let addr = {...helper.getAddress()}
    addr.street = [addr.street];

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'post',
        headers: myHeaders,
        body: JSON.stringify({
          email: addr.email,
          paymentMethod: {method: paymentMethod},
          billingAddress: addr
        })
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        cache.remove('CLUST_CART');
        cache.remove('CLUST_CHECKOUT_ADDRESS');
        cache.set('CLUST_LAST_ORDER', data)

        resolve();
      });
    });
  }
}

export default helper;