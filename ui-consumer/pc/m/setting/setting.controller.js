app.controller('SettingController', function(
                $scope
                , $state
                , $modal
                , $q
                , Dialogs
                , Cache
                , ConsumerRS
                )  {
})

app.controller('SettingPasswordController', function(
                $scope
                , $state
                , $modal
                , $q
                , Dialogs
                , Cache
                , ConsumerRS
                , zformServ
                )  {
    $scope.formPassword = {_id: $scope.SESSION_USER._id};

    $scope.formRows = [
        [
            'Old Password',
            {
                el: 'input',
                type: 'password',
                name: 'oldpass'
            }
        ],
        [
            'New Password',
            {
                el: 'input',
                type: 'password',
                name: 'newpass',
            }
        ],
        [
            '',
            '',
            {
                el: 'button',
                type: 'submit',
                text: 'SUBMIT',
                onClick: function(done) {
                    return ConsumerRS.Save($scope.formPassword).then(function() {
                        Dialogs.Confirm('Password has been updated.');
                    }, function(err) {
                        zformServ.handleServerErr($scope.passwordForm, err);
                    }).finally(done);
                }
            }
        ]
    ]
})


app.controller('SettingProfileController', function(
                $scope
                , $state
                , $modal
                , $q
                , Dialogs
                , Cache
                , ConsumerRS
                , zformServ
                )  {
    $scope.formProfile = angular.copy($scope.SESSION_USER);
    delete $scope.formProfile.password;


    $scope.formRows = [
        [
            'Your name',
            {
                name: 'name',
                el: 'input',
            }
        ],
        [
            'Location',
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
        ],
        [
            '',
            '',
            {
                el: 'button',
                type: 'submit',
                text: 'Register',
                onClick: function(done) {
                    ConsumerRS.Save($scope.formProfile).then(function(con){
                        $root.SESSION_USER = angular.copy(con);
                        Dialogs.Confirm('Profile has been updated');
                    }, function(err) {
                        zformServ.handleServerErr($scope.formProfile, err);
                    }).finally(done);
                }
            }
        ]
    ];   


});

app.controller('SettingAddressController', function(
                $scope
                , $state
                , $modal
                , $q
                , Dialogs
                , Cache
                , ConsumerRS
                , AddressRS
                , ControllerHelper
                )  {
    ControllerHelper.Init({
        scope:     $scope,
        controller: 'SettingAddressController',
        modelLabel: '地址',
        modelName:  'address',
        rs:         AddressRS,
        restricts:  null,
        stateHead:  'setting',
        newTpl:     {},
    }).then(function(){
    });

    $scope.formAddress = {
        _id: 'new',
    }

    $scope.formRows = [
        [
            'Receiver Name',
            {
                el: 'input',
                name: 'receiver',
            },
        ],
        [
            'Phone',
            {
                el: 'input',
                name: 'phone',
            }
        ],
        [
            'Street line 1',
            {
                el: 'input',
                name: 'streetLine1',
            }
        ],
        [
            'Street line 2',
            {
                el: 'input',
                name: 'streetLine2',
            }
        ],
        [
            'Suburb',
            {
                el: 'input',
                name: 'suburb',
            }
        ],
        [
            'State',
            {
                el: 'input',
                name: 'state',
            }
        ],
        [
            'Postcode',
            {
                el: 'input',
                name: 'postcode',
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
            '',
            '',
            '',
            {
                el: 'button',
                type: 'submit',
                text: 'SUBMIT',
                onClick: function(done) {
                    return AddressRS.Save($scope.formAddress).then(function() {
                        Dialogs.Confirm('Address has been updated.');
                        $scope.isShowEditor = false;
                    }, function(err) {
                        zformServ.handleServerErr($scope.addressForm, err);
                    }).finally(done);
                }
            },
            {
                el: 'button',
                text: 'CANCEL',
                onClick: function(done) {
                    $scope.isShowEditor = false;
                    done();
                }
            },


        ]
    ];

    $scope.isShowEditor = false;

    $scope.ShowAddAddress = function() {
        $scope.formAddress = {_id: 'new'};
        $scope.isShowEditor = true;
    }

    $scope.ShowEditAddress = function(addr) {
        angular.copy(addr, $scope.formAddress);
        $scope.isShowEditor = true;
    }


    $scope.SetPrimary = function(addr) {
        return AddressRS.Save({
            _id: addr._id,
            isPrimary: true,
        }).then(function(addr){
            $scope.addresss.forEach(function(address){
                address.isPrimary = address._id === addr._id;
            });
        }, Errhandler);
    }
});