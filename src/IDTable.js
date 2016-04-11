var React = require('react');
var PghTime = require('./PghTime');
var IDStore = require('./IDStore');

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
    return {ids: [], counter: 0};
  },
  addId: function(id_obj) {
    if (!IDStore.shouldDisplay(id_obj)) {
      return;
    }
    id_obj.time = PghTime();
    id_obj.key = this.state.counter;
    this.setState({counter: this.state.counter + 1});
    var ids = this.state.ids;
    ids.unshift(id_obj);
    while (ids.length > this.props.max_rows) {
      ids.pop();
    }
    this.setState({ids: ids});
  },
  componentDidMount: function() {
    this.props.channel.setCallback(this.addId);
  },
  render: function() {
    var ids = this.state.ids.map(function(id_obj) {
      return (
        <tr key={id_obj.key}>
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
