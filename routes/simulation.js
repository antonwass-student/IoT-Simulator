var express = require('express');
var router = express.Router();

var simulator = require('../bin/device-simulator');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('simulation');
});


router.post('/start', function(req, res, next){
    console.log('received simulation start request!');

    simulator.simulateDevice(req.body);

    res.end();

});

router.post('/stop', function(req, res, next){
    console.log('request received: stop simulation');

    simulator.stopDevice(req.body.deviceId);

    res.end();
});

module.exports = router;
