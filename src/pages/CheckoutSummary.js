import React from "react";
import {
  Link
} from "react-router-dom";
import { connect } from 'react-redux'
import cartHelper from '../helpers/cart';
import OrderNavigation from '../components/OrderNavigation';

class CheckoutSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {order: {items: []}}
  }

  componentWillMount() {
    console.log(cartHelper.getLastOrder());
    this.setState({order: cartHelper.getLastOrder()})
    console.log(this.state.order);
  }

  render() {
    return <div id="content">
      <div className="container">
        <div className="col-md-12">
          <ul className="breadcrumb">
            <li><Link to={"/"}>Home</Link></li>
            <li><Link to={"/cart"}>Cart</Link></li>
            <li>Checkout - Summary</li>
          </ul>
        </div>
        <div className="col-md-12" id="checkout">
          <div className="box">
            <h1>Checkout</h1>
            <OrderNavigation index={4}/>

            <div className="content">
              Order #{this.state.order.increment_id}
              <div className="table-responsive">
                <table className="table">
                  <thead>
                  <tr>
                    <th colSpan="2">Product</th>
                    <th>Quantity</th>
                    <th>Unit price</th>
                    <th>Discount</th>
                    <th>Total</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.order.items.map((item) => {
                    return (<tr>
                      <td>
                        <a href="#">
                          <img src={item.product.image} />
                        </a>
                      </td>
                      <td><Link to={item.product.urlKey}>{item.product.name}</Link></td>
                      <td>{item.qty_ordered}</td>
                      <td>{item.price.toFixed(2)} {this.props.config.currency_symbol}</td>
                      <td>{item.discount_amount.toFixed(2)} {this.props.config.currency_symbol}</td>
                      <td>{item.row_total_incl_tax.toFixed(2)} {this.props.config.currency_symbol}</td>
                    </tr>)
                  })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5">Shipping and handling</td>
                      <td colSpan="2">{this.state.order.shipping_amount.toFixed(2)} {this.props.config.currency_symbol}</td>
                    </tr>
                    <tr>
                      <td colSpan="5">Tax</td>
                      <td colSpan="2">{this.state.order.tax_amount.toFixed(2)} {this.props.config.currency_symbol}</td>
                    </tr>
                    <tr>
                      <th colSpan="5">Total</th>
                      <th colSpan="2">{this.state.order.total_due.toFixed(2)} {this.props.config.currency_symbol}</th>
                    </tr>
                  </tfoot>
                </table>

              </div>
            </div>

            <div className="box-footer">
              <div className="pull-left">
                <Link to={"/"} className="btn btn-default"><i className="fa fa-chevron-left"></i>Return home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

export default connect(
  (state) => { return {
    config: state.app.config ? state.app.config : {}
  } }
)(CheckoutSummary)
