var Platform = require("./platform");

function Station(data) {
  this._raw = data;
}

Station.prototype.name = function() {
  return this._raw.getAttribute('N');
};

Station.prototype.platforms = function() {
  var platforms = [];
  var nodes = this._raw.getElementsByTagName('P');

  Array.prototype.forEach.call(nodes, function(node) {
    platforms.push(new Platform(node));
  });

  return platforms;
};

module.exports = Station;
