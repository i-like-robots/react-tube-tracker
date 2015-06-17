require("node-jsx").install({ extension: ".jsx" });

var express = require("express");
var API = require("./app/server/api");
var Bootstrap = require("./app/server/bootstrap.jsx");
var config = process.env.APP_ID && process.env.APP_KEY ? process.env : require("./config");

// Start a new app
var app = express();

// API Proxy
app.get("/api/:line/:station", function(req, res) {
  new API(config).for(req.params.line, req.params.station).get(function(err, data) {
    if (err) {
      return res.status(500).send("Internal error");
    }

    res.json(data);
  });
});

// Serve initial HTML
app.get("/", function(req, res) {
  new API(config).for(req.query.line, req.query.station).get(function(err, data) {
    if (err) {
      return res.status(500).send("API error");
    }

    new Bootstrap(data).load(function(err, responseHTML) {
      if (err) {
        return res.status(500).send("Template error");
      }

      res.send(responseHTML);
    });
  });
});

// Static assets
app.use(function(req, res, next) {
  if (req.url === "/scripts/bundle.js") {
    var pkg = app.get("env") === "development" ? "dev" : "min";
    req.url = "/scripts/bundle." + pkg + ".js";
  }

  next();
});

app.use(express.static("./public"));

var port = process.env.PORT || 8080;

app.listen(port);

console.log("Running server on port " + port + ", press ctrl + c to stop.");
