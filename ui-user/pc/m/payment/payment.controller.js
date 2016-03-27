app.controller('PaymentController', function(
                $scope
                , $state
                , $modal
                , ControllerHelper
                , Dialogs
                , Dict
                , Cache
                )  {
});

app.controller('PaymentPaypalController', function(
                $scope
                , $rootScope
                , $state
                , $modal
                , ControllerHelper
                , zformServ
                , VLDT
                , PaypalRS
                )  {
    $scope.formRows = [
        [
            '帐号名称',
            {
                el: 'input',
                name: 'name',
                validators: { required: VLDT.required },
            },
        ],
        [
            '授权用户名',
            {
                el: 'input',
                name: 'username',
                validators: { required: VLDT.required },
            },
        ],
        [
            '授权密码',
            {
                el: 'input',
                name: 'password',
                validators: { required: VLDT.required },
            },
        ],
        [
            '授权令牌',
            {
                el: 'input',
                name: 'token',
                validators: { required: VLDT.required },
            },
        ],
        [
            '',
            {
                el: 'button',
                type: 'submit',
                text: '保存',
                onClick: function(done, m) {
                    PaypalRS.Save(m).then(function(){
                        $state.go('payment.paypal.list');
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
        controller: 'PaymentPaypalController',
        modelLabel: 'Paypal',
        modelName:  'paypal',
        rs:         PaypalRS,
        restricts:  null,
        stateHead:  'payment',
        newTpl:     {},
    }).then(function(){
    });
 
});

app.controller('PaymentBankaccController', function(
                $scope
                , $state
                , $modal
                , ControllerHelper
                , zformServ
                , VLDT
                , BankaccRS
                )  {
    $scope.formRows = [
        [
            '国家 Country',
            {
                el: 'ui-select',
                name: 'country',
                options: CONSTS.countries,
                optionLabel: 'name',
                optionValue: 'name',
                validators: { required: VLDT.required },
            },                
        ],
        [
            '银行名称 Bank name',
            {
                el: 'input',
                name: 'bankName',
            },                
        ],
        [
            'SWIFT/BIC code',
            {
                el: 'input',
                name: 'swift',
                validators: { required: VLDT.required },
            },                
        ],
        [
            '账户名称 Account holder name/CTC',
            {
                el: 'input',
                name: 'accName',
            },                
        ],
        [
            '账号 Account number',
            {
                el: 'input',
                name: 'accNumber',
                validators: { required: VLDT.required },
            },                
        ],
        [
            '收款人地址 Address',
            {
                el: 'input',
                name: 'address',
            },                
        ],
        [
            '收款人城市 City',
            {
                el: 'input',
                name: 'city',
            },                
        ],
        [
            '收款人省/州 State',
            {
                el: 'input',
                name: 'state',
            },                
        ],
        [
            '收款人邮编 Postcode',
            {
                el: 'input',
                name: 'postcode',
            },                
        ],
        [
            '备注 Description',
            {
                el: 'input',
                name: 'description',
            },                
        ],
        [
            '',
            {
                el: 'button',
                type: 'submit',
                text: '保存',
                onClick: function(done, m) {
                    BankaccRS.Save(m).then(function(){
                        $state.go('payment.bankacc.list');
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
        controller: 'PaymentBankaccController',
        modelLabel: '银行账户',
        modelName:  'bankacc',
        rs:         BankaccRS,
        restricts:  null,
        stateHead:  'payment',
        newTpl:     {},
    }).then(function(){
    });

});