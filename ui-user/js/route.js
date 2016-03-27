
var isGlobaResolved = false;
var globalResolve = {
    LoadAll: function($q
            , ProductRS
            , CategoryRS
            , SupplierRS
            ) {
        if (isGlobaResolved)
            return;
        isGlobaResolved = true;
        var promises = [];
        console.log('globalResolve.LoadAll()');
        promises.push(ProductRS.Load());
        promises.push(CategoryRS.Load());
        promises.push(SupplierRS.Load());

        return $q.all(promises);        
    }

}

app.config(function($stateProvider){
    var sc = new StateCreater('/ui-user/pc/m/', $stateProvider);

    sc.createStates('home', 'home');
    sc.createStates('dashboard', 'dashboard');
    sc.createStates('product', 'product', null, null, globalResolve);
    sc.createStates('product', 'product.category');
    sc.createStates('product', 'product.one.editwb');
    sc.createStates('product', 'product.one.price');
    sc.createStates('product', 'product.one.picture');
    sc.createStates('product', 'product.one.document');
    sc.createStates('product', 'product.one.supplier');
    sc.createStates('supplier', 'supplier', null, null, globalResolve);
    sc.createStates('supplier', 'supplier.one.supProduct');
    sc.createStates('user', 'user');
    sc.createStates('client', 'client');
    sc.createStates('client', 'client.one.oppt');
    sc.createStates('client', 'client.one.contact');
    sc.createStates('contact', 'contact');
    sc.createStates('oppt', 'oppt');
    sc.createStates('oppt', 'oppt.one.document');
    sc.createStates('shipping', 'shipping');
    sc.createStates('shipping', 'shipping.zone');
    sc.createStates('shipping', 'shipping.destZone');
    sc.createStates('shipping', 'shipping.price');
    sc.createStates('mbox', 'mbox');
    sc.createStates('mbox', 'mbox.one.message');
    sc.createStates('payment', 'payment');
    sc.createStates('payment', 'payment.paypal');
    sc.createStates('payment', 'payment.bankacc');
});