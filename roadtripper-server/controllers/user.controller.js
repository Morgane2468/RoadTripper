const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../database')

const secret = process.env.JWT_SECRET
if (!secret || Buffer.byteLength(secret) < 32) {
  throw new Error('Configure JWT_SECRET dans .env avec au moins 32 octets.')
}

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/api',
}

exports.create = async (req, res) => {
  const { email, password } = req.body || {}
  if (typeof email !== 'string' || !email.trim() || email.trim().length > 255 ||
      typeof password !== 'string' || password.length < 8 || bcrypt.truncates(password)) {
    return res.status(400).json({ message: 'Indique un e-mail valide et un mot de passe de 8 caractères minimum et 72 octets maximum.' })
  }
  const user = await User.create({
    email: email.trim().toLowerCase(),
    password_hash: await bcrypt.hash(password, 10),
  })
  res.status(201).json({ id_user: user.id_user, email: user.email })
}

exports.login = async (req, res) => {
  const { email, password } = req.body || {}
  if (typeof email !== 'string' || typeof password !== 'string' || bcrypt.truncates(password)) {
    return res.status(400).json({ message: 'Indique ton e-mail et ton mot de passe.' })
  }
  const user = await User.findOne({ where: { email: email.trim().toLowerCase() } })
  if (!user || !await bcrypt.compare(password, user.password_hash)) {
    return res.status(401).json({ message: 'E-mail ou mot de passe incorrect.' })
  }
  const token = jwt.sign({ id: user.id_user }, secret, { algorithm: 'HS256', expiresIn: '1h' })
  res.cookie('jwt', token, { ...cookieOptions, maxAge: 60 * 60 * 1000 })
  res.json({ id_user: user.id_user, email: user.email })
}

exports.requireUser = async (req, res, next) => {
  let claims
  try {
    claims = jwt.verify(req.cookies.jwt, secret, { algorithms: ['HS256'] })
  } catch {
    return res.status(401).json({ message: 'Connexion requise.' })
  }
  const user = await User.findByPk(claims.id, { attributes: ['id_user', 'email'] })
  if (!user) return res.status(401).json({ message: 'Connexion requise.' })
  req.user = user
  next()
}

exports.auth = (req, res) => res.json(req.user)

exports.logout = (req, res) => {
  res.clearCookie('jwt', cookieOptions)
  res.status(204).end()
}
