var React = require('react');
var Sidebar = require('./Sidebar');
var Video = require('./Video');
var VideoSelector = require('./VideoSelector');

module.exports = React.createClass({
  getInitialState: function() {
    return {loading: true, config:{}, active_video: 0};
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
  changeVideo: function(video_index) {
    this.setState({active_video: video_index});
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
          <Video id={this.state.config.videos[this.state.active_video].id} />
          <Sidebar
              streams={this.state.config.streams}
              callsigns={this.state.config.callsigns}>
            <VideoSelector
                videos={this.state.config.videos}
                active_video={this.state.active_video}
                onSelectionChange={this.changeVideo} />
          </Sidebar>
        </div>
      );
    }
  }
});
