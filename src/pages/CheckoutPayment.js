import React from "react";
import {
  Link, Redirect
} from "react-router-dom";
import { connect } from 'react-redux'
import cartHelper from '../helpers/cart';
import OrderNavigation from '../components/OrderNavigation';
import OrderSummary from '../components/OrderSummary';
import {cartUpdated} from "../redux/actions";
import { trackPromise } from 'react-promise-tracker';

class CheckoutPayment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      paymentMethod: null,
      redirect: null
    };
  }

  payment() {
    trackPromise(
      cartHelper.placeOrder(this.state.paymentMethod).then(() => {
        this.props.onCartUpdated()
        this.setState({redirect: '/checkout-summary'})
      })
    );
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return <div id="content">
      <div className="container">
        <div className="col-md-12">
          <ul className="breadcrumb">
            <li><Link to={"/"}>Home</Link></li>
            <li><Link to={"/cart"}>Cart</Link></li>
            <li>Checkout - Payment</li>
          </ul>
        </div>
        <div className="col-md-9" id="checkout">
          <div className="box">
            <h1>Checkout</h1>
            <OrderNavigation index={3}/>

            <div className="content">
              <div className="row">
                {this.props.cart.paymentMethods && this.props.cart.paymentMethods.map((paymentMethod) => {
                  return (<div className="col-sm-6">
                    <div className="box shipping-method">

                      <h4>{paymentMethod.title}</h4>
                      <div className="box-footer text-center">
                        <input
                          type="radio"
                          name="payment_method"
                          required
                          onClick={(e) => {this.setState({'paymentMethod': paymentMethod.code})}}
                        />
                      </div>
                    </div>
                  </div>)
                })}
              </div>
            </div>

            <div className="box-footer">
              <div className="pull-left">
                <Link to={"/checkout-shipping"} className="btn btn-default"><i className="fa fa-chevron-left"></i>Back to delivery method</Link>
              </div>
              <div className="pull-right">
                <button className="btn btn-primary" onClick={this.payment.bind(this)}>Payment<i className="fa fa-chevron-right"></i></button>
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
  (state) => { return {
    cart: state.app.cart,
    config: state.app.config ? state.app.config : {}
  } },
  (dispatch) => {
    return { onCartUpdated: () => { dispatch(cartUpdated()) } }
  }
)(CheckoutPayment)
