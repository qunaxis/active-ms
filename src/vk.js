import { Router } from 'express';
import VK from 'vk-node-sdk';

const router = Router();
const { VKONTAKTE_GROUP_TOKEN } = process.env
const Group = new VK.Group(VKONTAKTE_GROUP_TOKEN)



router.get('/msg', async (req, res) => {
    Group.sendMessage({user_id: req.user.vk_id, message: req.params.msg}, (messageId, error) => {
        if (messageId) {
           console.log('Сообщение отправлено!\n message_id: ', messageId)
        } else {
           console.log('Не удалось отправить сообщение', error)
        }
      })
})

export default router;