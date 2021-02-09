'use strict';

const fs = require('fs');
const read = require('read-yaml');
const RandExp = require('randexp');

const parameters = read.sync('seedParameters.yaml');



const json = JSON.stringify({
    param1: parameters.param1,
    param2: parameters.param2
}, null, 4);

fs.writeFile('seeds.json', json, function(err) {
    if (err) {
        console.log(err);
    }
});

//console.log("=============================== Generate seeds.json done");
