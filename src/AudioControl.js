var React = require('react');
var RadioChannel = require('./RadioChannel');

module.exports = React.createClass({
  componentDidMount: function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var channel = new RadioChannel(this.props.path, context);
    this.setState({channel: channel});
  },
  render: function() {
    return (
      <span>Testing audio stuff for {this.props.path}</span>
    );
  }
});
