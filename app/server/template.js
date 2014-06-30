var fs = require("fs");
var path = require("path");

function Template(target) {
  this.target = target;
}

Template.prototype.render = function(data, callback) {
  var fullPath = path.resolve(__dirname, this.target);

  fs.readFile(fullPath, { encoding: "utf8" }, function(err, template) {
    if (err) {
      return callback(err);
    }

    var rendered = template.replace(/\{\{yield:([a-z0-9_]+)\}\}/g, function(match, property) {
      return data[property];
    });

    callback(null, rendered);
  });
};

module.exports = Template;
