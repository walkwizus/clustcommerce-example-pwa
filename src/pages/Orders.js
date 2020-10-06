import React from "react";
import {
  Link,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux'
import customerHelper from '../helpers/customer';
import AccountNavigation from "../components/AccountNavigation";

class Orders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: []
    }
  }

  componentDidMount() {
    let self = this
    customerHelper.getOrders().then((orders) => {
      self.setState({orders: orders})
    })
  }

  getTag(order) {
    switch(order.status) {
      case 'pending':
        return <span className="label label-info">Waiting for payment</span>
      case 'processing':
        return <span className="label label-info">Being prepared</span>
      case 'complete':
        return <span className="label label-success">Complete</span>
      case 'holded':
        return <span className="label label-warning">On hold</span>
      case 'canceled':
        return <span className="label label-danger">Canceled</span>
      case 'closed':
        return <span className="label label-danger">Closed</span>
      default:
        return <span className="label label-info">{order.status}</span>
    }
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
            <li>Orders</li>
          </ul>
        </div>

        <div className="col-md-3">
          <AccountNavigation active={"orders"}/>
        </div>

        <div class="col-md-9" id="customer-orders">
          <div class="box">
            <h1>My orders</h1>
            <p class="lead">Your orders on one place.</p>

            <hr/>

            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {this.state.orders.map((order) => {
                  return <tr>
                    <th>#{order.increment_id}</th>
                    <td>{order.created_at}</td>
                    <td>{order.grand_total.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.props.config.base_currency_code})}</td>
                    <td>{this.getTag(order)}</td>
                  </tr>
                })}
                </tbody>
              </table>
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
    customer: state.app.customer
  } }
)(Orders)