var Station = require("./station");

function Prediction(xmlDoc) {
  this._raw = xmlDoc;
};

Prediction.prototype.line = function() {
  var nodes = this._raw.getElementsByTagName('LineName');
  return nodes[0].textContent;
};

Prediction.prototype.station = function() {
  var nodes = this._raw.getElementsByTagName('S');
  return new Station(nodes[0]);
};

module.exports = Prediction;
