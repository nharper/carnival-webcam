var React = require('react');
var PghTime = require('./PghTime');

module.exports = React.createClass({
  propTypes: {
    channel: React.PropTypes.object.isRequired,
    id_store: React.PropTypes.object.isRequired,
    max_rows: React.PropTypes.number,
  },
  getDefaultProps: function() {
    return {max_rows: 15};
  },
  getInitialState: function() {
    return {ids: []};
  },
  addId: function(id_obj) {
    id_obj.time = PghTime();
    var ids = this.state.ids;
    ids.push(id_obj);
    this.setState({ids: ids});
  },
  componentDidMount: function() {
    this.props.channel.setCallback(this.addId);
  },
  render: function() {
    var ids = this.state.ids.map(function(id_obj) {
      return (
        <tr key={id_obj.time}>
          <td>{id_obj.time}</td><td>{this.props.id_store.prettyPrint(id_obj)}</td>
        </tr>
      );
    }.bind(this));
    return (
      <table>
        <tbody>
          {ids}
        </tbody>
      </table>
    );
  }
});
