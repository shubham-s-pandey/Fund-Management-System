require('./models/db');


const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');


const FundController = require('./controllers/FundController');

const salaryController = require('./controllers/salaryController');

const propertyController = require('./controllers/propertyController');

const sharesController = require('./controllers/sharesController');

const goldController = require('./controllers/goldController');


const app = express();
require('./models/db');
require('./passport/local-auth');


app.set('port', process.env.PORT || 3000);

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname:'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine','hbs');


app.use(express.static('public'));
app.use(express.static('views'));

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  console.log(app.locals)
  next();
});



app.use('/Fund', FundController);
app.use('/', require('./controllers/index'));

app.use('/salary', salaryController);
app.use('/', require('./controllers/salaryindex'));

app.use('/property', propertyController);
app.use('/', require('./controllers/propertyindex'));

app.use('/shares', sharesController);
app.use('/', require('./controllers/sharesindex'));

app.use('/gold', goldController);
app.use('/', require('./controllers/goldindex'));

app.listen(3000, ()=>{
  console.log('Express server started at port: 3000');
});
