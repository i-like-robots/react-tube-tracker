/** @jsx React.DOM */
var React = require("react");
var Predictions = require("./predictions");
var Network = require("./network");
var utils = require("../common/utils");

var TubeTracker = React.createClass({

  validateUserInput: function(line, station) {
    return utils.isStationOnLine(line, station, this.props.networkData);
  },

  formatAndValidateUserInput: function(userLine, userStation) {
    var line = null;
    var station = null;

    // We could have added extra states for invalid data
    // but it's easier simply to ignore it.
    if (this.validateUserInput(userLine, userStation)) {
      line = userLine;
      station = userStation;
    }

    return {
      line: line,
      station: station
    };
  },

  getInitialState: function() {
    return this.formatAndValidateUserInput(
      utils.queryStringProperty(utils.getQueryString(), "line"),
      utils.queryStringProperty(utils.getQueryString(), "station")
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

  componentWillMount: function() {
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
          <Predictions line={this.state.line} station={this.state.station} networkData={this.props.networkData} />
        </div>
      </div>
    );
  }

});

module.exports = TubeTracker;
