class X {
  constructor(e, t, i, n) {
    this.g1 = e, this.a1 = t, this.v1 = i, this.a2 = n, this.constrained = !1, this.x0 = 0;
  }
  #e(e) {
    const t = this.a1, i = this.v1, n = this.g1, l = e * e;
    let r = 0;
    return l < ((o) => o * o)(t / (n * n)) ? r = -n * e : l < ((o) => o * o)(t / (2 * n * n) + i * i / (2 * t)) ? r = -Math.sqrt(t * (2 * Math.abs(e) - t / (n * n))) * Math.sign(e) : r = -i * Math.sign(e), r;
  }
  setX0(e) {
    this.x0 = e;
  }
  calcNext(e, t, i) {
    const n = e - this.x0;
    if (this.constrained === !0)
      return {
        x: this.x0 + n + t * i,
        v: this.#e(n + t * i),
        constrained: !0
      };
    if (t < this.#e(n)) {
      const l = t + this.a2 * i, r = n + t * i;
      return l < this.#e(r) ? {
        x: this.x0 + r,
        v: l,
        constrained: !1
      } : (this.constrained = !0, {
        x: this.x0 + r,
        v: this.#e(r),
        constrained: !0
      });
    } else {
      const l = t - this.a2 * i, r = n + t * i;
      return l > this.#e(r) ? {
        x: this.x0 + r,
        v: l,
        constrained: !1
      } : (this.constrained = !0, {
        x: this.x0 + r,
        v: this.#e(r),
        constrained: !0
      });
    }
  }
  reset() {
    this.constrained = !1;
  }
}
function re(s) {
  const e = s.length;
  let t = 0, i = 0;
  for (; i < e; ) {
    let n = s.charCodeAt(i++);
    if (n & 4294967168)
      if (!(n & 4294965248))
        t += 2;
      else {
        if (n >= 55296 && n <= 56319 && i < e) {
          const l = s.charCodeAt(i);
          (l & 64512) === 56320 && (++i, n = ((n & 1023) << 10) + (l & 1023) + 65536);
        }
        n & 4294901760 ? t += 4 : t += 3;
      }
    else {
      t++;
      continue;
    }
  }
  return t;
}
function le(s, e, t) {
  const i = s.length;
  let n = t, l = 0;
  for (; l < i; ) {
    let r = s.charCodeAt(l++);
    if (r & 4294967168)
      if (!(r & 4294965248))
        e[n++] = r >> 6 & 31 | 192;
      else {
        if (r >= 55296 && r <= 56319 && l < i) {
          const o = s.charCodeAt(l);
          (o & 64512) === 56320 && (++l, r = ((r & 1023) << 10) + (o & 1023) + 65536);
        }
        r & 4294901760 ? (e[n++] = r >> 18 & 7 | 240, e[n++] = r >> 12 & 63 | 128, e[n++] = r >> 6 & 63 | 128) : (e[n++] = r >> 12 & 15 | 224, e[n++] = r >> 6 & 63 | 128);
      }
    else {
      e[n++] = r;
      continue;
    }
    e[n++] = r & 63 | 128;
  }
}
const ce = new TextEncoder(), ae = 50;
function fe(s, e, t) {
  ce.encodeInto(s, e.subarray(t));
}
function he(s, e, t) {
  s.length > ae ? fe(s, e, t) : le(s, e, t);
}
new TextDecoder();
class _ {
  constructor(e, t) {
    this.type = e, this.data = t;
  }
}
class z extends Error {
  constructor(e) {
    super(e);
    const t = Object.create(z.prototype);
    Object.setPrototypeOf(this, t), Object.defineProperty(this, "name", {
      configurable: !0,
      enumerable: !1,
      value: z.name
    });
  }
}
function de(s, e, t) {
  const i = t / 4294967296, n = t;
  s.setUint32(e, i), s.setUint32(e + 4, n);
}
function Z(s, e, t) {
  const i = Math.floor(t / 4294967296), n = t;
  s.setUint32(e, i), s.setUint32(e + 4, n);
}
function ue(s, e) {
  const t = s.getInt32(e), i = s.getUint32(e + 4);
  return t * 4294967296 + i;
}
const ge = -1, we = 4294967296 - 1, xe = 17179869184 - 1;
function pe({ sec: s, nsec: e }) {
  if (s >= 0 && e >= 0 && s <= xe)
    if (e === 0 && s <= we) {
      const t = new Uint8Array(4);
      return new DataView(t.buffer).setUint32(0, s), t;
    } else {
      const t = s / 4294967296, i = s & 4294967295, n = new Uint8Array(8), l = new DataView(n.buffer);
      return l.setUint32(0, e << 2 | t & 3), l.setUint32(4, i), n;
    }
  else {
    const t = new Uint8Array(12), i = new DataView(t.buffer);
    return i.setUint32(0, e), Z(i, 4, s), t;
  }
}
function me(s) {
  const e = s.getTime(), t = Math.floor(e / 1e3), i = (e - t * 1e3) * 1e6, n = Math.floor(i / 1e9);
  return {
    sec: t + n,
    nsec: i - n * 1e9
  };
}
function ye(s) {
  if (s instanceof Date) {
    const e = me(s);
    return pe(e);
  } else
    return null;
}
function Ue(s) {
  const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
  switch (s.byteLength) {
    case 4:
      return { sec: e.getUint32(0), nsec: 0 };
    case 8: {
      const t = e.getUint32(0), i = e.getUint32(4), n = (t & 3) * 4294967296 + i, l = t >>> 2;
      return { sec: n, nsec: l };
    }
    case 12: {
      const t = ue(e, 4), i = e.getUint32(0);
      return { sec: t, nsec: i };
    }
    default:
      throw new z(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${s.length}`);
  }
}
function ve(s) {
  const e = Ue(s);
  return new Date(e.sec * 1e3 + e.nsec / 1e6);
}
const Se = {
  type: ge,
  encode: ye,
  decode: ve
};
class J {
  constructor() {
    this.builtInEncoders = [], this.builtInDecoders = [], this.encoders = [], this.decoders = [], this.register(Se);
  }
  register({ type: e, encode: t, decode: i }) {
    if (e >= 0)
      this.encoders[e] = t, this.decoders[e] = i;
    else {
      const n = -1 - e;
      this.builtInEncoders[n] = t, this.builtInDecoders[n] = i;
    }
  }
  tryToEncode(e, t) {
    for (let i = 0; i < this.builtInEncoders.length; i++) {
      const n = this.builtInEncoders[i];
      if (n != null) {
        const l = n(e, t);
        if (l != null) {
          const r = -1 - i;
          return new _(r, l);
        }
      }
    }
    for (let i = 0; i < this.encoders.length; i++) {
      const n = this.encoders[i];
      if (n != null) {
        const l = n(e, t);
        if (l != null) {
          const r = i;
          return new _(r, l);
        }
      }
    }
    return e instanceof _ ? e : null;
  }
  decode(e, t, i) {
    const n = t < 0 ? this.builtInDecoders[-1 - t] : this.decoders[t];
    return n ? n(e, t, i) : new _(t, e);
  }
}
J.defaultCodec = new J();
function Ee(s) {
  return s instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && s instanceof SharedArrayBuffer;
}
function Te(s) {
  return s instanceof Uint8Array ? s : ArrayBuffer.isView(s) ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : Ee(s) ? new Uint8Array(s) : Uint8Array.from(s);
}
const Ie = 100, Ae = 2048;
class q {
  constructor(e) {
    this.entered = !1, this.extensionCodec = e?.extensionCodec ?? J.defaultCodec, this.context = e?.context, this.useBigInt64 = e?.useBigInt64 ?? !1, this.maxDepth = e?.maxDepth ?? Ie, this.initialBufferSize = e?.initialBufferSize ?? Ae, this.sortKeys = e?.sortKeys ?? !1, this.forceFloat32 = e?.forceFloat32 ?? !1, this.ignoreUndefined = e?.ignoreUndefined ?? !1, this.forceIntegerToFloat = e?.forceIntegerToFloat ?? !1, this.pos = 0, this.view = new DataView(new ArrayBuffer(this.initialBufferSize)), this.bytes = new Uint8Array(this.view.buffer);
  }
  clone() {
    return new q({
      extensionCodec: this.extensionCodec,
      context: this.context,
      useBigInt64: this.useBigInt64,
      maxDepth: this.maxDepth,
      initialBufferSize: this.initialBufferSize,
      sortKeys: this.sortKeys,
      forceFloat32: this.forceFloat32,
      ignoreUndefined: this.ignoreUndefined,
      forceIntegerToFloat: this.forceIntegerToFloat
    });
  }
  reinitializeState() {
    this.pos = 0;
  }
  /**
   * This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
   *
   * @returns Encodes the object and returns a shared reference the encoder's internal buffer.
   */
  encodeSharedRef(e) {
    if (this.entered)
      return this.clone().encodeSharedRef(e);
    try {
      return this.entered = !0, this.reinitializeState(), this.doEncode(e, 1), this.bytes.subarray(0, this.pos);
    } finally {
      this.entered = !1;
    }
  }
  /**
   * @returns Encodes the object and returns a copy of the encoder's internal buffer.
   */
  encode(e) {
    if (this.entered)
      return this.clone().encode(e);
    try {
      return this.entered = !0, this.reinitializeState(), this.doEncode(e, 1), this.bytes.slice(0, this.pos);
    } finally {
      this.entered = !1;
    }
  }
  doEncode(e, t) {
    if (t > this.maxDepth)
      throw new Error(`Too deep objects in depth ${t}`);
    e == null ? this.encodeNil() : typeof e == "boolean" ? this.encodeBoolean(e) : typeof e == "number" ? this.forceIntegerToFloat ? this.encodeNumberAsFloat(e) : this.encodeNumber(e) : typeof e == "string" ? this.encodeString(e) : this.useBigInt64 && typeof e == "bigint" ? this.encodeBigInt64(e) : this.encodeObject(e, t);
  }
  ensureBufferSizeToWrite(e) {
    const t = this.pos + e;
    this.view.byteLength < t && this.resizeBuffer(t * 2);
  }
  resizeBuffer(e) {
    const t = new ArrayBuffer(e), i = new Uint8Array(t), n = new DataView(t);
    i.set(this.bytes), this.view = n, this.bytes = i;
  }
  encodeNil() {
    this.writeU8(192);
  }
  encodeBoolean(e) {
    e === !1 ? this.writeU8(194) : this.writeU8(195);
  }
  encodeNumber(e) {
    !this.forceIntegerToFloat && Number.isSafeInteger(e) ? e >= 0 ? e < 128 ? this.writeU8(e) : e < 256 ? (this.writeU8(204), this.writeU8(e)) : e < 65536 ? (this.writeU8(205), this.writeU16(e)) : e < 4294967296 ? (this.writeU8(206), this.writeU32(e)) : this.useBigInt64 ? this.encodeNumberAsFloat(e) : (this.writeU8(207), this.writeU64(e)) : e >= -32 ? this.writeU8(224 | e + 32) : e >= -128 ? (this.writeU8(208), this.writeI8(e)) : e >= -32768 ? (this.writeU8(209), this.writeI16(e)) : e >= -2147483648 ? (this.writeU8(210), this.writeI32(e)) : this.useBigInt64 ? this.encodeNumberAsFloat(e) : (this.writeU8(211), this.writeI64(e)) : this.encodeNumberAsFloat(e);
  }
  encodeNumberAsFloat(e) {
    this.forceFloat32 ? (this.writeU8(202), this.writeF32(e)) : (this.writeU8(203), this.writeF64(e));
  }
  encodeBigInt64(e) {
    e >= BigInt(0) ? (this.writeU8(207), this.writeBigUint64(e)) : (this.writeU8(211), this.writeBigInt64(e));
  }
  writeStringHeader(e) {
    if (e < 32)
      this.writeU8(160 + e);
    else if (e < 256)
      this.writeU8(217), this.writeU8(e);
    else if (e < 65536)
      this.writeU8(218), this.writeU16(e);
    else if (e < 4294967296)
      this.writeU8(219), this.writeU32(e);
    else
      throw new Error(`Too long string: ${e} bytes in UTF-8`);
  }
  encodeString(e) {
    const i = re(e);
    this.ensureBufferSizeToWrite(5 + i), this.writeStringHeader(i), he(e, this.bytes, this.pos), this.pos += i;
  }
  encodeObject(e, t) {
    const i = this.extensionCodec.tryToEncode(e, this.context);
    if (i != null)
      this.encodeExtension(i);
    else if (Array.isArray(e))
      this.encodeArray(e, t);
    else if (ArrayBuffer.isView(e))
      this.encodeBinary(e);
    else if (typeof e == "object")
      this.encodeMap(e, t);
    else
      throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(e)}`);
  }
  encodeBinary(e) {
    const t = e.byteLength;
    if (t < 256)
      this.writeU8(196), this.writeU8(t);
    else if (t < 65536)
      this.writeU8(197), this.writeU16(t);
    else if (t < 4294967296)
      this.writeU8(198), this.writeU32(t);
    else
      throw new Error(`Too large binary: ${t}`);
    const i = Te(e);
    this.writeU8a(i);
  }
  encodeArray(e, t) {
    const i = e.length;
    if (i < 16)
      this.writeU8(144 + i);
    else if (i < 65536)
      this.writeU8(220), this.writeU16(i);
    else if (i < 4294967296)
      this.writeU8(221), this.writeU32(i);
    else
      throw new Error(`Too large array: ${i}`);
    for (const n of e)
      this.doEncode(n, t + 1);
  }
  countWithoutUndefined(e, t) {
    let i = 0;
    for (const n of t)
      e[n] !== void 0 && i++;
    return i;
  }
  encodeMap(e, t) {
    const i = Object.keys(e);
    this.sortKeys && i.sort();
    const n = this.ignoreUndefined ? this.countWithoutUndefined(e, i) : i.length;
    if (n < 16)
      this.writeU8(128 + n);
    else if (n < 65536)
      this.writeU8(222), this.writeU16(n);
    else if (n < 4294967296)
      this.writeU8(223), this.writeU32(n);
    else
      throw new Error(`Too large map object: ${n}`);
    for (const l of i) {
      const r = e[l];
      this.ignoreUndefined && r === void 0 || (this.encodeString(l), this.doEncode(r, t + 1));
    }
  }
  encodeExtension(e) {
    if (typeof e.data == "function") {
      const i = e.data(this.pos + 6), n = i.length;
      if (n >= 4294967296)
        throw new Error(`Too large extension object: ${n}`);
      this.writeU8(201), this.writeU32(n), this.writeI8(e.type), this.writeU8a(i);
      return;
    }
    const t = e.data.length;
    if (t === 1)
      this.writeU8(212);
    else if (t === 2)
      this.writeU8(213);
    else if (t === 4)
      this.writeU8(214);
    else if (t === 8)
      this.writeU8(215);
    else if (t === 16)
      this.writeU8(216);
    else if (t < 256)
      this.writeU8(199), this.writeU8(t);
    else if (t < 65536)
      this.writeU8(200), this.writeU16(t);
    else if (t < 4294967296)
      this.writeU8(201), this.writeU32(t);
    else
      throw new Error(`Too large extension object: ${t}`);
    this.writeI8(e.type), this.writeU8a(e.data);
  }
  writeU8(e) {
    this.ensureBufferSizeToWrite(1), this.view.setUint8(this.pos, e), this.pos++;
  }
  writeU8a(e) {
    const t = e.length;
    this.ensureBufferSizeToWrite(t), this.bytes.set(e, this.pos), this.pos += t;
  }
  writeI8(e) {
    this.ensureBufferSizeToWrite(1), this.view.setInt8(this.pos, e), this.pos++;
  }
  writeU16(e) {
    this.ensureBufferSizeToWrite(2), this.view.setUint16(this.pos, e), this.pos += 2;
  }
  writeI16(e) {
    this.ensureBufferSizeToWrite(2), this.view.setInt16(this.pos, e), this.pos += 2;
  }
  writeU32(e) {
    this.ensureBufferSizeToWrite(4), this.view.setUint32(this.pos, e), this.pos += 4;
  }
  writeI32(e) {
    this.ensureBufferSizeToWrite(4), this.view.setInt32(this.pos, e), this.pos += 4;
  }
  writeF32(e) {
    this.ensureBufferSizeToWrite(4), this.view.setFloat32(this.pos, e), this.pos += 4;
  }
  writeF64(e) {
    this.ensureBufferSizeToWrite(8), this.view.setFloat64(this.pos, e), this.pos += 8;
  }
  writeU64(e) {
    this.ensureBufferSizeToWrite(8), de(this.view, this.pos, e), this.pos += 8;
  }
  writeI64(e) {
    this.ensureBufferSizeToWrite(8), Z(this.view, this.pos, e), this.pos += 8;
  }
  writeBigUint64(e) {
    this.ensureBufferSizeToWrite(8), this.view.setBigUint64(this.pos, e), this.pos += 8;
  }
  writeBigInt64(e) {
    this.ensureBufferSizeToWrite(8), this.view.setBigInt64(this.pos, e), this.pos += 8;
  }
}
function j(s, e) {
  return new q(e).encodeSharedRef(s);
}
const y = Object.freeze({
  initializing: 1,
  waitingRobotType: 2,
  generatorMaking: 3,
  generatorReady: 4,
  slrmReady: 5
}), m = Object.freeze({
  dormant: 1,
  converged: 2,
  moving: 3,
  rewinding: 4
});
let U = y.initializing, x = m.dormant;
console.log("Now intended to import ModuleFactory");
const D = await import("/wasm/slrm_module.js"), Me = await import("/wasm/cd_module.js");
console.log("ModuleFactory: ", D);
console.log("ModuleFactory.default type:", typeof D.default);
if (typeof D.default != "function")
  throw console.error("ModuleFactory.default is not a function:", D.default), new Error("ModuleFactory.default is not a valid function");
