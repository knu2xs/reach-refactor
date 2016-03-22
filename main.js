/* global require */

// import modules
var request = require('request');

// get and return the reach
var getReach = function (reachId, callback) {

    // use request-promise to retrieve the reach
    request.get(
        {
            uri: 'http://www.americanwhitewater.org/content/River/detail/id/' + reachId + '/.json',
            json: true
        }
        , function (err, res, body) {
            if (!err && res.statusCode == 200) {
                callback(body);
            }
        });
};
module.exports = {
    getReach: getReach
};