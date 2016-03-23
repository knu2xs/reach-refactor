/* golobal require */

// import module
var main = require('./main');

// lambda wrapper for get reach geojson
exports.getReachGeoJson = function (events, context){

  // call main get reach geojson using reach id from events input
  main.getReachGeoJson(events.reachId, function(geoJson){

    // pass back results using context succeed
    context.succeed(geoJson);

  });
};
