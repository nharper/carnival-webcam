var AudioControl = require('./AudioControl');
var Clock = require('./Clock');
var IDList = require('./IDList');
var React = require('react');

module.exports = React.createClass({
  render: function() {
    var streams = '';
    return (
      <div id="sidebar-wrapper">
        <div id="sidebar">
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
