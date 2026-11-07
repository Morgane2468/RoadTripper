const router = require('express').Router()
const trips = require('../controllers/trips')
const tasks = require('../controllers/tasks')

router.get('/', trips.findAll)
router.post('/', trips.create)
router.use('/:id', trips.findOwnedTrip)
router.get('/:id', trips.findOne)
router.put('/:id', trips.update)
router.delete('/:id', trips.delete)
router.get('/:id/tasks', tasks.findAll)
router.post('/:id/tasks', tasks.create)
router.get('/:id/tasks/:taskId', tasks.findOne, (req, res) => res.json(req.task))
router.put('/:id/tasks/:taskId', tasks.findOne, tasks.update)
router.delete('/:id/tasks/:taskId', tasks.findOne, tasks.delete)

module.exports = router
