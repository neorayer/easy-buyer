app.controller('ContactController', function(
                $scope
                , $rootScope
                , $state
                , $modal
                , $q
                , UserRS
                , MessageRS
                , Dialogs
                , Cache
                )  {   
    $scope.formMessage = {
    }

    if ($rootScope.SESSION_USER) {
        $scope.formMessage.from = $rootScope.SESSION_USER;
    }

    UserRS.Search({ cond:{company: $scope.COMPANY._id, isPubContact: true}}).then(function(users){
        console.log(users)
        $scope.users = users;
        if ($scope.users.length > 0)
            $scope.formMessage.to = $scope.users[0];
    }, Errhandler);

    $scope.Send = function(msg) {
        MessageRS.Save(msg).then(function(){
            Dialogs.Confirm('信件发送成功','提示');
        }, Errhandler);

    }
})

