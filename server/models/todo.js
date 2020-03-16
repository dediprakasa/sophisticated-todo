const mongoose = require("mongoose")
const { Schema, model } = mongoose

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Todo name must be filled out']
  },
  description: {
    type: String,
    required: [true, 'Description must be filled out']
  },
  status: {
    type: String,
    enum: ["queued", "overdue" ,"done"],
    default: "queued"
  },
  due_date: {
    type: Date,
    required: [true, 'Due date must be filled out']
  },
  project_id: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true })

const Todo = model('Todo', todoSchema);

module.exports = Todo;