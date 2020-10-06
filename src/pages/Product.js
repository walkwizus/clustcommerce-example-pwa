import React from "react";
import {
  Link
} from "react-router-dom";
import { connect } from 'react-redux'
import { cartUpdated } from '../redux/actions'
import cartHelper from '../helpers/cart';

class Product extends React.Component {
  constructor(props) {
    super(props);

    this.productOptions = {};
    this.productOptionsPrices = {};
    this.state = {
      product: {},
      price: undefined,
      error: null,
      config: props.config
    };
  }

  componentDidMount() {
    this.productOptions = {};

    var self = this;
    getPageContent()
      .then(function(response) {
        return response.json()
      }).then(function (result) {
        // Calculate percent prices on product options
        result.options.forEach((option) => {
          option.values.forEach((optionValue) => {
            if (optionValue.price_type === 'percent') {
              optionValue.price = result.price * optionValue.price / 100;
            }
          })
        })

        self.setState({'product': result, 'price': result.price.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: self.state.config.base_currency_code})});
    })
    ;
  }

  addToCart() {
    let self = this;
    let customOptions = []
    for (let key in this.productOptions) {
      customOptions.push({
        option_id: key,
        option_value: this.productOptions[key]
      });
    }
    cartHelper.addProductToCart(self.state.product.sku, 1, {custom_options: customOptions}).then(() => {
      self.setState({error: null})
      self.props.onCartUpdated()
    }).catch((error) => {
      self.setState({error: error})
    });
  }

  selectOption(type, optionId, value, price) {
    if (!this.productOptionsPrices[optionId]) {
      this.productOptionsPrices[optionId] = 0
    }

    let newPrice = this.state.price ? this.state.price - this.productOptionsPrices[optionId] + price : this.state.price;
    this.productOptionsPrices[optionId] = price;

    if (value === "" && this.productOptions[optionId]) {
      delete this.productOptions[optionId]
    } else {
      this.productOptions[optionId] = value;
    }

    this.setState({'price': newPrice.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.state.config.base_currency_code})});
  }

  checkOption(optionId, value, price) {
    if (!this.productOptions[optionId]) {
      this.productOptions[optionId] = []
    } else {
      this.productOptions[optionId] = this.productOptions[optionId].split(',')
    }

    let newPrice = this.state.price
    if (this.productOptions[optionId].includes(value)) {
      newPrice = this.state.price ? this.state.price - price : this.state.price
      this.productOptions[optionId].splice(this.productOptions[optionId].indexOf(value), 1)

    } else {
      newPrice = this.state.price ? this.state.price + price : this.state.price
      this.productOptions[optionId].push(value)
    }

    this.productOptions[optionId] = this.productOptions[optionId].join(',')
    this.setState({'price': newPrice.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.state.config.base_currency_code})});
  }

  buildRelatedHtml(label, products) {
    return <div className="row same-height-row">
      <div className="col-md-3 col-sm-6">
        <div className="box same-height" style={{height: "379px"}}>
          <h3>{label}</h3>
        </div>
      </div>

      {products.map((product) => {
        return (<div className="col-md-3 col-sm-6">
          <div className="product same-height" style={{height: "379px"}}>
            <div className="flip-container">
              <div className="flipper">
                <div className="front">
                  <Link to={"/" + product.urlKey}>
                    <img src={product.mainImage} alt="" className="img-responsive" style={{height: "250px"}}/>
                  </Link>
                </div>
                <div className="back">
                  <Link to={"/" + product.urlKey}>
                    <img src={product.mainImage} alt="" className="img-responsive" style={{height: "250px"}}/>
                  </Link>
                </div>
              </div>
            </div>
            <Link to={"/" + product.urlKey} className={"invisible"}>
              <img src={product.mainImage} alt="" className="img-responsive" style={{height: "250px"}}/>
            </Link>
            <div className="text">
              <h3>{product.name}</h3>
              <p className="price">{product.price ? product.price.toFixed(2) : ''} {product.price ? this.state.config.currency_symbol : ''}</p>
            </div>
          </div>
        </div>)
      })}
    </div>
  }

  render() {
    let relatedProducts = []
    let crossProducts = []
    let upsellProducts = []
    let configurableOptions = []

    if (this.state.product && this.state.product.product_links) {
      this.state.product.product_links.forEach((productLink) => {
        if (productLink.link_type === 'related') {
          relatedProducts.push(productLink)
        } else if (productLink.link_type === 'crosssell') {
          crossProducts.push(productLink)
        } else if (productLink.link_type === 'upsell') {
          upsellProducts.push(productLink)
        }
      })

      this.state.product.options.forEach((productOptions) => {
        switch(productOptions.type) {
          case 'drop_down':
            configurableOptions.push(<div className={"form-group"}>
              <div className={"col-md-6 col-lg-4"}>{productOptions.title}</div>
              <div className={"col-md-6 col-lg-8"}>
                <select className={"form-control"} onChange={(e) => {
                  this.selectOption('select', productOptions.option_id, e.target.value, parseInt(e.target.selectedOptions[0].getAttribute('data-price')));
                }}>
                  <option value={""} data-price={0}>---</option>
                  {productOptions.values.map((value) => {
                    return <option value={value.option_type_id} data-price={value.price}>{value.title} {value.price ? "(" + value.price.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.state.config.base_currency_code}) + ")" : ""}</option>
                  })}
                </select>
              </div>
            </div>)
            break;
          case 'radio':
            configurableOptions.push(<div>
              <div className={"col-md-6 col-lg-4"}>{productOptions.title}</div>
              <div className={"col-md-6 col-lg-8"}>
                {productOptions.is_require ? '' : (<div className={"radio"}>
                  <label htmlFor={"default" + productOptions.option_id}>
                    <input type={"radio"} name={productOptions.title} id={"default"+productOptions.option_id} value={""} onChange={(e) => {
                      this.selectOption('radio', productOptions.option_id, e.target.value, 0);
                    }} />
                    None
                  </label>
                </div>)}
                {productOptions.values.map((value) => {
                  return <div className={"radio"}>
                    <label htmlFor={value.option_type_id}>
                      <input type={"radio"} name={productOptions.title} id={value.option_type_id} value={value.option_type_id} onChange={(e) => {
                        this.selectOption('radio', productOptions.option_id, e.target.value, value.price);
                      }}/>
                      {value.title} {value.price ? "(" + value.price.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.state.config.base_currency_code}) + ")" : ""}
                    </label>
                  </div>
                })}
              </div>
            </div>)
            break;
          case 'checkbox':
            configurableOptions.push(<div>
              <div className={"col-md-6 col-lg-4"}>{productOptions.title}</div>
              <div className={"col-md-6 col-lg-8"}>
                {productOptions.values.map((value) => {
                  return <div className={"checkbox"}>
                    <label htmlFor={value.option_type_id}>
                      <input type={"checkbox"} name={productOptions.title} id={value.option_type_id} value={value.option_type_id} onChange={(e) => {
                        this.checkOption(productOptions.option_id, e.target.value, value.price);
                      }}/>
                      {value.title} {value.price ? "(" + value.price.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.state.config.base_currency_code}) + ")" : ""}
                    </label>
                  </div>
                })}
              </div>
            </div>)
            break;
        }
      });
    }

    return <div id="content">
      <div className="container">
        <div className="col-md-12">
          <ul className="breadcrumb">
            <li><Link to={"/"}>Home</Link></li>
            <li>{this.state.product.name}</li>
          </ul>
        </div>
        {this.state.error
          ? <div className="col-md-12"><div className={"alert alert-danger"}>{this.state.error}</div></div>
          : ''
        }
        <div className="col-md-12">
          <div className="row" id="productMain">
            <div className="col-sm-6">
              <div id="mainImage">
                <img
                  src={this.state.product.mainImage}
                  alt="" className="img-responsive"/>
              </div>

            </div>
            <div className="col-sm-6">
              <div className="box">
                <h1 className="text-center">{this.state.product.name}</h1>
                <p className="price">{this.state.price ? this.state.price.toLocaleString(navigator.language || navigator.userLanguage, {style: 'currency', currency: this.state.config.base_currency_code}) : ''}</p>
                <p className="text-center buttons">
                  <div className="product-configurable-attributes" style={{"text-align": "left"}}>
                    {configurableOptions}
                  </div>
                  {this.state.product.extension_attributes && this.state.product.extension_attributes.stock_salable.quantity !== 0 ? (<button type="submit" className="btn btn-primary" id="add-to-cart" onClick={this.addToCart.bind(this)}><i
                    className="fa fa-shopping-cart"></i> Add to cart
                  </button>) : 'Out of stock'}
                </p>
              </div>


              <div className="row" id="thumbs">
                {this.state.product.media_gallery_entries ? this.state.product.media_gallery_entries.map((media) => {
                  return (<div className="col-xs-4">
                    <a href={media.url} className="thumb">
                      <img src={media.url} alt=""
                           className="img-responsive"/>
                    </a>
                  </div>)
                }) : ''}
              </div>
            </div>
          </div>
          <div className="box" id="details">
            <p>
              <h4>Product details</h4>
              <p dangerouslySetInnerHTML={{__html: (this.state.product.flatten_custom_attributes ? this.state.product.flatten_custom_attributes.description : '')}}/>
              <hr/>
              <div className="social">
                <h4>Show it to your friends</h4>
                <p>
                  <a href="#" className="external facebook" data-animate-hover="pulse"><i
                    className="fa fa-facebook"></i></a>
                  <a href="#" className="external gplus" data-animate-hover="pulse"><i
                    className="fa fa-google-plus"></i></a>
                  <a href="#" className="external twitter" data-animate-hover="pulse"><i
                    className="fa fa-twitter"></i></a>
                  <a href="#" className="email" data-animate-hover="pulse"><i className="fa fa-envelope"></i></a>
                </p>
              </div>
            </p>
          </div>
          {relatedProducts.length > 0 ? this.buildRelatedHtml('You may also like', relatedProducts) : ''}
          {crossProducts.length > 0 ? this.buildRelatedHtml('Frequently bought together', crossProducts) : ''}
          {upsellProducts.length > 0 ? this.buildRelatedHtml('Perhaps you\'ll prefer...', upsellProducts) : ''}
        </div>
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

export default connect(
  null,
  (dispatch) => {
    return { onCartUpdated: () => { dispatch(cartUpdated()) } }
  }
)(Product)