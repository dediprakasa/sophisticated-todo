const { Todo } = require("../models")

class TodoController {
    static addTodo(req, res, next) {
      const { name, description, status, due_date } = req.body
      const user_id  = req.decoded.id
      Todo.create({ name, description, status, due_date, user_id })
        .then(todo => {
          res.status(200).json(todo)
        })
        .catch(next)
    }
    
    static showTodos(req, res, next) {
      Todo.find({ user_id: req.decoded.id })
        .then(todos => {
          res.status(200).json(todos);
        })
        .catch(next)
    }

    static showTodo(req, res, next) {
      Todo.findById(req.params.todoId)
        .then(todo => {
          res.status(200).json(todo);
        })
        .catch(next);
    }

    static editTodo(req, res, next) {
      const { name, description, status, due_date } = req.body
      const update = {}
      name && (update.name = name)
      description && (update.description = description)
      status && (update.status = status)
      due_date && (update.due_date = due_date)
      Todo.findByIdAndUpdate(req.params.todoId,
        update,
        { new: true, omitUndefined: true })
        .then(todo => {
          console.log(todo)
          res.status(200).json(todo)
        })
        .catch(next)
    }

    static deleteTodo(req, res, next) {
      Todo.findByIdAndDelete(req.params.todoId)
      .then(todo => {
        if (todo) {
          res.status(200).json({
            message: 'Successfully deleted'
          })
        } else {
          next({ statusCode: 404, message: 'Todo not found' })
        }
      })
      .catch(next)
    }

}

module.exports = TodoController;