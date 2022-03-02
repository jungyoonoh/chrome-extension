exports.isLogin = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    }
    else {
        res.status(504).send("Not Logined");
    }
}

