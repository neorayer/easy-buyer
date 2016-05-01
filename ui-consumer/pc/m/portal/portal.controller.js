app.controller('PortalController', function(
                $scope
                , $rootScope
                , $state
                , $modal
                , $q
                , CartServ
                , ConsumerSignupRS
                , ConsumerSigninRS
                , Dialogs
                , Cache
                , $window
                , zformServ
                )  {   
    if (typeof COMPANY !== 'undefined')
        $rootScope.COMPANY = COMPANY;
    if (typeof session_user !== 'undefined')
        $rootScope.SESSION_USER = session_user;

    CartServ.Init();

    $scope.Logout = function() {
        return ConsumerSigninRS.DeleteById("any").then(function(){
            $scope.SESSION_USER = null;
            $window.location.href = '/pc/consumer/company/' + COMPANY._id 
                            + '#/portal/register';
            $window.location.reload();
        }, function(err) {
            zformServ.handleServerErr($scope.loginForm, err);
        }).finally(done);
    }

    $rootScope.ConsumerSigninRS = ConsumerSigninRS;

    $scope.GoHome = function() {
            document.location.assign('/pc/consumer/company/' + COMPANY._id + '#/product/list');
   //     $state.go('product.list', {}, {reload: true});
    }


});

app.controller('PortalRegisterController', function(
                $scope
                , $rootScope
                , $state
                , $modal
                , $window
                , $q
                , CartServ
                , ConsumerSignupRS
                , ConsumerSigninRS
                , Dialogs
                , Cache
                , zformServ
                )  {   
    $scope.formConsumer = {};

    $scope.formRows1 = [
        [
            'Email',
            {
                el: 'input',
                name: 'email',
            }
        ],
        [
            'Password',
            {
                el: 'input',
                type: 'password',
                name: 'password'
            }
        ]
    ];

    $scope.formRows2 = [
        [
            'Your name',
            {
                name: 'name',
                el: 'input',
            }
        ],
        [
            'Country',
            {
                name: 'country',
                el: 'ui-select',
                optionLabel: 'name',
                optionValue: 'name',
                options: CONSTS.countries,
            }
        ],
        [
            'Company',
            {
                name: 'company',
                el: 'input',
            }
        ],
        [
            'Telephone',
            {
                el: 'input',
                name: 'tel'
            }
        ]
    ];

    $scope.formRows3 = [
        [
            '',
            '',
            {
                el: 'button',
                type: 'submit',
                text: 'Register',
                onClick: function(done) {
                    ConsumerSignupRS.Save($scope.formConsumer).then(function(u){
                        $scope.isHideRegisterForm = true;
                        Dialogs.Confirm('Your account has been created successfully.', 'Congratulation')
                               .then(function(){
                                // $window.location = '/pc/consumer/company/' + COMPANY._id 
                                //     + '#/product/list';
                               });
                    }, function(err) {
                        zformServ.handleServerErr($scope.registerForm, err);
                    }).finally(done);
                }
            }
        ]
    ];

});