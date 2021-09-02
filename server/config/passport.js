const path = require(`path`);
const passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth20' ).Strategy

require('dotenv').config({path: path.join(__dirname, "../credentials/.env")}); //dir수정

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: process.env.OAUTH2_GOOGLE_CLIENT_ID,
        clientSecret: process.env.OAUTH2_GOOGLE_CLIENT_SECRET_ID,
        callbackURL: '/auth/google/callback'
    }, function(accessToken, refreshToken, profile, done) {
        // DB 검증 과정 포함 -> Firebase에서 데이터 있는지 확인
        
    }
));

module.exports = passport;