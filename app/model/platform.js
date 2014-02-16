function Platform(data) {
  this._raw = data;
};

Platform.prototype.name = function() {
  return this._raw.getAttribute('N');
};

Platform.prototype.number = function() {
  return this._raw.getAttribute('Num');
};

Platform.prototype.trains = function() {
  var trains = [];
  var nodes = this._raw.getElementsByTagName('T');

  if (nodes.length > 5) {
    nodes = Array.prototype.slice.call(nodes, 0, 5);
  }

  Array.prototype.forEach.call(nodes, function(node) {
    trains.push(new Train(node));
  });

  return trains;
};
