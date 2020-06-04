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
    this.state = {
      product: {},
      config: props.config
    };
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

  addToCart() {
    let self = this;
    cartHelper.addProductToCart(self.state.product.sku, 1).then(() => {
      self.props.onCartUpdated()
    });
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
              <p className="price">{product.price} {product.price ? this.state.config.currency_symbol : ''}</p>
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
    }

    return <div id="content">
      <div className="container">
        <div className="col-md-12">
          <ul className="breadcrumb">
            <li><Link to={"/"}>Home</Link></li>
            <li>{this.state.product.name}</li>
          </ul>
        </div>
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
                <p className="price">{this.state.product.price} {this.state.product.price ? this.state.config.currency_symbol : ''}</p>
                <p className="text-center buttons">
                  <div className="product-configurable-attributes">

                  </div>
                  <button type="submit" className="btn btn-primary" id="add-to-cart" onClick={this.addToCart.bind(this)}><i
                    className="fa fa-shopping-cart"></i> Add to cart
                  </button>
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