import { app as B, screen as S, BrowserWindow as T, ipcMain as A } from "electron";
import g from "path";
import { fileURLToPath as k } from "url";
import C from "fs";
import W from "os";
import q from "crypto";
import J from "fs/promises";
function G(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
}
var d = { exports: {} };
const Q = "16.5.0", H = {
  version: Q
};
var I;
function z() {
  if (I) return d.exports;
  I = 1;
  const l = C, u = g, p = W, v = q, E = H.version, x = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  function K(e) {
    const n = {};
    let r = e.toString();
    r = r.replace(/\r\n?/mg, `
`);
    let a;
    for (; (a = x.exec(r)) != null; ) {
      const i = a[1];
      let t = a[2] || "";
      t = t.trim();
      const o = t[0];
      t = t.replace(/^(['"`])([\s\S]*)\1$/mg, "$2"), o === '"' && (t = t.replace(/\\n/g, `
`), t = t.replace(/\\r/g, "\r")), n[i] = t;
    }
    return n;
  }
  function L(e) {
    const n = O(e), r = c.configDotenv({ path: n });
    if (!r.parsed) {
      const o = new Error(`MISSING_DATA: Cannot parse ${n} for an unknown reason`);
      throw o.code = "MISSING_DATA", o;
    }
    const a = V(e).split(","), i = a.length;
    let t;
    for (let o = 0; o < i; o++)
      try {
        const s = a[o].trim(), f = R(r, s);
        t = c.decrypt(f.ciphertext, f.key);
        break;
      } catch (s) {
        if (o + 1 >= i)
          throw s;
      }
    return c.parse(t);
  }
  function Y(e) {
    console.log(`[dotenv@${E}][WARN] ${e}`);
  }
  function _(e) {
    console.log(`[dotenv@${E}][DEBUG] ${e}`);
  }
  function V(e) {
    return e && e.DOTENV_KEY && e.DOTENV_KEY.length > 0 ? e.DOTENV_KEY : process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0 ? process.env.DOTENV_KEY : "";
  }
  function R(e, n) {
    let r;
    try {
      r = new URL(n);
    } catch (s) {
      if (s.code === "ERR_INVALID_URL") {
        const f = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
        throw f.code = "INVALID_DOTENV_KEY", f;
      }
      throw s;
    }
    const a = r.password;
    if (!a) {
      const s = new Error("INVALID_DOTENV_KEY: Missing key part");
      throw s.code = "INVALID_DOTENV_KEY", s;
    }
    const i = r.searchParams.get("environment");
    if (!i) {
      const s = new Error("INVALID_DOTENV_KEY: Missing environment part");
      throw s.code = "INVALID_DOTENV_KEY", s;
    }
    const t = `DOTENV_VAULT_${i.toUpperCase()}`, o = e.parsed[t];
    if (!o) {
      const s = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${t} in your .env.vault file.`);
      throw s.code = "NOT_FOUND_DOTENV_ENVIRONMENT", s;
    }
    return { ciphertext: o, key: a };
  }
  function O(e) {
    let n = null;
    if (e && e.path && e.path.length > 0)
      if (Array.isArray(e.path))
        for (const r of e.path)
          l.existsSync(r) && (n = r.endsWith(".vault") ? r : `${r}.vault`);
      else
        n = e.path.endsWith(".vault") ? e.path : `${e.path}.vault`;
    else
      n = u.resolve(process.cwd(), ".env.vault");
    return l.existsSync(n) ? n : null;
  }
  function b(e) {
    return e[0] === "~" ? u.join(p.homedir(), e.slice(1)) : e;
  }
  function j(e) {
    !!(e && e.debug) && _("Loading env from encrypted .env.vault");
    const r = c._parseVault(e);
    let a = process.env;
    return e && e.processEnv != null && (a = e.processEnv), c.populate(a, r, e), { parsed: r };
  }
  function P(e) {
    const n = u.resolve(process.cwd(), ".env");
    let r = "utf8";
    const a = !!(e && e.debug);
    e && e.encoding ? r = e.encoding : a && _("No encoding is specified. UTF-8 is used by default");
    let i = [n];
    if (e && e.path)
      if (!Array.isArray(e.path))
        i = [b(e.path)];
      else {
        i = [];
        for (const f of e.path)
          i.push(b(f));
      }
    let t;
    const o = {};
    for (const f of i)
      try {
        const m = c.parse(l.readFileSync(f, { encoding: r }));
        c.populate(o, m, e);
      } catch (m) {
        a && _(`Failed to load ${f} ${m.message}`), t = m;
      }
    let s = process.env;
    return e && e.processEnv != null && (s = e.processEnv), c.populate(s, o, e), t ? { parsed: o, error: t } : { parsed: o };
  }
  function F(e) {
    if (V(e).length === 0)
      return c.configDotenv(e);
    const n = O(e);
    return n ? c._configVault(e) : (Y(`You set DOTENV_KEY but you are missing a .env.vault file at ${n}. Did you forget to build it?`), c.configDotenv(e));
  }
  function M(e, n) {
    const r = Buffer.from(n.slice(-64), "hex");
    let a = Buffer.from(e, "base64");
    const i = a.subarray(0, 12), t = a.subarray(-16);
    a = a.subarray(12, -16);
    try {
      const o = v.createDecipheriv("aes-256-gcm", r, i);
      return o.setAuthTag(t), `${o.update(a)}${o.final()}`;
    } catch (o) {
      const s = o instanceof RangeError, f = o.message === "Invalid key length", m = o.message === "Unsupported state or unable to authenticate data";
      if (s || f) {
        const y = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
        throw y.code = "INVALID_DOTENV_KEY", y;
      } else if (m) {
        const y = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
        throw y.code = "DECRYPTION_FAILED", y;
      } else
        throw o;
    }
  }
  function U(e, n, r = {}) {
    const a = !!(r && r.debug), i = !!(r && r.override);
    if (typeof n != "object") {
      const t = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      throw t.code = "OBJECT_REQUIRED", t;
    }
    for (const t of Object.keys(n))
      Object.prototype.hasOwnProperty.call(e, t) ? (i === !0 && (e[t] = n[t]), a && _(i === !0 ? `"${t}" is already defined and WAS overwritten` : `"${t}" is already defined and was NOT overwritten`)) : e[t] = n[t];
  }
  const c = {
    configDotenv: P,
    _configVault: j,
    _parseVault: L,
    config: F,
    decrypt: M,
    parse: K,
    populate: U
  };
  return d.exports.configDotenv = c.configDotenv, d.exports._configVault = c._configVault, d.exports._parseVault = c._parseVault, d.exports.config = c.config, d.exports.decrypt = c.decrypt, d.exports.parse = c.parse, d.exports.populate = c.populate, d.exports = c, d.exports;
}
var X = z();
const Z = /* @__PURE__ */ G(X), ee = k(import.meta.url), te = g.dirname(ee), re = g.join(te, "db", "tables", "KJV.json");
let w;
async function ne(l, u) {
  try {
    if (!w) {
      const h = await J.readFile(re, "utf-8");
      w = JSON.parse(h);
    }
    const v = w.books.find((h) => h.name === l);
    if (v && v.chapters instanceof Array) {
      const h = v.chapters.find(
        (E) => E.chapter === u
      );
      if (h) return h;
    }
    return console.log({ jsonLength: w.books.length }), null;
  } catch (p) {
    throw console.log(p), p;
  }
}
const oe = k(import.meta.url), D = g.dirname(oe);
Z.config();
let $, N;
B.whenReady().then(() => {
  const l = S.getAllDisplays(), u = l.length > 1 ? l[1] : null;
  if (console.log({ __dirname: D }), $ = new T({
    width: 800,
    height: 600,
    webPreferences: {
      preload: g.join(D, "preload.mjs")
    }
  }), $.loadFile(g.join(D, "../dist/index.html"), {
    hash: "/"
  }), u) {
    const { x: p, y: v, width: h, height: E } = u.bounds;
    N = new T({
      x: p,
      y: v,
      width: h,
      height: E,
      fullscreen: !0,
      frame: !1,
      alwaysOnTop: !0,
      webPreferences: {
        preload: g.join(D, "preload.mjs")
      }
    }), console.log(`${l.length} monitor detected`), N.loadFile(g.join(D, "../dist/index.html"), {
      hash: "presentation"
    });
  } else
    console.log("Only one monitor detected");
});
A.handle("get-verse", (l, u, p) => ne(u, p));
A.on("trigger-presentation", (l, u) => {
  N && N.webContents.send("presentation-action", u);
});
