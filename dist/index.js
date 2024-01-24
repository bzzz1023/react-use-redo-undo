!(function (e, r) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = r(require("react")))
    : "function" == typeof define && define.amd
    ? define("react-use-redo-undo", ["react"], r)
    : "object" == typeof exports
    ? (exports["react-use-redo-undo"] = r(require("react")))
    : (e["react-use-redo-undo"] = r(e.react));
})(self, (e) =>
  (() => {
    "use strict";
    var r = {
        156: (r) => {
          r.exports = e;
        },
      },
      t = {};
    function o(e) {
      var n = t[e];
      if (void 0 !== n) return n.exports;
      var c = (t[e] = { exports: {} });
      return r[e](c, c.exports, o), c.exports;
    }
    (o.n = (e) => {
      var r = e && e.__esModule ? () => e.default : () => e;
      return o.d(r, { a: r }), r;
    }),
      (o.d = (e, r) => {
        for (var t in r)
          o.o(r, t) &&
            !o.o(e, t) &&
            Object.defineProperty(e, t, { enumerable: !0, get: r[t] });
      }),
      (o.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)),
      (o.r = (e) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      });
    var n = {};
    return (
      (() => {
        o.r(n), o.d(n, { default: () => u });
        var e = o(156);
        const r = (e) =>
          "[object Object]" === Object.prototype.toString.call(e);
        function t(e) {
          return "AsyncFunction" === e[Symbol.toStringTag];
        }
        const c = (e) =>
            void 0 === e ||
            "true" === e.toString() ||
            !(!r(e) || !e.executeSuccess) ||
            void 0,
          a = (e) =>
            !(r(e) && !e.executeSuccess) &&
            (void 0 === e || "false" !== e.toString()) &&
            void 0,
          u = () => {
            const [o, n] = (0, e.useState)({});
            let [u, s] = (0, e.useState)(-1),
              [m, d] = (0, e.useState)([]);
            const i = (0, e.useCallback)((e) => {
                const { commandName: r, execute: u, label: m } = e;
                (o[r] = (e) => {
                  try {
                    const { redo: o, undo: n } = u(e),
                      i = (t) => {
                        const u = c(t),
                          i = a(t);
                        if (u)
                          return (
                            s(
                              (e) => (
                                d((t) => [
                                  ...t.slice(0, e + 1),
                                  {
                                    commandName: r,
                                    redo: o,
                                    undo: n,
                                    label: m,
                                  },
                                ]),
                                e + 1
                              )
                            ),
                            { executeSuccess: !0, params: e, commandName: r }
                          );
                        if (i)
                          throw new Error(
                            "something is wrong with returned value"
                          );
                        return {
                          executeSuccess: !1,
                          params: e,
                          commandName: r,
                        };
                      };
                    return t(o)
                      ? new Promise((e) => {
                          o().then((r) => {
                            e(i(r));
                          });
                        })
                      : i(o());
                  } catch (e) {
                    console.log(`${e}`);
                  }
                }),
                  n({ ...o });
              }, []),
              l = (0, e.useCallback)(() => {
                try {
                  const e = m[u + 1];
                  if (!e) return;
                  const { redo: o, commandName: n } = e,
                    d = (e) => {
                      const t = c(e),
                        o = a(e),
                        u = (r(e) && e.params) || {};
                      if (t)
                        return (
                          s((e) => e + 1),
                          { executeSuccess: !0, params: u, commandName: n }
                        );
                      if (o)
                        throw new Error(
                          "something is wrong with returned value"
                        );
                      return { executeSuccess: !1, params: u, commandName: n };
                    };
                  return t(o)
                    ? new Promise((e) => {
                        o().then((r) => {
                          e(d(r));
                        });
                      })
                    : d(o());
                } catch (e) {
                  console.log(`Redo Error - ${e}`);
                }
              }, [m, u]),
              p = (0, e.useCallback)(() => {
                try {
                  const e = m[u];
                  if (!e) return;
                  const { undo: o, commandName: n } = e,
                    d = (e) => {
                      const t = c(e),
                        o = a(e),
                        u = (r(e) && e.params) || {};
                      if (t)
                        return (
                          s((e) => e - 1),
                          { executeSuccess: !0, params: u, commandName: n }
                        );
                      if (o)
                        throw new Error(
                          "something is wrong with returned value"
                        );
                      return { executeSuccess: !1, params: u, commandName: n };
                    };
                  return t(o)
                    ? new Promise((e) => {
                        o().then((r) => {
                          e(d(r));
                        });
                      })
                    : d(o());
                } catch (e) {
                  console.log(`Undo Error - ${e}`);
                }
              }, [m, u]);
            return {
              registerCommand: i,
              executeIndex: u,
              commandQueue: m,
              commandMap: o,
              redo: l,
              undo: p,
            };
          };
      })(),
      n
    );
  })()
);
