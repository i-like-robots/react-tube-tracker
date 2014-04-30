/** @jsx React.DOM */
var React = require("react");

exports.forAsync = function(callback) {
  return React.createClass({
    componentDidMount: function() {
      callback.call(this);
    },
    render: function() {
      return <div />;
    }
  });
};

exports.forSync = function() {
  return React.createClass({
    render: function() {
      return <div />;
    }
  });
};
