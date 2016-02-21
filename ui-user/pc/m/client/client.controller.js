'use strict'

app.controller('ClientController', function(
                $scope
                , $state
                , $modal
                , ControllerHelper
                , zformServ
                , VLDT
                , Dialogs
                , ClientRS
                , Cache
                )  {
    var clSchema = $scope.clSchema = {
        name: {
            title: '公司名称',
            el: 'input',
            validators: { required: VLDT.required, },
        },
        nickname: {
            title: '简称',
            el: 'input',
        },
        country: {
            title: '国家地区',
            el: 'ui-select',
            options: CONSTS.countries,
            optionLabel: 'name',
            optionValue: 'name',
        },
    }

    for (let k in clSchema) 
        clSchema[k].name = k;

    $scope.formRows = [];
    ['name',
     'nickname',
     'country'
    ].forEach(function(name){
        var prop = $scope.clSchema[name];
        $scope.formRows.push([prop.title, prop, '']);
    })

    $scope.formRows.push([
        '',
        {
            el: 'button',
            type: 'submit',
            text: '保存',
            onClick: function(done, m) {
                ClientRS.Save($scope.formClient).then(function(cl){
                    $state.go('client.one.detail', {client: cl._id});
                }, function(err) {
                    zformServ.handleServerErr($scope.theForm, err);
                }).finally(done);

            }
        },
        ''
    ]);


    $scope.propRows = [];
    ['name',
     'nickname',
     'country'
    ].forEach(function(name){
        $scope.propRows.push($scope.clSchema[name]);
    });

    ControllerHelper.Init({
        scope:     $scope,
        controller: 'ClientController',
        modelLabel: '客户',
        modelName:  'client',
        rs:         ClientRS,
        restricts:  null,
        stateHead:  null,
    }).then(function(){
        if ($scope.client && !$scope.isNew) {
            var stateParams = '({client:"' + $scope.client._id + '"})';
            $scope.clientOneTabs = [
                {  
                    text: '主页', 
                    color: 'orange',
                    stateGroup:'client.one.detail', 
                    state: 'client.one.detail' + stateParams,
                    icon: 'fa fa-home',
                },
                {   
                    text: '基本信息', 
                    color: 'orange',
                    stateGroup:'client.one.edit', 
                    state: 'client.one.edit' + stateParams,
                    icon: 'fa fa-home',
                },
                {   
                    text: '联系人', 
                    color: 'orange',
                    stateGroup:'client.one.contact', 
                    state: 'client.one.contact' + stateParams,
                    icon: 'fa fa-home',
                },
                {   
                    text: '购买记录', 
                    color: 'orange',
                    stateGroup:'client.one.history', 
                    state: 'client.one.history' + stateParams,
                    icon: 'fa fa-home',
                }
            ];
        }
    });
});


app.controller('ClientOneContactController', function(
                $scope
                , $state
                , $modal
                , ControllerHelper
                , zformServ
                , VLDT
                , ClientRS
                , ContactRS
                ){
    var coSchema = $scope.coSchema = {
        fullname: {
            title: '姓名',
            el: 'input',
            validators: { required: VLDT.required, },
        },
        importance: {
            title: '重要性',
            el: 'radio-buttons',
            options: [
                {label: '非常重要', value: 70},
                {label: '重要', value: 50},
                {label: '普通', value: 30},
                {label: '不重要', value: 10},
                {label: '失效', value: 0},
            ],
        },
        organization: {
            title: '公司(单位)',
            el: 'input',
            isReadonly: true,
        },
        telephone: {
            title: '电话',
            el: 'input',
        },
        email: {
            title: '电子邮件',
            el: 'input',
        },
        responsibility: {
            title: '负责业务',
            el: 'input',
        },
        department: {
            title: '部门',
            el: 'input',
        },
        headship: {
            title: '职务',
            el: 'input',
        },
        mobile: {
            title: '移动电话',
            el: 'input',
        },
        fax: {
            title: '传真',
            el: 'input',
        },
        wangwang: {
            title: '旺旺',
            el: 'input',
        },
        postcode: {
            title: '邮编',
            el: 'input',
        },
        postAddress: {
            title: '邮政地址',
            el: 'input',
        },
        comment: {
            title: '备注',
            el: 'input',
        }        
    }

    for (let k in coSchema)
        coSchema[k].name = k;

    $scope.formRows = [];

    ['fullname',
     'importance',
     'organization',
     'telephone',
     'email',
     'responsibility',
     'department',
     'headship',
     'mobile',
     'fax',
     'wangwang',
     'postcode',
     'postAddress',
     'comment'
    ].forEach(function(name){
        var prop = coSchema[name];
        $scope.formRows.push([prop.title, prop]);
    })

    $scope.formRows.push([
        '',
        {
            el: 'button',
            type: 'submit',
            text: '保存',
            onClick: function(done, m) {
                m.client = $scope.client._id,
                ContactRS.Save(m).then(function(co){
                }, function(err){
                    zformServ.handleServerErr($scope.contactForm, err);
                }).finally(done);

            }
        },
        ''
    ]);

    $scope.contact = {};

    $scope.setCurContact = function(con) {
        $scope.contact = con;
        angular.copy(con, $scope.formContact);
    }

    $scope.createNew = function() {
         var con = {
            _id: 'new',
            organization: $scope.client.name
        };
        $scope.contact = con;
        angular.copy(con, $scope.formContact);
    }

    ControllerHelper.Init({
        scope:     $scope,
        controller: 'ClientOneContactController',
        modelLabel: '联系人',
        modelName:  'contact',
        rs:         ContactRS,
        restricts:  ['client'],
        stateHead:  null,
    }).then(function(){
        $scope.formContact.organization = $scope.client.name;
    });
});

app.controller('ClientOneOpptController', function(
                $scope
                , $state
                , $modal
                , ControllerHelper
                , Dialogs
                , ClientRS
                , OpptRS
                , Cache
                )  {
    // ControllerHelper.Init($scope, 'ClientOneOpptController', '商机', 'oppt', OpptRS, ['client']).then(function(){
    // });
});