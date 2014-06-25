/** @jsx React.DOM */
var React = require("react");
var networkData = require("../common/data");
var Template = require("../server/template");
var TubeTracker = require("../component/tube-tracker");

function Bootstrap(data) {
  this.data = data;
}

Bootstrap.prototype.load = function(callback) {
  var staticHTML = React.renderComponentToString(<TubeTracker networkData={networkData} initialData={this.data} />);
  new Template("../view/index.html").with(staticHTML).render(callback);
};

module.exports = Bootstrap;
