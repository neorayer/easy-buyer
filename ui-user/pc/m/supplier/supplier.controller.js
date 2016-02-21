'use strict'

app.controller('SupplierController', function(
                $scope
                , $rootScope
                , $state
                , $timeout
                , Dialogs
                , ControllerHelper
                , zformServ
                , VLDT
                , Dict
                , DateServ
                , SupplierRS 
                )  {
    $scope.$state = $state;

    $scope.formSupplier = {};

    $scope.suSchema = {
        name: {
            title: '名称',
            el: 'input',
            validators: { required: VLDT.required, },
        },
        nickname: {
            title: '简称',
            el: 'input',
        },
        country: {
            title: '国家',
            el: 'ui-select',
            options: CONSTS.countries,
            optionLabel: 'name',
            optionValue: 'name',
        },
        businessType: {
            title: '商业类型',
            options: Dict.GetFormOptions('BusinessType'),
            el: 'radio',
            validators: { required: VLDT.required, },
        },
        address: {
            title: '地址',
            el: 'input',
        },
        contactPerson: {
            title: '联系人',
            el: 'input',
            validators: { required: VLDT.required, },
        },
        phone: {
            title: '电话',
            el: 'input',
            validators: { required: VLDT.required, },
        },
        fax: {
            title: '传真',
            el: 'input',
        },
        website: {
            title: '网站',
            el: 'input',
        },
        email: {
            title: 'Email',
            el: 'input',
        },
        yearEstablished: {
            title: '公司创建年',
            el: 'select',
            options: DateServ.yearsRange(1700),
        },
        yearStartExporting: {
            title: '开始出口年',
            el: 'select',
            options: DateServ.yearsRange(1949),
        },
        numberOfEmployees: {
            title: '雇员规模',
            el: 'radio-buttons',
            options: [
                { label: '1 ~ 10', value: 10 },
                { label: '11 ~ 50', value: 50 },
                { label: '51 ~ 100', value: 100 },
                { label: '101 ~ 200', value: 200 },
                { label: '201 ~ 500', value: 500 },
                { label: '501 ~ 1000', value: 1000 },
                { label: '> 1000', value: 1000000 },
            ],
        },
        description: {
            title: '简介',
            el: 'text-angular',
        },
        createTime: {
            title: '创建时间',
        },
        modifyTime: {
            title: '更新时间',
        }
     }

    for (var k in $scope.suSchema) {
        $scope.suSchema[k].name =  k;
    }


    // formRows
    $scope.formRows = [];
    ['name',
      'nickname',
      'country',
      'businessType',
      'address',
      'contactPerson',
      'phone',
      'fax',
      'website',
      'email',
      'yearEstablished',
      'yearStartExporting',
    ].forEach(function(name){
        let prop = $scope.suSchema[name];
        $scope.formRows.push([prop.title, prop, '' ]);
    });

    ['numberOfEmployees',
     'description',
    ].forEach(function(name){
        let prop = $scope.suSchema[name];
        $scope.formRows.push([prop.title, prop]);
    });

    $scope.formRows.push([
        '',
        {
            el: 'button',
            type: 'submit',
            text: '保存',
            onClick: function(done, m) {
                SupplierRS.Save($scope.formSupplier).then(function(su){
                    $state.go('supplier.one.detail', {supplier: su._id});
                }, function(err){
                    zformServ.handleServerErr($scope.theForm, err);
                }).finally(done);
            }
        },
    ]);


    // propRows
    $scope.propRows = [];
    ['name',
      'nickname',
      'country',
      'businessType',
      'address',
      'contactPerson',
      'phone',
      'fax',
      'website',
      'email',
      'yearEstablished',
      'yearStartExporting',
      'numberOfEmployees',
    ].forEach(function(name){
        $scope.propRows.push($scope.suSchema[name]);
    });



    $scope.can = {
        modify: function(sup) {
            if (USER.role === 'admin') return true;
            if (USER.role === 'product-admin') return true;
            if (sup.creater._id === USER._id && sup.status !== 'accepted') return true;
        },

        opStatus: function(sup) {
            if (USER.role === 'admin') return true;
            if (USER.role === 'product-admin') return true;
            return false;
        }
    }

    $scope.SaveStatus = function(supplier, status) {
        SupplierRS.Save({
            _id: supplier._id,
            status: status,
        });
    }

    ControllerHelper.Init({
        scope:     $scope,
        controller: 'SupplierController',
        modelLabel: '供应商',
        modelName:  'supplier',
        rs:         SupplierRS,
        restricts:  null,
        stateHead:  null,
    }).then(function(){
        if ($scope.supplier && !$scope.isNew) {
            var stateParams = '({supplier:"' + $scope.supplier._id + '"})';
            let canModify = $scope.can.modify($scope.supplier);
            $scope.supplierOneTabs = [
                {   
                    text: '主页', 
                    color: 'orange',
                    stateGroup:'supplier.one.detail', 
                    state: 'supplier.one.detail' + stateParams,
                    icon: 'fa fa-home',
                    isDisabled: $scope.isNew,
                },
                {   
                    text: '基本信息', 
                    color: 'orange',
                    stateGroup:'supplier.one.edit', 
                    state: 'supplier.one.edit' + stateParams,
                    icon: 'fa fa-home',
                    isDisabled: !canModify,
                },
                {
                    text: '供应商产品', 
                    color: 'orange',
                    stateGroup:'supplier.one.supProduct', 
                    state: 'supplier.one.supProduct.list' + stateParams,
                    icon: 'fa fa-cube',
                    isDisabled: $scope.isNew || !canModify,
                },
            ];
        }
    });

    $scope.OpenWebsite = function(supplier) {
        var url = supplier.website;
        if (url.toLowerCase().indexOf('http') !== 0)
            url = 'http://' + url;
        window.open(url);
    }
})


