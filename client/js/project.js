function fetchProjects() {
  $.ajax({
    method: "get",
    url: `${baseUrl}/projects`,
    headers: { access_token: localStorage.getItem('access_token') }
  })
  .done(projectsArr => {
    $("#project-list").empty();
    showProjects(projectsArr);
  })
  .fail(err => {
    let errMsg = err.responseJSON.errors.message
    Swal.fire({
      icon: 'error',
      text: errMsg
    })
  })
}

function showProjects(projects) {
  $("#project-list").empty()
  $('#project-list').append( 
    `<tr class="border-b">
      <th class="w-4/5 text-left p-3 px-5">Project Name</th>
      <th class="w-1/5 text-center p-3 px-5">Action</th>
    </tr>
    `
  )
  for (let project of projects) {
    $("#project-list").append(
      `
      <tr class="border-t hover:bg-orange-100 bg-gray-100">
        <td class="p-3 px-4">${project.name}</td>
        <td class="p-3 px-4 text-center flex flex-col lg:flex-row justify-center">
          <button id="invite-${project._id}" onclick="openInvite('${project._id}')" type="button" class="mb-2 lg:mr-2 lg:mb-0 text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Invite</button>
          <button id="details-${project._id}" onclick="openProjectDetails('${project._id}', '${project.name}', '${project.owner._id}')" type="button" class="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Open</button>
        </td>
      </tr>

      <tr id="sub-project-${project._id}" class="bg-gray-100">
        <td colspan="4" class="p-3 px-4">
          <form id="invite-form-${project._id}" class="hidden shadow-md px-8 pt-6 pb-8 mb-4 bg-white rounded-lg" onsubmit="submitInvitation(event, '${project._id}', '${project.name}', '${project.owner.email}')">
            <div class="mb-4">
              <label class="block mb-2 text-sm font-bold text-gray-700" for="name-post">
                Invite a Member
              </label>
              <input
                class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="invite-email-${project._id}"
                type="email"
                placeholder="example@mail.com"
              />
            </div>
            <div class="mb-6 text-center">
              <button
                class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Invite
              </button>
            </div>
          </form>
        </td>
      </tr>
      `
    )
    if (project.owner._id !== localStorage.getItem('userId')) {
      $(`#invite-${project._id}`).hide()
    }
  }
}

function createProject(e) {
  if (e) e.preventDefault();
  
  $.ajax({
    method: "post",
    url: `${baseUrl}/projects`,
    data: {
      name: $('#project-name-post').val()
    },
    headers: { access_token: localStorage.getItem('access_token') }
  })
  .done(project => {
    $('#project-form').trigger("reset");
    $('.all').hide()
    $('#my-projects').show()
    fetchProjects()
  })
  .fail(err => {
    console.log(err);
  })
}

function openInvite(projectId) {
  $(`#invite-form-${projectId}`).show()
}

function submitInvitation(e, projectId, projectName, inviter) {
  e.preventDefault()
  $.ajax({
    method: 'patch',
    url: `${baseUrl}/projects/${projectId}/inviteMember`,
    data: {
      email: $(`#invite-email-${projectId}`).val(),
      inviter
    },
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      Swal.fire({
        icon: 'success',
        text: 'Invitation sent'
      })
      fetchProjects()
      fetchProjectMembers(projectId, projectName)
    })
    .fail(err => {
      let errorMsg = err.responseJSON.errors.message
      Swal.fire({
        icon: 'info',
        text: errorMsg
      })
    })
}

function openProjectDetails(projectId, projectName, ownerId) {
  $('.all').hide()
  $('#todos-project').show()
  fetchTodosProject(projectId, projectName, ownerId)
}

