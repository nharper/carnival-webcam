var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  // TODO: add propTypes
  changeVideo: function(id) {
    console.log('changeVideo ' + id);
    this.props.onSelectionChange(id);
  },
  render: function() {
    var lis = [];
    for (var i in this.props.videos) {
      lis.push(
        <li>
          <input
              type="radio"
              name="video_selector"
              value={i}
              key={i + ' input'}
              id={i}
              checked={this.props.active_video == i}
              onChange={this.changeVideo.bind(this, i)}
          />
          <label htmlFor={i} key={i + ' label'}>
            {this.props.videos[i].name}
          </label>
        </li>
      );
    }
    return (
      <div>
        <h2>Select Video stream</h2>
        <ul>
          {lis}
        </ul>
      </div>
    );
  }
});
