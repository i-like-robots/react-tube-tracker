function Train(data) {
  this._raw = data;
};

Train.prototype.id = function() {
  return this._raw.getAttribute('LCID');
};

Train.prototype.timeTo = function() {
  return this._raw.getAttribute('TimeTo');
};

Train.prototype.line = function() {
  return this._raw.getAttribute('LN');
};

Train.prototype.location = function() {
  return this._raw.getAttribute('Location');
};

Train.prototype.destination = function() {
  return this._raw.getAttribute('Destination');
};
