const { Project, Todo, User } = require('../models')
const createError = require('http-errors')
const nodemailer = require('../helpers/nodemailer')

class ProjectController {
  static createProject(req, res, next) {
    const postObj = {}
    const { name } = req.body
    postObj.owner = req.decoded.id
    postObj.name = name
    Project.create(postObj)
      .then(project => {
        res.status(201).json(project)
      })
      .catch(next)
  }

  static addTodo(req, res, next) {
    const { name, description, status, due_date } = req.body
    const project_id = req.params.projectId
    const user_id  = req.decoded.id
    Todo.create({ name, description, status, due_date, user_id, project_id })
      .then(todo => {
        return Project.findByIdAndUpdate(project_id,
          { $push: { todos: todo } },
          { new: true })
        })
        .then(project => {
        res.status(201).json(project)
      })
      .catch(next)
  }

  static showProjects(req, res, next) {
    Project.find({ $or: [{ members: req.decoded.id }, { owner: req.decoded.id}]})
      .populate('todos')
      .populate('owner')
      .then(projects => {
        res.status(200).json(projects)
      })
      .catch(next)
  }

  static showProject(req, res, next) {
    Project.findById(req.params.projectId)
      .populate('members')
      .populate('pendingMembers')
      .populate({ path: 'todos', populate: { path: 'user_id' } })
      .then(project => {
        res.status(200).json(project)
      })
      .catch(next)
  }

  static updateProjectName(req, res, next) {
    const { name } = req.body
    Project.findByIdAndUpdate(req.params.projectId, { name }, { new: true })
      .then(project => {
        res.status(200).json(project)
      })
      .catch(next)
  }
  
  static deleteProject(req, res, next) {
    Project.findByIdAndDelete(req.params.projectId)
      .then(project => {
        res.status(200).json({
          message: 'Successfully deleted'
        })
      })
      .catch(next)
  }

// -------------------- End of Project basic CRUD -------------------- //

  static inviteMember(req, res, next) {
    let targetMember;
    const { email, inviter } = req.body
    User.findOne({ email })
      .then(user => {
        if (!user) {
          throw createError(404, 'User not found')
        } else {
          targetMember = user
          return Project.findById(req.params.projectId)
        }
      })
      .then(project => {
        const isMember = project.members.indexOf(targetMember._id) > -1
        const isInvited = project.pendingMembers.indexOf(targetMember._id) > -1
        if (!isMember && !isInvited)  {
          return Project.findByIdAndUpdate(req.params.projectId, {
            $push: { pendingMembers: targetMember._id }
          })
        } else if (isMember) {
          throw createError(400, 'User is already a member')
        } else if (isInvited) {
          throw createError(400, 'User has already been invited')
        }
      })
      .then(project => {
        return nodemailer(email, inviter, req.params.projectId)
      })
      .then(response => {
        res.status(200).json({
          message: `Invitation sent to: ${response.envelope.to[0]}`
        })
      })
      .catch(next)
  }

  static acceptInvitation(req, res, next) {
    Project.findById(req.params.projectId)
      .then(project => {
        if (!project) throw (createError(404, 'Project not found'))
        const isInvited = project.pendingMembers.indexOf(req.decoded.id) > -1
        if (!isInvited) {
          throw createError(400, 'You are not invited')
        } else {
          project.pendingMembers.pull(req.decoded.id)
          project.members.push(req.decoded.id)
          return project.save()
        }
      })
        .then(project => {
          res.status(200).json({
            message: 'Successfully joined'
          })
        })
        .catch(next)
  }

  static rejectInvitation(req, res, next) {
    Project.findByIdAndUpdate(req.params.projectId, {
      $pull: { pendingMembers: req.decoded.id }
    })
      .then(project => {
        res.status(200).json({
          message: 'You have rejected the invitation'
        })
      })
      .catch(next)
  }

  static removeMember(req, res, next) {
    let targetMember;
    const { email, kind } = req.body
    User.findOne({ email })
      .then(user => {
        if (!user) throw createError(404, 'User not found')
        targetMember = user
        return Project.findById(req.params.projectId)
      })
      .then(project => {
        if (kind === 'remove') {
          project.members.pull(targetMember._id)
        } else if (kind === 'cancel') {
          project.pendingMembers.pull(targetMember._id)
        } else {
          throw createError(400, 'Choose remove member or cancel invitation')
        }
        return project.save()
      })
      .then(project => {
        res.status(200).json({
          message: 'Successfully removed'
        })
      })
      .catch(next)
  }

}

module.exports = ProjectController