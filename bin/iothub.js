var iothub = require('azure-iothub');
var config = require('../configurations.json');

var connectionString  = config.connection_string_read_write;

var registry = iothub.Registry.fromConnectionString(connectionString);


var createDevice = function(deviceId, callback){
    var device = {
        deviceId: deviceId
    };

    registry.create(device, function(err, deviceInfo, res){
        var op = 'create';
        if(err){
            console.log(op + ' error' + err.toString());
            callback(err, null);
        }

        if(res) console.log(op + ' status:' + res.statusCode + ' ' + res.statusMessage);

        if(deviceInfo){
            console.log(op + ' device info: ' +  JSON.stringify(deviceInfo));
            callback(null, deviceInfo);
        }
    });
};

var deleteDevice = function(deviceId, callback){

    registry.delete(deviceId, function(err, dc, res){
        var op = 'delete';
        if(err){
            console.log(op + ' error' + err.toString());
            callback(err);
        }else{
            callback(null);
        }

        if(res) console.log(op + ' status:' + res.statusCode + ' ' + res.statusMessage);

    });
};

var listDevices = function(callback){
    var op = 'list';
    registry.list(function(err, devices, res){
        if(err) console.log('list error' + err.toString())
        if(res) console.log('list status:' + res.statusCode + ' ' + res.statusMessage);
        if(devices){
            callback(devices);
        };
    });
};

var updateDevice = function(deviceId){
    var device = {
        deviceId: deviceId
    };

    registry.update(device, function(err, deviceInfo, res){
        var op = 'update';
        if(err) console.log(op + ' error' + err.toString())
        if(res) console.log(op + ' status:' + res.statusCode + ' ' + res.statusMessage);
        if(deviceInfo) console.log(op + ' device info: ' +  JSON.stringify(deviceInfo));
    });
};


module.exports = {
    listDevices: listDevices,
    deleteDevice: deleteDevice,
    createDevice: createDevice
};
