/** @jsx React.DOM */
var React = require("react");
var utils = require("../common/utils");

var Network = React.createClass({

  getInitialState: function() {
    return {
      collapsible: window.innerWidth <= 800,
      open: false
    };
  },

  handleToggle: function() {
    this.setState({ open: !this.state.open });
  },

  handleResize: function() {
    this.setState({ collapsible: window.innerWidth <= 800 });
  },

  componentWillMount: function() {
    // Simple event debouncing to avoid multiple recalculations
    this.debounce = utils.debounceEvent(this.handleResize, 250);
    window.addEventListener("resize", this.debounce, false);
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.debounce, false);
  },

  render: function() {
    var networkData = this.props.networkData;
    var networkLineCodes = Object.keys(networkData.lines);

    var toggleText = this.state.open ? "Close" : "Open";
    var toggleClass = this.state.collapsible ? (this.state.open ? "is-open" : "is-closed") : "is-static";

    var generatedForms = networkLineCodes.map(function(lineCode, i) {
      return <Line networkData={networkData} lineCode={lineCode} key={i} />;
    }, this);

    return (
      <div className={"network " + toggleClass}>
        {generatedForms}
        <button type="button" className="network__toggle" onClick={this.handleToggle}>{toggleText}</button>
      </div>
    );
  }

});

var Line = React.createClass({

  handleSubmit: function(event) {
    event.preventDefault();

    // Dispatch an event for other components to capture
    var updateEvent = new CustomEvent("tt:update", {
      detail: {
        station: this.refs.station.getDOMNode().value,
        line: this.props.lineCode
      },
      bubbles: true
    });

    this.refs.form.getDOMNode().dispatchEvent(updateEvent);
  },

  render: function() {
    var lineCode = this.props.lineCode;
    var networkData = this.props.networkData;
    var stationsOnThisLine = networkData.stationsOnLines[lineCode];

    var generatedOptions = stationsOnThisLine.map(function(stationCode, i) {
      return <option value={stationCode} key={i}>{networkData.stations[stationCode]}</option>;
    });

    return (
      <form ref="form" onSubmit={this.handleSubmit}>
        <fieldset className={"network__line network__line--" + lineCode}>
          <legend>{networkData.lines[lineCode]}</legend>
          <input type="hidden" name="line" value={lineCode} />
          <select name="station" ref="station">{generatedOptions}</select>
          <button type="submit" title="View train times">Go</button>
        </fieldset>
      </form>
    );
  }

});

module.exports = Network;
