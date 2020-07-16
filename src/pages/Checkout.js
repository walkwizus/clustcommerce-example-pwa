import React from "react";
import {
  Link,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux'
import cartHelper from '../helpers/cart';
import OrderNavigation from '../components/OrderNavigation';
import OrderSummary from '../components/OrderSummary';

class Checkout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      address: {
        firstname: null,
        lastname: null,
        company: null,
        street: null,
        postcode: null,
        country_id: null,
        region_id: null,
        telephone: null,
        email: null
      },
      errors: {
        firstname: '',
        lastname: '',
        company: '',
        street: '',
        postcode: '',
        country_id: '',
        region_id: '',
        telephone: '',
        email: ''
      },
      availableRegions: [],
    }
  }

  componentDidMount() {
    this.prefillAddress(this.props);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.prefillAddress(nextProps);
  }

  prefillAddress(props) {
    let state = this.state;

    let address = cartHelper.getAddress()
    if (address) {
      state = {address: address};
    }

    if (state.address.country_id === null && props.config.allowed_countries && props.config.allowed_countries.length > 0) {
      state.address = {...state.address, country_id: props.config.allowed_countries[0].id}
      state.availableRegions = props.config.allowed_countries[0].available_regions
    } else if (state.address.country_id && props.config.allowed_countries && props.config.allowed_countries.length > 0) {
      props.config.allowed_countries.forEach((country) => {
        if (country.id === state.address.country_id) {
          state.availableRegions = country.available_regions;
        }
      })
    }

    this.setState(state);
  }

  updateCountry(e) {
    let availableRegions = [];

    for (const country_id of this.props.config.allowed_countries) {
      if (country_id.id === e.target.value) {
        availableRegions = country_id.available_regions;
        break;
      }
    }

    this.setState({
      address: {...this.state.address, country_id: e.target.value, region_id: ''},
      availableRegions: availableRegions
    });
  }

  updateField(field, value) {
    this.setState({
      address: {...this.state.address, [field]: value},
      errors: {...this.state.errors, [field]: ''},
    });
  }

  nextStep() {
    var self = this;
    var errors = this.state.errors;
    let hasError = false;
    ['firstname', 'lastname', 'street', 'postcode', 'country_id', 'city', 'region_id', 'email', 'telephone'].forEach((field) => {
      if (!self.state.address[field]) {
        errors[field] = 'This field is mandatory'
        hasError = true;
      }
    });

    cartHelper.setAddress(this.state.address);

    self.setState({errors: errors});

    if (!hasError) {
      this.setState({'redirect': '/checkout-shipping'});
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    let regionField = <input
      type="text"
      className="form-control"
      id="region_id"
      name="region_id"
      required
      value={this.state.address.region_id}
      onChange={(e) => {this.updateField('region_id', e.target.value)}}
    />

    if (this.state.availableRegions.length > 0) {
      regionField = <select className="form-control" id="region_id" name="region_id_id" required onChange={(e) => {
        this.setState({address: {...this.state.address, region_id: e.target.value}, errors: {...this.state.errors, region_id: ''}})
      }}>
        <option key={"NONE"} value={""}>---</option>
        {this.state.availableRegions.map((region) => {
          return <option value={region.id} key={region.id} selected={this.state.address.region_id === region.id}>{region.name}</option>
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
                  <div className={this.state.errors.firstname ? "form-group has-error" : "form-group"}>
                    <label htmlFor="firstname">Firstname *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstname"
                      name="firstname"
                      required
                      value={this.state.address.firstname}
                      onChange={(e) => {this.updateField('firstname', e.target.value)}}
                    />
                    {this.state.errors.firstname ? <span className={"help-block"}>{this.state.errors.firstname}</span> : ''}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className={this.state.errors.lastname ? "form-group has-error" : "form-group"}>
                    <label htmlFor="lastname">Lastname *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastname"
                      name="lastname"
                      required
                      value={this.state.address.lastname}
                      onChange={(e) => {this.updateField('lastname', e.target.value)}}
                    />
                    {this.state.errors.lastname ? <span className={"help-block"}>{this.state.errors.lastname}</span> : ''}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className={this.state.errors.company ? "form-group has-error" : "form-group"}>
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      name="company"
                      value={this.state.address.company}
                      onChange={(e) => {this.updateField('company', e.target.value)}}
                    />
                    {this.state.errors.company ? <span className={"help-block"}>{this.state.errors.company}</span> : ''}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className={this.state.errors.street ? "form-group has-error" : "form-group"}>
                    <label htmlFor="street">Street *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      name="street[]"
                      required
                      value={this.state.address.street}
                      onChange={(e) => {this.updateField('street', e.target.value)}}
                    />
                    {this.state.errors.street ? <span className={"help-block"}>{this.state.errors.street}</span> : ''}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-3">
                  <div className={this.state.errors.city ? "form-group has-error" : "form-group"}>
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      required
                      value={this.state.address.city}
                      onChange={(e) => {this.updateField('city', e.target.value)}}
                    />
                    {this.state.errors.city ? <span className={"help-block"}>{this.state.errors.city}</span> : ''}
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className={this.state.errors.postcode ? "form-group has-error" : "form-group"}>
                    <label htmlFor="zip">ZIP *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip"
                      name="postcode"
                      required
                      value={this.state.address.postcode}
                      onChange={(e) => {this.updateField('postcode', e.target.value)}}
                    />
                    {this.state.errors.postcode ? <span className={"help-block"}>{this.state.errors.postcode}</span> : ''}
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className={this.state.errors.country_id ? "form-group has-error" : "form-group"}>
                    <label htmlFor="country_id">Country *</label>
                    <select className="form-control" id="country_id" name="country_id" required onChange={(e) => {this.updateCountry(e)}}>
                      <option key={"NONE"} value={""}>---</option>
                      {this.props.config.allowed_countries ? this.props.config.allowed_countries.map((country_id) => {
                        return <option value={country_id.id} key={country_id.id} selected={this.state.address.country_id === country_id.id}>{country_id.full_name_locale}</option>
                      }) : ''}
                    </select>
                    {this.state.errors.country_id ? <span className={"help-block"}>{this.state.errors.country_id}</span> : ''}
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className={this.state.errors.region_id ? "form-group has-error" : "form-group"}>
                    <label htmlFor="region_id">State *</label>
                    { regionField }
                    {this.state.errors.region_id ? <span className={"help-block"}>{this.state.errors.region_id}</span> : ''}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className={this.state.errors.telephone ? "form-group has-error" : "form-group"}>
                    <label htmlFor="telephone">Telephone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="telephone"
                      name="telephone"
                      value={this.state.address.telephone}
                      onChange={(e) => {this.updateField('telephone', e.target.value)}}
                    />
                    {this.state.errors.telephone ? <span className={"help-block"}>{this.state.errors.telephone}</span> : ''}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className={this.state.errors.email ? "form-group has-error" : "form-group"}>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      required
                      value={this.state.address.email}
                      onChange={(e) => {this.updateField('email', e.target.value)}} />
                    {this.state.errors.email ? <span className={"help-block"}>{this.state.errors.email}</span> : ''}
                  </div>
                </div>
              </div>
            </div>
            <div className="box-footer">
              <div className="pull-left">
                <Link to={"/cart"} className="btn btn-default"><i className="fa fa-chevron-left"></i>Back to cart</Link>
              </div>
              <div className="pull-right">
                <button type="submit" className="btn btn-primary" onClick={this.nextStep.bind(this)}>Continue to Delivery Method<i
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
  (region_id) => { return {config: region_id.app.config ? region_id.app.config : {}} }
)(Checkout)