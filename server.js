var express = require("express");
var API = require("./app/server/api");
var config = require("./config");
var app = express();

app.get("/api/:line/:station", function(req, res) {
  new API(config).for(req.params.line, req.params.station).get(function(err, data) {
    if (err) {
      return res.send(500, "Internal error");
    }

    res.json(data);
  });
});

// Serve static assets
app.set("js", app.get("env") === "development" ? "dev" : "min");

app.use(function(req, res, next) {
  if (req.url === "/scripts/bundle.js") {
    req.url = "/scripts/bundle." + app.get("js") + ".js";
  }

  next();
});

app.use(express.static("./public"));

var port = process.env.PORT || 8080;

app.listen(port);

console.log("Running server on port " + port + ", press ctrl + c to stop.");
