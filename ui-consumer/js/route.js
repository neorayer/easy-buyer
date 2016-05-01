

//TODO no safe for no ['$q', function($q) {} 
app.factory('InitLoader', function(
                $q
                , DestAreaRS
                , SupplierRS
                , ConsumerRS
                , ClientRS
                ){
    var promises = [];
    console.log('InitLoader()');

    return $q.all(promises);
})

app.config(function($stateProvider){
    $stateProvider.state('/', {
        url: '/home',
        controller: 'PortalController',
        resolve:  {
            ////在第一个Controler初始化 之前，要利用resolve先完成promise的载入
            initLoader:['InitLoader', function(InitLoader){
                return InitLoader;
            }],
        }
    });

    ////////////////////////////


    var sc = new StateCreater('/ui-consumer/pc/m/', $stateProvider);

    sc.createStates('cart', 'cart');
    sc.createStates('cart', 'cart.item');
    sc.createStates('cart', 'cart.checkout');
    sc.createStates('contact', 'contact');
    sc.createStates('product', 'product');
    sc.createStates('portal', 'portal');
    sc.createStates('portal', 'portal.register');
    sc.createStates('setting', 'setting');
    sc.createStates('setting', 'setting.password');
    sc.createStates('setting', 'setting.profile');
    sc.createStates('setting', 'setting.address');
})