function fetchTodosProject(projectId, projectName, ownerId) {
  $.ajax({
    method: 'get',
    url: `${baseUrl}/projects/${projectId}`,
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      let todos = response.todos
      $('#col-todos-project').empty()
      $('#col-todos-project').append(
        `
        <h3 class="pt-4 text-2xl text-center">${projectName}</h3>
        <div class="text-center">
          <span
            class="text-center text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
            href=""
            onclick="openMyProject()"
          >
            My Project
          </span> |
          <span
            class="text-center text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
            href=""
            onclick="openProjectMembers('${projectId}', '${projectName}')"
          >
            Member List
          </span> |
          <span
            class="text-center text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
            href=""
            onclick="openNewTodoProject('${projectId}', '${projectName}')"
          >
            Create Task
          </span>
        </div>
        <div class="text-gray-900">
          <div class="px-3 py-4 flex justify-center">
            <table class="w-full text-md bg-white shadow-md rounded-lg mb-4 table-fixed">
              <tbody id="todos-project-table">
              <tr class="border-b">
                <th class="w-1/5 text-left p-3 px-5">Task</th>
                <th class="w-1/5 text-center p-3 px-5">By</th>
                <th class="w-1/5 text-center p-3 px-5">Status</th>
                <th class="w-1/5 text-center p-3 px-5">Due Date</th>
                <th class="w-1/5 text-center p-3 px-5">Action</th>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div id="del-project" class="text-center">
          
        </div>
        `
      )
      for (let todo of todos) {
        let date = todo.due_date.slice(0, 10)
        $("#todos-project-table").append(
          `
          <tr class="border-t hover:bg-orange-100 bg-gray-100">
            <td id="name-${todo._id}-p" class="p-3 px-4">${todo.name}</td>
            <td class="p-3 px-4 text-center">${todo.user_id.username}</td>
            <td id="status-${todo._id}-p" class="p-3 px-4 text-center">${todo.status}</td>
            <td id="todo-status-${todo._id}" class="p-3 px-4 text-center">${date}</td>
            <td class="p-3 px-4 text-center flex flex-col lg:flex-row justify-center">
              <button id="check-${todo._id}-p" onclick="checkTodoProject('${todo._id}', $(this).text(), '${projectId}', '${projectName}')" type="button" class="mb-2 lg:mr-2 lg:mb-0 text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Check</button>
              <button id="btn-details-${todo._id}" onclick="openDetails('${todo._id}')" type="button" class="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Details</button>
            </td>
          </tr>
          <tr id="details-${todo._id}" class="hidden bg-gray-100">
            <td colspan="5" class="p-3 px-4">
              <div id="details-preview-${todo._id}" class="flex justify-between">
                <span>${todo.description}</span>
                <div id='action-btn-${todo._id}'>
                  <button id="edit-${todo._id}-p" onclick="openEdit('${todo._id}')" type="button" class="mr-2 text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Edit</button>
                  <button id="delete-${todo._id}-p" onclick="deleteTodoProject('${todo._id}', '${projectId}', '${projectName}')" type="button" class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Delete</button>
                </div>
              </div>
              <form id="edit-form-${todo._id}" class="hidden shadow-md px-8 pt-6 pb-8 mb-4 bg-white rounded-lg" onsubmit="submitEditTodoProject(event, '${todo._id}', '${projectId}', '${projectName}')">
                <div class="mb-4">
                  <label class="block mb-2 text-sm font-bold text-gray-700" for="name-post">
                    Title
                  </label>
                  <input
                    class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="name-edit-${todo._id}"
                    type="text"
                    placeholder="Title"
                    value="${todo.name}"
                  />
                </div>
                <div class="mb-4">
                  <label class="block mb-2 text-sm font-bold text-gray-700" for="desc-post">
                    Description
                  </label>
                  <textarea
                    class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="desc-edit-${todo._id}"
                    type="text"
                    rows="5"
                    placeholder="Write the description"
                  >${todo.description}</textarea>
                </div>
                <div class="mb-4">
                  <input
                    id="due-date-edit-${todo._id}"
                    class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    name="due_date"
                    type="date"
                    value="${date}"
                  />
                </div>
                <div class="mb-6 text-center">
                  <button
                    class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </td>
          </tr>
          `
        )
        if (todo.user_id._id !== localStorage.getItem('userId')) {
          $(`#check-${todo._id}-p`).hide()
          $(`#action-btn-${todo._id}`).hide()
        }
        if ($(`#status-${todo._id}-p`).text() === 'queued') {
          $(`#check-${todo._id}-p`).text('Check')
          $(`#check-${todo._id}-p`).removeClass("bg-gray-700 hover:bg-gray-900").addClass("bg-green-500 hover:bg-green-700")
          $(`#name-${todo._id}-p`).removeClass('line-through')
        } else if ($(`#status-${todo._id}-p`).text() === 'done'){
          $(`#check-${todo._id}-p`).text('Uncheck')
          $(`#check-${todo._id}-p`).removeClass("bg-green-500 hover:bg-green-700").addClass("bg-gray-700 hover:bg-gray-900")
          $(`#name-${todo._id}-p`).addClass('line-through')
        }
      }
      if (ownerId === localStorage.getItem('userId')) {
        $('#del-project').empty()
        $('#del-project').append(
          `
          <a
            class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
            href=""
            onclick="openEditProject(event, '${projectId}')"
          >
            Edit
          </a> |
          <a
            class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
            href=""
            onclick="deleteProject(event, '${projectId}', '${projectName}')"
          >
            Delete
          </a>
          <form id="edit-project-form" onsubmit="changeProjectName(event, '${projectId}', '${ownerId}')" class="hidden shadow-md px-8 pt-6 pb-8 mb-4 bg-white rounded-lg">
            <div class="mb-4">
              <label class="block mb-2 text-sm font-bold text-gray-700" for="name-post">
                Change Project Name
              </label>
              <input
                id="edit-project-${projectId}"
                class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                value="${projectName}"
              />
            </div>
            <div class="mb-6 text-center">
              <button
                class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
          `
        )
      }
    })
    .fail(err => {
      let errorMsg = err.responseJSON.errors.message
      Swal.fire({
        icon: 'info',
        text: errorMsg
      })
    })
}

