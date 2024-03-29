export const CART_UPDATED = 'CART_UPDATED';
export const CONFIG_UPDATED = 'CONFIG_UPDATED';
export const CUSTOMER_UPDATED = 'CUSTOMER_UPDATED';

export function cartUpdated() {
  return {type: CART_UPDATED}
}

export function configUpdated(config) {
  return {type: CONFIG_UPDATED, config: config}
}

export function customerUpdated() {
  return {type: CUSTOMER_UPDATED}
}