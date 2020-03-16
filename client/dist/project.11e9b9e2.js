// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/project.js":[function(require,module,exports) {
function fetchProjects() {
  $.ajax({
    method: "get",
    url: "".concat(baseUrl, "/projects"),
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (projectsArr) {
    $("#project-list").empty();
    showProjects(projectsArr);
  }).fail(function (err) {
    var errMsg = err.responseJSON.errors.message;
    Swal.fire({
      icon: 'error',
      text: errMsg
    });
  });
}

function showProjects(projects) {
  $("#project-list").empty();
  $('#project-list').append("<tr class=\"border-b\">\n      <th class=\"w-4/5 text-left p-3 px-5\">Project Name</th>\n      <th class=\"w-1/5 text-center p-3 px-5\">Action</th>\n    </tr>\n    ");
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = projects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var project = _step.value;
      $("#project-list").append("\n      <tr class=\"border-t hover:bg-orange-100 bg-gray-100\">\n        <td class=\"p-3 px-4\">".concat(project.name, "</td>\n        <td class=\"p-3 px-4 text-center flex flex-col lg:flex-row justify-center\">\n          <button id=\"invite-").concat(project._id, "\" onclick=\"openInvite('").concat(project._id, "')\" type=\"button\" class=\"mb-2 lg:mr-2 lg:mb-0 text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Invite</button>\n          <button id=\"details-").concat(project._id, "\" onclick=\"openProjectDetails('").concat(project._id, "', '").concat(project.name, "', '").concat(project.owner._id, "')\" type=\"button\" class=\"text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Open</button>\n        </td>\n      </tr>\n\n      <tr id=\"sub-project-").concat(project._id, "\" class=\"bg-gray-100\">\n        <td colspan=\"4\" class=\"p-3 px-4\">\n          <form id=\"invite-form-").concat(project._id, "\" class=\"hidden shadow-md px-8 pt-6 pb-8 mb-4 bg-white rounded-lg\" onsubmit=\"submitInvitation(event, '").concat(project._id, "', '").concat(project.name, "', '").concat(project.owner.email, "')\">\n            <div class=\"mb-4\">\n              <label class=\"block mb-2 text-sm font-bold text-gray-700\" for=\"name-post\">\n                Invite a Member\n              </label>\n              <input\n                class=\"w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n                id=\"invite-email-").concat(project._id, "\"\n                type=\"email\"\n                placeholder=\"example@mail.com\"\n              />\n            </div>\n            <div class=\"mb-6 text-center\">\n              <button\n                class=\"w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline\"\n                type=\"submit\"\n              >\n                Invite\n              </button>\n            </div>\n          </form>\n        </td>\n      </tr>\n      "));

      if (project.owner._id !== localStorage.getItem('userId')) {
        $("#invite-".concat(project._id)).hide();
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function createProject(e) {
  if (e) e.preventDefault();
  $.ajax({
    method: "post",
    url: "".concat(baseUrl, "/projects"),
    data: {
      name: $('#project-name-post').val()
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (project) {
    $('#project-form').trigger("reset");
    $('.all').hide();
    $('#my-projects').show();
    fetchProjects();
  }).fail(function (err) {
    console.log(err);
  });
}

function openInvite(projectId) {
  $("#invite-form-".concat(projectId)).show();
}

function submitInvitation(e, projectId, projectName, inviter) {
  e.preventDefault();
  $.ajax({
    method: 'patch',
    url: "".concat(baseUrl, "/projects/").concat(projectId, "/inviteMember"),
    data: {
      email: $("#invite-email-".concat(projectId)).val(),
      inviter: inviter
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (response) {
    Swal.fire({
      icon: 'success',
      text: 'Invitation sent'
    });
    fetchProjects();
    fetchProjectMembers(projectId, projectName);
  }).fail(function (err) {
    var errorMsg = err.responseJSON.errors.message;
    Swal.fire({
      icon: 'info',
      text: errorMsg
    });
  });
}

function openProjectDetails(projectId, projectName, ownerId) {
  $('.all').hide();
  $('#todos-project').show();
  fetchTodosProject(projectId, projectName, ownerId);
}

function fetchTodosProject(projectId, projectName, ownerId) {
  $.ajax({
    method: 'get',
    url: "".concat(baseUrl, "/projects/").concat(projectId),
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (response) {
    var todos = response.todos;
    $('#col-todos-project').empty();
    $('#col-todos-project').append("\n        <h3 class=\"pt-4 text-2xl text-center\">".concat(projectName, "</h3>\n        <div class=\"text-center\">\n          <span\n            class=\"text-center text-sm text-blue-500 hover:text-blue-800 cursor-pointer\"\n            href=\"\"\n            onclick=\"openMyProject()\"\n          >\n            My Project\n          </span> |\n          <span\n            class=\"text-center text-sm text-blue-500 hover:text-blue-800 cursor-pointer\"\n            href=\"\"\n            onclick=\"openProjectMembers('").concat(projectId, "', '").concat(projectName, "')\"\n          >\n            Member List\n          </span> |\n          <span\n            class=\"text-center text-sm text-blue-500 hover:text-blue-800 cursor-pointer\"\n            href=\"\"\n            onclick=\"openNewTodoProject('").concat(projectId, "', '").concat(projectName, "')\"\n          >\n            Create Task\n          </span>\n        </div>\n        <div class=\"text-gray-900\">\n          <div class=\"px-3 py-4 flex justify-center\">\n            <table class=\"w-full text-md bg-white shadow-md rounded-lg mb-4 table-fixed\">\n              <tbody id=\"todos-project-table\">\n              <tr class=\"border-b\">\n                <th class=\"w-1/5 text-left p-3 px-5\">Task</th>\n                <th class=\"w-1/5 text-center p-3 px-5\">By</th>\n                <th class=\"w-1/5 text-center p-3 px-5\">Status</th>\n                <th class=\"w-1/5 text-center p-3 px-5\">Due Date</th>\n                <th class=\"w-1/5 text-center p-3 px-5\">Action</th>\n              </tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n        <div id=\"del-project\" class=\"text-center\">\n          \n        </div>\n        "));
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = todos[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var todo = _step2.value;
        var date = todo.due_date.slice(0, 10);
        $("#todos-project-table").append("\n          <tr class=\"border-t hover:bg-orange-100 bg-gray-100\">\n            <td id=\"name-".concat(todo._id, "-p\" class=\"p-3 px-4\">").concat(todo.name, "</td>\n            <td class=\"p-3 px-4 text-center\">").concat(todo.user_id.username, "</td>\n            <td id=\"status-").concat(todo._id, "-p\" class=\"p-3 px-4 text-center\">").concat(todo.status, "</td>\n            <td id=\"todo-status-").concat(todo._id, "\" class=\"p-3 px-4 text-center\">").concat(date, "</td>\n            <td class=\"p-3 px-4 text-center flex flex-col lg:flex-row justify-center\">\n              <button id=\"check-").concat(todo._id, "-p\" onclick=\"checkTodoProject('").concat(todo._id, "', $(this).text(), '").concat(projectId, "', '").concat(projectName, "')\" type=\"button\" class=\"mb-2 lg:mr-2 lg:mb-0 text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Check</button>\n              <button id=\"btn-details-").concat(todo._id, "\" onclick=\"openDetails('").concat(todo._id, "')\" type=\"button\" class=\"text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Details</button>\n            </td>\n          </tr>\n          <tr id=\"details-").concat(todo._id, "\" class=\"hidden bg-gray-100\">\n            <td colspan=\"5\" class=\"p-3 px-4\">\n              <div id=\"details-preview-").concat(todo._id, "\" class=\"flex justify-between\">\n                <span>").concat(todo.description, "</span>\n                <div id='action-btn-").concat(todo._id, "'>\n                  <button id=\"edit-").concat(todo._id, "-p\" onclick=\"openEdit('").concat(todo._id, "')\" type=\"button\" class=\"mr-2 text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Edit</button>\n                  <button id=\"delete-").concat(todo._id, "-p\" onclick=\"deleteTodoProject('").concat(todo._id, "', '").concat(projectId, "', '").concat(projectName, "')\" type=\"button\" class=\"text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Delete</button>\n                </div>\n              </div>\n              <form id=\"edit-form-").concat(todo._id, "\" class=\"hidden shadow-md px-8 pt-6 pb-8 mb-4 bg-white rounded-lg\" onsubmit=\"submitEditTodoProject(event, '").concat(todo._id, "', '").concat(projectId, "', '").concat(projectName, "')\">\n                <div class=\"mb-4\">\n                  <label class=\"block mb-2 text-sm font-bold text-gray-700\" for=\"name-post\">\n                    Title\n                  </label>\n                  <input\n                    class=\"w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n                    id=\"name-edit-").concat(todo._id, "\"\n                    type=\"text\"\n                    placeholder=\"Title\"\n                    value=\"").concat(todo.name, "\"\n                  />\n                </div>\n                <div class=\"mb-4\">\n                  <label class=\"block mb-2 text-sm font-bold text-gray-700\" for=\"desc-post\">\n                    Description\n                  </label>\n                  <textarea\n                    class=\"w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n                    id=\"desc-edit-").concat(todo._id, "\"\n                    type=\"text\"\n                    rows=\"5\"\n                    placeholder=\"Write the description\"\n                  >").concat(todo.description, "</textarea>\n                </div>\n                <div class=\"mb-4\">\n                  <input\n                    id=\"due-date-edit-").concat(todo._id, "\"\n                    class=\"w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n                    name=\"due_date\"\n                    type=\"date\"\n                    value=\"").concat(date, "\"\n                  />\n                </div>\n                <div class=\"mb-6 text-center\">\n                  <button\n                    class=\"w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline\"\n                    type=\"submit\"\n                  >\n                    Submit\n                  </button>\n                </div>\n              </form>\n            </td>\n          </tr>\n          "));

        if (todo.user_id._id !== localStorage.getItem('userId')) {
          $("#check-".concat(todo._id, "-p")).hide();
          $("#action-btn-".concat(todo._id)).hide();
        }

        if ($("#status-".concat(todo._id, "-p")).text() === 'queued') {
          $("#check-".concat(todo._id, "-p")).text('Check');
          $("#check-".concat(todo._id, "-p")).removeClass("bg-gray-700 hover:bg-gray-900").addClass("bg-green-500 hover:bg-green-700");
          $("#name-".concat(todo._id, "-p")).removeClass('line-through');
        } else if ($("#status-".concat(todo._id, "-p")).text() === 'done') {
          $("#check-".concat(todo._id, "-p")).text('Uncheck');
          $("#check-".concat(todo._id, "-p")).removeClass("bg-green-500 hover:bg-green-700").addClass("bg-gray-700 hover:bg-gray-900");
          $("#name-".concat(todo._id, "-p")).addClass('line-through');
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    if (ownerId === localStorage.getItem('userId')) {
      $('#del-project').empty();
      $('#del-project').append("\n          <a\n            class=\"inline-block text-sm text-blue-500 align-baseline hover:text-blue-800\"\n            href=\"\"\n            onclick=\"openEditProject(event, '".concat(projectId, "')\"\n          >\n            Edit\n          </a> |\n          <a\n            class=\"inline-block text-sm text-blue-500 align-baseline hover:text-blue-800\"\n            href=\"\"\n            onclick=\"deleteProject(event, '").concat(projectId, "', '").concat(projectName, "')\"\n          >\n            Delete\n          </a>\n          <form id=\"edit-project-form\" onsubmit=\"changeProjectName(event, '").concat(projectId, "', '").concat(ownerId, "')\" class=\"hidden shadow-md px-8 pt-6 pb-8 mb-4 bg-white rounded-lg\">\n            <div class=\"mb-4\">\n              <label class=\"block mb-2 text-sm font-bold text-gray-700\" for=\"name-post\">\n                Change Project Name\n              </label>\n              <input\n                id=\"edit-project-").concat(projectId, "\"\n                class=\"w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n                type=\"text\"\n                value=\"").concat(projectName, "\"\n              />\n            </div>\n            <div class=\"mb-6 text-center\">\n              <button\n                class=\"w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline\"\n                type=\"submit\"\n              >\n                Submit\n              </button>\n            </div>\n          </form>\n          "));
    }
  }).fail(function (err) {
    var errorMsg = err.responseJSON.errors.message;
    Swal.fire({
      icon: 'info',
      text: errorMsg
    });
  });
}

function deleteTodoProject(todoId, projectId, projectName) {
  Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        method: "delete",
        url: "".concat(baseUrl, "/todos/").concat(todoId),
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      }).done(function (result) {
        fetchTodosProject(projectId, projectName);
      }).fail(function (err) {
        console.log(err);
      });
    }
  });
}

function deleteProject(e, projectId) {
  e.preventDefault();
  Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        method: "delete",
        url: "".concat(baseUrl, "/projects/").concat(projectId),
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      }).done(function (result) {
        $('.all').hide();
        $('#my-projects').show();
        fetchProjects();
      }).fail(function (err) {
        console.log(err);
      });
    }
  });
}

