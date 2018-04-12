var AudioControl = require('./AudioControl');
var Clock = require('./Clock');
var React = require('react');

module.exports = React.createClass({
  propTypes: {
    streams: React.PropTypes.arrayOf(function(propValue, key, componentName) {
      if (!propValue[key].name || !propValue[key].location) {
        return new Error('Prop ' + propValue[key] + ' is invalid');
      }
    }),
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
          </div>
        </div>
      </div>
    );
  }
});
