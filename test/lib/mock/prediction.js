var PredictionDouble = require("../double/prediction");

module.exports = new PredictionDouble({
  line: "District Line",
  station: {
    name: "Hammersmith",
    platforms: [1, 2, 3, 4].map(function(platform) {
      return {
        number: platform,
        name: "Platform " + platform,
        trains: [1, 2, 3, 4, 5].map(function(train) {
          return {
            id: "train-" + train,
            timeTo: "1:00",
            destination: "Richmond",
            location: "Barons Court"
          };
        })
      };
    })
  }
});
