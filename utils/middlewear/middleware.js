module.exports.storeValue = function(req, res, next){
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = function(req, res, next){
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be logged in to do this action!');
    }
    next();
}

