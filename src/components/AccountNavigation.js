import React from "react";
import {
  Link,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux'
import customerHelper from "../helpers/customer";
import {customerUpdated} from "../redux/actions";

class AccountNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      active: props.active
    }
  }

  logout() {
    this.setState({redirect: "/"});
    customerHelper.logout();
    this.props.doLogout();
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect}/>
    }

    return <div className="panel panel-default sidebar-menu">
      <div className="panel-heading">
        <h3 className="panel-title">Navigation</h3>
      </div>

      <div className="panel-body">

        <ul className="nav nav-pills nav-stacked">
          <li className={this.state.active === "orders" ? "active" : ""}>
            <Link to={"/account/orders"}><i className="fa fa-list"></i> My orders</Link>
          </li>
          <li className={this.state.active === "account" ? "active" : ""}>
            <Link to={"/account"}><i className="fa fa-user"></i> My account</Link>
          </li>
          <li>
            <a href="" onClick={this.logout.bind(this)}><i className="fa fa-sign-out"></i> Logout</a>
          </li>
        </ul>
      </div>

    </div>
  }
}

export default connect(() => {},
  (dispatch) => {
    return { doLogout: () => { dispatch(customerUpdated()) } }
  }
)(AccountNavigation)