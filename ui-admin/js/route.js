
var globalResolve = {
    LoadAll: function($q
            ) {
        var promises = [];
        return $q.all(promises);        
    }
}

app.config(function($stateProvider){

    var sc = new StateCreater('/ui-admin/pc/m/', $stateProvider);

    sc.createStates('portal', 'portal');
    sc.createStates('portal', 'portal.forgetpwd');
    sc.createStates('portal', 'portal.signin');

    sc.createStates('home', 'home');
    sc.createStates('dashboard', 'dashboard', null, null, globalResolve);
    sc.createStates('company', 'company');
    sc.createStates('company', 'company.one.edPass');
    sc.createStates('admin', 'admin');
    sc.createStates('admin', 'admin.one.edPass');
    sc.createStates('user', 'user');
})
