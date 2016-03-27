'use strict'

app.controller('ShippingController', function(
                $scope
                , $state
                , ControllerHelper
                , VLDT
                , Dict
                , ShippingRS 
                )  {
    $scope.$state = $state;

    $scope.formRows = [
        [
            '自定义名称',
            {
                el: 'input',
                name: 'name',
                validators: { required: VLDT.required },
            }
        ],
        [
            '运输类型',
            {
                el: 'ui-select',
                name: 'type',
                options: Dict.GetFormOptions('ShippingType'),
                optionLabel: 'label',
                optionValue: 'value',
                validators: { required: VLDT.required },
            },
        ],
        [
            '物流品牌',
            {
                el: 'input',
                name: 'brand',
            },
        ],
        [
            '',
            {
                el: 'button',
                type: 'submit',
                text: '保存',
                onClick: function(done, m) {
                    ShippingRS.Save(m).then(function(){
                        $state.go('shipping.list');
                    }, function(err){
                        zformServ.handleServerErr($scope.theForm, err);
                    }).finally(done);
                }
            },
            {
                el: 'button',
                btnClass: 'btn-default',
                type: 'button',
                text: '取消',
                onClick: function(done, m) {
                    history.back();
                    done();
                }
            }
        ]

    ];

    ControllerHelper.Init({
        scope:     $scope,
        controller: 'ShippingController',
        modelLabel: '物流方式',
        modelName:  'shipping',
        rs:         ShippingRS,
        restricts:  null,
        stateHead:  null,
        newTpl:     {},
    }).then(function(){
        if ($scope.shipping && !$scope.isNew) {
            var stateParams = '({shipping:"' + $scope.shipping._id + '"})';
            $scope.shippingOneTabs = [
                {   
                    text: '主页', 
                    color: 'orange',
                    stateGroup:'shipping.one.detail', 
                    state: 'shipping.one.detail' + stateParams,
                    icon: 'fa fa-home',
                    isDisabled: $scope.isNew,
                },
                {   
                    text: '基本信息', 
                    color: 'orange',
                    stateGroup:'shipping.one.edit', 
                    state: 'shipping.one.edit' + stateParams,
                    icon: 'fa fa-home',
                },

                {
                    text: '区域', 
                    color: 'orange',
                    stateGroup:'shipping.one.zone', 
                    state: 'shipping.one.zone' + stateParams,
                    isDisabled: $scope.isNew,
                },
                {   text: '价格', 
                    color:'blue', 
                    stateGroup: 'shipping.one.price',
                    state: 'shipping.one.price' + stateParams,
                    icon: 'fa fa-file',
                    isDisabled: $scope.isNew,
                },
                {
                    text: '分区', 
                    color:'green', 
                    stateGroup: 'shipping.one.dest-zone',
                    state: 'shipping.one.dest-zone' + stateParams,
                    icon: 'fa fa-truck',
                    isDisabled: $scope.isNew,
                },
            ];
        }
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