function deleteTodoProject(todoId, projectId, projectName) {
  Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        method: "delete",
        url: `${baseUrl}/todos/${todoId}`,
        headers: { access_token: localStorage.getItem('access_token') }
      })
      .done(result => {
        fetchTodosProject(projectId, projectName)
      })
      .fail(err =>  {
        console.log(err)
      })
    }
  })
}

function deleteProject(e, projectId) {
  e.preventDefault()
  Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        method: "delete",
        url: `${baseUrl}/projects/${projectId}`,
        headers: { access_token: localStorage.getItem('access_token') }
      })
      .done(result => {
        $('.all').hide()
        $('#my-projects').show()
        fetchProjects()
      })
      .fail(err =>  {
        console.log(err)
      })
    }
  })
}

function changeProjectName(e, projectId, ownerId) {
  e.preventDefault()
  $.ajax({
    method: 'patch',
    url: `${baseUrl}/projects/${projectId}`,
    data: {
      name: $(`#edit-project-${projectId}`).val()
    },
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      openProjectDetails(response._id, response.name, ownerId)
    })
    .fail(err => {
      console.log(err)
    })
}

function openEditProject(e, projectId) {
  e.preventDefault()
  $('#edit-project-form').show()
}

function openProjectMembers(projectId, projectName) {
  $('.all').hide()
  $('#project-members').show()
  fetchProjectMembers(projectId, projectName)
}

