
app.controller('PortalController', function(
                $scope
                , $rootScope
                , $state
                )  {
    $scope.gotoSignin = function(data) {
        document.location.href = 'signin?' + ObjectToQuery(data);
    }

    $scope.gotoSignup = function(data) {
        document.location.href = 'signup?' + ObjectToQuery(data);
    }

    $scope.gotoHome = function() {
        document.location.href = 'index#/dashboard/cover';
    }

    $scope.reloadToHome = function() {
        document.location.href = 'index?' + Math.random() + '#/dashboard/cover';
    }

});

app.controller('PortalSigninController', function(
                $scope
                , $state
                , zformServ
                , VLDT
                , SigninRS
                ) {
    $scope.formSignin = {};

    $scope.formRows = [
        [
            '用户名(Email)',
            {
                el: 'input',
                type: 'text',
                name: 'email',
                validators: {
                    required: VLDT.required,
                }
            }
        ],
        [
            '密码',
            {
                el: 'input',
                type: 'password',
                name: 'password',
            }
        ]
    ]

    $scope.submitRow = [
        '',
        {
            el: 'button',
            type: 'submit',
            text: '登录',
            onClick: function(done, m) {
                SigninRS.Save($scope.formSignin).then(function(data) {
                    $scope.reloadToHome();
                }, function(err) {
                    zformServ.handleServerErr($scope.theForm, err);
                }).then(done);
            },
        },
        {
            el: 'link',
            text: '注册',
            url: 'signup',
        }
    ]
});

app.controller('PortalSignupController', function(
                $scope
                , $state
                , zformServ
                , VLDT
                , SignupRS
                )  {
    $scope.formSignup = {
        name: '阿里联想新浪公司',
        nickname: 'abc',
        name_en: 'ali sina',
        email: 'admin@sina.com',
        password: '111111',
        passconf: '111111',
        contactName: '马云',
        contactTel: '010 8888888',
    };

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
                placeholder: '填写公司英文名称',
                tip: '如果公司有外贸业务，建议填写英文名称',
            }
        ],

    ]

    $scope.formAccRows = [
        [
            'Email',
            {
                el: 'input',
                type: 'email',
                name: 'email',
                placeholder: '作为登录用户名',
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
                    passconfNotSame: function(v) { return $scope.formSignup.password === v; }, 
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
                SignupRS.Save($scope.formSignup).then(function(co) {
                    $scope.gotoSignin({msg: '公司账户注册成功，请登录。'});
                }, function(err) {
                    zformServ.handleServerErr($scope.theForm, err);
                }).finally(done);
             },
        },
        ''
     ]
});

