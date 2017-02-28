var express = require('express');
var router = express.Router();
var iothub = require('../bin/iothub.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('devices');
});

router.get('/get', function(req, res, next){
    iothub.listDevices(function(devices){
        //console.dir(devices);

        devices.forEach(function(item, index){
            console.log(item.authentication.symmetricKey);
        });

        res.json({"devices":devices});
    });
});


router.post('/delete', function(req, res, next){

    console.log('deleting device ' + req.body.deviceId);

    iothub.deleteDevice(req.body.deviceId, function(err, success){
        if(err)
            res.status(500).json({
                message:"Could not delete device.",
                err:err
            });
        else
            res.status(200).json({
                message:"Device was deleted successfully.",
                success:success
            });

    });

});

router.post('/create', function(req, res, next){
    console.log('creating device...');

    iothub.createDevice(req.body.deviceId, function(err, success){
        if(err)
            res.status(500).json({
                message:"Could not create device.",
                err:""
            });
        else if(success)
            res.status(200).json({
                message:"Device was created successfully.",
                success:success
            });
    });
});

module.exports = router;
