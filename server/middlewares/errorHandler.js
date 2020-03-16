module.exports = (err, req, res, next) => {
  let statusCode, message
  const stringifiedError = JSON.stringify(err)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 400,
    message = 'Invalid access token'
  } else if (stringifiedError.includes('ValidatorError')) {
    const mongooseError = err.errors
    statusCode = 400
    message  = []
    for (let key in mongooseError) {
      message.push(mongooseError[key].message)
    }
  } else {
    statusCode = err.statusCode || 500
    message = err.message || 'Internal server error'
  }
  res.status(statusCode).json({ errors: { message } })
}