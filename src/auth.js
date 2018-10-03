import { Router } from 'express'
import passport from 'passport'
import VkPassport from 'passport-vkontakte'
import db from './db/index'



const VKontakteStrategy = VkPassport.Strategy
const { VKONTAKTE_APP_ID, VKONTAKTE_APP_SECRET } = process.env

passport.use(new VKontakteStrategy({
    clientID:     VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: VKONTAKTE_APP_SECRET,
    callbackURL:  "//active-ms.herokuapp.com/auth/callback",
    profileFields: ['bdate', 'photo_max', 'photo_100', 'sex']
    },
    async (accessToken, refreshToken, params, profile, done) => {
        let result = await db.find('users', 'vk_id', profile.id)
        if (result.rowCount == 0) {
            try {
                await db.query(`INSERT INTO 
                        users(surname, name, patronymic, bday, phonenumber, vk_id, email, photo_100_url, photo_max_url, access_token) 
                    VALUES
                        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    `, [
                        profile._json.last_name,
                        profile._json.first_name,
                        null,
                        profile.birthday,
                        '9046875727',
                        profile.id,
                        profile.email,
                        profile._json.photo_100,
                        profile._json.photo_max,
                        accessToken
                ])
                console.log(`User ${profile._json.first_name} ${profile._json.last_name} has been registred.`)
            } catch (error) {
                console.log('[ERROR]: ' + error)
            }
            try {
                result = await db.find('users', 'vk_id', profile.id)
                done(null, result.rows[0])        
            } catch (error) {
                console.log('[ERROR]: ' + error)
                done(error, false)
            }
        } else {
            done(null, result.rows[0])
        }
    }
))

passport.serializeUser((user, done) => {
    console.log(user)  
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.find('users', 'id', id)
        done(null, result.rows[0])        
    } catch (error) {
        console.log('[ERROR]: ' + error)
        done(error, false)
    }
})



const router = Router()

router.get('/auth',
  passport.authenticate('vkontakte', { scope: ['offline', 'email'] }),
  (req, res) => {
    // The request will be redirected to vk.com for authentication, so
    // this function will not be called.
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

router.get('/auth/callback',
  passport.authenticate('vkontakte', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: true
 }))

 export default router
