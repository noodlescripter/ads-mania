const express = require('express');
const router = express.Router();
const {error, log, info} = require('console');
const UserSchema = require('../models/userModels');
const passport = require('passport');
const {storeValue} = require('../utils/middlewear/middleware');

router.get('/signup', function(req, res){
    res.render('pages/signUp.ejs');
});

router.get('/login', function(req, res){
    res.render('pages/login.ejs');
});

router.post('/signup', async function(req, res){
    try{
        const {username, email, password, phone} = await req.body;
        const newUser = new UserSchema({
            email, username, phone
        });
        info(newUser);
        const registerUser = await UserSchema.register(newUser, password);
        info(registerUser);
        req.flash('success', 'Welcome to Ads Mania, Please sign in with your credentials');
        res.redirect('/login');
    } catch(err){
        req.flash('error', err.message);
        res.redirect('/signup');
    }
});

router.post('/login', 
storeValue,
passport.authenticate('local', {
    failureFlash: true, failureRedirect: '/login'
}),
async function(req, res){
    req.flash('success', 'Hey Welcome back!');
    res.redirect('/ads');
});

router.get('/logout', function(req, res, next){
    req.logout(function(err){
        if(err){
            return next(err);
        }
    });
    res.redirect('/ads');
})

/* router access */
module.exports = router;