function changeProjectName(e, projectId, ownerId) {
  e.preventDefault();
  $.ajax({
    method: 'patch',
    url: "".concat(baseUrl, "/projects/").concat(projectId),
    data: {
      name: $("#edit-project-".concat(projectId)).val()
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (response) {
    openProjectDetails(response._id, response.name, ownerId);
  }).fail(function (err) {
    console.log(err);
  });
}

function openEditProject(e, projectId) {
  e.preventDefault();
  $('#edit-project-form').show();
}

function openProjectMembers(projectId, projectName) {
  $('.all').hide();
  $('#project-members').show();
  fetchProjectMembers(projectId, projectName);
}

function fetchProjectMembers(projectId, projectName) {
  $.ajax({
    method: 'get',
    url: "".concat(baseUrl, "/projects/").concat(projectId),
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (response) {
    var members = response.members,
        pendingMembers = response.pendingMembers;
    $('#member-list').empty();
    $('#member-list').append("\n        <h3 class=\"pt-4 text-2xl text-center\">".concat(projectName, "</h3>\n        <h6 onclick=\"openMyProject(event)\" class=\"text-sm text-center text-blue-500 hover:text-blue-800 cursor-pointer\">My Project</h6>\n        <h6 class=\"pt-4 text-sm pl-4\">Members</h6>\n        <div class=\"text-gray-900\">\n          <div class=\"px-3 py-4 flex justify-center\">\n            <table class=\"w-full text-md bg-white shadow-md rounded-lg mb-4 table-fixed\">\n              <tbody id=\"member-list-table\">\n                <tr class=\"border-b\">\n                  <th class=\"w-2/5 text-left p-3 px-5\">Username</th>\n                  <th class=\"w-2/5 text-left p-3 px-5\">Email</th>\n                  <th class=\"w-1/5 text-center p-3 px-5\">Action</th>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n        <h6 class=\"pt-4 text-sm pl-4\">Pending Members</h6>\n        <div class=\"text-gray-900\">\n          <div class=\"px-3 py-4 flex justify-center\">\n            <table class=\"w-full text-md bg-white shadow-md rounded-lg mb-4 table-fixed\">\n              <tbody id=\"pending-member-list-table\">\n                <tr class=\"border-b\">\n                  <th class=\"w-2/5 text-left p-3 px-5\">Username</th>\n                  <th class=\"w-2/5 text-left p-3 px-5\">Email</th>\n                  <th class=\"w-1/5 text-center p-3 px-5\">Action</th>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n        "));
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = members[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var member = _step3.value;
        $('#member-list-table').append("\n          <tr class=\"border-t hover:bg-orange-100 bg-gray-100\">\n            <td class=\"p-3 px-4\">".concat(member.username, "</td>\n            <td class=\"p-3 px-4\">").concat(member.email, "</td>\n            <td class=\"p-3 px-4 text-center flex flex-col lg:flex-row justify-center\">\n              <button onclick=\"kickMember('remove', '").concat(member.email, "', '").concat(projectId, "', '").concat(projectName, "')\" type=\"button\" class=\"mb-2 lg:mr-2 lg:mb-0 text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Kick</button>\n            </td>\n          </tr>\n          ")); // if (project)
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = pendingMembers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var pendingMember = _step4.value;
        $('#pending-member-list-table').append("\n          <tr class=\"border-t hover:bg-orange-100 bg-gray-100\">\n            <td class=\"p-3 px-4\">".concat(pendingMember.username, "</td>\n            <td class=\"p-3 px-4\">").concat(pendingMember.email, "</td>\n            <td class=\"p-3 px-4 text-center flex flex-col lg:flex-row justify-center\">\n              <button onclick=\"kickMember('cancel','").concat(pendingMember.email, "', '").concat(projectId, "', '").concat(projectName, "')\" type=\"button\" class=\"mb-2 lg:mr-2 lg:mb-0 text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Cancel</button>\n            </td>\n          </tr>\n          "));
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  });
}

function kickMember(kind, email, projectId, projectName) {
  Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, kick the member!'
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        method: "patch",
        url: "".concat(baseUrl, "/projects/").concat(projectId, "/removeMember"),
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data: {
          email: email,
          kind: kind
        }
      }).done(function (result) {
        fetchProjectMembers(projectId, projectName);
      }).fail(function (err) {
        Swal.fire({
          icon: 'error',
          text: err.responseJSON.errors.message
        });
      });
    }
  });
}

