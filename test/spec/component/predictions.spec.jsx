var React = require("react/addons");
var Predictions = require("../../../app/component/predictions.jsx");

var stubComponent = require("../../lib/stub/component");
var stubPrediction = require("../../lib/stub/prediction");

describe("Predictions", function() {

  var instance;
  var TestUtils = React.addons.TestUtils;

  beforeEach(function() {
    // Stub out AJAX requests with Jasmine's AJAX util
    jasmine.Ajax.install();

    jasmine.Ajax.stubRequest("api/success").andReturn({
      status: 200,
      contentType: "text/json",
      responseText: "{\"request\":{},\"station\":{},\"platforms\":{}}"
    });

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
        instance = TestUtils.renderIntoDocument(<Predictions line={null} station={null} />);

        // expect(TestUtils.isComponentOfType(instance.refs.content, Notice)).toBe(true);
        expect(instance.state.status).toBe("welcome");
      });

      it("should display the loading message when a line/station is set and valid", function() {
        instance = TestUtils.renderIntoDocument(<Predictions line="district" station="940GZZLUEMB" />);

        // expect(TestUtils.isComponentOfType(instance.refs.content, Notice)).toBe(true);
        expect(instance.state.status).toBe("loading");
      });

    });

    describe("with valid departure data", function() {

      beforeEach(function() {
        spyOn(Predictions.__get__("utils"), "apiRequestURL").and.returnValue("api/success");

        // The entire component stack should not be tested and must be stubbed. My mock
        // component also permits testing async component rendering.
        this.stubbed = stubComponent();
        this.original = Predictions.__get__("DepartureBoard");
        Predictions.__set__("DepartureBoard", this.stubbed);

        instance = TestUtils.renderIntoDocument(<Predictions line="district" station="940GZZLUEMB" />);
      });

      afterEach(function() {
        Predictions.__set__("DepartureBoard", this.original);
      });

      it("should display the departure board when valid data is received", function(done) {
        // expect(TestUtils.isComponentOfType(instance.refs.content, this.stubbed)).toBe(true);
        expect(instance.state.status).toBe("success");
        done();
      });

    });

    describe("on a data error", function() {

      beforeEach(function() {
        spyOn(Predictions.__get__("utils"), "apiRequestURL").and.returnValue("api/failure");

        this.stubbed = stubComponent();
        this.original = Predictions.__get__("Notice");
        Predictions.__set__("Notice", this.stubbed);

        instance = TestUtils.renderIntoDocument(<Predictions line="district" station="940GZZLUEMB" />);
      });

      afterEach(function() {
        Predictions.__set__("Notice", this.original);
      });

      it("should display an error message", function(done) {
        // expect(TestUtils.isComponentOfType(instance.refs.content, this.stubbed)).toBe(true);
        expect(instance.state.status).toBe("error");
        done();
      });

    });

  });

  describe("DepartureBoard", function() {
    var DepartureBoard = Predictions.__get__("DepartureBoard");

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<DepartureBoard predictionData={stubPrediction} />);
    });

    it("should display the selected line and station", function() {
      // the 'find' methods will return the first match found
      var heading = TestUtils.findRenderedDOMComponentWithTag(instance, "h1");
      expect(heading.props.children).toBe("Embankment Station, District Line");
    });

    it("should display each platform at the station on the line", function() {
      // the 'scry' methods will return an array of all matches
      var platforms = TestUtils.scryRenderedDOMComponentsWithClass(instance, "platform");
      expect(platforms.length).toBe(2);

      var headings = TestUtils.scryRenderedDOMComponentsWithClass(instance, "platform__heading");
      expect(headings[0].props.children).toBe("Eastbound - Platform 2");
      expect(headings[1].props.children).toBe("Westbound - Platform 1");
    });

  });

  describe("Trains", function() {
    var Trains = Predictions.__get__("Trains");

    beforeEach(function() {
      var trains = stubPrediction.platforms["Eastbound - Platform 2"];
      instance = TestUtils.renderIntoDocument(<Trains trains={trains} />);
    });

    it("should render a table row for each train", function() {
      var arrivals = TestUtils.scryRenderedDOMComponentsWithClass(instance, "trains__arrival");
      expect(arrivals.length).toBe(3);
    });

    it("should display the train time until, destination and current location", function() {
      var arrivals = TestUtils.scryRenderedDOMComponentsWithClass(instance, "trains__arrival");
      var columns = TestUtils.scryRenderedDOMComponentsWithTag(arrivals.shift(), "td");

      // The rendered DOM nodes can be accessed and inspected
      expect(columns[0].props.children).toBe("2:00");
      expect(columns[1].props.children).toBe("Upminster");
      expect(columns[2].props.children).toBe("Approaching Westminster");
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

  });

});
