app.controller('DashboardController', function(
                $scope
                , $rootScope
                , $state
                , $location
                )  {
    $scope.companySiteUrl = $location.$$protocol 
            + '://'
            + $location.$$host
            + '/pc/consumer/company/'
            + USER.company
            + '#/product/list'
            ;


    $scope.GotoMall = function() {
        window.open($scope.companySiteUrl);
    }
})
