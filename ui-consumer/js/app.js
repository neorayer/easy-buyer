var app = angular.module('rhino_consumer', 
    [ 
        'ngResource', 'ui.router', 'ui.bootstrap',
        'textAngular','ui.select', 'ngSanitize', 'ngCookies',
        'zform']);


var Errhandler = function(err){
    console.error(err.stack);
    if (err.data)
        alert(err.data.msg);
}

app.directive('loginForm', function($rootScope, $state, $window, zformServ){
    return {
        restrict: 'E',
        scope: {
            statePath: '@',
            loginRs: '=',
        },
        transclude: true,
        templateUrl: '/ui-consumer/pc/m/portal/portal.login.html',
        controller: function($scope) {
            $scope.formLoginUser = {};

            $scope.formRows = [
                [
                    {
                        text: 'Email',
                    },
                    {
                        el: 'input',
                        name: 'email',
                    }
                ],
                [
                    {
                        text: 'Password',
                    },
                    {
                        el: 'input',
                        type: 'password',
                        name: 'password',
                    }
                ],
                [
                    '',
                    '',
                    {
                        el: 'button',
                        text: 'LOGIN',
                        onClick: function(done, m) {
                            return $scope.loginRs.Save($scope.formLoginUser).then(function(u){
                                 $rootScope.SESSION_USER = u;
                                done();
                                console.log($state)
                                $window.location = '/pc/consumer/company/' + COMPANY._id 
                                    + '#/product/list';
                            }, function(err) {
                                zformServ.handleServerErr($scope.loginForm, err);
                            }).finally(done);
                        }
                    },
                ]
            ]

            $scope.SESSION_USER = $rootScope.SESSION_USER;

        }
    }
});
