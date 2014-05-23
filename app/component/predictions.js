/** @jsx React.DOM */
var React = require("react");
var Prediction = require("../model/prediction");
var utils = require("../common/utils");

var Predictions = React.createClass({

  getInitialState: function() {
    return { status: this.props.line && this.props.station ? "loading" : "welcome" };
  },

  fetchPredictions: function(line, station) {
    // The circle line isn't defined in the API but shares platforms with other lines
    if (line === "O") {
      line = utils.mapCircleLineStation(station, this.props.networkData);
    }

    var api = "http://cloud.tfl.gov.uk/TrackerNet/PredictionDetailed/" + line + "/" + station;

    this.setState({ status: "loading" });

    // The TrackerNet API does not support cross-origin requests so we must use a proxy
    utils.httpRequest(utils.proxyRequestURL(api), this.predictionsSuccess, this.predictionsError);
  },

  predictionsError: function(error) {
    this.setState({
      status: "error",
      predictionData: null
    });

    // Pipe the error into your error logging setup
    // Airbrake.push({ error: error });
  },

  predictionsSuccess: function(responseDoc) {
    // Because we're using a proxy it will return a 200 and XML even if the
    // TrackerNet API is unavailable or request was invalid.
    if (!utils.validateResponse(responseDoc)) {
      return this.predictionsError(new Error("Invalid API response"));
    }

    this.setState({
      status: "success",

      // Dealing with XML in the browser is so ugly that I've
      // used 'models' to abstract it away.
      predictionData: new Prediction(responseDoc)
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
    var station = predictionData.station();

    var generatedPlatforms = station.platforms().map(function(platform) {
      return (
        <div className="platform" key={"platform-" + platform.number()}>
          <h2 className="platform__heading">{platform.name()}</h2>
          <Trains trains={platform.trains()} />
        </div>
      );
    });

    // Heading does not account for circle line mapping, meh
    return (
      <div className="departures">
        <h1 className="departures__heading">{station.name() + " " + predictionData.line()}</h1>
        {generatedPlatforms}
      </div>
    );
  }

});

var Trains = React.createClass({

  render: function() {
    var generatedTrains = this.props.trains.map(function(train) {
      return (
        <tr className="trains__arrival" key={"train-" + train.id()}>
          <td>{train.timeTo()}</td>
          <td>{train.destination()}</td>
          <td>{train.location()}</td>
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
        text = "Loading predictions…"
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
