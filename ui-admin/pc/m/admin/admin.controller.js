app.controller('AdminController', function(
                $scope
                , $rootScope
                , $state
                , ControllerHelper
                , zformServ
                , AdminRS
                )  {
    $scope.formAdmin = {
        status: 'open',
    };
    ControllerHelper.Init({
        scope:     $scope,
        controller: 'AdminController',
        modelLabel: '管理员',
        modelName:  'admin',
        rs:         AdminRS,
        restricts:  null,
        stateHead:  null,
        newTpl:     {},
    }).then(function(){    
    });

});


app.controller('AdminOneEditController', function(
                $scope
                , $rootScope
                , $state
                , ControllerHelper
                , zformServ
                , VLDT
                , AdminRS
                )  {
    $scope.formAdminRows1 = [
        [
            '用户名',
            {
                el: 'input',
                type: 'text',
                name: 'username',
                min: 5,
                validators: {
                    required: VLDT.required,
                }
            }
        ],
        [
            '状态',
            {
                el: 'radio',
                name: 'status',
                isInline: true,
                options: [
                    {label: '开通', value: 'open'},
                    {label: '暂停', value: 'pause'},
                ]
            }
        ],
    ]

    $scope.formAdminRows2 = [
        [
            '密码',
            {
                el: 'input',
                type: 'password',
                name: 'password',
                minlength: 6,
                validators: {
                    required: VLDT.required,
                }
            }
        ],
        [
            '密码确认',
            {
                el: 'input',
                type: 'password',
                name: 'passconf',
                validators: {
                    passconfNotSame: function(v) { return $scope.formAdmin.password === v; }, 
                }
            }
        ],

    ]

    $scope.formAdminRows3 = [
        [
            '真实姓名',
            {
                el: 'input',
                type: 'text',
                name: 'realname',
            }
        ],
        [
            '备注',
            {
                el: 'textarea',
                name:  'comment',
            }
        ]
    ]


    $scope.submitRow = [
        '',
        {
            el: 'button',
            type: 'submit',
            text: '保存',
            onClick: function(done, m) {
                AdminRS.Save($scope.formAdmin).then(function(admin){
                    $state.go('admin.list');
                }, function(err){
                    zformServ.handleServerErr($scope.theForm, err);
                }).finally(done);
            }
        }
    ]
});


app.controller('AdminOneEdPassController', function(
                $scope
                , $rootScope
                , $state
                , ControllerHelper
                , zformServ
                , VLDT
                , AdminRS
                )  {
    $scope.formPass = {}

    $scope.formPassRows = [
        [
            '密码',
            {
                el: 'input',
                type: 'password',
                name: 'password',
                minlength: 6,
                validators: {
                    required: VLDT.required,
                }
            }
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
            }
        ],
    ]

console.log($scope.admin)
    $scope.submitRow = [
        '',
        {
            el: 'button',
            type: 'submit',
            text: '保存',
            onClick: function(done, m) {
                AdminRS.Save({
                    _id: $state.params.admin,
                    password: $scope.formPass.password,
                }).then(function(admin){
                    $state.go('admin.list');
                }, function(err){
                    zformServ.handleServerErr($scope.theForm, err);
                }).finally(done);
            }
        }
    ]
});