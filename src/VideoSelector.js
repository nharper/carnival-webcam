var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function() {
    var lis = [];
    for (var i in this.props.videos) {
      var link = "https://www.youtube.com/watch?v=" + this.props.videos[i].id;
      lis.push(
        <li>
          <a href={link} target="_blank">
            {this.props.videos[i].name}
          </a>
        </li>
      );
    }
    return (
      <div>
        <h2>Available video streams</h2>
        <ul>
          {lis}
        </ul>
      </div>
    );
  }
});
