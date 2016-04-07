var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {loading: true, config:{}};
  },
  componentDidMount: function() {
    var configRequest = new XMLHttpRequest();
    configRequest.onload = function(xhr_event) {
      var xhr = xhr_event.target;
      if (xhr.status != 200) {
        this.setState({error: "Config failed to load"});
        console.log('error loading config');
        return;
      }
      try {
        var config = JSON.parse(xhr.responseText);
        this.setState({config: config});
      } catch (e) {
        this.setState({error: "Error parsing config: " + e});
      }
    }.bind(this);
    configRequest.open('GET', 'config.json', true);
    configRequest.send();
  },
  render: function() {
    var error = null;
    if (this.state.error) {
      error = <div className="error">{this.state.error}</div>;
    }
    if (this.state.loading) {
      return (
        <div>
          {error}
          <div id="loading">Loading...</div>
        </div>
      );
    } else {
      // TODO: finish this half
      return (
        <div>
          {error}
          <div id="sidebar-wrapper"></div>
        </div>
      );
    }
  }
});
