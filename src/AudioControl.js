var React = require('react');
var RadioChannel = require('./RadioChannel');

module.exports = React.createClass({
  getInitialState: function() {
    return {vol: 100, left: true, right: true};
  },
  changeVolume: function() {
    // TODO: wire this up to the audio node.
    this.setState({vol: this.refs.vol.value});
  },
  componentDidMount: function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var channel = new RadioChannel(this.props.url, context);
    this.setState({channel: channel});
  },
  render: function() {
    var vol_display_level = Math.min(3, Math.ceil(this.state.vol * 4 / 100));
    return (
      <div>
        <h3>{this.props.name}</h3>
        <span className="controls">
          <img className="vol" src={"/ic/l" + vol_display_level + ".png"} />
          <span> </span>
          <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={this.state.vol}
              onChange={this.changeVolume}
              ref="vol"
          /><span> </span>
          <a href="#" className="l">L</a><span> </span>
          <a href="#" className="r">R</a>
        </span>
        <p>TODO: ID table</p>
      </div>
    );
  }
});
