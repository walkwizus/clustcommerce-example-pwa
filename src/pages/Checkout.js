import React from "react";
import {
  Link
} from "react-router-dom";
import { connect } from 'react-redux'
import cartHelper from '../helpers/cart';
import OrderNavigation from '../components/OrderNavigation';
import OrderSummary from '../components/OrderSummary';

class Checkout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname: '',
      lastname: '',
      company: '',
      street: '',
      zipcode: '',
      country: '',
      state: '',
      phone: '',
      email: '',
      availableRegions: [],
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log(nextProps);
    if (this.state.country === '' && nextProps.config.allowed_countries && nextProps.config.allowed_countries.length > 0) {
      this.setState({
        country: nextProps.config.allowed_countries[0].id,
        availableRegions: nextProps.config.allowed_countries[0].available_regions
      });
    }
  }

  updateCountry(e) {
    let availableRegions = [];

    for (const country of this.props.config.allowed_countries) {
      if (country.id === e.target.value) {
        availableRegions = country.availableRegions;
        break;
      }
    }

    this.setState({country: e.target.value, availableRegions: availableRegions, state: ''});
  }

  render() {
    let stateField = <input
      type="text"
      className="form-control"
      id="state"
      name="region_id"
      required
      onChange={(e) => {this.setState({state: e.target.value})}}
    />

    if (this.state.availableRegions.length > 0) {
      stateField = <select className="form-control" id="state" name="state_id" required onChange={(e) => {this.setState({state: e.target.value})}}>
        {this.state.availableRegions.map((region) => {
          return <option value={region.id} key={region.id} selected={this.state.state === region.id}>{region.name}</option>
        })}
      </select>
    }

    return <div id="content">
      <div className="container">
        <div className="col-md-12">
          <ul className="breadcrumb">
            <li><Link to={"/"}>Home</Link></li>
            <li><Link to={"/cart"}>Cart</Link></li>
            <li>Checkout - Address</li>
          </ul>
        </div>
        <div className="col-md-9" id="checkout">
          <div className="box">
            <h1>Checkout</h1>
            <OrderNavigation index={1}/>

            <div className="content">
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="firstname">Firstname *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstname"
                      name="firstname"
                      required
                      value={this.state.firstname}
                      onChange={(e) => {this.setState({firstname: e.target.value})}}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="lastname">Lastname *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastname"
                      name="lastname"
                      required
                      onChange={(e) => {this.setState({lastname: e.target.value})}}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      name="company"
                      onChange={(e) => {this.setState({company: e.target.value})}}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="street">Street *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      name="street[]"
                      required
                      onChange={(e) => {this.setState({street: e.target.value})}}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label htmlFor="city">Company *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      required
                      onChange={(e) => {this.setState({city: e.target.value})}}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label htmlFor="zip">ZIP *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip"
                      name="zipcode"
                      required
                      onChange={(e) => {this.setState({zipcode: e.target.value})}}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <select className="form-control" id="country" name="country_id" required onChange={(e) => {this.updateCountry(e)}}>
                      {this.props.config.allowed_countries ? this.props.config.allowed_countries.map((country) => {
                        return <option value={country.id} key={country.id} selected={this.state.country === country.id}>{country.full_name_locale}</option>
                      }) : ''}
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    { stateField }
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="phone">Telephone</label>
                    <input type="text" className="form-control" id="phone" name="telephone" onChange={(e) => {this.setState({phone: e.target.value})}}/>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="text" className="form-control" id="email" name="email" required onChange={(e) => {this.setState({email: e.target.value})}} />
                  </div>
                </div>
              </div>
            </div>
            <div className="box-footer">
              <div className="pull-left">
                <Link to={"/cart"} className="btn btn-default"><i className="fa fa-chevron-left"></i>Back to cart</Link>
              </div>
              <div className="pull-right">
                <button type="submit" className="btn btn-primary">Continue to Delivery Method<i
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
)(Checkout)