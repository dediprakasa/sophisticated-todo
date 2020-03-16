const express = require('express')
const router = express.Router()
const { ProjectController } = require('../controllers')
const { authentication, authorization, authProjectMember } = require('../middlewares/auth')

router.use(authentication)
router.post('/', ProjectController.createProject)
router.get('/', ProjectController.showProjects)
router.get('/:projectId/acceptInvitation', ProjectController.acceptInvitation)

router.get('/:projectId', authProjectMember, ProjectController.showProject)

router.patch('/:projectId', authorization, authProjectMember, ProjectController.updateProjectName)
router.patch('/:projectId/inviteMember', authorization, authProjectMember, ProjectController.inviteMember)
router.patch('/:projectId/rejectInvitation', authProjectMember, ProjectController.rejectInvitation)
router.patch('/:projectId/removeMember', authorization, ProjectController.removeMember)

router.patch('/:projectId/addTodo', authProjectMember, ProjectController.addTodo)
router.delete('/:projectId', authorization, ProjectController.deleteProject)

module.exports = router