/** @jsx React.DOM */
var React = require("react");
var utils = require("../common/utils");
var APIResponse = require("../common/api-response");

var Predictions = React.createClass({

  getInitialState: function() {
    return { status: this.props.line && this.props.station ? "loading" : "welcome" };
  },

  fetchPredictions: function(line, station) {
    var api = utils.apiRequestURL(this.props.line, this.props.station, this.props.config);

    this.setState({ status: "loading" });

    utils.httpRequest(api, this.predictionsSuccess, this.predictionsError);
  },

  predictionsError: function(error) {
    this.setState({
      status: "error",
      predictionData: null
    });

    // Pipe the error into your error logging setup
    // Airbrake.push({ error: error });
  },

  predictionsSuccess: function(responseData) {
    var predictionData = utils.parseJSON(responseData);

    if (predictionData instanceof Error) {
      return this.predictionsError(predictionData);
    }

    this.setState({
      status: predictionData.length ? "success" : "empty",
      predictionData: new APIResponse(predictionData)
    });
  },

  resetPoll: function(line, station) {
    this.fetchPredictions(line, station);

    if (this.poll) {
      clearInterval(this.poll);
    }

    this.poll = setInterval(this.fetchPredictions.bind(this, line, station), 1000 * 30);
  },

  componentDidMount: function() {
    if (this.props.line && this.props.station) {
      this.resetPoll(this.props.line, this.props.station);
    }
  },

  componentWillUnmount: function() {
    clearInterval(this.poll);
  },

  componentWillReceiveProps: function(newProps) {
    this.resetPoll(newProps.line, newProps.station);
  },

  shouldComponentUpdate: function(newProps, newState) {
    // Only update when line/station changes or new predictions load otherwise the
    // loading notice will be displayed when refreshing current predictions.
    return this.props !== newProps || this.state.predictionData !== newState.predictionData;
  },

  render: function() {
    if (this.state.status === "success") {
      return <DepartureBoard ref="content" predictionData={this.state.predictionData} />;
    }

    return <Notice ref="content" type={this.state.status} />;
  }

});

var DepartureBoard = React.createClass({

  render: function() {
    var predictionData = this.props.predictionData;

    var generatedPlatforms = predictionData.platforms().map(function(platform, i) {
      return (
        <div className="platform" key={"platform-" + i}>
          <h2 className="platform__heading">{platform}</h2>
          <Trains trains={predictionData.arrivalsAtPlatform(platform)} />
        </div>
      );
    });

    // Heading does not account for circle line mapping, meh
    return (
      <div className="departures">
        <h1 className="departures__heading">{predictionData.station()}</h1>
        {generatedPlatforms}
      </div>
    );
  }

});

var Trains = React.createClass({

  render: function() {
    var generatedTrains = this.props.trains.map(function(train) {
      var timeTo = utils.formattedTimeUntil(train.timeToStation);

      return (
        <tr className="trains__arrival" key={"train-" + train.vehicleId}>
          <td>{timeTo === "0:00" ? "-" : timeTo}</td>
          <td>{train.destinationName}</td>
          <td>{train.currentLocation}</td>
        </tr>
      );
    });

    return (
      <table className="trains">
        <thead>
          <tr>
            <th>Time</th>
            <th>Destination</th>
            <th>Current location</th>
          </tr>
        </thead>
        <tbody>
          {generatedTrains}
        </tbody>
      </table>
    );
  }

});

var Notice = React.createClass({

  statusText: function(status) {
    var text;

    switch (status) {
      case "error":
        text = "Sorry an error occurred, please try again.";
        break;
      case "loading":
        text = "Loading predictions…";
        break;
      case "empty":
        text = "There are no arrivals or departures scheduled from this station.";
        break;
      case "welcome":
        text = "Please choose a station.";
        break;
    }

    return text;
  },

  render: function() {
    return (
      <div className={"notice notice--" + this.props.type}>
        <p>{this.statusText(this.props.type)}</p>
      </div>
    );
  }

});

module.exports = Predictions;
