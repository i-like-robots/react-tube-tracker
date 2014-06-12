/** @jsx React.DOM */
var React = require("react/addons");
var Predictions = require("../../../app/component/predictions");

var stubComponent = require("../../lib/stub/component");
var stubPrediction = require("../../lib/stub/prediction");
var stubAPIResponse = require("../../lib/stub/api-response");

describe("Predictions", function() {

  var instance;
  var container = document.createElement("div");
  var TestUtils = React.addons.TestUtils;

  beforeEach(function() {
    // Stub out AJAX requests with Jasmine's AJAX util
    jasmine.Ajax.install();
    jasmine.Ajax.stubRequest("api/success").andReturn({ status: 200 });
    jasmine.Ajax.stubRequest("api/failure").andReturn({ status: 500 });
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();

    // Teardown any fixtures that have been rendered into the container
    if (instance && instance.isMounted()) {
      React.unmountComponentAtNode(instance.getDOMNode().parent);
    }
  });

  describe("Predictions", function() {

    describe("initial state", function() {
      var Notice = Predictions.__get__("Notice");

      beforeEach(function() {
        // Prevent any HTTP requests, just test the initial state
        spyOn(Predictions.__get__("utils"), "httpRequest").and.stub();
      });

      it("should display the welcome message when a line/station is not set", function() {
        instance = React.renderComponent(<Predictions line={null} station={null} config={{}} />, container);

        expect(TestUtils.isComponentOfType(instance.refs.content, Notice)).toBe(true);
        expect(instance.state.status).toBe("welcome");
      });

      it("should display the loading message when a line/station is set and valid", function() {
        instance = React.renderComponent(<Predictions line="district" station="940GZZLUEMB" config={{}} />, container);

        expect(TestUtils.isComponentOfType(instance.refs.content, Notice)).toBe(true);
        expect(instance.state.status).toBe("loading");
      });

    });

    describe("with valid departure data", function() {

      beforeEach(function(done) {
        spyOn(Predictions.__get__("utils"), "validateResponse").and.returnValue(true);
        spyOn(Predictions.__get__("utils"), "apiRequestURL").and.returnValue("api/success");

        // The entire component stack should not be tested and must be stubbed. My mock
        // component also permits testing async component rendering.
        this.stubbed = stubComponent(done);
        this.original = Predictions.__get__("DepartureBoard");
        Predictions.__set__("DepartureBoard", this.stubbed);

        instance = React.renderComponent(<Predictions line="district" station="940GZZLUEMB" config={{}} />, container);
      });

      afterEach(function() {
        Predictions.__set__("DepartureBoard", this.original);
      });

      it("should display the departure board when valid data is received", function(done) {
        expect(TestUtils.isComponentOfType(instance.refs.content, this.stubbed)).toBe(true);
        expect(instance.state.status).toBe("success");
        done();
      });

    });

    xdescribe("with no departure data", function() {

      beforeEach(function() {
        spyOn(Predictions.__get__("utils"), "requestURL").and.returnValue("api/success");
      });

    });

    describe("on a data error", function() {

      beforeEach(function(done) {
        spyOn(Predictions.__get__("utils"), "validateResponse").and.returnValue(false);
        spyOn(Predictions.__get__("utils"), "apiRequestURL").and.returnValue("api/failure");

        this.stubbed = stubComponent(done);
        this.original = Predictions.__get__("Notice");
        Predictions.__set__("Notice", this.stubbed);

        instance = React.renderComponent(<Predictions line="district" station="940GZZLUEMB" config={{}} />, container);
      });

      afterEach(function() {
        Predictions.__set__("Notice", this.original);
      });

      it("should display an error message", function(done) {
        expect(TestUtils.isComponentOfType(instance.refs.content, this.stubbed)).toBe(true);
        expect(instance.state.status).toBe("error");
        done();
      });

    });

  });

  describe("DepartureBoard", function() {
    var DepartureBoard = Predictions.__get__("DepartureBoard");

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<DepartureBoard predictionData={stubAPIResponse} />);
    });

    it("should display the selected line and station", function() {
      // the 'find' methods will return the first match found
      var heading = TestUtils.findRenderedDOMComponentWithTag(instance, "h1");
      expect(heading.props.children).toBe("Embankment Underground Station, District Line");
    });

    it("should display each platform at the station on the line", function() {
      // the 'scry' methods will return an array of all matches
      var platforms = TestUtils.scryRenderedDOMComponentsWithClass(instance, "platform");
      expect(platforms.length).toBe(2);
    });

  });

  describe("Trains", function() {
    var Trains = Predictions.__get__("Trains");

    beforeEach(function() {
      var trains = stubPrediction.filter(function(train) {
        return train.platformName === "Westbound - Platform 1";
      });
      instance = TestUtils.renderIntoDocument(<Trains trains={stubAPIResponse.arrivalsAtPlatform()} />);
    });

    it("should render a table row for each train", function() {
      var arrivals = TestUtils.scryRenderedDOMComponentsWithClass(instance, "trains__arrival");
      expect(arrivals.length).toBe(3);
    });

    it("should display the train time until, destination and current location", function() {
      var arrivals = TestUtils.scryRenderedDOMComponentsWithClass(instance, "trains__arrival");
      var columns = TestUtils.scryRenderedDOMComponentsWithTag(arrivals.pop(), "td");

      // The rendered DOM nodes can be accessed and inspected
      expect(columns[0].props.children).toBe("-");
      expect(columns[1].props.children).toBe("Ealing Broadway Underground Station");
      expect(columns[2].props.children).toBe("At Platform");
    });

  });

  describe("Notice", function() {
    var Notice = Predictions.__get__("Notice");

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<Notice type={null} />);
    });

    it("should display the error message when given type is 'error'", function() {
      expect(instance.statusText("error")).toBe("Sorry an error occurred, please try again.");
    });

    it("should display the loading message when given type is 'loading'", function() {
      expect(instance.statusText("loading")).toBe("Loading predictions…");
    });

    it("should display the welcome message when given type is 'welcome'", function() {
      expect(instance.statusText("welcome")).toBe("Please choose a station.");
    });

    it("should display the empty message when given type is 'empty'", function() {
      expect(instance.statusText("empty")).toBe("There are no arrivals or departures scheduled from this station.");
    });

  });

});
