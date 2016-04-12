var AudioControl = require('./AudioControl');
var Clock = require('./Clock');
var IDList = require('./IDList');
var IDStore = require('./IDStore');
var React = require('react');

module.exports = React.createClass({
  propTypes: {
    streams: React.PropTypes.arrayOf(function(propValue, key, componentName) {
      if (!propValue[key].name || !propValue[key].location) {
        return new Error('Prop ' + propValue[key] + ' is invalid');
      }
    }),
  },
  getInitialState: function() {
    return {id_store: IDStore};
  },
  componentDidMount: function() {
    for (var id in this.props.callsigns) {
      IDStore.setCallsign(id, this.props.callsigns[id]);
    }
  },
  render: function() {
    var streams = [];
    for (var i in this.props.streams) {
      var stream = this.props.streams[i];
      streams.push(
        <AudioControl
            key={stream.name}
            name={stream.name}
            url={stream.location}
            id_store={this.state.id_store}
        />
      );
    }
    return (
      <div id="sidebar-wrapper">
        <div id="sidebar">
          {this.props.children}
          <Clock />

          <div className="controls">
            <h2>Audio controls</h2>
            {streams}
            <IDList />
          </div>
        </div>
      </div>
    );
  }
});
