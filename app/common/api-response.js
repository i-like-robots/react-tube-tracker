function APIResponse(data, line, station) {
  this.data = data;
}

APIResponse.prototype.station = function() {
  return this.data[0].stationName + ", " + this.data[0].lineName + " Line";
};

APIResponse.prototype.platforms = function() {
  var platforms = [];

  this.data.forEach(function(record) {
    if (record.modeName !== "tube") {
      return;
    }

    if (record.platformName && platforms.indexOf(record.platformName) === -1) {
      platforms.push(record.platformName);
    }
  });

  return platforms;
};

APIResponse.prototype.arrivalsAtPlatform = function(platform) {
  var arrivals = [];

  this.data.forEach(function(record) {
    if (record.modeName !== "tube") {
      return;
    }

    if (record.platformName === platform) {
      arrivals.push(record);
    }
  });

  return arrivals.sort(function(a, b) {
    return a.timeToStation - b.timeToStation;
  });
};

module.exports = APIResponse;
