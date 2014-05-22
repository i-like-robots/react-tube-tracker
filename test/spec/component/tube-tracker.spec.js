/** @jsx React.DOM */
var React = require("react/addons");
var TubeTracker = require("../../../app/component/tube-tracker");
var networkData = require("../../../app/data");

var stubComponent = require("../../lib/stub/component");
var stubPrediction = require("../../lib/stub/prediction");

describe("Tube Tracker", function() {

  var instance;
  var container = document.createElement("div");
  var TestUtils = React.addons.TestUtils;
  var OriginalNetwork, StubbedNetwork, OriginalPredictions, StubbedPredictions;

  beforeEach(function() {
    // Stub out sub-components
    OriginalNetwork = TubeTracker.__get__("Network");
    StubbedNetwork = stubComponent();
    TubeTracker.__set__("Network", StubbedNetwork);

    OriginalPredictions = TubeTracker.__get__("Predictions");
    StubbedPredictions = stubComponent();
    TubeTracker.__set__("Predictions", StubbedPredictions);
  });

  afterEach(function() {
    TubeTracker.__set__("Network", OriginalNetwork);
    TubeTracker.__set__("Predictions", OriginalPredictions);
  });

  describe("initial state", function() {
    var stubs = ["?line=Z&station=XYZ", "?line=C&station=ROD"];

    beforeEach(function() {
      // A convenient way to test multiple stubs
      spyOn(TubeTracker.__get__("utils"), "getQueryString").and.returnValue(stubs.shift());
      instance = TestUtils.renderIntoDocument(<TubeTracker networkData={networkData} />);
    });

    it("should not set the line/station when the provided data is invalid", function() {
      expect(instance.state.line).toBe(null);
      expect(instance.state.station).toBe(null);
    });

    it("should set the line/station when the provided data is valid", function() {
      expect(instance.state.line).toBe("C");
      expect(instance.state.station).toBe("ROD");
    });

  });

  describe("on user input", function() {

    beforeEach(function() {
      spyOn(window.history, "pushState").and.stub();
      instance = TestUtils.renderIntoDocument(<TubeTracker networkData={networkData} />);
    });

    it("should not set the line/station when received data is invalid", function() {
      // There is no easy way to simulate custom events but component methods can be called directly
      instance.handleUpdate({ detail: { line: "Z", station: "XYZ" } });
      expect(window.history.pushState).not.toHaveBeenCalled();
    });

    it("should set the line/station when received data is valid", function() {
      instance.handleUpdate({ detail: { line: "C", station: "ROD" } });
      expect(window.history.pushState).toHaveBeenCalledWith(null, null, "?line=C&station=ROD");
    });

  });

});
