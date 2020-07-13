import React from "react";
import {
  Link,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux'
import customerHelper from "../helpers/customer";
import {customerUpdated} from "../redux/actions";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      successMessage: null,
      errorMessage: null,
      registerForm: {
        firstname: '',
        lastname: '',
        username: '',
        password: ''
      },
      loginForm: {
        username: '',
        password: ''
      },
      errorRegisterForm: {
        firstname: '',
        lastname: '',
        username: '',
        password: ''
      },
      errorLoginForm: {
        username: '',
        password: ''
      }
    }
  }

  updateRegisterField(field, value) {
    this.setState({
      registerForm: {...this.state.registerForm, [field]: value},
      errorRegisterForm: {...this.state.errorRegisterForm, [field]: ''},
    });
  }

  updateLoginField(field, value) {
    this.setState({
      loginForm: {...this.state.loginForm, [field]: value},
      errorLoginForm: {...this.state.errorLoginForm, [field]: ''},
    });
  }

  login() {
    var self = this;
    var errors = this.state.errorLoginForm;
    let hasError = false;
    ['username', 'password'].forEach((field) => {
      if (!self.state.loginForm[field]) {
        errors[field] = 'This field is mandatory'
        hasError = true;
      }
    });

    self.setState({errorLoginForm: errors, errorMessage: null});

    if (!hasError) {
      customerHelper.login(
        this.state.loginForm.username,
        this.state.loginForm.password,
      ).then((customer) => {
        self.props.loginSuccess();
        this.setState({'redirect': '/account'});
      }).catch((err) => {
        this.setState({errorMessage: err});
      });
    }
  }

  register() {
    var self = this;
    var errors = this.state.errorRegisterForm;
    let hasError = false;
    ['firstname', 'lastname', 'email', 'password'].forEach((field) => {
      if (!self.state.registerForm[field]) {
        errors[field] = 'This field is mandatory'
        hasError = true;
      }
    });

    self.setState({errorRegisterForm: errors, errorMessage: null});

    if (!hasError) {
      customerHelper.register(
        this.state.registerForm.firstname,
        this.state.registerForm.lastname,
        this.state.registerForm.email,
        this.state.registerForm.password
      ).then((customer) => {
        this.setState({'redirect': '/account'});
      }).catch((err) => {
        this.setState({errorMessage: err});
      });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return <div id="content">
      <div className="container">

        <div className="col-md-12">

          <ul className="breadcrumb">
            <li><a href="/">Home</a>
            </li>
            <li>New account / Sign in</li>
          </ul>

        </div>

        {this.state.successMessage || this.state.errorMessage ? <div className="col-md-12">
          {this.state.successMessage ? <div className="alert alert-success" role="alert">
            {this.state.successMessage}
          </div> : ''}

          {this.state.errorMessage ? <div className="alert alert-danger" role="alert">
            {this.state.errorMessage}
          </div> : ''}
        </div> : ''}

        <div className="col-md-6">
          <div className="box">
            <h1>New account</h1>

            <p className="lead">Not our registered customer yet?</p>
            <p>With registration with us new world of fashion, fantastic discounts and much more opens to you! The whole
              process will not take you more than a minute!</p>

            <hr/>

            <div className={this.state.errorRegisterForm.firstname ? "form-group has-error" : "form-group"}>
              <label htmlFor="firstname">Firstname</label>
              <input
                type="text"
                className="form-control"
                id="firstname"
                name="firstname"
                required
                value={this.state.registerForm.firstname}
                onChange={(e) => {this.updateRegisterField('firstname', e.target.value)}}
              />
              {this.state.errorRegisterForm.firstname ? <span className={"help-block"}>{this.state.errorRegisterForm.firstname}</span> : ''}
            </div>
            <div className={this.state.errorRegisterForm.lastname ? "form-group has-error" : "form-group"}>
              <label htmlFor="lastname">Lastname</label>
              <input
                type="text"
                className="form-control"
                id="lastname"
                name="lastname"
                required
                value={this.state.registerForm.lastname}
                onChange={(e) => {this.updateRegisterField('lastname', e.target.value)}}
              />
              {this.state.errorRegisterForm.lastname ? <span className={"help-block"}>{this.state.errorRegisterForm.lastname}</span> : ''}
            </div>
            <div className={this.state.errorRegisterForm.email ? "form-group has-error" : "form-group"}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                required
                value={this.state.registerForm.email}
                onChange={(e) => {this.updateRegisterField('email', e.target.value)}}
              />
              {this.state.errorRegisterForm.email ? <span className={"help-block"}>{this.state.errorRegisterForm.email}</span> : ''}
            </div>
            <div className={this.state.errorRegisterForm.password ? "form-group has-error" : "form-group"}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                required
                value={this.state.registerForm.password}
                onChange={(e) => {this.updateRegisterField('password', e.target.value)}}
              />
              {this.state.errorRegisterForm.password ? <span className={"help-block"}>{this.state.errorRegisterForm.password}</span> : ''}
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary" name="submit" value="register" onClick={this.register.bind(this)}>
                <i className="fa fa-user-md"></i> Register
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="box">
            <h1>Login</h1>

            <p className="lead">Already our customer?</p>

            <hr/>

            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={this.state.loginForm.username}
                onChange={(e) => {this.updateLoginField('username', e.target.value)}}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={this.state.loginForm.password}
                onChange={(e) => {this.updateLoginField('password', e.target.value)}}
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary" name="submit" value="login" onClick={this.login.bind(this)}>
                <i className="fa fa-sign-in"></i> Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

export default connect((state) => {},
  (dispatch) => {
    return { loginSuccess: () => { dispatch(customerUpdated()) } }
  })(Login)