function fetchProjectMembers(projectId, projectName) {
  $.ajax({
    method: 'get',
    url: `${baseUrl}/projects/${projectId}`,
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      let { members, pendingMembers }= response
      $('#member-list').empty()
      $('#member-list').append(
        `
        <h3 class="pt-4 text-2xl text-center">${projectName}</h3>
        <h6 onclick="openMyProject(event)" class="text-sm text-center text-blue-500 hover:text-blue-800 cursor-pointer">My Project</h6>
        <h6 class="pt-4 text-sm pl-4">Members</h6>
        <div class="text-gray-900">
          <div class="px-3 py-4 flex justify-center">
            <table class="w-full text-md bg-white shadow-md rounded-lg mb-4 table-fixed">
              <tbody id="member-list-table">
                <tr class="border-b">
                  <th class="w-2/5 text-left p-3 px-5">Username</th>
                  <th class="w-2/5 text-left p-3 px-5">Email</th>
                  <th class="w-1/5 text-center p-3 px-5">Action</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <h6 class="pt-4 text-sm pl-4">Pending Members</h6>
        <div class="text-gray-900">
          <div class="px-3 py-4 flex justify-center">
            <table class="w-full text-md bg-white shadow-md rounded-lg mb-4 table-fixed">
              <tbody id="pending-member-list-table">
                <tr class="border-b">
                  <th class="w-2/5 text-left p-3 px-5">Username</th>
                  <th class="w-2/5 text-left p-3 px-5">Email</th>
                  <th class="w-1/5 text-center p-3 px-5">Action</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        `
      )
      for (let member of members) {
        $('#member-list-table').append(
          `
          <tr class="border-t hover:bg-orange-100 bg-gray-100">
            <td class="p-3 px-4">${member.username}</td>
            <td class="p-3 px-4">${member.email}</td>
            <td class="p-3 px-4 text-center flex flex-col lg:flex-row justify-center">
              <button onclick="kickMember('remove', '${member.email}', '${projectId}', '${projectName}')" type="button" class="mb-2 lg:mr-2 lg:mb-0 text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Kick</button>
            </td>
          </tr>
          `
        )
        // if (project)
      }
      for (let pendingMember of pendingMembers) {
        $('#pending-member-list-table').append(
          `
          <tr class="border-t hover:bg-orange-100 bg-gray-100">
            <td class="p-3 px-4">${pendingMember.username}</td>
            <td class="p-3 px-4">${pendingMember.email}</td>
            <td class="p-3 px-4 text-center flex flex-col lg:flex-row justify-center">
              <button onclick="kickMember('cancel','${pendingMember.email}', '${projectId}', '${projectName}')" type="button" class="mb-2 lg:mr-2 lg:mb-0 text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Cancel</button>
            </td>
          </tr>
          `
        )
      }
    })
}

function kickMember(kind, email, projectId, projectName) {
  Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, kick the member!'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        method: "patch",
        url: `${baseUrl}/projects/${projectId}/removeMember`,
        headers: { access_token: localStorage.getItem('access_token') },
        data: {
          email,
          kind
        }
      })
      .done(result => {
        fetchProjectMembers(projectId, projectName)
      })
      .fail(err =>  {
        Swal.fire({
          icon: 'error',
          text: err.responseJSON.errors.message
        })
      })
    }
  })
}

function openNewTodoProject(projectId, projectName) {
  $('.all').hide()
  $('#new-project-task').show()
  $('#project-form-box').empty()
  $('#project-form-box').append(
    `
    <form id="input-form-${projectId}" class="px-8 pt-6 pb-8 mb-4 bg-white rounded" onsubmit="createProjectTodo(event, '${projectId}', '${projectName}')">
      <div class="mb-4">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="name-post">
          Title
        </label>
        <input
          class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="name-post-p"
          type="text"
          placeholder="Title"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="desc-post">
          Description
        </label>
        <textarea
          class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="desc-post-p"
          type="text"
          rows="5"
          placeholder="Write the description"
        ></textarea>
      </div>
      <div class="mb-4">
        <input
          id="todo-due-date-p"
          class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          name="due_date"
          type="date"
        />
      </div>
      <div class="mb-6 text-center">
        <button
          class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </div>
      <hr class="mb-2 border-t" />
      <div class="text-center">
        <a
          onclick="openMyProject(event)"
          class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
          href="#"
        >
          Project's Todos
        </a>
      </div>
    </form>
    `
  )
}

function createProjectTodo(e, projectId, projectName) {  
  e.preventDefault()
  $.ajax({
    method: "patch",
    url: `${baseUrl}/projects/${projectId}/addTodo`,
    data: {
      name: $("#name-post-p").val(),
      description: $("#desc-post-p").val(),
      due_date: $("#todo-due-date-p").val()
    },
    headers: { access_token: localStorage.getItem('access_token') }
  })
  .done(todo => {
    $("#input-form").trigger("reset");
    $('.all').hide()
    $('#todos-project').show()
    fetchTodosProject(projectId, projectName)
  })
  .fail(err => {
    let errMsg = err.responseJSON.errors.message
    $('#err-new-task-p').empty()
    $('#err-new-task-p').append(
      `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Holy Moly!</strong>
        <div id="err-box-new-task"></div>
        <span onclick="clearErrNewTaskP(event)" class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
      </div>
      `
    )
    for (let msg of errMsg) {
      $('#err-box-new-task').append(
        `
        <span class="block">${msg}</span>
        `
      )
    }
  })
}

