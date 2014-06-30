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

        var mockDoc = "{[{\"fake\":\"data\"}]}";

        jasmine.Ajax.stubRequest("a/fake/api").andReturn({
          contentType: "text/xml",
          responseText: mockDoc,
        });

        utils.httpRequest("a/fake/api", success, error);

        expect(success).toHaveBeenCalledWith(mockDoc);
        expect(error).not.toHaveBeenCalled();
      });

    });

  });

  describe("TfL API", function() {

    describe(".apiRequestURL()", function() {

      it("should return the request URL for the given line and station", function() {
        expect(utils.apiRequestURL("district", "940GZZLUEMB")).toBe("/api/district/940GZZLUEMB");
      });

    });

    describe(".formattedTimeUntil()", function() {

      it("should round the number of seconds to the nearest 30 seconds", function() {
        expect(utils.formattedTimeUntil(120)).toBe("2:00");
        expect(utils.formattedTimeUntil(145)).toBe("2:30");
        expect(utils.formattedTimeUntil(165)).toBe("3:00");
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
        expect(utils.isLine("district", data)).toBe(true);
      });

      it("should return false for an incorrect line", function() {
        expect(utils.isLine("distract", data)).toBe(false);
      });

    });

    describe(".isStation()", function() {

      it("should return true for a correct station", function() {
        expect(utils.isStation("940GZZLUEMB", data)).toBe(true);
      });

      it("should return false for an incorrect station", function() {
        expect(utils.isStation("940GZZLUXYZ", data)).toBe(false);
      });

    });

    describe(".isStationOnLine()", function() {

      it("should return true for a correct line and station", function() {
        expect(utils.isStationOnLine("district", "940GZZLUEMB", data)).toBe(true);
      });

      it("should return false for an incorrect line and station", function() {
        expect(utils.isStationOnLine("distract", "940GZZLUXYZ", data)).toBe(false);
      });

    });

  });

});