function openNewTodoProject(projectId, projectName) {
  $('.all').hide();
  $('#new-project-task').show();
  $('#project-form-box').empty();
  $('#project-form-box').append("\n    <form id=\"input-form-".concat(projectId, "\" class=\"px-8 pt-6 pb-8 mb-4 bg-white rounded\" onsubmit=\"createProjectTodo(event, '").concat(projectId, "', '").concat(projectName, "')\">\n      <div class=\"mb-4\">\n        <label class=\"block mb-2 text-sm font-bold text-gray-700\" for=\"name-post\">\n          Title\n        </label>\n        <input\n          class=\"w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n          id=\"name-post-p\"\n          type=\"text\"\n          placeholder=\"Title\"\n        />\n      </div>\n      <div class=\"mb-4\">\n        <label class=\"block mb-2 text-sm font-bold text-gray-700\" for=\"desc-post\">\n          Description\n        </label>\n        <textarea\n          class=\"w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n          id=\"desc-post-p\"\n          type=\"text\"\n          rows=\"5\"\n          placeholder=\"Write the description\"\n        ></textarea>\n      </div>\n      <div class=\"mb-4\">\n        <input\n          id=\"todo-due-date-p\"\n          class=\"w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n          name=\"due_date\"\n          type=\"date\"\n        />\n      </div>\n      <div class=\"mb-6 text-center\">\n        <button\n          class=\"w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline\"\n          type=\"submit\"\n        >\n          Submit\n        </button>\n      </div>\n      <hr class=\"mb-2 border-t\" />\n      <div class=\"text-center\">\n        <a\n          onclick=\"openMyProject(event)\"\n          class=\"inline-block text-sm text-blue-500 align-baseline hover:text-blue-800\"\n          href=\"#\"\n        >\n          Project's Todos\n        </a>\n      </div>\n    </form>\n    "));
}

