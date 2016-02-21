'use strict'

app.controller('ShippingController', function(
                $scope
                , $state
                , ControllerHelper
                , ZoneRS
                )  {
    $scope.$state = $state;

    ControllerHelper.Init({
        scope:     $scope,
        controller: 'ShippingZoneController',
        modelLabel: '物流区域',
        modelName:  'zone',
        rs:         ZoneRS,
        restricts:  null,
        stateHead:  'shipping',
        newTpl:     {},
    }).then(function(){
        $scope.zones.sort(function(a, b){
            return a.name.localeCompare(b.name);
        });
    });
});


app.controller('ShippingZoneController', function(
                $scope
                , $state
                , $q
                , ControllerHelper
                , Dialogs
                , Dict
                , ZoneRS
                , Cache
                )  {

    var SaveZone = function(zone) {
        return ZoneRS.Save(zone).then(function(z){
        }, function(err){
            console.error(err);
        })
    }

    $scope.AddNewZone = function() {
        SaveZone({_id: 'new', name: '新增分区'});
    }

    $scope.UpdateZone = function(zone) {
        SaveZone(zone);
    }

    $scope.AutoAddZones = function() {
        var SaveZones = [];
        for (let i=1; i<10; i++) {
            SaveZones.push(function() {
                return SaveZone({_id: 'new', name: i + '区', });
            });
        }
        return SaveZones.reduce($q.when, $q.when());
    }




});


app.controller('ShippingDestZoneController', function(
                $scope
                , $state
                , ControllerHelper
                , DestZoneRS
                )  {


    $scope.SaveDestZone = function(dest) {
        DestZoneRS.Save({
            destCode: dest.code,
            zone: dest.zone,
        }).then(function(dz){
        }, function(err){
            console.error(err);
        })
    }

    $scope.dests = angular.copy(CONSTS.countries).sort(function(a, b) {
        return a.name.localeCompare(b.name);
    });
    var destsMap = {};
    $scope.dests.forEach(function(dest){
        destsMap[dest.code] = dest;
    });

    ControllerHelper.Init({
        scope:     $scope,
        controller: 'ShippingDestZoneController',
        modelLabel: '目的地分区',
        modelName:  'destZone',
        rs:         DestZoneRS,
        restricts:  null,
        stateHead:  'shipping',
        newTpl:     {},
    }).then(function(){
        $scope.destZones.forEach(function(dz) {
            var dest = destsMap[dz.destCode];
            //将错误的destZone数据删除
            if (!dest) {
                DestZoneRS.DeleteById(dz._id);
                return;
            }
            dest.zone = dz.zone;
        });
    });
});



app.controller('ShippingPriceController', function(
                $scope
                , $state
                , ControllerHelper
                , LogiPriceRS
                )  {




    $scope.InitCreatePrices = function() {
        var zps = [];
        for (let i=0; i<20; i+=0.5) {
            let zp = {
                priceType: 'total',
                minWeight: i,
                maxWeight: i + 0.5,
            };
            zps.push(zp);
        }
        zps.push({priceType: 'kg', minWeight: 21, maxWeight:30 });
        zps.push({priceType: 'kg', minWeight: 31, maxWeight:70});
        zps.push({priceType: 'kg', minWeight: 71, maxWeight:300});
        zps.push({priceType: 'kg', minWeight: 300, maxWeight:10000});


        zps.forEach(function(zp){
            zp.priceSet = {};
            $scope.zones.forEach(function(z){
                zp.priceSet[z._id] = 0;
            });

            LogiPriceRS.Save(zp);
        });
    }

    $scope.SavePrice = function(lp) {
        return LogiPriceRS.Save(lp).then(function(){

        }, function(err){
            LogiPriceRS.error(err);
        });
    }

    $scope.RemoveAllLogiPrices = function() {
        $scope.logiPrices.forEach(function(item){
            LogiPriceRS.DeleteById(item._id);
        });
    }

    ControllerHelper.Init({
        scope:     $scope,
        controller: 'ShippingLogiPriceController',
        modelLabel: '分区价格',
        modelName:  'logiPrice',
        rs:         LogiPriceRS,
        restricts:  null,
        stateHead:  'shipping',
        newTpl:     {},
    }).then(function(){
        $scope.logiPrices.sort(function(a, b){
            return a.maxWeight > b.maxWeight ? 1 : -1;
        })
    });

});