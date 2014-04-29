function Train(data) {
  this._raw = data;
};

Train.prototype.id = function() {
  return this._raw.id;
};

Train.prototype.timeTo = function() {
  return this._raw.timeTo;
};

Train.prototype.line = function() {
  return this._raw.line;
};

Train.prototype.location = function() {
  return this._raw.location;
};

Train.prototype.destination = function() {
  return this._raw.destination;
};

module.exports = Train;
