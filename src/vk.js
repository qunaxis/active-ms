import { Router } from 'express';
import VK from 'vk-node-sdk';

const router = Router();
const { VKONTAKTE_GROUP_TOKEN } = process.env
const Group = new VK.Group(VKONTAKTE_GROUP_TOKEN)
const User = new VK.User(req.user.access_token)


router.get('/msg', async (req, res) => {
    Group.sendMessage({user_id: req.param('id'), message: req.param('text')}, (messageId, error) => {
        if (messageId) {
           console.log('Сообщение отправлено!\n message_id: ', messageId)
        } else {
           console.log('Не удалось отправить сообщение', error)
        }
    })
    res.redirect('/');
})

router.get('/msgUser', async (req, res) => {
    User.sendMessage({user_id: req.param('id'), message: req.param('text')}, (messageId, error) => {
        if (messageId) {
           console.log('Сообщение отправлено!\n message_id: ', messageId)
        } else {
           console.log('Не удалось отправить сообщение', error)
        }
    })
    res.redirect('/');
})

export default router;