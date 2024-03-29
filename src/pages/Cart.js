import React from "react";
import {
  Link
} from "react-router-dom";
import { connect } from 'react-redux'

class Cart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.config || !this.props.config.base_currency_code) {
      return '';
    }

    return <div id="content">
      <div className="container">
        <div className="col-md-12">
          <ul className="breadcrumb">
            <li><Link to={"/"}>Home</Link></li>
            <li>Cart</li>
          </ul>
        </div>
        <div className="col-md-12" id={"basket"}>
          <div className="box">
            <h1>Shopping Cart</h1>
            <p className="text-muted">You currently have {this.props.cart.items.length} item(s) in your cart.</p>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th colSpan="2">Product</th>
                    <th>Quantity</th>
                    <th>Unit price</th>
                    <th>Discount</th>
                    <th colSpan="2">Total</th>
                  </tr>
                </thead>
                <tbody>
                {this.props.cart.items.map((item) => {
                  return (<tr key={item.sku}>
                    <td>
                      <Link to={"/" + item.product.urlKey}>
                        <img src={item.product.image} alt={item.product.name} />
                      </Link>
                    </td>
                    <td><Link to={"/" + item.product.urlKey}>{item.product.name}</Link></td>
                    <td>
                      <input type="number" value={item.qty} className="form-control"/>
                    </td>
                    <td>{item.price_incl_tax.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.props.config.base_currency_code})}</td>
                    <td>{item.discount_amount.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.props.config.base_currency_code})}</td>
                    <td>{item.base_row_total_incl_tax.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.props.config.base_currency_code})}</td>
                    <td><a href="#"><i className="fa fa-trash-o"></i></a>
                    </td>
                  </tr>)
                })}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="5">Total</th>
                    <th colSpan="2">{this.props.cart.grand_total ? this.props.cart.grand_total.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.props.config.base_currency_code}) : '-'}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="box-footer">
              <div className="pull-right">
                <button className="btn btn-default"><i className="fa fa-refresh"></i> Update basket</button>
                <Link to={"/checkout"} className="btn btn-primary">Proceed to checkout <i className="fa fa-chevron-right"></i></Link>
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
    config: state.app.config ? state.app.config : {},
    cart: state.app.cart
  } }
)(Cart);