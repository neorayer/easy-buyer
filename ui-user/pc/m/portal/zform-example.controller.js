app.controller('PortalController', function(
                $scope
                , $rootScope
                , $state
                )  {
    $scope.GotoSignin = function() {
        document.location.href = 'signin';
    }

    $scope.GotoSignup = function() {
        document.location.href = 'signup';
    }

    $scope.GotoBrochure = function() {
    }

});

app.controller('PortalSignupController', function(
                $scope
                , $rootScope
                , $state
                , $timeout
                , RegCodeRS
                , SignupRS
                )  {

    $scope.formSignup = {
        birthday: {},
        uidType: 'mobile',
        isSubscribe: true,
    };

    $scope.years = YearsArray(1945,2010);

    var countries = $scope.countries = [
        {
            label: '澳大利亚 +61',
            value: {shortname: 'au', areacode: '61'},
        },
        {
            label: '美国 +1',
            value: {shortname: 'us', areacode: '1'},
        },
        {
            label: '英国 +44',
            value: {shortname: 'uk', areacode: '44'},
        },
        {
            label: '日本 +81',
            value: {shortname: 'jp', areacode: '81'},
        },
        {
            label: '德国 +49',
            value: {shortname: 'de', areacode: '49'},
        },
        {
            label: '荷兰 +31',
            value: {shortname: 'nl', areacode: '31'},
        }
    ];

 
    $scope.frDefines = {};

    $scope.frDefines.source = [
        {
            type: 'label',
            text: 'Source',
        },
        {
            type: 'static',
            text: 'Search Engine like Google',
            cssCol: 'col-sm-9',
        }
    ]


    $scope.frDefines.uidType = [
        {
            cssCol: 'col-sm-7',
            type: 'dropdown-button',
            name: 'uidType',
            text: 'Select UID Type',
            options: [
                { label: 'Mobile', value: 'mobile'},
                { label: 'Email', value: 'email'},
            ],
            onSelectItem: function(option) {
                $scope.formSignup.uidType = option.value;
            }
        },
        {
            cssCol: 'col-sm-5',
            type: 'static',
            ngModel: $scope.formSignup,
            name: 'uidType',
        }
    ]

    $scope.frDefines.email = [
        {
            type: 'label',
            text: 'Email Address',
        },
        {
            type: 'input',
            inputType: 'text',
            cssCol: 'col-sm-9',
        }
    ]


    $scope.frDefines.mobile = [
        {
            type: 'label',
            text: 'Mobile',
        },
        {
            type: 'select',
            ngModel: $scope.formSignup,
            name: 'country',
            cssCol: 'col-sm-4 col-xs-5',
            placeholder: 'Country',
            options: countries,
            validators: [
                {
                    msg: 'required',
                    Check: function(v) {
                        return v ? true : false;
                    },
                },
            ],
        },
        {
            type: 'input',
            ngModel: $scope.formSignup,
            name: 'mobile',
            cssCol: 'col-sm-5 col-xs-7',
            validators: [
                {
                    msg: 'required.',
                    Check: function(v) { return v && v.length > 0; },
                }
            ],
        }
    ];



    $scope.frDefines.secureCode = [
        {
            type: 'Label',
            text: 'SecureCode',
            isRequired: true,
        },
        {
            type: 'input-group',
            cssCol: 'col-sm-9',
            controls: [
                {
                    type: 'input',
                    ngModel: $scope.formSignup,
                    name: 'secureCode',
                    cssCol: 'col-sm-5 col-xs-8',
                },
                {
                    type: 'button',
                    text: 'Get Code',
                    cssBtn: 'btn-warning',
                    //doingText: 'Waiting',
                    cssCol: 'col-sm-4 col-xs-4',
                    Click: function(done /* function */) {
                        console.log("Click it");
                        $timeout(done, 2000);
                    }
                },
            ]

        },
    ];

    $scope.frDefines.password = [
        {
            cssCol: 'col-sm-3',
            type: 'label',
            text: 'Password',
        },
        {
            type: 'input',
            ngModel: $scope.formSignup,
            name: 'password',
            inputType: 'password',
            cssCol: 'col-sm-9',
            placeholder: 'choise a good password', 
            helpText: 'more than 6 characters',
            validators: [
                {
                    msg: 'required',
                    Check: function(v) {
                        return v ? true : false;
                    },
                },
                {
                    msg: 'At least 6 letters, numbers or _',
                    Check: function(v) {
                        return v && v.length >= 6 ? true : false;
                    }
                },
            ]
          
        }
    ] ;

    $scope.frDefines.passconf = [
        {
            type: 'label',
            text: 'Confirm Password',
        },
        {
            type: 'input',
            ngModel: $scope.formSignup,
            name: 'passconf',
            inputType: 'password',
            cssCol: 'col-sm-9',
            validators: [
                {
                    msg: 'required.',
                    Check: function(v) { return v && v.length > 0; },
                },
                {
                    msg: 'Must be same as the password',
                    Check: function(v) { return v === $scope.formSignup.password; }
                }
            ]
        }

    ];


    $scope.frDefines.name = [
        {
            type: 'label',
            text: 'Your name',
        },
        {
            type: 'input',
            ngModel: $scope.formSignup,
            name: 'firstname',
            inputType: 'text',
            cssCol: 'col-sm-4 col-xs-6',
            placeholder: 'First name',
        },
        {
            type: 'input',
            ngModel: $scope.formSignup,
            name: 'lastname',
            inputType: 'text',
            cssCol: 'col-sm-5 col-xs-6',
            placeholder: 'Last name',
        }
    ];

    $scope.frDefines.gender = [
        {
            type: 'label',
            text: 'Gender',
        },
        {
            type: 'radio',
            ngModel: $scope.formSignup,
            name: 'gender',
            options: [
                { label: 'Man', value: 'm' },
                { label: 'Womain', value: 'w'},
                { label: 'Other', value: 'o'},
            ],
        }
    ];

    $scope.frDefines.gender2 = [
        {
            type: 'label',
            text: 'Gender',
        },
        {
            type: 'radio-buttons',
            cssBtn: 'btn-success',
            ngModel: $scope.formSignup,
            name: 'gender',
            options: [
                { label: 'Man', value: 'm' },
                { label: 'Womain', value: 'w'},
                { label: 'Other', value: 'o'},
            ],
            cssCol: 'col-sm-9',
        }
    ];

    $scope.frDefines.birthday= [
        {
            type: 'label',
            text: 'Birthday',
        },
        {
            type: 'select',
            ngModel: $scope.formSignup.birthday,
            name: 'month',
            options: [1,2,3,4,5,6,7,8,9,10,11,12].map(function(v) { 
                return { label: '' + v, value : '' + v}
            }),
            placeholder: 'Month',
            cssCol: 'col-sm-3 col-xs-4',
        },
        {
            type: 'select',
            ngModel: $scope.formSignup.birthday,
            name: 'day',
            options: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map(function(v) { 
                return { label: '' + v, value : '' + v}
            }),
            placeholder: 'Day',
            cssCol: 'col-sm-3 col-xs-4',
        },
        {
            type: 'select',
            ngModel: $scope.formSignup.birthday,
            name: 'year',
            options: YearsArray(1945,2010).map(function(v) { 
                return { label: '' + v, value : '' + v}
            }),
            placeholder: 'Year',
            cssCol: 'col-sm-3 col-xs-4',
        },
    ];

    $scope.frDefines.subscribe = [
        {
            type: 'label',
            text: 'Mailling List',
        },
        {
            type: 'checkbox',
            ngModel: $scope.formSignup,
            name: 'isSubscribe',
            text: 'Yes, sign me up to receive daily e-mails.',
            cssCol: 'col-sm-9',
        }
    ];

    $scope.frDefines.submit = [
        {
            type: 'label',
        },
        {
            cssCol: 'col-sm-6',
        },
        {
            type: 'button',
            btnType: 'submit',
            text: 'Next Step',
            cssCol: 'col-sm-3',
            Click: function(done) {
                console.log('do submit');
                done();
            }
        }
    ]


    $scope.RequestCodeBtnLabel = "获取验证码";

    $scope.RequestCode = function() {
        $scope.isRegCodeSent = true;
        $scope.RequestCodeBtnLabel = "验证码已发送......";
        return RegCodeRS.Save($scope.formSignup).then(function(){
        }, Errhandler);
    }

    $scope.Signup = function(formSignup) {
        return SignupRS.Save(formSignup).then(function(){
            console.log('sign up succ');
            console.log('redirect to login');
        }, Errhandler);
    }


})


app.controller('PortalSigninController', function(
                $scope
                , $rootScope
                , $state
                , SigninRS
                )  {

    $scope.signinAttrs = [
        {
            label: '手机号',
            name: 'mobile',
        },
        {
            label: '密码',
            name: 'password',
            type: 'Password',
        },
    ],

    $scope.formSignin = {};

    $scope.Signin = function(formSignin) {
        return SigninRS.Save(formSignin).then(function(data){
            document.location = 'index?' + Math.random() + '#dashboard';
        }, Errhandler);
    }
});