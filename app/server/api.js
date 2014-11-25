var http = require("http");
var utils = require("../common/utils");
var networkData = require("../common/data");

function APIRequest(config) {
  this.config = config;
}

APIRequest.prototype.for = function(line, station) {
  this.line = line;
  this.station = station;
  return this;
};

APIRequest.prototype.get = function(callback) {
  if (!utils.isStationOnLine(this.line, this.station, networkData)) {
    return callback(null, "");
  }

  var formatCallback = this.format.bind(this);
  var groupedLines = utils.mergeGroupedLines(this.station, this.line, networkData);
  var path = "/Line/" + groupedLines.join(",") + "/Arrivals/" + this.station;
  var queryString = "?app_id=" + this.config.APP_ID + "&app_key=" + this.config.APP_KEY;

  var options = {
    path: path + queryString,
    hostname: "api.tfl.gov.uk"
  };

  var request = http.request(options, function(response) {
    var str = "";

    response.setEncoding("utf8");

    response.on("data", function(chunk) {
      str+= chunk;
    });

    response.on("end", function() {
      var responseJSON = formatCallback(str);

      if (responseJSON instanceof Error) {
        callback(responseJSON, null);
      }
      else {
        callback(null, responseJSON);
      }
    });
  });

  request.on("error", function(err) {
    callback(err);
    console.log(options.hostname + options.path);
  });

  request.end();
};

APIRequest.prototype.format = function(responseText, callback) {
  var parsedResponse = parseResponse(responseText);

  if (parsedResponse instanceof Error) {
    return parsedResponse;
  }

  return {
    request: {
      lineCode: this.line,
      stationCode: this.station
    },
    station: {
      lineName: networkData.lines[this.line],
      stationName: networkData.stations[this.station]
    },
    platforms: formatData(parsedResponse)
  };
};

function parseResponse(responseText) {
  var jsonData;

  try {
    jsonData = JSON.parse(responseText);
  }
  catch(e) {
    return new Error("Data could not be parsed");
  }

  return jsonData;
};

function formatData(responseData) {
  var formattedData = {};

  var sortedData = responseData.sort(function(a, b) {
    return a.timeToStation - b.timeToStation;
  });

  sortedData.forEach(function(record) {
    formattedData[record.platformName] = formattedData[record.platformName] || [];
    formattedData[record.platformName].push(record);
  });

  return formattedData;
};

module.exports = APIRequest;
