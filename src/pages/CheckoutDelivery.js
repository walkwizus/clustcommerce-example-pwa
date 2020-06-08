import React from "react";
import {
  Link
} from "react-router-dom";
import { connect } from 'react-redux'
import cartHelper from '../helpers/cart';
import OrderNavigation from '../components/OrderNavigation';
import OrderSummary from '../components/OrderSummary';

class CheckoutDelivery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shippingMethods: []
    };
  }

  componentDidMount() {
    cartHelper.getShippingMethods(cartHelper.getAddress()).then((methods) => {
      this.setState({shippingMethods: methods});

      console.log(methods);
    })
  }

  render() {
    return <div id="content">
      <div className="container">
        <div className="col-md-12">
          <ul className="breadcrumb">
            <li><Link to={"/"}>Home</Link></li>
            <li><Link to={"/cart"}>Cart</Link></li>
            <li>Checkout - Delivery</li>
          </ul>
        </div>
        <div className="col-md-9" id="checkout">
          <div className="box">
            <h1>Checkout</h1>
            <OrderNavigation index={2}/>

            <div className="content">
              <div className="row">
                {this.state.shippingMethods.map((shippingMethod) => {
                  return (<div className="col-sm-6">
                    <div className="box shipping-method">

                      <h4>{shippingMethod.carrier_title}</h4>
                      <p>Price : {shippingMethod.price_incl_tax} {this.props.config.currency_symbol}</p>

                      <div className="box-footer text-center">
                        <input
                          type="radio"
                          name="shipping_carrier_code"
                          value={shippingMethod.carrier_code}
                          required
                        />
                      </div>
                    </div>
                  </div>)
                })}
              </div>
            </div>

            <div className="box-footer">
              <div className="pull-left">
                <a href="/checkout" className="btn btn-default"><i className="fa fa-chevron-left"></i>Back to Addresses</a>
              </div>
              <div className="pull-right">
                <button type="submit" className="btn btn-primary">Continue to Payment Method<i
                  className="fa fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <OrderSummary/>
        </div>
      </div>
    </div>
  }
}

export default connect(
  (state) => { return {config: state.app.config ? state.app.config : {}} }
)(CheckoutDelivery)