import { Router } from 'express';
import passport from 'passport';
import VkPassport from 'passport-vkontakte';
import db from './db/index';

const VKontakteStrategy = VkPassport.Strategy;
const { VKONTAKTE_APP_ID, VKONTAKTE_APP_SECRET } = process.env




passport.use(new VKontakteStrategy({
    clientID:     VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: VKONTAKTE_APP_SECRET,
    callbackURL:  "//active-ms.herokuapp.com/auth/callback",
    profileFields: ['bdate', 'photo_max', 'photo_100', 'sex']
  },
  (accessToken, refreshToken, params, profile, done) => {
    // console.log(profile);
    console.log(accessToken);
    db.query(`SELECT * FROM users WHERE vk_id=$1`, [profile.id], (err, res) => {
        if (res.rows.length == 0) {
            db.query(`INSERT INTO 
                    users(surname, name, patronymic, bday, phonenumber, vk_id, email, photo_100_url, photo_max_url, access_token) 
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `, [
                    profile.familyName,
                    profile.givenName,
                    NULL,
                    profile.birthday,
                    NULL,
                    profile.id,
                    profile.email,
                    profile.photos[1].value,
                    profile.photos[2].value,
                    accessToken
                ],
            (err, res) => {
                err ? console.log(err) : console.log(`User inserted into the table.`)
            })
        } else {
            console.log(res.rows[0]);
        }
    });

    done(null, profile);
    // User.findOrCreate({ vkontakteId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
  done(null, id)
});

const router = Router();

router.get('/',
  passport.authenticate('vkontakte', { scope: ['offline', 'notify', 'email'] }),
  (req, res) => {
    // The request will be redirected to vk.com for authentication, so
    // this function will not be called.
});

router.get('/callback',
  passport.authenticate('vkontakte', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: true // SET TRUE AFTER CONNECT USER TABLE AND CONFIGURE SERIALIZE/DESERIALIZE FUNCTIONS
 }));

 export default router;
