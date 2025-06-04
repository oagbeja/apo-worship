import { app as C, screen as S, BrowserWindow as I, ipcMain as V } from "electron";
import h from "path";
import { fileURLToPath as A } from "url";
import W from "fs";
import J from "os";
import q from "crypto";
import G from "fs/promises";
function Q(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var p = { exports: {} };
const H = "16.5.0", z = {
  version: H
};
var $;
function X() {
  if ($) return p.exports;
  $ = 1;
  const a = W, i = h, f = J, g = q, E = z.version, K = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  function L(e) {
    const n = {};
    let r = e.toString();
    r = r.replace(/\r\n?/mg, `
`);
    let s;
    for (; (s = K.exec(r)) != null; ) {
      const u = s[1];
      let t = s[2] || "";
      t = t.trim();
      const o = t[0];
      t = t.replace(/^(['"`])([\s\S]*)\1$/mg, "$2"), o === '"' && (t = t.replace(/\\n/g, `
`), t = t.replace(/\\r/g, "\r")), n[u] = t;
    }
    return n;
  }
  function Y(e) {
    const n = O(e), r = l.configDotenv({ path: n });
    if (!r.parsed) {
      const o = new Error(`MISSING_DATA: Cannot parse ${n} for an unknown reason`);
      throw o.code = "MISSING_DATA", o;
    }
    const s = b(e).split(","), u = s.length;
    let t;
    for (let o = 0; o < u; o++)
      try {
        const c = s[o].trim(), d = j(r, c);
        t = l.decrypt(d.ciphertext, d.key);
        break;
      } catch (c) {
        if (o + 1 >= u)
          throw c;
      }
    return l.parse(t);
  }
  function R(e) {
    console.log(`[dotenv@${E}][WARN] ${e}`);
  }
  function y(e) {
    console.log(`[dotenv@${E}][DEBUG] ${e}`);
  }
  function b(e) {
    return e && e.DOTENV_KEY && e.DOTENV_KEY.length > 0 ? e.DOTENV_KEY : process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0 ? process.env.DOTENV_KEY : "";
  }
  function j(e, n) {
    let r;
    try {
      r = new URL(n);
    } catch (c) {
      if (c.code === "ERR_INVALID_URL") {
        const d = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
        throw d.code = "INVALID_DOTENV_KEY", d;
      }
      throw c;
    }
    const s = r.password;
    if (!s) {
      const c = new Error("INVALID_DOTENV_KEY: Missing key part");
      throw c.code = "INVALID_DOTENV_KEY", c;
    }
    const u = r.searchParams.get("environment");
    if (!u) {
      const c = new Error("INVALID_DOTENV_KEY: Missing environment part");
      throw c.code = "INVALID_DOTENV_KEY", c;
    }
    const t = `DOTENV_VAULT_${u.toUpperCase()}`, o = e.parsed[t];
    if (!o) {
      const c = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${t} in your .env.vault file.`);
      throw c.code = "NOT_FOUND_DOTENV_ENVIRONMENT", c;
    }
    return { ciphertext: o, key: s };
  }
  function O(e) {
    let n = null;
    if (e && e.path && e.path.length > 0)
      if (Array.isArray(e.path))
        for (const r of e.path)
          a.existsSync(r) && (n = r.endsWith(".vault") ? r : `${r}.vault`);
      else
        n = e.path.endsWith(".vault") ? e.path : `${e.path}.vault`;
    else
      n = i.resolve(process.cwd(), ".env.vault");
    return a.existsSync(n) ? n : null;
  }
  function T(e) {
    return e[0] === "~" ? i.join(f.homedir(), e.slice(1)) : e;
  }
  function P(e) {
    !!(e && e.debug) && y("Loading env from encrypted .env.vault");
    const r = l._parseVault(e);
    let s = process.env;
    return e && e.processEnv != null && (s = e.processEnv), l.populate(s, r, e), { parsed: r };
  }
  function B(e) {
    const n = i.resolve(process.cwd(), ".env");
    let r = "utf8";
    const s = !!(e && e.debug);
    e && e.encoding ? r = e.encoding : s && y("No encoding is specified. UTF-8 is used by default");
    let u = [n];
    if (e && e.path)
      if (!Array.isArray(e.path))
        u = [T(e.path)];
      else {
        u = [];
        for (const d of e.path)
          u.push(T(d));
      }
    let t;
    const o = {};
    for (const d of u)
      try {
        const m = l.parse(a.readFileSync(d, { encoding: r }));
        l.populate(o, m, e);
      } catch (m) {
        s && y(`Failed to load ${d} ${m.message}`), t = m;
      }
    let c = process.env;
    return e && e.processEnv != null && (c = e.processEnv), l.populate(c, o, e), t ? { parsed: o, error: t } : { parsed: o };
  }
  function F(e) {
    if (b(e).length === 0)
      return l.configDotenv(e);
    const n = O(e);
    return n ? l._configVault(e) : (R(`You set DOTENV_KEY but you are missing a .env.vault file at ${n}. Did you forget to build it?`), l.configDotenv(e));
  }
  function M(e, n) {
    const r = Buffer.from(n.slice(-64), "hex");
    let s = Buffer.from(e, "base64");
    const u = s.subarray(0, 12), t = s.subarray(-16);
    s = s.subarray(12, -16);
    try {
      const o = g.createDecipheriv("aes-256-gcm", r, u);
      return o.setAuthTag(t), `${o.update(s)}${o.final()}`;
    } catch (o) {
      const c = o instanceof RangeError, d = o.message === "Invalid key length", m = o.message === "Unsupported state or unable to authenticate data";
      if (c || d) {
        const _ = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
        throw _.code = "INVALID_DOTENV_KEY", _;
      } else if (m) {
        const _ = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
        throw _.code = "DECRYPTION_FAILED", _;
      } else
        throw o;
    }
  }
  function U(e, n, r = {}) {
    const s = !!(r && r.debug), u = !!(r && r.override);
    if (typeof n != "object") {
      const t = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      throw t.code = "OBJECT_REQUIRED", t;
    }
    for (const t of Object.keys(n))
      Object.prototype.hasOwnProperty.call(e, t) ? (u === !0 && (e[t] = n[t]), s && y(u === !0 ? `"${t}" is already defined and WAS overwritten` : `"${t}" is already defined and was NOT overwritten`)) : e[t] = n[t];
  }
  const l = {
    configDotenv: B,
    _configVault: P,
    _parseVault: Y,
    config: F,
    decrypt: M,
    parse: L,
    populate: U
  };
  return p.exports.configDotenv = l.configDotenv, p.exports._configVault = l._configVault, p.exports._parseVault = l._parseVault, p.exports.config = l.config, p.exports.decrypt = l.decrypt, p.exports.parse = l.parse, p.exports.populate = l.populate, p.exports = l, p.exports;
}
var Z = X();
const ee = /* @__PURE__ */ Q(Z), te = A(import.meta.url), re = h.dirname(te), ne = h.join(re, "db", "tables", "KJV.json");
let w;
const x = async () => {
  if (!w) {
    const a = await G.readFile(ne, "utf-8");
    w = JSON.parse(a);
  }
};
async function oe(a, i) {
  try {
    await x();
    const g = w.books.find((v) => v.name === a);
    if (g && g.chapters instanceof Array) {
      const v = g.chapters.find(
        (E) => E.chapter === i
      );
      if (v) return v;
    }
    return console.log({ jsonLength: w.books.length }), null;
  } catch (f) {
    throw console.log(f), f;
  }
}
async function ae() {
  try {
    return await x(), w.books.map((i) => {
      var f;
      return {
        name: i.name,
        numberOfChapters: ((f = i == null ? void 0 : i.chapters) == null ? void 0 : f.length) ?? 0
      };
    });
  } catch (a) {
    throw console.log(a), a;
  }
}
const se = A(import.meta.url), D = h.dirname(se);
ee.config();
let k, N;
C.whenReady().then(() => {
  const a = S.getAllDisplays(), i = a.length > 1 ? a[1] : null;
  if (console.log({ __dirname: D }), k = new I({
    width: 800,
    height: 600,
    webPreferences: {
      preload: h.join(D, "preload.mjs")
    }
  }), k.loadFile(h.join(D, "../dist/index.html"), {
    hash: "/"
  }), i) {
    const { x: f, y: g, width: v, height: E } = i.bounds;
    N = new I({
      x: f,
      y: g,
      width: v,
      height: E,
      fullscreen: !0,
      frame: !1,
      alwaysOnTop: !0,
      webPreferences: {
        preload: h.join(D, "preload.mjs")
      }
    }), console.log(`${a.length} monitor detected`), N.loadFile(h.join(D, "../dist/index.html"), {
      hash: "presentation"
    });
  } else
    console.log("Only one monitor detected");
});
V.handle("get-verse", (a, i, f) => oe(i, f));
V.handle("get-books", (a) => ae());
V.on("trigger-presentation", (a, i) => {
  N && N.webContents.send("presentation-action", i);
});
