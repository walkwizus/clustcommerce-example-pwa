import React from "react";
import {
  Link,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux'
import customerHelper from '../helpers/customer';
import OrderNavigation from '../components/OrderNavigation';
import OrderSummary from '../components/OrderSummary';
import AccountNavigation from "../components/AccountNavigation";
import {customerUpdated} from "../redux/actions";

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      successMessage: '',
      password: {
        old_password: null,
        new_password: null,
        renew_password: null
      },
      passwordErrors: {
        old_password: null,
        new_password: null,
        renew_password: null
      },
      address: {
        firstname: null,
        lastname: null,
        company: null,
        street: null,
        postcode: null,
        city: null,
        country_id: null,
        region_id: null,
        telephone: null,
        email: null
      },
      errors: {
        firstname: '',
        lastname: '',
        company: '',
        city: '',
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
    if (!props.config.allowed_countries || !props.customer) {
      return;
    }

    let state = this.state;
    state.errorMessage = '';
    state.successMessage = '';

    props.customer.addresses.forEach((address) => {
      if (address.id === parseInt(props.customer.default_billing)) {
        state.address.firstname = address.firstname;
        state.address.lastname = address.lastname;
        state.address.postcode = address.postcode;
        state.address.telephone = address.telephone;
        state.address.country_id = address.country_id;
        state.address.region_id = address.region_id;
        state.address.company = address.company;
        state.address.city = address.city;
        state.address.street = address.street.join(', ');
        state.address.email = props.customer.email;
      }
    });

    props.config.allowed_countries.forEach((country) => {
      if (country.id === state.address.country_id) {
        state.availableRegions = country.available_regions;
      }
    });

    this.setState(state);
  }

  updateCountry(e) {
    let availableRegions = [];

    for (const country_id of this.props.config.allowed_countries) {
      if (country_id.id === e.target.value) {
        availableRegions = country_id.availableRegions;
        break;
      }
    }

    this.setState({
      address: {...this.state.address, country_id: e.target.value},
      availableRegions: availableRegions, region_id: ''
    });
  }

  updateFieldPassword(field, value) {
    this.setState({
      successMessage: '',
      errorMessage: '',
      password: {...this.state.password, [field]: value},
      passwordErrors: {...this.state.passwordErrors, [field]: ''},
    });
  }

  updateField(field, value) {
    this.setState({
      successMessage: '',
      errorMessage: '',
      address: {...this.state.address, [field]: value},
      errors: {...this.state.errors, [field]: ''},
    });
  }

  updatePassword() {
    var self = this;
    var errors = this.state.errors;
    let hasError = false;
    ['old_password', 'new_password', 'renew_password'].forEach((field) => {
      if (!self.state.password[field]) {
        errors[field] = 'This field is mandatory'
        hasError = true;
      }
    });

    if (self.state.password.new_password !== self.state.password.renew_password) {
      errors.new_password = 'New passwords are differents'
      hasError = true
    }

    self.setState({passwordErrors: errors});

    if (!hasError) {
      customerHelper.updatePassword({
        currentPassword: self.state.password.old_password,
        newPassword: self.state.password.renew_password
      }).then(() => {
        self.setState({successMessage: 'Changes saved'})
      }).catch((err) => {
        self.setState({errorMessage: err});
      });
    }
  }

  updateAddress() {
    var self = this;
    var errors = this.state.errors;
    let hasError = false;
    ['firstname', 'lastname', 'street', 'postcode', 'country_id', 'city', 'region_id', 'email', 'telephone'].forEach((field) => {
      if (!self.state.address[field]) {
        errors[field] = 'This field is mandatory'
        hasError = true;
      }
    });

    self.setState({errors: errors});

    if (!hasError) {
      let newCustomer = JSON.parse(JSON.stringify(this.props.customer));
      newCustomer.addresses.forEach((address, key) => {
        if (address.id === parseInt(self.props.customer.default_billing)) {
          address = {...address, ...self.state.address}
          address.street = [address.street]

          delete address.email
          newCustomer.addresses[key] = address
        }
      })

      newCustomer.email = self.state.address.email
      delete newCustomer.customerToken

      customerHelper.update(newCustomer).then(() => {
        self.props.updateSuccess();
        self.setState({successMessage: 'Changes saved'})
      }).catch((err) => {
        self.setState({errorMessage: err});
      });
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
      regionField = <select className="form-control" id="region_id" name="region_id" required onChange={(e) => {
        this.setState({address: {...this.state.address, region_id: e.target.value}, errors: {...this.state.errors, region_id: ''}})
      }}>
        <option key={"NONE"} value={""}>---</option>
        {this.state.availableRegions.map((region) => {
          return <option value={region.id} key={region.id} selected={parseInt(this.state.address.region_id) === parseInt(region.id)}>{region.name}</option>
        })}
      </select>
    }

    return <div id="content">
      <div className="container">
        <div className="col-md-12">
          <ul className="breadcrumb">
            <li><Link to={"/"}>Home</Link></li>
            <li>My account</li>
          </ul>
        </div>

        <div className="col-md-3">
          <AccountNavigation active={"account"}/>
        </div>

        <div className="col-md-9">
          <div className="box">
            <h1>My account</h1>
            <p className="lead">Change your personal details or your password here.</p>

            {this.state.successMessage || this.state.errorMessage ? <div className="col-md-12">
              {this.state.successMessage ? <div className="alert alert-success" role="alert">
                {this.state.successMessage}
              </div> : ''}

              {this.state.errorMessage ? <div className="alert alert-danger" role="alert">
                {this.state.errorMessage}
              </div> : ''}
            </div> : ''}

            <h3>Change password</h3>

            <div className="row">
              <div className="col-sm-6">
                <div className={this.state.errors.old_password ? "form-group has-error" : "form-group"}>
                  <label htmlFor="password_old">Old password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="old_password"
                    name="old_password"
                    required
                    value={this.state.password.old_password}
                    onChange={(e) => {this.updateFieldPassword('old_password', e.target.value)}}
                  />
                  {this.state.passwordErrors.old_password ? <span className={"help-block"}>{this.state.passwordErrors.old_password}</span> : ''}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className={this.state.errors.new_password ? "form-group has-error" : "form-group"}>
                  <label htmlFor="new_password">New password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="new_password"
                    name="new_password"
                    required
                    value={this.state.password.new_password}
                    onChange={(e) => {this.updateFieldPassword('new_password', e.target.value)}}
                  />
                  {this.state.passwordErrors.new_password ? <span className={"help-block"}>{this.state.passwordErrors.new_password}</span> : ''}
                </div>
              </div>
              <div className="col-sm-6">
                <div className={this.state.errors.renew_password ? "form-group has-error" : "form-group"}>
                  <label htmlFor="renew_password">Retype new password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="renew_password"
                    name="renew_password"
                    required
                    value={this.state.password.renew_password}
                    onChange={(e) => {this.updateFieldPassword('renew_password', e.target.value)}}
                  />
                  {this.state.passwordErrors.renew_password ? <span className={"help-block"}>{this.state.passwordErrors.renew_password}</span> : ''}
                </div>
              </div>
            </div>

            <div className="col-sm-12 text-center">
              <button className="btn btn-primary" onClick={this.updatePassword.bind(this)}><i className="fa fa-save"></i> Save new password</button>
            </div>

            <hr/>

            <h3>Personal details</h3>

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
              <div className="col-sm-12 text-center">
                <button type="submit" className="btn btn-primary" onClick={this.updateAddress.bind(this)}><i className="fa fa-save"></i> Save changes</button>
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
    customer: state.app.customer
  } },
  (dispatch) => {
    return { updateSuccess: () => { dispatch(customerUpdated()) } }
  }
)(Account)