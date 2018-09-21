import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes';
import passport from 'passport';
import VkPassport from 'passport-vkontakte';



const { VKONTAKTE_APP_ID, VKONTAKTE_APP_SECRET } = process.env

const app = express();
app.disable('x-powered-by');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

const VKontakteStrategy = VkPassport.Strategy;
passport.use(new VKontakteStrategy({
    clientID:     VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: VKONTAKTE_APP_SECRET,
    callbackURL:  "http://localhost/auth/vkontakte/callback"
  },
  (accessToken, refreshToken, params, profile, done) => {
    console.log(params.email);
    console.log(profile);
    console.log(accessToken);
    // User.findOrCreate({ vkontakteId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));



// Routes
app.use('/', routes);
app.get('/auth/',
  passport.authenticate('vkontakte'),
  (req, res) => {
    // The request will be redirected to vk.com for authentication, so
    // this function will not be called.
});

app.get('/auth/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/login' }),
  (req, res) => {
    console.log(res);
    // Successful authentication, redirect home.
    res.redirect('/');
});


// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    });
});

export default app;
