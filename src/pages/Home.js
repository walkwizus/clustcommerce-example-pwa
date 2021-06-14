import React from "react";

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: null
    };
  }

  componentDidMount() {
    var self = this;
    getPageContent()
      .then(function(response) {
        return response.json()
      }).then(function (result) {
      self.setState({'page': result.data});
    });
  }

  render() {
    return <div className={"container"}>
      <div dangerouslySetInnerHTML={{__html: this.state.page ? this.state.page.content : ''}}>
      </div>
    </div>;
  }
}

function getPageContent() {
  var myHeaders = new Headers();
  myHeaders.append('x-clustcommerce-magento-origin', window.location.origin);

  return fetch('/__internal/page-content?urlKey=home', {headers: myHeaders});
}
