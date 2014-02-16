var express = require("express");
var app = express();

// Serve static assets
app.use(express.static("./public"));
app.use("/app", express.static("./app"));
app.use("/vendor", express.static("./vendor"));

var port = process.env.PORT || 8080;

app.listen(port);

console.log("Running server on port " + port + ", press ctrl + c to stop.");