function submitEditTodoProject(e, todoId, projectId, projectName) {
  if (e) e.preventDefault()
  $.ajax({
    method: "patch",
    url: `${baseUrl}/todos/${todoId}`,
    data: {
      name: $(`#name-edit-${todoId}`).val(),
      description: $(`#desc-edit-${todoId}`).val(),
      due_date: $(`#-due-date-${todoId}`).val()
    },
    headers: { access_token: localStorage.getItem('access_token') }
  })
  .done(todo => {
    $('#edit-form').trigger("reset")
    fetchTodosProject(projectId, projectName)
  })
  .fail(err => {
    console.log(err);
  })
}

function checkTodoProject(todoId, kind, projectId, projectName) {
  let status;
  if (kind === "Check") {
    status = "done";
  } else if (kind = "Uncheck") {
    status = "queued"
  }
  $.ajax({
    method: "patch",
    url: `${baseUrl}/todos/${todoId}`,
    data: { status },
    headers: { access_token: localStorage.getItem('access_token') }
  })
  .done(result => {
    fetchTodosProject(projectId, projectName)
  })
  .fail(err => {
    let errMsg = err.responseJSON.errors.message
    Swal.fire({
      icon: 'err',
      text: errMsg
    })
  })
}

function clearErrNewTaskP(e) {
  e.preventDefault()
  $('#err-new-task-p').empty()
}

function fetchInvitations(projectId, projectName) {
  $.ajax({
    method: 'get',
    url: `${baseUrl}/user/invitations`,
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(projects => {
      $('#invitation-list').empty()
      $('#invitation-list').append(
        `
        <div class="text-gray-900">
          <div class="px-3 py-4 flex justify-center">
            <table class="w-full text-md bg-white shadow-md rounded-lg mb-4 table-fixed">
              <tbody id="invitation-list-table">
                <tr class="border-b">
                  <th class="w-2/5 text-left p-3 px-5">Project Name</th>
                  <th class="w-1/5 text-center p-3 px-5">Action</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        `
      )
      for (let project of projects) {
        $('#invitation-list-table').append(
          `
          <tr class="border-t hover:bg-orange-100 bg-gray-100">
            <td class="p-3 px-4">${project.name}</td>
            <td class="p-3 px-4 text-center flex flex-col lg:flex-row justify-center">
              <button onclick="acceptInv('${project._id}')" type="button" class="mb-2 lg:mr-2 lg:mb-0 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Accept</button>
              <button onclick="rejectInv('${project._id}')" type="button" class="mb-2 lg:mr-2 lg:mb-0 text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Reject</button>
            </td>
          </tr>
          `
        )
      }
    })
}

function acceptInv(projectId) {
  $.ajax({
    method: 'get',
    url: `${baseUrl}/projects/${projectId}/acceptInvitation`,
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      $('.all').hide()
      $('#my-projects').show()
      Swal.fire({
        icon: 'success',
        text: response.message
      })
      fetchProjects()
    })
    .fail(err => {
      Swal.fire({
        icon: 'errors',
        text: err.responseJSON.errors.message
      })
    })
}

function rejectInv(projectId) {
  $.ajax({
    method: 'patch',
    url: `${baseUrl}/projects/${projectId}/rejectInvitation`,
    headers: { access_token: localStorage.getItem('access_token') }
  })
    .done(response => {
      $('.all').hide()
      $('#my-projects').show()
      Swal.fire({
        icon: 'success',
        text: response.message
      })
    })
    .fail(err => {
      console.log(err)
      Swal.fire({
        icon: 'error',
        text: err
      })
    })
}

function openMyProject() {
  $('.all').hide()
  $('#my-projects').show()
  fetchProjects()
}