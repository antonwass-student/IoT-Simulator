
app.controller('devicesController', function($scope){

    $scope.devices = [];

    $scope.newDevice = {
        deviceId:''
    };

    $scope.getDevices = function(){
        $.ajax({
            url:location.origin + '/devices/get',
            contentType:'application/json; charset=utf-8',
            dataType:'json',
            type:'GET',
            success:function(data){
                $scope.devices = data.devices;
                $scope.$apply();
                console.dir(data.devices);
            }
        });
    };

    $scope.deleteDevice = function(deviceId){
        console.log("deleting:" + deviceId);
        $.ajax({
            url:location.origin + '/devices/delete',
            contentType:'application/json; charset=utf-8',
            dataType:'json',
            type:'POST',
            data:JSON.stringify({"deviceId":deviceId}),
            success:function(){
                console.log('done');
                $scope.getDevices();
            }
        });
    };

    $scope.createDevice = function(){
        console.log("creating device with id: " + $scope.newDevice.deviceId);
        $.ajax({
            url:location.origin + '/devices/create',
            contentType:'application/json; charset=utf-8',
            dataType:'json',
            type:'POST',
            data:JSON.stringify({"deviceId":$scope.newDevice.deviceId}),
            success:function(err, success){
                if(err) console.log(err);
                if(success){
                    console.log(success);
                    $scope.getDevices();
                }
            }
        });
    };

    $scope.getDevices();
});
