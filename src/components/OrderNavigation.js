import React from "react";
import {
  Link
} from "react-router-dom";

export default class OrderNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.index
    }
  }

  render() {
    return <ul className="nav nav-pills nav-justified">
      <li className={this.state.index === 1 ? 'active' : ''}><Link to={"/checkout"}><i className="fa fa-map-marker"></i><br/>Address</Link></li>
      <li className={(this.state.index === 2 ? 'active' : (this.state.index < 2 ? 'disabled' : ''))}><Link to={"/checkout-shipping"}><i className="fa fa-truck"></i><br/>Delivery Method</Link></li>
      <li className={(this.state.index === 3 ? 'active' : (this.state.index < 3 ? 'disabled' : ''))}><Link to={"/checkout-payment"}><i className="fa fa-truck"></i><br/>Payment Method</Link></li>
      <li className={(this.state.index === 4 ? 'active' : (this.state.index < 4 ? 'disabled' : ''))}><Link to={"/checkout-summary"}><i className="fa fa-truck"></i><br/>Summary</Link></li>
    </ul>
  }
}