function createProjectTodo(e, projectId, projectName) {
  e.preventDefault();
  $.ajax({
    method: "patch",
    url: "".concat(baseUrl, "/projects/").concat(projectId, "/addTodo"),
    data: {
      name: $("#name-post-p").val(),
      description: $("#desc-post-p").val(),
      due_date: $("#todo-due-date-p").val()
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (todo) {
    $("#input-form").trigger("reset");
    $('.all').hide();
    $('#todos-project').show();
    fetchTodosProject(projectId, projectName);
  }).fail(function (err) {
    var errMsg = err.responseJSON.errors.message;
    $('#err-new-task-p').empty();
    $('#err-new-task-p').append("\n      <div class=\"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative\" role=\"alert\">\n        <strong class=\"font-bold\">Holy Moly!</strong>\n        <div id=\"err-box-new-task\"></div>\n        <span onclick=\"clearErrNewTaskP(event)\" class=\"absolute top-0 bottom-0 right-0 px-4 py-3\">\n          <svg class=\"fill-current h-6 w-6 text-red-500\" role=\"button\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\"><title>Close</title><path d=\"M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z\"/></svg>\n        </span>\n      </div>\n      ");
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = errMsg[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var msg = _step5.value;
        $('#err-box-new-task').append("\n        <span class=\"block\">".concat(msg, "</span>\n        "));
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  });
}

function submitEditTodoProject(e, todoId, projectId, projectName) {
  if (e) e.preventDefault();
  $.ajax({
    method: "patch",
    url: "".concat(baseUrl, "/todos/").concat(todoId),
    data: {
      name: $("#name-edit-".concat(todoId)).val(),
      description: $("#desc-edit-".concat(todoId)).val(),
      due_date: $("#-due-date-".concat(todoId)).val()
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (todo) {
    $('#edit-form').trigger("reset");
    fetchTodosProject(projectId, projectName);
  }).fail(function (err) {
    console.log(err);
  });
}

function checkTodoProject(todoId, kind, projectId, projectName) {
  var status;

  if (kind === "Check") {
    status = "done";
  } else if (kind = "Uncheck") {
    status = "queued";
  }

  $.ajax({
    method: "patch",
    url: "".concat(baseUrl, "/todos/").concat(todoId),
    data: {
      status: status
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (result) {
    fetchTodosProject(projectId, projectName);
  }).fail(function (err) {
    var errMsg = err.responseJSON.errors.message;
    Swal.fire({
      icon: 'err',
      text: errMsg
    });
  });
}

function clearErrNewTaskP(e) {
  e.preventDefault();
  $('#err-new-task-p').empty();
}

function fetchInvitations(projectId, projectName) {
  $.ajax({
    method: 'get',
    url: "".concat(baseUrl, "/user/invitations"),
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (projects) {
    $('#invitation-list').empty();
    $('#invitation-list').append("\n        <div class=\"text-gray-900\">\n          <div class=\"px-3 py-4 flex justify-center\">\n            <table class=\"w-full text-md bg-white shadow-md rounded-lg mb-4 table-fixed\">\n              <tbody id=\"invitation-list-table\">\n                <tr class=\"border-b\">\n                  <th class=\"w-2/5 text-left p-3 px-5\">Project Name</th>\n                  <th class=\"w-1/5 text-center p-3 px-5\">Action</th>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n        ");
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = projects[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var project = _step6.value;
        $('#invitation-list-table').append("\n          <tr class=\"border-t hover:bg-orange-100 bg-gray-100\">\n            <td class=\"p-3 px-4\">".concat(project.name, "</td>\n            <td class=\"p-3 px-4 text-center flex flex-col lg:flex-row justify-center\">\n              <button onclick=\"acceptInv('").concat(project._id, "')\" type=\"button\" class=\"mb-2 lg:mr-2 lg:mb-0 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Accept</button>\n              <button onclick=\"rejectInv('").concat(project._id, "')\" type=\"button\" class=\"mb-2 lg:mr-2 lg:mb-0 text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Reject</button>\n            </td>\n          </tr>\n          "));
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  });
}

function acceptInv(projectId) {
  $.ajax({
    method: 'get',
    url: "".concat(baseUrl, "/projects/").concat(projectId, "/acceptInvitation"),
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (response) {
    $('.all').hide();
    $('#my-projects').show();
    Swal.fire({
      icon: 'success',
      text: response.message
    });
    fetchProjects();
  }).fail(function (err) {
    Swal.fire({
      icon: 'errors',
      text: err.responseJSON.errors.message
    });
  });
}

function rejectInv(projectId) {
  $.ajax({
    method: 'patch',
    url: "".concat(baseUrl, "/projects/").concat(projectId, "/rejectInvitation"),
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (response) {
    $('.all').hide();
    $('#my-projects').show();
    Swal.fire({
      icon: 'success',
      text: response.message
    });
  }).fail(function (err) {
    console.log(err);
    Swal.fire({
      icon: 'error',
      text: err
    });
  });
}

function openMyProject() {
  $('.all').hide();
  $('#my-projects').show();
  fetchProjects();
}
},{}],"../../../../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "38345" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/project.js"], null)
//# sourceMappingURL=/project.11e9b9e2.js.map