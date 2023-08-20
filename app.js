const EXPRESS = require('express');
const SESSION = require('express-session');
const app = EXPRESS();
const flash = require('connect-flash');
const { log, info, error } = require('console');
const path = require('path');
const MATE = require('ejs-mate');
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportLocal = require('passport-local');
const UserSchema = require('./models/userModels');
const method_override = require('method-override');


/* All router should imported here */
const homeRouter = require('./routes/home');
const userRouter = require('./routes/user');

/* Session config */
const sessionConfig = {
    secret: 'needstobesomesecret', 
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    }
}



/* Access to views dir */
app.set('views', path.join(__dirname, 'views'));

/* Initialize views */
app.set('view engine', 'ejs');

/* Access to public dir */
app.use(EXPRESS.static('public'));

/* Initialized ejs-mate */
app.engine('ejs', MATE);

/* Body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Initialize session */
app.use(SESSION(sessionConfig));

/* Flash initialized */
app.use(flash());

/* Method OR */
app.use(method_override('_method'));

/* Passport initialized */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(UserSchema.authenticate()));
passport.serializeUser(UserSchema.serializeUser());
passport.deserializeUser(UserSchema.deserializeUser());

/* Storing required value in session */
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

/* Router should be used below this line */
app.use('/ads', homeRouter);
app.use('/', userRouter);

/* mongo connection */
/* Connection to mongo */
try {
    mongo.connect('mongodb://admin:pass123@localhost:27017/adsmania', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: 'admin'
    });
    info('Connected to DB!! Let us get to work!! bitches')
} catch (err) {
    error('Fuck!!! Somthing went wrong!!!!! ::: error :::>>>', err);
}


/* Error */
app.use((err, req, res, next) => {
    let { statusCode = 500 } = err;
    if (!err.msg) {
        err.msg = 'You Probably fucked this up!!!!!!!';
    }
    res.status(statusCode).render('err/error.ejs', { err });
});

app.get("*", function(req, res){
    res.send("Page not found")
});

/* 
    server will run on 4000
*/
app.listen(4000, function (req, res) {
    info('Server is running at http://localhost:4000/');
});