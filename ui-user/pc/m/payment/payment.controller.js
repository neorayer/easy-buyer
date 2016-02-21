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
                , $state
                , $modal
                , ControllerHelper
                , zformServ
                , PaypalRS
                )  {
    $scope.formRows = [
        [
            '帐号名称',
            {
                el: 'input',
                name: 'name',
            },
        ],
        [
            '授权用户名',
            {
                el: 'input',
                name: 'username',
            },
        ],
        [
            '授权密码',
            {
                el: 'input',
                name: 'password',
            },
        ],
        [
            '授权令牌',
            {
                el: 'input',
                name: 'token',
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

