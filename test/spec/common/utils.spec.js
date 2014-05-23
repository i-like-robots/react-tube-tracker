var utils = require("../../../app/common/utils");
var data = require("../../../app/common/data");

describe("Utils", function() {

  describe("Async", function() {

    describe(".debounceEvent()", function() {
      var instance;
      var interval;
      var bounceInc = 0;
      var callbackInc = 0;

      beforeEach(function(done) {
        instance = utils.debounceEvent(function() {
          callbackInc++;
          done();
        }, 20);

        interval = setInterval(function() {
          if (bounceInc < 4) {
            bounceInc++;
            instance();
          }
        }, 10);
      });

      afterEach(function() {
        clearInterval(interval);
      });

      it("should execute the given callback after being bounced 4 times", function(done) {
        expect(bounceInc).toBe(4);
        expect(callbackInc).toBe(1);
        done();
      });

    });

    describe(".httpRequest()", function() {

      beforeEach(function() {
        jasmine.Ajax.install();
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should provide the XML response to the given callback", function() {
        var success = jasmine.createSpy("success");
        var error = jasmine.createSpy("error");

        var parser = new DOMParser;
        var mockDoc = "<?xml version='1.0' encoding='UTF-8'?><fake>This is some XML</fake>";
        var mockXML = parser.parseFromString(mockDoc, "text/xml");

        jasmine.Ajax.stubRequest("a/fake/api").andReturn({
          contentType: "text/xml",
          responseText: mockDoc,
          responseXML: mockXML
        });

        utils.httpRequest("a/fake/api", success, error);

        expect(success).toHaveBeenCalledWith(mockXML);
        expect(error).not.toHaveBeenCalled();
      });

    });

  });

  describe("TrackerNet", function() {

    describe(".proxyRequestURL()", function() {

      it("should create a URL for YQL because TrackerNet does not support CORS", function() {
        var result = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fgoogle.com'";
        expect(utils.proxyRequestURL("http://google.com")).toBe(result);
      });

    });

    describe(".validateResponse()", function() {

      it("should find the stations node in the given response document", function() {
        var fragment = document.createElement("F");
        var stations = document.createElement("S");
        fragment.appendChild(stations);

        expect(utils.validateResponse(fragment)).toBe(true);
      });

    });

  });

  describe("Location", function() {

    describe(".formatQueryString()", function() {

      it("should create a query string from the given map", function() {
        var map = {
          cat: "meow",
          dog: "woof"
        };

        expect(utils.formatQueryString(map), "?cat=meow&dog=woof");
      });

    });

    describe(".queryStringProperty()", function() {

      it("should return the value of the requested property from the given string", function() {
        var qs = "cat=meow&dog=woof";
        expect(utils.queryStringProperty(qs, "cat")).toBe("meow");
        expect(utils.queryStringProperty(qs, "dog")).toBe("woof");
      });

    });

  });

  describe("Data utils", function() {

    describe(".isLine()", function() {

      it("should return true for a correct line", function() {
        expect(utils.isLine("C", data)).toBe(true);
      });

      it("should return false for an incorrect line", function() {
        expect(utils.isLine("Z", data)).toBe(false);
      });

    });

    describe(".isStation()", function() {

      it("should return true for a correct station", function() {
        expect(utils.isStation("EMB", data)).toBe(true);
      });

      it("should return false for an incorrect station", function() {
        expect(utils.isStation("XYZ", data)).toBe(false);
      });

    });

    describe(".isStationOnLine()", function() {

      it("should return true for a correct line and station", function() {
        expect(utils.isStationOnLine("D", "EMB", data)).toBe(true);
      });

      it("should return false for an incorrect line and station", function() {
        expect(utils.isStationOnLine("P", "EMB", data)).toBe(false);
      });

    });

    describe(".mapCircleLineStation()", function() {

      it("should return the shared line", function() {
        expect(utils.mapCircleLineStation("BST", data)).toBe("H");
      });

    });

  });

});
