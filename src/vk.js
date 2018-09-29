import { Router } from 'express'
import VK from 'vk-node-sdk'

const router = Router()
const { VKONTAKTE_GROUP_TOKEN } = process.env
const Group = new VK.Group(VKONTAKTE_GROUP_TOKEN)



router.get('/msg', async (req, res) => {
    try {
        const res = await Group.sendMessage({user_id: req.body('id'), message: req.body('text')})
        await req.app.log.info(`Сообщение ${res.messageId} отправлено!`)
    } catch (error) {
        req.app.log.error(`Не удалось отправить сообщение: ${error}`)
    }
    res.redirect('/')
})



export default router