InitModelFactory(app);

DefineCommonRS(app, '', 'signin');
DefineCommonRS(app, '', 'signup'); 
DefineCommonRS(app, '', 'resetPwdRequest');
DefineCommonRS(app, '', 'resetPwd');


DefineCommonRS(app, '/u', 'supplier',   'suppliers');
DefineCommonRS(app, '/u', 'supProduct',   'supProducts', ['product']);
DefineCommonRS(app, '/u', 'user',       'users');
DefineCommonRS(app, '/u', 'product',    'products');
DefineCommonRS(app, '/u', 'psp',        'psps');
DefineCommonRS(app, '/u', 'category',   'categorys');
DefineCommonRS(app, '/u', 'zone',       'zones');
DefineCommonRS(app, '/u', 'shipping',   'shippings');
DefineCommonRS(app, '/u', 'zone',       'zones');
DefineCommonRS(app, '/u', 'destZone',   'destZones');
DefineCommonRS(app, '/u', 'logiPrice',  'logiPrices');
DefineCommonRS(app, '/u', 'client',     'clients');
DefineCommonRS(app, '/u', 'contact',    'contacts');
DefineCommonRS(app, '/u', 'oppt',       'oppts');
//DefineCommonRS(app, '/u', 'cart',       'carts');
DefineCommonRS(app, '/u', 'message',    'messages');
DefineCommonRS(app, '/u', 'paypal',     'paypals');
DefineCommonRS(app, '/u', 'bankacc',     'bankaccs');




