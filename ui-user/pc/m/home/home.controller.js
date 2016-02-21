app.controller('HomeController', function(
                $scope
                , $rootScope
                , $state
                , SigninRS
                )  {
    $scope.USER = USER;
    $scope.$state = $state;
    console.log($state)

    $scope.gotoHome = function() {
        document.location = 'index?' + Math.random() 
                + '#/dashboard/cover';
    };

    $scope.signout = function() {
        return SigninRS.DeleteById('any').then(function(){
            document.location = 'index?' + Math.random();
        });
    };

    $scope.menus = [
        {   
            text: '首页', 
            color:'lightred', 
            state: 'dashboard.cover',
            stateGroup: 'dashboard',
            bgClass: 'list-group-item-success',
            icon: 'fa fa-home',
        },
        {   text: '产品', 
            color:'lightorange', 
            state: 'product.list',
            stateGroup: 'product',
            bgClass: 'list-group-item-warning',
            icon: 'fa fa-cube',
        },
        {   
            text: '供应商', 
            color:'#BEFFF8', 
            state: 'supplier.list',
            stateGroup: 'supplier',
            bgClass: 'list-group-item-info',
            icon: 'fa fa-cubes',
        },
        {   
            text: '公司客户', 
            color:'#9EC4F6', 
            state: 'client.list',
            stateGroup: 'client',
            bgClass: 'list-group-item-danger',
            icon: 'fa fa-users',
        },
        {   
            text: '帐号管理', 
            color:'#D2C0F9', 
            stateGroup: 'user',
            state: 'user.list',
            icon: 'fa fa-user',
        },
        {
            text: '物流', 
            color:'orange', 
            state: 'shipping.price',
            stateGroup: 'shipping',
            icon: 'fa fa-plane',
        },
        {
            text: '消息', 
            color:'lightblue', 
            state: 'mbox.one.message.list({mbox:\'inbox\'})',
            stateGroup: 'mbox',
            icon: 'fa fa-envelope',
        },
        {
            text: '支付管理', 
            color:'lightred', 
            state: 'payment.paypal.list',
            stateGroup: 'payment',
            icon: 'fa fa-credit-card',
        }
    ]

    $scope.statusClassMap = {
        'raw'     : 'warning',
        'accepted': 'success',
        'rejected': 'danger', 
    }

    $scope.isSidebarVisible = true;
    $scope.toggleMenu = function() {
        $scope.isSidebarVisible = !$scope.isSidebarVisible;
    }


});
