app.controller('CompanyController', function(
                $scope
                , $rootScope
                , $state
                , ControllerHelper
                , zformServ
                , CompanyRS
                )  {
    $scope.formCompany = {
        name: '阿里联想新浪公司',
        nickname: 'abc',
        name_en: 'ali sina',
        email: 'admin@sina.com',
        password: '111111',
        passconf: '111111',
        contactName: '马云',
        contactTel: '010 8888888',
    };
    ControllerHelper.Init({
        scope:     $scope,
        controller: 'CompanyController',
        modelLabel: '公司',
        modelName:  'company',
        rs:         CompanyRS,
        restricts:  null,
        stateHead:  null,
        newTpl:     {},
    });

});

app.controller('CompanyOneEdPassController', function(
                $scope
                , $state
                , zformServ
                , VLDT
                , CompanyRS
    ){

    $scope.formPass = {};

    $scope.formRows = [
        [
            '新密码',
            {
                el: 'input',
                type: 'password',
                name: 'password',
                minlength: 6,
                validators: {
                    required: VLDT.required,
                },
            },
        ],
        [
            '密码确认',
            {
                el: 'input',
                type: 'password',
                name: 'passconf',
                validators: {
                    passconfNotSame: function(v) { return $scope.formPass.password === v; }, 
                }
            },
        ],
    ]

    $scope.submitRow = [
        '',
        {
            el: 'button',
            type: 'submit',
            icon: 'fa fa-check',
            text: '提交',
            onClick: function(done) { 
                SavePassword().then(function(){
                    $state.go('company.list');
                }).finally(done);
            }
        },
        {
            el: 'button',
            type: 'button',
            btnClass: 'btn-default',
            icon: 'fa fa-times',
            text: '取消',
            onClick: $scope.goBack,
        }
    ]

    var SavePassword = function() {
        return CompanyRS.Save({
            _id: $state.params.company,
            password: $scope.formPass.password,
        }, function(err) {
            zformServ.handleServerErr($scope.theForm, err);
        });
    }

});

 app.controller('CompanyOneEditController', function(
                $scope
                , $rootScope
                , $state
                , $timeout
                , VLDT
                , ControllerHelper
                , zformServ
                , CompanyRS
                )  {


//***********
//关于one的问题，又TMD的出问题了！！！！！

   $scope.formComRows = [
        [
            '公司全名(中文)',
            {
                el: 'input',
                type: 'text',
                name: 'name',
                minlength: 3,
                validators: {required: VLDT.required, },
            }
        ],
        [
            '简称',
            {
                el: 'input',
                type: 'text',
                name: 'nickname',
                maxlength: 10,
                validators: {required: VLDT.required, },
            },
            {
                el: 'text',
                text: '简称便于输入和查询',
            },
        ],
        [
            'Company name(English)',
            {
                el: 'input',
                type: 'text',
                name: 'name_en',
                tip: '如果公司有外贸业务，建议填写英文名称',
            }
        ],

    ]

    $scope.formAccRows = [
        [
            '用户名(Email)',
            {
                el: 'input',
                type: 'email',
                name: 'email',
                validators: {required: VLDT.required, },
            }
        ],
        [
            '密码',
            {
                el: 'input',
                type: 'password',
                name: 'password',
                tip: '至少6个字符',
                minlength: 6,
                validators: {required: VLDT.required, },
            },
            {
                el: 'label',
                text: '密码确认',
            },
            {
                el: 'input',
                type: 'password',
                name: 'passconf',
                tip: '再输入一遍密码',
                validators: {
                    passconfNotSame: function(v) { return $scope.formCompany.password === v; }, 
                }
            }
        ]
    ]

    $scope.formContactRows = [
        [
            '姓名',
            {
                el: 'input',
                name: 'contactName',
            },
        ],
        [
            '电话',
            {
                el: 'input',
                name: 'contactTel',
            },
        ],
    ]

    $scope.submitRow = [
        '',
        {
            el: 'button',
            type: 'submit',
            icon: 'fa fa-save',
            text: '提交',
            onClick: function(done) {
                CompanyRS.Save($scope.formCompany).then(function(co) {
                    $state.go('company.list');
                }, function(err) {
                    zformServ.handleServerErr($scope.theForm, err);
                }).finally(done);
            },
        },
        {
            el: 'button',
            btnClass: 'btn-success',
            type: 'submit',
            icon: 'fa fa-save',
            text: '保存后再新增',
            onClick: function(done) {
               CompanyRS.Save($scope.formCompany).then(CreateNext, function(err) {
                    zformServ.handleServerErr($scope.theForm, err);
                }).finally(done);

                SaveCompany().then(CreateNext).finally(done)},
        },
     ]

     $scope.alert = {};
     var CreateNext = function() {
        showAlert('alert-warning', '新建公司完毕。请输入下一个要新建的公司信息。');
        $scope.theForm.$zform_setBlured(false);

        angular.copy({}, $scope.formCompany);
     }

     var showAlert = function(theClass, text) {
        $scope.alert.isShow = true;
        $scope.alert.class = theClass;
        $scope.alert.text = text;
        $timeout(function() { $scope.alert.isShow = false; }, 5000);
    }

})
