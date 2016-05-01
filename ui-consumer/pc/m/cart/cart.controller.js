app.controller('CartController', function(
                $scope
                , $rootScope
                , $state
                , $modal
                , $q
                , CartServ
                , Dialogs
                , Cache
                )  {   

    $scope.isShowPayment = false;

    $scope.CheckOut = function() {
        $scope.isShowPayment = true;
    }

    $scope.SelectAddress = function(addr) {
        $scope.addr = addr;
    }    

    $scope.SubmitOrder = function() {
        Dialogs.Confirm('尚未开通，需要申请VISA、MasterCard接口。', '系统提示');
    }
});

app.controller('CartItemController', function(
                $scope
                , $state
                , $modal
                , $q
                , CartServ
                , Cache
                )  {   


});