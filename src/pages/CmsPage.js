import React from "react";
import { connect } from 'react-redux'

export default class CmsPage extends React.Component {
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

  componentWillReceiveProps(nextProps) {
    this.componentDidMount()
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
  var path = window.location.pathname;

  return fetch('/__internal/page-content?urlKey=' + (path !== "/" ? path.substr(1) : 'home'), {headers: myHeaders});
}
