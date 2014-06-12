exports.station = function() {
  return "Embankment Underground Station, District Line";
};

exports.platform = function() {
  return "Westbound - Platform 1";
};

exports.platforms = function() {
  return ["Westbound - Platform 1", "Eastbound - Platform 2"];
};

exports.arrivalsAtPlatform = function() {
  return [
    {
      "vehicleId": "004",
      "destinationName": "Richmond Underground Station",
      "timeToStation": 389,
      "currentLocation": "Between Whitechapel and Aldgate East"
    },
    {
      "vehicleId": "030",
      "destinationName": "Ealing Broadway Underground Station",
      "timeToStation": 269,
      "currentLocation": "Left Aldgate East"
    },
    {
      "vehicleId": "126",
      "destinationName": "Ealing Broadway Underground Station",
      "timeToStation": 0,
      "currentLocation": "At Platform"
    }
  ]
};
