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
    return res.status(400).json({ message: 'Enter a valid email address and a password of at least 8 characters and no more than 72 bytes.' })
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
    return res.status(400).json({ message: 'Enter your email address and password.' })
  }
  const user = await User.findOne({ where: { email: email.trim().toLowerCase() } })
  if (!user || !await bcrypt.compare(password, user.password_hash)) {
    return res.status(401).json({ message: 'Incorrect email address or password.' })
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
    return res.status(401).json({ message: 'Please sign in to continue.' })
  }
  const user = await User.findByPk(claims.id, { attributes: ['id_user', 'email'] })
  if (!user) return res.status(401).json({ message: 'Please sign in to continue.' })
  req.user = user
  next()
}

exports.auth = (req, res) => res.json(req.user)

const profileFields = ['first_name', 'last_name', 'nickname', 'avatar']

exports.getProfile = async (req, res) => {
  const profile = await User.findByPk(req.user.id_user, {
    attributes: ['email', ...profileFields],
  })
  if (!profile) return res.status(401).json({ message: 'Please sign in to continue.' })
  res.json(profile)
}

exports.updateProfile = async (req, res) => {
  const { first_name, last_name, nickname, avatar } = req.body || {}
  const names = [first_name, last_name, nickname]
  if (names.some(name => typeof name !== 'string' || name.trim().length > 80)) {
    return res.status(400).json({ message: 'Each name must be 80 characters or fewer.' })
  }
  if (avatar !== undefined && avatar !== null) {
    const image = typeof avatar === 'string' &&
      /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(avatar)
    if (!image || Buffer.from(image[1], 'base64').length > 512 * 1024) {
      return res.status(400).json({ message: 'Choose a JPG, PNG, or WebP image up to 512 KB.' })
    }
  }

  const profile = await User.findByPk(req.user.id_user, {
    attributes: ['id_user', 'email', ...profileFields],
  })
  if (!profile) return res.status(401).json({ message: 'Please sign in to continue.' })
  await profile.update({
    first_name: first_name.trim() || null,
    last_name: last_name.trim() || null,
    nickname: nickname.trim() || null,
    ...(avatar === undefined ? {} : { avatar }),
  }, { fields: profileFields })
  res.json(profile)
}

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body || {}
  if (typeof currentPassword !== 'string' || !currentPassword || bcrypt.truncates(currentPassword) ||
      typeof newPassword !== 'string' || newPassword.length < 8 || bcrypt.truncates(newPassword)) {
    return res.status(400).json({ message: 'Enter your current password and a new password of at least 8 characters and no more than 72 bytes.' })
  }
  if (newPassword === currentPassword) {
    return res.status(400).json({ message: 'Choose a new password that differs from your current password.' })
  }

  const user = await User.findByPk(req.user.id_user)
  if (!user || !await bcrypt.compare(currentPassword, user.password_hash)) {
    return res.status(403).json({ message: 'Your current password is incorrect.' })
  }

  const [updated] = await User.update(
    { password_hash: await bcrypt.hash(newPassword, 10) },
    { where: { id_user: user.id_user, password_hash: user.password_hash } },
  )
  if (!updated) {
    return res.status(409).json({ message: 'Your password has already changed. Try again with your current password.' })
  }
  res.status(204).end()
}

exports.deleteAccount = async (req, res) => {
  const { currentPassword } = req.body || {}
  if (typeof currentPassword !== 'string' || !currentPassword || bcrypt.truncates(currentPassword)) {
    return res.status(400).json({ message: 'Enter your current password.' })
  }

  const user = await User.findByPk(req.user.id_user)
  if (!user || !await bcrypt.compare(currentPassword, user.password_hash)) {
    return res.status(403).json({ message: 'Your current password is incorrect.' })
  }

  const deleted = await User.destroy({
    where: { id_user: user.id_user, password_hash: user.password_hash },
  })
  if (!deleted) {
    return res.status(409).json({ message: 'Your account has changed. Try again with your current password.' })
  }
  res.clearCookie('jwt', cookieOptions)
  res.status(204).end()
}

exports.logout = (req, res) => {
  res.clearCookie('jwt', cookieOptions)
  res.status(204).end()
}