const d = await D.default();
if (!d)
  throw console.error("Failed to load SlrmModule"), new Error("SlrmModule could not be loaded");
const I = await Me.default();
if (!I)
  throw console.error("Failed to load CdModule"), new Error("CdModule could not be loaded");
const N = {
  [d.CmdVelGeneratorStatus.OK.value]: "OK",
  [d.CmdVelGeneratorStatus.ERROR.value]: "ERROR",
  [d.CmdVelGeneratorStatus.END.value]: "END",
  [d.CmdVelGeneratorStatus.SINGULARITY.value]: "SINGULARITY",
  [d.CmdVelGeneratorStatus.REWIND.value]: "REWIND"
}, ee = 4, Y = 0n / BigInt(ee);
let V = null, O = 0n, W = null, b = null, f = null, A = null, T = null, M = null;
const P = [], G = [];
let g = null, v = null, F = null, te = null, k = !1;
function be(s) {
  function e(t) {
    const i = new s.DoubleVector();
    for (let n = 0; n < t.length; ++n)
      i.push_back(t[n]);
    return i;
  }
  return {
    makeDoubleVector: e
    // ... more helpers
  };
}
function ke(s) {
  function e(i) {
    const n = new s.DoubleVector();
    for (let l = 0; l < i.length; ++l)
      n.push_back(i[l]);
    return n;
  }
  function t(i) {
    const n = new s.ConvexShape();
    for (let l = 0; l < i.length; ++l) {
      const r = i[l];
      n.push_back({ x: r[0], y: r[1], z: r[2] });
    }
    return n;
  }
  return {
    makeCdDoubleVector: e,
    makeConvexShape: t
  };
}
let ie = !1, w = null, $ = null, H = [], C = null;
function K(s) {
  C = s, w = new WebSocket(C), w.onopen = () => {
    for (console.log("WebSocket connected"); H.length > 0; )
      w.send(H.shift());
  }, w.onclose = (e) => {
    console.log("webSocket closed, will retry...", e.code, e.reason), Ve();
  }, w.onerror = (e) => {
    console.error("WebSocket error", e), w.close();
  };
}
function Ve() {
  $ || ($ = setTimeout(() => {
    $ = null, C && (console.log("Reconnecting..."), K(C));
  }, 3e3));
}
function Q(s, e) {
  function t(r, o) {
    const c = new r.DoubleVector();
    for (let a = 0; a < o.length; ++a)
      c.push_back(o[a]);
    return c;
  }
  function i(r, o) {
    const c = new r.JointModelFlatStructVector();
    for (let a = 0; a < o.length; ++a)
      c.push_back(o[a]);
    return c;
  }
  const n = e.map((r) => {
    const o = r.origin.$.xyz ?? [0, 0, 0], c = t(
      s,
      Array.isArray(o) && o.length === 3 ? o : [0, 0, 0]
    ), a = r.origin.$.rpy ?? [0, 0, 0], S = t(
      s,
      Array.isArray(a) && a.length === 3 ? a : [0, 0, 0]
    ), B = r.axis.$.xyz ?? [0, 0, 1], R = t(
      s,
      Array.isArray(B) && B.length === 3 ? B : [0, 0, 1]
    ), h = new s.JointModelFlatStruct(R, c, S);
    return R.delete(), c.delete(), S.delete(), h;
  });
  return { jointModelVector: i(s, n), jointModelsArray: n };
}
function Ce(s) {
  const e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  s.forEach((r) => {
    const o = r.parent.$.link, c = r.child.$.link;
    e.has(o) || e.set(o, []), e.get(o).push(r), t.set(c, (t.get(c) || 0) + 1), t.has(o) || t.set(o, 0), i.set(c, r);
  });
  const n = [];
  for (const [r, o] of t.entries())
    o === 0 && n.push(r);
  const l = [];
  for (; n.length > 0; ) {
    const r = n.shift(), o = e.get(r) || [];
    for (const c of o) {
      const a = c.child.$.link;
      l.push(c), t.set(a, t.get(a) - 1), t.get(a) === 0 && n.push(a);
    }
  }
  return l.length !== s.length && console.warn("Cycle detected or disconnected components in URDF joints"), l;
}
function ne(s, e) {
  for (const t in e) {
    if (!(t in s)) {
      console.warn("key in update.json:", t, " ignored");
      continue;
    }
    const i = e[t], n = s[t];
    i !== null && typeof i == "object" && !Array.isArray(i) && n !== null && typeof n == "object" && !Array.isArray(n) ? ne(n, i) : (console.warn("key:", t, "val:", s[t], "is replaced by", i), s[t] = i);
  }
  return s;
}
console.log("now setting onmessage");
self.onmessage = function(s) {
  const e = s.data;
  switch (e.type) {
    case "shutdown":
      w && (w.close(), w = null), d && d.delete(), self.postMessage({ type: "shutdown_complete" }), ie = !0;
      break;
    case "set_slrm_loglevel":
      e?.logLevel && 0 <= e.logLevel && e.logLevel <= 4 && d.setJsLogLevel(e.logLevel);
      break;
    case "set_cd_loglevel":
      e?.logLevel && 0 <= e.logLevel && e.logLevel <= 4 && I.setJsLogLevel(e.logLevel);
      break;
    case "init":
      if (U === y.waitingRobotType) {
        U = y.generatorMaking, console.log("constructing CmdVelGenerator with :", e.filename), console.log("URDF modifier file is", e.modifier);
        const { makeDoubleVector: t } = be(d), { makeCdDoubleVector: i, makeConvexShape: n } = ke(I);
        F = t, te = i, d.setJsLogLevel(2), fetch(e.filename).then((l) => l.json()).then((l) => {
          let r = !1, o = null;
          Array.isArray(l) ? (o = { ...l }, r = !0) : o = l, fetch(e.modifier).then((c) => c.json()).then((c) => {
            ne(o, c), o = Object.values(o), r || (o = Ce(o));
            const a = o.filter((h) => h.$.type === "revolute"), {
              jointModelVector: S,
              jointModelsArray: B
            } = Q(d, a);
            if (console.log("type of SlrmModule.CmdVelGen: " + typeof d.CmdVelGenerator), g = new d.CmdVelGenerator(S), console.log("type of jointModels is ", typeof jointModels), B.forEach((h) => h.delete()), S.delete(), g == null) {
              console.error("generation of CmdVelGen instance failed"), g = null;
              return;
            }
            g != null && console.log("CmdVelGen instance created:", g), a.forEach((h) => {
              P.push(h.limit.$.upper), G.push(h.limit.$.lower);
            }), console.log("jointLimits: ", P, G), console.log("Status Definitions: OK:" + d.CmdVelGeneratorStatus.OK.value + ", ERROR:" + d.CmdVelGeneratorStatus.ERROR.value + ", END:" + d.CmdVelGeneratorStatus.END.value), g.setExactSolution(k), g.setLinearVelocityLimit(10), g.setAngularVelocityLimit(2 * Math.PI), g.setAngularGain(20), g.setLinearGain(20);
            const R = t(Array(a.length).fill(Math.PI * 2));
            if (g.setJointVelocityLimit(R), R.delete(), e.linkShapes) {
              I.setJsLogLevel(2);
              const {
                jointModelVector: h,
                jointModelsArray: p
              } = Q(I, a), u = i([0, 0, 0]), E = i([1, 0, 0, 0]);
              v = new I.CollisionDetection(
                h,
                u,
                E
              ), h.delete(), p.forEach((L) => L.delete()), u.delete(), E.delete();
            }
            v && fetch(e.linkShapes).then((h) => h.json()).then((h) => {
              if (h.length !== a.length + 2) {
                h.length !== 0 && console.error(
                  "干渉形状定義の数",
                  h.length,
                  "がジョイントの数(+2 effector必須)",
                  a.length + 2,
                  "と一致しません。"
                );
                return;
              }
              console.log("linkShapes.length: ", h.length);
              for (let p = 0; p < h.length; ++p) {
                const u = new I.ConvexShapeVector();
                for (const E of h[p]) {
                  const L = n(E);
                  u.push_back(L), L.delete();
                }
                v.addLinkShape(p, u), u.delete();
              }
              if (console.log("setting up of link shapes is finished"), v.infoLinkShapes(), e.testPairs)
                console.log("recieve test pairs from", e.testPairs), fetch(e.testPairs).then((p) => p.json()).then((p) => {
                  v.clearTestPairs();
                  for (const u of p)
                    v.addTestPair(u[0], u[1]);
                });
              else {
                const p = [];
                for (let u = 0; u < h.length - 4; u++)
                  for (let E = u + 2; E < h.length; E++)
                    p.push([u, E]);
                console.log("using default test pairs: ", p), v.clearTestPairs();
                for (const u of p)
                  v.addTestPair(u[0], u[1]);
              }
            }).catch((h) => {
              console.error("Error fetching or parsing SHAPE file:", h);
            }), e.bridgeUrl && (console.log("recieve bridge URL: ", e.bridgeUrl), K(e.bridgeUrl)), U = y.generatorReady, self.postMessage({ type: "generator_ready" });
          }).catch((c) => {
            console.warn("Error fetching or parsing URDF modifier file:", c), console.warn("modifier file name:", e.modifier);
          });
        }).catch((l) => {
          console.error("Error fetching or parsing URDF.JSON file:", l);
        });
      }
      break;
    case "set_initial_joints":
      (U === y.generatorReady || U === y.slrmReady) && e.joints && (f = new Float64Array(e.joints.length), f.set(e.joints), W = f.slice(), A = f.slice(), T = new Float64Array(f.length), console.log("Setting initial joints:" + f.map((t) => (t * 57.2958).toFixed(1)).join(", ")), (!b || f.length !== b.length) && (b = Array(f.length).fill(null).map((t, i) => i <= 1 ? new X(5, 1, 0.2, 0.02) : new X(5, 1, 1, 0.0625))), b.forEach((t, i) => {
        t.reset(), t.setX0(W[i]);
      }), U = y.slrmReady, V = [], x = m.moving, console.log("Worker state changed to slrmReady"));
      break;
    case "destination":
      U === y.slrmReady && e.endLinkPose && (V = [...e.endLinkPose], x = m.moving);
      break;
    case "slow_rewind":
      U === y.slrmReady && f && W && b && (e.slowRewind == !0 ? x = m.rewinding : x = m.converged);
      break;
    case "set_end_effector_point":
      if (e.endEffectorPoint && F && e.endEffectorPoint.length === 3 && typeof e.endEffectorPoint[0] == "number" && typeof e.endEffectorPoint[1] == "number" && typeof e.endEffectorPoint[2] == "number") {
        console.debug("Setting end effector point: ", e.endEffectorPoint);
        const t = F(e.endEffectorPoint);
        g.setEndEffectorPosition(t), t.delete();
        const i = x;
        x = m.moving, V = [], se(0), x = i;
      }
      break;
    case "set_exact_solution":
      (U === y.generatorReady || U === y.slrmReady) && e.exactSolution !== void 0 && (e.exactSolution === !0 ? k = !0 : k = !1, g.setExactSolution(k), console.log("Exact solution for singularity set to: ", k));
      break;
  }
};
function se(s) {
  let e = null, t = null, i = null, n = null;
  if (!(!g || !f)) {
    if (U === y.slrmReady && (x === m.moving || x === m.rewinding)) {
      if (x === m.rewinding) {
        const c = b.map((a, S) => a.calcNext(f[S], T[S], s));
        for (let a = 0; a < f.length; a++)
          f[a] = c[a].x, T[a] = c[a].v;
        if (w) {
          const a = {
            topic: "actuator1",
            javascriptStamp: Date.now(),
            header: {},
            position: [...f],
            velocity: [...T],
            normalized: []
          }, S = j(a);
          w.readyState === WebSocket.OPEN ? w.send(S) : C && (console.log("Not connected, queueing message"), H.push(a), (!w || w.readyState === WebSocket.CLOSED) && K(C));
        }
        V = [];
      } else x === m.converged && T.fill(0);
      if (V === null)
        return;
      const l = F(f), r = F(V), o = g.calcVelocityPQ(l, r);
      if (l.delete(), r.delete(), x !== m.rewinding)
        for (let c = 0; c < T.length; c++)
          T[c] = o.joint_velocities.get(c);
      if (o.joint_velocities.delete(), e = o.status, t = o.other, (!i || !n) && (i = new Float64Array(3), n = new Float64Array(4)), i[0] = o.position.get(0), i[1] = o.position.get(1), i[2] = o.position.get(2), n[0] = o.quaternion.get(0), n[1] = o.quaternion.get(1), n[2] = o.quaternion.get(2), n[3] = o.quaternion.get(3), o.position.delete(), o.quaternion.delete(), x === m.rewinding && o.status.value !== d.CmdVelGeneratorStatus.END.value && o.status.value !== d.CmdVelGeneratorStatus.OK.value && console.warn("CmdVelGenerator returned status other than END or OK during rewinding:", N[o.status.value]), x === m.moving)
        switch (o.status.value) {
          case d.CmdVelGeneratorStatus.OK.value:
            A.set(f);
            for (let c = 0; c < f.length; c++)
              f[c] = f[c] + T[c] * s;
            if (v) {
              const c = te(f);
              v.calcFk(c), c.delete(), v.testCollisionPairs().size() !== 0 && f.set(A);
            }
            break;
          case d.CmdVelGeneratorStatus.END.value:
            x = m.converged;
            break;
          case d.CmdVelGeneratorStatus.SINGULARITY.value:
            console.error("CmdVelGenerator returned SINGULARITY status");
            break;
          case d.CmdVelGeneratorStatus.REWIND.value:
            f.set(A);
            break;
          case d.CmdVelGeneratorStatus.ERROR.value:
            console.error("CmdVelGenerator returned ERROR status");
            break;
          default:
            console.error("Unknown status from CmdVelGenerator:", o.status.value);
            break;
        }
    }
    if (e !== null && t !== null) {
      let l = Array(f.length).fill(0), r = !1;
      for (let o = 0; o < f.length; o++)
        f[o] > P[o] && (l[o] = 1, A[o] = P[o] - 1e-3, r = !0), f[o] < G[o] && (l[o] = -1, A[o] = G[o] + 1e-3, r = !0);
      r && f.set(A), self.postMessage({ type: "joints", joints: [...f] }), self.postMessage({
        type: "status",
        status: N[e.value],
        exact_solution: k,
        condition_number: t.condition_number,
        manipulability: t.manipulability,
        sensitivity_scale: t.sensitivity_scale,
        limit_flag: l
      }), self.postMessage({
        type: "pose",
        position: i,
        quaternion: n
      }), O++, Y !== 0n && O % Y === 0n && (M !== null && f !== null && M.length === f.length && Math.max(...M.map((o, c) => Math.abs(o - f[c]))) > 5e-3 && console.log(
        "counter:",
        O,
        "status: ",
        N[e.value],
        " condition:",
        t.condition_number.toFixed(2),
        " m:",
        t.manipulability.toFixed(3),
        " k:",
        t.sensitivity_scale.toFixed(3) + `
limit flags: ` + l.join(", ")
      ), M || (M = f.slice()), M.set(f));
    }
  }
}
function oe(s = performance.now() - ee) {
  const e = performance.now(), t = e - s;
  if (se(t / 1e3), ie === !0) {
    self.postMessage({ type: "shutdown_complete" }), console.log("main loop was finished"), self.close();
    return;
  }
  if (w) {
    const n = performance.now() - e, l = Math.floor(n / 1e3), r = Math.floor((n - l * 1e3) * 1e6), o = {
      topic: "timeRef",
      javascriptStamp: Date.now(),
      header: { frame_id: "none" },
      time_ref: {
        sec: l,
        nanosec: r
      },
      source: "slrm_and_cd"
    }, c = j(o);
    w.readyState === WebSocket.OPEN && w.send(c);
  }
  setTimeout(() => oe(e), 0);
}
U = y.waitingRobotType;
self.postMessage({ type: "ready" });
oe();
