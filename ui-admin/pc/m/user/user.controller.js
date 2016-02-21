app.controller('UserController',function(
        $scope
        , $state
        , ControllerHelper
        , zformServ
        , VLDT
        , UserRS
        ) {

    $scope.formUser = {};

    ControllerHelper.Init($scope, 'UserController', '用户', 'user', UserRS, null, null).then(function(){
    });

    
})