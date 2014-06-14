var http = require("http");

function APIRequest(config) {
  this.config = config;
  return this;
}

APIRequest.prototype.for = function(line, station) {
  this.line = line;
  this.station = station;
  return this;
};

APIRequest.prototype.get = function(callback) {
  var path = "/Line/" + this.line + "/Arrivals/" + this.station;
  var queryString = "?app_id=" + this.config.APP_ID + "&app_key=" + this.config.APP_KEY;
  var options = {
    path: path + queryString,
    hostname: "api.beta.tfl.gov.uk",
    headers: { "Content-Type": "application/json" }
  };

  var request = http.request(options, function(response) {
    var str = "";

    response.setEncoding("utf8");

    response.on("data", function(data) {
      str+= data;
    });

    response.on("end", function() {
      callback(null, formatData(parseResponse(str)));
    });
  });

  request.on("error", function(err) {
    callback(err);
  });

  request.end();
};

function parseResponse(data) {
  var jsonData;

  try {
    jsonData = JSON.parse(data);
  }
  catch(e) {
    return new Error("Data could not be parsed");
  }

  return jsonData;
}

function formatData(data) {
  var formattedData = {};

  var sortedData = data.sort(function(a, b) {
    return a.timeToStation - b.timeToStation;
  });

  sortedData.forEach(function(record) {
    formattedData[record.platformName] = formattedData[record.platformName] || [];
    formattedData[record.platformName].push(record);
  });

  return formattedData;
}

module.exports = APIRequest;
