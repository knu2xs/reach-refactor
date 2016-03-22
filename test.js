/* global require */

// import the main and assert modules
var main = require('./main');
var assert = require('assert');

// use canyon creek as an example
var canyonCreekId = 3306;

// get Canyon Creek
main.getReach(canyonCreekId, function(canyonCreekJson){

        // check to ensure it is actually canyon creek
        assert.equal(
            canyonCreekId,
            canyonCreekJson.CContainerViewJSON_view.CRiverMainGadgetJSON_main.info.id,
            'Correct reach retreived, ' + canyonCreekId + '.'
        );
});