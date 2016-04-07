var React = require('react');
var Audio = require('./Audio');
var Video = require('./Video');

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
      this.setState({loading: false});
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
        <div className='container'>
          {error}
          <Video id={this.state.config.video} />
          <div id="sidebar-wrapper">
            <Audio path={this.state.config.streams[0].location} name={this.state.config.streams[0].name} />
          </div>
        </div>
      );
    }
  }
});
