'use strict'

app.controller('UserController', function(
                $scope
                , $state
                , ControllerHelper
                , zformServ
                , VLDT
                , Dict
                , UserRS
                )  {
    var uSchema = $scope.uSchema = {
        email: {
            title: 'Email',
            el: 'input',
            validators: { required: VLDT.required, },
        },
        name: {
            title: '真实姓名',
            el: 'input',
            validators: { required: VLDT.required, },
        },
        password: {
            title: '密码',
            el: 'input',
            type: 'Password',
            validators: { required: VLDT.required, },
        },
        role: {
            title: '角色',
            el: 'radio',
            options: function(){ return Dict.GetFormOptions('UserRole')}(),
            validators: { required: VLDT.required, },
        },
        isPubContact: {
            title: '公开联系人',
            name: 'isPubContact',
            el: 'radio',
            isInline: true,
            options: [
                {label: '公开', value: true},
                {label: '不公开', value: false},
            ],
            validators: { required: VLDT.required, },
        }
    };

    for (let k in uSchema)
        uSchema[k].name = k;

    $scope.formRows = [];
    ['email',
     'name',
     'password',
     'role',
     'isPubContact',
    ].forEach(function(name){
       var prop = uSchema[name];
       $scope.formRows.push([prop.title, prop, '']);
    });
    $scope.formRows.push([
        '',
        {
            el: 'button',
            type: 'submit',
            text: '保存',
            onClick: function(done, m) {
                UserRS.Save(m).then(function(u){
                    $state.go('user.list');
                }, function(err){
                    zformServ.handleServerErr($scope.theForm, err);
                }).finally(done);
            }
        },
        ''
    ]);

    $scope.can = {
        modify: function(user) {
            if (USER.role === 'admin') return true;
            if (USER._id === user._id) return true;
            return false;
        }
    }


    $scope.propRows = [];
    ['email',
     'name',
     'password',
     'role',
     'isPubContact',
    ].forEach(function(name){
       $scope.propRows.push(uSchema[name]);
    });

    ControllerHelper.Init({
        scope:     $scope,
        controller: 'UserController',
        modelLabel: '用户帐号',
        modelName:  'user',
        rs:         UserRS,
        restricts:  null,
        stateHead:  null,
    }).then(function(){
        if ($scope.user && !$scope.isNew) {
            var stateParams = '({user:"' + $scope.user._id + '"})';
            $scope.userOneTabs = [
                {   
                    text: '主页', 
                    color: 'orange',
                    stateGroup:'user.one.detail', 
                    state: 'user.one.detail' + stateParams,
                    icon: 'fa fa-home',
                },
                {   
                    text: '基本信息', 
                    color: 'orange',
                    stateGroup:'user.one.edit', 
                    state: 'user.one.edit' + stateParams,
                    icon: 'fa fa-home',
                },
            ];
        }
    });
 







    $scope.formPasswordAttrs = [
        {
            label: '密码',
            name: 'password',
            type: 'Password',
        }
    ]

    $scope.EditPassword = function(formUser) {
        $scope.formUser = angular.copy(formUser);

        Dialogs.Form($scope, {
            title: '修改密码',
            templateUrl: '/ui-user/pc/m/user/user.one.edit-password.html',
            controller: 'UserController',
            Confirm: function() {
                return $scope.Save({
                    _id: $scope.formUser._id,
                    password: $scope.formUser.password,
                });
            }
        });
    }

})

