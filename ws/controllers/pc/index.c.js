'use strict'


exports.GetRender = function(req, res) {
    if (req.session.user)
        res.render('ui-user/pc/m/home/index.pg.html', {
            SESSION_USER: req.session.user,
        });
    else
        res.render('ui-user/pc/m/portal/index.pg.html', {});
}

