!(function (a, b, c) {
  function d(c, f) {
    if (!b[c]) {
      if (!a[c]) {
        var g = "function" == typeof require && require;
        if (!f && g) return g(c, !0);
        if (e) return e(c, !0);
        throw new Error("Cannot find module '" + c + "'");
      }
      var h = (b[c] = { exports: {} });
      a[c][0].call(
        h.exports,
        function (b) {
          var e = a[c][1][b];
          return d(e ? e : b);
        },
        h,
        h.exports
      );
    }
    return b[c].exports;
  }
  for (
    var e = "function" == typeof require && require, f = 0;
    f < c.length;
    f++
  )
    d(c[f]);
  return d;
})(
  {
    1: [
      function (a, b) {
        var c = (a("./pointable"), a("gl-matrix")),
          d = c.vec3,
          e = c.mat3,
          f = c.mat4,
          g =
            (a("underscore"),
            (b.exports = function (a, b) {
              (this.finger = a),
                (this._center = null),
                (this._matrix = null),
                (this.type = b.type),
                (this.prevJoint = b.prevJoint),
                (this.nextJoint = b.nextJoint),
                (this.width = b.width);
              var c = new Array(3);
              d.sub(c, b.nextJoint, b.prevJoint),
                (this.length = d.length(c)),
                (this.basis = b.basis);
            }));
        (g.prototype.left = function () {
          return this._left
            ? this._left
            : ((this._left =
                e.determinant(
                  this.basis[0].concat(this.basis[1]).concat(this.basis[2])
                ) < 0),
              this._left);
        }),
          (g.prototype.matrix = function () {
            if (this._matrix) return this._matrix;
            var a = this.basis,
              b = (this._matrix = f.create());
            return (
              (b[0] = a[0][0]),
              (b[1] = a[0][1]),
              (b[2] = a[0][2]),
              (b[4] = a[1][0]),
              (b[5] = a[1][1]),
              (b[6] = a[1][2]),
              (b[8] = a[2][0]),
              (b[9] = a[2][1]),
              (b[10] = a[2][2]),
              (b[3] = this.center()[0]),
              (b[7] = this.center()[1]),
              (b[11] = this.center()[2]),
              this.left() && ((b[0] *= -1), (b[1] *= -1), (b[2] *= -1)),
              this._matrix
            );
          }),
          (g.prototype.lerp = function (a, b) {
            d.lerp(a, this.prevJoint, this.nextJoint, b);
          }),
          (g.prototype.center = function () {
            if (this._center) return this._center;
            var a = d.create();
            return this.lerp(a, 0.5), (this._center = a), a;
          }),
          (g.prototype.direction = function () {
            return [
              -1 * this.basis[2][0],
              -1 * this.basis[2][1],
              -1 * this.basis[2][2],
            ];
          });
      },
      { "./pointable": 14, "gl-matrix": 23, underscore: 24 },
    ],
    2: [
      function (a, b) {
        var c = (b.exports = function (a) {
          (this.pos = 0), (this._buf = []), (this.size = a);
        });
        (c.prototype.get = function (a) {
          return (
            void 0 == a && (a = 0),
            a >= this.size
              ? void 0
              : a >= this._buf.length
              ? void 0
              : this._buf[(this.pos - a - 1) % this.size]
          );
        }),
          (c.prototype.push = function (a) {
            return (this._buf[this.pos % this.size] = a), this.pos++;
          });
      },
      {},
    ],
    3: [
      function (a, b) {
        var c = a("../protocol").chooseProtocol,
          d = a("events").EventEmitter,
          e = a("underscore"),
          f = (b.exports = function (a) {
            (this.opts = e.defaults(a || {}, {
              host: "127.0.0.1",
              enableGestures: !1,
              scheme: this.getScheme(),
              port: this.getPort(),
              background: !1,
              optimizeHMD: !1,
              requestProtocolVersion: f.defaultProtocolVersion,
            })),
              (this.host = this.opts.host),
              (this.port = this.opts.port),
              (this.scheme = this.opts.scheme),
              (this.protocolVersionVerified = !1),
              (this.background = null),
              (this.optimizeHMD = null),
              this.on("ready", function () {
                this.enableGestures(this.opts.enableGestures),
                  this.setBackground(this.opts.background),
                  this.setOptimizeHMD(this.opts.optimizeHMD),
                  console.log(
                    this.opts.optimizeHMD
                      ? "Optimized for head mounted display usage."
                      : "Optimized for desktop usage."
                  );
              });
          });
        (f.defaultProtocolVersion = 6),
          (f.prototype.getUrl = function () {
            return (
              this.scheme +
              "//" +
              this.host +
              ":" +
              this.port +
              "/v" +
              this.opts.requestProtocolVersion +
              ".json"
            );
          }),
          (f.prototype.getScheme = function () {
            return "ws:";
          }),
          (f.prototype.getPort = function () {
            return 6437;
          }),
          (f.prototype.setBackground = function (a) {
            (this.opts.background = a),
              this.protocol &&
                this.protocol.sendBackground &&
                this.background !== this.opts.background &&
                ((this.background = this.opts.background),
                this.protocol.sendBackground(this, this.opts.background));
          }),
          (f.prototype.setOptimizeHMD = function (a) {
            (this.opts.optimizeHMD = a),
              this.protocol &&
                this.protocol.sendOptimizeHMD &&
                this.optimizeHMD !== this.opts.optimizeHMD &&
                ((this.optimizeHMD = this.opts.optimizeHMD),
                this.protocol.sendOptimizeHMD(this, this.opts.optimizeHMD));
          }),
          (f.prototype.handleOpen = function () {
            this.connected || ((this.connected = !0), this.emit("connect"));
          }),
          (f.prototype.enableGestures = function (a) {
            (this.gesturesEnabled = a ? !0 : !1),
              this.send(
                this.protocol.encode({ enableGestures: this.gesturesEnabled })
              );
          }),
          (f.prototype.handleClose = function (a) {
            this.connected &&
              (this.disconnect(),
              1001 === a &&
                this.opts.requestProtocolVersion > 1 &&
                (this.protocolVersionVerified
                  ? (this.protocolVersionVerified = !1)
                  : this.opts.requestProtocolVersion--),
              this.startReconnection());
          }),
          (f.prototype.startReconnection = function () {
            var a = this;
            this.reconnectionTimer ||
              (this.reconnectionTimer = setInterval(function () {
                a.reconnect();
              }, 500));
          }),
          (f.prototype.stopReconnection = function () {
            this.reconnectionTimer = clearInterval(this.reconnectionTimer);
          }),
          (f.prototype.disconnect = function (a) {
            return (
              a || this.stopReconnection(),
              this.socket
                ? (this.socket.close(),
                  delete this.socket,
                  delete this.protocol,
                  delete this.background,
                  delete this.optimizeHMD,
                  delete this.focusedState,
                  this.connected &&
                    ((this.connected = !1), this.emit("disconnect")),
                  !0)
                : void 0
            );
          }),
          (f.prototype.reconnect = function () {
            this.connected
              ? this.stopReconnection()
              : (this.disconnect(!0), this.connect());
          }),
          (f.prototype.handleData = function (a) {
            var b,
              d = JSON.parse(a);
            void 0 === this.protocol
              ? ((b = this.protocol = c(d)),
                (this.protocolVersionVerified = !0),
                this.emit("ready"))
              : (b = this.protocol(d)),
              this.emit(b.type, b);
          }),
          (f.prototype.connect = function () {
            return this.socket
              ? void 0
              : ((this.socket = this.setupSocket()), !0);
          }),
          (f.prototype.send = function (a) {
            this.socket.send(a);
          }),
          (f.prototype.reportFocus = function (a) {
            this.connected &&
              this.focusedState !== a &&
              ((this.focusedState = a),
              this.emit(this.focusedState ? "focus" : "blur"),
              this.protocol &&
                this.protocol.sendFocused &&
                this.protocol.sendFocused(this, this.focusedState));
          }),
          e.extend(f.prototype, d.prototype);
      },
      { "../protocol": 15, events: 21, underscore: 24 },
    ],
    4: [
      function (a, b) {
        var c = (b.exports = a("./base")),
          d = a("underscore"),
          e = (b.exports = function (a) {
            c.call(this, a);
            var b = this;
            this.on("ready", function () {
              b.startFocusLoop();
            }),
              this.on("disconnect", function () {
                b.stopFocusLoop();
              });
          });
        d.extend(e.prototype, c.prototype),
          (e.__proto__ = c),
          (e.prototype.useSecure = function () {
            return "https:" === location.protocol;
          }),
          (e.prototype.getScheme = function () {
            return this.useSecure() ? "wss:" : "ws:";
          }),
          (e.prototype.getPort = function () {
            return this.useSecure() ? 6436 : 6437;
          }),
          (e.prototype.setupSocket = function () {
            var a = this,
              b = new WebSocket(this.getUrl());
            return (
              (b.onopen = function () {
                a.handleOpen();
              }),
              (b.onclose = function (b) {
                a.handleClose(b.code, b.reason);
              }),
              (b.onmessage = function (b) {
                a.handleData(b.data);
              }),
              (b.onerror = function () {
                a.useSecure() &&
                  "wss:" === a.scheme &&
                  ((a.scheme = "ws:"),
                  (a.port = 6437),
                  a.disconnect(),
                  a.connect());
              }),
              b
            );
          }),
          (e.prototype.startFocusLoop = function () {
            if (!this.focusDetectorTimer) {
              var a = this,
                b = null;
              (b =
                "undefined" != typeof document.hidden
                  ? "hidden"
                  : "undefined" != typeof document.mozHidden
                  ? "mozHidden"
                  : "undefined" != typeof document.msHidden
                  ? "msHidden"
                  : "undefined" != typeof document.webkitHidden
                  ? "webkitHidden"
                  : void 0),
                void 0 === a.windowVisible &&
                  (a.windowVisible = void 0 === b ? !0 : document[b] === !1);
              var c = window.addEventListener("focus", function () {
                  (a.windowVisible = !0), e();
                }),
                d = window.addEventListener("blur", function () {
                  (a.windowVisible = !1), e();
                });
              this.on("disconnect", function () {
                window.removeEventListener("focus", c),
                  window.removeEventListener("blur", d);
              });
              var e = function () {
                var c = void 0 === b ? !0 : document[b] === !1;
                a.reportFocus(c && a.windowVisible);
              };
              e(), (this.focusDetectorTimer = setInterval(e, 100));
            }
          }),
          (e.prototype.stopFocusLoop = function () {
            this.focusDetectorTimer &&
              (clearTimeout(this.focusDetectorTimer),
              delete this.focusDetectorTimer);
          });
      },
      { "./base": 3, underscore: 24 },
    ],
    5: [
      function (a, b) {
        var c = a("__browserify_process"),
          d = a("./frame"),
          e = a("./hand"),
          f = a("./pointable"),
          g = a("./finger"),
          h = a("./circular_buffer"),
          i = a("./pipeline"),
          j = a("events").EventEmitter,
          k = a("./gesture").gestureListener,
          l = a("./dialog"),
          m = a("underscore"),
          n = (b.exports = function (b) {
            var e = "undefined" != typeof c && c.versions && c.versions.node,
              f = this;
            (b = m.defaults(b || {}, { inNode: e })),
              (this.inNode = b.inNode),
              (b = m.defaults(b || {}, {
                frameEventName: this.useAnimationLoop()
                  ? "animationFrame"
                  : "deviceFrame",
                suppressAnimationLoop: !this.useAnimationLoop(),
                loopWhileDisconnected: !1,
                useAllPlugins: !1,
                checkVersion: !0,
              })),
              (this.animationFrameRequested = !1),
              (this.onAnimationFrame = function () {
                f.emit("animationFrame", f.lastConnectionFrame),
                  f.loopWhileDisconnected &&
                  (f.connection.focusedState || f.connection.opts.background)
                    ? window.requestAnimationFrame(f.onAnimationFrame)
                    : (f.animationFrameRequested = !1);
              }),
              (this.suppressAnimationLoop = b.suppressAnimationLoop),
              (this.loopWhileDisconnected = b.loopWhileDisconnected),
              (this.frameEventName = b.frameEventName),
              (this.useAllPlugins = b.useAllPlugins),
              (this.history = new h(200)),
              (this.lastFrame = d.Invalid),
              (this.lastValidFrame = d.Invalid),
              (this.lastConnectionFrame = d.Invalid),
              (this.accumulatedGestures = []),
              (this.checkVersion = b.checkVersion),
              (this.connectionType =
                void 0 === b.connectionType
                  ? a(
                      this.inBrowser()
                        ? "./connection/browser"
                        : "./connection/node"
                    )
                  : b.connectionType),
              (this.connection = new this.connectionType(b)),
              (this.streamingCount = 0),
              (this.devices = {}),
              (this.plugins = {}),
              (this._pluginPipelineSteps = {}),
              (this._pluginExtendedMethods = {}),
              b.useAllPlugins && this.useRegisteredPlugins(),
              this.setupFrameEvents(b),
              this.setupConnectionEvents();
          });
        (n.prototype.gesture = function (a, b) {
          var c = k(this, a);
          return void 0 !== b && c.stop(b), c;
        }),
          (n.prototype.setBackground = function (a) {
            return this.connection.setBackground(a), this;
          }),
          (n.prototype.setOptimizeHMD = function (a) {
            return this.connection.setOptimizeHMD(a), this;
          }),
          (n.prototype.inBrowser = function () {
            return !this.inNode;
          }),
          (n.prototype.useAnimationLoop = function () {
            return this.inBrowser() && !this.inBackgroundPage();
          }),
          (n.prototype.inBackgroundPage = function () {
            return (
              "undefined" != typeof chrome &&
              chrome.extension &&
              chrome.extension.getBackgroundPage &&
              chrome.extension.getBackgroundPage() === window
            );
          }),
          (n.prototype.connect = function () {
            return this.connection.connect(), this;
          }),
          (n.prototype.streaming = function () {
            return this.streamingCount > 0;
          }),
          (n.prototype.connected = function () {
            return !!this.connection.connected;
          }),
          (n.prototype.runAnimationLoop = function () {
            this.suppressAnimationLoop ||
              this.animationFrameRequested ||
              ((this.animationFrameRequested = !0),
              window.requestAnimationFrame(this.onAnimationFrame));
          }),
          (n.prototype.disconnect = function () {
            return this.connection.disconnect(), this;
          }),
          (n.prototype.frame = function (a) {
            return this.history.get(a) || d.Invalid;
          }),
          (n.prototype.loop = function (a) {
            return (
              a &&
                ("function" == typeof a
                  ? this.on(this.frameEventName, a)
                  : this.setupFrameEvents(a)),
              this.connect()
            );
          }),
          (n.prototype.addStep = function (a) {
            this.pipeline || (this.pipeline = new i(this)),
              this.pipeline.addStep(a);
          }),
          (n.prototype.processFrame = function (a) {
            a.gestures &&
              (this.accumulatedGestures = this.accumulatedGestures.concat(
                a.gestures
              )),
              (this.lastConnectionFrame = a),
              this.runAnimationLoop(),
              this.emit("deviceFrame", a);
          }),
          (n.prototype.processFinishedFrame = function (a) {
            if (
              ((this.lastFrame = a),
              a.valid && (this.lastValidFrame = a),
              (a.controller = this),
              (a.historyIdx = this.history.push(a)),
              a.gestures)
            ) {
              (a.gestures = this.accumulatedGestures),
                (this.accumulatedGestures = []);
              for (var b = 0; b != a.gestures.length; b++)
                this.emit("gesture", a.gestures[b], a);
            }
            this.pipeline && ((a = this.pipeline.run(a)), a || (a = d.Invalid)),
              this.emit("frame", a),
              this.emitHandEvents(a);
          }),
          (n.prototype.emitHandEvents = function (a) {
            for (var b = 0; b < a.hands.length; b++)
              this.emit("hand", a.hands[b]);
          }),
          (n.prototype.setupFrameEvents = function (a) {
            a.frame && this.on("frame", a.frame),
              a.hand && this.on("hand", a.hand);
          }),
          (n.prototype.setupConnectionEvents = function () {
            var a = this;
            this.connection.on("frame", function (b) {
              a.processFrame(b);
            }),
              this.on(this.frameEventName, function (b) {
                a.processFinishedFrame(b);
              });
            var b = function () {
                if (
                  a.connection.opts.requestProtocolVersion < 5 &&
                  0 == a.streamingCount
                ) {
                  a.streamingCount = 1;
                  var c = {
                    attached: !0,
                    streaming: !0,
                    type: "unknown",
                    id: "Lx00000000000",
                  };
                  (a.devices[c.id] = c),
                    a.emit("deviceAttached", c),
                    a.emit("deviceStreaming", c),
                    a.emit("streamingStarted", c),
                    a.connection.removeListener("frame", b);
                }
              },
              c = function () {
                if (a.streamingCount > 0) {
                  for (var b in a.devices)
                    a.emit("deviceStopped", a.devices[b]),
                      a.emit("deviceRemoved", a.devices[b]);
                  a.emit("streamingStopped", a.devices[b]),
                    (a.streamingCount = 0);
                  for (var b in a.devices) delete a.devices[b];
                }
              };
            this.connection.on("focus", function () {
              a.emit("focus");
            }),
              this.connection.on("blur", function () {
                a.emit("blur");
              }),
              this.connection.on("protocol", function (b) {
                b.on("beforeFrameCreated", function (b) {
                  a.emit("beforeFrameCreated", b);
                }),
                  b.on("afterFrameCreated", function (b, c) {
                    a.emit("afterFrameCreated", b, c);
                  }),
                  a.emit("protocol", b);
              }),
              this.connection.on("ready", function () {
                a.checkVersion && !a.inNode && a.checkOutOfDate(),
                  a.emit("ready");
              }),
              this.connection.on("connect", function () {
                a.emit("connect"),
                  a.connection.removeListener("frame", b),
                  a.connection.on("frame", b);
              }),
              this.connection.on("disconnect", function () {
                a.emit("disconnect"), c();
              }),
              this.connection.on("deviceConnect", function (d) {
                d.state
                  ? (a.emit("deviceConnected"),
                    a.connection.removeListener("frame", b),
                    a.connection.on("frame", b))
                  : (a.emit("deviceDisconnected"), c());
              }),
              this.connection.on("deviceEvent", function (b) {
                var c = b.state,
                  d = a.devices[c.id],
                  e = {};
                for (var f in c)
                  (d && d.hasOwnProperty(f) && d[f] == c[f]) || (e[f] = !0);
                (a.devices[c.id] = c),
                  e.attached &&
                    a.emit(c.attached ? "deviceAttached" : "deviceRemoved", c),
                  e.streaming &&
                    (c.streaming
                      ? (a.streamingCount++,
                        a.emit("deviceStreaming", c),
                        1 == a.streamingCount && a.emit("streamingStarted", c),
                        e.attached || a.emit("deviceConnected"))
                      : (e.attached && c.attached) ||
                        (a.streamingCount--,
                        a.emit("deviceStopped", c),
                        0 == a.streamingCount && a.emit("streamingStopped", c),
                        a.emit("deviceDisconnected")));
              }),
              this.on("newListener", function (a) {
                ("deviceConnected" == a || "deviceDisconnected" == a) &&
                  console.warn(
                    a +
                      " events are depricated.  Consider using 'streamingStarted/streamingStopped' or 'deviceStreaming/deviceStopped' instead"
                  );
              });
          }),
          (n.prototype.checkOutOfDate = function () {
            console.assert(this.connection && this.connection.protocol);
            var a = this.connection.protocol.serviceVersion,
              b = this.connection.protocol.version,
              c = this.connectionType.defaultProtocolVersion;
            return c > b
              ? (console.warn(
                  "Your Protocol Version is v" +
                    b +
                    ", this app was designed for v" +
                    c
                ),
                l.warnOutOfDate({ sV: a, pV: b }),
                !0)
              : !1;
          }),
          (n._pluginFactories = {}),
          (n.plugin = function (a, b) {
            return (
              this._pluginFactories[a] &&
                console.warn('Plugin "' + a + '" already registered'),
              (this._pluginFactories[a] = b)
            );
          }),
          (n.plugins = function () {
            return m.keys(this._pluginFactories);
          });
        var o = function (a, b, c) {
            -1 != ["beforeFrameCreated", "afterFrameCreated"].indexOf(b)
              ? this.on(b, c)
              : (this.pipeline || (this.pipeline = new i(this)),
                this._pluginPipelineSteps[a] ||
                  (this._pluginPipelineSteps[a] = []),
                this._pluginPipelineSteps[a].push(
                  this.pipeline.addWrappedStep(b, c)
                ));
          },
          p = function (a, b, c) {
            var h;
            switch (
              (this._pluginExtendedMethods[a] ||
                (this._pluginExtendedMethods[a] = []),
              b)
            ) {
              case "frame":
                h = d;
                break;
              case "hand":
                h = e;
                break;
              case "pointable":
                (h = f), m.extend(g.prototype, c), m.extend(g.Invalid, c);
                break;
              case "finger":
                h = g;
                break;
              default:
                throw (
                  a +
                  ' specifies invalid object type "' +
                  b +
                  '" for prototypical extension'
                );
            }
            m.extend(h.prototype, c),
              m.extend(h.Invalid, c),
              this._pluginExtendedMethods[a].push([h, c]);
          };
        (n.prototype.use = function (a, b) {
          var c, d, e, f;
          if (((d = "function" == typeof a ? a : n._pluginFactories[a]), !d))
            throw "Leap Plugin " + a + " not found.";
          if ((b || (b = {}), this.plugins[a]))
            return m.extend(this.plugins[a], b), this;
          (this.plugins[a] = b), (f = d.call(this, b));
          for (e in f)
            (c = f[e]),
              "function" == typeof c
                ? o.call(this, a, e, c)
                : p.call(this, a, e, c);
          return this;
        }),
          (n.prototype.stopUsing = function (a) {
            var b,
              c,
              d = this._pluginPipelineSteps[a],
              e = this._pluginExtendedMethods[a],
              f = 0;
            if (this.plugins[a]) {
              if (d)
                for (f = 0; f < d.length; f++) this.pipeline.removeStep(d[f]);
              if (e)
                for (f = 0; f < e.length; f++) {
                  (b = e[f][0]), (c = e[f][1]);
                  for (var g in c) delete b.prototype[g], delete b.Invalid[g];
                }
              return delete this.plugins[a], this;
            }
          }),
          (n.prototype.useRegisteredPlugins = function () {
            for (var a in n._pluginFactories) this.use(a);
          }),
          m.extend(n.prototype, j.prototype);
      },
      {
        "./circular_buffer": 2,
        "./connection/browser": 4,
        "./connection/node": 20,
        "./dialog": 6,
        "./finger": 7,
        "./frame": 8,
        "./gesture": 9,
        "./hand": 10,
        "./pipeline": 13,
        "./pointable": 14,
        __browserify_process: 22,
        events: 21,
        underscore: 24,
      },
    ],
    6: [
      function (a, b) {
        var c = a("__browserify_process"),
          d = (b.exports = function (a, b) {
            (this.options = b || {}), (this.message = a), this.createElement();
          });
        (d.prototype.createElement = function () {
          (this.element = document.createElement("div")),
            (this.element.className = "leapjs-dialog"),
            (this.element.style.position = "fixed"),
            (this.element.style.top = "8px"),
            (this.element.style.left = 0),
            (this.element.style.right = 0),
            (this.element.style.textAlign = "center"),
            (this.element.style.zIndex = 1e3);
          var a = document.createElement("div");
          this.element.appendChild(a),
            (a.style.className = "leapjs-dialog"),
            (a.style.display = "inline-block"),
            (a.style.margin = "auto"),
            (a.style.padding = "8px"),
            (a.style.color = "#222"),
            (a.style.background = "#eee"),
            (a.style.borderRadius = "4px"),
            (a.style.border = "1px solid #999"),
            (a.style.textAlign = "left"),
            (a.style.cursor = "pointer"),
            (a.style.whiteSpace = "nowrap"),
            (a.style.transition = "box-shadow 1s linear"),
            (a.innerHTML = this.message),
            this.options.onclick &&
              a.addEventListener("click", this.options.onclick),
            this.options.onmouseover &&
              a.addEventListener("mouseover", this.options.onmouseover),
            this.options.onmouseout &&
              a.addEventListener("mouseout", this.options.onmouseout),
            this.options.onmousemove &&
              a.addEventListener("mousemove", this.options.onmousemove);
        }),
          (d.prototype.show = function () {
            return document.body.appendChild(this.element), this;
          }),
          (d.prototype.hide = function () {
            return document.body.removeChild(this.element), this;
          }),
          (d.warnOutOfDate = function (a) {
            a || (a = {});
            var b = "http://developer.leapmotion.com?";
            a.returnTo = window.location.href;
            for (var c in a) b += c + "=" + encodeURIComponent(a[c]) + "&";
            var e,
              f = function (a) {
                if ("leapjs-decline-upgrade" != a.target.id) {
                  var c = window.open(
                    b,
                    "_blank",
                    "height=800,width=1000,location=1,menubar=1,resizable=1,status=1,toolbar=1,scrollbars=1"
                  );
                  window.focus && c.focus();
                }
                return e.hide(), !0;
              },
              g =
                "This site requires Leap Motion Tracking V2.<button id='leapjs-accept-upgrade'  style='color: #444; transition: box-shadow 100ms linear; cursor: pointer; vertical-align: baseline; margin-left: 16px;'>Upgrade</button><button id='leapjs-decline-upgrade' style='color: #444; transition: box-shadow 100ms linear; cursor: pointer; vertical-align: baseline; margin-left: 8px; '>Not Now</button>";
            return (
              (e = new d(g, {
                onclick: f,
                onmousemove: function (a) {
                  a.target == document.getElementById("leapjs-decline-upgrade")
                    ? ((document.getElementById(
                        "leapjs-decline-upgrade"
                      ).style.color = "#000"),
                      (document.getElementById(
                        "leapjs-decline-upgrade"
                      ).style.boxShadow = "0px 0px 2px #5daa00"),
                      (document.getElementById(
                        "leapjs-accept-upgrade"
                      ).style.color = "#444"),
                      (document.getElementById(
                        "leapjs-accept-upgrade"
                      ).style.boxShadow = "none"))
                    : ((document.getElementById(
                        "leapjs-accept-upgrade"
                      ).style.color = "#000"),
                      (document.getElementById(
                        "leapjs-accept-upgrade"
                      ).style.boxShadow = "0px 0px 2px #5daa00"),
                      (document.getElementById(
                        "leapjs-decline-upgrade"
                      ).style.color = "#444"),
                      (document.getElementById(
                        "leapjs-decline-upgrade"
                      ).style.boxShadow = "none"));
                },
                onmouseout: function () {
                  (document.getElementById(
                    "leapjs-decline-upgrade"
                  ).style.color = "#444"),
                    (document.getElementById(
                      "leapjs-decline-upgrade"
                    ).style.boxShadow = "none"),
                    (document.getElementById(
                      "leapjs-accept-upgrade"
                    ).style.color = "#444"),
                    (document.getElementById(
                      "leapjs-accept-upgrade"
                    ).style.boxShadow = "none");
                },
              })),
              e.show()
            );
          }),
          (d.hasWarnedBones = !1),
          (d.warnBones = function () {
            this.hasWarnedBones ||
              ((this.hasWarnedBones = !0),
              console.warn("Your Leap Service is out of date"),
              ("undefined" != typeof c && c.versions && c.versions.node) ||
                this.warnOutOfDate({ reason: "bones" }));
          });
      },
      { __browserify_process: 22 },
    ],
    7: [
      function (a, b) {
        var c = a("./pointable"),
          d = a("./bone"),
          e = a("./dialog"),
          f = a("underscore"),
          g = (b.exports = function (a) {
            c.call(this, a),
              (this.dipPosition = a.dipPosition),
              (this.pipPosition = a.pipPosition),
              (this.mcpPosition = a.mcpPosition),
              (this.carpPosition = a.carpPosition),
              (this.extended = a.extended),
              (this.type = a.type),
              (this.finger = !0),
              (this.positions = [
                this.carpPosition,
                this.mcpPosition,
                this.pipPosition,
                this.dipPosition,
                this.tipPosition,
              ]),
              a.bases ? this.addBones(a) : e.warnBones();
          });
        f.extend(g.prototype, c.prototype),
          (g.prototype.addBones = function (a) {
            (this.metacarpal = new d(this, {
              type: 0,
              width: this.width,
              prevJoint: this.carpPosition,
              nextJoint: this.mcpPosition,
              basis: a.bases[0],
            })),
              (this.proximal = new d(this, {
                type: 1,
                width: this.width,
                prevJoint: this.mcpPosition,
                nextJoint: this.pipPosition,
                basis: a.bases[1],
              })),
              (this.medial = new d(this, {
                type: 2,
                width: this.width,
                prevJoint: this.pipPosition,
                nextJoint: this.dipPosition,
                basis: a.bases[2],
              })),
              (this.distal = new d(this, {
                type: 3,
                width: this.width,
                prevJoint: this.dipPosition,
                nextJoint: a.btipPosition,
                basis: a.bases[3],
              })),
              (this.bones = [
                this.metacarpal,
                this.proximal,
                this.medial,
                this.distal,
              ]);
          }),
          (g.prototype.toString = function () {
            return (
              "Finger [ id:" +
              this.id +
              " " +
              this.length +
              "mmx | width:" +
              this.width +
              "mm | direction:" +
              this.direction +
              " ]"
            );
          }),
          (g.Invalid = { valid: !1 });
      },
      { "./bone": 1, "./dialog": 6, "./pointable": 14, underscore: 24 },
    ],
    8: [
      function (a, b) {
        var c = a("./hand"),
          d = a("./pointable"),
          e = a("./gesture").createGesture,
          f = a("gl-matrix"),
          g = f.mat3,
          h = f.vec3,
          i = a("./interaction_box"),
          j = a("./finger"),
          k = a("underscore"),
          l = (b.exports = function (a) {
            if (
              ((this.valid = !0),
              (this.id = a.id),
              (this.timestamp = a.timestamp),
              (this.hands = []),
              (this.handsMap = {}),
              (this.pointables = []),
              (this.tools = []),
              (this.fingers = []),
              a.interactionBox &&
                (this.interactionBox = new i(a.interactionBox)),
              (this.gestures = []),
              (this.pointablesMap = {}),
              (this._translation = a.t),
              (this._rotation = k.flatten(a.r)),
              (this._scaleFactor = a.s),
              (this.data = a),
              (this.type = "frame"),
              (this.currentFrameRate = a.currentFrameRate),
              a.gestures)
            )
              for (var b = 0, c = a.gestures.length; b != c; b++)
                this.gestures.push(e(a.gestures[b]));
            this.postprocessData(a);
          });
        (l.prototype.postprocessData = function (a) {
          a || (a = this.data);
          for (var b = 0, e = a.hands.length; b != e; b++) {
            var f = new c(a.hands[b]);
            (f.frame = this), this.hands.push(f), (this.handsMap[f.id] = f);
          }
          a.pointables = k.sortBy(a.pointables, function (a) {
            return a.id;
          });
          for (var g = 0, h = a.pointables.length; g != h; g++) {
            var i = a.pointables[g],
              l = i.dipPosition ? new j(i) : new d(i);
            (l.frame = this), this.addPointable(l);
          }
        }),
          (l.prototype.addPointable = function (a) {
            if (
              (this.pointables.push(a),
              (this.pointablesMap[a.id] = a),
              (a.tool ? this.tools : this.fingers).push(a),
              void 0 !== a.handId && this.handsMap.hasOwnProperty(a.handId))
            ) {
              var b = this.handsMap[a.handId];
              switch (
                (b.pointables.push(a),
                (a.tool ? b.tools : b.fingers).push(a),
                a.type)
              ) {
                case 0:
                  b.thumb = a;
                  break;
                case 1:
                  b.indexFinger = a;
                  break;
                case 2:
                  b.middleFinger = a;
                  break;
                case 3:
                  b.ringFinger = a;
                  break;
                case 4:
                  b.pinky = a;
              }
            }
          }),
          (l.prototype.tool = function (a) {
            var b = this.pointable(a);
            return b.tool ? b : d.Invalid;
          }),
          (l.prototype.pointable = function (a) {
            return this.pointablesMap[a] || d.Invalid;
          }),
          (l.prototype.finger = function (a) {
            var b = this.pointable(a);
            return b.tool ? d.Invalid : b;
          }),
          (l.prototype.hand = function (a) {
            return this.handsMap[a] || c.Invalid;
          }),
          (l.prototype.rotationAngle = function (a, b) {
            if (!this.valid || !a.valid) return 0;
            var c = this.rotationMatrix(a),
              d = 0.5 * (c[0] + c[4] + c[8] - 1),
              e = Math.acos(d);
            if (((e = isNaN(e) ? 0 : e), void 0 !== b)) {
              var f = this.rotationAxis(a);
              e *= h.dot(f, h.normalize(h.create(), b));
            }
            return e;
          }),
          (l.prototype.rotationAxis = function (a) {
            return this.valid && a.valid
              ? h.normalize(h.create(), [
                  this._rotation[7] - a._rotation[5],
                  this._rotation[2] - a._rotation[6],
                  this._rotation[3] - a._rotation[1],
                ])
              : h.create();
          }),
          (l.prototype.rotationMatrix = function (a) {
            if (!this.valid || !a.valid) return g.create();
            var b = g.transpose(g.create(), this._rotation);
            return g.multiply(g.create(), a._rotation, b);
          }),
          (l.prototype.scaleFactor = function (a) {
            return this.valid && a.valid
              ? Math.exp(this._scaleFactor - a._scaleFactor)
              : 1;
          }),
          (l.prototype.translation = function (a) {
            return this.valid && a.valid
              ? h.subtract(h.create(), this._translation, a._translation)
              : h.create();
          }),
          (l.prototype.toString = function () {
            var a =
              "Frame [ id:" +
              this.id +
              " | timestamp:" +
              this.timestamp +
              " | Hand count:(" +
              this.hands.length +
              ") | Pointable count:(" +
              this.pointables.length +
              ")";
            return (
              this.gestures &&
                (a += " | Gesture count:(" + this.gestures.length + ")"),
              (a += " ]")
            );
          }),
          (l.prototype.dump = function () {
            var a = "";
            (a += "Frame Info:<br/>"),
              (a += this.toString()),
              (a += "<br/><br/>Hands:<br/>");
            for (var b = 0, c = this.hands.length; b != c; b++)
              a += "  " + this.hands[b].toString() + "<br/>";
            a += "<br/><br/>Pointables:<br/>";
            for (var d = 0, e = this.pointables.length; d != e; d++)
              a += "  " + this.pointables[d].toString() + "<br/>";
            if (this.gestures) {
              a += "<br/><br/>Gestures:<br/>";
              for (var f = 0, g = this.gestures.length; f != g; f++)
                a += "  " + this.gestures[f].toString() + "<br/>";
            }
            return (
              (a += "<br/><br/>Raw JSON:<br/>"),
              (a += JSON.stringify(this.data))
            );
          }),
          (l.Invalid = {
            valid: !1,
            hands: [],
            fingers: [],
            tools: [],
            gestures: [],
            pointables: [],
            pointable: function () {
              return d.Invalid;
            },
            finger: function () {
              return d.Invalid;
            },
            hand: function () {
              return c.Invalid;
            },
            toString: function () {
              return "invalid frame";
            },
            dump: function () {
              return this.toString();
            },
            rotationAngle: function () {
              return 0;
            },
            rotationMatrix: function () {
              return g.create();
            },
            rotationAxis: function () {
              return h.create();
            },
            scaleFactor: function () {
              return 1;
            },
            translation: function () {
              return h.create();
            },
          });
      },
      {
        "./finger": 7,
        "./gesture": 9,
        "./hand": 10,
        "./interaction_box": 12,
        "./pointable": 14,
        "gl-matrix": 23,
        underscore: 24,
      },
    ],
    9: [
      function (a, b, c) {
        var d = a("gl-matrix"),
          e = d.vec3,
          f = a("events").EventEmitter,
          g = a("underscore"),
          h =
            ((c.createGesture = function (a) {
              var b;
              switch (a.type) {
                case "circle":
                  b = new i(a);
                  break;
                case "swipe":
                  b = new j(a);
                  break;
                case "screenTap":
                  b = new k(a);
                  break;
                case "keyTap":
                  b = new l(a);
                  break;
                default:
                  throw "unknown gesture type";
              }
              return (
                (b.id = a.id),
                (b.handIds = a.handIds.slice()),
                (b.pointableIds = a.pointableIds.slice()),
                (b.duration = a.duration),
                (b.state = a.state),
                (b.type = a.type),
                b
              );
            }),
            (c.gestureListener = function (a, b) {
              var c = {},
                d = {};
              a.on("gesture", function (a, e) {
                if (a.type == b) {
                  if (
                    ("start" == a.state || "stop" == a.state) &&
                    void 0 === d[a.id]
                  ) {
                    var f = new h(a, e);
                    (d[a.id] = f),
                      g.each(c, function (a, b) {
                        f.on(b, a);
                      });
                  }
                  d[a.id].update(a, e), "stop" == a.state && delete d[a.id];
                }
              });
              var e = {
                start: function (a) {
                  return (c.start = a), e;
                },
                stop: function (a) {
                  return (c.stop = a), e;
                },
                complete: function (a) {
                  return (c.stop = a), e;
                },
                update: function (a) {
                  return (c.update = a), e;
                },
              };
              return e;
            }),
            (c.Gesture = function (a, b) {
              (this.gestures = [a]), (this.frames = [b]);
            }));
        (h.prototype.update = function (a, b) {
          (this.lastGesture = a),
            (this.lastFrame = b),
            this.gestures.push(a),
            this.frames.push(b),
            this.emit(a.state, this);
        }),
          (h.prototype.translation = function () {
            return e.subtract(
              e.create(),
              this.lastGesture.startPosition,
              this.lastGesture.position
            );
          }),
          g.extend(h.prototype, f.prototype);
        var i = function (a) {
          (this.center = a.center),
            (this.normal = a.normal),
            (this.progress = a.progress),
            (this.radius = a.radius);
        };
        i.prototype.toString = function () {
          return "CircleGesture [" + JSON.stringify(this) + "]";
        };
        var j = function (a) {
          (this.startPosition = a.startPosition),
            (this.position = a.position),
            (this.direction = a.direction),
            (this.speed = a.speed);
        };
        j.prototype.toString = function () {
          return "SwipeGesture [" + JSON.stringify(this) + "]";
        };
        var k = function (a) {
          (this.position = a.position),
            (this.direction = a.direction),
            (this.progress = a.progress);
        };
        k.prototype.toString = function () {
          return "ScreenTapGesture [" + JSON.stringify(this) + "]";
        };
        var l = function (a) {
          (this.position = a.position),
            (this.direction = a.direction),
            (this.progress = a.progress);
        };
        l.prototype.toString = function () {
          return "KeyTapGesture [" + JSON.stringify(this) + "]";
        };
      },
      { events: 21, "gl-matrix": 23, underscore: 24 },
    ],
    10: [
      function (a, b) {
        var c = a("./pointable"),
          d = a("./bone"),
          e = a("gl-matrix"),
          f = e.mat3,
          g = e.vec3,
          h = a("underscore"),
          i = (b.exports = function (a) {
            (this.id = a.id),
              (this.palmPosition = a.palmPosition),
              (this.direction = a.direction),
              (this.palmVelocity = a.palmVelocity),
              (this.palmNormal = a.palmNormal),
              (this.sphereCenter = a.sphereCenter),
              (this.sphereRadius = a.sphereRadius),
              (this.valid = !0),
              (this.pointables = []),
              (this.fingers = []),
              (this.arm = a.armBasis
                ? new d(this, {
                    type: 4,
                    width: a.armWidth,
                    prevJoint: a.elbow,
                    nextJoint: a.wrist,
                    basis: a.armBasis,
                  })
                : null),
              (this.tools = []),
              (this._translation = a.t),
              (this._rotation = h.flatten(a.r)),
              (this._scaleFactor = a.s),
              (this.timeVisible = a.timeVisible),
              (this.stabilizedPalmPosition = a.stabilizedPalmPosition),
              (this.type = a.type),
              (this.grabStrength = a.grabStrength),
              (this.pinchStrength = a.pinchStrength),
              (this.confidence = a.confidence);
          });
        (i.prototype.finger = function (a) {
          var b = this.frame.finger(a);
          return b && b.handId == this.id ? b : c.Invalid;
        }),
          (i.prototype.rotationAngle = function (a, b) {
            if (!this.valid || !a.valid) return 0;
            var c = a.hand(this.id);
            if (!c.valid) return 0;
            var d = this.rotationMatrix(a),
              e = 0.5 * (d[0] + d[4] + d[8] - 1),
              f = Math.acos(e);
            if (((f = isNaN(f) ? 0 : f), void 0 !== b)) {
              var h = this.rotationAxis(a);
              f *= g.dot(h, g.normalize(g.create(), b));
            }
            return f;
          }),
          (i.prototype.rotationAxis = function (a) {
            if (!this.valid || !a.valid) return g.create();
            var b = a.hand(this.id);
            return b.valid
              ? g.normalize(g.create(), [
                  this._rotation[7] - b._rotation[5],
                  this._rotation[2] - b._rotation[6],
                  this._rotation[3] - b._rotation[1],
                ])
              : g.create();
          }),
          (i.prototype.rotationMatrix = function (a) {
            if (!this.valid || !a.valid) return f.create();
            var b = a.hand(this.id);
            if (!b.valid) return f.create();
            var c = f.transpose(f.create(), this._rotation),
              d = f.multiply(f.create(), b._rotation, c);
            return d;
          }),
          (i.prototype.scaleFactor = function (a) {
            if (!this.valid || !a.valid) return 1;
            var b = a.hand(this.id);
            return b.valid ? Math.exp(this._scaleFactor - b._scaleFactor) : 1;
          }),
          (i.prototype.translation = function (a) {
            if (!this.valid || !a.valid) return g.create();
            var b = a.hand(this.id);
            return b.valid
              ? [
                  this._translation[0] - b._translation[0],
                  this._translation[1] - b._translation[1],
                  this._translation[2] - b._translation[2],
                ]
              : g.create();
          }),
          (i.prototype.toString = function () {
            return (
              "Hand (" +
              this.type +
              ") [ id: " +
              this.id +
              " | palm velocity:" +
              this.palmVelocity +
              " | sphere center:" +
              this.sphereCenter +
              " ] "
            );
          }),
          (i.prototype.pitch = function () {
            return Math.atan2(this.direction[1], -this.direction[2]);
          }),
          (i.prototype.yaw = function () {
            return Math.atan2(this.direction[0], -this.direction[2]);
          }),
          (i.prototype.roll = function () {
            return Math.atan2(this.palmNormal[0], -this.palmNormal[1]);
          }),
          (i.Invalid = {
            valid: !1,
            fingers: [],
            tools: [],
            pointables: [],
            left: !1,
            pointable: function () {
              return c.Invalid;
            },
            finger: function () {
              return c.Invalid;
            },
            toString: function () {
              return "invalid frame";
            },
            dump: function () {
              return this.toString();
            },
            rotationAngle: function () {
              return 0;
            },
            rotationMatrix: function () {
              return f.create();
            },
            rotationAxis: function () {
              return g.create();
            },
            scaleFactor: function () {
              return 1;
            },
            translation: function () {
              return g.create();
            },
          });
      },
      { "./bone": 1, "./pointable": 14, "gl-matrix": 23, underscore: 24 },
    ],
    11: [
      function (a, b) {
        b.exports = {
          Controller: a("./controller"),
          Frame: a("./frame"),
          Gesture: a("./gesture"),
          Hand: a("./hand"),
          Pointable: a("./pointable"),
          Finger: a("./finger"),
          InteractionBox: a("./interaction_box"),
          CircularBuffer: a("./circular_buffer"),
          UI: a("./ui"),
          JSONProtocol: a("./protocol").JSONProtocol,
          glMatrix: a("gl-matrix"),
          mat3: a("gl-matrix").mat3,
          vec3: a("gl-matrix").vec3,
          loopController: void 0,
          version: a("./version.js"),
          loop: function (a, b) {
            return (
              !a || void 0 !== b || a.frame || a.hand || ((b = a), (a = {})),
              this.loopController
                ? a && this.loopController.setupFrameEvents(a)
                : (this.loopController = new this.Controller(a)),
              this.loopController.loop(b),
              this.loopController
            );
          },
          plugin: function (a, b) {
            this.Controller.plugin(a, b);
          },
        };
      },
      {
        "./circular_buffer": 2,
        "./controller": 5,
        "./finger": 7,
        "./frame": 8,
        "./gesture": 9,
        "./hand": 10,
        "./interaction_box": 12,
        "./pointable": 14,
        "./protocol": 15,
        "./ui": 16,
        "./version.js": 19,
        "gl-matrix": 23,
      },
    ],
    12: [
      function (a, b) {
        var c = a("gl-matrix"),
          d = c.vec3,
          e = (b.exports = function (a) {
            (this.valid = !0),
              (this.center = a.center),
              (this.size = a.size),
              (this.width = a.size[0]),
              (this.height = a.size[1]),
              (this.depth = a.size[2]);
          });
        (e.prototype.denormalizePoint = function (a) {
          return d.fromValues(
            (a[0] - 0.5) * this.size[0] + this.center[0],
            (a[1] - 0.5) * this.size[1] + this.center[1],
            (a[2] - 0.5) * this.size[2] + this.center[2]
          );
        }),
          (e.prototype.normalizePoint = function (a, b) {
            var c = d.fromValues(
              (a[0] - this.center[0]) / this.size[0] + 0.5,
              (a[1] - this.center[1]) / this.size[1] + 0.5,
              (a[2] - this.center[2]) / this.size[2] + 0.5
            );
            return (
              b &&
                ((c[0] = Math.min(Math.max(c[0], 0), 1)),
                (c[1] = Math.min(Math.max(c[1], 0), 1)),
                (c[2] = Math.min(Math.max(c[2], 0), 1))),
              c
            );
          }),
          (e.prototype.toString = function () {
            return (
              "InteractionBox [ width:" +
              this.width +
              " | height:" +
              this.height +
              " | depth:" +
              this.depth +
              " ]"
            );
          }),
          (e.Invalid = { valid: !1 });
      },
      { "gl-matrix": 23 },
    ],
    13: [
      function (a, b) {
        var c = (b.exports = function (a) {
          (this.steps = []), (this.controller = a);
        });
        (c.prototype.addStep = function (a) {
          this.steps.push(a);
        }),
          (c.prototype.run = function (a) {
            for (var b = this.steps.length, c = 0; c != b && a; c++)
              a = this.steps[c](a);
            return a;
          }),
          (c.prototype.removeStep = function (a) {
            var b = this.steps.indexOf(a);
            if (-1 === b) throw "Step not found in pipeline";
            this.steps.splice(b, 1);
          }),
          (c.prototype.addWrappedStep = function (a, b) {
            var c = this.controller,
              d = function (d) {
                var e, f, g;
                for (
                  e = "frame" == a ? [d] : d[a + "s"] || [],
                    f = 0,
                    g = e.length;
                  g > f;
                  f++
                )
                  b.call(c, e[f]);
                return d;
              };
            return this.addStep(d), d;
          });
      },
      {},
    ],
    14: [
      function (a, b) {
        var c = a("gl-matrix"),
          d =
            (c.vec3,
            (b.exports = function (a) {
              (this.valid = !0),
                (this.id = a.id),
                (this.handId = a.handId),
                (this.length = a.length),
                (this.tool = a.tool),
                (this.width = a.width),
                (this.direction = a.direction),
                (this.stabilizedTipPosition = a.stabilizedTipPosition),
                (this.tipPosition = a.tipPosition),
                (this.tipVelocity = a.tipVelocity),
                (this.touchZone = a.touchZone),
                (this.touchDistance = a.touchDistance),
                (this.timeVisible = a.timeVisible);
            }));
        (d.prototype.toString = function () {
          return (
            "Pointable [ id:" +
            this.id +
            " " +
            this.length +
            "mmx | width:" +
            this.width +
            "mm | direction:" +
            this.direction +
            " ]"
          );
        }),
          (d.prototype.hand = function () {
            return this.frame.hand(this.handId);
          }),
          (d.Invalid = { valid: !1 });
      },
      { "gl-matrix": 23 },
    ],
    15: [
      function (a, b, c) {
        var d = a("./frame"),
          e = (a("./hand"), a("./pointable"), a("./finger"), a("underscore")),
          f = a("events").EventEmitter,
          g = function (a) {
            (this.type = a.type), (this.state = a.state);
          };
        c.chooseProtocol = function (a) {
          var b;
          switch (a.version) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
              (b = h(a)),
                (b.sendBackground = function (a, c) {
                  a.send(b.encode({ background: c }));
                }),
                (b.sendFocused = function (a, c) {
                  a.send(b.encode({ focused: c }));
                }),
                (b.sendOptimizeHMD = function (a, c) {
                  a.send(b.encode({ optimizeHMD: c }));
                });
              break;
            default:
              throw "unrecognized version";
          }
          return b;
        };
        var h = (c.JSONProtocol = function (a) {
          var b = function (a) {
            if (a.event) return new g(a.event);
            b.emit("beforeFrameCreated", a);
            var c = new d(a);
            return b.emit("afterFrameCreated", c, a), c;
          };
          return (
            (b.encode = function (a) {
              return JSON.stringify(a);
            }),
            (b.version = a.version),
            (b.serviceVersion = a.serviceVersion),
            (b.versionLong = "Version " + a.version),
            (b.type = "protocol"),
            e.extend(b, f.prototype),
            b
          );
        });
      },
      {
        "./finger": 7,
        "./frame": 8,
        "./hand": 10,
        "./pointable": 14,
        events: 21,
        underscore: 24,
      },
    ],
    16: [
      function (a, b, c) {
        c.UI = { Region: a("./ui/region"), Cursor: a("./ui/cursor") };
      },
      { "./ui/cursor": 17, "./ui/region": 18 },
    ],
    17: [
      function (a, b) {
        b.exports = function () {
          return function (a) {
            var b = a.pointables.sort(function (a, b) {
              return a.z - b.z;
            })[0];
            return b && b.valid && (a.cursorPosition = b.tipPosition), a;
          };
        };
      },
      {},
    ],
    18: [
      function (a, b) {
        var c = a("events").EventEmitter,
          d = a("underscore"),
          e = (b.exports = function (a, b) {
            (this.start = new Vector(a)),
              (this.end = new Vector(b)),
              (this.enteredFrame = null);
          });
        (e.prototype.hasPointables = function (a) {
          for (var b = 0; b != a.pointables.length; b++) {
            var c = a.pointables[b].tipPosition;
            if (
              c.x >= this.start.x &&
              c.x <= this.end.x &&
              c.y >= this.start.y &&
              c.y <= this.end.y &&
              c.z >= this.start.z &&
              c.z <= this.end.z
            )
              return !0;
          }
          return !1;
        }),
          (e.prototype.listener = function (a) {
            var b = this;
            return (
              a && a.nearThreshold && this.setupNearRegion(a.nearThreshold),
              function (a) {
                return b.updatePosition(a);
              }
            );
          }),
          (e.prototype.clipper = function () {
            var a = this;
            return function (b) {
              return a.updatePosition(b), a.enteredFrame ? b : null;
            };
          }),
          (e.prototype.setupNearRegion = function (a) {
            var b = (this.nearRegion = new e(
                [this.start.x - a, this.start.y - a, this.start.z - a],
                [this.end.x + a, this.end.y + a, this.end.z + a]
              )),
              c = this;
            b.on("enter", function (a) {
              c.emit("near", a);
            }),
              b.on("exit", function (a) {
                c.emit("far", a);
              }),
              c.on("exit", function (a) {
                c.emit("near", a);
              });
          }),
          (e.prototype.updatePosition = function (a) {
            return (
              this.nearRegion && this.nearRegion.updatePosition(a),
              this.hasPointables(a) && null == this.enteredFrame
                ? ((this.enteredFrame = a),
                  this.emit("enter", this.enteredFrame))
                : this.hasPointables(a) ||
                  null == this.enteredFrame ||
                  ((this.enteredFrame = null),
                  this.emit("exit", this.enteredFrame)),
              a
            );
          }),
          (e.prototype.normalize = function (a) {
            return new Vector([
              (a.x - this.start.x) / (this.end.x - this.start.x),
              (a.y - this.start.y) / (this.end.y - this.start.y),
              (a.z - this.start.z) / (this.end.z - this.start.z),
            ]);
          }),
          (e.prototype.mapToXY = function (a, b, c) {
            var d = this.normalize(a),
              e = d.x,
              f = d.y;
            return (
              e > 1 ? (e = 1) : -1 > e && (e = -1),
              f > 1 ? (f = 1) : -1 > f && (f = -1),
              [((e + 1) / 2) * b, ((1 - f) / 2) * c, d.z]
            );
          }),
          d.extend(e.prototype, c.prototype);
      },
      { events: 21, underscore: 24 },
    ],
    19: [
      function (a, b) {
        b.exports = { full: "0.6.3", major: 0, minor: 6, dot: 3 };
      },
      {},
    ],
    20: [function () {}, {}],
    21: [
      function (a, b, c) {
        function d(a, b) {
          if (a.indexOf) return a.indexOf(b);
          for (var c = 0; c < a.length; c++) if (b === a[c]) return c;
          return -1;
        }
        var e = a("__browserify_process");
        e.EventEmitter || (e.EventEmitter = function () {});
        var f = (c.EventEmitter = e.EventEmitter),
          g =
            "function" == typeof Array.isArray
              ? Array.isArray
              : function (a) {
                  return "[object Array]" === Object.prototype.toString.call(a);
                },
          h = 10;
        (f.prototype.setMaxListeners = function (a) {
          this._events || (this._events = {}), (this._events.maxListeners = a);
        }),
          (f.prototype.emit = function (a) {
            if (
              "error" === a &&
              (!this._events ||
                !this._events.error ||
                (g(this._events.error) && !this._events.error.length))
            )
              throw arguments[1] instanceof Error
                ? arguments[1]
                : new Error("Uncaught, unspecified 'error' event.");
            if (!this._events) return !1;
            var b = this._events[a];
            if (!b) return !1;
            if ("function" == typeof b) {
              switch (arguments.length) {
                case 1:
                  b.call(this);
                  break;
                case 2:
                  b.call(this, arguments[1]);
                  break;
                case 3:
                  b.call(this, arguments[1], arguments[2]);
                  break;
                default:
                  var c = Array.prototype.slice.call(arguments, 1);
                  b.apply(this, c);
              }
              return !0;
            }
            if (g(b)) {
              for (
                var c = Array.prototype.slice.call(arguments, 1),
                  d = b.slice(),
                  e = 0,
                  f = d.length;
                f > e;
                e++
              )
                d[e].apply(this, c);
              return !0;
            }
            return !1;
          }),
          (f.prototype.addListener = function (a, b) {
            if ("function" != typeof b)
              throw new Error("addListener only takes instances of Function");
            if (
              (this._events || (this._events = {}),
              this.emit("newListener", a, b),
              this._events[a])
            )
              if (g(this._events[a])) {
                if (!this._events[a].warned) {
                  var c;
                  (c =
                    void 0 !== this._events.maxListeners
                      ? this._events.maxListeners
                      : h),
                    c &&
                      c > 0 &&
                      this._events[a].length > c &&
                      ((this._events[a].warned = !0),
                      console.error(
                        "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
                        this._events[a].length
                      ),
                      console.trace());
                }
                this._events[a].push(b);
              } else this._events[a] = [this._events[a], b];
            else this._events[a] = b;
            return this;
          }),
          (f.prototype.on = f.prototype.addListener),
          (f.prototype.once = function (a, b) {
            var c = this;
            return (
              c.on(a, function d() {
                c.removeListener(a, d), b.apply(this, arguments);
              }),
              this
            );
          }),
          (f.prototype.removeListener = function (a, b) {
            if ("function" != typeof b)
              throw new Error(
                "removeListener only takes instances of Function"
              );
            if (!this._events || !this._events[a]) return this;
            var c = this._events[a];
            if (g(c)) {
              var e = d(c, b);
              if (0 > e) return this;
              c.splice(e, 1), 0 == c.length && delete this._events[a];
            } else this._events[a] === b && delete this._events[a];
            return this;
          }),
          (f.prototype.removeAllListeners = function (a) {
            return 0 === arguments.length
              ? ((this._events = {}), this)
              : (a &&
                  this._events &&
                  this._events[a] &&
                  (this._events[a] = null),
                this);
          }),
          (f.prototype.listeners = function (a) {
            return (
              this._events || (this._events = {}),
              this._events[a] || (this._events[a] = []),
              g(this._events[a]) || (this._events[a] = [this._events[a]]),
              this._events[a]
            );
          }),
          (f.listenerCount = function (a, b) {
            var c;
            return (c =
              a._events && a._events[b]
                ? "function" == typeof a._events[b]
                  ? 1
                  : a._events[b].length
                : 0);
          });
      },
      { __browserify_process: 22 },
    ],
    22: [
      function (a, b) {
        var c = (b.exports = {});
        (c.nextTick = (function () {
          var a = "undefined" != typeof window && window.setImmediate,
            b =
              "undefined" != typeof window &&
              window.postMessage &&
              window.addEventListener;
          if (a)
            return function (a) {
              return window.setImmediate(a);
            };
          if (b) {
            var c = [];
            return (
              window.addEventListener(
                "message",
                function (a) {
                  var b = a.source;
                  if (
                    (b === window || null === b) &&
                    "process-tick" === a.data &&
                    (a.stopPropagation(), c.length > 0)
                  ) {
                    var d = c.shift();
                    d();
                  }
                },
                !0
              ),
              function (a) {
                c.push(a), window.postMessage("process-tick", "*");
              }
            );
          }
          return function (a) {
            setTimeout(a, 0);
          };
        })()),
          (c.title = "browser"),
          (c.browser = !0),
          (c.env = {}),
          (c.argv = []),
          (c.binding = function () {
            throw new Error("process.binding is not supported");
          }),
          (c.cwd = function () {
            return "/";
          }),
          (c.chdir = function () {
            throw new Error("process.chdir is not supported");
          });
      },
      {},
    ],
    23: [
      function (a, b, c) {
        !(function (a) {
          "use strict";
          var b = {};
          "undefined" == typeof c
            ? "function" == typeof define &&
              "object" == typeof define.amd &&
              define.amd
              ? ((b.exports = {}),
                define(function () {
                  return b.exports;
                }))
              : (b.exports = "undefined" != typeof window ? window : a)
            : (b.exports = c),
            (function (a) {
              if (!b) var b = 1e-6;
              if (!c)
                var c =
                  "undefined" != typeof Float32Array ? Float32Array : Array;
              if (!d) var d = Math.random;
              var e = {};
              (e.setMatrixArrayType = function (a) {
                c = a;
              }),
                "undefined" != typeof a && (a.glMatrix = e);
              var f = Math.PI / 180;
              e.toRadian = function (a) {
                return a * f;
              };
              var g = {};
              (g.create = function () {
                var a = new c(2);
                return (a[0] = 0), (a[1] = 0), a;
              }),
                (g.clone = function (a) {
                  var b = new c(2);
                  return (b[0] = a[0]), (b[1] = a[1]), b;
                }),
                (g.fromValues = function (a, b) {
                  var d = new c(2);
                  return (d[0] = a), (d[1] = b), d;
                }),
                (g.copy = function (a, b) {
                  return (a[0] = b[0]), (a[1] = b[1]), a;
                }),
                (g.set = function (a, b, c) {
                  return (a[0] = b), (a[1] = c), a;
                }),
                (g.add = function (a, b, c) {
                  return (a[0] = b[0] + c[0]), (a[1] = b[1] + c[1]), a;
                }),
                (g.subtract = function (a, b, c) {
                  return (a[0] = b[0] - c[0]), (a[1] = b[1] - c[1]), a;
                }),
                (g.sub = g.subtract),
                (g.multiply = function (a, b, c) {
                  return (a[0] = b[0] * c[0]), (a[1] = b[1] * c[1]), a;
                }),
                (g.mul = g.multiply),
                (g.divide = function (a, b, c) {
                  return (a[0] = b[0] / c[0]), (a[1] = b[1] / c[1]), a;
                }),
                (g.div = g.divide),
                (g.min = function (a, b, c) {
                  return (
                    (a[0] = Math.min(b[0], c[0])),
                    (a[1] = Math.min(b[1], c[1])),
                    a
                  );
                }),
                (g.max = function (a, b, c) {
                  return (
                    (a[0] = Math.max(b[0], c[0])),
                    (a[1] = Math.max(b[1], c[1])),
                    a
                  );
                }),
                (g.scale = function (a, b, c) {
                  return (a[0] = b[0] * c), (a[1] = b[1] * c), a;
                }),
                (g.scaleAndAdd = function (a, b, c, d) {
                  return (a[0] = b[0] + c[0] * d), (a[1] = b[1] + c[1] * d), a;
                }),
                (g.distance = function (a, b) {
                  var c = b[0] - a[0],
                    d = b[1] - a[1];
                  return Math.sqrt(c * c + d * d);
                }),
                (g.dist = g.distance),
                (g.squaredDistance = function (a, b) {
                  var c = b[0] - a[0],
                    d = b[1] - a[1];
                  return c * c + d * d;
                }),
                (g.sqrDist = g.squaredDistance),
                (g.length = function (a) {
                  var b = a[0],
                    c = a[1];
                  return Math.sqrt(b * b + c * c);
                }),
                (g.len = g.length),
                (g.squaredLength = function (a) {
                  var b = a[0],
                    c = a[1];
                  return b * b + c * c;
                }),
                (g.sqrLen = g.squaredLength),
                (g.negate = function (a, b) {
                  return (a[0] = -b[0]), (a[1] = -b[1]), a;
                }),
                (g.normalize = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = c * c + d * d;
                  return (
                    e > 0 &&
                      ((e = 1 / Math.sqrt(e)),
                      (a[0] = b[0] * e),
                      (a[1] = b[1] * e)),
                    a
                  );
                }),
                (g.dot = function (a, b) {
                  return a[0] * b[0] + a[1] * b[1];
                }),
                (g.cross = function (a, b, c) {
                  var d = b[0] * c[1] - b[1] * c[0];
                  return (a[0] = a[1] = 0), (a[2] = d), a;
                }),
                (g.lerp = function (a, b, c, d) {
                  var e = b[0],
                    f = b[1];
                  return (
                    (a[0] = e + d * (c[0] - e)), (a[1] = f + d * (c[1] - f)), a
                  );
                }),
                (g.random = function (a, b) {
                  b = b || 1;
                  var c = 2 * d() * Math.PI;
                  return (a[0] = Math.cos(c) * b), (a[1] = Math.sin(c) * b), a;
                }),
                (g.transformMat2 = function (a, b, c) {
                  var d = b[0],
                    e = b[1];
                  return (
                    (a[0] = c[0] * d + c[2] * e),
                    (a[1] = c[1] * d + c[3] * e),
                    a
                  );
                }),
                (g.transformMat2d = function (a, b, c) {
                  var d = b[0],
                    e = b[1];
                  return (
                    (a[0] = c[0] * d + c[2] * e + c[4]),
                    (a[1] = c[1] * d + c[3] * e + c[5]),
                    a
                  );
                }),
                (g.transformMat3 = function (a, b, c) {
                  var d = b[0],
                    e = b[1];
                  return (
                    (a[0] = c[0] * d + c[3] * e + c[6]),
                    (a[1] = c[1] * d + c[4] * e + c[7]),
                    a
                  );
                }),
                (g.transformMat4 = function (a, b, c) {
                  var d = b[0],
                    e = b[1];
                  return (
                    (a[0] = c[0] * d + c[4] * e + c[12]),
                    (a[1] = c[1] * d + c[5] * e + c[13]),
                    a
                  );
                }),
                (g.forEach = (function () {
                  var a = g.create();
                  return function (b, c, d, e, f, g) {
                    var h, i;
                    for (
                      c || (c = 2),
                        d || (d = 0),
                        i = e ? Math.min(e * c + d, b.length) : b.length,
                        h = d;
                      i > h;
                      h += c
                    )
                      (a[0] = b[h]),
                        (a[1] = b[h + 1]),
                        f(a, a, g),
                        (b[h] = a[0]),
                        (b[h + 1] = a[1]);
                    return b;
                  };
                })()),
                (g.str = function (a) {
                  return "vec2(" + a[0] + ", " + a[1] + ")";
                }),
                "undefined" != typeof a && (a.vec2 = g);
              var h = {};
              (h.create = function () {
                var a = new c(3);
                return (a[0] = 0), (a[1] = 0), (a[2] = 0), a;
              }),
                (h.clone = function (a) {
                  var b = new c(3);
                  return (b[0] = a[0]), (b[1] = a[1]), (b[2] = a[2]), b;
                }),
                (h.fromValues = function (a, b, d) {
                  var e = new c(3);
                  return (e[0] = a), (e[1] = b), (e[2] = d), e;
                }),
                (h.copy = function (a, b) {
                  return (a[0] = b[0]), (a[1] = b[1]), (a[2] = b[2]), a;
                }),
                (h.set = function (a, b, c, d) {
                  return (a[0] = b), (a[1] = c), (a[2] = d), a;
                }),
                (h.add = function (a, b, c) {
                  return (
                    (a[0] = b[0] + c[0]),
                    (a[1] = b[1] + c[1]),
                    (a[2] = b[2] + c[2]),
                    a
                  );
                }),
                (h.subtract = function (a, b, c) {
                  return (
                    (a[0] = b[0] - c[0]),
                    (a[1] = b[1] - c[1]),
                    (a[2] = b[2] - c[2]),
                    a
                  );
                }),
                (h.sub = h.subtract),
                (h.multiply = function (a, b, c) {
                  return (
                    (a[0] = b[0] * c[0]),
                    (a[1] = b[1] * c[1]),
                    (a[2] = b[2] * c[2]),
                    a
                  );
                }),
                (h.mul = h.multiply),
                (h.divide = function (a, b, c) {
                  return (
                    (a[0] = b[0] / c[0]),
                    (a[1] = b[1] / c[1]),
                    (a[2] = b[2] / c[2]),
                    a
                  );
                }),
                (h.div = h.divide),
                (h.min = function (a, b, c) {
                  return (
                    (a[0] = Math.min(b[0], c[0])),
                    (a[1] = Math.min(b[1], c[1])),
                    (a[2] = Math.min(b[2], c[2])),
                    a
                  );
                }),
                (h.max = function (a, b, c) {
                  return (
                    (a[0] = Math.max(b[0], c[0])),
                    (a[1] = Math.max(b[1], c[1])),
                    (a[2] = Math.max(b[2], c[2])),
                    a
                  );
                }),
                (h.scale = function (a, b, c) {
                  return (
                    (a[0] = b[0] * c), (a[1] = b[1] * c), (a[2] = b[2] * c), a
                  );
                }),
                (h.scaleAndAdd = function (a, b, c, d) {
                  return (
                    (a[0] = b[0] + c[0] * d),
                    (a[1] = b[1] + c[1] * d),
                    (a[2] = b[2] + c[2] * d),
                    a
                  );
                }),
                (h.distance = function (a, b) {
                  var c = b[0] - a[0],
                    d = b[1] - a[1],
                    e = b[2] - a[2];
                  return Math.sqrt(c * c + d * d + e * e);
                }),
                (h.dist = h.distance),
                (h.squaredDistance = function (a, b) {
                  var c = b[0] - a[0],
                    d = b[1] - a[1],
                    e = b[2] - a[2];
                  return c * c + d * d + e * e;
                }),
                (h.sqrDist = h.squaredDistance),
                (h.length = function (a) {
                  var b = a[0],
                    c = a[1],
                    d = a[2];
                  return Math.sqrt(b * b + c * c + d * d);
                }),
                (h.len = h.length),
                (h.squaredLength = function (a) {
                  var b = a[0],
                    c = a[1],
                    d = a[2];
                  return b * b + c * c + d * d;
                }),
                (h.sqrLen = h.squaredLength),
                (h.negate = function (a, b) {
                  return (a[0] = -b[0]), (a[1] = -b[1]), (a[2] = -b[2]), a;
                }),
                (h.normalize = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = c * c + d * d + e * e;
                  return (
                    f > 0 &&
                      ((f = 1 / Math.sqrt(f)),
                      (a[0] = b[0] * f),
                      (a[1] = b[1] * f),
                      (a[2] = b[2] * f)),
                    a
                  );
                }),
                (h.dot = function (a, b) {
                  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
                }),
                (h.cross = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = c[0],
                    h = c[1],
                    i = c[2];
                  return (
                    (a[0] = e * i - f * h),
                    (a[1] = f * g - d * i),
                    (a[2] = d * h - e * g),
                    a
                  );
                }),
                (h.lerp = function (a, b, c, d) {
                  var e = b[0],
                    f = b[1],
                    g = b[2];
                  return (
                    (a[0] = e + d * (c[0] - e)),
                    (a[1] = f + d * (c[1] - f)),
                    (a[2] = g + d * (c[2] - g)),
                    a
                  );
                }),
                (h.random = function (a, b) {
                  b = b || 1;
                  var c = 2 * d() * Math.PI,
                    e = 2 * d() - 1,
                    f = Math.sqrt(1 - e * e) * b;
                  return (
                    (a[0] = Math.cos(c) * f),
                    (a[1] = Math.sin(c) * f),
                    (a[2] = e * b),
                    a
                  );
                }),
                (h.transformMat4 = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2];
                  return (
                    (a[0] = c[0] * d + c[4] * e + c[8] * f + c[12]),
                    (a[1] = c[1] * d + c[5] * e + c[9] * f + c[13]),
                    (a[2] = c[2] * d + c[6] * e + c[10] * f + c[14]),
                    a
                  );
                }),
                (h.transformMat3 = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2];
                  return (
                    (a[0] = d * c[0] + e * c[3] + f * c[6]),
                    (a[1] = d * c[1] + e * c[4] + f * c[7]),
                    (a[2] = d * c[2] + e * c[5] + f * c[8]),
                    a
                  );
                }),
                (h.transformQuat = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = c[0],
                    h = c[1],
                    i = c[2],
                    j = c[3],
                    k = j * d + h * f - i * e,
                    l = j * e + i * d - g * f,
                    m = j * f + g * e - h * d,
                    n = -g * d - h * e - i * f;
                  return (
                    (a[0] = k * j + n * -g + l * -i - m * -h),
                    (a[1] = l * j + n * -h + m * -g - k * -i),
                    (a[2] = m * j + n * -i + k * -h - l * -g),
                    a
                  );
                }),
                (h.rotateX = function (a, b, c, d) {
                  var e = [],
                    f = [];
                  return (
                    (e[0] = b[0] - c[0]),
                    (e[1] = b[1] - c[1]),
                    (e[2] = b[2] - c[2]),
                    (f[0] = e[0]),
                    (f[1] = e[1] * Math.cos(d) - e[2] * Math.sin(d)),
                    (f[2] = e[1] * Math.sin(d) + e[2] * Math.cos(d)),
                    (a[0] = f[0] + c[0]),
                    (a[1] = f[1] + c[1]),
                    (a[2] = f[2] + c[2]),
                    a
                  );
                }),
                (h.rotateY = function (a, b, c, d) {
                  var e = [],
                    f = [];
                  return (
                    (e[0] = b[0] - c[0]),
                    (e[1] = b[1] - c[1]),
                    (e[2] = b[2] - c[2]),
                    (f[0] = e[2] * Math.sin(d) + e[0] * Math.cos(d)),
                    (f[1] = e[1]),
                    (f[2] = e[2] * Math.cos(d) - e[0] * Math.sin(d)),
                    (a[0] = f[0] + c[0]),
                    (a[1] = f[1] + c[1]),
                    (a[2] = f[2] + c[2]),
                    a
                  );
                }),
                (h.rotateZ = function (a, b, c, d) {
                  var e = [],
                    f = [];
                  return (
                    (e[0] = b[0] - c[0]),
                    (e[1] = b[1] - c[1]),
                    (e[2] = b[2] - c[2]),
                    (f[0] = e[0] * Math.cos(d) - e[1] * Math.sin(d)),
                    (f[1] = e[0] * Math.sin(d) + e[1] * Math.cos(d)),
                    (f[2] = e[2]),
                    (a[0] = f[0] + c[0]),
                    (a[1] = f[1] + c[1]),
                    (a[2] = f[2] + c[2]),
                    a
                  );
                }),
                (h.forEach = (function () {
                  var a = h.create();
                  return function (b, c, d, e, f, g) {
                    var h, i;
                    for (
                      c || (c = 3),
                        d || (d = 0),
                        i = e ? Math.min(e * c + d, b.length) : b.length,
                        h = d;
                      i > h;
                      h += c
                    )
                      (a[0] = b[h]),
                        (a[1] = b[h + 1]),
                        (a[2] = b[h + 2]),
                        f(a, a, g),
                        (b[h] = a[0]),
                        (b[h + 1] = a[1]),
                        (b[h + 2] = a[2]);
                    return b;
                  };
                })()),
                (h.str = function (a) {
                  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
                }),
                "undefined" != typeof a && (a.vec3 = h);
              var i = {};
              (i.create = function () {
                var a = new c(4);
                return (a[0] = 0), (a[1] = 0), (a[2] = 0), (a[3] = 0), a;
              }),
                (i.clone = function (a) {
                  var b = new c(4);
                  return (
                    (b[0] = a[0]),
                    (b[1] = a[1]),
                    (b[2] = a[2]),
                    (b[3] = a[3]),
                    b
                  );
                }),
                (i.fromValues = function (a, b, d, e) {
                  var f = new c(4);
                  return (f[0] = a), (f[1] = b), (f[2] = d), (f[3] = e), f;
                }),
                (i.copy = function (a, b) {
                  return (
                    (a[0] = b[0]),
                    (a[1] = b[1]),
                    (a[2] = b[2]),
                    (a[3] = b[3]),
                    a
                  );
                }),
                (i.set = function (a, b, c, d, e) {
                  return (a[0] = b), (a[1] = c), (a[2] = d), (a[3] = e), a;
                }),
                (i.add = function (a, b, c) {
                  return (
                    (a[0] = b[0] + c[0]),
                    (a[1] = b[1] + c[1]),
                    (a[2] = b[2] + c[2]),
                    (a[3] = b[3] + c[3]),
                    a
                  );
                }),
                (i.subtract = function (a, b, c) {
                  return (
                    (a[0] = b[0] - c[0]),
                    (a[1] = b[1] - c[1]),
                    (a[2] = b[2] - c[2]),
                    (a[3] = b[3] - c[3]),
                    a
                  );
                }),
                (i.sub = i.subtract),
                (i.multiply = function (a, b, c) {
                  return (
                    (a[0] = b[0] * c[0]),
                    (a[1] = b[1] * c[1]),
                    (a[2] = b[2] * c[2]),
                    (a[3] = b[3] * c[3]),
                    a
                  );
                }),
                (i.mul = i.multiply),
                (i.divide = function (a, b, c) {
                  return (
                    (a[0] = b[0] / c[0]),
                    (a[1] = b[1] / c[1]),
                    (a[2] = b[2] / c[2]),
                    (a[3] = b[3] / c[3]),
                    a
                  );
                }),
                (i.div = i.divide),
                (i.min = function (a, b, c) {
                  return (
                    (a[0] = Math.min(b[0], c[0])),
                    (a[1] = Math.min(b[1], c[1])),
                    (a[2] = Math.min(b[2], c[2])),
                    (a[3] = Math.min(b[3], c[3])),
                    a
                  );
                }),
                (i.max = function (a, b, c) {
                  return (
                    (a[0] = Math.max(b[0], c[0])),
                    (a[1] = Math.max(b[1], c[1])),
                    (a[2] = Math.max(b[2], c[2])),
                    (a[3] = Math.max(b[3], c[3])),
                    a
                  );
                }),
                (i.scale = function (a, b, c) {
                  return (
                    (a[0] = b[0] * c),
                    (a[1] = b[1] * c),
                    (a[2] = b[2] * c),
                    (a[3] = b[3] * c),
                    a
                  );
                }),
                (i.scaleAndAdd = function (a, b, c, d) {
                  return (
                    (a[0] = b[0] + c[0] * d),
                    (a[1] = b[1] + c[1] * d),
                    (a[2] = b[2] + c[2] * d),
                    (a[3] = b[3] + c[3] * d),
                    a
                  );
                }),
                (i.distance = function (a, b) {
                  var c = b[0] - a[0],
                    d = b[1] - a[1],
                    e = b[2] - a[2],
                    f = b[3] - a[3];
                  return Math.sqrt(c * c + d * d + e * e + f * f);
                }),
                (i.dist = i.distance),
                (i.squaredDistance = function (a, b) {
                  var c = b[0] - a[0],
                    d = b[1] - a[1],
                    e = b[2] - a[2],
                    f = b[3] - a[3];
                  return c * c + d * d + e * e + f * f;
                }),
                (i.sqrDist = i.squaredDistance),
                (i.length = function (a) {
                  var b = a[0],
                    c = a[1],
                    d = a[2],
                    e = a[3];
                  return Math.sqrt(b * b + c * c + d * d + e * e);
                }),
                (i.len = i.length),
                (i.squaredLength = function (a) {
                  var b = a[0],
                    c = a[1],
                    d = a[2],
                    e = a[3];
                  return b * b + c * c + d * d + e * e;
                }),
                (i.sqrLen = i.squaredLength),
                (i.negate = function (a, b) {
                  return (
                    (a[0] = -b[0]),
                    (a[1] = -b[1]),
                    (a[2] = -b[2]),
                    (a[3] = -b[3]),
                    a
                  );
                }),
                (i.normalize = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = c * c + d * d + e * e + f * f;
                  return (
                    g > 0 &&
                      ((g = 1 / Math.sqrt(g)),
                      (a[0] = b[0] * g),
                      (a[1] = b[1] * g),
                      (a[2] = b[2] * g),
                      (a[3] = b[3] * g)),
                    a
                  );
                }),
                (i.dot = function (a, b) {
                  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
                }),
                (i.lerp = function (a, b, c, d) {
                  var e = b[0],
                    f = b[1],
                    g = b[2],
                    h = b[3];
                  return (
                    (a[0] = e + d * (c[0] - e)),
                    (a[1] = f + d * (c[1] - f)),
                    (a[2] = g + d * (c[2] - g)),
                    (a[3] = h + d * (c[3] - h)),
                    a
                  );
                }),
                (i.random = function (a, b) {
                  return (
                    (b = b || 1),
                    (a[0] = d()),
                    (a[1] = d()),
                    (a[2] = d()),
                    (a[3] = d()),
                    i.normalize(a, a),
                    i.scale(a, a, b),
                    a
                  );
                }),
                (i.transformMat4 = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3];
                  return (
                    (a[0] = c[0] * d + c[4] * e + c[8] * f + c[12] * g),
                    (a[1] = c[1] * d + c[5] * e + c[9] * f + c[13] * g),
                    (a[2] = c[2] * d + c[6] * e + c[10] * f + c[14] * g),
                    (a[3] = c[3] * d + c[7] * e + c[11] * f + c[15] * g),
                    a
                  );
                }),
                (i.transformQuat = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = c[0],
                    h = c[1],
                    i = c[2],
                    j = c[3],
                    k = j * d + h * f - i * e,
                    l = j * e + i * d - g * f,
                    m = j * f + g * e - h * d,
                    n = -g * d - h * e - i * f;
                  return (
                    (a[0] = k * j + n * -g + l * -i - m * -h),
                    (a[1] = l * j + n * -h + m * -g - k * -i),
                    (a[2] = m * j + n * -i + k * -h - l * -g),
                    a
                  );
                }),
                (i.forEach = (function () {
                  var a = i.create();
                  return function (b, c, d, e, f, g) {
                    var h, i;
                    for (
                      c || (c = 4),
                        d || (d = 0),
                        i = e ? Math.min(e * c + d, b.length) : b.length,
                        h = d;
                      i > h;
                      h += c
                    )
                      (a[0] = b[h]),
                        (a[1] = b[h + 1]),
                        (a[2] = b[h + 2]),
                        (a[3] = b[h + 3]),
                        f(a, a, g),
                        (b[h] = a[0]),
                        (b[h + 1] = a[1]),
                        (b[h + 2] = a[2]),
                        (b[h + 3] = a[3]);
                    return b;
                  };
                })()),
                (i.str = function (a) {
                  return (
                    "vec4(" +
                    a[0] +
                    ", " +
                    a[1] +
                    ", " +
                    a[2] +
                    ", " +
                    a[3] +
                    ")"
                  );
                }),
                "undefined" != typeof a && (a.vec4 = i);
              var j = {};
              (j.create = function () {
                var a = new c(4);
                return (a[0] = 1), (a[1] = 0), (a[2] = 0), (a[3] = 1), a;
              }),
                (j.clone = function (a) {
                  var b = new c(4);
                  return (
                    (b[0] = a[0]),
                    (b[1] = a[1]),
                    (b[2] = a[2]),
                    (b[3] = a[3]),
                    b
                  );
                }),
                (j.copy = function (a, b) {
                  return (
                    (a[0] = b[0]),
                    (a[1] = b[1]),
                    (a[2] = b[2]),
                    (a[3] = b[3]),
                    a
                  );
                }),
                (j.identity = function (a) {
                  return (a[0] = 1), (a[1] = 0), (a[2] = 0), (a[3] = 1), a;
                }),
                (j.transpose = function (a, b) {
                  if (a === b) {
                    var c = b[1];
                    (a[1] = b[2]), (a[2] = c);
                  } else
                    (a[0] = b[0]), (a[1] = b[2]), (a[2] = b[1]), (a[3] = b[3]);
                  return a;
                }),
                (j.invert = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = c * f - e * d;
                  return g
                    ? ((g = 1 / g),
                      (a[0] = f * g),
                      (a[1] = -d * g),
                      (a[2] = -e * g),
                      (a[3] = c * g),
                      a)
                    : null;
                }),
                (j.adjoint = function (a, b) {
                  var c = b[0];
                  return (
                    (a[0] = b[3]), (a[1] = -b[1]), (a[2] = -b[2]), (a[3] = c), a
                  );
                }),
                (j.determinant = function (a) {
                  return a[0] * a[3] - a[2] * a[1];
                }),
                (j.multiply = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = c[0],
                    i = c[1],
                    j = c[2],
                    k = c[3];
                  return (
                    (a[0] = d * h + f * i),
                    (a[1] = e * h + g * i),
                    (a[2] = d * j + f * k),
                    (a[3] = e * j + g * k),
                    a
                  );
                }),
                (j.mul = j.multiply),
                (j.rotate = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = Math.sin(c),
                    i = Math.cos(c);
                  return (
                    (a[0] = d * i + f * h),
                    (a[1] = e * i + g * h),
                    (a[2] = d * -h + f * i),
                    (a[3] = e * -h + g * i),
                    a
                  );
                }),
                (j.scale = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = c[0],
                    i = c[1];
                  return (
                    (a[0] = d * h),
                    (a[1] = e * h),
                    (a[2] = f * i),
                    (a[3] = g * i),
                    a
                  );
                }),
                (j.str = function (a) {
                  return (
                    "mat2(" +
                    a[0] +
                    ", " +
                    a[1] +
                    ", " +
                    a[2] +
                    ", " +
                    a[3] +
                    ")"
                  );
                }),
                (j.frob = function (a) {
                  return Math.sqrt(
                    Math.pow(a[0], 2) +
                      Math.pow(a[1], 2) +
                      Math.pow(a[2], 2) +
                      Math.pow(a[3], 2)
                  );
                }),
                (j.LDU = function (a, b, c, d) {
                  return (
                    (a[2] = d[2] / d[0]),
                    (c[0] = d[0]),
                    (c[1] = d[1]),
                    (c[3] = d[3] - a[2] * c[1]),
                    [a, b, c]
                  );
                }),
                "undefined" != typeof a && (a.mat2 = j);
              var k = {};
              (k.create = function () {
                var a = new c(6);
                return (
                  (a[0] = 1),
                  (a[1] = 0),
                  (a[2] = 0),
                  (a[3] = 1),
                  (a[4] = 0),
                  (a[5] = 0),
                  a
                );
              }),
                (k.clone = function (a) {
                  var b = new c(6);
                  return (
                    (b[0] = a[0]),
                    (b[1] = a[1]),
                    (b[2] = a[2]),
                    (b[3] = a[3]),
                    (b[4] = a[4]),
                    (b[5] = a[5]),
                    b
                  );
                }),
                (k.copy = function (a, b) {
                  return (
                    (a[0] = b[0]),
                    (a[1] = b[1]),
                    (a[2] = b[2]),
                    (a[3] = b[3]),
                    (a[4] = b[4]),
                    (a[5] = b[5]),
                    a
                  );
                }),
                (k.identity = function (a) {
                  return (
                    (a[0] = 1),
                    (a[1] = 0),
                    (a[2] = 0),
                    (a[3] = 1),
                    (a[4] = 0),
                    (a[5] = 0),
                    a
                  );
                }),
                (k.invert = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = b[4],
                    h = b[5],
                    i = c * f - d * e;
                  return i
                    ? ((i = 1 / i),
                      (a[0] = f * i),
                      (a[1] = -d * i),
                      (a[2] = -e * i),
                      (a[3] = c * i),
                      (a[4] = (e * h - f * g) * i),
                      (a[5] = (d * g - c * h) * i),
                      a)
                    : null;
                }),
                (k.determinant = function (a) {
                  return a[0] * a[3] - a[1] * a[2];
                }),
                (k.multiply = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = b[4],
                    i = b[5],
                    j = c[0],
                    k = c[1],
                    l = c[2],
                    m = c[3],
                    n = c[4],
                    o = c[5];
                  return (
                    (a[0] = d * j + f * k),
                    (a[1] = e * j + g * k),
                    (a[2] = d * l + f * m),
                    (a[3] = e * l + g * m),
                    (a[4] = d * n + f * o + h),
                    (a[5] = e * n + g * o + i),
                    a
                  );
                }),
                (k.mul = k.multiply),
                (k.rotate = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = b[4],
                    i = b[5],
                    j = Math.sin(c),
                    k = Math.cos(c);
                  return (
                    (a[0] = d * k + f * j),
                    (a[1] = e * k + g * j),
                    (a[2] = d * -j + f * k),
                    (a[3] = e * -j + g * k),
                    (a[4] = h),
                    (a[5] = i),
                    a
                  );
                }),
                (k.scale = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = b[4],
                    i = b[5],
                    j = c[0],
                    k = c[1];
                  return (
                    (a[0] = d * j),
                    (a[1] = e * j),
                    (a[2] = f * k),
                    (a[3] = g * k),
                    (a[4] = h),
                    (a[5] = i),
                    a
                  );
                }),
                (k.translate = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = b[4],
                    i = b[5],
                    j = c[0],
                    k = c[1];
                  return (
                    (a[0] = d),
                    (a[1] = e),
                    (a[2] = f),
                    (a[3] = g),
                    (a[4] = d * j + f * k + h),
                    (a[5] = e * j + g * k + i),
                    a
                  );
                }),
                (k.str = function (a) {
                  return (
                    "mat2d(" +
                    a[0] +
                    ", " +
                    a[1] +
                    ", " +
                    a[2] +
                    ", " +
                    a[3] +
                    ", " +
                    a[4] +
                    ", " +
                    a[5] +
                    ")"
                  );
                }),
                (k.frob = function (a) {
                  return Math.sqrt(
                    Math.pow(a[0], 2) +
                      Math.pow(a[1], 2) +
                      Math.pow(a[2], 2) +
                      Math.pow(a[3], 2) +
                      Math.pow(a[4], 2) +
                      Math.pow(a[5], 2) +
                      1
                  );
                }),
                "undefined" != typeof a && (a.mat2d = k);
              var l = {};
              (l.create = function () {
                var a = new c(9);
                return (
                  (a[0] = 1),
                  (a[1] = 0),
                  (a[2] = 0),
                  (a[3] = 0),
                  (a[4] = 1),
                  (a[5] = 0),
                  (a[6] = 0),
                  (a[7] = 0),
                  (a[8] = 1),
                  a
                );
              }),
                (l.fromMat4 = function (a, b) {
                  return (
                    (a[0] = b[0]),
                    (a[1] = b[1]),
                    (a[2] = b[2]),
                    (a[3] = b[4]),
                    (a[4] = b[5]),
                    (a[5] = b[6]),
                    (a[6] = b[8]),
                    (a[7] = b[9]),
                    (a[8] = b[10]),
                    a
                  );
                }),
                (l.clone = function (a) {
                  var b = new c(9);
                  return (
                    (b[0] = a[0]),
                    (b[1] = a[1]),
                    (b[2] = a[2]),
                    (b[3] = a[3]),
                    (b[4] = a[4]),
                    (b[5] = a[5]),
                    (b[6] = a[6]),
                    (b[7] = a[7]),
                    (b[8] = a[8]),
                    b
                  );
                }),
                (l.copy = function (a, b) {
                  return (
                    (a[0] = b[0]),
                    (a[1] = b[1]),
                    (a[2] = b[2]),
                    (a[3] = b[3]),
                    (a[4] = b[4]),
                    (a[5] = b[5]),
                    (a[6] = b[6]),
                    (a[7] = b[7]),
                    (a[8] = b[8]),
                    a
                  );
                }),
                (l.identity = function (a) {
                  return (
                    (a[0] = 1),
                    (a[1] = 0),
                    (a[2] = 0),
                    (a[3] = 0),
                    (a[4] = 1),
                    (a[5] = 0),
                    (a[6] = 0),
                    (a[7] = 0),
                    (a[8] = 1),
                    a
                  );
                }),
                (l.transpose = function (a, b) {
                  if (a === b) {
                    var c = b[1],
                      d = b[2],
                      e = b[5];
                    (a[1] = b[3]),
                      (a[2] = b[6]),
                      (a[3] = c),
                      (a[5] = b[7]),
                      (a[6] = d),
                      (a[7] = e);
                  } else
                    (a[0] = b[0]),
                      (a[1] = b[3]),
                      (a[2] = b[6]),
                      (a[3] = b[1]),
                      (a[4] = b[4]),
                      (a[5] = b[7]),
                      (a[6] = b[2]),
                      (a[7] = b[5]),
                      (a[8] = b[8]);
                  return a;
                }),
                (l.invert = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = b[4],
                    h = b[5],
                    i = b[6],
                    j = b[7],
                    k = b[8],
                    l = k * g - h * j,
                    m = -k * f + h * i,
                    n = j * f - g * i,
                    o = c * l + d * m + e * n;
                  return o
                    ? ((o = 1 / o),
                      (a[0] = l * o),
                      (a[1] = (-k * d + e * j) * o),
                      (a[2] = (h * d - e * g) * o),
                      (a[3] = m * o),
                      (a[4] = (k * c - e * i) * o),
                      (a[5] = (-h * c + e * f) * o),
                      (a[6] = n * o),
                      (a[7] = (-j * c + d * i) * o),
                      (a[8] = (g * c - d * f) * o),
                      a)
                    : null;
                }),
                (l.adjoint = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = b[4],
                    h = b[5],
                    i = b[6],
                    j = b[7],
                    k = b[8];
                  return (
                    (a[0] = g * k - h * j),
                    (a[1] = e * j - d * k),
                    (a[2] = d * h - e * g),
                    (a[3] = h * i - f * k),
                    (a[4] = c * k - e * i),
                    (a[5] = e * f - c * h),
                    (a[6] = f * j - g * i),
                    (a[7] = d * i - c * j),
                    (a[8] = c * g - d * f),
                    a
                  );
                }),
                (l.determinant = function (a) {
                  var b = a[0],
                    c = a[1],
                    d = a[2],
                    e = a[3],
                    f = a[4],
                    g = a[5],
                    h = a[6],
                    i = a[7],
                    j = a[8];
                  return (
                    b * (j * f - g * i) +
                    c * (-j * e + g * h) +
                    d * (i * e - f * h)
                  );
                }),
                (l.multiply = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = b[4],
                    i = b[5],
                    j = b[6],
                    k = b[7],
                    l = b[8],
                    m = c[0],
                    n = c[1],
                    o = c[2],
                    p = c[3],
                    q = c[4],
                    r = c[5],
                    s = c[6],
                    t = c[7],
                    u = c[8];
                  return (
                    (a[0] = m * d + n * g + o * j),
                    (a[1] = m * e + n * h + o * k),
                    (a[2] = m * f + n * i + o * l),
                    (a[3] = p * d + q * g + r * j),
                    (a[4] = p * e + q * h + r * k),
                    (a[5] = p * f + q * i + r * l),
                    (a[6] = s * d + t * g + u * j),
                    (a[7] = s * e + t * h + u * k),
                    (a[8] = s * f + t * i + u * l),
                    a
                  );
                }),
                (l.mul = l.multiply),
                (l.translate = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = b[4],
                    i = b[5],
                    j = b[6],
                    k = b[7],
                    l = b[8],
                    m = c[0],
                    n = c[1];
                  return (
                    (a[0] = d),
                    (a[1] = e),
                    (a[2] = f),
                    (a[3] = g),
                    (a[4] = h),
                    (a[5] = i),
                    (a[6] = m * d + n * g + j),
                    (a[7] = m * e + n * h + k),
                    (a[8] = m * f + n * i + l),
                    a
                  );
                }),
                (l.rotate = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = b[4],
                    i = b[5],
                    j = b[6],
                    k = b[7],
                    l = b[8],
                    m = Math.sin(c),
                    n = Math.cos(c);
                  return (
                    (a[0] = n * d + m * g),
                    (a[1] = n * e + m * h),
                    (a[2] = n * f + m * i),
                    (a[3] = n * g - m * d),
                    (a[4] = n * h - m * e),
                    (a[5] = n * i - m * f),
                    (a[6] = j),
                    (a[7] = k),
                    (a[8] = l),
                    a
                  );
                }),
                (l.scale = function (a, b, c) {
                  var d = c[0],
                    e = c[1];
                  return (
                    (a[0] = d * b[0]),
                    (a[1] = d * b[1]),
                    (a[2] = d * b[2]),
                    (a[3] = e * b[3]),
                    (a[4] = e * b[4]),
                    (a[5] = e * b[5]),
                    (a[6] = b[6]),
                    (a[7] = b[7]),
                    (a[8] = b[8]),
                    a
                  );
                }),
                (l.fromMat2d = function (a, b) {
                  return (
                    (a[0] = b[0]),
                    (a[1] = b[1]),
                    (a[2] = 0),
                    (a[3] = b[2]),
                    (a[4] = b[3]),
                    (a[5] = 0),
                    (a[6] = b[4]),
                    (a[7] = b[5]),
                    (a[8] = 1),
                    a
                  );
                }),
                (l.fromQuat = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = c + c,
                    h = d + d,
                    i = e + e,
                    j = c * g,
                    k = d * g,
                    l = d * h,
                    m = e * g,
                    n = e * h,
                    o = e * i,
                    p = f * g,
                    q = f * h,
                    r = f * i;
                  return (
                    (a[0] = 1 - l - o),
                    (a[3] = k - r),
                    (a[6] = m + q),
                    (a[1] = k + r),
                    (a[4] = 1 - j - o),
                    (a[7] = n - p),
                    (a[2] = m - q),
                    (a[5] = n + p),
                    (a[8] = 1 - j - l),
                    a
                  );
                }),
                (l.normalFromMat4 = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = b[4],
                    h = b[5],
                    i = b[6],
                    j = b[7],
                    k = b[8],
                    l = b[9],
                    m = b[10],
                    n = b[11],
                    o = b[12],
                    p = b[13],
                    q = b[14],
                    r = b[15],
                    s = c * h - d * g,
                    t = c * i - e * g,
                    u = c * j - f * g,
                    v = d * i - e * h,
                    w = d * j - f * h,
                    x = e * j - f * i,
                    y = k * p - l * o,
                    z = k * q - m * o,
                    A = k * r - n * o,
                    B = l * q - m * p,
                    C = l * r - n * p,
                    D = m * r - n * q,
                    E = s * D - t * C + u * B + v * A - w * z + x * y;
                  return E
                    ? ((E = 1 / E),
                      (a[0] = (h * D - i * C + j * B) * E),
                      (a[1] = (i * A - g * D - j * z) * E),
                      (a[2] = (g * C - h * A + j * y) * E),
                      (a[3] = (e * C - d * D - f * B) * E),
                      (a[4] = (c * D - e * A + f * z) * E),
                      (a[5] = (d * A - c * C - f * y) * E),
                      (a[6] = (p * x - q * w + r * v) * E),
                      (a[7] = (q * u - o * x - r * t) * E),
                      (a[8] = (o * w - p * u + r * s) * E),
                      a)
                    : null;
                }),
                (l.str = function (a) {
                  return (
                    "mat3(" +
                    a[0] +
                    ", " +
                    a[1] +
                    ", " +
                    a[2] +
                    ", " +
                    a[3] +
                    ", " +
                    a[4] +
                    ", " +
                    a[5] +
                    ", " +
                    a[6] +
                    ", " +
                    a[7] +
                    ", " +
                    a[8] +
                    ")"
                  );
                }),
                (l.frob = function (a) {
                  return Math.sqrt(
                    Math.pow(a[0], 2) +
                      Math.pow(a[1], 2) +
                      Math.pow(a[2], 2) +
                      Math.pow(a[3], 2) +
                      Math.pow(a[4], 2) +
                      Math.pow(a[5], 2) +
                      Math.pow(a[6], 2) +
                      Math.pow(a[7], 2) +
                      Math.pow(a[8], 2)
                  );
                }),
                "undefined" != typeof a && (a.mat3 = l);
              var m = {};
              (m.create = function () {
                var a = new c(16);
                return (
                  (a[0] = 1),
                  (a[1] = 0),
                  (a[2] = 0),
                  (a[3] = 0),
                  (a[4] = 0),
                  (a[5] = 1),
                  (a[6] = 0),
                  (a[7] = 0),
                  (a[8] = 0),
                  (a[9] = 0),
                  (a[10] = 1),
                  (a[11] = 0),
                  (a[12] = 0),
                  (a[13] = 0),
                  (a[14] = 0),
                  (a[15] = 1),
                  a
                );
              }),
                (m.clone = function (a) {
                  var b = new c(16);
                  return (
                    (b[0] = a[0]),
                    (b[1] = a[1]),
                    (b[2] = a[2]),
                    (b[3] = a[3]),
                    (b[4] = a[4]),
                    (b[5] = a[5]),
                    (b[6] = a[6]),
                    (b[7] = a[7]),
                    (b[8] = a[8]),
                    (b[9] = a[9]),
                    (b[10] = a[10]),
                    (b[11] = a[11]),
                    (b[12] = a[12]),
                    (b[13] = a[13]),
                    (b[14] = a[14]),
                    (b[15] = a[15]),
                    b
                  );
                }),
                (m.copy = function (a, b) {
                  return (
                    (a[0] = b[0]),
                    (a[1] = b[1]),
                    (a[2] = b[2]),
                    (a[3] = b[3]),
                    (a[4] = b[4]),
                    (a[5] = b[5]),
                    (a[6] = b[6]),
                    (a[7] = b[7]),
                    (a[8] = b[8]),
                    (a[9] = b[9]),
                    (a[10] = b[10]),
                    (a[11] = b[11]),
                    (a[12] = b[12]),
                    (a[13] = b[13]),
                    (a[14] = b[14]),
                    (a[15] = b[15]),
                    a
                  );
                }),
                (m.identity = function (a) {
                  return (
                    (a[0] = 1),
                    (a[1] = 0),
                    (a[2] = 0),
                    (a[3] = 0),
                    (a[4] = 0),
                    (a[5] = 1),
                    (a[6] = 0),
                    (a[7] = 0),
                    (a[8] = 0),
                    (a[9] = 0),
                    (a[10] = 1),
                    (a[11] = 0),
                    (a[12] = 0),
                    (a[13] = 0),
                    (a[14] = 0),
                    (a[15] = 1),
                    a
                  );
                }),
                (m.transpose = function (a, b) {
                  if (a === b) {
                    var c = b[1],
                      d = b[2],
                      e = b[3],
                      f = b[6],
                      g = b[7],
                      h = b[11];
                    (a[1] = b[4]),
                      (a[2] = b[8]),
                      (a[3] = b[12]),
                      (a[4] = c),
                      (a[6] = b[9]),
                      (a[7] = b[13]),
                      (a[8] = d),
                      (a[9] = f),
                      (a[11] = b[14]),
                      (a[12] = e),
                      (a[13] = g),
                      (a[14] = h);
                  } else
                    (a[0] = b[0]),
                      (a[1] = b[4]),
                      (a[2] = b[8]),
                      (a[3] = b[12]),
                      (a[4] = b[1]),
                      (a[5] = b[5]),
                      (a[6] = b[9]),
                      (a[7] = b[13]),
                      (a[8] = b[2]),
                      (a[9] = b[6]),
                      (a[10] = b[10]),
                      (a[11] = b[14]),
                      (a[12] = b[3]),
                      (a[13] = b[7]),
                      (a[14] = b[11]),
                      (a[15] = b[15]);
                  return a;
                }),
                (m.invert = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = b[4],
                    h = b[5],
                    i = b[6],
                    j = b[7],
                    k = b[8],
                    l = b[9],
                    m = b[10],
                    n = b[11],
                    o = b[12],
                    p = b[13],
                    q = b[14],
                    r = b[15],
                    s = c * h - d * g,
                    t = c * i - e * g,
                    u = c * j - f * g,
                    v = d * i - e * h,
                    w = d * j - f * h,
                    x = e * j - f * i,
                    y = k * p - l * o,
                    z = k * q - m * o,
                    A = k * r - n * o,
                    B = l * q - m * p,
                    C = l * r - n * p,
                    D = m * r - n * q,
                    E = s * D - t * C + u * B + v * A - w * z + x * y;
                  return E
                    ? ((E = 1 / E),
                      (a[0] = (h * D - i * C + j * B) * E),
                      (a[1] = (e * C - d * D - f * B) * E),
                      (a[2] = (p * x - q * w + r * v) * E),
                      (a[3] = (m * w - l * x - n * v) * E),
                      (a[4] = (i * A - g * D - j * z) * E),
                      (a[5] = (c * D - e * A + f * z) * E),
                      (a[6] = (q * u - o * x - r * t) * E),
                      (a[7] = (k * x - m * u + n * t) * E),
                      (a[8] = (g * C - h * A + j * y) * E),
                      (a[9] = (d * A - c * C - f * y) * E),
                      (a[10] = (o * w - p * u + r * s) * E),
                      (a[11] = (l * u - k * w - n * s) * E),
                      (a[12] = (h * z - g * B - i * y) * E),
                      (a[13] = (c * B - d * z + e * y) * E),
                      (a[14] = (p * t - o * v - q * s) * E),
                      (a[15] = (k * v - l * t + m * s) * E),
                      a)
                    : null;
                }),
                (m.adjoint = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = b[4],
                    h = b[5],
                    i = b[6],
                    j = b[7],
                    k = b[8],
                    l = b[9],
                    m = b[10],
                    n = b[11],
                    o = b[12],
                    p = b[13],
                    q = b[14],
                    r = b[15];
                  return (
                    (a[0] =
                      h * (m * r - n * q) -
                      l * (i * r - j * q) +
                      p * (i * n - j * m)),
                    (a[1] = -(
                      d * (m * r - n * q) -
                      l * (e * r - f * q) +
                      p * (e * n - f * m)
                    )),
                    (a[2] =
                      d * (i * r - j * q) -
                      h * (e * r - f * q) +
                      p * (e * j - f * i)),
                    (a[3] = -(
                      d * (i * n - j * m) -
                      h * (e * n - f * m) +
                      l * (e * j - f * i)
                    )),
                    (a[4] = -(
                      g * (m * r - n * q) -
                      k * (i * r - j * q) +
                      o * (i * n - j * m)
                    )),
                    (a[5] =
                      c * (m * r - n * q) -
                      k * (e * r - f * q) +
                      o * (e * n - f * m)),
                    (a[6] = -(
                      c * (i * r - j * q) -
                      g * (e * r - f * q) +
                      o * (e * j - f * i)
                    )),
                    (a[7] =
                      c * (i * n - j * m) -
                      g * (e * n - f * m) +
                      k * (e * j - f * i)),
                    (a[8] =
                      g * (l * r - n * p) -
                      k * (h * r - j * p) +
                      o * (h * n - j * l)),
                    (a[9] = -(
                      c * (l * r - n * p) -
                      k * (d * r - f * p) +
                      o * (d * n - f * l)
                    )),
                    (a[10] =
                      c * (h * r - j * p) -
                      g * (d * r - f * p) +
                      o * (d * j - f * h)),
                    (a[11] = -(
                      c * (h * n - j * l) -
                      g * (d * n - f * l) +
                      k * (d * j - f * h)
                    )),
                    (a[12] = -(
                      g * (l * q - m * p) -
                      k * (h * q - i * p) +
                      o * (h * m - i * l)
                    )),
                    (a[13] =
                      c * (l * q - m * p) -
                      k * (d * q - e * p) +
                      o * (d * m - e * l)),
                    (a[14] = -(
                      c * (h * q - i * p) -
                      g * (d * q - e * p) +
                      o * (d * i - e * h)
                    )),
                    (a[15] =
                      c * (h * m - i * l) -
                      g * (d * m - e * l) +
                      k * (d * i - e * h)),
                    a
                  );
                }),
                (m.determinant = function (a) {
                  var b = a[0],
                    c = a[1],
                    d = a[2],
                    e = a[3],
                    f = a[4],
                    g = a[5],
                    h = a[6],
                    i = a[7],
                    j = a[8],
                    k = a[9],
                    l = a[10],
                    m = a[11],
                    n = a[12],
                    o = a[13],
                    p = a[14],
                    q = a[15],
                    r = b * g - c * f,
                    s = b * h - d * f,
                    t = b * i - e * f,
                    u = c * h - d * g,
                    v = c * i - e * g,
                    w = d * i - e * h,
                    x = j * o - k * n,
                    y = j * p - l * n,
                    z = j * q - m * n,
                    A = k * p - l * o,
                    B = k * q - m * o,
                    C = l * q - m * p;
                  return r * C - s * B + t * A + u * z - v * y + w * x;
                }),
                (m.multiply = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = b[4],
                    i = b[5],
                    j = b[6],
                    k = b[7],
                    l = b[8],
                    m = b[9],
                    n = b[10],
                    o = b[11],
                    p = b[12],
                    q = b[13],
                    r = b[14],
                    s = b[15],
                    t = c[0],
                    u = c[1],
                    v = c[2],
                    w = c[3];
                  return (
                    (a[0] = t * d + u * h + v * l + w * p),
                    (a[1] = t * e + u * i + v * m + w * q),
                    (a[2] = t * f + u * j + v * n + w * r),
                    (a[3] = t * g + u * k + v * o + w * s),
                    (t = c[4]),
                    (u = c[5]),
                    (v = c[6]),
                    (w = c[7]),
                    (a[4] = t * d + u * h + v * l + w * p),
                    (a[5] = t * e + u * i + v * m + w * q),
                    (a[6] = t * f + u * j + v * n + w * r),
                    (a[7] = t * g + u * k + v * o + w * s),
                    (t = c[8]),
                    (u = c[9]),
                    (v = c[10]),
                    (w = c[11]),
                    (a[8] = t * d + u * h + v * l + w * p),
                    (a[9] = t * e + u * i + v * m + w * q),
                    (a[10] = t * f + u * j + v * n + w * r),
                    (a[11] = t * g + u * k + v * o + w * s),
                    (t = c[12]),
                    (u = c[13]),
                    (v = c[14]),
                    (w = c[15]),
                    (a[12] = t * d + u * h + v * l + w * p),
                    (a[13] = t * e + u * i + v * m + w * q),
                    (a[14] = t * f + u * j + v * n + w * r),
                    (a[15] = t * g + u * k + v * o + w * s),
                    a
                  );
                }),
                (m.mul = m.multiply),
                (m.translate = function (a, b, c) {
                  var d,
                    e,
                    f,
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    m,
                    n,
                    o,
                    p = c[0],
                    q = c[1],
                    r = c[2];
                  return (
                    b === a
                      ? ((a[12] = b[0] * p + b[4] * q + b[8] * r + b[12]),
                        (a[13] = b[1] * p + b[5] * q + b[9] * r + b[13]),
                        (a[14] = b[2] * p + b[6] * q + b[10] * r + b[14]),
                        (a[15] = b[3] * p + b[7] * q + b[11] * r + b[15]))
                      : ((d = b[0]),
                        (e = b[1]),
                        (f = b[2]),
                        (g = b[3]),
                        (h = b[4]),
                        (i = b[5]),
                        (j = b[6]),
                        (k = b[7]),
                        (l = b[8]),
                        (m = b[9]),
                        (n = b[10]),
                        (o = b[11]),
                        (a[0] = d),
                        (a[1] = e),
                        (a[2] = f),
                        (a[3] = g),
                        (a[4] = h),
                        (a[5] = i),
                        (a[6] = j),
                        (a[7] = k),
                        (a[8] = l),
                        (a[9] = m),
                        (a[10] = n),
                        (a[11] = o),
                        (a[12] = d * p + h * q + l * r + b[12]),
                        (a[13] = e * p + i * q + m * r + b[13]),
                        (a[14] = f * p + j * q + n * r + b[14]),
                        (a[15] = g * p + k * q + o * r + b[15])),
                    a
                  );
                }),
                (m.scale = function (a, b, c) {
                  var d = c[0],
                    e = c[1],
                    f = c[2];
                  return (
                    (a[0] = b[0] * d),
                    (a[1] = b[1] * d),
                    (a[2] = b[2] * d),
                    (a[3] = b[3] * d),
                    (a[4] = b[4] * e),
                    (a[5] = b[5] * e),
                    (a[6] = b[6] * e),
                    (a[7] = b[7] * e),
                    (a[8] = b[8] * f),
                    (a[9] = b[9] * f),
                    (a[10] = b[10] * f),
                    (a[11] = b[11] * f),
                    (a[12] = b[12]),
                    (a[13] = b[13]),
                    (a[14] = b[14]),
                    (a[15] = b[15]),
                    a
                  );
                }),
                (m.rotate = function (a, c, d, e) {
                  var f,
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    m,
                    n,
                    o,
                    p,
                    q,
                    r,
                    s,
                    t,
                    u,
                    v,
                    w,
                    x,
                    y,
                    z,
                    A,
                    B,
                    C,
                    D = e[0],
                    E = e[1],
                    F = e[2],
                    G = Math.sqrt(D * D + E * E + F * F);
                  return Math.abs(G) < b
                    ? null
                    : ((G = 1 / G),
                      (D *= G),
                      (E *= G),
                      (F *= G),
                      (f = Math.sin(d)),
                      (g = Math.cos(d)),
                      (h = 1 - g),
                      (i = c[0]),
                      (j = c[1]),
                      (k = c[2]),
                      (l = c[3]),
                      (m = c[4]),
                      (n = c[5]),
                      (o = c[6]),
                      (p = c[7]),
                      (q = c[8]),
                      (r = c[9]),
                      (s = c[10]),
                      (t = c[11]),
                      (u = D * D * h + g),
                      (v = E * D * h + F * f),
                      (w = F * D * h - E * f),
                      (x = D * E * h - F * f),
                      (y = E * E * h + g),
                      (z = F * E * h + D * f),
                      (A = D * F * h + E * f),
                      (B = E * F * h - D * f),
                      (C = F * F * h + g),
                      (a[0] = i * u + m * v + q * w),
                      (a[1] = j * u + n * v + r * w),
                      (a[2] = k * u + o * v + s * w),
                      (a[3] = l * u + p * v + t * w),
                      (a[4] = i * x + m * y + q * z),
                      (a[5] = j * x + n * y + r * z),
                      (a[6] = k * x + o * y + s * z),
                      (a[7] = l * x + p * y + t * z),
                      (a[8] = i * A + m * B + q * C),
                      (a[9] = j * A + n * B + r * C),
                      (a[10] = k * A + o * B + s * C),
                      (a[11] = l * A + p * B + t * C),
                      c !== a &&
                        ((a[12] = c[12]),
                        (a[13] = c[13]),
                        (a[14] = c[14]),
                        (a[15] = c[15])),
                      a);
                }),
                (m.rotateX = function (a, b, c) {
                  var d = Math.sin(c),
                    e = Math.cos(c),
                    f = b[4],
                    g = b[5],
                    h = b[6],
                    i = b[7],
                    j = b[8],
                    k = b[9],
                    l = b[10],
                    m = b[11];
                  return (
                    b !== a &&
                      ((a[0] = b[0]),
                      (a[1] = b[1]),
                      (a[2] = b[2]),
                      (a[3] = b[3]),
                      (a[12] = b[12]),
                      (a[13] = b[13]),
                      (a[14] = b[14]),
                      (a[15] = b[15])),
                    (a[4] = f * e + j * d),
                    (a[5] = g * e + k * d),
                    (a[6] = h * e + l * d),
                    (a[7] = i * e + m * d),
                    (a[8] = j * e - f * d),
                    (a[9] = k * e - g * d),
                    (a[10] = l * e - h * d),
                    (a[11] = m * e - i * d),
                    a
                  );
                }),
                (m.rotateY = function (a, b, c) {
                  var d = Math.sin(c),
                    e = Math.cos(c),
                    f = b[0],
                    g = b[1],
                    h = b[2],
                    i = b[3],
                    j = b[8],
                    k = b[9],
                    l = b[10],
                    m = b[11];
                  return (
                    b !== a &&
                      ((a[4] = b[4]),
                      (a[5] = b[5]),
                      (a[6] = b[6]),
                      (a[7] = b[7]),
                      (a[12] = b[12]),
                      (a[13] = b[13]),
                      (a[14] = b[14]),
                      (a[15] = b[15])),
                    (a[0] = f * e - j * d),
                    (a[1] = g * e - k * d),
                    (a[2] = h * e - l * d),
                    (a[3] = i * e - m * d),
                    (a[8] = f * d + j * e),
                    (a[9] = g * d + k * e),
                    (a[10] = h * d + l * e),
                    (a[11] = i * d + m * e),
                    a
                  );
                }),
                (m.rotateZ = function (a, b, c) {
                  var d = Math.sin(c),
                    e = Math.cos(c),
                    f = b[0],
                    g = b[1],
                    h = b[2],
                    i = b[3],
                    j = b[4],
                    k = b[5],
                    l = b[6],
                    m = b[7];
                  return (
                    b !== a &&
                      ((a[8] = b[8]),
                      (a[9] = b[9]),
                      (a[10] = b[10]),
                      (a[11] = b[11]),
                      (a[12] = b[12]),
                      (a[13] = b[13]),
                      (a[14] = b[14]),
                      (a[15] = b[15])),
                    (a[0] = f * e + j * d),
                    (a[1] = g * e + k * d),
                    (a[2] = h * e + l * d),
                    (a[3] = i * e + m * d),
                    (a[4] = j * e - f * d),
                    (a[5] = k * e - g * d),
                    (a[6] = l * e - h * d),
                    (a[7] = m * e - i * d),
                    a
                  );
                }),
                (m.fromRotationTranslation = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = d + d,
                    i = e + e,
                    j = f + f,
                    k = d * h,
                    l = d * i,
                    m = d * j,
                    n = e * i,
                    o = e * j,
                    p = f * j,
                    q = g * h,
                    r = g * i,
                    s = g * j;
                  return (
                    (a[0] = 1 - (n + p)),
                    (a[1] = l + s),
                    (a[2] = m - r),
                    (a[3] = 0),
                    (a[4] = l - s),
                    (a[5] = 1 - (k + p)),
                    (a[6] = o + q),
                    (a[7] = 0),
                    (a[8] = m + r),
                    (a[9] = o - q),
                    (a[10] = 1 - (k + n)),
                    (a[11] = 0),
                    (a[12] = c[0]),
                    (a[13] = c[1]),
                    (a[14] = c[2]),
                    (a[15] = 1),
                    a
                  );
                }),
                (m.fromQuat = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = c + c,
                    h = d + d,
                    i = e + e,
                    j = c * g,
                    k = d * g,
                    l = d * h,
                    m = e * g,
                    n = e * h,
                    o = e * i,
                    p = f * g,
                    q = f * h,
                    r = f * i;
                  return (
                    (a[0] = 1 - l - o),
                    (a[1] = k + r),
                    (a[2] = m - q),
                    (a[3] = 0),
                    (a[4] = k - r),
                    (a[5] = 1 - j - o),
                    (a[6] = n + p),
                    (a[7] = 0),
                    (a[8] = m + q),
                    (a[9] = n - p),
                    (a[10] = 1 - j - l),
                    (a[11] = 0),
                    (a[12] = 0),
                    (a[13] = 0),
                    (a[14] = 0),
                    (a[15] = 1),
                    a
                  );
                }),
                (m.frustum = function (a, b, c, d, e, f, g) {
                  var h = 1 / (c - b),
                    i = 1 / (e - d),
                    j = 1 / (f - g);
                  return (
                    (a[0] = 2 * f * h),
                    (a[1] = 0),
                    (a[2] = 0),
                    (a[3] = 0),
                    (a[4] = 0),
                    (a[5] = 2 * f * i),
                    (a[6] = 0),
                    (a[7] = 0),
                    (a[8] = (c + b) * h),
                    (a[9] = (e + d) * i),
                    (a[10] = (g + f) * j),
                    (a[11] = -1),
                    (a[12] = 0),
                    (a[13] = 0),
                    (a[14] = g * f * 2 * j),
                    (a[15] = 0),
                    a
                  );
                }),
                (m.perspective = function (a, b, c, d, e) {
                  var f = 1 / Math.tan(b / 2),
                    g = 1 / (d - e);
                  return (
                    (a[0] = f / c),
                    (a[1] = 0),
                    (a[2] = 0),
                    (a[3] = 0),
                    (a[4] = 0),
                    (a[5] = f),
                    (a[6] = 0),
                    (a[7] = 0),
                    (a[8] = 0),
                    (a[9] = 0),
                    (a[10] = (e + d) * g),
                    (a[11] = -1),
                    (a[12] = 0),
                    (a[13] = 0),
                    (a[14] = 2 * e * d * g),
                    (a[15] = 0),
                    a
                  );
                }),
                (m.ortho = function (a, b, c, d, e, f, g) {
                  var h = 1 / (b - c),
                    i = 1 / (d - e),
                    j = 1 / (f - g);
                  return (
                    (a[0] = -2 * h),
                    (a[1] = 0),
                    (a[2] = 0),
                    (a[3] = 0),
                    (a[4] = 0),
                    (a[5] = -2 * i),
                    (a[6] = 0),
                    (a[7] = 0),
                    (a[8] = 0),
                    (a[9] = 0),
                    (a[10] = 2 * j),
                    (a[11] = 0),
                    (a[12] = (b + c) * h),
                    (a[13] = (e + d) * i),
                    (a[14] = (g + f) * j),
                    (a[15] = 1),
                    a
                  );
                }),
                (m.lookAt = function (a, c, d, e) {
                  var f,
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    n,
                    o,
                    p,
                    q = c[0],
                    r = c[1],
                    s = c[2],
                    t = e[0],
                    u = e[1],
                    v = e[2],
                    w = d[0],
                    x = d[1],
                    y = d[2];
                  return Math.abs(q - w) < b &&
                    Math.abs(r - x) < b &&
                    Math.abs(s - y) < b
                    ? m.identity(a)
                    : ((l = q - w),
                      (n = r - x),
                      (o = s - y),
                      (p = 1 / Math.sqrt(l * l + n * n + o * o)),
                      (l *= p),
                      (n *= p),
                      (o *= p),
                      (f = u * o - v * n),
                      (g = v * l - t * o),
                      (h = t * n - u * l),
                      (p = Math.sqrt(f * f + g * g + h * h)),
                      p
                        ? ((p = 1 / p), (f *= p), (g *= p), (h *= p))
                        : ((f = 0), (g = 0), (h = 0)),
                      (i = n * h - o * g),
                      (j = o * f - l * h),
                      (k = l * g - n * f),
                      (p = Math.sqrt(i * i + j * j + k * k)),
                      p
                        ? ((p = 1 / p), (i *= p), (j *= p), (k *= p))
                        : ((i = 0), (j = 0), (k = 0)),
                      (a[0] = f),
                      (a[1] = i),
                      (a[2] = l),
                      (a[3] = 0),
                      (a[4] = g),
                      (a[5] = j),
                      (a[6] = n),
                      (a[7] = 0),
                      (a[8] = h),
                      (a[9] = k),
                      (a[10] = o),
                      (a[11] = 0),
                      (a[12] = -(f * q + g * r + h * s)),
                      (a[13] = -(i * q + j * r + k * s)),
                      (a[14] = -(l * q + n * r + o * s)),
                      (a[15] = 1),
                      a);
                }),
                (m.str = function (a) {
                  return (
                    "mat4(" +
                    a[0] +
                    ", " +
                    a[1] +
                    ", " +
                    a[2] +
                    ", " +
                    a[3] +
                    ", " +
                    a[4] +
                    ", " +
                    a[5] +
                    ", " +
                    a[6] +
                    ", " +
                    a[7] +
                    ", " +
                    a[8] +
                    ", " +
                    a[9] +
                    ", " +
                    a[10] +
                    ", " +
                    a[11] +
                    ", " +
                    a[12] +
                    ", " +
                    a[13] +
                    ", " +
                    a[14] +
                    ", " +
                    a[15] +
                    ")"
                  );
                }),
                (m.frob = function (a) {
                  return Math.sqrt(
                    Math.pow(a[0], 2) +
                      Math.pow(a[1], 2) +
                      Math.pow(a[2], 2) +
                      Math.pow(a[3], 2) +
                      Math.pow(a[4], 2) +
                      Math.pow(a[5], 2) +
                      Math.pow(a[6], 2) +
                      Math.pow(a[6], 2) +
                      Math.pow(a[7], 2) +
                      Math.pow(a[8], 2) +
                      Math.pow(a[9], 2) +
                      Math.pow(a[10], 2) +
                      Math.pow(a[11], 2) +
                      Math.pow(a[12], 2) +
                      Math.pow(a[13], 2) +
                      Math.pow(a[14], 2) +
                      Math.pow(a[15], 2)
                  );
                }),
                "undefined" != typeof a && (a.mat4 = m);
              var n = {};
              (n.create = function () {
                var a = new c(4);
                return (a[0] = 0), (a[1] = 0), (a[2] = 0), (a[3] = 1), a;
              }),
                (n.rotationTo = (function () {
                  var a = h.create(),
                    b = h.fromValues(1, 0, 0),
                    c = h.fromValues(0, 1, 0);
                  return function (d, e, f) {
                    var g = h.dot(e, f);
                    return -0.999999 > g
                      ? (h.cross(a, b, e),
                        h.length(a) < 1e-6 && h.cross(a, c, e),
                        h.normalize(a, a),
                        n.setAxisAngle(d, a, Math.PI),
                        d)
                      : g > 0.999999
                      ? ((d[0] = 0), (d[1] = 0), (d[2] = 0), (d[3] = 1), d)
                      : (h.cross(a, e, f),
                        (d[0] = a[0]),
                        (d[1] = a[1]),
                        (d[2] = a[2]),
                        (d[3] = 1 + g),
                        n.normalize(d, d));
                  };
                })()),
                (n.setAxes = (function () {
                  var a = l.create();
                  return function (b, c, d, e) {
                    return (
                      (a[0] = d[0]),
                      (a[3] = d[1]),
                      (a[6] = d[2]),
                      (a[1] = e[0]),
                      (a[4] = e[1]),
                      (a[7] = e[2]),
                      (a[2] = -c[0]),
                      (a[5] = -c[1]),
                      (a[8] = -c[2]),
                      n.normalize(b, n.fromMat3(b, a))
                    );
                  };
                })()),
                (n.clone = i.clone),
                (n.fromValues = i.fromValues),
                (n.copy = i.copy),
                (n.set = i.set),
                (n.identity = function (a) {
                  return (a[0] = 0), (a[1] = 0), (a[2] = 0), (a[3] = 1), a;
                }),
                (n.setAxisAngle = function (a, b, c) {
                  c = 0.5 * c;
                  var d = Math.sin(c);
                  return (
                    (a[0] = d * b[0]),
                    (a[1] = d * b[1]),
                    (a[2] = d * b[2]),
                    (a[3] = Math.cos(c)),
                    a
                  );
                }),
                (n.add = i.add),
                (n.multiply = function (a, b, c) {
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = c[0],
                    i = c[1],
                    j = c[2],
                    k = c[3];
                  return (
                    (a[0] = d * k + g * h + e * j - f * i),
                    (a[1] = e * k + g * i + f * h - d * j),
                    (a[2] = f * k + g * j + d * i - e * h),
                    (a[3] = g * k - d * h - e * i - f * j),
                    a
                  );
                }),
                (n.mul = n.multiply),
                (n.scale = i.scale),
                (n.rotateX = function (a, b, c) {
                  c *= 0.5;
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = Math.sin(c),
                    i = Math.cos(c);
                  return (
                    (a[0] = d * i + g * h),
                    (a[1] = e * i + f * h),
                    (a[2] = f * i - e * h),
                    (a[3] = g * i - d * h),
                    a
                  );
                }),
                (n.rotateY = function (a, b, c) {
                  c *= 0.5;
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = Math.sin(c),
                    i = Math.cos(c);
                  return (
                    (a[0] = d * i - f * h),
                    (a[1] = e * i + g * h),
                    (a[2] = f * i + d * h),
                    (a[3] = g * i - e * h),
                    a
                  );
                }),
                (n.rotateZ = function (a, b, c) {
                  c *= 0.5;
                  var d = b[0],
                    e = b[1],
                    f = b[2],
                    g = b[3],
                    h = Math.sin(c),
                    i = Math.cos(c);
                  return (
                    (a[0] = d * i + e * h),
                    (a[1] = e * i - d * h),
                    (a[2] = f * i + g * h),
                    (a[3] = g * i - f * h),
                    a
                  );
                }),
                (n.calculateW = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2];
                  return (
                    (a[0] = c),
                    (a[1] = d),
                    (a[2] = e),
                    (a[3] = -Math.sqrt(Math.abs(1 - c * c - d * d - e * e))),
                    a
                  );
                }),
                (n.dot = i.dot),
                (n.lerp = i.lerp),
                (n.slerp = function (a, b, c, d) {
                  var e,
                    f,
                    g,
                    h,
                    i,
                    j = b[0],
                    k = b[1],
                    l = b[2],
                    m = b[3],
                    n = c[0],
                    o = c[1],
                    p = c[2],
                    q = c[3];
                  return (
                    (f = j * n + k * o + l * p + m * q),
                    0 > f && ((f = -f), (n = -n), (o = -o), (p = -p), (q = -q)),
                    1 - f > 1e-6
                      ? ((e = Math.acos(f)),
                        (g = Math.sin(e)),
                        (h = Math.sin((1 - d) * e) / g),
                        (i = Math.sin(d * e) / g))
                      : ((h = 1 - d), (i = d)),
                    (a[0] = h * j + i * n),
                    (a[1] = h * k + i * o),
                    (a[2] = h * l + i * p),
                    (a[3] = h * m + i * q),
                    a
                  );
                }),
                (n.invert = function (a, b) {
                  var c = b[0],
                    d = b[1],
                    e = b[2],
                    f = b[3],
                    g = c * c + d * d + e * e + f * f,
                    h = g ? 1 / g : 0;
                  return (
                    (a[0] = -c * h),
                    (a[1] = -d * h),
                    (a[2] = -e * h),
                    (a[3] = f * h),
                    a
                  );
                }),
                (n.conjugate = function (a, b) {
                  return (
                    (a[0] = -b[0]),
                    (a[1] = -b[1]),
                    (a[2] = -b[2]),
                    (a[3] = b[3]),
                    a
                  );
                }),
                (n.length = i.length),
                (n.len = n.length),
                (n.squaredLength = i.squaredLength),
                (n.sqrLen = n.squaredLength),
                (n.normalize = i.normalize),
                (n.fromMat3 = function (a, b) {
                  var c,
                    d = b[0] + b[4] + b[8];
                  if (d > 0)
                    (c = Math.sqrt(d + 1)),
                      (a[3] = 0.5 * c),
                      (c = 0.5 / c),
                      (a[0] = (b[7] - b[5]) * c),
                      (a[1] = (b[2] - b[6]) * c),
                      (a[2] = (b[3] - b[1]) * c);
                  else {
                    var e = 0;
                    b[4] > b[0] && (e = 1), b[8] > b[3 * e + e] && (e = 2);
                    var f = (e + 1) % 3,
                      g = (e + 2) % 3;
                    (c = Math.sqrt(
                      b[3 * e + e] - b[3 * f + f] - b[3 * g + g] + 1
                    )),
                      (a[e] = 0.5 * c),
                      (c = 0.5 / c),
                      (a[3] = (b[3 * g + f] - b[3 * f + g]) * c),
                      (a[f] = (b[3 * f + e] + b[3 * e + f]) * c),
                      (a[g] = (b[3 * g + e] + b[3 * e + g]) * c);
                  }
                  return a;
                }),
                (n.str = function (a) {
                  return (
                    "quat(" +
                    a[0] +
                    ", " +
                    a[1] +
                    ", " +
                    a[2] +
                    ", " +
                    a[3] +
                    ")"
                  );
                }),
                "undefined" != typeof a && (a.quat = n);
            })(b.exports);
        })(this);
      },
      {},
    ],
    24: [
      function (a, b, c) {
        (function () {
          var a = this,
            d = a._,
            e = {},
            f = Array.prototype,
            g = Object.prototype,
            h = Function.prototype,
            i = f.push,
            j = f.slice,
            k = f.concat,
            l = g.toString,
            m = g.hasOwnProperty,
            n = f.forEach,
            o = f.map,
            p = f.reduce,
            q = f.reduceRight,
            r = f.filter,
            s = f.every,
            t = f.some,
            u = f.indexOf,
            v = f.lastIndexOf,
            w = Array.isArray,
            x = Object.keys,
            y = h.bind,
            z = function (a) {
              return a instanceof z
                ? a
                : this instanceof z
                ? void (this._wrapped = a)
                : new z(a);
            };
          "undefined" != typeof c
            ? ("undefined" != typeof b && b.exports && (c = b.exports = z),
              (c._ = z))
            : (a._ = z),
            (z.VERSION = "1.4.4");
          var A =
            (z.each =
            z.forEach =
              function (a, b, c) {
                if (null != a)
                  if (n && a.forEach === n) a.forEach(b, c);
                  else if (a.length === +a.length) {
                    for (var d = 0, f = a.length; f > d; d++)
                      if (b.call(c, a[d], d, a) === e) return;
                  } else
                    for (var g in a)
                      if (z.has(a, g) && b.call(c, a[g], g, a) === e) return;
              });
          z.map = z.collect = function (a, b, c) {
            var d = [];
            return null == a
              ? d
              : o && a.map === o
              ? a.map(b, c)
              : (A(a, function (a, e, f) {
                  d[d.length] = b.call(c, a, e, f);
                }),
                d);
          };
          var B = "Reduce of empty array with no initial value";
          (z.reduce =
            z.foldl =
            z.inject =
              function (a, b, c, d) {
                var e = arguments.length > 2;
                if ((null == a && (a = []), p && a.reduce === p))
                  return (
                    d && (b = z.bind(b, d)), e ? a.reduce(b, c) : a.reduce(b)
                  );
                if (
                  (A(a, function (a, f, g) {
                    e ? (c = b.call(d, c, a, f, g)) : ((c = a), (e = !0));
                  }),
                  !e)
                )
                  throw new TypeError(B);
                return c;
              }),
            (z.reduceRight = z.foldr =
              function (a, b, c, d) {
                var e = arguments.length > 2;
                if ((null == a && (a = []), q && a.reduceRight === q))
                  return (
                    d && (b = z.bind(b, d)),
                    e ? a.reduceRight(b, c) : a.reduceRight(b)
                  );
                var f = a.length;
                if (f !== +f) {
                  var g = z.keys(a);
                  f = g.length;
                }
                if (
                  (A(a, function (h, i, j) {
                    (i = g ? g[--f] : --f),
                      e
                        ? (c = b.call(d, c, a[i], i, j))
                        : ((c = a[i]), (e = !0));
                  }),
                  !e)
                )
                  throw new TypeError(B);
                return c;
              }),
            (z.find = z.detect =
              function (a, b, c) {
                var d;
                return (
                  C(a, function (a, e, f) {
                    return b.call(c, a, e, f) ? ((d = a), !0) : void 0;
                  }),
                  d
                );
              }),
            (z.filter = z.select =
              function (a, b, c) {
                var d = [];
                return null == a
                  ? d
                  : r && a.filter === r
                  ? a.filter(b, c)
                  : (A(a, function (a, e, f) {
                      b.call(c, a, e, f) && (d[d.length] = a);
                    }),
                    d);
              }),
            (z.reject = function (a, b, c) {
              return z.filter(
                a,
                function (a, d, e) {
                  return !b.call(c, a, d, e);
                },
                c
              );
            }),
            (z.every = z.all =
              function (a, b, c) {
                b || (b = z.identity);
                var d = !0;
                return null == a
                  ? d
                  : s && a.every === s
                  ? a.every(b, c)
                  : (A(a, function (a, f, g) {
                      return (d = d && b.call(c, a, f, g)) ? void 0 : e;
                    }),
                    !!d);
              });
          var C =
            (z.some =
            z.any =
              function (a, b, c) {
                b || (b = z.identity);
                var d = !1;
                return null == a
                  ? d
                  : t && a.some === t
                  ? a.some(b, c)
                  : (A(a, function (a, f, g) {
                      return d || (d = b.call(c, a, f, g)) ? e : void 0;
                    }),
                    !!d);
              });
          (z.contains = z.include =
            function (a, b) {
              return null == a
                ? !1
                : u && a.indexOf === u
                ? -1 != a.indexOf(b)
                : C(a, function (a) {
                    return a === b;
                  });
            }),
            (z.invoke = function (a, b) {
              var c = j.call(arguments, 2),
                d = z.isFunction(b);
              return z.map(a, function (a) {
                return (d ? b : a[b]).apply(a, c);
              });
            }),
            (z.pluck = function (a, b) {
              return z.map(a, function (a) {
                return a[b];
              });
            }),
            (z.where = function (a, b, c) {
              return z.isEmpty(b)
                ? c
                  ? null
                  : []
                : z[c ? "find" : "filter"](a, function (a) {
                    for (var c in b) if (b[c] !== a[c]) return !1;
                    return !0;
                  });
            }),
            (z.findWhere = function (a, b) {
              return z.where(a, b, !0);
            }),
            (z.max = function (a, b, c) {
              if (!b && z.isArray(a) && a[0] === +a[0] && a.length < 65535)
                return Math.max.apply(Math, a);
              if (!b && z.isEmpty(a)) return -1 / 0;
              var d = { computed: -1 / 0, value: -1 / 0 };
              return (
                A(a, function (a, e, f) {
                  var g = b ? b.call(c, a, e, f) : a;
                  g >= d.computed && (d = { value: a, computed: g });
                }),
                d.value
              );
            }),
            (z.min = function (a, b, c) {
              if (!b && z.isArray(a) && a[0] === +a[0] && a.length < 65535)
                return Math.min.apply(Math, a);
              if (!b && z.isEmpty(a)) return 1 / 0;
              var d = { computed: 1 / 0, value: 1 / 0 };
              return (
                A(a, function (a, e, f) {
                  var g = b ? b.call(c, a, e, f) : a;
                  g < d.computed && (d = { value: a, computed: g });
                }),
                d.value
              );
            }),
            (z.shuffle = function (a) {
              var b,
                c = 0,
                d = [];
              return (
                A(a, function (a) {
                  (b = z.random(c++)), (d[c - 1] = d[b]), (d[b] = a);
                }),
                d
              );
            });
          var D = function (a) {
            return z.isFunction(a)
              ? a
              : function (b) {
                  return b[a];
                };
          };
          z.sortBy = function (a, b, c) {
            var d = D(b);
            return z.pluck(
              z
                .map(a, function (a, b, e) {
                  return { value: a, index: b, criteria: d.call(c, a, b, e) };
                })
                .sort(function (a, b) {
                  var c = a.criteria,
                    d = b.criteria;
                  if (c !== d) {
                    if (c > d || void 0 === c) return 1;
                    if (d > c || void 0 === d) return -1;
                  }
                  return a.index < b.index ? -1 : 1;
                }),
              "value"
            );
          };
          var E = function (a, b, c, d) {
            var e = {},
              f = D(b || z.identity);
            return (
              A(a, function (b, g) {
                var h = f.call(c, b, g, a);
                d(e, h, b);
              }),
              e
            );
          };
          (z.groupBy = function (a, b, c) {
            return E(a, b, c, function (a, b, c) {
              (z.has(a, b) ? a[b] : (a[b] = [])).push(c);
            });
          }),
            (z.countBy = function (a, b, c) {
              return E(a, b, c, function (a, b) {
                z.has(a, b) || (a[b] = 0), a[b]++;
              });
            }),
            (z.sortedIndex = function (a, b, c, d) {
              c = null == c ? z.identity : D(c);
              for (var e = c.call(d, b), f = 0, g = a.length; g > f; ) {
                var h = (f + g) >>> 1;
                c.call(d, a[h]) < e ? (f = h + 1) : (g = h);
              }
              return f;
            }),
            (z.toArray = function (a) {
              return a
                ? z.isArray(a)
                  ? j.call(a)
                  : a.length === +a.length
                  ? z.map(a, z.identity)
                  : z.values(a)
                : [];
            }),
            (z.size = function (a) {
              return null == a
                ? 0
                : a.length === +a.length
                ? a.length
                : z.keys(a).length;
            }),
            (z.first =
              z.head =
              z.take =
                function (a, b, c) {
                  return null == a
                    ? void 0
                    : null == b || c
                    ? a[0]
                    : j.call(a, 0, b);
                }),
            (z.initial = function (a, b, c) {
              return j.call(a, 0, a.length - (null == b || c ? 1 : b));
            }),
            (z.last = function (a, b, c) {
              return null == a
                ? void 0
                : null == b || c
                ? a[a.length - 1]
                : j.call(a, Math.max(a.length - b, 0));
            }),
            (z.rest =
              z.tail =
              z.drop =
                function (a, b, c) {
                  return j.call(a, null == b || c ? 1 : b);
                }),
            (z.compact = function (a) {
              return z.filter(a, z.identity);
            });
          var F = function (a, b, c) {
            return (
              A(a, function (a) {
                z.isArray(a) ? (b ? i.apply(c, a) : F(a, b, c)) : c.push(a);
              }),
              c
            );
          };
          (z.flatten = function (a, b) {
            return F(a, b, []);
          }),
            (z.without = function (a) {
              return z.difference(a, j.call(arguments, 1));
            }),
            (z.uniq = z.unique =
              function (a, b, c, d) {
                z.isFunction(b) && ((d = c), (c = b), (b = !1));
                var e = c ? z.map(a, c, d) : a,
                  f = [],
                  g = [];
                return (
                  A(e, function (c, d) {
                    (b ? d && g[g.length - 1] === c : z.contains(g, c)) ||
                      (g.push(c), f.push(a[d]));
                  }),
                  f
                );
              }),
            (z.union = function () {
              return z.uniq(k.apply(f, arguments));
            }),
            (z.intersection = function (a) {
              var b = j.call(arguments, 1);
              return z.filter(z.uniq(a), function (a) {
                return z.every(b, function (b) {
                  return z.indexOf(b, a) >= 0;
                });
              });
            }),
            (z.difference = function (a) {
              var b = k.apply(f, j.call(arguments, 1));
              return z.filter(a, function (a) {
                return !z.contains(b, a);
              });
            }),
            (z.zip = function () {
              for (
                var a = j.call(arguments),
                  b = z.max(z.pluck(a, "length")),
                  c = new Array(b),
                  d = 0;
                b > d;
                d++
              )
                c[d] = z.pluck(a, "" + d);
              return c;
            }),
            (z.object = function (a, b) {
              if (null == a) return {};
              for (var c = {}, d = 0, e = a.length; e > d; d++)
                b ? (c[a[d]] = b[d]) : (c[a[d][0]] = a[d][1]);
              return c;
            }),
            (z.indexOf = function (a, b, c) {
              if (null == a) return -1;
              var d = 0,
                e = a.length;
              if (c) {
                if ("number" != typeof c)
                  return (d = z.sortedIndex(a, b)), a[d] === b ? d : -1;
                d = 0 > c ? Math.max(0, e + c) : c;
              }
              if (u && a.indexOf === u) return a.indexOf(b, c);
              for (; e > d; d++) if (a[d] === b) return d;
              return -1;
            }),
            (z.lastIndexOf = function (a, b, c) {
              if (null == a) return -1;
              var d = null != c;
              if (v && a.lastIndexOf === v)
                return d ? a.lastIndexOf(b, c) : a.lastIndexOf(b);
              for (var e = d ? c : a.length; e--; ) if (a[e] === b) return e;
              return -1;
            }),
            (z.range = function (a, b, c) {
              arguments.length <= 1 && ((b = a || 0), (a = 0)),
                (c = arguments[2] || 1);
              for (
                var d = Math.max(Math.ceil((b - a) / c), 0),
                  e = 0,
                  f = new Array(d);
                d > e;

              )
                (f[e++] = a), (a += c);
              return f;
            }),
            (z.bind = function (a, b) {
              if (a.bind === y && y) return y.apply(a, j.call(arguments, 1));
              var c = j.call(arguments, 2);
              return function () {
                return a.apply(b, c.concat(j.call(arguments)));
              };
            }),
            (z.partial = function (a) {
              var b = j.call(arguments, 1);
              return function () {
                return a.apply(this, b.concat(j.call(arguments)));
              };
            }),
            (z.bindAll = function (a) {
              var b = j.call(arguments, 1);
              return (
                0 === b.length && (b = z.functions(a)),
                A(b, function (b) {
                  a[b] = z.bind(a[b], a);
                }),
                a
              );
            }),
            (z.memoize = function (a, b) {
              var c = {};
              return (
                b || (b = z.identity),
                function () {
                  var d = b.apply(this, arguments);
                  return z.has(c, d) ? c[d] : (c[d] = a.apply(this, arguments));
                }
              );
            }),
            (z.delay = function (a, b) {
              var c = j.call(arguments, 2);
              return setTimeout(function () {
                return a.apply(null, c);
              }, b);
            }),
            (z.defer = function (a) {
              return z.delay.apply(z, [a, 1].concat(j.call(arguments, 1)));
            }),
            (z.throttle = function (a, b) {
              var c,
                d,
                e,
                f,
                g = 0,
                h = function () {
                  (g = new Date()), (e = null), (f = a.apply(c, d));
                };
              return function () {
                var i = new Date(),
                  j = b - (i - g);
                return (
                  (c = this),
                  (d = arguments),
                  0 >= j
                    ? (clearTimeout(e),
                      (e = null),
                      (g = i),
                      (f = a.apply(c, d)))
                    : e || (e = setTimeout(h, j)),
                  f
                );
              };
            }),
            (z.debounce = function (a, b, c) {
              var d, e;
              return function () {
                var f = this,
                  g = arguments,
                  h = function () {
                    (d = null), c || (e = a.apply(f, g));
                  },
                  i = c && !d;
                return (
                  clearTimeout(d),
                  (d = setTimeout(h, b)),
                  i && (e = a.apply(f, g)),
                  e
                );
              };
            }),
            (z.once = function (a) {
              var b,
                c = !1;
              return function () {
                return c
                  ? b
                  : ((c = !0), (b = a.apply(this, arguments)), (a = null), b);
              };
            }),
            (z.wrap = function (a, b) {
              return function () {
                var c = [a];
                return i.apply(c, arguments), b.apply(this, c);
              };
            }),
            (z.compose = function () {
              var a = arguments;
              return function () {
                for (var b = arguments, c = a.length - 1; c >= 0; c--)
                  b = [a[c].apply(this, b)];
                return b[0];
              };
            }),
            (z.after = function (a, b) {
              return 0 >= a
                ? b()
                : function () {
                    return --a < 1 ? b.apply(this, arguments) : void 0;
                  };
            }),
            (z.keys =
              x ||
              function (a) {
                if (a !== Object(a)) throw new TypeError("Invalid object");
                var b = [];
                for (var c in a) z.has(a, c) && (b[b.length] = c);
                return b;
              }),
            (z.values = function (a) {
              var b = [];
              for (var c in a) z.has(a, c) && b.push(a[c]);
              return b;
            }),
            (z.pairs = function (a) {
              var b = [];
              for (var c in a) z.has(a, c) && b.push([c, a[c]]);
              return b;
            }),
            (z.invert = function (a) {
              var b = {};
              for (var c in a) z.has(a, c) && (b[a[c]] = c);
              return b;
            }),
            (z.functions = z.methods =
              function (a) {
                var b = [];
                for (var c in a) z.isFunction(a[c]) && b.push(c);
                return b.sort();
              }),
            (z.extend = function (a) {
              return (
                A(j.call(arguments, 1), function (b) {
                  if (b) for (var c in b) a[c] = b[c];
                }),
                a
              );
            }),
            (z.pick = function (a) {
              var b = {},
                c = k.apply(f, j.call(arguments, 1));
              return (
                A(c, function (c) {
                  c in a && (b[c] = a[c]);
                }),
                b
              );
            }),
            (z.omit = function (a) {
              var b = {},
                c = k.apply(f, j.call(arguments, 1));
              for (var d in a) z.contains(c, d) || (b[d] = a[d]);
              return b;
            }),
            (z.defaults = function (a) {
              return (
                A(j.call(arguments, 1), function (b) {
                  if (b) for (var c in b) null == a[c] && (a[c] = b[c]);
                }),
                a
              );
            }),
            (z.clone = function (a) {
              return z.isObject(a)
                ? z.isArray(a)
                  ? a.slice()
                  : z.extend({}, a)
                : a;
            }),
            (z.tap = function (a, b) {
              return b(a), a;
            });
          var G = function (a, b, c, d) {
            if (a === b) return 0 !== a || 1 / a == 1 / b;
            if (null == a || null == b) return a === b;
            a instanceof z && (a = a._wrapped),
              b instanceof z && (b = b._wrapped);
            var e = l.call(a);
            if (e != l.call(b)) return !1;
            switch (e) {
              case "[object String]":
                return a == String(b);
              case "[object Number]":
                return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
              case "[object Date]":
              case "[object Boolean]":
                return +a == +b;
              case "[object RegExp]":
                return (
                  a.source == b.source &&
                  a.global == b.global &&
                  a.multiline == b.multiline &&
                  a.ignoreCase == b.ignoreCase
                );
            }
            if ("object" != typeof a || "object" != typeof b) return !1;
            for (var f = c.length; f--; ) if (c[f] == a) return d[f] == b;
            c.push(a), d.push(b);
            var g = 0,
              h = !0;
            if ("[object Array]" == e) {
              if (((g = a.length), (h = g == b.length)))
                for (; g-- && (h = G(a[g], b[g], c, d)); );
            } else {
              var i = a.constructor,
                j = b.constructor;
              if (
                i !== j &&
                !(
                  z.isFunction(i) &&
                  i instanceof i &&
                  z.isFunction(j) &&
                  j instanceof j
                )
              )
                return !1;
              for (var k in a)
                if (
                  z.has(a, k) &&
                  (g++, !(h = z.has(b, k) && G(a[k], b[k], c, d)))
                )
                  break;
              if (h) {
                for (k in b) if (z.has(b, k) && !g--) break;
                h = !g;
              }
            }
            return c.pop(), d.pop(), h;
          };
          (z.isEqual = function (a, b) {
            return G(a, b, [], []);
          }),
            (z.isEmpty = function (a) {
              if (null == a) return !0;
              if (z.isArray(a) || z.isString(a)) return 0 === a.length;
              for (var b in a) if (z.has(a, b)) return !1;
              return !0;
            }),
            (z.isElement = function (a) {
              return !(!a || 1 !== a.nodeType);
            }),
            (z.isArray =
              w ||
              function (a) {
                return "[object Array]" == l.call(a);
              }),
            (z.isObject = function (a) {
              return a === Object(a);
            }),
            A(
              ["Arguments", "Function", "String", "Number", "Date", "RegExp"],
              function (a) {
                z["is" + a] = function (b) {
                  return l.call(b) == "[object " + a + "]";
                };
              }
            ),
            z.isArguments(arguments) ||
              (z.isArguments = function (a) {
                return !(!a || !z.has(a, "callee"));
              }),
            "function" != typeof /./ &&
              (z.isFunction = function (a) {
                return "function" == typeof a;
              }),
            (z.isFinite = function (a) {
              return isFinite(a) && !isNaN(parseFloat(a));
            }),
            (z.isNaN = function (a) {
              return z.isNumber(a) && a != +a;
            }),
            (z.isBoolean = function (a) {
              return a === !0 || a === !1 || "[object Boolean]" == l.call(a);
            }),
            (z.isNull = function (a) {
              return null === a;
            }),
            (z.isUndefined = function (a) {
              return void 0 === a;
            }),
            (z.has = function (a, b) {
              return m.call(a, b);
            }),
            (z.noConflict = function () {
              return (a._ = d), this;
            }),
            (z.identity = function (a) {
              return a;
            }),
            (z.times = function (a, b, c) {
              for (var d = Array(a), e = 0; a > e; e++) d[e] = b.call(c, e);
              return d;
            }),
            (z.random = function (a, b) {
              return (
                null == b && ((b = a), (a = 0)),
                a + Math.floor(Math.random() * (b - a + 1))
              );
            });
          var H = {
            escape: {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#x27;",
              "/": "&#x2F;",
            },
          };
          H.unescape = z.invert(H.escape);
          var I = {
            escape: new RegExp("[" + z.keys(H.escape).join("") + "]", "g"),
            unescape: new RegExp("(" + z.keys(H.unescape).join("|") + ")", "g"),
          };
          z.each(["escape", "unescape"], function (a) {
            z[a] = function (b) {
              return null == b
                ? ""
                : ("" + b).replace(I[a], function (b) {
                    return H[a][b];
                  });
            };
          }),
            (z.result = function (a, b) {
              if (null == a) return null;
              var c = a[b];
              return z.isFunction(c) ? c.call(a) : c;
            }),
            (z.mixin = function (a) {
              A(z.functions(a), function (b) {
                var c = (z[b] = a[b]);
                z.prototype[b] = function () {
                  var a = [this._wrapped];
                  return i.apply(a, arguments), N.call(this, c.apply(z, a));
                };
              });
            });
          var J = 0;
          (z.uniqueId = function (a) {
            var b = ++J + "";
            return a ? a + b : b;
          }),
            (z.templateSettings = {
              evaluate: /<%([\s\S]+?)%>/g,
              interpolate: /<%=([\s\S]+?)%>/g,
              escape: /<%-([\s\S]+?)%>/g,
            });
          var K = /(.)^/,
            L = {
              "'": "'",
              "\\": "\\",
              "\r": "r",
              "\n": "n",
              "	": "t",
              "\u2028": "u2028",
              "\u2029": "u2029",
            },
            M = /\\|'|\r|\n|\t|\u2028|\u2029/g;
          (z.template = function (a, b, c) {
            var d;
            c = z.defaults({}, c, z.templateSettings);
            var e = new RegExp(
                [
                  (c.escape || K).source,
                  (c.interpolate || K).source,
                  (c.evaluate || K).source,
                ].join("|") + "|$",
                "g"
              ),
              f = 0,
              g = "__p+='";
            a.replace(e, function (b, c, d, e, h) {
              return (
                (g += a.slice(f, h).replace(M, function (a) {
                  return "\\" + L[a];
                })),
                c &&
                  (g += "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'"),
                d && (g += "'+\n((__t=(" + d + "))==null?'':__t)+\n'"),
                e && (g += "';\n" + e + "\n__p+='"),
                (f = h + b.length),
                b
              );
            }),
              (g += "';\n"),
              c.variable || (g = "with(obj||{}){\n" + g + "}\n"),
              (g =
                "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" +
                g +
                "return __p;\n");
            try {
              d = new Function(c.variable || "obj", "_", g);
            } catch (h) {
              throw ((h.source = g), h);
            }
            if (b) return d(b, z);
            var i = function (a) {
              return d.call(this, a, z);
            };
            return (
              (i.source =
                "function(" + (c.variable || "obj") + "){\n" + g + "}"),
              i
            );
          }),
            (z.chain = function (a) {
              return z(a).chain();
            });
          var N = function (a) {
            return this._chain ? z(a).chain() : a;
          };
          z.mixin(z),
            A(
              ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
              function (a) {
                var b = f[a];
                z.prototype[a] = function () {
                  var c = this._wrapped;
                  return (
                    b.apply(c, arguments),
                    ("shift" != a && "splice" != a) ||
                      0 !== c.length ||
                      delete c[0],
                    N.call(this, c)
                  );
                };
              }
            ),
            A(["concat", "join", "slice"], function (a) {
              var b = f[a];
              z.prototype[a] = function () {
                return N.call(this, b.apply(this._wrapped, arguments));
              };
            }),
            z.extend(z.prototype, {
              chain: function () {
                return (this._chain = !0), this;
              },
              value: function () {
                return this._wrapped;
              },
            });
        }).call(this);
      },
      {},
    ],
    25: [
      function (a) {
        "undefined" != typeof window &&
          "function" != typeof window.requestAnimationFrame &&
          (window.requestAnimationFrame =
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (a) {
              setTimeout(a, 1e3 / 60);
            }),
          (Leap = a("../lib/index"));
      },
      { "../lib/index": 11 },
    ],
  },
  {},
  [25]
);
