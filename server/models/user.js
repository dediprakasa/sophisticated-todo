const mongoose = require('mongoose')
const { Schema, model, models } = mongoose
const { hashPassword } = require('../helpers/bcrypt')

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username must be filled out'],
    validate: {
      validator(v) {
        return models.User.findOne({ username: v })
          .then(user => {
            return !user
          })
      },
      message: 'Username has been taken'
    }
  },
  email: {
    type: String, 
    required: [true, 'Email must be filled out'],
    validate: [
      {
        validator(v) {
          let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return re.test(v)
        },
        message: 'Invalid email format'
      },
      {
        validator(v) {
          return models.User.findOne({ email: v })
            .then(user => {
              return !user
            })
        },
        message: 'Email has been registered'
      }
    ]
  },
  password: {
    type: String,
    minlength: [6, 'Minimum password length is 6']
  }
})

userSchema.pre('save', function(next) {
  this.password = hashPassword(this.password)
  next()
})

const User = model('User', userSchema)

module.exports = User