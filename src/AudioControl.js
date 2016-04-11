var React = require('react');
var RadioChannel = require('./RadioChannel');

module.exports = React.createClass({
  getInitialState: function() {
    return {vol: 100, left: true, right: true};
  },
  changeVolume: function() {
    this.setState({vol: this.refs.vol.value});
  },
  toggleLeft: function() {
    this.setState({left: !this.state.left});
  },
  toggleRight: function() {
    this.setState({right: !this.state.right});
  },
  componentDidMount: function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var channel = new RadioChannel(this.props.url, context);
    this.setState({channel: channel});
  },
  componentDidUpdate: function() {
    this.state.channel.setLeftGain(this.state.left ? this.state.vol / 100 : 0);
    this.state.channel.setRightGain(this.state.right ? this.state.vol / 100 : 0);
  },
  render: function() {
    var vol_display_level = Math.min(3, Math.ceil(this.state.vol * 4 / 100));
    var left_class = this.state.left ? 'l' : 'l muted';
    var right_class = this.state.right ? 'r' : 'r muted';
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
          <a href="#" className={left_class} onClick={this.toggleLeft}>L</a><span> </span>
          <a href="#" className={right_class} onClick={this.toggleRight}>R</a>
        </span>
        <p>TODO: ID table</p>
      </div>
    );
  }
});
