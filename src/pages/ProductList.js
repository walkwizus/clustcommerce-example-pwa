import React from "react";
import {
  Link
} from "react-router-dom";

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: null,
      allProducts: [],
      products: [],
      applicableFilters: [],
      filters: [],
      currentFilters: {},
      page: 0,
      limit: 21
    };
  }

  componentDidMount() {
    var self = this;
    getPageContent()
    .then(function (response) {
      return response.json()
    }).then(function (result) {
      self.setState({
        'allProducts': result.products,
        'applicableFilters': result.applicableFilters,
        'path': window.location.pathname
      });

      self.filterProducts()
    });
  }

  filterProducts() {
    let self = this;
    // Filter products
    let filterableValues = {}
    this.setState({'products': this.state.allProducts.filter((product) => {
      for (const attribute in self.state.currentFilters) {
        const currentFilterValues = self.state.currentFilters[attribute];
        let foundValue = false;

        for (let i = 0; i < product.filterableValues.length; i++) {
          if (product.filterableValues[i].attribute === attribute) {
            foundValue = true;
            if (!currentFilterValues.includes(product.filterableValues[i].value)) {
              return false;
            }
          }
        }

        if (!foundValue) {
          return false;
        }
      }

      // Save filterableValues
      product.filterableValues.forEach((filterableValue) => {
        if (!filterableValues[filterableValue.attribute]) {
          filterableValues[filterableValue.attribute] = []
        }

        filterableValues[filterableValue.attribute].push(filterableValue.value)
      })

      return true;
    })})

    // Filter filters to get only one that contains products
    let filters = []
    this.state.applicableFilters.forEach((applicableFilter) => {
      if (!filterableValues[applicableFilter.attribute]) {
        return;
      }

      let filter = {...applicableFilter}
      if (filter.attribute === 'price') {
        return;
      }

      filter.options = filter.options.filter((filterValue) => {
        return filterableValues[applicableFilter.attribute].includes(filterValue.value)
      })

      filters.push(filter);
    })

    this.setState({'filters': filters})
  }

  switchSelectFilter(event) {
    this.state.currentFilters[event.target.name] = [event.target.value]

    if (event.target.value === "CLUST_NONE_VALUE") {
      delete this.state.currentFilters[event.target.name]
    }

    this.filterProducts()
  }

  componentWillReceiveProps(nextProps) {
    this.componentDidMount()
  }

  render() {
    let self = this;
    return <div id="content">
      <div className="container">
        <form method="get" action="#">
          <input type="hidden" name="page" value="1"/>
          <input type="hidden" name="limit" value="xxx"/>

          <div className="col-md-12">
            <ul className="breadcrumb">
              <li><a href="/">Home</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            {this.state.filters.map(function(filter) {
              if (filter.options.length < 2 && !self.state.currentFilters[filter.attribute]) {
                return '';
              }

              let field = '';
              if (filter.frontend_input === 'select') {
                field = (<select class="form-control" name={filter.attribute} onChange={self.switchSelectFilter.bind(self)} value={self.state.currentFilters[filter.attribute] ? self.state.currentFilters[filter.attribute] : null}>
                  <option value="CLUST_NONE_VALUE" key="CLUST_NONE_VALUE">-</option>
                  {filter.options.map((option) => {
                    return <option value={option.value} key={option.value}>{option.label}</option>
                  })}
                </select>)
              }

              return <div className="panel panel-default sidebar-menu" key={filter.attribute}>
                <div className="panel-heading">
                  <h3 className="panel-title">{filter.label}</h3>
                </div>
                <div className="panel-body">
                  <div className="form-group">
                    {field}
                  </div>
                </div>
              </div>
            })}

            <div className="banner">
              <a href="#">
                <img src="/assets/img/banner.jpg" alt="sales 2014" className="img-responsive"/>
              </a>
            </div>
          </div>

          <div className="col-md-9">
            <div className="box">
              <h1>xxxx</h1>
              <p>xxx</p>
            </div>
            <div className="box info-bar">
              <div className="row">
                <div className="col-sm-12 col-md-4 products-showing">

                </div>
                <div className="col-sm-12 col-md-8  products-number-sort">
                  <div className="row">
                    <form className="form-inline">
                      <div className="col-md-6 col-sm-6">
                        <div className="products-number">
                          <strong>Show</strong>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6">
                        <div className="products-sort-by">
                          <strong>Sort by</strong>

                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="row products">
              {this.state.products.slice(this.state.page * this.state.limit, (this.state.page + 1) * this.state.limit).map(function(product) {
                return <div className="col-md-4 col-sm-6" key={product.id}>
                  <div className="product">
                    <div className="flip-container">
                      <div className="flipper">
                        <div className="front">
                          <a href={"/"+product.urlKey}>
                            <img
                              src={product.image}
                              alt="" className="img-responsive" style={{height: "250px"}}/>
                          </a>
                        </div>
                        <div className="back">
                          <a href={"/"+product.urlKey}>
                            <img
                              src={product.image}
                              alt="" className="img-responsive" style={{height: "250px"}}/>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div style={{height: "250px"}}>
                      <a href={"/"+product.urlKey} className="invisible">
                        <img
                          src={product.image}
                          alt="" className="img-responsive" style={{height: "250px"}}/>
                      </a>
                    </div>
                    <div className="text">
                      <h3><a href={"/"+product.urlKey}>{product.name}</a></h3>
                      <p className="price">{product.filterableValues.price}</p>
                      <p className="buttons">
                        <Link to={"/"+product.urlKey} className="btn btn-default">View
                          detail</Link>
                      </p>
                    </div>
                  </div>
                </div>
              })}
            </div>

            <div className="pages">
              <ul className="pagination">
                {this.state.page > 0
                  ? (<li><a onClick={() => this.setState({page: this.state.page - 1})}>&laquo;</a></li>)
                  : ('')
                }
                {Array.apply(0, Array(Math.ceil(this.state.products.length / this.state.limit) == 0 ? 1 : Math.ceil(this.state.products.length / this.state.limit))).map((x, i) => {
                  {return i === this.state.page
                      ? (<li className="active"><a onClick={() => this.setState({page: i})}>{i + 1}</a></li>)
                      : (<li><a onClick={() => this.setState({page: i})}>{i + 1}</a></li>)
                  }
                })}
                {this.state.page * this.state.limit < this.state.products.length
                  ? (<li><a onClick={() => this.setState({page: this.state.page + 1})}>&raquo;</a></li>)
                  : ('')
                }
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  }
}

function getPageContent() {
  var myHeaders = new Headers();
  myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
  var path = window.location.pathname;

  return fetch('/__internal/page-content?urlKey=' + path.substr(1), {headers: myHeaders});
}
