import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ProductList from "./pages/ProductList";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutDelivery from "./pages/CheckoutDelivery";
import CheckoutPayment from "./pages/CheckoutPayment";
import CheckoutSummary from "./pages/CheckoutSummary";
import Login from "./pages/Login";
import { configUpdated } from "./redux/actions";
import { connect } from 'react-redux'
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import CmsPage from "./pages/CmsPage";
import CategoryBlock from "./pages/CategoryBlock";
import Home from "./pages/Home";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress ? <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0, 0.5)'
    }}>
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <Loader type="Puff" color="#00BFFF" height={80} width={80} />
      </div>
    </div> : ''
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPages: [],
      allCategories: [],
      config: {},
    };
  }

  componentDidMount() {
    var self = this;
    getConfig()
      .then(function(response) {
        return response.json()
      }).then(function(result) {
        self.setState({'config': result})
        self.props.configUpdated(result);
      })
    ;
    getAllPages()
      .then(function(response) {
        return response.json()
      }).then(function (result) {
        self.setState({'allPages': result});
      })
    ;
    getMenu()
      .then(function(response) {
        return response.json()
      }).then(function (result) {
        self.setState({'allCategories': result});
      })
    ;
  }

  routeComponent(page) {
    switch (page.type) {
      case 'category':
        if (page.displayMode === 'PAGE') {
          return <CategoryBlock key={page.url_key} config={this.state.config}/>
        } else {
          return <ProductList key={page.url_key} config={this.state.config}/>
        }
      case 'product':
        return <Product key={page.url_key} config={this.state.config}/>
      case 'cms_page':
        return <CmsPage key={page.url_key} config={this.state.config}/>
      default:
        return <Home config={this.state.config}/>
    }
  }

  buildMenuCategory() {
    let categories = [];
    this.state.allCategories.forEach((category) => {
      if (category.data.parent == null && category.data.isActive && category.data.includeInMenu) {
        if (category.data.children.length == 0) {
          categories.push(<li key={category.id}><Link to={"/"+ category.data.urlKey}>{ category.data.name }</Link></li>)
        } else {
          categories.push(
            <li className="dropdown yamm-fw" key={category.id}>
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown"
                 data-delay="200">{category.data.name} <b className="caret"></b></a>
              <ul className="dropdown-menu">
                <li>
                  <div className="yamm-content">
                    <div className="row">
                      {this.buildSubMenuCategory(category.data.id)}
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          )
        }
      }
    })

    return categories;
  }

  buildSubMenuCategory(parentId) {
    let submenu = [];
    for (var key in this.state.allCategories) {
      if (!this.state.allCategories[key].data.isActive || !this.state.allCategories[key].data.includeInMenu) {
        continue;
      }

      if (this.state.allCategories[key].data.parent === parentId) {
        if (this.state.allCategories[key].data.children.length > 0) {
          var subsubmenu = []
          for (var keybis in this.state.allCategories) {
            if (
              this.state.allCategories[keybis].data.parent === this.state.allCategories[key].data.id
              && this.state.allCategories[keybis].data.isActive
              && this.state.allCategories[keybis].data.includeInMenu
            ) {
              subsubmenu.push((<li><Link to={"/" + this.state.allCategories[keybis].data.urlKey}>{this.state.allCategories[keybis].data.name}</Link></li>))
            }
          }

          submenu.push((<div className="col-sm-3">
            <h5>{this.state.allCategories[key].data.name}</h5>
            <ul>
              {subsubmenu}
            </ul>
          </div>))
        } else {
          submenu.push((<div className="col-sm-3">
            <h5><Link to={"/" + this.state.allCategories[key].data.urlKey}>{this.state.allCategories[key].data.name}</Link></h5>
          </div>))
        }
      }
    }

    return submenu
  }

  render() {
    var self = this;
    var view = (
      <Router>
        <header className="header mb-5">

        <div id="top">
          <div className="container">
            <div className="col-md-6 offer" data-animate="fadeInDown">
              <a href="#" className="btn btn-success btn-sm" data-animate-hover="shake">Offer of the day</a> <a
                href="#">Get flat 35% off on orders over $50!</a>
            </div>
            <div className="col-md-6" data-animate="fadeInDown">
              <ul className="menu">
                {this.props.customer
                  ? <li><Link to={"/account"}>Hello {self.props.customer.firstname}</Link></li>
                  : <li><Link to={"/login"}>Login / Register</Link></li>
                }
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="navbar navbar-default yamm" role="navigation" id="navbar">
          <div className="container">
            <div className="navbar-header">
              <Link className="navbar-brand home" to={"/"} data-animate-hover="bounce">
                <img src="/assets/img/logo.png" alt="Obaju logo" className="hidden-xs"/>
                <img src="/assets/img/logo-small.png" alt="Obaju logo" className="visible-xs"/>
                <span className="sr-only">Clustcommerce</span>
              </Link>
              <div className="navbar-buttons">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation">
                  <span className="sr-only">Toggle navigation</span>
                  <i className="fa fa-align-justify"></i>
                </button>
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#search">
                  <span className="sr-only">Toggle search</span>
                  <i className="fa fa-search"></i>
                </button>
                <Link className="btn btn-default navbar-toggle" to={"/cart"}>
                  <i className="fa fa-shopping-cart"></i>
                  <span className="hidden-xs">
                    {this.props.cart.items.length} item in cart
                  </span>
                </Link>
              </div>
            </div>
            <div className="navbar-collapse collapse" id="navigation">
              <ul className="nav navbar-nav navbar-left">
                {this.buildMenuCategory()}
              </ul>
            </div>
            <div className="navbar-buttons">
              <div className="navbar-collapse collapse right" id="basket-overview">
                <Link to={"/cart"} className="btn btn-primary navbar-btn"><i className="fa fa-shopping-cart"></i>
                  <span className="hidden-sm" data-contains="cart-items-header">
                    {this.props.cart.items.length} item in cart
                  </span>
                </Link>
              </div>
            </div>
            <div className="collapse clearfix" id="search">
              <form className="navbar-form" role="search">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Search"/>
                    <span className="input-group-btn">
			            <button type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
		            </span>
                </div>
              </form>
            </div>
          </div>
        </div>
        </header>
        <div id="all">
          {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <Switch>
            {/*this.state.allPages.map(function(page) {
              return <Route path={'/'+ page.url_key} render={() => self.routeComponent(page)}/>
            })*/}

            <Route path="/cart" render={() => <Cart /> }/>
            <Route path="/checkout-shipping" render={() => <CheckoutDelivery/> }/>
            <Route path="/checkout-payment" render={() => <CheckoutPayment/> }/>
            <Route path="/checkout-summary" render={() => <CheckoutSummary /> }/>
            <Route path="/checkout" render={() => <Checkout /> }/>
            <Route path="/login" render={() => <Login /> }/>
            <Route path="/account/orders" render={() => <Orders /> }/>
            <Route path="/account" render={() => <Account /> }/>
            <Route path="/:route" render={(props) => { console.log('ok'); return <AnyRoute {...props}/> }}></Route>
            <Route path="/" onChange={self.componentDidMount}>
              <Home />
            </Route>
          </Switch>
        </div>
        <LoadingIndicator/>
      </Router>
    );

    return view;
  }
}

