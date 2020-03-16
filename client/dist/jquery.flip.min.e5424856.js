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
})({"js/jquery.flip.min.js":[function(require,module,exports) {
/*! flip - v1.1.2 - 2016-10-20
* https://github.com/nnattawat/flip
* Copyright (c) 2016 Nattawat Nonsung; Licensed MIT */
!function (a) {
  var b = function b() {
    var a,
        b = document.createElement("fakeelement"),
        c = {
      transition: "transitionend",
      OTransition: "oTransitionEnd",
      MozTransition: "transitionend",
      WebkitTransition: "webkitTransitionEnd"
    };

    for (a in c) {
      if (void 0 !== b.style[a]) return c[a];
    }
  },
      c = function c(b, _c, d) {
    this.setting = {
      axis: "y",
      reverse: !1,
      trigger: "click",
      speed: 500,
      forceHeight: !1,
      forceWidth: !1,
      autoSize: !0,
      front: ".front",
      back: ".back"
    }, this.setting = a.extend(this.setting, _c), "string" != typeof _c.axis || "x" !== _c.axis.toLowerCase() && "y" !== _c.axis.toLowerCase() || (this.setting.axis = _c.axis.toLowerCase()), "boolean" == typeof _c.reverse && (this.setting.reverse = _c.reverse), "string" == typeof _c.trigger && (this.setting.trigger = _c.trigger.toLowerCase());
    var e = parseInt(_c.speed);
    isNaN(e) || (this.setting.speed = e), "boolean" == typeof _c.forceHeight && (this.setting.forceHeight = _c.forceHeight), "boolean" == typeof _c.forceWidth && (this.setting.forceWidth = _c.forceWidth), "boolean" == typeof _c.autoSize && (this.setting.autoSize = _c.autoSize), ("string" == typeof _c.front || _c.front instanceof a) && (this.setting.front = _c.front), ("string" == typeof _c.back || _c.back instanceof a) && (this.setting.back = _c.back), this.element = b, this.frontElement = this.getFrontElement(), this.backElement = this.getBackElement(), this.isFlipped = !1, this.init(d);
  };

  a.extend(c.prototype, {
    flipDone: function flipDone(a) {
      var c = this;
      c.element.one(b(), function () {
        c.element.trigger("flip:done"), "function" == typeof a && a.call(c.element);
      });
    },
    flip: function flip(a) {
      if (!this.isFlipped) {
        this.isFlipped = !0;
        var b = "rotate" + this.setting.axis;
        this.frontElement.css({
          transform: b + (this.setting.reverse ? "(-180deg)" : "(180deg)"),
          "z-index": "0"
        }), this.backElement.css({
          transform: b + "(0deg)",
          "z-index": "1"
        }), this.flipDone(a);
      }
    },
    unflip: function unflip(a) {
      if (this.isFlipped) {
        this.isFlipped = !1;
        var b = "rotate" + this.setting.axis;
        this.frontElement.css({
          transform: b + "(0deg)",
          "z-index": "1"
        }), this.backElement.css({
          transform: b + (this.setting.reverse ? "(180deg)" : "(-180deg)"),
          "z-index": "0"
        }), this.flipDone(a);
      }
    },
    getFrontElement: function getFrontElement() {
      return this.setting.front instanceof a ? this.setting.front : this.element.find(this.setting.front);
    },
    getBackElement: function getBackElement() {
      return this.setting.back instanceof a ? this.setting.back : this.element.find(this.setting.back);
    },
    init: function init(a) {
      var b = this,
          c = b.frontElement.add(b.backElement),
          d = "rotate" + b.setting.axis,
          e = 2 * b.element["outer" + ("rotatex" === d ? "Height" : "Width")](),
          f = {
        perspective: e,
        position: "relative"
      },
          g = {
        transform: d + "(" + (b.setting.reverse ? "180deg" : "-180deg") + ")",
        "z-index": "0",
        position: "relative"
      },
          h = {
        "backface-visibility": "hidden",
        "transform-style": "preserve-3d",
        position: "absolute",
        "z-index": "1"
      };
      b.setting.forceHeight ? c.outerHeight(b.element.height()) : b.setting.autoSize && (h.height = "100%"), b.setting.forceWidth ? c.outerWidth(b.element.width()) : b.setting.autoSize && (h.width = "100%"), (window.chrome || window.Intl && Intl.v8BreakIterator) && "CSS" in window && (f["-webkit-transform-style"] = "preserve-3d"), c.css(h).find("*").css({
        "backface-visibility": "hidden"
      }), b.element.css(f), b.backElement.css(g), setTimeout(function () {
        var d = b.setting.speed / 1e3 || .5;
        c.css({
          transition: "all " + d + "s ease-out"
        }), "function" == typeof a && a.call(b.element);
      }, 20), b.attachEvents();
    },
    clickHandler: function clickHandler(b) {
      b || (b = window.event), this.element.find(a(b.target).closest('button, a, input[type="submit"]')).length || (this.isFlipped ? this.unflip() : this.flip());
    },
    hoverHandler: function hoverHandler() {
      var b = this;
      b.element.off("mouseleave.flip"), b.flip(), setTimeout(function () {
        b.element.on("mouseleave.flip", a.proxy(b.unflip, b)), b.element.is(":hover") || b.unflip();
      }, b.setting.speed + 150);
    },
    attachEvents: function attachEvents() {
      var b = this;
      "click" === b.setting.trigger ? b.element.on(a.fn.tap ? "tap.flip" : "click.flip", a.proxy(b.clickHandler, b)) : "hover" === b.setting.trigger && (b.element.on("mouseenter.flip", a.proxy(b.hoverHandler, b)), b.element.on("mouseleave.flip", a.proxy(b.unflip, b)));
    },
    flipChanged: function flipChanged(a) {
      this.element.trigger("flip:change"), "function" == typeof a && a.call(this.element);
    },
    changeSettings: function changeSettings(a, b) {
      var c = this,
          d = !1;

      if (void 0 !== a.axis && c.setting.axis !== a.axis.toLowerCase() && (c.setting.axis = a.axis.toLowerCase(), d = !0), void 0 !== a.reverse && c.setting.reverse !== a.reverse && (c.setting.reverse = a.reverse, d = !0), d) {
        var e = c.frontElement.add(c.backElement),
            f = e.css(["transition-property", "transition-timing-function", "transition-duration", "transition-delay"]);
        e.css({
          transition: "none"
        });
        var g = "rotate" + c.setting.axis;
        c.isFlipped ? c.frontElement.css({
          transform: g + (c.setting.reverse ? "(-180deg)" : "(180deg)"),
          "z-index": "0"
        }) : c.backElement.css({
          transform: g + (c.setting.reverse ? "(180deg)" : "(-180deg)"),
          "z-index": "0"
        }), setTimeout(function () {
          e.css(f), c.flipChanged(b);
        }, 0);
      } else c.flipChanged(b);
    }
  }), a.fn.flip = function (b, d) {
    return "function" == typeof b && (d = b), "string" == typeof b || "boolean" == typeof b ? this.each(function () {
      var c = a(this).data("flip-model");
      "toggle" === b && (b = !c.isFlipped), b ? c.flip(d) : c.unflip(d);
    }) : this.each(function () {
      if (a(this).data("flip-model")) {
        var e = a(this).data("flip-model");
        !b || void 0 === b.axis && void 0 === b.reverse || e.changeSettings(b, d);
      } else a(this).data("flip-model", new c(a(this), b || {}, d));
    }), this;
  };
}(jQuery);
},{}],"../../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "36395" + '/');

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
},{}]},{},["../../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/jquery.flip.min.js"], null)
//# sourceMappingURL=/jquery.flip.min.e5424856.js.map