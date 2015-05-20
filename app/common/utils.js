exports.debounceEvent = function(callback, wait) {
  var timeout;

  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(callback, wait);
  };
};

exports.httpRequest = function(url, success, error) {
  var request = new XMLHttpRequest;

  request.open("GET", url);

  request.onload = function() {
    if (this.status === 200) {
      success(this.responseText);
    }
    else {
      error(new Error(this.status));
    }
  };

  request.onerror = function() {
    error(new Error(this.status));
  };

  request.send();
};

exports.apiRequestURL = function(line, station) {
  return "/api/" + line + "/" + station;
};

exports.formattedTimeUntil = function(timeTo) {
  var minutes = Math.round(timeTo / 60);
  var seconds = Math.round((timeTo - (minutes * 60)) / 30) * 30;
  return "" + minutes + ":" + (seconds < 10 ? "0" : "") + (seconds > 0 ? seconds : "0");
};

exports.getQueryString = function() {
  return window.location.search;
};

exports.formatQueryString = function(properties) {
  var property;
  var queryString = [];

  for (property in properties) {
    if (properties.hasOwnProperty(property)) {
      queryString.push("" + property + "=" + properties[property]);
    }
  }

  return "?" + queryString.join("&");
};

exports.queryStringProperty = function(queryString, prop) {
  var pairs = queryString.replace(/^\?/, "").replace(/\/$/, "").split("&");
  var properties = {};

  pairs.forEach(function(pair) {
    pair = pair.split("=");
    properties[ pair[0] ] = pair[1];
  });

  return properties[prop];
};

exports.isLine = function(line, data) {
  return line in data.lines;
};

exports.isStation = function(station, data) {
  return station in data.stations;
};

exports.isStationOnLine = function(line, station, data) {
  return this.isLine(line, data) && this.isStation(station, data) &&
    data.stationsOnLines[line].indexOf(station) >= 0;
};

exports.mergeGroupedLines = function(station, line, data) {
  var lines = [line];

  if (station in data.sharedPlatforms) {
    var lineGroups = data.sharedPlatforms[station].filter(function(lineGroup) {
      return lineGroup.indexOf(line) > -1;
    });

    // Flatten array of arrays
    lines = lines.concat.apply(lines, lineGroups);

    // Remove duplicates
    lines = lines.filter(function(line, i) {
      return lines.indexOf(line) == i;
    });
  }

  return lines;
};
