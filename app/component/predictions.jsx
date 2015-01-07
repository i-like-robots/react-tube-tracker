var React = require("react");
var utils = require("../common/utils");

var Predictions = React.createClass({

  getInitialState: function() {
    return {
      status: this.props.initialData ? "success" : "welcome",
      predictionData: this.props.initialData
    };
  },

  fetchPredictions: function(line, station) {
    this.setState({ status: "loading" });
    utils.httpRequest(utils.apiRequestURL(line, station), this.predictionsSuccess, this.predictionsError);
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
    if (!responseData.length) {
      return this.predictionsError(new Error("Invalid API response"));
    }

    this.setState({
      status: "success",
      predictionData: JSON.parse(responseData)
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
    var station = this.props.predictionData.station;
    var platforms = this.props.predictionData.platforms;

    var generatedPlatforms = Object.keys(platforms).map(function(platform, i) {
      return (
        <div className="platform" key={"platform-" + i}>
          <h2 className="platform__heading">{platform}</h2>
          <Trains trains={platforms[platform]} />
        </div>
      );
    });

    return (
      <div className="departures">
        <h1 className="departures__heading">{station.stationName + " Station, " + station.lineName + " Line"}</h1>
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
          <td>{train.towards}</td>
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
