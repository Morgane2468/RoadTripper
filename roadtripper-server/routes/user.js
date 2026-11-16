const router = require('express').Router()
const user = require('../controllers/user.controller')

router.post('/', user.create)
router.post('/login', user.login)
router.get('/auth', user.requireUser, user.auth)
router.get('/profile', user.requireUser, user.getProfile)
router.put('/profile', user.requireUser, user.updateProfile)
router.put('/password', user.requireUser, user.changePassword)
router.delete('/account', user.requireUser, user.deleteAccount)
router.post('/logout', user.logout)

module.exports = router
