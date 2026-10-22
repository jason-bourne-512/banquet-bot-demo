// Banquet Bot demo: a made-up hotel and week. Loaded first on every page.
(function () {
  var DEMO_TODAY = "2026-11-16";

  // 1. Storage: this demo shares a web address with the real Banquet Bot, so every key it saves gets a "demo:" prefix
  //    and never touches the real site's sign-in or lists on the same phone.
  try {
    var S = Storage.prototype, g = S.getItem, s = S.setItem, r = S.removeItem, k = S.key, P = "demo:";
    S.getItem = function (x) { return g.call(this, P + x); };
    S.setItem = function (x, v) { return s.call(this, P + x, v); };
    S.removeItem = function (x) { return r.call(this, P + x); };
    S.clear = function () { for (var i = this.length - 1; i >= 0; i--) { var y = k.call(this, i); if (y && y.indexOf(P) == 0) r.call(this, y); } };
  } catch (e) {}

  // 2. Clock: real time of day, but the date is always the demo Monday, so the sample week never goes stale.
  try {
    var R = Date, today = new Intl.DateTimeFormat("en-CA", {timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit"}).format(new R());
    var off = R.parse(DEMO_TODAY + "T12:00:00Z") - R.parse(today + "T12:00:00Z");
    var D = function () {
      if (!(this instanceof D)) return new R(R.now() + off).toString();
      if (!arguments.length) return new R(R.now() + off);
      return new (Function.prototype.bind.apply(R, [null].concat([].slice.call(arguments))))();
    };
    D.prototype = R.prototype; D.now = function () { return R.now() + off; }; D.parse = R.parse; D.UTC = R.UTC;
    window.Date = D;
  } catch (e) {}

  // 3. Who you're viewing as (picked on the home page). Default: the captain.
  var ROLES = {
    server:   {name: "Nina",  role: "hsm",      label: "Server"},
    houseman: {name: "Theo",  role: "hsm",      label: "Houseman"},
    captain:  {name: "Sam",   role: "captain",  label: "Captain"},
    director: {name: "Andre", role: "director", label: "Director"}
  };
  function cur() { try { return localStorage.getItem("bb-demo-role") || "captain"; } catch (e) { return "captain"; } }
  function setRole(k) {
    var p = ROLES[k] || ROLES.captain;
    try { localStorage.setItem("bb-demo-role", k); localStorage.setItem("bb-hsm-who", JSON.stringify({name: p.name, role: p.role})); } catch (e) {}
  }
  setRole(cur());
  window.bbDemo = {roles: ROLES, role: cur, set: setRole,
    reset: function () { try { localStorage.clear(); } catch (e) {} setRole("captain"); }};
  window.bbTheme = {signIn: function () {}, off: function () {}};

  // 4. A small "DEMO · Sam, Captain" tag on every page except home; tap it to go home and switch.
  if (!/(^|\/)(index\.html)?$/.test(location.pathname)) {
    var tag = function () {
      var p = ROLES[cur()] || ROLES.captain, a = document.createElement("a");
      a.href = "index.html"; a.id = "bb-demo-tag"; a.textContent = "DEMO · " + p.name + ", " + p.label;
      a.style.cssText = "position:fixed;left:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 10px);z-index:2147483000;" +
        "padding:6px 10px;border-radius:14px;background:#f2c879;color:#1b1406;font:800 10.5px/1 Manrope,-apple-system,sans-serif;" +
        "letter-spacing:.08em;text-decoration:none;box-shadow:0 4px 12px #0008;opacity:.92";
      document.body.appendChild(a);
    };
    if (document.body) tag(); else document.addEventListener("DOMContentLoaded", tag);
    var st = document.createElement("style"); st.textContent = "@media print{#bb-demo-tag{display:none!important}}html.bbd #bb-demo-tag{display:none!important}"; document.head.appendChild(st);
  }
  // 5. Desktop mode for leads (captain / director) on a wide screen, same as the real site.
  var dk = document.createElement("script"); dk.src = "desktop.js"; dk.defer = true; document.head.appendChild(dk);
})();
