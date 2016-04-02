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
                    text: '分区管理', 
                    color: 'orange',
                    stateGroup:'shipping.one.zone', 
                    state: 'shipping.one.zone' + stateParams,
                    isDisabled: $scope.isNew,
                },
                {   text: '分区价格表', 
                    color:'blue', 
                    stateGroup: 'shipping.one.price',
                    state: 'shipping.one.price' + stateParams,
                    icon: 'fa fa-file',
                    isDisabled: $scope.isNew,
                },
                {
                    text: '目的地分区表', 
                    color:'green', 
                    stateGroup: 'shipping.one.dest-zone',
                    state: 'shipping.one.destZone' + stateParams,
                    icon: 'fa fa-truck',
                    isDisabled: $scope.isNew,
                },
            ];
        }
    });
});

app.controller('ShippingOneZoneController', function(
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
        SaveZone({
            _id: 'new', 
            name: '新增分区', 
            shipping: $scope.shipping._id
        });
    }

    $scope.UpdateZone = function(zone) {
        SaveZone(zone);
    }

    $scope.AutoAddZones = function() {
        var SaveZones = [];
        for (let i=1; i<10; i++) {
            SaveZones.push(function() {
                return SaveZone({
                    _id: 'new', 
                    name: i + '区', 
                    shipping: $scope.shipping._id
                });
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
        restricts:  ['shipping'],
        stateHead:  null,
        newTpl:     {},
    }).then(function(){
        $scope.zones.sort(function(a, b){
            return a.name.localeCompare(b.name);
        });
    });
});


app.controller('ShippingOneDestZoneController', function(
                $scope
                , $state
                , ControllerHelper
                , ZoneRS
                , DestZoneRS
                )  {
    ZoneRS.Load({shipping: $scope.shipping._id}, null, true);

    $scope.SaveDestZone = function(dest) {
        DestZoneRS.Save({
            destCode: dest.code,
            zone: dest.zone,
            shipping: $scope.shipping._id,
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
        restricts:  ['shipping'],
        stateHead:  null,
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



app.controller('ShippingOnePriceController', function(
                $scope
                , $state
                , ControllerHelper
                , ZoneRS
                , LogiPriceRS
                )  {
    var shipping = $scope.shipping;
    ZoneRS.Load({shipping:$scope.shipping._id}, null, true);

    $scope.InitCreatePrices = function() {
        switch($scope.shipping.type) {
            case 'express':
                return initCreatePrices_Express();
            case 'air':
                return initCreatePrices_Air();
            case 'ocean':
                return initCreatePrices_Ocean();
            default:
                break;
        }
    }

    var initCreatePrices_Express = function() {
        var lps = [];
        for (let i=0; i<20; i+=0.5) {
            let lp = {
                priceType: 'total',
                min: i,
                max: i + 0.5,
            };
            lps.push(lp);
        }
        lps.push({priceType: 'kg', min: 21, max:30 });
        lps.push({priceType: 'kg', min: 31, max:70});
        lps.push({priceType: 'kg', min: 71, max:300});
        lps.push({priceType: 'kg', min: 300, max:10000});

        lps.forEach(function(lp){
            lp.priceSet = {};
            $scope.zones.forEach(function(z){
                lp.priceSet[z._id] = 0;
            });

             $scope.SavePrice(lp);
        });
    }

    var initCreatePrices_Air = function() {
        var lps = [];
        lps.push({priceType: 'total', min:0, max: 7});

        lps.push({priceType: 'kg', min:7, max: 45});
        lps.push({priceType: 'kg', min:45, max: 100});
        lps.push({priceType: 'kg', min:100, max: 500});
        lps.push({priceType: 'kg', min:500, max: 1000});
        lps.push({priceType: 'kg', min:1000, max: 9999999});

        lps.forEach(function(lp){
            lp.priceSet = {};
            $scope.zones.forEach(function(z){
                lp.priceSet[z._id] = 0;
            });

             $scope.SavePrice(lp);
        });
    }

    var initCreatePrices_Ocean = function() {
        var lp = {
            priceType: 'stere',
            min: 0,
            max: 1,
        }
        $scope.SavePrice(lp);
    }

    $scope.SavePrice = function(lp) {
        lp.shipping = $scope.shipping._id;
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
        restricts:  ['shipping'],
        stateHead:  null,
        newTpl:     {},
    }).then(function(){
        $scope.logiPrices.sort(function(a, b){
            return a.max > b.max ? 1 : -1;
        })
    });

});


app.controller('ShippingCalculatorController', function(
                $scope
                , $state
                , ControllerHelper
                , zformServ
                , ShippingFeeRS
                )  {
    $scope.formCalc = {};
    $scope.formRows = [
        [
            '重量',
            {
                el: 'input',
                type: 'number',
                name: 'weight',
            },
            'KG',
        ],
        [
            '体积',
            {
                el: 'input',
                type: 'number',
                name: 'volume',
            },
            '立方米',
        ],
        [
            '目的地',
            {
                name: 'destCode',
                el: 'ui-select',
                options: CONSTS.countries,
                optionLabel: 'name',
                optionValue: 'code',
            },
            ''
        ],
        [
            '',
            {
                el: 'button',
                type: 'submit',
                text: '计算运费',
                onClick: function(done, m) {
                    GetShippingFees($scope.formCalc).then(function() {
                    }, function(err){
                        zformServ.handleServerErr($scope.theForm, err);
                    }).finally(done);
                }
            },
            ''
        ]
    ];


    $scope.fees = {};
    function GetShippingFees(formCalc) {
        return ShippingFeeRS.Load(formCalc).then(function() {
            $scope.shippingFees.forEach(function(sf) {
                $scope.fees[sf.shipping] = sf.value;
            });
        })
    }
    

    $scope.getPrice = function(shipping, formCalc) {
        switch(shipping.type) {
            case 'express':
                return getPrice_Express(shipping, formCalc);
            case 'air':
                return getPrice_Air(shipping, formCalc);
            case 'ocean':
                return getPrice_Ocean(shipping, formCalc);
            default:
                break;
        }
    }

    var getPrice_Express = function(shipping, formCalc) {
        return 100;
    }

    var getPrice_Air = function(shipping, formCalc) {
        return 200;
    }

    var getPrice_Ocean = function(shipping, formCalc) {

        return 300;
    }
});