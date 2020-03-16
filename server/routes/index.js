const express = require("express")
const router = express.Router()
const userRouter = require("./userRouter")
const todoRouter = require("./todoRouter")
const projectRouter = require('./projectRouter')

router.use('/todos', todoRouter)
router.use('/user', userRouter)
router.use('/projects', projectRouter)

module.exports = router;