app.controller('SupplierOneSupProductController', function(
                $scope
                , $rootScope
                , $state
                , $timeout
                , Cache
                , Dialogs
                , ControllerHelper
                , SupplierRS 
                , SupProductRS
                )  {
    $scope.pSchema = {
        name: {
            title: '产品名称 Name *',
        },
        casNo: { 
            title: 'CAS No *',
        },
        chemicalName: {
            title: '学名 Chemical Name',
        },
        finalStepName: {
            title: '最终品名 Final Step Name',
        },
        synonyms: {
            title: '异名 Synonyms',
        },
        ecNo: {
            title: 'EC No',
        },
        moleFormula: {
            title: '分子式 Molecular Formula',
        },
        moleWeight: { 
            title: '分子量 Molecular Weight',
        },
        inChl: {
            title: 'InChl',
        },
        description: {
            title: '详细描述 Description',
        }
    }

    $scope.propRows = [];
    [ 'name', 'casNo', 'chemicalName', 'finalStepName', 
            'synonyms', 'ecNo', 'moleFormula', 'moleWeight', 
            'inChl'
            ].forEach(function(name){
        var prop = $scope.pSchema[name];
        prop.name = name;
        $scope.propRows.push(prop);
    });


    var selProduct;
    $scope.ChgSelectedProduct = function(p) {
        selProduct = p;
    }
    $scope.SaveSupProduct = function() {
        if (!selProduct)
            return;
        var pid = selProduct._id;
        SupProductRS.Save({
            _id: 'new',
            supplier: $scope.supplier._id,
            product: pid,
        })
    }

    $scope.labsheetUploaderDef = {
        uptoken_url: '/public-qiniu/uptoken',
        domain: 'http://7xp52k.com1.z0.glb.clouddn.com/',
        onUploaded: function(url, file){
            $scope.supProduct.labsheets.push({
                name: file.name,
                url: url,
            });
            $scope.SaveLabsheets();
        },
    }


    ControllerHelper.Init({
        scope:     $scope,
        controller: 'SupplierOneSupProductController',
        modelLabel: '供应商产品',
        modelName:  'supProduct',
        rs:         SupProductRS,
        restricts:  ['supplier'],
        stateHead:  null,
    }).then(function(){
        if ($scope.supProduct) {
            //var stateParams = '({supplier:"' + $scope.supplier._id + '"})';
            $scope.product = $scope.supProduct.product;
            $scope.supProduct.prices = $scope.supProduct.prices || [];
            $scope.supProduct.prices.sort(function(a,b){
                return a.minWeight - b.minWeight;
            })

            $scope.CreateNewPrice = function() {
                $scope.supProduct.prices.push({
                    minWeight: 0,
                    maxWeight: 999,
                    unitPrice: 0,
                });
            }

            $scope.DeletePrice = function(price) {
                $scope.supProduct.prices.Delete(price);
                $scope.SavePrices();
            }

            $scope.SavePrices = function() {
                SupProductRS.Save({
                    _id: $scope.supProduct._id,
                    prices: $scope.supProduct.prices,
                    isUpdatePriceTime: true,
                }).then(function(){
                    $scope.pricesForm.$setPristine();
                });
            }

            $scope.DownloadLabsheet = function(labsheet) {
                window.open(labsheet.url,'_blank');
            }

            $scope.DeleteLabsheet = function(labsheet) {
                $scope.supProduct.labsheets.Delete(labsheet);
                $scope.SaveLabsheets();
            }

            $scope.SaveLabsheets = function() {
                SupProductRS.Save({
                    _id: $scope.supProduct._id,
                    labsheets: $scope.supProduct.labsheets,
                });
            }

            $scope.supProduct.labsheets = $scope.supProduct.labsheets || [];

        }
    });
});