class AnyRouteCmp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      component: null
    }
  }

  componentWillReceiveProps() {
    this.componentDidMount();
  }

  componentDidMount() {
    var self = this;
    getPageContent()
      .then(function (response) {
        return response.json()
      }).then(function (result) {
        switch (result.type) {
          case 'category':
            if (result.data.displayMode === 'PAGE') {
              self.setState({component: <CategoryBlock key={result.url_key} config={self.props.config}/>})
            } else {
              self.setState({component: <ProductList key={result.url_key} config={self.props.config}/>})
            }
            break;
          case 'product':
            self.setState({component: <Product key={result.url_key} config={self.props.config}/>})
            break;
          case 'cms_page':
            self.setState({component: <CmsPage key={result.url_key} config={self.props.config}/>})
            break;
        }
      })
    ;
  }

  render() {
    return this.state.component ? this.state.component : '';
  }
}

const AnyRoute = connect(
  (state) => { return {
    config: state.app.config ? state.app.config : {},
  } }
)(AnyRouteCmp)

function getPageContent() {
  var myHeaders = new Headers();
  myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
  var path = window.location.pathname;

  return fetch('/__internal/page-content?urlKey=' + (path !== "/" ? path.substr(1) : 'home'), {headers: myHeaders});
}

function getAllPages() {
  var myHeaders = new Headers();
  myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
  return fetch('/__internal/all-pages', {headers: myHeaders});
}

function getMenu() {
  var myHeaders = new Headers();
  myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
  return fetch('/__internal/source-magento2/menu?frontUrl', {headers: myHeaders});
}

function getConfig() {
  var myHeaders = new Headers();
  myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);

  return fetch('/__internal/source-magento2/config', {headers: myHeaders});
}

export default connect(
  (state) => { return {
    cart: state.app.cart,
    customer: state.app.customer
  } },
  (dispatch) => {
    return {
      configUpdated: (config) => dispatch(configUpdated(config))
    }
  }
)(App);