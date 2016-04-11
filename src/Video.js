var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
  },
  getInitialState: function() {
    return {width: null, height: null};
  },
  resize: function() {
    var parentNode = ReactDOM.findDOMNode(this).parentNode;
    var width = parentNode.clientWidth;
    var height = parentNode.clientHeight;
    if (width / height < 16 / 9) {
      height = width * 9 / 16;
    } else {
      width = height * 16 / 9;
    }
    this.setState({width: width, height: height});
  },
  componentDidMount: function() {
    window.addEventListener('resize', this.resize);
    this.resize();
  },
  render: function() {
    var url = "https://www.youtube.com/embed/" + this.props.id + "?autoplay=1";
    return (
      <iframe src={url} id="cam_image" width={this.state.width} height={this.state.height}></iframe>
    );
  }
});
