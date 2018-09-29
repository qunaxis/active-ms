import { Router } from 'express'
import VK from 'vk-node-sdk'

const router = Router()
const { VKONTAKTE_GROUP_TOKEN } = process.env
const Group = new VK.Group(VKONTAKTE_GROUP_TOKEN)



router.get('/msg', async (req, res) => {
    Group.sendMessage({user_id: req.param('id'), message: req.param('text')}, (messageId, error) => {
        if (messageId) {
           req.app.log.info(`Сообщение ${messageId} отправлено!`)
        } else {
           req.app.log.info(`Не удалось отправить сообщение: ${error}`)
        }
    })
    res.redirect('/')
})



export default router