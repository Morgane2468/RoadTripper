const router = require('express').Router()
const user = require('../controllers/user.controller')

router.post('/', user.create)
router.post('/login', user.login)
router.get('/auth', user.requireUser, user.auth)
router.post('/logout', user.logout)

module.exports = router
