const { Trip, Task, sequelize } = require('../database')

const tripFields = [
  'name', 'trip_type', 'destination', 'start_date', 'end_date', 'travelers',
  'transport', 'visibility', 'description','budget', 'currency', 'transport', 'visibility', 'description',
]

exports.findAll = async (req, res) => {
  const trips = await Trip.findAll({ where: { id_user: req.user.id_user } })
  res.json(trips)
}

exports.findOwnedTrip = async (req, res, next) => {
  req.trip = await Trip.findOne({
    where: { id_trip: req.params.id, id_user: req.user.id_user },
  })
  if (!req.trip) return res.status(404).json({ message: 'Voyage introuvable.' })
  next()
}

exports.findOne = (req, res) => res.json(req.trip)

exports.create = async (req, res) => {
  const { name, tasks = [] } = req.body || {}
  if (typeof name !== 'string' || !name.trim() || !Array.isArray(tasks) ||
      tasks.some(task => typeof task?.title !== 'string' || !task.title.trim())) {
    return res.status(400).json({ message: 'Vérifie le nom du voyage et les titres des tâches.' })
  }

  const trip = await sequelize.transaction(async transaction => {
    const created = await Trip.create(
      { ...req.body, name: name.trim(), id_user: req.user.id_user },
      { fields: [...tripFields, 'id_user'], transaction },
    )
    for (const task of tasks) {
      await Task.create({
        id_trip: created.id_trip,
        title: task.title.trim(),
        id_category: task.id_category ?? null,
      }, { transaction })
    }
    return created
  })
  res.status(201).json(trip)
}

exports.update = async (req, res) => {
  const data = req.body || {}
  if (Object.hasOwn(data, 'name')) {
    if (typeof data.name !== 'string' || !data.name.trim()) {
      return res.status(400).json({ message: 'Le nom du voyage est obligatoire.' })
    }
    data.name = data.name.trim()
  }
  await req.trip.update(data, { fields: tripFields })
  res.json(req.trip)
}

exports.delete = async (req, res) => {
  await req.trip.destroy()
  res.status(204).end()
}
