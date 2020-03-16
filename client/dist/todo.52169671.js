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
})({"js/todo.js":[function(require,module,exports) {
function fetchTodos(todoId, cb) {
  $.ajax({
    method: "get",
    url: "".concat(baseUrl, "/todos"),
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (todosArr) {
    $("#todo-list").empty();
    showTodos(todosArr);
    if (todoId && cb) cb(todoId);
  }).fail(function (err) {
    console.log(err);
  });
}

function showTodos(todos) {
  $("#todo-list").empty();
  $('#todo-list').append("<tr class=\"border-b\">\n      <th class=\"w-1/4 text-left p-3 px-5\">Task</th>\n      <th class=\"w-1/4 text-center p-3 px-5\">Status</th>\n      <th class=\"w-1/4 text-center p-3 px-5\">Due Date</th>\n      <th class=\"w-1/4 text-center p-3 px-5\">Action</th>\n    </tr>\n    ");
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = todos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var todo = _step.value;
      var date = todo.due_date.slice(0, 10);

      if (!todo.project_id) {
        $("#todo-list").append("\n        <tr class=\"border-t hover:bg-orange-100 bg-gray-100\">\n          <td id=\"name-".concat(todo._id, "\" class=\"p-3 px-4\">").concat(todo.name, "</td>\n          <td id=\"status-").concat(todo._id, "\" class=\"p-3 px-4 text-center\">").concat(todo.status, "</td>\n          <td class=\"p-3 px-4 text-center\">").concat(date, "</td>\n          <td class=\"p-3 px-4 text-center flex flex-col lg:flex-row justify-center\">\n            <button id=\"check-").concat(todo._id, "\" onclick=\"check('").concat(todo._id, "', $(this).text())\" type=\"button\" class=\"mb-2 lg:mr-2 lg:mb-0 text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Check</button>\n            <button id=\"btn-details-").concat(todo._id, "\" onclick=\"openDetails('").concat(todo._id, "')\" type=\"button\" class=\"text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Details</button>\n          </td>\n        </tr>\n        <tr id=\"details-").concat(todo._id, "\" class=\"hidden bg-gray-100\">\n          <td colspan=\"4\" class=\"p-3 px-4\">\n          <div>\n            <div id=\"details-preview-").concat(todo._id, "\" class=\"flex justify-between\">\n              <span>").concat(todo.description, "</span>\n              <div>\n                <button id=\"edit-").concat(todo._id, "\" onclick=\"openEdit('").concat(todo._id, "')\" type=\"button\" class=\"mr-2 text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Edit</button>\n                <button id=\"delete-").concat(todo._id, "\" onclick=\"deleteTodo('").concat(todo._id, "')\" type=\"button\" class=\"text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline\">Delete</button>\n              </div>\n            </div>\n            <form id=\"edit-form-").concat(todo._id, "\" class=\"shadow-md hidden px-8 pt-6 pb-8 mb-4 bg-white rounded-lg\" onsubmit=\"submitEdit(event, '").concat(todo._id, "')\">\n              <div class=\"mb-4\">\n                <label class=\"block mb-2 text-sm font-bold text-gray-700\" for=\"name-post\">\n                  Title\n                </label>\n                <input\n                  class=\"w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n                  id=\"name-edit-").concat(todo._id, "\"\n                  type=\"text\"\n                  placeholder=\"Title\"\n                  value=\"").concat(todo.name, "\"\n                />\n              </div>\n              <div class=\"mb-4\">\n                <label class=\"block mb-2 text-sm font-bold text-gray-700\" for=\"desc-post\">\n                  Description\n                </label>\n                <textarea\n                  class=\"w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n                  id=\"desc-edit-").concat(todo._id, "\"\n                  type=\"text\"\n                  rows=\"5\"\n                  placeholder=\"Write the description\"\n                >").concat(todo.description, "</textarea>\n              </div>\n              <div class=\"mb-4\">\n                <input\n                  id=\"due-date-edit-").concat(todo._id, "\"\n                  class=\"w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline\"\n                  name=\"due_date\"\n                  type=\"date\"\n                  value=\"").concat(date, "\"\n                />\n              </div>\n              <div class=\"mb-6 text-center\">\n                <button\n                  class=\"w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline\"\n                  type=\"submit\"\n                >\n                  Submit\n                </button>\n              </div>\n            </form>\n          </div>\n          </td>\n        </tr>\n        "));
      }

      if ($("#status-".concat(todo._id)).text() === 'queued') {
        $("#check-".concat(todo._id)).text('Check');
        $("#check-".concat(todo._id)).removeClass("bg-gray-700 hover:bg-gray-900").addClass("bg-green-500 hover:bg-green-700");
        $("#name-".concat(todo._id)).removeClass('line-through');
      } else if ($("#status-".concat(todo._id)).text() === 'done') {
        $("#check-".concat(todo._id)).text('Uncheck');
        $("#check-".concat(todo._id)).removeClass("bg-green-500 hover:bg-green-700").addClass("bg-gray-700 hover:bg-gray-900");
        $("#name-".concat(todo._id)).addClass('line-through');
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

function createTodo(e) {
  if (e) e.preventDefault();
  $.ajax({
    method: "post",
    url: "".concat(baseUrl, "/todos"),
    data: {
      name: $("#name-post").val(),
      description: $("#desc-post").val(),
      due_date: $("#todo-due-date").val()
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  }).done(function (todo) {
    $("#input-form").trigger("reset");
    $('.all').hide();
    $('#my-todos').show();
    fetchTodos();
  }).fail(function (err) {
    var errMsg = err.responseJSON.errors.message;
    $('#err-new-task').empty();
    $('#err-new-task').append("\n      <div class=\"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative\" role=\"alert\">\n        <strong class=\"font-bold\">Holy Moly!</strong>\n        <div id=\"err-box-new-task\"></div>\n        <span onclick=\"clearErrNewTask(event)\" class=\"absolute top-0 bottom-0 right-0 px-4 py-3\">\n          <svg class=\"fill-current h-6 w-6 text-red-500\" role=\"button\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\"><title>Close</title><path d=\"M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z\"/></svg>\n        </span>\n      </div>\n      ");
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = errMsg[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var msg = _step2.value;
        $('#err-box-new-task').append("\n        <span class=\"block\">".concat(msg, "</span>\n        "));
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
  });
}

function openDetails(todoId) {
  if ($("#details-".concat(todoId)).css('display') === 'none') {
    if ($("#edit-form-".concat(todoId)).css('display') !== 'none') {
      $("#edit-form-".concat(todoId)).hide();
    }

    $("#details-".concat(todoId)).show();
  } else {
    $("#details-".concat(todoId)).hide();
  }
}

function openEdit(todoId) {
  $("#edit-form-".concat(todoId)).show();
  $("#details-preview-".concat(todoId)).hide();
}

function submitEdit(e, todoId, projectId) {
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
    if (projectId) fetchTodosProject(projectId, openDetails);
    fetchTodos(todoId, openDetails);
  }).fail(function (err) {
    console.log(err);
  });
}

function deleteTodo(todoId) {
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
        fetchTodos();
      }).fail(function (err) {
        console.log(err);
      });
    }
  });
}

function clearErrNewTask(e) {
  e.preventDefault();
  $('#err-new-task').empty();
}

function check(todoId, kind) {
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
    fetchTodos();
  }).fail(function (err) {
    var errMsg = err.responseJSON.errors.message;
    Swal.fire({
      icon: 'err',
      text: errMsg
    });
  });
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
},{}]},{},["../../../../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/todo.js"], null)
//# sourceMappingURL=/todo.52169671.js.map