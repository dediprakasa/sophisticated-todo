const express = require("express")
const router = express.Router()
const { TodoController } = require("../controllers")
const { authentication, authorization } = require("../middlewares/auth")

router.use(authentication)
router.get("/", TodoController.showTodos)
router.post("/", TodoController.addTodo)

router.get("/:todoId", authorization, TodoController.showTodo)
router.patch("/:todoId", authorization, TodoController.editTodo)
router.delete("/:todoId", authorization, TodoController.deleteTodo)

module.exports = router