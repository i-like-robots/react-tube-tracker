/** @jsx React.DOM */
var React = require("react/addons");
var networkData = require("../../../app/common/data");
var Network = require("../../../app/component/network.jsx");

var stubComponent = require("../../lib/stub/component");
var stubPrediction = require("../../lib/stub/prediction");

describe("Network", function() {

  var instance;
  var container = document.createElement("div");
  var TestUtils = React.addons.TestUtils;

  afterEach(function() {
    if (instance && instance.isMounted()) {
      React.unmountComponentAtNode(instance.getDOMNode().parent);
    }
  });

  describe("Network", function() {

    beforeEach(function() {
      this.stubbed = stubComponent();
      this.original = Network.__get__("Line");
      Network.__set__("Line", this.stubbed);

      instance = TestUtils.renderIntoDocument(<Network networkData={networkData} />);
    });

    afterEach(function() {
      Network.__set__("Line", this.original);
    });

    it("should render a form for each line available from TrackerNet", function() {
      var lines = TestUtils.scryRenderedComponentsWithType(instance, this.stubbed);
      expect(lines.length).toBe(11);
    });

    it("should toggle open/closed status when clicking the toggle button", function() {
      var button = TestUtils.findRenderedDOMComponentWithTag(instance, "button");
      var initialState = instance.state.open;

      TestUtils.Simulate.click(button.getDOMNode());

      expect(instance.state.open).toBe(!initialState);
    });

  });

  describe("Line", function() {
    var Line = Network.__get__("Line");
    var submitSpy = jasmine.createSpy();

    beforeEach(function() {
      // Must be rendered to the container so that event listeners can be added
      instance = React.renderComponent(<Line networkData={networkData} lineCode="district" />, container);
      container.addEventListener("tt:update", submitSpy, false);

      instance.refs.station.getDOMNode().value = "940GZZLUEMB";
      TestUtils.Simulate.submit(instance.getDOMNode());
    });

    afterEach(function() {
      container.removeEventListener("tt:update", submitSpy, false);
    });

    it("should display the line name for the given line code", function() {
      var legend = TestUtils.findRenderedDOMComponentWithTag(instance, "legend");
      expect(legend.getDOMNode().textContent).toBe("District");
    });

    it("should trigger a custom event with selected line and station", function() {
      expect(submitSpy).toHaveBeenCalled();
      expect(submitSpy).toHaveBeenCalledWith(jasmine.any(CustomEvent));
      expect(submitSpy.calls.argsFor(0).pop().detail).toEqual(jasmine.objectContaining({
        station: "940GZZLUEMB",
        line: "district"
      }));
    });

  });

});
