var app = angular.module('rhinoceros', 
    [ 
        'ngResource', 'ui.router', 'ui.bootstrap',
        'ui.select', 'ngSanitize', 'ngCookies',
        'textAngular', 'smart-table',
        'ztree', 'zform']);

app.run(function($rootScope, Dict){
    Dict.CreateDict('UserRole', [
        {k: 'admin', v: '系统管理员'},
        {k: 'product-admin', v: '(产品/供应商)管理员'},
        {k: 'boss', v: '老板'},
        {k: 'boss-assistant', v: '老板助理'},
        {k: 'sales', v: '销售代表'},
        {k: 'sales-assistant', v: '销售助理'},
        {k: 'sales-manager', v: '销售经理'},
    ]);
    Dict.CreateDict('ProductStatus', [
        {k: 'raw', v: '未审核'},
        {k: 'accepted', v: '已通过'},
        {k: 'rejected', v: '已拒绝'},
    ]);
    Dict.CreateDict('BusinessType', [
        {k: 'factory', v: '制造商'},
        {k: 'trader', v: '贸易公司'},
    ]);
});