'use strict'


exports.GetRender = function(req, res) {
    if (req.session.admin)
        res.render('ui-admin/pc/m/home/index.pg.html', {
            SESSION_ADMIN: req.session.admin,
        });
    else
        res.render('ui-admin/pc/m/portal/index.pg.html', {});
}

