import { Router } from 'express';
import VkPassport from 'passport-vkontakte';

const VKontakteStrategy = VkPassport.Strategy;
const { VKONTAKTE_APP_ID, VKONTAKTE_APP_SECRET } = process.env




passport.use(new VKontakteStrategy({
    clientID:     VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: VKONTAKTE_APP_SECRET,
    callbackURL:  "//active-ms.herokuapp.com/auth/callback"
  },
  (accessToken, refreshToken, params, profile, done) => {
    console.log(profile);
    console.log(accessToken);

    done(null, profile);
    // User.findOrCreate({ vkontakteId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((user, done) => {
//   // User.findById(id, function(err, user) {
//   //   done(err, user);
//   // });
//   done(null, user.id)
// });

const router = Router();

router.get('/',
  passport.authenticate('vkontakte'),
  (req, res) => {
    // The request will be redirected to vk.com for authentication, so
    // this function will not be called.
});

router.get('/callback',
  passport.authenticate('vkontakte', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: false // SET TRUE AFTER CONNECT USER TABLE AND CONFIGURE SERIALIZE/DESERIALIZE FUNCTIONS
 }));

 export default router;
