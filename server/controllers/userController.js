const { User, Project } = require('../models')
const { generateToken } = require('../helpers/jwt')
const { verifyPassword } = require('../helpers/bcrypt')
const createError = require('http-errors')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID)

class UserController {
  static register(req, res, next) {
    const { username, email, password } = req.body
    User.create({
      username,
      email,
      password
    })
      .then(user => {
        res.status(201).json({
          message: 'Successfully registered',
          username: user.username,
          email: user.email
        })
      })
      .catch(next)
  }
  
  static login(req, res, next) {
    const payload = {}
    let access_token
    const { email, password } = req.body
    if (!email && !password) return next(createError(400, 'Email and password must be filled out!'))
    if (!email) return next(createError(400, 'Email must be filled out!'))
    if (!password) return next(createError(400, 'Password must be filled out!'))
    User.findOne({ email })
    .then(user => {
      if (user && verifyPassword(password, user.password)) {
        payload.id = user._id
        payload.email = user.email
        payload.username = user.username
        access_token = generateToken(payload)
        res.status(200).json({ access_token: `token ${access_token}`, email: user.email, userId: user._id })
      } else {
        next({ statusCode: 400, message: 'Invalid email/password'})
      }
    })
    .catch(next)
  }

  static profile(req, res, next) {
    res.status(200).json(req.decoded)
  }

  static showInvitations(req, res, next) {
    Project.find({ pendingMembers: req.decoded.id })
      .then(projects => {
        res.status(200).json(projects)
      })
      .catch(next)
  }

  static gSign(req, res, next) {
    let gpayload = {};
    let payload = {};
    let access_token = '';
    client.verifyIdToken({
        idToken: req.body.id_token,
        audience: process.env.CLIENT_ID
      })
      .then(ticket => {
        payload = ticket.getPayload();
        return User.findOne({ email: payload.email })
      })
      .then(user => {
        if (user) {
          gpayload.id = user._id;
          gpayload.username = user.username;
          gpayload.email = user.email
          return user;
        } else {
          return User.create({
            email: payload.email,
            username: payload.name.split(' ').join('') + Date.now(),
            password: payload.jti,
            gSignIn: true
          })
        }
      })
      .then(user => {
        access_token = generateToken(gpayload)
        res.status(200).json({ access_token: `token ${access_token}`, email: user.email, userId: user._id })
      })
      .catch(next)
    }
}

module.exports = UserController