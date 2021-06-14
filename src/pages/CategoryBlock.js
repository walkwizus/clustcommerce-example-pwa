import React from "react";

export default class CategoryBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: null
    };
  }

  componentDidMount() {
    var self = this;
    getPageContent()
      .then(function(response) {
        return response.json()
      }).then(function (result) {
      self.setState({'category': result.data});
    });
  }

  componentWillReceiveProps(nextProps) {
    this.componentDidMount()
  }

  render() {
    return <div className={"container"}>
      <div dangerouslySetInnerHTML={{__html: this.state.category && this.state.category.block ? this.state.category.block.data.content : ''}}>
      </div>
    </div>;
  }
}

function getPageContent() {
  var myHeaders = new Headers();
  myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);
  var path = window.location.pathname;

  return fetch('/__internal/page-content?urlKey=' + path.substr(1), {headers: myHeaders});
}