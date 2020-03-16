$(document).ready(function () {
  if (!localStorage.getItem('access_token')) {
    $('.all').hide()
    $('#the-navbar').hide()
    $('#login').show()
  } else {
    $('.all').hide()
    $('#big-buttons').show()
    fetchTodos()
    fetchProjects()
  }


  $('.to-register').on('click', function(e) {
    e.preventDefault()
    toRegister()
  })

  $('.to-login').on('click', function(e) {
    e.preventDefault()
    toLogin()
  })
  
});

// function verifyToken(access_token, cb) {
//   $.ajax({
//     method: 'get',
//     url: `${baseUrl}/user/profile`,
//     headers: { access_token }
//   })
//     .done(response => {
//       cb()
//     })
//     .fail(err => {
//       Swal.fire({
//         icon: 'err',
//         text: err
//       })
//     })
// }

function showButtons() {
  $('.all').hide()
  $('#the-navbar').show()
  $('#big-buttons').show()
}

function toMyTodos(e) {
  e.preventDefault()
  $('.all').hide()
  $('#my-todos').show()
  fetchTodos()
}

function toNewTask(e) {
  e.preventDefault()
  $('.all').hide()
  $('#new-task').show()
}

function toMyProjects(e) {
  e.preventDefault()
  $('.all').hide()
  $('#my-projects').show()
  fetchProjects()
}

function toTodosProject(e) {
  e.preventDefault()
  $('.all').hide()
  $('#todos-project').show()
  fetchTodosProject()
}

function toInvitation(e) {
  e.preventDefault()
  $('.all').hide()
  $('#project-invitation').show()
  fetchInvitations()
}

function toNewProject(e) {
  e.preventDefault()
  $('.all').hide()
  $('#new-project').show()
}