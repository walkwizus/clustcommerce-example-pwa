import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ProductList from "./pages/ProductList";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPages: [],
      allCategories: []
    };
  }

  componentDidMount() {
    var self = this;
    getAllPages()
      .then(function(response) {
        return response.json()
      }).then(function (result) {
        self.setState({'allPages': result});
      })
    ;
    getAllCategories()
      .then(function(response) {
        return response.json()
      }).then(function (result) {
        self.setState({'allCategories': result});
      })
    ;
  }

  routeComponent(pageType) {
    switch (pageType) {
      case 'category':
        return <ProductList/>
      case 'product':
        return <Product/>
      default:
        return <Home/>
    }
  }

  buildMenuCategory() {
    let categories = [];
    this.state.allCategories.forEach((category) => {
      if (category.data.parent == 25 && category.data.isActive && category.data.includeInMenu) {
        if (category.data.children.length == 0) {
          categories.push(<li key={category.id}><a href={"/"+ category.data.urlKey}>{ category.data.name }</a></li>)
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
        return submenu;
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
              subsubmenu.push((<li><a href={"/" + this.state.allCategories[keybis].data.urlKey}>{this.state.allCategories[keybis].data.name}</a></li>))
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
            <h5><a href={"/" + this.state.allCategories[key].data.urlKey}>{this.state.allCategories[key].data.name}</a></h5>
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
                <li><a href="#" data-toggle="modal" data-target="#login-modal">Login</a></li>
                <li><a href="#">Register</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="navbar navbar-default yamm" role="navigation" id="navbar">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand home" href="index.html" data-animate-hover="bounce">
                <img src="/assets/img/logo.png" alt="Obaju logo" className="hidden-xs"/>
                <img src="/assets/img/logo-small.png" alt="Obaju logo" className="visible-xs"/>
                <span className="sr-only">Clustcommerce</span>
              </a>
              <div className="navbar-buttons">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation">
                  <span className="sr-only">Toggle navigation</span>
                  <i className="fa fa-align-justify"></i>
                </button>
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#search">
                  <span className="sr-only">Toggle search</span>
                  <i className="fa fa-search"></i>
                </button>
                <a className="btn btn-default navbar-toggle" href="basket.html">
                  <i className="fa fa-shopping-cart"></i>
                  <span className="hidden-xs">
                    0 item in cart
                  </span>
                </a>
              </div>
            </div>
            <div className="navbar-collapse collapse" id="navigation">
              <ul className="nav navbar-nav navbar-left">
                {this.buildMenuCategory()}
              </ul>
            </div>
            <div className="navbar-buttons">
              <div className="navbar-collapse collapse right" id="basket-overview">
                <a href="/cart" className="btn btn-primary navbar-btn"><i className="fa fa-shopping-cart"></i>
                  <span className="hidden-sm" data-contains="cart-items-header">
                    0 item in cart
                  </span>
                </a>
              </div>
              <div className="navbar-collapse collapse right" id="search-not-mobile">
                <button type="button" className="btn navbar-btn btn-primary" data-toggle="collapse"
                        data-target="#search">
                  <span className="sr-only">Toggle search</span>
                  <i className="fa fa-search"></i>
                </button>
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
            {this.state.allPages.map(function(page) {
              return <Route path={'/'+ page.url_key} onChange={self.componentDidMount}>
                {self.routeComponent(page.type)}
              </Route>
            })}

            <Route path="/" onChange={self.componentDidMount}>
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );

    return view;
  }
}

function Home() {
  return <div>
    <div>
      <h2>Home</h2>
    </div>
  </div>;
}

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {product: {}};
  }

  componentDidMount() {
    var self = this;
    getPageContent()
        .then(function(response) {
          return response.json()
        }).then(function (result) {
      self.setState({'product': result});
    })
    ;
  }

  render() {
    return <div>
      <div>
        {this.state.product.name}
      </div>
    </div>;
  }
}

function getPageContent() {
  var path = window.location.pathname;

  return fetch('/__internal/page-content?urlKey=' + path.substr(1));
}

function getAllPages() {
  return fetch('/__internal/all-pages');
}

function getAllCategories() {
  return fetch('/__internal/source-magento2/categories');
}