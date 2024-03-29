import cartHelper from '../helpers/cart';
import customerHelper from '../helpers/customer';
import { CART_UPDATED, CONFIG_UPDATED, CUSTOMER_UPDATED } from "./actions";
import { combineReducers } from 'redux'

const initialState = {
  cart: cartHelper.getCart(),
  customer: customerHelper.getCurrentCustomer()
}

function app(state = initialState, action) {
  switch (action.type) {
    case CART_UPDATED:
      return {...state, cart: cartHelper.getCart()}
    case CUSTOMER_UPDATED:
      return {...state, customer: customerHelper.getCurrentCustomer()}
    case CONFIG_UPDATED:
      return {...state, config: action.config}
    default:
      return state
  }
}

const mainApp = combineReducers({app});

export default mainApp