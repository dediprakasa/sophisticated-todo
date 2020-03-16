const mongoose = require('mongoose')
const { Schema, model } = mongoose

const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Project name must be filled out']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID must be filled out']
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  pendingMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  todos: [{
    type: Schema.Types.ObjectId,
    ref: 'Todo'
  }]
})

const Project = model('Project', projectSchema)

module.exports = Project