var React = require("react");

module.exports = function stub(mount, unmount) {
  var mixins = [];

  if (mount) {
    mixins.push({
      componentDidMount: function() {
        mount.call(this);
      }
    });
  }

  if (unmount) {
    mixins.push({
      componentWillUnmount: function() {
        unmount.call(this);
      }
    });
  }

  return React.createClass({
    mixins: mixins,
    render: function() {
      return React.DOM.div();
    }
  });
};
