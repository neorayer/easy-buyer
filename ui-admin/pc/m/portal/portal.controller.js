app.controller('PortalController', function(
                $scope
                , $rootScope
                , $state
                )  {
    $scope.ReloadToHome = function() {
        document.location = '/pc/admin?' + Math.random() + '#/dashboard';

    }
});


app.controller('PortalSigninController', function(
                $scope
                , $rootScope
                , $state
                , $timeout
                , VLDT
                , zformServ
                , AdminSigninRS
                )  {
    $scope.formSignin = {};
    $scope.formRows = [
        [
            '用户名',
            {
                el: 'input',
                type: 'text',
                name: 'username',
                validators: { required: VLDT.required },
            },
        ],
        [
            '密码',
            {
                el: 'input',
                type: 'password',
                name: 'password',
                validators: { required: VLDT.required },
            }
        ],
        [
            '',
            {
                el: 'button',
                type: 'submit',
                text: '登录',
                doingText: '正在验证...',
                onClick: function(done, m) {
                    return AdminSigninRS.Save($scope.formSignin).then(function(data) {
                        $scope.ReloadToHome();
                    }, function(err) {
                        zformServ.handleServerErr($scope.theForm, err);
                    }).finally(done);
                },
            },
            {
                el: 'ui-state-link',
                text: '忘记密码',
                uiSref: 'portal.forgetpwd',
            }
        ]
    ];
});

app.controller('PortalForgetpwdController', function(
                $scope
                , $rootScope
                , $state
                , VLDT
                , AdminSigninRS
                )  {
    $scope.formGetByEmail = {};
    $scope.byEmailRows = [
        [
            '输入您的Email地址',
            {
                el: 'input',
                type: 'email',
                name: 'email',
                validators: { required: VLDT.required },
            },
            ''
        ],
        [
            '',
            {
                el: 'button',
                type: 'submit',
                text: '找回密码',
            },
            {
                el: 'ui-state-link',
                text: '前往登录',
                uiSref: 'portal.signin',
            },
        ]
    ]
});
//     $scope.serverErrors = {};
//     $scope.formData = {};

//     $scope.formRows = {};
//     $scope.formRows.username = [
//         {
//             type: 'label',
//             text: '用户名',
//         },
//         {
//             type: 'input',
//             inputType: 'text',
//             name: 'username',
//             ngModel: $scope.formData,
//             cssCol: 'col-sm-9',
//             validators: [
//                 VALIDATOR_REQUIRE,
//             ]
//         },
//     ],
//     $scope.formRows.password = [
//         {
//             type: 'label',
//             text: '密码',
//         },
//         {
//             type: 'input',
//             inputType: 'password',
//             name: 'password',
//             ngModel: $scope.formData,
//             cssCol: 'col-sm-9',
//             validators: [
//                 VALIDATOR_REQUIRE,
//             ]
//         }
//     ],
//     $scope.formRows.submit = [
//         {
//             type: 'label',
//         },
//         {
//             type: 'button',
//             btnType: 'submit',
//             text: 'Login',
//             Click: function(done) {
//                 var d = $scope.formData;
//                 return AdminSigninRS.Save({
//                     username: d.username,
//                     password: d.password,
//                 }).then(function(data){
//                     document.location = 'admin-index?' + Math.random() + '#dashboard';
//                 }, function(err){
//                     zformErrorsHandle($scope.serverErrors, err);
//                 }).finally(done);
//             }
//         }
//     ]

// });