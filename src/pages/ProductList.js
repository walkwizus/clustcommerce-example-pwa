import React from 'react';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import {
  Link
} from "react-router-dom";
import "bootstrap-slider/dist/css/bootstrap-slider.css"

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: null,
      allProducts: [],
      products: [],
      applicableFilters: [],
      filters: [],
      category: {},
      currentFilters: {},
      page: 0,
      limit: 12
    };
  }

  componentDidMount() {
    var self = this;
    getPageContent()
    .then(function (response) {
      return response.json()
    }).then(function (result) {
      let filterTypes = {};
      result.applicableFilters.forEach((applicableFilter) => {
        filterTypes[applicableFilter.attribute] = applicableFilter.frontend_input
      })

      self.setState({
        'allProducts': result.products,
        'filterTypes': filterTypes,
        'applicableFilters': result.applicableFilters,
        'category': result,
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
      // Authorize one filter to not match the products to get all available options in filters
      let filtersNotMatch = [];

      for (const attribute in self.state.currentFilters) {
        const currentFilterValues = self.state.currentFilters[attribute];
        let filterFound = false;

        for (let i = 0; i < product.filterableValues.length; i++) {
          if (product.filterableValues[i].attribute === attribute) {
            filterFound = true;

            if (self.state.filterTypes[attribute] && self.state.filterTypes[attribute] === 'price') {
              const priceValue = product.filterableValues[i].value;
              if (priceValue < currentFilterValues[0] || priceValue > currentFilterValues[1]) {
                filtersNotMatch.push(attribute)
              }
            } else {
              if (!currentFilterValues.includes(product.filterableValues[i].value)) {
                filtersNotMatch.push(attribute);
              }
            }
          }
        }

        if (!filterFound) {
          return false;
        }
      }

      // Save filterableValues
      product.filterableValues.forEach((filterableValue) => {
        // If more than 2 filters that doesn't match, skip the value
        if (filtersNotMatch.length > 2) {
          return;
        }

        // Process the filter that doesn't match, check if that the product as the good value for the unmatched filter
        for (let i = 0; i < filtersNotMatch.length; i++) {
          if (filterableValue.attribute !== filtersNotMatch[i]) {
            if (self.state.filterTypes[filtersNotMatch[i]] && self.state.filterTypes[filtersNotMatch[i]] === 'price') {
              const priceValue = filterableValue.value;
              if (priceValue < self.state.currentFilters[filtersNotMatch[i]][0] || priceValue > self.state.currentFilters[filtersNotMatch[i]][0]) {
                return;
              }
            } else {
              if (!self.state.currentFilters[filtersNotMatch[i]].includes(product[filtersNotMatch[i]])) {
                return;
              }
            }
          }
        }

        if (!filterableValues[filterableValue.attribute]) {
          filterableValues[filterableValue.attribute] = []
        }

        filterableValues[filterableValue.attribute].push(filterableValue.value)
      })

      // Anyway, any product that doesn't match fully all filters, should not be shown
      return filtersNotMatch.length <= 0;
    })})

    // Filter filters to get only one that contains products
    let filters = []
    this.state.applicableFilters.forEach((applicableFilter) => {
      if (!filterableValues[applicableFilter.attribute]) {
        return;
      }

      let filter = {...applicableFilter}
      if (filter.attribute === 'price') {
        filter.minValue = Math.min.apply(Math, filterableValues[applicableFilter.attribute])
        filter.maxValue = Math.max.apply(Math, filterableValues[applicableFilter.attribute])

        if (filter.minValue !== filter.maxValue) {
          filters.push(filter)
        }

        return;
      }

      filter.options = filter.options.filter((filterValue) => {
        return filterableValues[applicableFilter.attribute].includes(filterValue.value)
      })

      let counts = {};
      for (let i = 0; i < filterableValues[applicableFilter.attribute].length; i++) {
        let num = filterableValues[applicableFilter.attribute][i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }

      filter.options.forEach((filterValue) => {
        filterValue.count = counts[filterValue.value]
      })

      filters.push(filter);
    })

    this.setState({'filters': filters})
  }

  clearFilter(filterName) {
    delete this.state.currentFilters[filterName]

    this.filterProducts()
  }

  // onChange on a select
  switchSelectFilter(event) {
    this.state.currentFilters[event.target.name] = [event.target.value]

    if (event.target.value === "CLUST_NONE_VALUE") {
      delete this.state.currentFilters[event.target.name]
    }

    this.filterProducts()
  }

  // onChange on checkbox
  switchCheckbox(event) {
    if (!this.state.currentFilters[event.target.name]) {
      this.state.currentFilters[event.target.name] = [event.target.value]
    } else {
      let valueFound = false
      for (let i = 0; i < this.state.currentFilters[event.target.name].length; i++) {
        if (this.state.currentFilters[event.target.name][i] === event.target.value) {
          valueFound = true;
          this.state.currentFilters[event.target.name].splice(i, 1);

          if (this.state.currentFilters[event.target.name].length === 0) {
            delete this.state.currentFilters[event.target.name];
          }
          break;
        }
      }

      if (!valueFound) {
        this.state.currentFilters[event.target.name].push(event.target.value)
      }
    }

    this.filterProducts()
  }

  // onChange price
  changePrice(filterName, event) {
    this.state.currentFilters[filterName] = event.target.value

    this.filterProducts()
  }

  componentWillReceiveProps(nextProps) {
    this.componentDidMount()
  }

  render() {
    let self = this;
    let productsToShow = this.state.products.slice(this.state.page * this.state.limit, (this.state.page + 1) * this.state.limit)
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
              if ((filter.options.length < 2 && filter.frontend_input !== 'price') && !self.state.currentFilters[filter.attribute]) {
                return '';
              }

              let field = '';
              if (filter.frontend_input === 'select') {
                field = (<div>
                  {filter.options.map((option) => {
                    return (<div className="checkbox" key={option.value}>
                      <label>
                        <input
                          type="checkbox"
                          name={filter.attribute}
                          value={option.value}
                          checked={self.state.currentFilters[filter.attribute] && self.state.currentFilters[filter.attribute].includes(option.value)}
                          onChange={self.switchCheckbox.bind(self)}
                        />

                        {option.label} ({option.count})
                      </label></div>)
                  })}
                </div>)
              } else if (filter.frontend_input === 'price') {
                field = (<ReactBootstrapSlider max={filter.maxValue} min={filter.minValue} range={true} value={[
                  self.state.currentFilters[filter.attribute] ? self.state.currentFilters[filter.attribute][0] : filter.minValue,
                  self.state.currentFilters[filter.attribute] ? self.state.currentFilters[filter.attribute][1] : filter.maxValue
                ]} slideStop={(event) => self.changePrice(filter.attribute, event)}/>)
              }

              return <div className="panel panel-default sidebar-menu" key={filter.attribute}>
                <div className="panel-heading">
                  <h3 className="panel-title">
                    {filter.label}
                    {self.state.currentFilters[filter.attribute]
                      ? (<a className="btn btn-sm btn-danger pull-right" onClick={() => {self.clearFilter(filter.attribute)}}>
                        <i className="fa fa-times-circle"></i> Clear
                      </a>)
                      : ''
                    }
                  </h3>
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
              <h1>{this.state.category.name}</h1>
            </div>
            <div className="box info-bar">
              <div className="row">
                <div className="col-md-12 col-lg-4 products-showing">
                  Showing <strong>{productsToShow.length}</strong> of <strong>{this.state.products.length}</strong> products
                </div>
                <div className="col-md-12 col-lg-7 products-number-sort">
                  <form className="form-inline d-block d-lg-flex justify-content-between flex-column flex-md-row">
                    <div className="products-number"><strong>Show</strong>
                      <a className={this.state.limit === 12 ? "btn btn-sm btn-primary" : "btn btn-outline-secondary btn-sm"} onClick={() => {this.setState({'limit': 12})}}>12</a>
                      <a className={this.state.limit === 24 ? "btn btn-sm btn-primary" : "btn btn-outline-secondary btn-sm"} onClick={() => {this.setState({'limit': 24})}}>24</a>
                      <a className={this.state.limit === 48 ? "btn btn-sm btn-primary" : "btn btn-outline-secondary btn-sm"} onClick={() => {this.setState({'limit': 48})}}>48</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="row products">
              {productsToShow.map(function(product) {
                let price = 'No price'
                product.filterableValues.forEach((filterableValue) => {
                  if (filterableValue.attribute === 'price') {
                    price = filterableValue.value
                  }
                })

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
                      <p className="price">{price}</p>
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
