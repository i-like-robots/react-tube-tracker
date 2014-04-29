var Train = require("./train");

function Platform(data) {
  this._raw = data;
};

Platform.prototype.name = function() {
  return this._raw.name;
};

Platform.prototype.number = function() {
  return this._raw.number;
};

Platform.prototype.trains = function() {
  return this._raw.trains.map(function(train) {
    return new Train(train);
  });
};

module.exports = Platform;
