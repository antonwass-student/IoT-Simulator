

app.controller('simulationController', function($scope){


    $scope.deviceConfigurations = [];

    $scope.configTemplate = {data:[{key:"",value:""}]};

    $scope.configOutput = "";

    $scope.addDataTuple = function(){
      $scope.configTemplate.data.push({
          key:"",
          value:""
      });
    };

    $scope.generateJsonConfig = function(){
        var outputJson = {interval:$scope.configTemplate.interval};
        outputJson.data = [];

        var dataString = "";

        $scope.configTemplate.data.forEach(function(item, index){
            console.log(item.key);
            console.log(item.value);
            outputJson.data.push(JSON.parse('{"'+item.key + '":"' + item.value+'"}'));
        });
        $scope.configOutput =  JSON.stringify(outputJson);
        copyToClipboard($scope.configOutput);
    };


    $scope.stopSimulation = function(deviceId){
        console.log("Stopping device...");

        $.ajax({
            url:location.origin + '/simulation/stop',
            contentType:'application/json; charset=utf-8',
            dataType:'json',
            type:'POST',
            data:JSON.stringify({deviceId:deviceId}),
            success:function(err, success){
                if(err) console.log(err);
                if(success){
                    console.log(success);
                }
            }
        });
    };


    $scope.startSimulation = function(device){
        console.log("attempting to simulate device " + device.deviceId);
        console.log(device.configJson);

        var deviceConfig = {
            deviceId:device.deviceId,
            primaryKey:device.authentication.symmetricKey.primaryKey,
            config:JSON.parse(device.configJson)
        };


        $.ajax({
            url:location.origin + '/simulation/start',
            contentType:'application/json; charset=utf-8',
            dataType:'json',
            type:'POST',
            data:JSON.stringify(deviceConfig),
            success:function(err, success){
                if(err) console.log(err);
                if(success){
                    console.log(success);
                }
            }
        });

    };

});

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

