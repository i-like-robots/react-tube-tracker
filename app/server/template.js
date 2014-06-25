var fs = require("fs");
var path = require("path");

function Template(target) {
  this.target = target;
}

Template.prototype.with = function(data) {
  this.data = data;
  return this;
};

Template.prototype.render = function(callback) {
  var fullPath = path.resolve(__dirname, this.target);

  fs.readFile(fullPath, { encoding: "utf8" }, function(err, data) {
    if (err) {
      return callback(err);
    }

    callback(null, data.replace("{{yield}}", this.data));
  }.bind(this));
};

module.exports = Template;
