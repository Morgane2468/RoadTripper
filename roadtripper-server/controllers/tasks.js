const { Task } = require('../database')

const statuses = ['To Do', 'Doing', 'Done']

exports.findAll = async (req, res) => {
  res.json(await Task.findAll({ where: { id_trip: req.trip.id_trip } }))
}

exports.findOne = async (req, res, next) => {
  req.task = await Task.findOne({
    where: { id_todo: req.params.taskId, id_trip: req.trip.id_trip },
  })
  if (!req.task) return res.status(404).json({ message: 'Task not found.' })
  next()
}

exports.create = async (req, res) => {
  const { title, id_category = null } = req.body || {}
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'A task title is required.' })
  }
  const task = await Task.create({ title: title.trim(), id_category, id_trip: req.trip.id_trip })
  res.status(201).json(task)
}

exports.update = async (req, res) => {
  const data = req.body || {}
  if (Object.hasOwn(data, 'status') && !statuses.includes(data.status)) {
    return res.status(400).json({ message: 'Invalid task status.' })
  }
  if (Object.hasOwn(data, 'title')) {
    if (typeof data.title !== 'string' || !data.title.trim()) {
      return res.status(400).json({ message: 'A task title is required.' })
    }
    data.title = data.title.trim()
  }
  await req.task.update(data, { fields: ['title', 'status', 'id_category'] })
  res.json(req.task)
}

exports.delete = async (req, res) => {
  await req.task.destroy()
  res.status(204).end()
}
