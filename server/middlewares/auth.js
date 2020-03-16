const { verifyToken } = require('../helpers/jwt')
const { User, Todo, Project } = require('../models')
const createError = require('http-errors')

module.exports = {
  authentication(req, res, next) {
    if (!req.headers.access_token) {
      return next(createError(400, 'Invalid access token'))
    }
    try {
      const access_token = req.headers.access_token.split(' ')[1]
      const payload = verifyToken(access_token)
      User.findById(payload.id)
        .then(user => {
          if (user) {
            req.decoded = payload
            next()
          } else {
            return next(createError(400, 'Invalid access token'))
          }
        })
        .catch(next)
    } catch (err) {
      next(err)
    }
  },
  
  authorization(req, res, next) {
    let Model;
    let queryId;
    let entity;
    let credential;
    if (req.params.todoId) {
      Model = Todo
      queryId = req.params.todoId
      entity = 'Todo'
      credential = 'user_id'
    } else if (req.params.projectId) {
      Model = Project
      queryId = req.params.projectId
      entity = 'Project'
      credential = 'owner'
    }
    Model.findById(queryId)
      .then(result => {
        if (result) {
          if (result[credential] == req.decoded.id) {
            next()
          } else {
            next(createError(400, 'Forbidden access'))
          }
        } else {
          next(createError(404, `${entity} not found`))
        }
      })
      .catch(next)
  },

  authProjectMember(req, res, next) {
    Project.findById(req.params.projectId)
      .then(project => {
        if (project) {
          if (project.members.includes(req.decoded.id) || project.owner == req.decoded.id) {
            next()
          } else {
            next(createError(400, 'Forbidden access'))
          }
        } else {
          next(createError(404, 'Project not found'))
        }
      })
      .catch(next)
  }
}