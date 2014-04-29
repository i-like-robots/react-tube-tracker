var Station = require("./station");

function Prediction(response) {
  this._raw = response;
};

Prediction.prototype.line = function() {
  return this._raw.line;
};

Prediction.prototype.station = function() {
  return new Station(this._raw.station);
};

module.exports = Prediction;
