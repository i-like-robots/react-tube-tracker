var Platform = require("./platform");

function Station(data) {
  this._raw = data;
}

Station.prototype.name = function() {
  return this._raw.name;
};

Station.prototype.platforms = function() {
  return this._raw.platforms.map(function(platform) {
    return new Platform(platform);
  });
};

module.exports = Station;
