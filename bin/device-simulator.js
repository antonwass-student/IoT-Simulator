// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var Protocol = require('azure-iot-device-mqtt').Mqtt;

var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

var config = require('../secrets.json');

// fromConnectionString must specify a transport constructor, coming from any transport package.

var devices = [];

var simulateDevice = function(device){
    console.log('Simulating device...');

    //  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
    var connectionString = "HostName=" + config.iothub_hostname + ";DeviceId=" + device.deviceId + ";SharedAccessKey=" + device.primaryKey;

    console.log(connectionString);

    var client = Client.fromConnectionString(connectionString, Protocol);

    console.log(connectionString);

    client.open(function(err){
        console.log('callback!');
        if (err) {
            console.error('Could not connect: ' + err.message);
        } else {
            console.log('Client connected');
            client.on('message', function (msg) {
                console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
                // When using MQTT the following line is a no-op.
                client.complete(msg, printResultFor('completed'));
                // The AMQP and HTTP transports also have the notion of completing, rejecting or abandoning the message.
                // When completing a message, the service that sent the C2D message is notified that the message has been processed.
                // When rejecting a message, the service that sent the C2D message is notified that the message won't be processed by the device. the method to use is client.reject(msg, callback).
                // When abandoning the message, IoT Hub will immediately try to resend it. The method to use is client.abandon(msg, callback).
                // MQTT is simpler: it accepts the message by default, and doesn't support rejecting or abandoning a message.
            });

            if(device.config.interval < 1000)
                device.config.interval = 1000;

            // Create a message and send it to the IoT Hub every second
            var sendInterval = setInterval(function () {
                var windSpeed = 10 + (Math.random() * 4); // range: [10, 14]
                var dataJson = JSON.parse(JSON.stringify({
                    deviceId: device.deviceId,
                    timestamp:Date.now(),
                    data:device.config.data
                }));

                dataJson.data.forEach(function(item, index){
                    var value = item[Object.keys(item)[0]];
                    //examine the value to see if it should be replaced by random data

                    if(value.split("-").length==2){
                        var min = parseInt(value.split("-")[0]);
                        var max = parseInt(value.split("-")[1]);

                        var newValue = Math.floor(min + Math.random() * (max - min));
                        item[Object.keys(item)] = newValue;
                    }

                });

                var data = JSON.stringify(dataJson);

                var message = new Message(data);
                message.properties.add('key', 'value');
                console.log('Sending message: ' + message.getData());
                client.sendEvent(message, printResultFor('send'));
            }, device.config.interval);

            client.on('error', function (err) {
                console.error(err.message);
            });

            client.on('disconnect', function () {
                clearInterval(sendInterval);
                client.removeAllListeners();
                //client.open(connectCallback);
                //TODO: investigate in this re-connect call.
            });

            devices.push({
                deviceInfo:device,
                client:client,
                sendInterval:sendInterval
            });
        }
    });
};

var stopDevice = function(deviceId){
    devices.forEach(function(item, index){
        if(item.deviceInfo.deviceId == deviceId){
            item.client.close();
            clearInterval(item.sendInterval);
            devices.splice(index, 1);
        }
    });

    console.log(devices.length);
};


// Helper function to print results in the console
function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}




module.exports = {
    simulateDevice: simulateDevice,
    stopDevice:stopDevice
}