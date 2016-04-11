var React = require('react');

var PghTime = require('./PghTime');

module.exports = React.createClass({
  getInitialState: function() {
    return {time: PghTime()};
  },
  componentDidMount: function() {
    window.setInterval(function() {
      this.setState({time: PghTime()});
    }.bind(this), 500);
  },
  render: function() {
    return (
      <p className="time">Midway time: {this.state.time}</p>
    );
  }
});
