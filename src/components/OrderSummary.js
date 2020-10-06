import React from "react";
import {
  Link
} from "react-router-dom";
import { connect } from 'react-redux'

class OrderSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.config || !this.props.config.base_currency_code) {
      return '';
    }

    if (this.props.cart.items.length === 0) {
      return '';
    }

    return <div className="box" id="order-summary">
      <div className="box-header">
        <h3>Order summary</h3>
      </div>
      <p className="text-muted">Shipping and additional costs are calculated based on the values you have entered.</p>
      <div className="table-responsive">
        <table className="table">
          <tbody>
          <tr>
            <td style={{width: "55%"}}>Order subtotal</td>
            <th>{this.props.cart.base_subtotal.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.props.config.base_currency_code})}</th>
          </tr>
          <tr>
            <td>Shipping and handling</td>
            <th>{this.props.cart.shipping_amount.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.props.config.base_currency_code})}</th>
          </tr>
          <tr>
            <td>Tax</td>
            <th>{this.props.cart.tax_amount.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.props.config.base_currency_code})}</th>
          </tr>
          {this.props.cart.discount_amount ?
            (<tr>
              <td>Discount</td>
              <th>{this.props.cart.discount_amount.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.props.config.base_currency_code})}</th>
            </tr>) : ''
          }
          <tr className="total">
            <td>Total</td>
            <th>{this.props.cart.grand_total.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.props.config.base_currency_code})}</th>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  }
}

export default connect(
  (state) => { return {
    config: state.app.config ? state.app.config : {},
    cart: state.app.cart
  } }
)(OrderSummary)