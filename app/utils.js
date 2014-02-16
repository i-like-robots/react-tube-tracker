var utils = {

  debounceEvent: function(callback, wait) {
    var timeout;

    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(callback, wait);
    };
  },

  httpRequest: function(url, success, error) {
    var request = new XMLHttpRequest;

    request.open("GET", url);

    request.onload = function() {
      if (this.status === 200) {
        success(this.responseXML);
      }
      else {
        error(new Error(this.status));
      }
    };

    request.onerror = function() {
      error(this.status);
    };

    request.send();
  },

  proxyRequestURL: function(url) {
    var query = "select * from xml where url='" + url + "'";
    return "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query);
  },

  validateResponse: function(responseDoc) {
    return responseDoc.getElementsByTagName("S").length === 1;
  },

  getQueryString: function() {
    return window.location.search.replace(/^\?/, "").replace(/\/$/, "");
  },

  formatQueryString: function(properties) {
    var property;
    var queryString = [];

    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        queryString.push("" + property + "=" + properties[property]);
      }
    }

    return "?" + queryString.join("&");
  },

  queryStringProperty: function(queryString, prop) {
    var pairs = queryString.split("&");
    var properties = {};

    pairs.forEach(function(pair) {
      pair = pair.split("=");
      properties[ pair[0] ] = pair[1];
    });

    return properties[prop];
  },

  isLine: function(line, data) {
    return line in data.lines;
  },

  isStation: function(station, data) {
    return station in data.stations;
  },

  isStationOnLine: function(line, station, data) {
    return this.isLine(line, data) && this.isStation(station, data) &&
      data.stationsOnLines[line].indexOf(station) >= 0;
  },

  mapCircleLineStation: function(station, data) {
    return data.circleLineMap[station];
  }

};
