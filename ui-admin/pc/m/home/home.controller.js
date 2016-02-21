app.controller('HomeController', function(
                $scope
                , $rootScope
                , $state
                , AdminSigninRS
                )  {
    $scope.$state = $state;

    $scope.ADMIN = ADMIN;

    $scope.gotoHome = function() {
        document.location = 'admin?' + Math.random() + '#/dashboard/cover';
    };

    $scope.gotoPortal = function() {
        document.location = 'admin';
    };

    $scope.goBack = function() {
        window.history.back();
    };

    $scope.signout = function() {
        return AdminSigninRS.DeleteById('any').then(function(){
            $scope.gotoPortal();
        });
    };

});
