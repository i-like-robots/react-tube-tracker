/** @jsx React.DOM */
var React = require("react");
var Predictions = require("./predictions");
var Network = require("./network");
var utils = require("../common/utils");

var TubeTracker = React.createClass({

  formatAndValidateUserInput: function(userLine, userStation) {
    var line = null;
    var station = null;

    // We could have added extra states for invalid data
    // but it's easier simply to ignore it.
    if (utils.isStationOnLine(userLine, userStation, this.props.networkData)) {
      line = userLine;
      station = userStation;
    }

    return {
      line: line,
      station: station
    };
  },

  getInitialState: function() {
    var initialData = this.props.initialData;

    return this.formatAndValidateUserInput(
      initialData ? initialData.request.lineCode : null,
      initialData ? initialData.request.stationCode : null
    );
  },

  handleUpdate: function(e) {
    var input = this.formatAndValidateUserInput(e.detail.line, e.detail.station);

    if (input.line && input.station) {
      this.setState(input);
    }
  },

  componentWillUpdate: function(newProps, newState) {
    // When the state changes push a query string so users can bookmark
    // or share the link to a chosen departure board.
    window.history.pushState(null, null, utils.formatQueryString(newState));
  },

  componentDidMount: function() {
    window.addEventListener("tt:update", this.handleUpdate, false);
  },

  componentWillUnmount: function() {
    window.removeEventListener("tt:update", this.handleUpdate, false);
  },

  render: function() {
    return (
      <div className="layout">
        <div className="layout__sidebar">
          <Network networkData={this.props.networkData} />
        </div>
        <div className="layout__content">
          <Predictions line={this.state.line} station={this.state.station} networkData={this.props.networkData} initialData={this.props.initialData} />
        </div>
      </div>
    );
  }

});

module.exports = TubeTracker;
