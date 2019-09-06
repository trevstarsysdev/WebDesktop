!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("H265", [], t) : "object" == typeof exports ? exports.H265 = t() : e.H265 = t()
}(window, function() {
    return function(e) {
        var t = {};
        function n(r) {
            if (t[r])
                return t[r].exports;
            var i = t[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return e[r].call(i.exports, i, i.exports, n),
            i.l = !0,
            i.exports
        }
        return n.m = e,
        n.c = t,
        n.d = function(e, t, r) {
            n.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: r
            })
        }
        ,
        n.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }),
            Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }
        ,
        n.t = function(e, t) {
            if (1 & t && (e = n(e)),
            8 & t)
                return e;
            if (4 & t && "object" == typeof e && e && e.__esModule)
                return e;
            var r = Object.create(null);
            if (n.r(r),
            Object.defineProperty(r, "default", {
                enumerable: !0,
                value: e
            }),
            2 & t && "string" != typeof e)
                for (var i in e)
                    n.d(r, i, function(t) {
                        return e[t]
                    }
                    .bind(null, i));
            return r
        }
        ,
        n.n = function(e) {
            var t = e && e.__esModule ? function() {
                return e.default
            }
            : function() {
                return e
            }
            ;
            return n.d(t, "a", t),
            t
        }
        ,
        n.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        ,
        n.p = "",
        n(n.s = 11)
    }([function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = {
            concat: function() {
                for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
                    t[n] = arguments[n];
                var r = t.reduce(function(e, t) {
                    return e + t.byteLength
                }, 0)
                  , i = new Uint8Array(r)
                  , a = 0;
                return t.forEach(function(e) {
                    i.set(new Uint8Array(e), a),
                    a += e.byteLength
                }),
                i.buffer
            },
            readUInt32BE: function(e, t) {
                var n = new Uint8Array(e);
                return n[t] << 24 | n[t + 1] << 16 | n[t + 2] << 8 | n[t + 3]
            },
            readUInt24BE: function(e, t) {
                var n = new Uint8Array(e);
                return n[t] << 16 | n[t + 1] << 8 | n[t + 2]
            },
            readUInt16BE: function(e, t) {
                var n = new Uint8Array(e);
                return n[t] << 8 | n[t + 1]
            },
            readUInt8: function(e, t) {
                return new Uint8Array(e)[t]
            },
            readToString: function(e) {
                var t = new Uint8Array(e)
                  , n = String.fromCharCode.apply(String, function(e) {
                    if (Array.isArray(e)) {
                        for (var t = 0, n = Array(e.length); t < e.length; t++)
                            n[t] = e[t];
                        return n
                    }
                    return Array.from(e)
                }(t));
                return decodeURIComponent(escape(n))
            },
            readDate: function(e, t) {
                return new Date(1e3 * r.readUInt32BE(e, t) - 20828448e5)
            },
            readFixed32: function(e, t) {
                return r.readUInt16BE(e, t) + r.readUInt16BE(e, t + 2) / 65536
            },
            readFixed16: function(e, t) {
                return r.readUInt8(e, t) + r.readUInt8(e, t + 1) / 256
            }
        };
        t.default = r,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function(e) {
            if (e && e.__esModule)
                return e;
            var t = {};
            if (null != e)
                for (var n in e)
                    Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
            return t.default = e,
            t
        }(n(3))
          , i = o(n(10))
          , a = o(n(29));
        function o(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        function s(e) {
            this.info = new l,
            this.bandTypes = new Int32Array(u),
            this.sectEnd = new Int32Array(u),
            this.data = new Float32Array(e.frameLength),
            this.scaleFactors = new Float32Array(u),
            this.randomState = 523124044,
            this.tns = new a.default(e),
            this.specBuf = new Int32Array(4)
        }
        s.ZERO_BT = 0,
        s.FIRST_PAIR_BT = 5,
        s.ESC_BT = 11,
        s.NOISE_BT = 13,
        s.INTENSITY_BT2 = 14,
        s.INTENSITY_BT = 15,
        s.ONLY_LONG_SEQUENCE = 0,
        s.LONG_START_SEQUENCE = 1,
        s.EIGHT_SHORT_SEQUENCE = 2,
        s.LONG_STOP_SEQUENCE = 3;
        var u = 120
          , f = 8;
        function l() {
            this.windowShape = new Int32Array(2),
            this.windowSequence = s.ONLY_LONG_SEQUENCE,
            this.groupLength = new Int32Array(f),
            this.ltpData1Present = !1,
            this.ltpData2Present = !1
        }
        s.prototype = {
            decode: function(e, t, n) {
                if (this.globalGain = e.read(8),
                n || this.info.decode(e, t, n),
                this.decodeBandTypes(e, t),
                this.decodeScaleFactors(e),
                this.pulsePresent = e.read(1)) {
                    if (this.info.windowSequence === s.EIGHT_SHORT_SEQUENCE)
                        throw new Error("Pulse tool not allowed in eight short sequence.");
                    this.decodePulseData(e)
                }
                if ((this.tnsPresent = e.read(1)) && this.tns.decode(e, this.info),
                this.gainPresent = e.read(1))
                    throw new Error("TODO: decode gain control/SSR");
                this.decodeSpectralData(e)
            },
            decodeBandTypes: function(e, t) {
                for (var n = this.info.windowSequence === s.EIGHT_SHORT_SEQUENCE ? 3 : 5, r = this.info.groupCount, i = this.info.maxSFB, a = this.bandTypes, o = this.sectEnd, u = 0, f = (1 << n) - 1, l = 0; l < r; l++)
                    for (var c = 0; c < i; ) {
                        var d = c
                          , h = e.read(4);
                        if (12 === h)
                            throw new Error("Invalid band type: 12");
                        for (var p = void 0; (p = e.read(n)) === f; )
                            d += p;
                        if (i < (d += p))
                            throw new Error("Too many bands (" + d + " > " + i + ")");
                        for (; c < d; c++)
                            a[u] = h,
                            o[u++] = d
                    }
            },
            decodeScaleFactors: function(e) {
                for (var t = this.info.groupCount, n = this.info.maxSFB, a = [this.globalGain, this.globalGain - 90, 0], o = 0, u = !0, f = this.scaleFactors, l = this.sectEnd, c = this.bandTypes, d = 0; d < t; d++)
                    for (var h = 0; h < n; ) {
                        var p = l[o];
                        switch (c[o]) {
                        case s.ZERO_BT:
                            for (; h < p; h++,
                            o++)
                                f[o] = 0;
                            break;
                        case s.INTENSITY_BT:
                        case s.INTENSITY_BT2:
                            for (; h < p; h++,
                            o++) {
                                a[2] += i.default.decodeScaleFactor(e) - 60;
                                var v = Math.min(Math.max(a[2], -155), 100);
                                f[o] = r.SCALEFACTOR_TABLE[200 - v]
                            }
                            break;
                        case s.NOISE_BT:
                            for (; h < p; h++,
                            o++) {
                                u ? (a[1] += e.read(9) - 256,
                                u = !1) : a[1] += i.default.decodeScaleFactor(e) - 60;
                                var y = Math.min(Math.max(a[1], -100), 155);
                                f[o] = -r.SCALEFACTOR_TABLE[y + 200]
                            }
                            break;
                        default:
                            for (; h < p; h++,
                            o++) {
                                if (a[0] += i.default.decodeScaleFactor(e) - 60,
                                255 < a[0])
                                    throw new Error("Scalefactor out of range: " + a[0]);
                                f[o] = r.SCALEFACTOR_TABLE[a[0] - 100 + 200]
                            }
                        }
                    }
            },
            decodePulseData: function(e) {
                var t = e.read(2) + 1
                  , n = e.read(6);
                if (n >= this.info.swbCount)
                    throw new Error("Pulse SWB out of range: " + n);
                if (this.pulseOffset && this.pulseOffset.length === t || (this.pulseOffset = new Int32Array(t),
                this.pulseAmp = new Int32Array(t)),
                this.pulseOffset[0] = this.info.swbOffsets[n] + e.read(5),
                this.pulseAmp[0] = e.read(4),
                1023 < this.pulseOffset[0])
                    throw new Error("Pulse offset out of range: " + this.pulseOffset[0]);
                for (var r = 1; r < t; r++) {
                    if (this.pulseOffset[r] = e.read(5) + this.pulseOffset[r - 1],
                    1023 < this.pulseOffset[r])
                        throw new Error("Pulse offset out of range: " + this.pulseOffset[r]);
                    this.pulseAmp[r] = e.read(4)
                }
            },
            decodeSpectralData: function(e) {
                for (var t = this.data, n = this.info, a = n.maxSFB, o = n.groupCount, u = n.swbOffsets, f = this.bandTypes, l = this.scaleFactors, c = this.specBuf, d = 0, h = 0, p = 0; p < o; p++) {
                    for (var v = n.groupLength[p], y = 0; y < a; y++,
                    h++) {
                        var m = f[h]
                          , b = d + u[y]
                          , w = u[y + 1] - u[y];
                        if (m === s.ZERO_BT || m === s.INTENSITY_BT || m === s.INTENSITY_BT2)
                            for (var g = 0; g < v; g++,
                            b += 128)
                                for (var _ = b; _ < b + w; _++)
                                    t[_] = 0;
                        else if (m === s.NOISE_BT)
                            for (var k = 0; k < v; k++,
                            b += 128) {
                                for (var I = 0, E = 0; E < w; E++)
                                    this.randomState = 1015568748 * this.randomState | 0,
                                    t[b + E] = this.randomState,
                                    I += t[b + E] * t[b + E];
                                for (var S = l[h] / Math.sqrt(I), T = 0; T < w; T++)
                                    t[b + T] *= S
                            }
                        else
                            for (var O = 0; O < v; O++,
                            b += 128)
                                for (var U = s.FIRST_PAIR_BT <= m ? 2 : 4, A = 0; A < w; A += U) {
                                    i.default.decodeSpectralData(e, m, c, 0);
                                    for (var B = 0; B < U; B++)
                                        t[b + A + B] = 0 < c[B] ? r.IQ_TABLE[c[B]] : -r.IQ_TABLE[-c[B]],
                                        t[b + A + B] *= l[h]
                                }
                    }
                    d += v << 7
                }
                if (this.pulsePresent)
                    throw new Error("TODO: add pulse data")
            }
        },
        l.prototype = {
            decode: function(e, t, n) {
                if (e.advance(1),
                this.windowSequence = e.read(2),
                this.windowShape[0] = this.windowShape[1],
                this.windowShape[1] = e.read(1),
                this.groupCount = 1,
                this.groupLength[0] = 1,
                this.windowSequence === s.EIGHT_SHORT_SEQUENCE) {
                    this.maxSFB = e.read(4);
                    for (var i = 0; i < 7; i++)
                        e.read(1) ? this.groupLength[this.groupCount - 1]++ : (this.groupCount++,
                        this.groupLength[this.groupCount - 1] = 1);
                    this.windowCount = 8,
                    this.swbOffsets = r.SWB_OFFSET_128[t.sampleIndex],
                    this.swbCount = r.SWB_SHORT_WINDOW_COUNT[t.sampleIndex],
                    this.predictorPresent = !1
                } else
                    this.maxSFB = e.read(6),
                    this.windowCount = 1,
                    this.swbOffsets = r.SWB_OFFSET_1024[t.sampleIndex],
                    this.swbCount = r.SWB_LONG_WINDOW_COUNT[t.sampleIndex],
                    this.predictorPresent = !!e.read(1),
                    this.predictorPresent && this.decodePrediction(e, t, n)
            },
            decodePrediction: function(e, t, n) {
                throw new Error("Prediction not implemented.")
            }
        },
        t.default = s,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return r(e, [{
                key: "on",
                value: function(e, t) {
                    return this._events || (this._events = {}),
                    this._events[e] || (this._events[e] = []),
                    -1 !== !this._events[e].indexOf(t) && "function" == typeof t && this._events[e].push(t),
                    this
                }
            }, {
                key: "emit",
                value: function(e) {
                    if (this._events && this._events[e]) {
                        for (var t = Array.prototype.slice.call(arguments, 1) || [], n = this._events[e], r = 0, i = n.length; r < i; r++)
                            n[r].apply(this, t);
                        return this
                    }
                }
            }, {
                key: "off",
                value: function(e, t) {
                    if (e || t || (this._events = {}),
                    e && !t && delete this._events[e],
                    e && t) {
                        var n = this._events[e]
                          , r = n.indexOf(t);
                        n.splice(r, 1)
                    }
                    return this
                }
            }]),
            e
        }();
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 156, 172, 188, 212, 240, 276, 320, 384, 448, 512, 576, 640, 704, 768, 832, 896, 960, 1024])
          , i = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 92, 128])
          , a = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64, 72, 80, 88, 100, 112, 124, 140, 156, 172, 192, 216, 240, 268, 304, 344, 384, 424, 464, 504, 544, 584, 624, 664, 704, 744, 784, 824, 864, 904, 944, 984, 1024])
          , o = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 92, 128])
          , s = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896, 928, 1024])
          , u = new Uint16Array([0, 4, 8, 12, 16, 20, 28, 36, 44, 56, 68, 80, 96, 112, 128])
          , f = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896, 928, 960, 992, 1024])
          , l = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 136, 148, 160, 172, 188, 204, 220, 240, 260, 284, 308, 336, 364, 396, 432, 468, 508, 552, 600, 652, 704, 768, 832, 896, 960, 1024])
          , c = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 36, 44, 52, 64, 76, 92, 108, 128])
          , d = new Uint16Array([0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 100, 112, 124, 136, 148, 160, 172, 184, 196, 212, 228, 244, 260, 280, 300, 320, 344, 368, 396, 424, 456, 492, 532, 572, 616, 664, 716, 772, 832, 896, 960, 1024])
          , h = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 60, 72, 88, 108, 128])
          , p = new Uint16Array([0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 172, 188, 204, 220, 236, 252, 268, 288, 308, 328, 348, 372, 396, 420, 448, 476, 508, 544, 580, 620, 664, 712, 764, 820, 880, 944, 1024])
          , v = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 36, 44, 52, 60, 72, 88, 108, 128]);
        t.SWB_OFFSET_1024 = [r, r, a, s, s, f, l, l, d, d, d, p],
        t.SWB_OFFSET_128 = [i, i, o, u, u, u, c, c, h, h, h, v],
        t.SWB_SHORT_WINDOW_COUNT = new Uint8Array([12, 12, 12, 14, 14, 14, 15, 15, 15, 15, 15, 15]),
        t.SWB_LONG_WINDOW_COUNT = new Uint8Array([41, 41, 47, 49, 49, 51, 47, 47, 43, 43, 43, 40]),
        t.SCALEFACTOR_TABLE = function() {
            for (var e = new Float32Array(428), t = 0; t < 428; t++)
                e[t] = Math.pow(2, (t - 200) / 4);
            return e
        }(),
        t.IQ_TABLE = function() {
            for (var e = new Float32Array(8191), t = 0; t < 8191; t++)
                e[t] = Math.pow(t, 4 / 3);
            return e
        }(),
        t.SAMPLE_RATES = new Int32Array([96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350])
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return r(e, [{
                key: "on",
                value: function(e, t) {
                    null == this.events && (this.events = {}),
                    null == this.events[e] && (this.events[e] = []),
                    this.events[e].push(t)
                }
            }, {
                key: "off",
                value: function(e, t) {
                    if (this.events && this.events[e]) {
                        var n = this.events[e].indexOf(t);
                        ~n && this.events[e].splice(n, 1)
                    }
                }
            }, {
                key: "once",
                value: function(e, t) {
                    this.on(e, function n() {
                        this.off(e, n);
                        for (var r = arguments.length, i = Array(r), a = 0; a < r; a++)
                            i[a] = arguments[a];
                        t.apply(this, i)
                    })
                }
            }, {
                key: "emit",
                value: function(e) {
                    if (this.events && this.events[e]) {
                        for (var t = arguments.length, n = Array(1 < t ? t - 1 : 0), r = 1; r < t; r++)
                            n[r - 1] = arguments[r];
                        var i = !0
                          , a = !1
                          , o = void 0;
                        try {
                            for (var s, u = this.events[e].slice()[Symbol.iterator](); !(i = (s = u.next()).done); i = !0)
                                s.value.apply(this, n)
                        } catch (e) {
                            a = !0,
                            o = e
                        } finally {
                            try {
                                !i && u.return && u.return()
                            } finally {
                                if (a)
                                    throw o
                            }
                        }
                    }
                }
            }]),
            e
        }();
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
          , i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , a = f(n(2))
          , o = f(n(0))
          , s = f(n(16))
          , u = n(18);
        function f(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var l = function(e) {
            function t() {
                return function(e, n) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this))
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, a.default),
            i(t, null, [{
                key: "MIN_LENGTH",
                get: function() {
                    return 8
                }
            }, {
                key: "MIN_FULL_LENGTH",
                get: function() {
                    return 16
                }
            }]),
            i(t, [{
                key: "decode",
                value: function(e) {
                    var n = this
                      , r = 0;
                    if (e.byteLength < t.MIN_LENGTH)
                        return !1;
                    if (this.boxSize = o.default.readUInt32BE(e, 0),
                    this.boxType = o.default.readToString(e.slice(4, 8)),
                    r += 8,
                    1 === this.boxSize)
                        throw new Error("浏览器不支持uint64");
                    if (-1 < u.FULL_BOX_TYPES.indexOf(this.boxType)) {
                        if (this.version = o.default.readUInt8(e, r),
                        1 === this.version)
                            throw new Error("浏览器不支持uint64");
                        this.flags = 16777215 & o.default.readUInt32BE(e, r),
                        r += 4
                    }
                    if (this.headerLen = r,
                    this.contentLen = this.boxSize - r,
                    e = e.slice(this.headerLen),
                    u.CONTAINERS[this.boxType]) {
                        var i = e.byteLength;
                        if (this.boxs = [],
                        e.byteLength < this.contentLen)
                            return !1;
                        for (; !(i - e.byteLength >= this.contentLen); ) {
                            var a = new t;
                            a.on("data", function(e) {
                                n.emit("data", e)
                            });
                            var f = a.decode(e);
                            if (!f)
                                return e;
                            e = f,
                            this.boxs.push(a.toJSON())
                        }
                        return this.emit("data", this.toJSON()),
                        e
                    }
                    return -1 < u.BOX_TYPES.indexOf(this.boxType) ? !(e.byteLength < this.contentLen) && (this.boxData = new s.default(this.boxType,this.contentLen),
                    this.boxData.on("data", function(e) {
                        n.emit("data", e)
                    }),
                    e = this.boxData.decode(e),
                    this.emit("data", this.toJSON()),
                    e) : (this.buffer = e.slice(0, this.contentLen),
                    this.emit("data", this.toJSON()),
                    e.slice(this.contentLen))
                }
            }, {
                key: "toJSON",
                value: function() {
                    var e = {
                        length: this.boxSize,
                        headerLen: this.headerLen,
                        contentLen: this.contentLen,
                        type: this.boxType
                    };
                    if (this.boxs) {
                        for (var t = this.boxs, n = {}, i = 0; i < t.length; i++) {
                            var a = t[i]
                              , o = n[a.type];
                            Array.isArray(o) ? n.push(a) : n[a.type] = o ? [o, a] : a
                        }
                        Object.assign(e, n)
                    }
                    if (this.buffer && (e.buffer = this.buffer),
                    this.version && (e.version = this.version),
                    this.flags && (e.flags = this.flags),
                    this.boxData) {
                        var s = this.boxData.toJSON();
                        e = r({}, e, s)
                    }
                    return e
                }
            }]),
            t
        }();
        t.default = l,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return r(e, [{
                key: "on",
                value: function(e, t) {
                    null == this.events && (this.events = {}),
                    null == this.events[e] && (this.events[e] = []),
                    this.events[e].push(t)
                }
            }, {
                key: "off",
                value: function(e, t) {
                    if (this.events && this.events[e]) {
                        var n = this.events[e].indexOf(t);
                        ~n && this.events[e].splice(n, 1)
                    }
                }
            }, {
                key: "once",
                value: function(e, t) {
                    this.on(e, function n() {
                        this.off(e, n);
                        for (var r = arguments.length, i = Array(r), a = 0; a < r; a++)
                            i[a] = arguments[a];
                        t.apply(this, i)
                    })
                }
            }, {
                key: "emit",
                value: function(e) {
                    if (this.events && this.events[e]) {
                        for (var t = arguments.length, n = Array(1 < t ? t - 1 : 0), r = 1; r < t; r++)
                            n[r - 1] = arguments[r];
                        var i = !0
                          , a = !1
                          , o = void 0;
                        try {
                            for (var s, u = this.events[e].slice()[Symbol.iterator](); !(i = (s = u.next()).done); i = !0)
                                s.value.apply(this, n)
                        } catch (e) {
                            a = !0,
                            o = e
                        } finally {
                            try {
                                !i && u.return && u.return()
                            } finally {
                                if (a)
                                    throw o
                            }
                        }
                    }
                }
            }]),
            e
        }();
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.first = null,
                this.last = null,
                this.numBuffers = 0,
                this.availableBytes = 0,
                this.availableBuffers = 0
            }
            return r(e, [{
                key: "copy",
                value: function() {
                    var t = new e;
                    return t.first = this.first,
                    t.last = this.last,
                    t.numBuffers = this.numBuffers,
                    t.availableBytes = this.availableBytes,
                    t.availableBuffers = this.availableBuffers,
                    t
                }
            }, {
                key: "append",
                value: function(e) {
                    return e.prev = this.last,
                    this.last && (this.last.next = e),
                    this.last = e,
                    null == this.first && (this.first = e),
                    this.availableBytes += e.length,
                    this.availableBuffers++,
                    this.numBuffers++
                }
            }, {
                key: "advance",
                value: function() {
                    return !!this.first && (this.availableBytes -= this.first.length,
                    this.availableBuffers--,
                    this.first = this.first.next,
                    null != this.first)
                }
            }, {
                key: "rewind",
                value: function() {
                    return !(this.first && !this.first.prev) && (this.first = this.first ? this.first.prev : this.last,
                    this.first && (this.availableBytes += this.first.length,
                    this.availableBuffers++),
                    null != this.first)
                }
            }, {
                key: "reset",
                value: function() {
                    var e = this;
                    return function() {
                        for (; e.rewind(); )
                            ;
                        return []
                    }()
                }
            }]),
            e
        }();
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = function() {
            function e(t) {
                if (function(t, n) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                t instanceof Uint8Array)
                    this.data = t;
                else if (t instanceof ArrayBuffer || Array.isArray(t) || "number" == typeof t)
                    this.data = new Uint8Array(t);
                else if (t.buffer instanceof ArrayBuffer)
                    this.data = new Uint8Array(t.buffer,t.byteOffset,t.length * t.BYTES_PER_ELEMENT);
                else {
                    if (!(t instanceof e))
                        throw new Error("Constructing buffer with unknown type.");
                    this.data = t.data
                }
                this.length = this.data.length,
                this.next = null,
                this.prev = null
            }
            return r(e, [{
                key: "copy",
                value: function() {
                    return new e(new Uint8Array(this.data))
                }
            }, {
                key: "slice",
                value: function(t) {
                    var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : this.length;
                    return 0 === t && n >= this.length ? new e(this.data) : new e(this.data.subarray(t, t + n))
                }
            }, {
                key: "toBlob",
                value: function() {
                    return e.makeBlob(this.data.buffer)
                }
            }, {
                key: "toBlobURL",
                value: function() {
                    return e.makeBlobURL(this.data.buffer)
                }
            }], [{
                key: "allocate",
                value: function(t) {
                    return new e(t)
                }
            }, {
                key: "makeBlob",
                value: function(e) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "application/octet-stream";
                    return new Blob([e],{
                        type: t
                    })
                }
            }, {
                key: "makeBlobURL",
                value: function(e, t) {
                    return URL.createObjectURL(this.makeBlob(e, t))
                }
            }, {
                key: "revokeBlobURL",
                value: function(e) {
                    URL.revokeObjectURL(e)
                }
            }]),
            e
        }();
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = function() {
            function e(t) {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.stream = t,
                this.bitPosition = 0
            }
            return r(e, [{
                key: "copy",
                value: function() {
                    var t = new e(this.stream.copy());
                    return t.bitPosition = this.bitPosition,
                    t
                }
            }, {
                key: "offset",
                value: function() {
                    return 8 * this.stream.offset + this.bitPosition
                }
            }, {
                key: "available",
                value: function(e) {
                    return this.stream.available((e + 8 - this.bitPosition) / 8)
                }
            }, {
                key: "advance",
                value: function(e) {
                    var t = this.bitPosition + e;
                    this.stream.advance(t >> 3),
                    this.bitPosition = 7 & t
                }
            }, {
                key: "rewind",
                value: function(e) {
                    var t = this.bitPosition - e;
                    this.stream.rewind(Math.abs(t >> 3)),
                    this.bitPosition = 7 & t
                }
            }, {
                key: "seek",
                value: function(e) {
                    var t = this.offset();
                    t < e ? this.advance(e - t) : e < t && this.rewind(t - e)
                }
            }, {
                key: "align",
                value: function() {
                    0 !== this.bitPosition && (this.bitPosition = 0,
                    this.stream.advance(1))
                }
            }, {
                key: "read",
                value: function(e, t) {
                    var n = !(2 < arguments.length && void 0 !== arguments[2]) || arguments[2];
                    if (0 === e)
                        return 0;
                    var r = void 0
                      , i = e + this.bitPosition;
                    if (i <= 8)
                        r = (this.stream.peekUInt8() << this.bitPosition & 255) >>> 8 - e;
                    else if (i <= 16)
                        r = (this.stream.peekUInt16() << this.bitPosition & 65535) >>> 16 - e;
                    else if (i <= 24)
                        r = (this.stream.peekUInt24() << this.bitPosition & 16777215) >>> 24 - e;
                    else if (i <= 32)
                        r = this.stream.peekUInt32() << this.bitPosition >>> 32 - e;
                    else {
                        if (!(i <= 40))
                            throw new Error("Too many bits!");
                        r = 4294967296 * this.stream.peekUInt8(0) + (this.stream.peekUInt8(1) << 24 >>> 0) + (this.stream.peekUInt8(2) << 16) + (this.stream.peekUInt8(3) << 8) + this.stream.peekUInt8(4),
                        r %= Math.pow(2, 40 - this.bitPosition),
                        r = Math.floor(r / Math.pow(2, 40 - this.bitPosition - e))
                    }
                    return t && (i < 32 ? r >>> e - 1 && (r = -1 * ((1 << e >>> 0) - r)) : r / Math.pow(2, e - 1) | 0 && (r = -1 * (Math.pow(2, e) - r))),
                    n && this.advance(e),
                    r
                }
            }, {
                key: "peek",
                value: function(e, t) {
                    return this.read(e, t, !1)
                }
            }, {
                key: "readLSB",
                value: function(e, t) {
                    var n = !(2 < arguments.length && void 0 !== arguments[2]) || arguments[2];
                    if (0 === e)
                        return 0;
                    if (40 < e)
                        throw new Error("Too many bits!");
                    var r = e + this.bitPosition
                      , i = this.stream.peekUInt8(0) >>> this.bitPosition;
                    return 8 < r && (i |= this.stream.peekUInt8(1) << 8 - this.bitPosition),
                    16 < r && (i |= this.stream.peekUInt8(2) << 16 - this.bitPosition),
                    24 < r && (i += this.stream.peekUInt8(3) << 24 - this.bitPosition >>> 0),
                    32 < r && (i += this.stream.peekUInt8(4) * Math.pow(2, 32 - this.bitPosition)),
                    32 <= r ? i %= Math.pow(2, e) : i &= (1 << e) - 1,
                    t && (r < 32 ? i >>> e - 1 && (i = -1 * ((1 << e >>> 0) - i)) : i / Math.pow(2, e - 1) | 0 && (i = -1 * (Math.pow(2, e) - i))),
                    n && this.advance(e),
                    i
                }
            }, {
                key: "peekLSB",
                value: function(e, t) {
                    return this.readLSB(e, t, !1)
                }
            }]),
            e
        }();
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = [[1, 0, 60], [3, 4, 59], [4, 10, 61], [4, 11, 58], [4, 12, 62], [5, 26, 57], [5, 27, 63], [6, 56, 56], [6, 57, 64], [6, 58, 55], [6, 59, 65], [7, 120, 66], [7, 121, 54], [7, 122, 67], [8, 246, 53], [8, 247, 68], [8, 248, 52], [8, 249, 69], [8, 250, 51], [9, 502, 70], [9, 503, 50], [9, 504, 49], [9, 505, 71], [10, 1012, 72], [10, 1013, 48], [10, 1014, 73], [10, 1015, 47], [10, 1016, 74], [10, 1017, 46], [11, 2036, 76], [11, 2037, 75], [11, 2038, 77], [11, 2039, 78], [11, 2040, 45], [11, 2041, 43], [12, 4084, 44], [12, 4085, 79], [12, 4086, 42], [12, 4087, 41], [12, 4088, 80], [12, 4089, 40], [13, 8180, 81], [13, 8181, 39], [13, 8182, 82], [13, 8183, 38], [13, 8184, 83], [14, 16370, 37], [14, 16371, 35], [14, 16372, 85], [14, 16373, 33], [14, 16374, 36], [14, 16375, 34], [14, 16376, 84], [14, 16377, 32], [15, 32756, 87], [15, 32757, 89], [15, 32758, 30], [15, 32759, 31], [16, 65520, 86], [16, 65521, 29], [16, 65522, 26], [16, 65523, 27], [16, 65524, 28], [16, 65525, 24], [16, 65526, 88], [17, 131054, 25], [17, 131055, 22], [17, 131056, 23], [18, 262114, 90], [18, 262115, 21], [18, 262116, 19], [18, 262117, 3], [18, 262118, 1], [18, 262119, 2], [18, 262120, 0], [19, 524242, 98], [19, 524243, 99], [19, 524244, 100], [19, 524245, 101], [19, 524246, 102], [19, 524247, 117], [19, 524248, 97], [19, 524249, 91], [19, 524250, 92], [19, 524251, 93], [19, 524252, 94], [19, 524253, 95], [19, 524254, 96], [19, 524255, 104], [19, 524256, 111], [19, 524257, 112], [19, 524258, 113], [19, 524259, 114], [19, 524260, 115], [19, 524261, 116], [19, 524262, 110], [19, 524263, 105], [19, 524264, 106], [19, 524265, 107], [19, 524266, 108], [19, 524267, 109], [19, 524268, 118], [19, 524269, 6], [19, 524270, 8], [19, 524271, 9], [19, 524272, 10], [19, 524273, 5], [19, 524274, 103], [19, 524275, 120], [19, 524276, 119], [19, 524277, 4], [19, 524278, 7], [19, 524279, 15], [19, 524280, 16], [19, 524281, 18], [19, 524282, 20], [19, 524283, 17], [19, 524284, 11], [19, 524285, 12], [19, 524286, 14], [19, 524287, 13]]
          , i = [[[1, 0, 0, 0, 0, 0], [5, 16, 1, 0, 0, 0], [5, 17, -1, 0, 0, 0], [5, 18, 0, 0, 0, -1], [5, 19, 0, 1, 0, 0], [5, 20, 0, 0, 0, 1], [5, 21, 0, 0, -1, 0], [5, 22, 0, 0, 1, 0], [5, 23, 0, -1, 0, 0], [7, 96, 1, -1, 0, 0], [7, 97, -1, 1, 0, 0], [7, 98, 0, 0, -1, 1], [7, 99, 0, 1, -1, 0], [7, 100, 0, -1, 1, 0], [7, 101, 0, 0, 1, -1], [7, 102, 1, 1, 0, 0], [7, 103, 0, 0, -1, -1], [7, 104, -1, -1, 0, 0], [7, 105, 0, -1, -1, 0], [7, 106, 1, 0, -1, 0], [7, 107, 0, 1, 0, -1], [7, 108, -1, 0, 1, 0], [7, 109, 0, 0, 1, 1], [7, 110, 1, 0, 1, 0], [7, 111, 0, -1, 0, 1], [7, 112, 0, 1, 1, 0], [7, 113, 0, 1, 0, 1], [7, 114, -1, 0, -1, 0], [7, 115, 1, 0, 0, 1], [7, 116, -1, 0, 0, -1], [7, 117, 1, 0, 0, -1], [7, 118, -1, 0, 0, 1], [7, 119, 0, -1, 0, -1], [9, 480, 1, 1, -1, 0], [9, 481, -1, 1, -1, 0], [9, 482, 1, -1, 1, 0], [9, 483, 0, 1, 1, -1], [9, 484, 0, 1, -1, 1], [9, 485, 0, -1, 1, 1], [9, 486, 0, -1, 1, -1], [9, 487, 1, -1, -1, 0], [9, 488, 1, 0, -1, 1], [9, 489, 0, 1, -1, -1], [9, 490, -1, 1, 1, 0], [9, 491, -1, 0, 1, -1], [9, 492, -1, -1, 1, 0], [9, 493, 0, -1, -1, 1], [9, 494, 1, -1, 0, 1], [9, 495, 1, -1, 0, -1], [9, 496, -1, 1, 0, -1], [9, 497, -1, -1, -1, 0], [9, 498, 0, -1, -1, -1], [9, 499, 0, 1, 1, 1], [9, 500, 1, 0, 1, -1], [9, 501, 1, 1, 0, 1], [9, 502, -1, 1, 0, 1], [9, 503, 1, 1, 1, 0], [10, 1008, -1, -1, 0, 1], [10, 1009, -1, 0, -1, -1], [10, 1010, 1, 1, 0, -1], [10, 1011, 1, 0, -1, -1], [10, 1012, -1, 0, -1, 1], [10, 1013, -1, -1, 0, -1], [10, 1014, -1, 0, 1, 1], [10, 1015, 1, 0, 1, 1], [11, 2032, 1, -1, 1, -1], [11, 2033, -1, 1, -1, 1], [11, 2034, -1, 1, 1, -1], [11, 2035, 1, -1, -1, 1], [11, 2036, 1, 1, 1, 1], [11, 2037, -1, -1, 1, 1], [11, 2038, 1, 1, -1, -1], [11, 2039, -1, -1, 1, -1], [11, 2040, -1, -1, -1, -1], [11, 2041, 1, 1, -1, 1], [11, 2042, 1, -1, 1, 1], [11, 2043, -1, 1, 1, 1], [11, 2044, -1, 1, -1, -1], [11, 2045, -1, -1, -1, 1], [11, 2046, 1, -1, -1, -1], [11, 2047, 1, 1, 1, -1]], [[3, 0, 0, 0, 0, 0], [4, 2, 1, 0, 0, 0], [5, 6, -1, 0, 0, 0], [5, 7, 0, 0, 0, 1], [5, 8, 0, 0, -1, 0], [5, 9, 0, 0, 0, -1], [5, 10, 0, -1, 0, 0], [5, 11, 0, 0, 1, 0], [5, 12, 0, 1, 0, 0], [6, 26, 0, -1, 1, 0], [6, 27, -1, 1, 0, 0], [6, 28, 0, 1, -1, 0], [6, 29, 0, 0, 1, -1], [6, 30, 0, 1, 0, -1], [6, 31, 0, 0, -1, 1], [6, 32, -1, 0, 0, -1], [6, 33, 1, -1, 0, 0], [6, 34, 1, 0, -1, 0], [6, 35, -1, -1, 0, 0], [6, 36, 0, 0, -1, -1], [6, 37, 1, 0, 1, 0], [6, 38, 1, 0, 0, 1], [6, 39, 0, -1, 0, 1], [6, 40, -1, 0, 1, 0], [6, 41, 0, 1, 0, 1], [6, 42, 0, -1, -1, 0], [6, 43, -1, 0, 0, 1], [6, 44, 0, -1, 0, -1], [6, 45, -1, 0, -1, 0], [6, 46, 1, 1, 0, 0], [6, 47, 0, 1, 1, 0], [6, 48, 0, 0, 1, 1], [6, 49, 1, 0, 0, -1], [7, 100, 0, 1, -1, 1], [7, 101, 1, 0, -1, 1], [7, 102, -1, 1, -1, 0], [7, 103, 0, -1, 1, -1], [7, 104, 1, -1, 1, 0], [7, 105, 1, 1, 0, -1], [7, 106, 1, 0, 1, 1], [7, 107, -1, 1, 1, 0], [7, 108, 0, -1, -1, 1], [7, 109, 1, 1, 1, 0], [7, 110, -1, 0, 1, -1], [7, 111, -1, -1, -1, 0], [7, 112, -1, 0, -1, 1], [7, 113, 1, -1, -1, 0], [7, 114, 1, 1, -1, 0], [8, 230, 1, -1, 0, 1], [8, 231, -1, 1, 0, -1], [8, 232, -1, -1, 1, 0], [8, 233, -1, 0, 1, 1], [8, 234, -1, -1, 0, 1], [8, 235, -1, -1, 0, -1], [8, 236, 0, -1, -1, -1], [8, 237, 1, 0, 1, -1], [8, 238, 1, 0, -1, -1], [8, 239, 0, 1, -1, -1], [8, 240, 0, 1, 1, 1], [8, 241, -1, 1, 0, 1], [8, 242, -1, 0, -1, -1], [8, 243, 0, 1, 1, -1], [8, 244, 1, -1, 0, -1], [8, 245, 0, -1, 1, 1], [8, 246, 1, 1, 0, 1], [8, 247, 1, -1, 1, -1], [8, 248, -1, 1, -1, 1], [9, 498, 1, -1, -1, 1], [9, 499, -1, -1, -1, -1], [9, 500, -1, 1, 1, -1], [9, 501, -1, 1, 1, 1], [9, 502, 1, 1, 1, 1], [9, 503, -1, -1, 1, -1], [9, 504, 1, -1, 1, 1], [9, 505, -1, 1, -1, -1], [9, 506, -1, -1, 1, 1], [9, 507, 1, 1, -1, -1], [9, 508, 1, -1, -1, -1], [9, 509, -1, -1, -1, 1], [9, 510, 1, 1, -1, 1], [9, 511, 1, 1, 1, -1]], [[1, 0, 0, 0, 0, 0], [4, 8, 1, 0, 0, 0], [4, 9, 0, 0, 0, 1], [4, 10, 0, 1, 0, 0], [4, 11, 0, 0, 1, 0], [5, 24, 1, 1, 0, 0], [5, 25, 0, 0, 1, 1], [6, 52, 0, 1, 1, 0], [6, 53, 0, 1, 0, 1], [6, 54, 1, 0, 1, 0], [6, 55, 0, 1, 1, 1], [6, 56, 1, 0, 0, 1], [6, 57, 1, 1, 1, 0], [7, 116, 1, 1, 1, 1], [7, 117, 1, 0, 1, 1], [7, 118, 1, 1, 0, 1], [8, 238, 2, 0, 0, 0], [8, 239, 0, 0, 0, 2], [8, 240, 0, 0, 1, 2], [8, 241, 2, 1, 0, 0], [8, 242, 1, 2, 1, 0], [9, 486, 0, 0, 2, 1], [9, 487, 0, 1, 2, 1], [9, 488, 1, 2, 0, 0], [9, 489, 0, 1, 1, 2], [9, 490, 2, 1, 1, 0], [9, 491, 0, 0, 2, 0], [9, 492, 0, 2, 1, 0], [9, 493, 0, 1, 2, 0], [9, 494, 0, 2, 0, 0], [9, 495, 0, 1, 0, 2], [9, 496, 2, 0, 1, 0], [9, 497, 1, 2, 1, 1], [9, 498, 0, 2, 1, 1], [9, 499, 1, 1, 2, 0], [9, 500, 1, 1, 2, 1], [10, 1002, 1, 2, 0, 1], [10, 1003, 1, 0, 2, 0], [10, 1004, 1, 0, 2, 1], [10, 1005, 0, 2, 0, 1], [10, 1006, 2, 1, 1, 1], [10, 1007, 1, 1, 1, 2], [10, 1008, 2, 1, 0, 1], [10, 1009, 1, 0, 1, 2], [10, 1010, 0, 0, 2, 2], [10, 1011, 0, 1, 2, 2], [10, 1012, 2, 2, 1, 0], [10, 1013, 1, 2, 2, 0], [10, 1014, 1, 0, 0, 2], [10, 1015, 2, 0, 0, 1], [10, 1016, 0, 2, 2, 1], [11, 2034, 2, 2, 0, 0], [11, 2035, 1, 2, 2, 1], [11, 2036, 1, 1, 0, 2], [11, 2037, 2, 0, 1, 1], [11, 2038, 1, 1, 2, 2], [11, 2039, 2, 2, 1, 1], [11, 2040, 0, 2, 2, 0], [11, 2041, 0, 2, 1, 2], [12, 4084, 1, 0, 2, 2], [12, 4085, 2, 2, 0, 1], [12, 4086, 2, 1, 2, 0], [12, 4087, 2, 2, 2, 0], [12, 4088, 0, 2, 2, 2], [12, 4089, 2, 2, 2, 1], [12, 4090, 2, 1, 2, 1], [12, 4091, 1, 2, 1, 2], [12, 4092, 1, 2, 2, 2], [13, 8186, 0, 2, 0, 2], [13, 8187, 2, 0, 2, 0], [13, 8188, 1, 2, 0, 2], [14, 16378, 2, 0, 2, 1], [14, 16379, 2, 1, 1, 2], [14, 16380, 2, 1, 0, 2], [15, 32762, 2, 2, 2, 2], [15, 32763, 2, 2, 1, 2], [15, 32764, 2, 1, 2, 2], [15, 32765, 2, 0, 1, 2], [15, 32766, 2, 0, 0, 2], [16, 65534, 2, 2, 0, 2], [16, 65535, 2, 0, 2, 2]], [[4, 0, 1, 1, 1, 1], [4, 1, 0, 1, 1, 1], [4, 2, 1, 1, 0, 1], [4, 3, 1, 1, 1, 0], [4, 4, 1, 0, 1, 1], [4, 5, 1, 0, 0, 0], [4, 6, 1, 1, 0, 0], [4, 7, 0, 0, 0, 0], [4, 8, 0, 0, 1, 1], [4, 9, 1, 0, 1, 0], [5, 20, 1, 0, 0, 1], [5, 21, 0, 1, 1, 0], [5, 22, 0, 0, 0, 1], [5, 23, 0, 1, 0, 1], [5, 24, 0, 0, 1, 0], [5, 25, 0, 1, 0, 0], [7, 104, 2, 1, 1, 1], [7, 105, 1, 1, 2, 1], [7, 106, 1, 2, 1, 1], [7, 107, 1, 1, 1, 2], [7, 108, 2, 1, 1, 0], [7, 109, 2, 1, 0, 1], [7, 110, 1, 2, 1, 0], [7, 111, 2, 0, 1, 1], [7, 112, 0, 1, 2, 1], [8, 226, 0, 1, 1, 2], [8, 227, 1, 1, 2, 0], [8, 228, 0, 2, 1, 1], [8, 229, 1, 0, 1, 2], [8, 230, 1, 2, 0, 1], [8, 231, 1, 1, 0, 2], [8, 232, 1, 0, 2, 1], [8, 233, 2, 1, 0, 0], [8, 234, 2, 0, 1, 0], [8, 235, 1, 2, 0, 0], [8, 236, 2, 0, 0, 1], [8, 237, 0, 1, 0, 2], [8, 238, 0, 2, 1, 0], [8, 239, 0, 0, 1, 2], [8, 240, 0, 1, 2, 0], [8, 241, 0, 2, 0, 1], [8, 242, 1, 0, 0, 2], [8, 243, 0, 0, 2, 1], [8, 244, 1, 0, 2, 0], [8, 245, 2, 0, 0, 0], [8, 246, 0, 0, 0, 2], [9, 494, 0, 2, 0, 0], [9, 495, 0, 0, 2, 0], [9, 496, 1, 2, 2, 1], [9, 497, 2, 2, 1, 1], [9, 498, 2, 1, 2, 1], [9, 499, 1, 1, 2, 2], [9, 500, 1, 2, 1, 2], [9, 501, 2, 1, 1, 2], [10, 1004, 1, 2, 2, 0], [10, 1005, 2, 2, 1, 0], [10, 1006, 2, 1, 2, 0], [10, 1007, 0, 2, 2, 1], [10, 1008, 0, 1, 2, 2], [10, 1009, 2, 2, 0, 1], [10, 1010, 0, 2, 1, 2], [10, 1011, 2, 0, 2, 1], [10, 1012, 1, 0, 2, 2], [10, 1013, 2, 2, 2, 1], [10, 1014, 1, 2, 0, 2], [10, 1015, 2, 0, 1, 2], [10, 1016, 2, 1, 0, 2], [10, 1017, 1, 2, 2, 2], [11, 2036, 2, 1, 2, 2], [11, 2037, 2, 2, 1, 2], [11, 2038, 0, 2, 2, 0], [11, 2039, 2, 2, 0, 0], [11, 2040, 0, 0, 2, 2], [11, 2041, 2, 0, 2, 0], [11, 2042, 0, 2, 0, 2], [11, 2043, 2, 0, 0, 2], [11, 2044, 2, 2, 2, 2], [11, 2045, 0, 2, 2, 2], [11, 2046, 2, 2, 2, 0], [12, 4094, 2, 2, 0, 2], [12, 4095, 2, 0, 2, 2]], [[1, 0, 0, 0], [4, 8, -1, 0], [4, 9, 1, 0], [4, 10, 0, 1], [4, 11, 0, -1], [5, 24, 1, -1], [5, 25, -1, 1], [5, 26, -1, -1], [5, 27, 1, 1], [7, 112, -2, 0], [7, 113, 0, 2], [7, 114, 2, 0], [7, 115, 0, -2], [8, 232, -2, -1], [8, 233, 2, 1], [8, 234, -1, -2], [8, 235, 1, 2], [8, 236, -2, 1], [8, 237, 2, -1], [8, 238, -1, 2], [8, 239, 1, -2], [8, 240, -3, 0], [8, 241, 3, 0], [8, 242, 0, -3], [8, 243, 0, 3], [9, 488, -3, -1], [9, 489, 1, 3], [9, 490, 3, 1], [9, 491, -1, -3], [9, 492, -3, 1], [9, 493, 3, -1], [9, 494, 1, -3], [9, 495, -1, 3], [9, 496, -2, 2], [9, 497, 2, 2], [9, 498, -2, -2], [9, 499, 2, -2], [10, 1e3, -3, -2], [10, 1001, 3, -2], [10, 1002, -2, 3], [10, 1003, 2, -3], [10, 1004, 3, 2], [10, 1005, 2, 3], [10, 1006, -3, 2], [10, 1007, -2, -3], [10, 1008, 0, -4], [10, 1009, -4, 0], [10, 1010, 4, 1], [10, 1011, 4, 0], [11, 2024, -4, -1], [11, 2025, 0, 4], [11, 2026, 4, -1], [11, 2027, -1, -4], [11, 2028, 1, 4], [11, 2029, -1, 4], [11, 2030, -4, 1], [11, 2031, 1, -4], [11, 2032, 3, -3], [11, 2033, -3, -3], [11, 2034, -3, 3], [11, 2035, -2, 4], [11, 2036, -4, -2], [11, 2037, 4, 2], [11, 2038, 2, -4], [11, 2039, 2, 4], [11, 2040, 3, 3], [11, 2041, -4, 2], [12, 4084, -2, -4], [12, 4085, 4, -2], [12, 4086, 3, -4], [12, 4087, -4, -3], [12, 4088, -4, 3], [12, 4089, 3, 4], [12, 4090, -3, 4], [12, 4091, 4, 3], [12, 4092, 4, -3], [12, 4093, -3, -4], [13, 8188, 4, -4], [13, 8189, -4, 4], [13, 8190, 4, 4], [13, 8191, -4, -4]], [[4, 0, 0, 0], [4, 1, 1, 0], [4, 2, 0, -1], [4, 3, 0, 1], [4, 4, -1, 0], [4, 5, 1, 1], [4, 6, -1, 1], [4, 7, 1, -1], [4, 8, -1, -1], [6, 36, 2, -1], [6, 37, 2, 1], [6, 38, -2, 1], [6, 39, -2, -1], [6, 40, -2, 0], [6, 41, -1, 2], [6, 42, 2, 0], [6, 43, 1, -2], [6, 44, 1, 2], [6, 45, 0, -2], [6, 46, -1, -2], [6, 47, 0, 2], [6, 48, 2, -2], [6, 49, -2, 2], [6, 50, -2, -2], [6, 51, 2, 2], [7, 104, -3, 1], [7, 105, 3, 1], [7, 106, 3, -1], [7, 107, -1, 3], [7, 108, -3, -1], [7, 109, 1, 3], [7, 110, 1, -3], [7, 111, -1, -3], [7, 112, 3, 0], [7, 113, -3, 0], [7, 114, 0, -3], [7, 115, 0, 3], [7, 116, 3, 2], [8, 234, -3, -2], [8, 235, -2, 3], [8, 236, 2, 3], [8, 237, 3, -2], [8, 238, 2, -3], [8, 239, -2, -3], [8, 240, -3, 2], [8, 241, 3, 3], [9, 484, 3, -3], [9, 485, -3, -3], [9, 486, -3, 3], [9, 487, 1, -4], [9, 488, -1, -4], [9, 489, 4, 1], [9, 490, -4, 1], [9, 491, -4, -1], [9, 492, 1, 4], [9, 493, 4, -1], [9, 494, -1, 4], [9, 495, 0, -4], [9, 496, -4, 2], [9, 497, -4, -2], [9, 498, 2, 4], [9, 499, -2, -4], [9, 500, -4, 0], [9, 501, 4, 2], [9, 502, 4, -2], [9, 503, -2, 4], [9, 504, 4, 0], [9, 505, 2, -4], [9, 506, 0, 4], [10, 1014, -3, -4], [10, 1015, -3, 4], [10, 1016, 3, -4], [10, 1017, 4, -3], [10, 1018, 3, 4], [10, 1019, 4, 3], [10, 1020, -4, 3], [10, 1021, -4, -3], [11, 2044, 4, 4], [11, 2045, -4, 4], [11, 2046, -4, -4], [11, 2047, 4, -4]], [[1, 0, 0, 0], [3, 4, 1, 0], [3, 5, 0, 1], [4, 12, 1, 1], [6, 52, 2, 1], [6, 53, 1, 2], [6, 54, 2, 0], [6, 55, 0, 2], [7, 112, 3, 1], [7, 113, 1, 3], [7, 114, 2, 2], [7, 115, 3, 0], [7, 116, 0, 3], [8, 234, 2, 3], [8, 235, 3, 2], [8, 236, 1, 4], [8, 237, 4, 1], [8, 238, 1, 5], [8, 239, 5, 1], [8, 240, 3, 3], [8, 241, 2, 4], [8, 242, 0, 4], [8, 243, 4, 0], [9, 488, 4, 2], [9, 489, 2, 5], [9, 490, 5, 2], [9, 491, 0, 5], [9, 492, 6, 1], [9, 493, 5, 0], [9, 494, 1, 6], [9, 495, 4, 3], [9, 496, 3, 5], [9, 497, 3, 4], [9, 498, 5, 3], [9, 499, 2, 6], [9, 500, 6, 2], [9, 501, 1, 7], [10, 1004, 3, 6], [10, 1005, 0, 6], [10, 1006, 6, 0], [10, 1007, 4, 4], [10, 1008, 7, 1], [10, 1009, 4, 5], [10, 1010, 7, 2], [10, 1011, 5, 4], [10, 1012, 6, 3], [10, 1013, 2, 7], [10, 1014, 7, 3], [10, 1015, 6, 4], [10, 1016, 5, 5], [10, 1017, 4, 6], [10, 1018, 3, 7], [11, 2038, 7, 0], [11, 2039, 0, 7], [11, 2040, 6, 5], [11, 2041, 5, 6], [11, 2042, 7, 4], [11, 2043, 4, 7], [11, 2044, 5, 7], [11, 2045, 7, 5], [12, 4092, 7, 6], [12, 4093, 6, 6], [12, 4094, 6, 7], [12, 4095, 7, 7]], [[3, 0, 1, 1], [4, 2, 2, 1], [4, 3, 1, 0], [4, 4, 1, 2], [4, 5, 0, 1], [4, 6, 2, 2], [5, 14, 0, 0], [5, 15, 2, 0], [5, 16, 0, 2], [5, 17, 3, 1], [5, 18, 1, 3], [5, 19, 3, 2], [5, 20, 2, 3], [6, 42, 3, 3], [6, 43, 4, 1], [6, 44, 1, 4], [6, 45, 4, 2], [6, 46, 2, 4], [6, 47, 3, 0], [6, 48, 0, 3], [6, 49, 4, 3], [6, 50, 3, 4], [6, 51, 5, 2], [7, 104, 5, 1], [7, 105, 2, 5], [7, 106, 1, 5], [7, 107, 5, 3], [7, 108, 3, 5], [7, 109, 4, 4], [7, 110, 5, 4], [7, 111, 0, 4], [7, 112, 4, 5], [7, 113, 4, 0], [7, 114, 2, 6], [7, 115, 6, 2], [7, 116, 6, 1], [7, 117, 1, 6], [8, 236, 3, 6], [8, 237, 6, 3], [8, 238, 5, 5], [8, 239, 5, 0], [8, 240, 6, 4], [8, 241, 0, 5], [8, 242, 4, 6], [8, 243, 7, 1], [8, 244, 7, 2], [8, 245, 2, 7], [8, 246, 6, 5], [8, 247, 7, 3], [8, 248, 1, 7], [8, 249, 5, 6], [8, 250, 3, 7], [9, 502, 6, 6], [9, 503, 7, 4], [9, 504, 6, 0], [9, 505, 4, 7], [9, 506, 0, 6], [9, 507, 7, 5], [9, 508, 7, 6], [9, 509, 6, 7], [10, 1020, 5, 7], [10, 1021, 7, 0], [10, 1022, 0, 7], [10, 1023, 7, 7]], [[1, 0, 0, 0], [3, 4, 1, 0], [3, 5, 0, 1], [4, 12, 1, 1], [6, 52, 2, 1], [6, 53, 1, 2], [6, 54, 2, 0], [6, 55, 0, 2], [7, 112, 3, 1], [7, 113, 2, 2], [7, 114, 1, 3], [8, 230, 3, 0], [8, 231, 0, 3], [8, 232, 2, 3], [8, 233, 3, 2], [8, 234, 1, 4], [8, 235, 4, 1], [8, 236, 2, 4], [8, 237, 1, 5], [9, 476, 4, 2], [9, 477, 3, 3], [9, 478, 0, 4], [9, 479, 4, 0], [9, 480, 5, 1], [9, 481, 2, 5], [9, 482, 1, 6], [9, 483, 3, 4], [9, 484, 5, 2], [9, 485, 6, 1], [9, 486, 4, 3], [10, 974, 0, 5], [10, 975, 2, 6], [10, 976, 5, 0], [10, 977, 1, 7], [10, 978, 3, 5], [10, 979, 1, 8], [10, 980, 8, 1], [10, 981, 4, 4], [10, 982, 5, 3], [10, 983, 6, 2], [10, 984, 7, 1], [10, 985, 0, 6], [10, 986, 8, 2], [10, 987, 2, 8], [10, 988, 3, 6], [10, 989, 2, 7], [10, 990, 4, 5], [10, 991, 9, 1], [10, 992, 1, 9], [10, 993, 7, 2], [11, 1988, 6, 0], [11, 1989, 5, 4], [11, 1990, 6, 3], [11, 1991, 8, 3], [11, 1992, 0, 7], [11, 1993, 9, 2], [11, 1994, 3, 8], [11, 1995, 4, 6], [11, 1996, 3, 7], [11, 1997, 0, 8], [11, 1998, 10, 1], [11, 1999, 6, 4], [11, 2e3, 2, 9], [11, 2001, 5, 5], [11, 2002, 8, 0], [11, 2003, 7, 0], [11, 2004, 7, 3], [11, 2005, 10, 2], [11, 2006, 9, 3], [11, 2007, 8, 4], [11, 2008, 1, 10], [11, 2009, 7, 4], [11, 2010, 6, 5], [11, 2011, 5, 6], [11, 2012, 4, 8], [11, 2013, 4, 7], [11, 2014, 3, 9], [11, 2015, 11, 1], [11, 2016, 5, 8], [11, 2017, 9, 0], [11, 2018, 8, 5], [12, 4038, 10, 3], [12, 4039, 2, 10], [12, 4040, 0, 9], [12, 4041, 11, 2], [12, 4042, 9, 4], [12, 4043, 6, 6], [12, 4044, 12, 1], [12, 4045, 4, 9], [12, 4046, 8, 6], [12, 4047, 1, 11], [12, 4048, 9, 5], [12, 4049, 10, 4], [12, 4050, 5, 7], [12, 4051, 7, 5], [12, 4052, 2, 11], [12, 4053, 1, 12], [12, 4054, 12, 2], [12, 4055, 11, 3], [12, 4056, 3, 10], [12, 4057, 5, 9], [12, 4058, 6, 7], [12, 4059, 8, 7], [12, 4060, 11, 4], [12, 4061, 0, 10], [12, 4062, 7, 6], [12, 4063, 12, 3], [12, 4064, 10, 0], [12, 4065, 10, 5], [12, 4066, 4, 10], [12, 4067, 6, 8], [12, 4068, 2, 12], [12, 4069, 9, 6], [12, 4070, 9, 7], [12, 4071, 4, 11], [12, 4072, 11, 0], [12, 4073, 6, 9], [12, 4074, 3, 11], [12, 4075, 5, 10], [13, 8152, 8, 8], [13, 8153, 7, 8], [13, 8154, 12, 5], [13, 8155, 3, 12], [13, 8156, 11, 5], [13, 8157, 7, 7], [13, 8158, 12, 4], [13, 8159, 11, 6], [13, 8160, 10, 6], [13, 8161, 4, 12], [13, 8162, 7, 9], [13, 8163, 5, 11], [13, 8164, 0, 11], [13, 8165, 12, 6], [13, 8166, 6, 10], [13, 8167, 12, 0], [13, 8168, 10, 7], [13, 8169, 5, 12], [13, 8170, 7, 10], [13, 8171, 9, 8], [13, 8172, 0, 12], [13, 8173, 11, 7], [13, 8174, 8, 9], [13, 8175, 9, 9], [13, 8176, 10, 8], [13, 8177, 7, 11], [13, 8178, 12, 7], [13, 8179, 6, 11], [13, 8180, 8, 11], [13, 8181, 11, 8], [13, 8182, 7, 12], [13, 8183, 6, 12], [14, 16368, 8, 10], [14, 16369, 10, 9], [14, 16370, 8, 12], [14, 16371, 9, 10], [14, 16372, 9, 11], [14, 16373, 9, 12], [14, 16374, 10, 11], [14, 16375, 12, 9], [14, 16376, 10, 10], [14, 16377, 11, 9], [14, 16378, 12, 8], [14, 16379, 11, 10], [14, 16380, 12, 10], [14, 16381, 12, 11], [15, 32764, 10, 12], [15, 32765, 11, 11], [15, 32766, 11, 12], [15, 32767, 12, 12]], [[4, 0, 1, 1], [4, 1, 1, 2], [4, 2, 2, 1], [5, 6, 2, 2], [5, 7, 1, 0], [5, 8, 0, 1], [5, 9, 1, 3], [5, 10, 3, 2], [5, 11, 3, 1], [5, 12, 2, 3], [5, 13, 3, 3], [6, 28, 2, 0], [6, 29, 0, 2], [6, 30, 2, 4], [6, 31, 4, 2], [6, 32, 1, 4], [6, 33, 4, 1], [6, 34, 0, 0], [6, 35, 4, 3], [6, 36, 3, 4], [6, 37, 3, 0], [6, 38, 0, 3], [6, 39, 4, 4], [6, 40, 2, 5], [6, 41, 5, 2], [7, 84, 1, 5], [7, 85, 5, 1], [7, 86, 5, 3], [7, 87, 3, 5], [7, 88, 5, 4], [7, 89, 4, 5], [7, 90, 6, 2], [7, 91, 2, 6], [7, 92, 6, 3], [7, 93, 4, 0], [7, 94, 6, 1], [7, 95, 0, 4], [7, 96, 1, 6], [7, 97, 3, 6], [7, 98, 5, 5], [7, 99, 6, 4], [7, 100, 4, 6], [8, 202, 6, 5], [8, 203, 7, 2], [8, 204, 3, 7], [8, 205, 2, 7], [8, 206, 5, 6], [8, 207, 8, 2], [8, 208, 7, 3], [8, 209, 5, 0], [8, 210, 7, 1], [8, 211, 0, 5], [8, 212, 8, 1], [8, 213, 1, 7], [8, 214, 8, 3], [8, 215, 7, 4], [8, 216, 4, 7], [8, 217, 2, 8], [8, 218, 6, 6], [8, 219, 7, 5], [8, 220, 1, 8], [8, 221, 3, 8], [8, 222, 8, 4], [8, 223, 4, 8], [8, 224, 5, 7], [8, 225, 8, 5], [8, 226, 5, 8], [9, 454, 7, 6], [9, 455, 6, 7], [9, 456, 9, 2], [9, 457, 6, 0], [9, 458, 6, 8], [9, 459, 9, 3], [9, 460, 3, 9], [9, 461, 9, 1], [9, 462, 2, 9], [9, 463, 0, 6], [9, 464, 8, 6], [9, 465, 9, 4], [9, 466, 4, 9], [9, 467, 10, 2], [9, 468, 1, 9], [9, 469, 7, 7], [9, 470, 8, 7], [9, 471, 9, 5], [9, 472, 7, 8], [9, 473, 10, 3], [9, 474, 5, 9], [9, 475, 10, 4], [9, 476, 2, 10], [9, 477, 10, 1], [9, 478, 3, 10], [9, 479, 9, 6], [9, 480, 6, 9], [9, 481, 8, 0], [9, 482, 4, 10], [9, 483, 7, 0], [9, 484, 11, 2], [10, 970, 7, 9], [10, 971, 11, 3], [10, 972, 10, 6], [10, 973, 1, 10], [10, 974, 11, 1], [10, 975, 9, 7], [10, 976, 0, 7], [10, 977, 8, 8], [10, 978, 10, 5], [10, 979, 3, 11], [10, 980, 5, 10], [10, 981, 8, 9], [10, 982, 11, 5], [10, 983, 0, 8], [10, 984, 11, 4], [10, 985, 2, 11], [10, 986, 7, 10], [10, 987, 6, 10], [10, 988, 10, 7], [10, 989, 4, 11], [10, 990, 1, 11], [10, 991, 12, 2], [10, 992, 9, 8], [10, 993, 12, 3], [10, 994, 11, 6], [10, 995, 5, 11], [10, 996, 12, 4], [10, 997, 11, 7], [10, 998, 12, 5], [10, 999, 3, 12], [10, 1e3, 6, 11], [10, 1001, 9, 0], [10, 1002, 10, 8], [10, 1003, 10, 0], [10, 1004, 12, 1], [10, 1005, 0, 9], [10, 1006, 4, 12], [10, 1007, 9, 9], [10, 1008, 12, 6], [10, 1009, 2, 12], [10, 1010, 8, 10], [11, 2022, 9, 10], [11, 2023, 1, 12], [11, 2024, 11, 8], [11, 2025, 12, 7], [11, 2026, 7, 11], [11, 2027, 5, 12], [11, 2028, 6, 12], [11, 2029, 10, 9], [11, 2030, 8, 11], [11, 2031, 12, 8], [11, 2032, 0, 10], [11, 2033, 7, 12], [11, 2034, 11, 0], [11, 2035, 10, 10], [11, 2036, 11, 9], [11, 2037, 11, 10], [11, 2038, 0, 11], [11, 2039, 11, 11], [11, 2040, 9, 11], [11, 2041, 10, 11], [11, 2042, 12, 0], [11, 2043, 8, 12], [12, 4088, 12, 9], [12, 4089, 10, 12], [12, 4090, 9, 12], [12, 4091, 11, 12], [12, 4092, 12, 11], [12, 4093, 0, 12], [12, 4094, 12, 10], [12, 4095, 12, 12]], [[4, 0, 0, 0], [4, 1, 1, 1], [5, 4, 16, 16], [5, 5, 1, 0], [5, 6, 0, 1], [5, 7, 2, 1], [5, 8, 1, 2], [5, 9, 2, 2], [6, 20, 1, 3], [6, 21, 3, 1], [6, 22, 3, 2], [6, 23, 2, 0], [6, 24, 2, 3], [6, 25, 0, 2], [6, 26, 3, 3], [7, 54, 4, 1], [7, 55, 1, 4], [7, 56, 4, 2], [7, 57, 2, 4], [7, 58, 4, 3], [7, 59, 3, 4], [7, 60, 3, 0], [7, 61, 0, 3], [7, 62, 5, 1], [7, 63, 5, 2], [7, 64, 2, 5], [7, 65, 4, 4], [7, 66, 1, 5], [7, 67, 5, 3], [7, 68, 3, 5], [7, 69, 5, 4], [8, 140, 4, 5], [8, 141, 6, 2], [8, 142, 2, 6], [8, 143, 6, 1], [8, 144, 6, 3], [8, 145, 3, 6], [8, 146, 1, 6], [8, 147, 4, 16], [8, 148, 3, 16], [8, 149, 16, 5], [8, 150, 16, 3], [8, 151, 16, 4], [8, 152, 6, 4], [8, 153, 16, 6], [8, 154, 4, 0], [8, 155, 4, 6], [8, 156, 0, 4], [8, 157, 2, 16], [8, 158, 5, 5], [8, 159, 5, 16], [8, 160, 16, 7], [8, 161, 16, 2], [8, 162, 16, 8], [8, 163, 2, 7], [8, 164, 7, 2], [8, 165, 3, 7], [8, 166, 6, 5], [8, 167, 5, 6], [8, 168, 6, 16], [8, 169, 16, 10], [8, 170, 7, 3], [8, 171, 7, 1], [8, 172, 16, 9], [8, 173, 7, 16], [8, 174, 1, 16], [8, 175, 1, 7], [8, 176, 4, 7], [8, 177, 16, 11], [8, 178, 7, 4], [8, 179, 16, 12], [8, 180, 8, 16], [8, 181, 16, 1], [8, 182, 6, 6], [8, 183, 9, 16], [8, 184, 2, 8], [8, 185, 5, 7], [8, 186, 10, 16], [8, 187, 16, 13], [8, 188, 8, 3], [8, 189, 8, 2], [8, 190, 3, 8], [8, 191, 5, 0], [8, 192, 16, 14], [8, 193, 11, 16], [8, 194, 7, 5], [8, 195, 4, 8], [8, 196, 6, 7], [8, 197, 7, 6], [8, 198, 0, 5], [9, 398, 8, 4], [9, 399, 16, 15], [9, 400, 12, 16], [9, 401, 1, 8], [9, 402, 8, 1], [9, 403, 14, 16], [9, 404, 5, 8], [9, 405, 13, 16], [9, 406, 3, 9], [9, 407, 8, 5], [9, 408, 7, 7], [9, 409, 2, 9], [9, 410, 8, 6], [9, 411, 9, 2], [9, 412, 9, 3], [9, 413, 15, 16], [9, 414, 4, 9], [9, 415, 6, 8], [9, 416, 6, 0], [9, 417, 9, 4], [9, 418, 5, 9], [9, 419, 8, 7], [9, 420, 7, 8], [9, 421, 1, 9], [9, 422, 10, 3], [9, 423, 0, 6], [9, 424, 10, 2], [9, 425, 9, 1], [9, 426, 9, 5], [9, 427, 4, 10], [9, 428, 2, 10], [9, 429, 9, 6], [9, 430, 3, 10], [9, 431, 6, 9], [9, 432, 10, 4], [9, 433, 8, 8], [9, 434, 10, 5], [9, 435, 9, 7], [9, 436, 11, 3], [9, 437, 1, 10], [9, 438, 7, 0], [9, 439, 10, 6], [9, 440, 7, 9], [9, 441, 3, 11], [9, 442, 5, 10], [9, 443, 10, 1], [9, 444, 4, 11], [9, 445, 11, 2], [9, 446, 13, 2], [9, 447, 6, 10], [9, 448, 13, 3], [9, 449, 2, 11], [9, 450, 16, 0], [9, 451, 5, 11], [9, 452, 11, 5], [10, 906, 11, 4], [10, 907, 9, 8], [10, 908, 7, 10], [10, 909, 8, 9], [10, 910, 0, 16], [10, 911, 4, 13], [10, 912, 0, 7], [10, 913, 3, 13], [10, 914, 11, 6], [10, 915, 13, 1], [10, 916, 13, 4], [10, 917, 12, 3], [10, 918, 2, 13], [10, 919, 13, 5], [10, 920, 8, 10], [10, 921, 6, 11], [10, 922, 10, 8], [10, 923, 10, 7], [10, 924, 14, 2], [10, 925, 12, 4], [10, 926, 1, 11], [10, 927, 4, 12], [10, 928, 11, 1], [10, 929, 3, 12], [10, 930, 1, 13], [10, 931, 12, 2], [10, 932, 7, 11], [10, 933, 3, 14], [10, 934, 5, 12], [10, 935, 5, 13], [10, 936, 14, 4], [10, 937, 4, 14], [10, 938, 11, 7], [10, 939, 14, 3], [10, 940, 12, 5], [10, 941, 13, 6], [10, 942, 12, 6], [10, 943, 8, 0], [10, 944, 11, 8], [10, 945, 2, 12], [10, 946, 9, 9], [10, 947, 14, 5], [10, 948, 6, 13], [10, 949, 10, 10], [10, 950, 15, 2], [10, 951, 8, 11], [10, 952, 9, 10], [10, 953, 14, 6], [10, 954, 10, 9], [10, 955, 5, 14], [10, 956, 11, 9], [10, 957, 14, 1], [10, 958, 2, 14], [10, 959, 6, 12], [10, 960, 1, 12], [10, 961, 13, 8], [10, 962, 0, 8], [10, 963, 13, 7], [10, 964, 7, 12], [10, 965, 12, 7], [10, 966, 7, 13], [10, 967, 15, 3], [10, 968, 12, 1], [10, 969, 6, 14], [10, 970, 2, 15], [10, 971, 15, 5], [10, 972, 15, 4], [10, 973, 1, 14], [10, 974, 9, 11], [10, 975, 4, 15], [10, 976, 14, 7], [10, 977, 8, 13], [10, 978, 13, 9], [10, 979, 8, 12], [10, 980, 5, 15], [10, 981, 3, 15], [10, 982, 10, 11], [10, 983, 11, 10], [10, 984, 12, 8], [10, 985, 15, 6], [10, 986, 15, 7], [10, 987, 8, 14], [10, 988, 15, 1], [10, 989, 7, 14], [10, 990, 9, 0], [10, 991, 0, 9], [10, 992, 9, 13], [10, 993, 9, 12], [10, 994, 12, 9], [10, 995, 14, 8], [10, 996, 10, 13], [10, 997, 14, 9], [10, 998, 12, 10], [10, 999, 6, 15], [10, 1e3, 7, 15], [11, 2002, 9, 14], [11, 2003, 15, 8], [11, 2004, 11, 11], [11, 2005, 11, 14], [11, 2006, 1, 15], [11, 2007, 10, 12], [11, 2008, 10, 14], [11, 2009, 13, 11], [11, 2010, 13, 10], [11, 2011, 11, 13], [11, 2012, 11, 12], [11, 2013, 8, 15], [11, 2014, 14, 11], [11, 2015, 13, 12], [11, 2016, 12, 13], [11, 2017, 15, 9], [11, 2018, 14, 10], [11, 2019, 10, 0], [11, 2020, 12, 11], [11, 2021, 9, 15], [11, 2022, 0, 10], [11, 2023, 12, 12], [11, 2024, 11, 0], [11, 2025, 12, 14], [11, 2026, 10, 15], [11, 2027, 13, 13], [11, 2028, 0, 13], [11, 2029, 14, 12], [11, 2030, 15, 10], [11, 2031, 15, 11], [11, 2032, 11, 15], [11, 2033, 14, 13], [11, 2034, 13, 0], [11, 2035, 0, 11], [11, 2036, 13, 14], [11, 2037, 15, 12], [11, 2038, 15, 13], [11, 2039, 12, 15], [11, 2040, 14, 0], [11, 2041, 14, 14], [11, 2042, 13, 15], [11, 2043, 12, 0], [11, 2044, 14, 15], [12, 4090, 0, 14], [12, 4091, 0, 12], [12, 4092, 15, 14], [12, 4093, 15, 0], [12, 4094, 0, 15], [12, 4095, 15, 15]]]
          , a = [!1, !1, !0, !0, !1, !1, !0, !0, !0, !0, !0]
          , o = {
            findOffset: function(e, t) {
                for (var n = 0, r = t[n][0], i = e.read(r); i !== t[n][1]; ) {
                    var a = t[++n][0] - r;
                    r = t[n][0],
                    i <<= a,
                    i |= e.read(a)
                }
                return n
            },
            signValues: function(e, t, n, r) {
                for (var i = n; i < n + r; i++)
                    t[i] && e.read(1) && (t[i] = -t[i])
            },
            getEscape: function(e, t) {
                for (var n = 4; e.read(1); )
                    n++;
                var r = e.read(n) | 1 << n;
                return t < 0 ? -r : r
            },
            decodeScaleFactor: function(e) {
                var t = this.findOffset(e, r);
                return r[t][2]
            },
            decodeSpectralData: function(e, t, n, r) {
                var o = i[t - 1]
                  , s = this.findOffset(e, o);
                if (n[r] = o[s][2],
                n[r + 1] = o[s][3],
                t < 5 && (n[r + 2] = o[s][4],
                n[r + 3] = o[s][5]),
                t < 11)
                    a[t - 1] && this.signValues(e, n, r, t < 5 ? 4 : 2);
                else {
                    if (!(11 === t || 15 < t))
                        throw new Error("Huffman: unknown spectral codebook: " + t);
                    this.signValues(e, n, r, t < 5 ? 4 : 2),
                    16 === Math.abs(n[r]) && (n[r] = this.getEscape(e, n[r])),
                    16 === Math.abs(n[r + 1]) && (n[r + 1] = this.getEscape(e, n[r + 1]))
                }
            }
        };
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        var r;
        var player = (r = n(12)) && r.__esModule ? r : {default: r};
        var a = void 0;
        window.load = function() {
            a && a.destroy();
            var e = document.getElementById("input").value;
            (a = new player.default({
                url: e,
                canvas: document.getElementById("video")
            })).play()
        }
        ,
        window.play = function() {
            a.play()
        }
        ,
        window.pause = function() {
            a.pause()
        }
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = d(n(4))
          , a = d(n(13))
          , o = d(n(22))
          , s = d(n(25))
          , u = d(n(36))
          , f = d(n(37))
          , l = d(n(38))
          , c = d(n(39));
        function d(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var h = function(e) {
            function t() {
                var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
                !function(e, n) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var n = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return n.config = {
                    url: e.url,
                    width: 0,
                    height: 0,
                    sampleRate: 0,
                    movieTimescale: 0,
                    channelCount: 0,
                    iframeRate: 0,
                    canvas: e.canvas
                },
                n.status = {
                    play: !1,
                    canplay: !1,
                    playing: !1
                },
                n.mediaInfo = null,
                n._actionCache = [],
                n.canPlayNextIframe = !0,
                n.loader = new l.default,
                n.demuxer = new a.default,
                n.videoDecoder = new o.default(n.config),
                n.audioDecoder = new s.default(n.config),
                n._bindDecoderEvent(),
                n._bindDemuxerEvent(),
                n._bindLoaderEvent(),
                n.animationId = null,
                n._updateIframe = n._updateIframe.bind(n),
                n.loader.open(n.config.url),
                n
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, i.default),
            r(t, [{
                key: "_bindLoaderEvent",
                value: function() {
                    var e = this;
                    this.loader.on("dataArrival", function(t) {
                        e.demuxer.decode(t.chunk)
                    })
                }
            }, {
                key: "_bindDemuxerEvent",
                value: function() {
                    var e = this;
                    this.demuxer.on("mediaInfo", function(t) {
                        e.mediaInfo = t,
                        e.config.width = t.videoTrack.trackWidth,
                        e.config.height = t.videoTrack.trackHeight,
                        e.config.channelCount = t.audioTrack.audio.channelCount,
                        e.config.sampleRate = t.audioTrack.audio.sampleRate,
                        e.config.movieTimescale = t.videoTrack.timeScale,
                        e.config.iframeRate = t.videoTrack.nbsamples / (t.videoTrack.samplesDuration / t.videoTrack.timeScale),
                        e.videoDevice = new u.default(e.config),
                        e.audioDevice = new f.default(e.config),
                        e.status.canplay = !0,
                        e._excuteCacheActions()
                    }),
                    this.demuxer.on("box:hvcC", function(t) {
                        t.naluArrays.forEach(function(t) {
                            t.forEach(function(t) {
                                var n = new Uint8Array(4 + t.data.byteLength)
                                  , r = new Uint8Array([0, 0, 0, 1])
                                  , i = new Uint8Array(t.data);
                                n.set(r, 0),
                                n.set(i, 4),
                                e.videoDecoder.appendBuffer(n.buffer)
                            })
                        })
                    }),
                    this.demuxer.on("video:sample", function(t) {
                        for (var n = t.data.byteLength, r = 0; r < n; ) {
                            var i = c.default.readUInt32BE(t.data, r)
                              , a = new Uint8Array(4 + i)
                              , o = new Uint8Array([0, 0, 0, 1])
                              , s = new Uint8Array(t.data.slice(r + 4, r + 4 + i));
                            a.set(o, 0),
                            a.set(s, 4);
                            var u = (s[0] << 1 & 255) >>> 2;
                            0 !== u && e.videoDecoder.appendBuffer(a.buffer, t.cts, u),
                            r = r + 4 + i
                        }
                    }),
                    this.demuxer.on("box:esds", function(t) {
                        e.audioDecoder.setCookie(t.dsi.buffer)
                    }),
                    this.demuxer.on("audio:sample", function(t) {
                        e.audioDecoder.appendBuffer(t.data, t.dts, t.number)
                    })
                }
            }, {
                key: "_bindDecoderEvent",
                value: function() {
                    var e = this;
                    this.videoDecoder.on("data", function(t) {
                        e.videoDevice.render(t.data),
                        e.canPlayNextIframe = !0
                    }),
                    this.audioDecoder.on("data", function(t) {
                        e.audioDevice.play(t)
                    })
                }
            }, {
                key: "play",
                value: function() {
                    this.status.play = !0,
                    this.status.canplay ? this.animationId = requestAnimationFrame(this._updateIframe) : this._cacheAction({
                        cmd: "play",
                        param: []
                    })
                }
            }, {
                key: "pause",
                value: function() {
                    this.status.play = !1,
                    this.status.playing = !1,
                    cancelAnimationFrame(this.animationId),
                    this.audioDevice.stop()
                }
            }, {
                key: "destroy",
                value: function() {
                    this.pause(),
                    this.videoDecoder.destroy(),
                    this.audioDevice && this.audioDevice.destroy()
                }
            }, {
                key: "_updateIframe",
                value: function() {
                    this.animationId = requestAnimationFrame(this._updateIframe),
                    this.getAudioCurrentTime() >= this.mediaInfo.duration / this.mediaInfo.timescale ? this.pause() : (this.audioDecoder.canPlay && this.audioDevice.enqueuedTime < .25 && this.audioDecoder.decode(),
                    this.getVideoCurrentTime() < this.getAudioCurrentTime() && this.canPlayNextIframe && (this.canPlayNextIframe = !1,
                    this.status.playing = !0,
                    this.videoDecoder.decode()))
                }
            }, {
                key: "_cacheAction",
                value: function(e) {
                    this._actionCache.push(e)
                }
            }, {
                key: "_excuteCacheActions",
                value: function() {
                    var e = this;
                    this._actionCache.forEach(function(t) {
                        e[t.cmd].apply(e, function(e) {
                            if (Array.isArray(e)) {
                                for (var t = 0, n = Array(e.length); t < e.length; t++)
                                    n[t] = e[t];
                                return n
                            }
                            return Array.from(e)
                        }(t.param))
                    })
                }
            }, {
                key: "getAudioCurrentTime",
                value: function() {
                    return this.audioDecoder.decodedTime - this.audioDevice.enqueuedTime
                }
            }, {
                key: "getVideoCurrentTime",
                value: function() {
                    return this.videoDecoder.decodedTime
                }
            }]),
            t
        }();
        t.default = h,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = u(n(14))
          , a = u(n(15))
          , o = u(n(19))
          , s = u(n(20));
        function u(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var f = function(e) {
            function t() {
                !function(e, n) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var e = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return e._bindMp4ParserEvent = function() {
                    e.mp4Parser.on("box", e._parseBoxHandler)
                }
                ,
                e._parseBoxHandler = function(t) {
                    switch (t.type) {
                    case "moof":
                        e.moofs.push(t);
                        break;
                    default:
                        e.mp4[t.type] = t
                    }
                    e.emit("box:" + t.type, t)
                }
                ,
                e.mp4Parser = new a.default,
                e.sampleSteam = new s.default,
                e.moofs = [],
                e.mp4 = {},
                e.sampleListBuilt = !1,
                e._bindMp4ParserEvent(),
                e
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, i.default),
            r(t, [{
                key: "decode",
                value: function(e) {
                    this.mp4Parser.decode(e),
                    this.sampleSteam.write(e),
                    this.mp4.moov && (this.sampleListBuilt || (this._buildSampleLists(),
                    this.sampleListBuilt = !0),
                    this.readySent || (this.readySent = !0,
                    this.emit("mediaInfo", this._getMediaInfo())),
                    this._processSamples())
                }
            }, {
                key: "_getMediaInfo",
                value: function() {
                    var e = void 0
                      , t = {}
                      , n = void 0
                      , r = void 0
                      , i = void 0
                      , a = (new Date(4,0,1,0,0,0,0).getTime(),
                    this.mp4);
                    if (a.moov)
                        for (t.hasMoov = !0,
                        t.duration = a.moov.mvhd.duration,
                        t.timescale = a.moov.mvhd.timeScale,
                        t.isFragmented = null != a.moov.mvex,
                        t.isFragmented && a.moov.mvex.mehd && (t.fragmentDuration = a.moov.mvex.mehd.fragmentDuration),
                        t.brands = {
                            brand: a.ftyp.brand,
                            brandVersion: a.ftyp.brandVersion,
                            compatibleBrands: a.ftyp.compatibleBrands
                        },
                        t.created = a.mvhd.ctime,
                        t.modified = a.mvhd.mtime,
                        t.tracks = [],
                        t.audioTrack = null,
                        t.videoTrack = null,
                        e = 0; e < a.moov.trak.length; e++) {
                            i = (n = a.moov.trak[e]).mdia.minf.stbl.stsd.entries[0],
                            r = {},
                            t.tracks.push(r),
                            r.id = n.tkhd.trackId,
                            r.name = n.mdia.hdlr.name,
                            r.references = [],
                            n.edts && (r.edits = n.edts.elst.entries),
                            r.created = n.tkhd.ctime,
                            r.modified = n.tkhd.mtime,
                            r.movieDuration = n.tkhd.duration,
                            r.movieTimescale = t.timescale,
                            r.trackWidth = n.tkhd.trackWidth / 65536,
                            r.trackHeight = n.tkhd.trackHeight / 65536,
                            r.timeScale = n.mdia.mdhd.timeScale,
                            r.duration = n.mdia.mdhd.duration,
                            r.samplesDuration = n.samplesDuration,
                            r.codec = (0,
                            o.default)(i),
                            r.kind = n.udta && n.udta.kinds.length ? n.udta.kinds[0] : {
                                schemeURI: "",
                                value: ""
                            },
                            r.nbsamples = n.samples.length,
                            r.size = n.samplesSize,
                            r.bitrate = 8 * r.size * r.timeScale / r.samplesDuration;
                            var s = "soun" === n.mdia.hdlr.handlerType
                              , u = "vide" === n.mdia.hdlr.handlerType;
                            s ? (r.type = "audio",
                            (t.audioTrack = r).audio = {},
                            r.audio.sampleRate = i.sampleRate,
                            r.audio.channelCount = i.channelCount,
                            r.audio.sampleSize = i.sampleSize) : u && (r.type = "video",
                            (t.videoTrack = r).video = {},
                            r.video.width = i.width,
                            r.video.height = i.height)
                        }
                    else
                        t.hasMoov = !1;
                    for (t.mime = "",
                    t.videoTrack ? t.mime += 'video/mp4; codecs="' : t.audioTrack ? t.mime += 'audio/mp4; codecs="' : t.mime += 'application/mp4; codecs="',
                    e = 0; e < t.tracks.length; e++)
                        0 !== e && (t.mime += ","),
                        t.mime += t.tracks[e].codec;
                    return t.mime += '"; profiles="',
                    t.mime += a.ftyp.compatibleBrands.join(),
                    t.mime += '"',
                    t
                }
            }, {
                key: "_processSamples",
                value: function() {
                    for (var e = this.mp4, t = 0; t < e.moov.trak.length; t++) {
                        for (var n = e.moov.trak[t], r = "soun" === n.mdia.hdlr.handlerType, i = "vide" === n.mdia.hdlr.handlerType, a = [], o = [], s = []; n.nextSample < n.samples.length; ) {
                            var u = this._getSample(n, n.nextSample);
                            if (!u)
                                break;
                            a.push(u),
                            n.nextSample++,
                            r ? (o.push(u),
                            this.emit("audio:sample", u)) : i && (s.push(u),
                            this.emit("video:sample", u)),
                            this.emit("sample", u)
                        }
                        o.length && this.emit("audio:samples", o),
                        s.length && this.emit("video:samples", s),
                        this.emit("samples", a)
                    }
                }
            }, {
                key: "_getSample",
                value: function(e, t) {
                    var n = e.samples[t];
                    if (!n)
                        return null;
                    if (n.data)
                        return n;
                    var r = this.sampleSteam.read(n.offset, n.size);
                    return r ? (n.data = r,
                    n) : null
                }
            }, {
                key: "_buildSampleLists",
                value: function() {
                    for (var e = 0; e < this.mp4.moov.trak.length; e++) {
                        var t = this.mp4.moov.trak[e];
                        this._buildTrakSampleLists(t)
                    }
                }
            }, {
                key: "_buildTrakSampleLists",
                value: function(e) {
                    e.samples = [],
                    e.samplesDuration = 0,
                    e.samplesSize = 0,
                    e.nextSample = 0;
                    var t = e.mdia.minf.stbl.stco || e.mdia.minf.stbl.co64
                      , n = e.mdia.minf.stbl.stsc
                      , r = e.mdia.minf.stbl.stsz || e.mdia.minf.stbl.stz2
                      , i = e.mdia.minf.stbl.stts
                      , a = e.mdia.minf.stbl.ctts
                      , o = e.mdia.minf.stbl.stss
                      , s = e.mdia.minf.stbl.stsd
                      , u = (e.mdia.minf.stbl.subs,
                    void e.mdia.minf.stbl.stdp)
                      , f = void 0
                      , l = void 0
                      , c = void 0
                      , d = void 0
                      , h = -1
                      , p = -1
                      , v = -1
                      , y = -1
                      , m = 0;
                    if (this._initSampleGroups(e),
                    void 0 !== r) {
                        var b = void 0;
                        for (b = 0; b < r.entries.length; b++) {
                            var w = {};
                            w.number = b,
                            w.trackId = e.tkhd.trackId,
                            w.timescale = e.mdia.mdhd.timeScale,
                            (e.samples[b] = w).size = r.entries[b],
                            e.samplesSize += w.size,
                            0 === b ? (u = 1,
                            f = 0,
                            w.chunkIndex = u,
                            w.chunkRunIndex = f,
                            l = n.entries[f].samplesPerChunk,
                            c = 0,
                            d = f + 1 < n.entries.length ? n.entries[f + 1].firstChunk - 1 : 1 / 0) : b < l ? (w.chunkIndex = u,
                            w.chunkRunIndex = f) : (u++,
                            c = 0,
                            (w.chunkIndex = u) <= d || (d = ++f + 1 < n.entries.length ? n.entries[f + 1].firstChunk - 1 : 1 / 0),
                            w.chunkRunIndex = f,
                            l += n.entries[f].samplesPerChunk),
                            w.descriptionIndex = n.entries[w.chunkRunIndex].sampleDescriptionId - 1,
                            w.description = s.entries[w.descriptionIndex],
                            w.offset = t.entries[w.chunkIndex - 1] + c,
                            c += w.size,
                            h < b && (p++,
                            h < 0 && (h = 0),
                            h += i.entries[p].count),
                            w.dts = 0 < b ? (e.samples[b - 1].duration = i.entries[p].duration,
                            e.samplesDuration += e.samples[b - 1].duration,
                            e.samples[b - 1].dts + e.samples[b - 1].duration) : 0,
                            w.cts = a ? (v <= b && (y++,
                            v < 0 && (v = 0),
                            v += a.entries[y].count),
                            e.samples[b].dts + a.entries[y].duration) : w.dts,
                            o ? b == (o.entries[m] && o.entries[m].sampleNumber - 1) ? (w.isSync = !0,
                            m++) : (w.isSync = !1,
                            w.degradationPriority = 0) : w.isSync = !0,
                            w.flags = {
                                isLeading: 0,
                                dependsOn: 1,
                                isDependedOn: 0,
                                hasRedundancy: 0
                            }
                        }
                        0 < b && (e.samples[b - 1].duration = Math.max(e.mdia.mdhd.duration - e.samples[b - 1].dts, 0),
                        e.samplesDuration += e.samples[b - 1].duration)
                    }
                }
            }, {
                key: "_initSampleGroups",
                value: function(e, t) {
                    t && (t.sampleGroupsInfo = []),
                    e.sampleGroupsInfo || (e.sampleGroupsInfo = [])
                }
            }]),
            t
        }();
        t.default = f,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return r(e, [{
                key: "on",
                value: function(e, t) {
                    return this._events || (this._events = {}),
                    this._events[e] || (this._events[e] = []),
                    -1 !== !this._events[e].indexOf(t) && "function" == typeof t && this._events[e].push(t),
                    this
                }
            }, {
                key: "emit",
                value: function(e) {
                    if (this._events && this._events[e]) {
                        for (var t = Array.prototype.slice.call(arguments, 1) || [], n = this._events[e], r = 0, i = n.length; r < i; r++)
                            n[r].apply(this, t);
                        return this
                    }
                }
            }, {
                key: "off",
                value: function(e, t) {
                    if (e || t || (this._events = {}),
                    e && !t && delete this._events[e],
                    e && t) {
                        var n = this._events[e]
                          , r = n.indexOf(t);
                        n.splice(r, 1)
                    }
                    return this
                }
            }]),
            e
        }();
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = s(n(2))
          , a = s(n(0))
          , o = s(n(5));
        function s(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var u = function(e) {
            function t() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t);
                var e = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return e._buffer = null,
                e
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, i.default),
            r(t, [{
                key: "decode",
                value: function(e) {
                    var t = this;
                    for (this._buffer ? this._buffer = a.default.concat(this._buffer, e) : this._buffer = e.slice(); ; ) {
                        var n = new o.default;
                        n.on("data", function(e) {
                            t.emit("box", e)
                        });
                        var r = n.decode(this._buffer);
                        if (!r)
                            return;
                        this._buffer = r
                    }
                }
            }]),
            t
        }();
        t.default = u,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = u(n(0))
          , a = u(n(2))
          , o = u(n(5))
          , s = u(n(17));
        function u(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var f = function(e) {
            function t(e, n) {
                !function(e, n) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var r = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return r.type = e,
                r.length = n,
                r.info = null,
                r
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, a.default),
            r(t, [{
                key: "decode",
                value: function(e) {
                    if (this[this.type]) {
                        var t = this[this.type](e);
                        return this.info = t,
                        e.slice(this.length)
                    }
                }
            }, {
                key: "ftyp",
                value: function(e) {
                    for (var t = {
                        brand: i.default.readToString(e.slice(0, 4)),
                        brandVersion: i.default.readUInt32BE(e, 4),
                        compatibleBrands: []
                    }, n = 8; n < this.length; n += 4)
                        t.compatibleBrands.push(i.default.readToString(e.slice(n, n + 4)));
                    return t
                }
            }, {
                key: "mvhd",
                value: function(e) {
                    return {
                        ctime: i.default.readDate(e, 0),
                        mtime: i.default.readDate(e, 4),
                        timeScale: i.default.readUInt32BE(e, 8),
                        duration: i.default.readUInt32BE(e, 12),
                        preferredRate: i.default.readFixed32(e, 16),
                        preferredVolume: i.default.readFixed16(e, 20),
                        nextTrackId: i.default.readUInt32BE(e, 92)
                    }
                }
            }, {
                key: "tkhd",
                value: function(e) {
                    return {
                        ctime: i.default.readDate(e, 0),
                        mtime: i.default.readDate(e, 4),
                        trackId: i.default.readUInt32BE(e, 8),
                        duration: i.default.readUInt32BE(e, 16),
                        trackWidth: i.default.readUInt32BE(e, 72),
                        trackHeight: i.default.readUInt32BE(e, 76)
                    }
                }
            }, {
                key: "mdhd",
                value: function(e) {
                    return {
                        ctime: i.default.readDate(e, 0),
                        mtime: i.default.readDate(e, 4),
                        timeScale: i.default.readUInt32BE(e, 8),
                        duration: i.default.readUInt32BE(e, 12)
                    }
                }
            }, {
                key: "vmhd",
                value: function(e) {
                    return {
                        graphicsMode: i.default.readUInt16BE(e, 0),
                        opcolor: [i.default.readUInt16BE(e, 2), i.default.readUInt16BE(e, 4), i.default.readUInt16BE(e, 6)]
                    }
                }
            }, {
                key: "smhd",
                value: function(e) {
                    return {
                        balance: i.default.readUInt16BE(e, 0)
                    }
                }
            }, {
                key: "stsd",
                value: function(e) {
                    var t = this
                      , n = i.default.readUInt32BE(e, 0)
                      , r = [];
                    e = e.slice(4);
                    for (var a = 0; a < n; a++) {
                        var s = new o.default;
                        s.on("data", function(e) {
                            t.emit("data", e)
                        }),
                        e = s.decode(e),
                        r.push(s.toJSON())
                    }
                    return {
                        entries: r
                    }
                }
            }, {
                key: "avc1",
                value: function(e) {
                    var t = this
                      , n = Math.min(i.default.readUInt8(e, 42), 31)
                      , r = {
                        dataReferenceIndex: i.default.readUInt16BE(e, 6),
                        width: i.default.readUInt16BE(e, 24),
                        height: i.default.readUInt16BE(e, 26),
                        hResolution: i.default.readUInt32BE(e, 28),
                        vResolution: i.default.readUInt32BE(e, 32),
                        frameCount: i.default.readUInt16BE(40),
                        compressorName: i.default.readToString(e.slice(43, 43 + n)),
                        depth: e.readUInt16BE(e, 74)
                    }
                      , a = {};
                    e = e.slice(78);
                    for (var s = 78; 8 <= this.length - s; ) {
                        var u = new o.default;
                        u.on("data", function(e) {
                            t.emit("data", e)
                        }),
                        e = u.decode(e);
                        var f = a[u.boxType];
                        Array.isArray(f) ? a.push(u.toJSON()) : a[u.boxType] = f ? [f, u.toJSON()] : u.toJSON(),
                        s += u.boxSize
                    }
                    return Object.assign(r, a),
                    r
                }
            }, {
                key: "avcC",
                value: function(e) {
                    return {
                        mimeCodec: i.default.readToString(e.slice(1, 4)),
                        buffer: e.slice(0, this.length)
                    }
                }
            }, {
                key: "hev1",
                value: function(e) {
                    var t = this
                      , n = {
                        dataReferenceIndex: i.default.readUInt16BE(e, 7),
                        width: i.default.readUInt16BE(e, 24),
                        height: i.default.readUInt16BE(e, 26),
                        horizresolution: i.default.readUInt32BE(e, 29),
                        vertresolution: i.default.readUInt32BE(e, 33),
                        frameCount: i.default.readUInt16BE(e, 41)
                    }
                      , r = Math.min(31, i.default.readUInt8(e, 42));
                    n.compressorName = i.default.readToString(e.slice(41, r)),
                    n.depth = i.default.readUInt16BE(e, 76);
                    var a = {};
                    e = e.slice(78);
                    for (var s = 78; 8 <= this.length - s; ) {
                        var u = new o.default;
                        u.on("data", function(e) {
                            t.emit("data", e)
                        }),
                        e = u.decode(e);
                        var f = a[u.boxType];
                        Array.isArray(f) ? a.push(u.toJSON()) : a[u.boxType] = f ? [f, u.toJSON()] : u.toJSON(),
                        s += u.boxSize
                    }
                    return Object.assign(n, a),
                    n
                }
            }, {
                key: "mp4a",
                value: function(e) {
                    var t = this
                      , n = (Math.min(i.default.readUInt8(e, 42), 31),
                    {
                        dataReferenceIndex: i.default.readUInt16BE(e, 6),
                        channelCount: i.default.readUInt16BE(e, 16),
                        sampleSize: i.default.readUInt16BE(e, 18),
                        sampleRate: i.default.readUInt16BE(e, 24)
                    })
                      , r = {}
                      , a = 28;
                    for (e = e.slice(a); 8 <= this.length - a; ) {
                        var s = new o.default;
                        s.on("data", function(e) {
                            t.emit("data", e)
                        }),
                        e = s.decode(e);
                        var u = r[s.boxType];
                        Array.isArray(u) ? r.push(s.toJSON()) : r[s.boxType] = u ? [u, s.toJSON()] : s.toJSON(),
                        a += s.boxSize
                    }
                    return Object.assign(n, r),
                    n
                }
            }, {
                key: "hvcC",
                value: function(e) {
                    var t = i.default.readUInt8(e, 1)
                      , n = {
                        configurationVersion: i.default.readUInt8(e, 0),
                        generalProfileSpace: t >> 6,
                        generalTierFlag: (32 & t) >> 5,
                        generalProfileIdc: 31 & t,
                        generalProfileCompatibility: i.default.readUInt32BE(e, 2),
                        generalConstraintIndicator: e.slice(6, 12),
                        generalLevelIdc: i.default.readUInt8(e, 12),
                        minSpatialSegmentationIdc: 255 & i.default.readUInt16BE(e, 13),
                        parallelismType: 3 & i.default.readUInt8(e, 15),
                        chromaFormatIdc: 3 & i.default.readUInt8(e, 16),
                        bitDepthLumaMinus8: 7 & i.default.readUInt8(e, 17),
                        bitDepthChromaMinus8: 7 & i.default.readUInt8(e, 18),
                        avgFrameRate: i.default.readUInt16BE(e, 19)
                    };
                    t = i.default.readUInt8(e, 21),
                    n.constantFrameRate = t >> 6,
                    n.numTemporalLayers = (13 & t) >> 3,
                    n.temporalIdNested = (4 & t) >> 2,
                    n.lengthSizeMinusOne = 3 & t,
                    n.naluArrays = [];
                    for (var r = i.default.readUInt8(e, 22), a = 23, o = 0; o < r; o++) {
                        var s = [];
                        n.naluArrays.push(s),
                        t = i.default.readUInt8(e, a),
                        s.completeness = (128 & t) >> 7,
                        s.naluType = 63 & t;
                        var u = i.default.readUInt16BE(e, a + 1);
                        a += 3;
                        for (var f = 0; f < u; f++) {
                            var l = {};
                            s.push(l);
                            var c = i.default.readUInt16BE(e, a);
                            l.data = e.slice(a + 2, a + 2 + c),
                            a += 2 + c
                        }
                    }
                    return n
                }
            }, {
                key: "hvc1",
                value: function(e) {
                    return this.hev1(e)
                }
            }, {
                key: "esds",
                value: function(e) {
                    var t = s.default.decode(e, 0, this.length)
                      , n = ("ESDescriptor" === t.tagName ? t : {}).DecoderConfigDescriptor || {}
                      , r = n.oti || 0
                      , a = n.DecoderSpecificInfo
                      , o = a ? (248 & i.default.readUInt8(a.buffer, 0)) >> 3 : 0
                      , u = null;
                    return r && (u = r.toString(16),
                    o && (u += "." + o)),
                    {
                        mimeCodec: u,
                        dsi: a,
                        oti: r,
                        buffer: e.slice(0, this.length)
                    }
                }
            }, {
                key: "stsz",
                value: function(e) {
                    for (var t = i.default.readUInt32BE(e, 0), n = i.default.readUInt32BE(e, 4), r = [], a = 0; a < n; a++)
                        0 === t ? r.push(i.default.readUInt32BE(e, 4 * a + 8)) : r.push(t);
                    return {
                        entries: r
                    }
                }
            }, {
                key: "stco",
                value: function(e) {
                    for (var t = i.default.readUInt32BE(e, 0), n = [], r = 0; r < t; r++)
                        n.push(i.default.readUInt32BE(e, 4 * r + 4));
                    return {
                        entries: n
                    }
                }
            }, {
                key: "stts",
                value: function(e) {
                    for (var t = i.default.readUInt32BE(e, 0), n = [], r = 0; r < t; r++) {
                        var a = 8 * r + 4;
                        n[r] = {
                            count: i.default.readUInt32BE(e, a),
                            duration: i.default.readUInt32BE(e, a + 4)
                        }
                    }
                    return {
                        entries: n
                    }
                }
            }, {
                key: "ctts",
                value: function(e) {
                    for (var t = i.default.readUInt32BE(e, 0), n = [], r = 0; r < t; r++) {
                        var a = 8 * r + 4;
                        n[r] = {
                            count: i.default.readUInt32BE(e, a),
                            duration: i.default.readUInt32BE(e, a + 4)
                        }
                    }
                    return {
                        entries: n
                    }
                }
            }, {
                key: "stsc",
                value: function(e) {
                    for (var t = i.default.readUInt32BE(e, 0), n = [], r = 0; r < t; r++) {
                        var a = 12 * r + 4;
                        n[r] = {
                            firstChunk: i.default.readUInt32BE(e, a),
                            samplesPerChunk: i.default.readUInt32BE(e, a + 4),
                            sampleDescriptionId: i.default.readUInt32BE(e, a + 8)
                        }
                    }
                    return {
                        entries: n
                    }
                }
            }, {
                key: "stss",
                value: function(e) {
                    for (var t = i.default.readUInt32BE(e, 0), n = [], r = 0; r < t; r++) {
                        var a = 4 * r + 4;
                        n[r] = {
                            sampleNumber: i.default.readUInt32BE(e, a)
                        }
                    }
                    return {
                        entries: n
                    }
                }
            }, {
                key: "dref",
                value: function(e) {
                    for (var t = i.default.readUInt32BE(e, 0), n = [], r = 4, a = 0; a < t; a++) {
                        var o = i.default.readUInt32BE(e, r)
                          , s = i.default.readToString(e.slice(r + 4, r + 8))
                          , u = e.slice(r + 8, r + o);
                        r += o,
                        n[a] = {
                            type: s,
                            buf: u
                        }
                    }
                    return {
                        entries: n
                    }
                }
            }, {
                key: "elst",
                value: function(e) {
                    for (var t = i.default.readUInt32BE(e, 0), n = [], r = 0; r < t; r++) {
                        var a = 12 * r + 4;
                        n[r] = {
                            trackDuration: i.default.readUInt32BE(e, a),
                            mediaTime: i.default.readUInt32BE(e, a + 4),
                            mediaRate: i.default.readFixed32(e, a + 8)
                        }
                    }
                    return {
                        entries: n
                    }
                }
            }, {
                key: "hdlr",
                value: function(e) {
                    return {
                        handlerType: i.default.readToString(e.slice(4, 8)),
                        name: i.default.readToString(e.slice(20, this.length))
                    }
                }
            }, {
                key: "mehd",
                value: function(e) {
                    return {
                        fragmentDuration: i.default.readUInt32BE(e, 0)
                    }
                }
            }, {
                key: "trex",
                value: function(e) {
                    return {
                        trackId: i.default.readUInt32BE(e, 0),
                        defaultSampleDescriptionIndex: i.default.readUInt32BE(e, 4),
                        defaultSampleDuration: i.default.readUInt32BE(e, 8),
                        defaultSampleSize: i.default.readUInt32BE(e, 12),
                        defaultSampleFlags: i.default.readUInt32BE(e, 16)
                    }
                }
            }, {
                key: "mfhd",
                value: function(e) {
                    return {
                        sequenceNumber: i.default.readUInt32BE(e, 0)
                    }
                }
            }, {
                key: "mdat",
                value: function(e) {
                    return {
                        buffer: e.slice(0, this.length)
                    }
                }
            }, {
                key: "toJSON",
                value: function() {
                    return this.info
                }
            }]),
            t
        }();
        t.default = f,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r, i = (r = n(0)) && r.__esModule ? r : {
            default: r
        }, a = {
            3: "ESDescriptor",
            4: "DecoderConfigDescriptor",
            5: "DecoderSpecificInfo",
            6: "SLConfigDescriptor"
        }, o = {
            decode: function(e, t, n) {
                for (var r = i.default.readUInt8(e, t), s = t + 1, u = void 0, f = 0; f = f << 7 | 127 & (u = i.default.readUInt8(e, s++)),
                128 & u; )
                    ;
                var l = void 0
                  , c = a[r];
                return (l = o["_decode" + c] ? o["_decode" + c](e, s, n) : {
                    buffer: e.slice(s, s + f)
                }).tag = r,
                l.tagName = c,
                l.length = s - t + f,
                l.contentsLen = f,
                l
            },
            _decodeESDescriptor: function(e, t, n) {
                var r = i.default.readUInt8(e, t + 2)
                  , a = t + 3;
                return 128 & r && (a += 2),
                64 & r && (a += i.default.readUInt8(e, a) + 1),
                32 & r && (a += 2),
                o._decodeDescriptorArray(e, a, n)
            },
            _decodeDescriptorArray: function(e, t, n) {
                for (var r = t, i = {}; r + 2 <= n; ) {
                    var s = o.decode(e, r, n);
                    r += s.length,
                    i[a[s.tag] || "Descriptor" + s.tag] = s
                }
                return i
            },
            _decodeDecoderConfigDescriptor: function(e, t, n) {
                var r = i.default.readUInt8(e, t)
                  , a = o._decodeDescriptorArray(e, t + 13, n);
                return a.oti = r,
                a
            }
        };
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.CONTAINERS = {
            moov: ["mvhd", "meta", "traks", "mvex"],
            trak: ["tkhd", "tref", "trgr", "edts", "meta", "mdia", "udta"],
            edts: ["elst"],
            mdia: ["mdhd", "hdlr", "elng", "minf"],
            minf: ["vmhd", "smhd", "hmhd", "sthd", "nmhd", "dinf", "stbl"],
            dinf: ["dref"],
            stbl: ["stsd", "stts", "ctts", "cslg", "stsc", "stsz", "stz2", "stco", "co64", "stss", "stsh", "padb", "stdp", "sdtp", "sbgps", "sgpds", "subss", "saizs", "saios"],
            mvex: ["mehd", "trexs", "leva"],
            moof: ["mfhd", "meta", "trafs"],
            traf: ["tfhd", "tfdt", "trun", "sbgps", "sgpds", "subss", "saizs", "saios", "meta"]
        },
        t.FULL_BOX_TYPES = ["mvhd", "tkhd", "mdhd", "vmhd", "smhd", "stsd", "esds", "stsz", "stco", "co64", "stss", "stts", "ctts", "stsc", "dref", "elst", "hdlr", "mehd", "trex", "mfhd", "tfhd", "tfdt", "trun"],
        t.BOX_TYPES = ["avc1", "avcC", "btrt", "hvcC", "hvc1", "dinf", "co64", "dref", "elst", "esds", "mehd", "ftyp", "hdlr", "mdat", "ctts", "stss", "mdhd", "mdia", "mfhd", "minf", "moof", "moov", "mp4a", "hev1", "mvex", "mvhd", "sdtp", "stbl", "stco", "stsc", "stsd", "stsz", "stts", "tfdt", "tfhd", "traf", "trak", "trun", "trex", "tkhd", "vmhd", "smhd"]
    }
    , function(e, t, n) {
        "use strict";
        function r(e, t) {
            var n = Number(e).toString(16);
            for (t = null == t ? t = 2 : t; n.length < t; )
                n = "0" + n;
            return n
        }
        function i(e) {
            return e.type.replace(".", "")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.default = function(e) {
            var t, n, a = "";
            switch (e.type) {
            case "mp4a":
                n = i(t = e),
                a = t.esds && t.esds.mimeCodec ? n + "." + t.esds.mimeCodec : n;
                break;
            case "hev1":
                a = function(e) {
                    var t = i(e);
                    if (t += ".",
                    !e.hvcC)
                        return t;
                    switch (e.hvcC.hvgeneralProfileSpace) {
                    case 0:
                        t += "";
                        break;
                    case 1:
                        t += "A";
                        break;
                    case 2:
                        t += "B";
                        break;
                    case 3:
                        t += "C"
                    }
                    t += e.hvcC.generalProfileIdc,
                    t += ".";
                    for (var n = e.hvcC.generalProfileCompatibility, a = 0, o = 0; o < 32 && (a |= 1 & n,
                    31 != o); o++)
                        a <<= 1,
                        n >>= 1;
                    t += r(a, 0),
                    t += ".",
                    0 === e.hvcC.generalTierFlag ? t += "L" : t += "H",
                    t += e.hvcC.generalLevelIdc;
                    for (var s = !1, u = "", f = 5; 0 <= f; f--)
                        (e.hvcC.generalConstraintIndicator[f] || s) && (u = "." + r(e.hvcC.generalConstraintIndicator[f], 0) + u,
                        s = !0);
                    return t + u
                }(e)
            }
            return a
        }
        ,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r, i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }(), a = (r = n(21)) && r.__esModule ? r : {
            default: r
        }, o = function() {
            function e() {
                var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {
                    isLive: !1
                };
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.buffer = new ArrayBuffer(0),
                this.startPosition = 0,
                this.isLive = t.isLive
            }
            return i(e, [{
                key: "write",
                value: function(e) {
                    this.buffer = a.default.concat(this.buffer, e)
                }
            }, {
                key: "read",
                value: function(e, t) {
                    var n = e - this.startPosition
                      , r = n + t;
                    if (r > this.buffer.byteLength)
                        return !1;
                    var i = this.buffer.slice(n, r);
                    return this.isLive && (this.buffer = this.buffer.slice(r),
                    this.startPosition = e + t),
                    i
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = {
            concat: function() {
                for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
                    t[n] = arguments[n];
                var r = t.reduce(function(e, t) {
                    return e + t.byteLength
                }, 0)
                  , i = new Uint8Array(r)
                  , a = 0;
                return t.forEach(function(e) {
                    i.set(new Uint8Array(e), a),
                    a += e.byteLength
                }),
                i.buffer
            },
            readUInt32BE: function(e, t) {
                var n = new Uint8Array(e);
                return n[t] << 24 | n[t + 1] << 16 | n[t + 2] << 8 | n[t + 3]
            },
            readUInt24BE: function(e, t) {
                var n = new Uint8Array(e);
                return n[t] << 16 | n[t + 1] << 8 | n[t + 2]
            },
            readUInt16BE: function(e, t) {
                var n = new Uint8Array(e);
                return n[t] << 8 | n[t + 1]
            },
            readUInt8: function(e, t) {
                return new Uint8Array(e)[t]
            },
            readToString: function(e) {
                var t = new Uint8Array(e)
                  , n = String.fromCharCode.apply(String, function(e) {
                    if (Array.isArray(e)) {
                        for (var t = 0, n = Array(e.length); t < e.length; t++)
                            n[t] = e[t];
                        return n
                    }
                    return Array.from(e)
                }(t));
                return decodeURIComponent(escape(n))
            },
            readDate: function(e, t) {
                return new Date(1e3 * r.readUInt32BE(e, t) - 20828448e5)
            },
            readFixed32: function(e, t) {
                return r.readUInt16BE(e, t) + r.readUInt16BE(e, t + 2) / 65536
            },
            readFixed16: function(e, t) {
                return r.readUInt8(e, t) + r.readUInt8(e, t + 1) / 256
            }
        };
        t.default = r,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        ;
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , a = s(n(23))
          , o = s(n(24));
        function s(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var u = function(e) {
            function t(e) {
                !function(e, n) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var n = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" !== (void 0 === t ? "undefined" : r(t)) && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return n._webWorkerCallbackHandler = function(e) {
                    n._parseWebWorkerCallback.call(n, e.data)
                }
                ,
                n.options = e,
                n.decodedTime = 0,
                n.status = "init",
                n.webworker = new o.default,
                n.webworker.addEventListener("message", n._webWorkerCallbackHandler),
                n._actionCache = [],
                n.timestamps = [],
                n.timestampIndex = 0,
                n
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + (void 0 === t ? "undefined" : r(t)));
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, a.default),
            i(t, [{
                key: "appendBuffer",
                value: function(e, t, n) {
                    "init" !== this.status ? (t && (0 === this.timestamps.length && (this.decodedTime = t / this.options.movieTimescale || 0),
                    this.insertTimestamp({
                        number: n,
                        time: t
                    })),
                    this._postMessage("appendBuffer", {
                        chunk: e,
                        pts: t,
                        number: n
                    })) : this._cacheAction({
                        cmd: "appendBuffer",
                        param: [e, t, n]
                    })
                }
            }, {
                key: "decode",
                value: function() {
                    "init" !== this.status ? this._postMessage("decode") : this._cacheAction({
                        cmd: "decode",
                        param: []
                    })
                }
            }, {
                key: "advance",
                value: function() {
                    return 0 === this.timestamps[this.timestampIndex].number && (this.timestampIndex,
                    this._postMessage("advance"),
                    this.advanceDecodedTime(),
                    !0)
                }
            }, {
                key: "destroy",
                value: function() {
                    this.status = "init",
                    this._postMessage("destroy"),
                    this.webworker.removeEventListener("message", this._webWorkerCallbackHandler)
                }
            }, {
                key: "_postMessage",
                value: function(e, t) {
                    this.webworker.postMessage({
                        cmd: e,
                        data: t
                    })
                }
            }, {
                key: "_cacheAction",
                value: function(e) {
                    this._actionCache.push(e)
                }
            }, {
                key: "_excuteCacheActions",
                value: function() {
                    var e = this;
                    this._actionCache.forEach(function(t) {
                        e[t.cmd].apply(e, function(e) {
                            if (Array.isArray(e)) {
                                for (var t = 0, n = Array(e.length); t < e.length; t++)
                                    n[t] = e[t];
                                return n
                            }
                            return Array.from(e)
                        }(t.param))
                    })
                }
            }, {
                key: "_parseWebWorkerCallback",
                value: function(e) {
                    switch (e.cmd) {
                    case "loaded":
                        this._postMessage("init"),
                        this.status = "loaded",
                        this._excuteCacheActions();
                        break;
                    case "data":
                        this.emit("data", e.source),
                        this.advanceDecodedTime();
                        break;
                    case "error":
                        e.source,
                        this.emit("error", e.source)
                    }
                }
            }, {
                key: "advanceDecodedTime",
                value: function() {
                    try {
                        var e = 1 / this.options.iframeRate;
                        this.decodedTime = this.timestamps[this.timestampIndex].time / this.options.movieTimescale,
                        this.timestampIndex++,
                        this.decodedTime += e
                    } catch (e) {
                        return this.decodedTime
                    }
                }
            }, {
                key: "peekNextDecodedTime",
                value: function() {
                    try {
                        var e = 1 / this.options.iframeRate;
                        return this.timestamps[this.timestampIndex].time / this.options.movieTimescale + e
                    } catch (e) {
                        return this.decodedTime
                    }
                }
            }, {
                key: "insertTimestamp",
                value: function(e) {
                    for (var t = this.timestamps.length, n = t, r = t - 1; 0 <= r && this.timestamps[r].time > e.time; r--)
                        n = r;
                    this.timestamps.splice(n, 0, e)
                }
            }]),
            t
        }();
        t.default = u,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return r(e, [{
                key: "on",
                value: function(e, t) {
                    null == this.events && (this.events = {}),
                    null == this.events[e] && (this.events[e] = []),
                    this.events[e].push(t)
                }
            }, {
                key: "off",
                value: function(e, t) {
                    if (this.events && this.events[e]) {
                        var n = this.events[e].indexOf(t);
                        ~n && this.events[e].splice(n, 1)
                    }
                }
            }, {
                key: "once",
                value: function(e, t) {
                    this.on(e, function n() {
                        this.off(e, n);
                        for (var r = arguments.length, i = Array(r), a = 0; a < r; a++)
                            i[a] = arguments[a];
                        t.apply(this, i)
                    })
                }
            }, {
                key: "emit",
                value: function(e) {
                    if (this.events && this.events[e]) {
                        for (var t = arguments.length, n = Array(1 < t ? t - 1 : 0), r = 1; r < t; r++)
                            n[r - 1] = arguments[r];
                        var i = !0
                          , a = !1
                          , o = void 0;
                        try {
                            for (var s, u = this.events[e].slice()[Symbol.iterator](); !(i = (s = u.next()).done); i = !0)
                                s.value.apply(this, n)
                        } catch (e) {
                            a = !0,
                            o = e
                        } finally {
                            try {
                                !i && u.return && u.return()
                            } finally {
                                if (a)
                                    throw o
                            }
                        }
                    }
                }
            }]),
            e
        }();
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        e.exports = function() {
            return new Worker(n.p + "b28bba933331c4d5bac5.worker.js")
        }
    }
    , function(e, t, n) {
        "use strict";
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        ;
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , a = y(n(6))
          , o = y(n(7))
          , s = y(n(8))
          , u = y(n(26))
          , f = y(n(9))
          , l = y(n(28))
          , c = y(n(1))
          , d = y(n(30))
          , h = y(n(31))
          , p = y(n(32))
          , v = function(e) {
            if (e && e.__esModule)
                return e;
            var t = {};
            if (null != e)
                for (var n in e)
                    Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
            return t.default = e,
            t
        }(n(3));
        function y(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var m = function(e) {
            function t() {
                !function(e, n) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var e = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" !== (void 0 === t ? "undefined" : r(t)) && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                e.format = {
                    floatingPoint: !0
                };
                var n = e.list = new o.default;
                return e.stream = new u.default(n),
                e.bitstream = new f.default(e.stream),
                e.receivedFinalBuffer = !1,
                e.canPlay = !1,
                e.timestamps = [],
                e.timestampIndex = 0,
                e.decodedTime = 0,
                e
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + (void 0 === t ? "undefined" : r(t)));
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, a.default),
            i(t, [{
                key: "appendBuffer",
                value: function(e, t, n) {
                    this.list.append(new s.default(e)),
                    0 === this.timestamps.length && (this.decodedTime = t / this.config.sampleRate || 0),
                    this.timestamps.push({
                        number: n,
                        time: t
                    }),
                    this.canPlay = !0
                }
            }, {
                key: "decode",
                value: function() {
                    var e = void 0
                      , t = this.bitstream.offset();
                    try {
                        e = this.readChunk()
                    } catch (e) {
                        return !1
                    }
                    return e ? (this.emit("data", e),
                    this.advanceDecodedTime(e.length / this.config.chanConfig / this.config.sampleRate),
                    !0) : (this.receivedFinalBuffer ? this.emit("end") : this.bitstream.seek(t),
                    !1)
                }
            }, {
                key: "setCookie",
                value: function(e) {
                    var t = u.default.fromBuffer(e)
                      , n = new f.default(t);
                    if (this.config = {},
                    this.config.profile = n.read(5),
                    31 === this.config.profile && (this.config.profile = 32 + n.read(6)),
                    this.config.sampleIndex = n.read(4),
                    15 === this.config.sampleIndex) {
                        this.config.sampleRate = n.read(24);
                        for (var r = 0; r < v.SAMPLE_RATES.length; r++)
                            if (v.SAMPLE_RATES[r] === this.config.sampleRate) {
                                this.config.sampleIndex = r;
                                break
                            }
                    } else
                        this.config.sampleRate = v.SAMPLE_RATES[this.config.sampleIndex];
                    switch (this.config.chanConfig = n.read(4),
                    this.format.channelsPerFrame = this.config.chanConfig,
                    this.config.profile) {
                    case 1:
                    case 2:
                    case 4:
                        if (n.read(1))
                            throw new Error("frameLengthFlag not supported");
                        if (this.config.frameLength = 1024,
                        n.read(1) && n.advance(14),
                        n.read(1) && (16 < this.config.profile && (this.config.sectionDataResilience = n.read(1),
                        this.config.scalefactorResilience = n.read(1),
                        this.config.spectralDataResilience = n.read(1)),
                        n.advance(1)),
                        0 === this.config.chanConfig)
                            throw n.advance(4),
                            new Error("PCE unimplemented");
                        break;
                    default:
                        throw new Error("AAC profile " + this.config.profile + " not supported.")
                    }
                    this.filter_bank = new p.default(!1,this.config.chanConfig)
                }
            }, {
                key: "readChunk",
                value: function() {
                    var e = this.bitstream;
                    4095 === e.peek(12) && l.default.readHeader(e),
                    this.cces = [];
                    for (var t = [], n = this.config, r = n.frameLength, i = null; 7 !== (i = e.read(3)); ) {
                        var a = e.read(4);
                        switch (i) {
                        case 0:
                        case 3:
                            var o = new c.default(this.config);
                            o.id = a,
                            t.push(o),
                            o.decode(e, n, !1);
                            break;
                        case 1:
                            var s = new d.default(this.config);
                            s.id = a,
                            t.push(s),
                            s.decode(e, n);
                            break;
                        case 2:
                            var u = new h.default(this.config);
                            this.cces.push(u),
                            u.decode(e, n);
                            break;
                        case 4:
                            var f = e.read(1)
                              , p = e.read(8);
                            255 === p && (p += e.read(8)),
                            f && e.align(),
                            e.advance(8 * p);
                            break;
                        case 5:
                            throw new Error("TODO: PCE_ELEMENT");
                        case 6:
                            15 === a && (a += e.read(8) - 1),
                            e.advance(8 * a);
                            break;
                        default:
                            throw new Error("Unknown element")
                        }
                    }
                    e.align(),
                    this.process(t);
                    for (var v = this.data, y = v.length, m = new Float32Array(r * y), b = 0, w = 0; w < r; w++)
                        for (var g = 0; g < y; g++)
                            m[b++] = v[g][w] / 32768;
                    return m
                }
            }, {
                key: "process",
                value: function(e) {
                    for (var t = this.config.chanConfig, n = 1 * this.config.frameLength, r = this.data = [], i = 0; i < t; i++)
                        r[i] = new Float32Array(n);
                    for (var a = 0, o = 0; o < e.length && a < t; o++) {
                        var s = e[o];
                        if (s instanceof c.default)
                            a += this.processSingle(s, a);
                        else if (s instanceof d.default)
                            this.processPair(s, a),
                            a += 2;
                        else {
                            if (!(s instanceof h.default))
                                throw new Error("Unknown element found.");
                            a++
                        }
                    }
                }
            }, {
                key: "processSingle",
                value: function(e, t) {
                    var n = this.config.profile
                      , r = e.info
                      , i = e.data;
                    if (1 === n)
                        throw new Error("Main prediction unimplemented");
                    if (4 === n)
                        throw new Error("LTP prediction unimplemented");
                    if (this.applyChannelCoupling(e, h.default.BEFORE_TNS, i, null),
                    e.tnsPresent && e.tns.process(e, i, !1),
                    this.applyChannelCoupling(e, h.default.AFTER_TNS, i, null),
                    this.filter_bank.process(r, i, this.data[t], t),
                    4 === n)
                        throw new Error("LTP prediction unimplemented");
                    if (this.applyChannelCoupling(e, h.default.AFTER_IMDCT, this.data[t], null),
                    e.gainPresent)
                        throw new Error("Gain control not implemented");
                    if (this.sbrPresent)
                        throw new Error("SBR not implemented");
                    return 1
                }
            }, {
                key: "processPair",
                value: function(e, t) {
                    var n = this.config.profile
                      , r = e.left
                      , i = e.right
                      , a = r.info
                      , o = i.info
                      , s = r.data
                      , u = i.data;
                    if (e.commonWindow && e.maskPresent && this.processMS(e, s, u),
                    1 === n)
                        throw new Error("Main prediction unimplemented");
                    if (this.processIS(e, s, u),
                    4 === n)
                        throw new Error("LTP prediction unimplemented");
                    if (this.applyChannelCoupling(e, h.default.BEFORE_TNS, s, u),
                    r.tnsPresent && r.tns.process(r, s, !1),
                    i.tnsPresent && i.tns.process(i, u, !1),
                    this.applyChannelCoupling(e, h.default.AFTER_TNS, s, u),
                    this.filter_bank.process(a, s, this.data[t], t),
                    this.filter_bank.process(o, u, this.data[t + 1], t + 1),
                    4 === n)
                        throw new Error("LTP prediction unimplemented");
                    if (this.applyChannelCoupling(e, h.default.AFTER_IMDCT, this.data[t], this.data[t + 1]),
                    r.gainPresent)
                        throw new Error("Gain control not implemented");
                    if (i.gainPresent)
                        throw new Error("Gain control not implemented");
                    if (this.sbrPresent)
                        throw new Error("SBR not implemented")
                }
            }, {
                key: "processIS",
                value: function(e, t, n) {
                    for (var r = e.right, i = r.info, a = i.swbOffsets, o = i.groupCount, s = i.maxSFB, u = r.bandTypes, f = r.sectEnd, l = r.scaleFactors, d = 0, h = 0, p = 0; p < o; p++) {
                        for (var v = 0; v < s; ) {
                            var y = f[d];
                            if (u[d] === c.default.INTENSITY_BT || u[d] === c.default.INTENSITY_BT2)
                                for (; v < y; v++,
                                d++) {
                                    var m = u[d] === c.default.INTENSITY_BT ? 1 : -1;
                                    e.maskPresent && (m *= e.ms_used[d] ? -1 : 1);
                                    for (var b = m * l[d], w = 0; w < i.groupLength[p]; w++)
                                        for (var g = h + 128 * w + a[v], _ = a[v + 1] - a[v], k = 0; k < _; k++)
                                            n[g + k] = t[g + k] * b
                                }
                            else
                                d += y - v,
                                v = y
                        }
                        h += 128 * i.groupLength[p]
                    }
                }
            }, {
                key: "processMS",
                value: function(e, t, n) {
                    for (var r = e.left, i = r.info, a = i.swbOffsets, o = i.groupCount, s = i.maxSFB, u = r.bandTypes, f = e.right.bandTypes, l = 0, d = 0, h = 0; h < o; h++) {
                        for (var p = 0; p < s; p++,
                        d++)
                            if (e.ms_used[d] && u[d] < c.default.NOISE_BT && f[d] < c.default.NOISE_BT)
                                for (var v = 0; v < i.groupLength[h]; v++)
                                    for (var y = l + 128 * v + a[p], m = 0; m < a[p + 1] - a[p]; m++) {
                                        var b = t[y + m] - n[y + m];
                                        t[y + m] += n[y + m],
                                        n[y + m] = b
                                    }
                        l += 128 * i.groupLength[h]
                    }
                }
            }, {
                key: "applyChannelCoupling",
                value: function(e, t, n, r) {
                    for (var i = this.cces, a = e instanceof d.default, o = t === h.default.AFTER_IMDCT ? "applyIndependentCoupling" : "applyDependentCoupling", s = 0; s < i.length; s++) {
                        var u = i[s]
                          , f = 0;
                        if (u.couplingPoint === t)
                            for (var l = 0; l < u.coupledCount; l++) {
                                var c = u.chSelect[l];
                                u.channelPair[l] === a && u.idSelect[l] === e.id ? (1 !== c && (u[o](f, n),
                                c && f++),
                                2 !== c && u[o](f++, r)) : f += 1 + (3 === c ? 1 : 0)
                            }
                    }
                }
            }, {
                key: "advanceDecodedTime",
                value: function(e) {
                    this.decodedTime = this.timestamps[this.timestampIndex].time / this.config.sampleRate,
                    this.timestampIndex++,
                    this.decodedTime += e
                }
            }]),
            t
        }();
        t.default = m,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.default = void 0;
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = s(n(8))
          , a = s(n(7))
          , o = s(n(27));
        function s(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var u = function() {
            function e(t) {
                !function(t, n) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                this.buf = new ArrayBuffer(16),
                this.uint8 = new Uint8Array(this.buf),
                this.int8 = new Int8Array(this.buf),
                this.uint16 = new Uint16Array(this.buf),
                this.int16 = new Int16Array(this.buf),
                this.uint32 = new Uint32Array(this.buf),
                this.int32 = new Int32Array(this.buf),
                this.float32 = new Float32Array(this.buf),
                this.float64 = new Float64Array(this.buf),
                this.nativeEndian = 13330 === new Uint16Array(new Uint8Array([18, 52]).buffer)[0],
                this.list = t,
                this.localOffset = 0,
                this.offset = 0
            }
            return r(e, [{
                key: "copy",
                value: function() {
                    var t = new e(this.list.copy());
                    return t.localOffset = this.localOffset,
                    t.offset = this.offset,
                    t
                }
            }, {
                key: "available",
                value: function(e) {
                    return e <= this.list.availableBytes - this.localOffset
                }
            }, {
                key: "remainingBytes",
                value: function() {
                    return this.list.availableBytes - this.localOffset
                }
            }, {
                key: "advance",
                value: function(e) {
                    if (!this.available(e))
                        throw new o.default;
                    for (this.localOffset += e,
                    this.offset += e; this.list.first && this.localOffset >= this.list.first.length; )
                        this.localOffset -= this.list.first.length,
                        this.list.advance();
                    return this
                }
            }, {
                key: "rewind",
                value: function(e) {
                    if (e > this.offset)
                        throw new o.default;
                    for (this.list.first || (this.list.rewind(),
                    this.localOffset = this.list.first.length),
                    this.localOffset -= e,
                    this.offset -= e; this.list.first.prev && this.localOffset < 0; )
                        this.list.rewind(),
                        this.localOffset += this.list.first.length;
                    return this
                }
            }, {
                key: "seek",
                value: function(e) {
                    var t = this;
                    return e > this.offset ? t = this.advance(e - this.offset) : e < this.offset && (t = this.rewind(this.offset - e)),
                    t
                }
            }, {
                key: "readUInt8",
                value: function() {
                    if (!this.available(1))
                        throw new o.default;
                    var e = this.list.first.data[this.localOffset];
                    return this.localOffset += 1,
                    this.offset += 1,
                    this.localOffset === this.list.first.length && (this.localOffset = 0,
                    this.list.advance()),
                    e
                }
            }, {
                key: "peekUInt8",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
                    if (!this.available(e + 1))
                        throw new o.default;
                    e = this.localOffset + e;
                    for (var t = this.list.first; t; ) {
                        if (t.length > e)
                            return t.data[e];
                        e -= t.length,
                        t = t.next
                    }
                    return 0
                }
            }, {
                key: "read",
                value: function(e) {
                    if ((1 < arguments.length && void 0 !== arguments[1] && arguments[1]) === this.nativeEndian)
                        for (var t = 0; t < e; t++)
                            this.uint8[t] = this.readUInt8();
                    else
                        for (var n = e - 1; 0 <= n; n--)
                            this.uint8[n] = this.readUInt8()
                }
            }, {
                key: "peek",
                value: function(e, t, n) {
                    if (null == n && (n = !1),
                    n === this.nativeEndian)
                        for (var r = 0; r < e; r++)
                            this.uint8[r] = this.peekUInt8(t + r);
                    else
                        for (var i = 0; i < e; i++)
                            this.uint8[e - i - 1] = this.peekUInt8(t + i)
                }
            }, {
                key: "readInt8",
                value: function() {
                    return this.read(1),
                    this.int8[0]
                }
            }, {
                key: "peekInt8",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
                    return this.peek(1, e),
                    this.int8[0]
                }
            }, {
                key: "readUInt16",
                value: function(e) {
                    return this.read(2, e),
                    this.uint16[0]
                }
            }, {
                key: "peekUInt16",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(2, e, t),
                    this.uint16[0]
                }
            }, {
                key: "readInt16",
                value: function(e) {
                    return this.read(2, e),
                    this.int16[0]
                }
            }, {
                key: "peekInt16",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(2, e, t),
                    this.int16[0]
                }
            }, {
                key: "readUInt24",
                value: function(e) {
                    return e ? this.readUInt16(!0) + (this.readUInt8() << 16) : (this.readUInt16() << 8) + this.readUInt8()
                }
            }, {
                key: "peekUInt24",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
                    return arguments[1] ? this.peekUInt16(e, !0) + (this.peekUInt8(e + 2) << 16) : (this.peekUInt16(e) << 8) + this.peekUInt8(e + 2)
                }
            }, {
                key: "readInt24",
                value: function(e) {
                    return e ? this.readUInt16(!0) + (this.readInt8() << 16) : (this.readInt16() << 8) + this.readUInt8()
                }
            }, {
                key: "peekInt24",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
                    return arguments[1] ? this.peekUInt16(e, !0) + (this.peekInt8(e + 2) << 16) : (this.peekInt16(e) << 8) + this.peekUInt8(e + 2)
                }
            }, {
                key: "readUInt32",
                value: function(e) {
                    return this.read(4, e),
                    this.uint32[0]
                }
            }, {
                key: "peekUInt32",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(4, e, t),
                    this.uint32[0]
                }
            }, {
                key: "readInt32",
                value: function(e) {
                    return this.read(4, e),
                    this.int32[0]
                }
            }, {
                key: "peekInt32",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(4, e, t),
                    this.int32[0]
                }
            }, {
                key: "readFloat32",
                value: function(e) {
                    return this.read(4, e),
                    this.float32[0]
                }
            }, {
                key: "peekFloat32",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(4, e, t),
                    this.float32[0]
                }
            }, {
                key: "readFloat64",
                value: function(e) {
                    return this.read(8, e),
                    this.float64[0]
                }
            }, {
                key: "peekFloat64",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(8, e, t),
                    this.float64[0]
                }
            }, {
                key: "readFloat80",
                value: function(e) {
                    return this.read(10, e),
                    this.float80()
                }
            }, {
                key: "peekFloat80",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(10, e, t),
                    this.float80()
                }
            }, {
                key: "readBuffer",
                value: function(e) {
                    for (var t = i.default.allocate(e), n = t.data, r = 0; r < e; r++)
                        n[r] = this.readUInt8();
                    return t
                }
            }, {
                key: "peekBuffer",
                value: function() {
                    for (var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0, t = arguments[1], n = i.default.allocate(t), r = n.data, a = 0; a < t; a++)
                        r[a] = this.peekUInt8(e + a);
                    return n
                }
            }, {
                key: "readSingleBuffer",
                value: function(e) {
                    var t = this.list.first.slice(this.localOffset, e);
                    return this.advance(t.length),
                    t
                }
            }, {
                key: "peekSingleBuffer",
                value: function(e, t) {
                    return this.list.first.slice(this.localOffset + e, t)
                }
            }, {
                key: "readString",
                value: function(e) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "ascii";
                    return this.decodeString(0, e, t, !0)
                }
            }, {
                key: "peekString",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1]
                      , n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "ascii";
                    return this.decodeString(e, t, n, !1)
                }
            }, {
                key: "float80",
                value: function() {
                    var e = function(e, t) {
                        if (Array.isArray(e))
                            return e;
                        if (Symbol.iterator in Object(e))
                            return function(e, t) {
                                var n = []
                                  , r = !0
                                  , i = !1
                                  , a = void 0;
                                try {
                                    for (var o, s = e[Symbol.iterator](); !(r = (o = s.next()).done) && (n.push(o.value),
                                    !t || n.length !== t); r = !0)
                                        ;
                                } catch (e) {
                                    i = !0,
                                    a = e
                                } finally {
                                    try {
                                        !r && s.return && s.return()
                                    } finally {
                                        if (i)
                                            throw a
                                    }
                                }
                                return n
                            }(e, t);
                        throw new TypeError("Invalid attempt to destructure non-iterable instance")
                    }(Array.from(this.uint32), 2)
                      , t = e[0]
                      , n = e[1]
                      , r = this.uint8[9]
                      , i = 1 - 2 * (r >>> 7)
                      , a = (127 & r) << 8 | this.uint8[8];
                    return 0 === a && 0 === n && 0 === t ? 0 : 32767 === a ? 0 === n && 0 === t ? i * (1 / 0) : NaN : (a -= 16383,
                    i * (n * Math.pow(2, a - 31) + t * Math.pow(2, a - 63)))
                }
            }, {
                key: "decodeString",
                value: function(e, t, n, r) {
                    var i = null === t ? 0 : -1;
                    null == t && (t = 1 / 0);
                    var a = e + t
                      , o = "";
                    switch (n = n.toLowerCase()) {
                    case "ascii":
                    case "latin1":
                        for (var s = void 0; e < a && (s = this.peekUInt8(e++)) !== i; )
                            o += String.fromCharCode(s);
                        break;
                    case "utf8":
                    case "utf-8":
                        for (var u = void 0; e < a && (u = this.peekUInt8(e++)) !== i; ) {
                            var f = void 0
                              , l = void 0;
                            if (0 == (128 & u))
                                o += String.fromCharCode(u);
                            else if (192 == (224 & u))
                                f = 63 & this.peekUInt8(e++),
                                o += String.fromCharCode((31 & u) << 6 | f);
                            else if (224 == (240 & u))
                                f = 63 & this.peekUInt8(e++),
                                l = 63 & this.peekUInt8(e++),
                                o += String.fromCharCode((15 & u) << 12 | f << 6 | l);
                            else if (240 == (248 & u)) {
                                var c = ((15 & u) << 18 | (f = 63 & this.peekUInt8(e++)) << 12 | (l = 63 & this.peekUInt8(e++)) << 6 | 63 & this.peekUInt8(e++)) - 65536;
                                o += String.fromCharCode(55296 + (c >> 10), 56320 + (1023 & c))
                            }
                        }
                        break;
                    case "utf16-be":
                    case "utf16be":
                    case "utf16le":
                    case "utf16-le":
                    case "utf16bom":
                    case "utf16-bom":
                        var d = void 0
                          , h = void 0;
                        switch (n) {
                        case "utf16be":
                        case "utf16-be":
                            h = !1;
                            break;
                        case "utf16le":
                        case "utf16-le":
                            h = !0;
                            break;
                        case "utf16bom":
                        case "utf16-bom":
                        default:
                            if (t < 2 || (d = this.peekUInt16(e)) === i)
                                return r && this.advance(e += 2),
                                o;
                            h = 65534 === d,
                            e += 2
                        }
                        for (var p = void 0; e < a && (p = this.peekUInt16(e, h)) !== i; )
                            if (e += 2,
                            p < 55296 || 57343 < p)
                                o += String.fromCharCode(p);
                            else {
                                var v = this.peekUInt16(e, h);
                                if (v < 56320 || 57343 < v)
                                    throw new Error("Invalid utf16 sequence.");
                                o += String.fromCharCode(p, v),
                                e += 2
                            }
                        p === i && (e += 2);
                        break;
                    default:
                        throw new Error("Unknown encoding: " + n)
                    }
                    return r && this.advance(e),
                    o
                }
            }], [{
                key: "fromBuffer",
                value: function(t) {
                    t = new i.default(t);
                    var n = new a.default;
                    return n.append(t),
                    new e(n)
                }
            }]),
            e
        }();
        t.default = u,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        ;
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function(e) {
            function t(e) {
                !function(e, n) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var n = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" !== (void 0 === t ? "undefined" : r(t)) && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                return n.name = "UnderflowError",
                n.stack = new Error(e).stack,
                "function" == typeof Error.captureStackTrace && Error.captureStackTrace(n, n.constructor),
                n
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + (void 0 === t ? "undefined" : r(t)));
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, Error),
            t
        }();
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        ;
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , a = u(n(6))
          , o = u(n(9))
          , s = function(e) {
            if (e && e.__esModule)
                return e;
            var t = {};
            if (null != e)
                for (var n in e)
                    Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
            return t.default = e,
            t
        }(n(3));
        function u(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var f = function(e) {
            function t() {
                return function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t),
                function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" !== (void 0 === t ? "undefined" : r(t)) && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + (void 0 === t ? "undefined" : r(t)));
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, a.default),
            i(t, [{
                key: "probe",
                value: function(e) {
                    for (var t = e.offset; e.available(2); )
                        if (65520 == (65526 & e.readUInt16()))
                            return e.seek(t),
                            !0;
                    return e.seek(t),
                    !1
                }
            }, {
                key: "init",
                value: function() {
                    this.bitstream = new o.default(this.stream)
                }
            }, {
                key: "readChunk",
                value: function() {
                    if (!this.sentHeader) {
                        var e = this.stream.offset
                          , t = this.readHeader(this.bitstream);
                        this.emit("format", {
                            formatID: "aac ",
                            sampleRate: s.SAMPLE_RATES[t.samplingIndex],
                            channelsPerFrame: t.chanConfig,
                            bitsPerChannel: 16
                        }),
                        this.stream.seek(e),
                        this.sentHeader = !0
                    }
                    for (; this.stream.available(1); ) {
                        var n = this.stream.readSingleBuffer(this.stream.remainingBytes());
                        this.emit("data", n)
                    }
                }
            }], [{
                key: "readHeader",
                value: function(e) {
                    if (4095 !== e.read(12))
                        throw new Error("Invalid ADTS header.");
                    var t = {};
                    e.advance(3);
                    var n = !!e.read(1);
                    return t.profile = e.read(2) + 1,
                    t.samplingIndex = e.read(4),
                    e.advance(1),
                    t.chanConfig = e.read(3),
                    e.advance(4),
                    t.frameLength = e.read(13),
                    e.advance(11),
                    t.numFrames = e.read(2) + 1,
                    n || e.advance(16),
                    t
                }
            }]),
            t
        }();
        t.default = f,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = [1, 4, 3]
          , a = [2, 6, 5]
          , o = [[0, -.43388373, -.7818315, -.9749279, .98480773, .86602539, .64278758, .34202015], [0, -.2079117, -.40673664, -.58778524, -.74314481, -.86602539, -.95105654, -.99452192, .99573416, .96182561, .8951633, .7980172, .67369562, .52643216, .36124167, .18374951], [0, -.43388373, .64278758, .34202015], [0, -.2079117, -.40673664, -.58778524, .67369562, .52643216, .36124167, .18374951]]
          , s = [31, 31, 34, 40, 42, 51, 46, 46, 42, 42, 42, 39, 39]
          , u = function() {
            function e(t) {
                !function(t, n) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                this.maxBands = s[t.sampleIndex],
                this.nFilt = new Int32Array(8),
                this.length = new Array(8),
                this.direction = new Array(8),
                this.order = new Array(8),
                this.coef = new Array(8);
                for (var n = 0; n < 8; n++) {
                    this.length[n] = new Int32Array(4),
                    this.direction[n] = new Array(4),
                    this.order[n] = new Int32Array(4),
                    this.coef[n] = new Array(4);
                    for (var r = 0; r < 4; r++)
                        this.coef[n][r] = new Float32Array(20)
                }
                this.lpc = new Float32Array(20),
                this.tmp = new Float32Array(20)
            }
            return r(e, [{
                key: "decode",
                value: function(e, t) {
                    for (var n = t.windowCount, r = 2 === t.windowSequence ? i : a, s = 0; s < n; s++)
                        if (this.nFilt[s] = e.read(r[0]))
                            for (var u = e.read(1), f = this.nFilt[s], l = this.length[s], c = this.order[s], d = this.direction[s], h = this.coef[s], p = 0; p < f; p++) {
                                if (l[p] = e.read(r[1]),
                                20 < (c[p] = e.read(r[2])))
                                    throw new Error("TNS filter out of range: " + c[p]);
                                if (c[p]) {
                                    d[p] = !!e.read(1);
                                    for (var v = e.read(1), y = u + 3 - v, m = o[2 * v + u], b = c[p], w = h[p], g = 0; g < b; g++)
                                        w[g] = m[e.read(y)]
                                }
                            }
                }
            }, {
                key: "process",
                value: function(e, t, n) {
                    for (var r = Math.min(this.maxBands, e.maxSFB), i = this.lpc, a = this.tmp, o = e.info, s = o.windowCount, u = 0; u < s; u++) {
                        o.swbCount;
                        for (var f = this.nFilt[u], l = this.length[u], c = this.order[u], d = this.coef[u], h = this.direction[u], p = 0; p < f; p++) {
                            var v = y
                              , y = Math.max(0, a - l[p])
                              , m = c[p];
                            if (0 !== m) {
                                for (var b = d[p], w = 0; w < m; w++) {
                                    var g = -b[w];
                                    i[w] = g;
                                    for (var _ = 0, k = w + 1 >> 1; _ < k; _++) {
                                        var I = i[_]
                                          , E = i[w - 1 - _];
                                        i[_] = I + g * E,
                                        i[w - 1 - _] = E + g * I
                                    }
                                }
                                var S, T = o.swbOffsets[Math.min(y, r)], O = o.swbOffsets[Math.min(v, r)], U = 1;
                                if (!((S = O - T) <= 0))
                                    if (h[p] && (U = -1,
                                    T = O - 1),
                                    T += 128 * u,
                                    n)
                                        for (var A = 0; A < S; A++,
                                        T += U)
                                            for (var B = 1; B <= Math.min(A, m); B++)
                                                t[T] -= t[T - B * U] * i[B - 1];
                                    else
                                        for (var x = 0; x < S; x++,
                                        T += U) {
                                            a[0] = t[T];
                                            for (var C = 1; C <= Math.min(x, m); C++)
                                                t[T] += a[C] * i[C - 1];
                                            for (var P = m; 0 < P; P--)
                                                a[P] = a[P - 1]
                                        }
                            }
                        }
                    }
                }
            }]),
            e
        }();
        t.default = u,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        var r, i = (r = n(1)) && r.__esModule ? r : {
            default: r
        };
        function a(e) {
            this.ms_used = [],
            this.left = new i.default(e),
            this.right = new i.default(e)
        }
        a.prototype.decode = function(e, t) {
            var n = this.left
              , r = this.right
              , i = this.ms_used;
            if (this.commonWindow = !!e.read(1)) {
                n.info.decode(e, t, !0),
                r.info = n.info;
                var a = e.read(2);
                switch (this.maskPresent = !!a,
                a) {
                case 1:
                    for (var o = n.info.groupCount * n.info.maxSFB, s = 0; s < o; s++)
                        i[s] = !!e.read(1);
                    break;
                case 0:
                case 2:
                    for (var u = !!a, f = 0; f < 128; f++)
                        i[f] = u;
                    break;
                default:
                    throw new Error("Reserved ms mask type: " + a)
                }
            } else
                for (var l = 0; l < 128; l++)
                    i[l] = !1;
            n.decode(e, t, this.commonWindow),
            r.decode(e, t, this.commonWindow)
        }
        ,
        e.exports = a
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a(n(1))
          , i = a(n(10));
        function a(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        function o(e) {
            this.ics = new r.default(e),
            this.channelPair = new Array(8),
            this.idSelect = new Int32Array(8),
            this.chSelect = new Int32Array(8),
            this.gain = new Array(16)
        }
        o.BEFORE_TNS = 0,
        o.AFTER_TNS = 1,
        o.AFTER_IMDCT = 2;
        var s = new Float32Array([1.0905077326652577, 1.189207115002721, 1.4142135623730951, 2]);
        o.prototype = {
            decode: function(e, t) {
                var n = this.channelPair
                  , a = this.idSelect
                  , u = this.chSelect;
                this.couplingPoint = 2 * e.read(1),
                this.coupledCount = e.read(3);
                for (var f = 0, l = 0; l <= this.coupledCount; l++)
                    f++,
                    n[l] = e.read(1),
                    a[l] = e.read(4),
                    n[l] ? (u[l] = e.read(2),
                    3 === u[l] && f++) : u[l] = 2;
                this.couplingPoint += e.read(1),
                this.couplingPoint |= this.couplingPoint >>> 1;
                var c = e.read(1)
                  , d = s[e.read(2)];
                this.ics.decode(e, t, !1);
                for (var h = this.ics.info.groupCount, p = this.ics.info.maxSFB, v = this.ics.bandTypes, y = 0; y < f; y++) {
                    var m = 0
                      , b = 1
                      , w = 0
                      , g = 1;
                    0 < y && (w = (b = this.couplingPoint === o.AFTER_IMDCT ? 1 : e.read(1)) ? i.default.decodeScaleFactor(e) - 60 : 0,
                    g = Math.pow(d, -w));
                    var _ = this.gain[y] = new Float32Array(120);
                    if (this.couplingPoint === o.AFTER_IMDCT)
                        _[0] = g;
                    else
                        for (var k = 0; k < h; k++)
                            for (var I = 0; I < p; I++)
                                if (v[m] !== r.default.ZERO_BT) {
                                    if (0 === b) {
                                        var E = i.default.decodeScaleFactor(e) - 60;
                                        if (0 !== E) {
                                            var S = 1;
                                            E = w += E,
                                            c || (S -= 2 * (1 & E),
                                            E >>>= 1),
                                            g = Math.pow(d, -E) * S
                                        }
                                    }
                                    _[m++] = g
                                }
                }
            },
            applyIndependentCoupling: function(e, t) {
                for (var n = this.gain[e][0], r = this.ics.data, i = 0; i < t.length; i++)
                    t[i] += n * r[i]
            },
            applyDependentCoupling: function(e, t) {
                for (var n = this.ics.info, i = n.swbOffsets, a = n.groupCount, o = n.maxSFB, s = this.ics.bandTypes, u = this.ics.data, f = 0, l = 0, c = this.gain[e], d = 0; d < a; d++) {
                    for (var h = n.groupLength[d], p = 0; p < o; p++,
                    f++)
                        if (s[f] !== r.default.ZERO_BT)
                            for (var v = c[f], y = 0; y < h; y++)
                                for (var m = i[p]; m < i[p + 1]; m++)
                                    t[l + 128 * y + m] += v * u[l + 128 * y + m];
                    l += 128 * h
                }
            }
        },
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a(n(1))
          , i = a(n(33));
        function a(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        function o(e, t) {
            if (e)
                throw new Error("WHA?? No small frames allowed.");
            this.length = 1024,
            this.shortLength = 128,
            this.mid = (this.length - this.shortLength) / 2,
            this.trans = this.shortLength / 2,
            this.mdctShort = new i.default(2 * this.shortLength),
            this.mdctLong = new i.default(2 * this.length),
            this.overlaps = new Array(t);
            for (var n = 0; n < t; n++)
                this.overlaps[n] = new Float32Array(this.length);
            this.buf = new Float32Array(2 * this.length)
        }
        function s(e) {
            for (var t = new Float32Array(e), n = 0; n < e; n++)
                t[n] = Math.sin((n + .5) * (Math.PI / (2 * e)));
            return t
        }
        function u(e, t) {
            for (var n = Math.PI / t, r = new Float32Array(t), i = 0, a = new Float32Array(t), o = e * n * (e * n), s = 0; s < t; s++) {
                for (var u = s * (t - s) * o, f = 1, l = 50; 0 < l; l--)
                    f = f * u / (l * l) + 1;
                i += f,
                a[s] = i
            }
            i++;
            for (var c = 0; c < t; c++)
                r[c] = Math.sqrt(a[c] / i);
            return r
        }
        var f = s(1024)
          , l = s(128)
          , c = u(4, 1024)
          , d = u(6, 128)
          , h = [f, c]
          , p = [l, d];
        o.prototype.process = function(e, t, n, i) {
            var a = this.overlaps[i]
              , o = e.windowShape[1]
              , s = e.windowShape[0]
              , u = h[o]
              , f = p[o]
              , l = h[s]
              , c = p[s]
              , d = this.length
              , v = this.shortLength
              , y = this.mid
              , m = this.trans
              , b = this.buf
              , w = this.mdctLong
              , g = this.mdctShort;
            switch (e.windowSequence) {
            case r.default.ONLY_LONG_SEQUENCE:
                w.process(t, 0, b, 0);
                for (var _ = 0; _ < d; _++)
                    n[_] = a[_] + b[_] * l[_];
                for (var k = 0; k < d; k++)
                    a[k] = b[d + k] * u[d - 1 - k];
                break;
            case r.default.LONG_START_SEQUENCE:
                w.process(t, 0, b, 0);
                for (var I = 0; I < d; I++)
                    n[I] = a[I] + b[I] * l[I];
                for (var E = 0; E < y; E++)
                    a[E] = b[d + E];
                for (var S = 0; S < v; S++)
                    a[y + S] = b[d + y + S] * f[v - S - 1];
                for (var T = 0; T < y; T++)
                    a[y + v + T] = 0;
                break;
            case r.default.EIGHT_SHORT_SEQUENCE:
                for (var O = 0; O < 8; O++)
                    g.process(t, O * v, b, 2 * O * v);
                for (var U = 0; U < y; U++)
                    n[U] = a[U];
                for (var A = 0; A < v; A++)
                    n[y + A] = a[y + A] + b[A] * c[A],
                    n[y + 1 * v + A] = a[y + 1 * v + A] + b[1 * v + A] * f[v - 1 - A] + b[2 * v + A] * f[A],
                    n[y + 2 * v + A] = a[y + 2 * v + A] + b[3 * v + A] * f[v - 1 - A] + b[4 * v + A] * f[A],
                    n[y + 3 * v + A] = a[y + 3 * v + A] + b[5 * v + A] * f[v - 1 - A] + b[6 * v + A] * f[A],
                    A < m && (n[y + 4 * v + A] = a[y + 4 * v + A] + b[7 * v + A] * f[v - 1 - A] + b[8 * v + A] * f[A]);
                for (var B = 0; B < v; B++)
                    m <= B && (a[y + 4 * v + B - d] = b[7 * v + B] * f[v - 1 - B] + b[8 * v + B] * f[B]),
                    a[y + 5 * v + B - d] = b[9 * v + B] * f[v - 1 - B] + b[10 * v + B] * f[B],
                    a[y + 6 * v + B - d] = b[11 * v + B] * f[v - 1 - B] + b[12 * v + B] * f[B],
                    a[y + 7 * v + B - d] = b[13 * v + B] * f[v - 1 - B] + b[14 * v + B] * f[B],
                    a[y + 8 * v + B - d] = b[15 * v + B] * f[v - 1 - B];
                for (var x = 0; x < y; x++)
                    a[y + v + x] = 0;
                break;
            case r.default.LONG_STOP_SEQUENCE:
                w.process(t, 0, b, 0);
                for (var C = 0; C < y; C++)
                    n[C] = a[C];
                for (var P = 0; P < v; P++)
                    n[y + P] = a[y + P] + b[y + P] * c[P];
                for (var M = 0; M < y; M++)
                    n[y + v + M] = a[y + v + M] + b[y + v + M];
                for (var L = 0; L < d; L++)
                    a[L] = b[d + L] * u[d - 1 - L]
            }
        }
        ,
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r, i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }(), a = n(34), o = (r = n(35)) && r.__esModule ? r : {
            default: r
        }, s = function() {
            function e(t) {
                switch (function(t, n) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                this.N = t,
                this.N2 = t >>> 1,
                this.N4 = t >>> 2,
                this.N8 = t >>> 3,
                t) {
                case 2048:
                    this.sincos = a.MDCT_TABLE_2048;
                    break;
                case 256:
                    this.sincos = a.MDCT_TABLE_256;
                    break;
                case 1920:
                    this.sincos = a.MDCT_TABLE_1920;
                    break;
                case 240:
                    this.sincos = a.MDCT_TABLE_240;
                    break;
                default:
                    throw new Error("unsupported MDCT length: " + t)
                }
                this.fft = new o.default(this.N4),
                this.buf = new Array(this.N4);
                for (var n = 0; n < this.N4; n++)
                    this.buf[n] = new Float32Array(2);
                this.tmp = new Float32Array(2)
            }
            return i(e, [{
                key: "process",
                value: function(e, t, n, r) {
                    for (var i = this.N2, a = this.N4, o = this.N8, s = this.buf, u = this.tmp, f = this.sincos, l = this.fft, c = 0; c < a; c++)
                        s[c][1] = e[t + 2 * c] * f[c][0] + e[t + i - 1 - 2 * c] * f[c][1],
                        s[c][0] = e[t + i - 1 - 2 * c] * f[c][0] - e[t + 2 * c] * f[c][1];
                    l.process(s, !1);
                    for (var d = 0; d < a; d++)
                        u[0] = s[d][0],
                        u[1] = s[d][1],
                        s[d][1] = u[1] * f[d][0] + u[0] * f[d][1],
                        s[d][0] = u[0] * f[d][0] - u[1] * f[d][1];
                    for (var h = 0; h < o; h += 2)
                        n[r + 2 * h] = s[o + h][1],
                        n[r + 2 + 2 * h] = s[o + 1 + h][1],
                        n[r + 1 + 2 * h] = -s[o - 1 - h][0],
                        n[r + 3 + 2 * h] = -s[o - 2 - h][0],
                        n[r + a + 2 * h] = s[h][0],
                        n[r + a + 2 + 2 * h] = s[1 + h][0],
                        n[r + a + 1 + 2 * h] = -s[a - 1 - h][1],
                        n[r + a + 3 + 2 * h] = -s[a - 2 - h][1],
                        n[r + i + 2 * h] = s[o + h][0],
                        n[r + i + 2 + 2 * h] = s[o + 1 + h][0],
                        n[r + i + 1 + 2 * h] = -s[o - 1 - h][1],
                        n[r + i + 3 + 2 * h] = -s[o - 2 - h][1],
                        n[r + i + a + 2 * h] = -s[h][1],
                        n[r + i + a + 2 + 2 * h] = -s[1 + h][1],
                        n[r + i + a + 1 + 2 * h] = s[a - 1 - h][0],
                        n[r + i + a + 3 + 2 * h] = s[a - 2 - h][0]
                }
            }]),
            e
        }();
        t.default = s,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.MDCT_TABLE_2048 = [[.031249997702054, 11984224612e-15], [.031249813866531, .000107857810004], [.031249335895858, .000203730380198], [.031248563794535, .000299601032804], [.031247497569829, .000395468865451], [.031246137231775, .000491332975794], [.031244482793177, .000587192461525], [.031242534269608, .000683046420376], [.031240291679407, .000778893950134], [.031237755043684, .000874734148645], [.031234924386313, .000970566113826], [.031231799733938, .001066388943669], [.03122838111597, .001162201736253], [.031224668564585, .001258003589751], [.031220662114728, .001353793602441], [.031216361804108, .00144957087271], [.031211767673203, .001545334499065], [.031206879765253, .001641083580144], [.031201698126266, .001736817214719], [.031196222805014, .001832534501709], [.031190453853031, .001928234540186], [.031184391324617, .002023916429386], [.031178035276836, .002119579268713], [.031171385769513, .002215222157753], [.031164442865236, .002310844196278], [.031157206629353, .002406444484258], [.031149677129975, .002502022121865], [.031141854437973, .002597576209488], [.031133738626977, .002693105847734], [.031125329773375, .002788610137442], [.031116627956316, .002884088179689], [.031107633257703, .002979539075801], [.0310983457622, .003074961927355], [.031088765557222, .003170355836197], [.031078892732942, .003265719904442], [.031068727382288, .003361053234488], [.031058269600939, .003456354929021], [.031047519487329, .003551624091024], [.03103647714264, .00364685982379], [.031025142670809, .003742061230921], [.031013516178519, .003837227416347], [.031001597775203, .003932357484328], [.030989387573042, .004027450539462], [.030976885686963, .004122505686697], [.030964092234638, .00421752203134], [.030951007336485, .004312498679058], [.030937631115663, .004407434735897], [.030923963698074, .004502329308281], [.030910005212362, .004597181503027], [.030895755789908, .00469199042735], [.030881215564835, .004786755188872], [.030866384674, .004881474895632], [.030851263256996, .00497614865609], [.030835851456154, .005070775579142], [.030820149416533, .005165354774124], [.030804157285929, .005259885350819], [.030787875214864, .005354366419469], [.030771303356593, .005448797090784], [.030754441867095, .005543176475946], [.030737290905077, .005637503686619], [.030719850631972, .005731777834961], [.030702121211932, .005825998033626], [.030684102811835, .00592016339578], [.030665795601276, .006014273035101], [.03064719975257, .006108326065793], [.030628315440748, .006202321602594], [.030609142843557, .006296258760782], [.030589682141455, .006390136656185], [.030569933517616, .006483954405188], [.030549897157919, .006577711124743], [.030529573250956, .006671405932375], [.030508961988022, .006765037946194], [.030488063563118, .0068586062849], [.030466878172949, .006952110067791], [.030445406016919, .007045548414774], [.030423647297133, .007138920446372], [.030401602218392, .007232225283733], [.030379270988192, .007325462048634], [.030356653816724, .007418629863497], [.030333750916869, .00751172785139], [.030310562504198, .00760475513604], [.030287088796968, .007697710841838], [.030263330016124, .007790594093851], [.030239286385293, .007883404017824], [.030214958130781, .007976139740197], [.030190345481576, .008068800388104], [.030165448669342, .00816138508939], [.030140267928416, .00825389297261], [.030114803495809, .008346323167047], [.030089055611203, .008438674802711], [.030063024516947, .008530947010354], [.030036710458054, .008623138921475], [.030010113682202, .008715249668328], [.029983234439732, .008807278383932], [.02995607298364, .008899224202078], [.02992862956958, .008991086257336], [.02990090445586, .009082863685067], [.029872897903441, .009174555621425], [.029844610175929, .009266161203371], [.029816041539579, .009357679568679], [.029787192263292, .009449109855944], [.029758062618606, .009540451204587], [.029728652879702, .009631702754871], [.029698963323395, .0097228636479], [.029668994229134, .009813933025633], [.029638745879, .009904910030891], [.029608218557702, .009995793807363], [.029577412552575, .010086583499618], [.029546328153577, .010177278253107], [.029514965653285, .010267877214177], [.029483325346896, .010358379530076], [.02945140753222, .010448784348962], [.029419212509679, .010539090819911], [.029386740582307, .010629298092923], [.02935399205574, .010719405318933], [.02932096723822, .010809411649818], [.02928766644059, .010899316238403], [.02925408997629, .010989118238474], [.029220238161353, .011078816804778], [.029186111314406, .011168411093039], [.029151709756664, .011257900259961], [.029117033811927, .011347283463239], [.029082083806579, .011436559861563], [.029046860069582, .01152572861463], [.029011362932476, .01161478888315], [.028975592729373, .011703739828853], [.028939549796957, .0117925806145], [.028903234474475, .011881310403886], [.028866647103744, .011969928361855], [.028829788029135, .012058433654299], [.028792657597583, .012146825448172], [.028755256158571, .012235102911499], [.028717584064137, .012323265213377], [.028679641668864, .01241131152399], [.028641429329882, .012499241014612], [.028602947406859, .012587052857618], [.028564196262001, .012674746226488], [.02852517626005, .012762320295819], [.028485887768276, .012849774241331], [.028446331156478, .012937107239875], [.028406506796976, .013024318469437], [.028366415064615, .013111407109155], [.028326056336751, .013198372339315], [.028285430993258, .013285213341368], [.028244539416515, .013371929297933], [.028203381991411, .013458519392807], [.028161959105334, .013544982810971], [.028120271148172, .013631318738598], [.028078318512309, .013717526363062], [.028036101592619, .013803604872943], [.027993620786463, .013889553458039], [.027950876493687, .013975371309367], [.027907869116616, .014061057619178], [.027864599060052, .014146611580959], [.02782106673127, .014232032389445], [.027777272540012, .014317319240622], [.027733216898487, .014402471331737], [.027688900221361, .014487487861307], [.027644322925762, .014572368029123], [.027599485431266, .014657111036262], [.027554388159903, .01474171608509], [.027509031536144, .014826182379271], [.027463415986904, .014910509123778], [.027417541941533, .014994695524894], [.027371409831816, .015078740790225], [.027325020091965, .015162644128704], [.027278373158618, .015246404750603], [.027231469470833, .015330021867534], [.027184309470088, .01541349469246], [.027136893600268, .015496822439704], [.027089222307671, .015580004324954], [.027041296040997, .015663039565269], [.026993115251345, .015745927379091], [.026944680392213, .015828666986247], [.026895991919487, .015911257607961], [.026847050291442, .015993698466859], [.026797855968734, .016075988786976], [.026748409414401, .016158127793763], [.026698711093851, .016240114714099], [.026648761474864, .016321948776289], [.026598561027585, .016403629210082], [.026548110224519, .016485155246669], [.02649740954053, .016566526118696], [.02644645945283, .016647741060271], [.026395260440982, .016728799306966], [.02634381298689, .016809700095831], [.026292117574797, .016890442665397], [.02624017469128, .016971026255683], [.026187984825246, .017051450108208], [.026135548467924, .01713171346599], [.026082866112867, .01721181557356], [.026029938255941, .017291755676967], [.025976765395322, .017371533023784], [.025923348031494, .017451146863116], [.025869686667242, .017530596445607], [.025815781807646, .017609881023449], [.02576163396008, .017688999850383], [.025707243634204, .017767952181715], [.02565261134196, .017846737274313], [.025597737597568, .017925354386623], [.025542622917522, .018003802778671], [.025487267820581, .018082081712071], [.025431672827768, .018160190450031], [.025375838462365, .018238128257362], [.025319765249906, .018315894400484], [.025263453718173, .018393488147432], [.025206904397193, .018470908767865], [.025150117819228, .01854815553307], [.025093094518776, .018625227715971], [.025035835032562, .018702124591135], [.024978339899534, .01877884543478], [.024920609660858, .01885538952478], [.024862644859912, .018931756140672], [.024804446042284, .019007944563666], [.024746013755764, .019083954076646], [.024687348550337, .019159783964183], [.024628450978184, .019235433512536], [.02456932159367, .019310902009663], [.024509960953345, .019386188745225], [.024450369615932, .019461293010596], [.024390548142329, .019536214098866], [.024330497095598, .019610951304848], [.024270217040961, .019685503925087], [.024209708545799, .019759871257867], [.024148972179639, .019834052603212], [.024088008514157, .019908047262901], [.024026818123164, .019981854540467], [.023965401582609, .020055473741208], [.023903759470567, .020128904172192], [.023841892367236, .020202145142264], [.023779800854935, .020275195962052], [.023717485518092, .020348055943974], [.023654946943242, .020420724402244], [.023592185719023, .020493200652878], [.023529202436167, .020565484013703], [.023465997687496, .020637573804361], [.023402572067918, .020709469346314], [.023338926174419, .020781169962854], [.023275060606058, .020852674979108], [.023210975963963, .020923983722044], [.023146672851322, .020995095520475], [.02308215187338, .021066009705072], [.023017413637435, .021136725608363], [.022952458752826, .021207242564742], [.022887287830934, .021277559910478], [.022821901485173, .021347676983716], [.022756300330983, .021417593124488], [.022690484985827, .021487307674717], [.022624456069185, .021556819978223], [.022558214202547, .021626129380729], [.022491760009405, .021695235229869], [.022425094115252, .021764136875192], [.022358217147572, .021832833668171], [.022291129735838, .021901324962204], [.022223832511501, .021969610112625], [.022156326107988, .022037688476709], [.022088611160696, .022105559413676], [.022020688306983, .022173222284699], [.021952558186166, .022240676452909], [.02188422143951, .022307921283403], [.021815678710228, .022374956143245], [.021746930643469, .022441780401478], [.021677977886316, .022508393429127], [.02160882108778, .022574794599206], [.02153946089879, .022640983286719], [.02146989797219, .022706958868676], [.021400132962735, .022772720724087], [.021330166527077, .022838268233979], [.021259999323769, .022903600781391], [.02118963201325, .022968717751391], [.021119065257845, .023033618531071], [.021048299721754, .023098302509561], [.02097733607105, .023162769078031], [.02090617497367, .023227017629698], [.020834817099409, .023291047559828], [.020763263119915, .023354858265748], [.02069151370868, .023418449146848], [.020619569541038, .023481819604585], [.020547431294155, .023544969042494], [.020475099647023, .023607896866186], [.020402575280455, .023670602483363], [.020329858877078, .023733085303813], [.020256951121327, .023795344739427], [.020183852699437, .023857380204193], [.020110564299439, .023919191114211], [.02003708661115, .023980776887692], [.019963420326171, .024042136944968], [.019889566137877, .024103270708495], [.019815524741412, .024164177602859], [.019741296833681, .024224857054779], [.019666883113346, .02428530849312], [.019592284280817, .024345531348888], [.019517501038246, .024405525055242], [.019442534089523, .0244652890475], [.019367384140264, .024524822763141], [.019292051897809, .024584125641809], [.019216538071215, .024643197125323], [.019140843371246, .024702036657681], [.019064968510369, .024760643685063], [.018988914202748, .024819017655836], [.018912681164234, .024877158020562], [.018836270112363, .024935064232003], [.018759681766343, .024992735745123], [.018682916847054, .025050172017095], [.018605976077037, .025107372507308], [.018528860180486, .025164336677369], [.018451569883247, .02522106399111], [.018374105912805, .025277553914591], [.01829646899828, .025333805916107], [.018218659870421, .025389819466194], [.018140679261596, .02544559403763], [.01806252790579, .025501129105445], [.017984206538592, .02555642414692], [.017905715897192, .025611478641598], [.017827056720375, .025666292071285], [.017748229748511, .025720863920056], [.01766923572355, .02577519367426], [.017590075389012, .025829280822525], [.017510749489986, .025883124855762], [.017431258773116, .02593672526717], [.0173516039866, .025990081552242], [.01727178588018, .026043193208768], [.017191805205132, .026096059736841], [.017111662714267, .026148680638861], [.017031359161915, .026201055419541], [.016950895303924, .026253183585908], [.016870271897651, .026305064647313], [.016789489701954, .026356698115431], [.016708549477186, .026408083504269], [.016627451985187, .026459220330167], [.016546197989277, .026510108111806], [.01646478825425, .026560746370212], [.016383223546365, .026611134628757], [.016301504633341, .026661272413168], [.016219632284346, .02671115925153], [.016137607269996, .026760794674288], [.01605543036234, .026810178214254], [.015973102334858, .026859309406613], [.015890623962454, .026908187788922], [.015807996021446, .026956812901119], [.015725219289558, .027005184285527], [.015642294545918, .027053301486856], [.015559222571044, .027101164052208], [.015476004146842, .027148771531083], [.015392640056594, .02719612347538], [.015309131084956, .027243219439406], [.015225478017946, .027290058979875], [.015141681642938, .027336641655915], [.015057742748656, .027382967029073], [.014973662125164, .027429034663317], [.014889440563862, .02747484412504], [.014805078857474, .027520394983066], [.014720577800046, .027565686808654], [.014635938186934, .027610719175499], [.014551160814797, .02765549165974], [.014466246481592, .02770000383996], [.014381195986567, .027744255297195], [.014296010130247, .027788245614933], [.014210689714436, .02783197437912], [.014125235542201, .027875441178165], [.01403964841787, .027918645602941], [.01395392914702, .027961587246792], [.013868078536476, .028004265705534], [.013782097394294, .028046680577462], [.013695986529763, .028088831463351], [.01360974675339, .028130717966461], [.013523378876898, .02817233969254], [.013436883713214, .028213696249828], [.013350262076462, .028254787249062], [.01326351478196, .028295612303478], [.013176642646205, .028336171028814], [.013089646486871, .028376463043317], [.013002527122799, .028416487967743], [.01291528537399, .028456245425361], [.012827922061597, .02849573504196], [.012740438007915, .028534956445849], [.012652834036379, .028573909267859], [.01256511097155, .028612593141354], [.012477269639111, .028651007702224], [.012389310865858, .028689152588899], [.012301235479693, .028727027442343], [.012213044309615, .028764631906065], [.012124738185712, .028801965626115], [.012036317939156, .028839028251097], [.011947784402191, .028875819432161], [.01185913840813, .028912338823015], [.011770380791341, .028948586079925], [.011681512387245, .028984560861718], [.011592534032306, .029020262829785], [.011503446564022, .029055691648087], [.011414250820918, .029090846983152], [.011324947642537, .029125728504087], [.011235537869437, .029160335882573], [.011146022343175, .029194668792871], [.011056401906305, .029228726911828], [.010966677402371, .029262509918876], [.010876849675891, .029296017496036], [.010786919572361, .029329249327922], [.010696887938235, .029362205101743], [.010606755620926, .029394884507308], [.010516523468793, .029427287237024], [.010426192331137, .029459412985906], [.010335763058187, .029491261451573], [.010245236501099, .029522832334255], [.010154613511943, .029554125336796], [.010063894943698, .029585140164654], [.00997308165024, .029615876525905], [.00988217448634, .029646334131247], [.00979117430765, .029676512694001], [.009700081970699, .029706411930116], [.009608898332881, .029736031558168], [.009517624252453, .029765371299366], [.009426260588521, .029794430877553], [.009334808201034, .02982321001921], [.009243267950778, .029851708453456], [.009151640699363, .029879925912053], [.00905992730922, .029907862129408], [.008968128643591, .029935516842573], [.00887624556652, .029962889791254], [.008784278942845, .029989980717805], [.008692229638191, .030016789367235], [.008600098518961, .030043315487212], [.008507886452329, .030069558828062], [.00841559430623, .030095519142772], [.008323222949351, .030121196186994], [.008230773251129, .030146589719046], [.008138246081733, .030171699499915], [.008045642312067, .030196525293257], [.00795296281375, .030221066865402], [.007860208459119, .030245323985357], [.007767380121212, .030269296424803], [.007674478673766, .030292983958103], [.007581504991203, .030316386362302], [.007488459948628, .030339503417126], [.007395344421816, .030362334904989], [.007302159287206, .030384880610993], [.007208905421891, .030407140322928], [.007115583703613, .030429113831278], [.007022195010752, .03045080092922], [.006928740222316, .030472201412626], [.006835220217939, .030493315080068], [.006741635877866, .030514141732814], [.006647988082948, .030534681174838], [.006554277714635, .030554933212813], [.006460505654964, .030574897656119], [.006366672786553, .030594574316845], [.006272779992593, .030613963009786], [.006178828156839, .030633063552447], [.006084818163601, .030651875765048], [.005990750897737, .03067039947052], [.005896627244644, .030688634494512], [.00580244809025, .030706580665388], [.005708214321004, .030724237814232], [.005613926823871, .030741605774849], [.005519586486321, .030758684383764], [.005425194196321, .030775473480228], [.005330750842327, .030791972906214], [.005236257313276, .030808182506425], [.005141714498576, .030824102128288], [.005047123288102, .030839731621963], [.004952484572181, .030855070840339], [.004857799241589, .030870119639036], [.004763068187541, .030884877876411], [.004668292301681, .030899345413553], [.004573472476075, .030913522114288], [.004478609603205, .03092740784518], [.004383704575956, .03094100247553], [.00428875828761, .030954305877381], [.004193771631837, .030967317925516], [.004098745502689, .030980038497461], [.004003680794587, .030992467473486], [.003908578402316, .031004604736602], [.003813439221017, .031016450172571], [.003718264146176, .031028003669899], [.003623054073616, .031039265119839], [.003527809899492, .031050234416394], [.003432532520278, .031060911456318], [.00333722283276, .031071296139114], [.003241881734029, .031081388367037], [.003146510121474, .031091188045095], [.003051108892766, .031100695081051], [.00295567894586, .031109909385419], [.002860221178978, .031118830871473], [.002764736490604, .031127459455239], [.002669225779478, .031135795055501], [.002573689944583, .031143837593803], [.002478129885137, .031151586994444], [.002382546500589, .031159043184484], [.002286940690606, .031166206093743], [.002191313355067, .0311730756548], [.002095665394051, .031179651802998], [.001999997707835, .031185934476438], [.001904311196878, .031191923615985], [.00180860676182, .031197619165268], [.001712885303465, .031203021070678], [.001617147722782, .03120812928137], [.001521394920889, .031212943749264], [.001425627799047, .031217464429043], [.001329847258653, .031221691278159], [.001234054201231, .031225624256825], [.00113824952842, .031229263328024], [.001042434141971, .031232608457502], [.000946608943736, .031235659613775], [.000850774835656, .031238416768124], [.000754932719759, .031240879894597], [.000659083498149, .03124304897001], [.000563228072993, .031244923973948], [.00046736734652, .031246504888762], [.000371502221008, .031247791699571], [.000275633598775, .031248784394264], [.000179762382174, .031249482963498], [83889473581e-15, .031249887400697]],
        t.MDCT_TABLE_256 = [[.088387931675923, .000271171628935], [.088354655998507, .002440238387037], [.08826815878011, .00460783523678], [.088128492123423, .006772656498875], [.087935740158418, .008933398165942], [.08769001899167, .011088758687994], [.087391476636423, .013237439756448], [.087040292923427, .015378147086172], [.086636679392621, .017509591195118], [.086180879165703, .019630488181053], [.085673166799686, .02173956049494], [.085113848121515, .023835537710479], [.084503260043847, .025917157289369], [.08384177036211, .027983165341813], [.083129777532952, .030032317381813], [.08236771043423, .032063379076803], [.081556028106671, .034075126991164], [.080695219477356, .036066349323177], [.079785803065216, .038035846634965], [.078828326668693, .039982432574992], [.077823367035766, .041904934592675], [.07677152951654, .043802194644686], [.075673447698606, .045673069892513], [.07452978302539, .047516433390863], [.073341224397728, .049331174766491], [.072108487758894, .051116200887052], [.070832315663343, .052870436519557], [.069513476829429, .054592824978055], [.068152765676348, .056282328760143], [.06675100184562, .057937930171918], [.065309029707361, .059558631940996], [.063827717851668, .061143457817234], [.062307958565413, .062691453160784], [.060750667294763, .064201685517134], [.059156782093749, .065673245178784], [.057527263059216, .06710524573322], [.055863091752499, .068496824596852], [.054165270608165, .069847143534609], [.052434822330188, .071155389164853], [.050672789275903, .072420773449336], [.048880232828135, .073642534167879], [.047058232755862, .074819935377512], [.045207886563797, .075952267855771], [.043330308831298, .077038849527912], [.041426630540984, .078079025877766], [.039497998397473, .079072170341994], [.037545574136653, .080017684687506], [.035570533825892, .080914999371817], [.033574067155622, .081763573886112], [.031557376722714, .082562897080836], [.029521677306074, .083312487473584], [.027468195134911, .084011893539132], [.025398167150101, .084660693981419], [.023312840259098, .08525849798732], [.021213470584847, .085804945462053], [.019101322709138, .086299707246093], [.016977668910873, .086742485313442], [.014843788399692, .087133012951149], [.012700966545425, .087471054919968], [.01055049410383, .087756407596056], [.008393666439096, .087988899093631], [.006231782743558, .08816838936851], [.004066145255116, .088294770302461], [.001898058472816, .088367965768336]],
        t.MDCT_TABLE_1920 = [[.032274858518097, 13202404176e-15], [.032274642494505, .000118821372483], [.032274080835421, .000224439068308], [.03227317354686, .000330054360572], [.032271920638538, .000435666118218], [.032270322123873, .000541273210231], [.032268378019984, .000646874505642], [.032266088347691, .000752468873546], [.032263453131514, .000858055183114], [.032260472399674, .0009636323036], [.032257146184092, .001069199104358], [.03225347452039, .001174754454853], [.032249457447888, .001280297224671], [.032245095009606, .001385826283535], [.032240387252262, .001491340501313], [.032235334226272, .001596838748031], [.03222993598575, .00170231989389], [.032224192588507, .001807782809271], [.03221810409605, .001913226364749], [.032211670573582, .002018649431111], [.03220489209, .002124050879359], [.032197768717898, .002229429580728], [.03219030053356, .002334784406698], [.032182487616965, .002440114229003], [.032174330051782, .002545417919644], [.032165827925374, .002650694350905], [.03215698132879, .002755942395358], [.032147790356771, .002861160925883], [.032138255107744, .002966348815672], [.032128375683825, .00307150493825], [.032118152190814, .003176628167476], [.032107584738196, .003281717377568], [.032096673439141, .003386771443102], [.0320854184105, .003491789239036], [.032073819772804, .003596769640711], [.032061877650267, .003701711523874], [.032049592170778, .00380661376468], [.032036963465906, .003911475239711], [.032023991670893, .004016294825985], [.032010676924657, .004121071400967], [.031997019369789, .004225803842586], [.031983019152549, .004330491029241], [.031968676422869, .004435131839816], [.031953991334348, .004539725153692], [.031938964044252, .004644269850758], [.03192359471351, .004748764811426], [.031907883506716, .004853208916638], [.031891830592124, .004957601047881], [.031875436141648, .0050619400872], [.031858700330859, .005166224917208], [.031841623338985, .005270454421097], [.031824205348907, .005374627482653], [.031806446547156, .005478742986267], [.031788347123916, .005582799816945], [.031769907273017, .005686796860323], [.031751127191935, .005790733002674], [.031732007081789, .005894607130928], [.03171254714734, .005998418132675], [.031692747596989, .006102164896182], [.031672608642773, .006205846310406], [.031652130500364, .006309461265002], [.031631313389067, .006413008650337], [.031610157531816, .006516487357501], [.031588663155172, .006619896278321], [.031566830489325, .00672323430537], [.031544659768083, .006826500331981], [.031522151228878, .006929693252258], [.031499305112758, .007032811961088], [.031476121664387, .007135855354151], [.03145260113204, .007238822327937], [.031428743767604, .007341711779751], [.031404549826572, .00744452260773], [.031380019568042, .007547253710853], [.031355153254712, .007649903988952], [.031329951152882, .007752472342725], [.031304413532445, .007854957673748], [.031278540666888, .007957358884484], [.03125233283329, .0080596748783], [.031225790312316, .008161904559473], [.031198913388214, .008264046833205], [.031171702348814, .008366100605636], [.031144157485525, .008468064783849], [.031116279093331, .008569938275893], [.031088067470786, .008671719990782], [.031059522920014, .008773408838517], [.031030645746705, .008875003730092], [.03100143626011, .008976503577507], [.030971894773039, .00907790729378], [.030942021601857, .009179213792959], [.030911817066483, .009280421990133], [.030881281490382, .009381530801444], [.030850415200566, .009482539144097], [.030819218527589, .009583445936373], [.030787691805541, .009684250097643], [.030755835372048, .009784950548375], [.030723649568268, .009885546210147], [.030691134738883, .009986036005661], [.030658291232103, .010086418858753], [.030625119399655, .010186693694402], [.030591619596781, .010286859438745], [.030557792182239, .010386915019088], [.030523637518292, .010486859363916], [.03048915597071, .010586691402906], [.030454347908763, .010686410066936], [.030419213705216, .010786014288099], [.030383753736329, .010885502999714], [.030347968381849, .010984875136338], [.03031185802501, .011084129633775], [.030275423052523, .011183265429088], [.030238663854579, .011282281460612], [.030201580824838, .011381176667967], [.03016417436043, .011479949992062], [.030126444861948, .011578600375117], [.030088392733446, .011677126760663], [.03005001838243, .011775528093563], [.030011322219859, .011873803320018], [.029972304660138, .011971951387578], [.029932966121114, .012069971245157], [.02989330702407, .012167861843041], [.029853327793724, .012265622132901], [.029813028858222, .012363251067801], [.029772410649132, .012460747602215], [.029731473601443, .012558110692033], [.029690218153558, .012655339294575], [.029648644747289, .0127524323686], [.029606753827855, .01284938887432], [.029564545843872, .012946207773407], [.029522021247356, .013042888029011], [.02947918049371, .013139428605762], [.029436024041725, .013235828469789], [.02939255235357, .013332086588727], [.029348765894794, .013428201931728], [.029304665134313, .013524173469475], [.029260250544412, .013620000174189], [.029215522600735, .013715681019643], [.029170481782283, .013811214981173], [.029125128571406, .013906601035686], [.029079463453801, .014001838161674], [.029033486918505, .014096925339225], [.028987199457889, .014191861550031], [.028940601567655, .014286645777401], [.028893693746829, .014381277006273], [.028846476497755, .014475754223221], [.028798950326094, .014570076416472], [.028751115740811, .01466424257591], [.028702973254178, .014758251693091], [.02865452338176, .014852102761253], [.028605766642418, .014945794775326], [.028556703558297, .015039326731945], [.028507334654823, .015132697629457], [.028457660460698, .015225906467935], [.028407681507891, .015318952249187], [.028357398331639, .015411833976768], [.028306811470432, .015504550655988], [.028255921466016, .015597101293927], [.028204728863381, .015689484899442], [.02815323421076, .015781700483179], [.028101438059619, .015873747057582], [.028049340964652, .015965623636907], [.027996943483779, .016057329237229], [.027944246178133, .016148862876456], [.027891249612061, .016240223574335], [.027837954353113, .016331410352467], [.027784360972039, .016422422234315], [.02773047004278, .016513258245214], [.027676282142466, .016603917412384], [.027621797851405, .016694398764938], [.02756701775308, .016784701333894], [.027511942434143, .016874824152183], [.027456572484404, .016964766254662], [.027400908496833, .017054526678124], [.027344951067546, .017144104461307], [.027288700795801, .017233498644904], [.027232158283994, .017322708271577], [.027175324137651, .01741173238596], [.027118198965418, .017500570034678], [.02706078337906, .017589220266351], [.027003077993454, .017677682131607], [.026945083426576, .017765954683088], [.026886800299502, .017854036975468], [.026828229236397, .017941928065456], [.026769370864511, .018029627011808], [.02671022581417, .01811713287534], [.026650794718768, .018204444718934], [.026591078214767, .018291561607551], [.02653107694168, .018378482608238], [.026470791542075, .018465206790142], [.026410222661558, .018551733224515], [.026349370948775, .01863806098473], [.026288237055398, .018724189146286], [.026226821636121, .018810116786819], [.026165125348656, .018895842986112], [.026103148853718, .018981366826109], [.026040892815028, .019066687390916], [.025978357899296, .019151803766819], [.025915544776223, .01923671504229], [.025852454118485, .019321420307998], [.025789086601733, .019405918656817], [.025725442904582, .019490209183837], [.025661523708606, .019574290986376], [.025597329698327, .019658163163984], [.025532861561211, .019741824818458], [.025468119987662, .019825275053848], [.025403105671008, .01990851297647], [.025337819307501, .019991537694913], [.025272261596305, .020074348320047], [.025206433239491, .020156943965039], [.025140334942028, .020239323745355], [.025073967411776, .020321486778774], [.025007331359476, .020403432185395], [.024940427498748, .02048515908765], [.024873256546079, .020566666610309], [.024805819220816, .020647953880491], [.024738116245157, .020729020027676], [.024670148344147, .020809864183709], [.024601916245669, .020890485482816], [.024533420680433, .020970883061607], [.024464662381971, .021051056059087], [.02439564208663, .02113100361667], [.024326360533561, .021210724878181], [.024256818464715, .021290218989868], [.02418701662483, .021369485100415], [.02411695576143, .021448522360944], [.024046636624808, .02152732992503], [.023976059968027, .021605906948708], [.023905226546906, .02168425259048], [.023834137120014, .021762366011328], [.023762792448662, .02184024637472], [.023691193296893, .02191789284662], [.023619340431478, .021995304595495], [.023547234621902, .02207248079233], [.023474876640361, .022149420610628], [.023402267261751, .022226123226426], [.023329407263659, .0223025878183], [.023256297426359, .022378813567377], [.023182938532797, .022454799657339], [.023109331368588, .022530545274437], [.023035476722006, .022606049607496], [.022961375383975, .022681311847926], [.022887028148061, .022756331189727], [.022812435810462, .022831106829504], [.022737599170003, .022905637966469], [.022662519028125, .022979923802453], [.022587196188874, .023053963541915], [.022511631458899, .02312775639195], [.022435825647437, .023201301562294], [.022359779566306, .023274598265338], [.0222834940299, .023347645716133], [.022206969855176, .0234204431324], [.022130207861645, .023492989734537], [.022053208871367, .023565284745628], [.02197597370894, .023637327391451], [.021898503201489, .023709116900488], [.021820798178663, .023780652503931], [.021742859472618, .023851933435691], [.021664687918017, .023922958932406], [.021586284352013, .023993728233451], [.021507649614247, .024064240580942], [.021428784546832, .02413449521975], [.02134968999435, .024204491397504], [.02127036680384, .0242742283646], [.021190815824791, .024343705374213], [.021111037909128, .024412921682298], [.02103103391121, .024481876547605], [.020950804687815, .024550569231683], [.020870351098134, .024618998998889], [.020789674003759, .024687165116394], [.020708774268678, .024755066854194], [.020627652759262, .024822703485116], [.020546310344257, .024890074284826], [.020464747894775, .024957178531837], [.020382966284284, .025024015507516], [.0203009663886, .025090584496093], [.020218749085876, .025156884784668], [.020136315256592, .025222915663218], [.020053665783549, .025288676424605], [.019970801551857, .025354166364584], [.019887723448925, .025419384781811], [.019804432364452, .025484330977848], [.019720929190419, .025549004257175], [.019637214821078, .025613403927192], [.019553290152943, .02567752929823], [.019469156084779, .025741379683559], [.019384813517595, .025804954399392], [.019300263354632, .025868252764895], [.019215506501354, .025931274102193], [.019130543865439, .025994017736379], [.019045376356769, .026056482995518], [.018960004887419, .026118669210657], [.018874430371648, .026180575715833], [.018788653725892, .026242201848076], [.01870267586875, .026303546947421], [.018616497720974, .026364610356909], [.018530120205464, .026425391422602], [.018443544247254, .026485889493583], [.018356770773502, .026546103921965], [.018269800713483, .026606034062902], [.018182634998576, .026665679274589], [.018095274562256, .026725038918274], [.018007720340083, .026784112358263], [.017919973269692, .026842898961926], [.017832034290785, .026901398099707], [.017743904345116, .026959609145127], [.017655584376488, .027017531474792], [.017567075330734, .027075164468401], [.017478378155718, .02713250750875], [.017389493801313, .027189559981742], [.017300423219401, .027246321276391], [.017211167363854, .027302790784828], [.017121727190533, .02735896790231], [.017032103657269, .027414852027226], [.016942297723858, .027470442561102], [.01685231035205, .027525738908608], [.016762142505537, .027580740477564], [.016671795149944, .027635446678948], [.016581269252819, .0276898569269], [.016490565783622, .02774397063873], [.016399685713714, .027797787234924], [.016308630016347, .027851306139149], [.016217399666655, .02790452677826], [.016125995641641, .027957448582309], [.01603441892017, .028010070984544], [.015942670482954, .028062393421421], [.015850751312545, .02811441533261], [.015758662393324, .028166136160998], [.015666404711489, .028217555352697], [.015573979255046, .028268672357047], [.015481387013797, .028319486626627], [.015388628979331, .028369997617257], [.015295706145012, .028420204788004], [.015202619505968, .028470107601191], [.015109370059084, .028519705522399], [.015015958802984, .028568998020472], [.01492238673803, .028617984567529], [.014828654866302, .028666664638963], [.014734764191593, .028715037713449], [.014640715719398, .028763103272951], [.0145465104569, .028810860802724], [.014452149412962, .028858309791325], [.014357633598114, .028905449730613], [.014262964024545, .028952280115756], [.01416814170609, .02899880044524], [.01407316765822, .029045010220868], [.01397804289803, .029090908947771], [.013882768444231, .029136496134411], [.013787345317136, .029181771292585], [.013691774538648, .029226733937433], [.013596057132255, .029271383587441], [.013500194123014, .029315719764447], [.013404186537539, .029359741993647], [.013308035403995, .029403449803598], [.013211741752084, .029446842726223], [.013115306613032, .02948992029682], [.013018731019584, .029532682054063], [.012922016005985, .029575127540008], [.012825162607977, .029617256300097], [.012728171862781, .029659067883165], [.012631044809089, .029700561841444], [.012533782487056, .029741737730567], [.012436385938281, .029782595109573], [.012338856205805, .029823133540913], [.012241194334091, .029863352590452], [.012143401369021, .029903251827477], [.012045478357878, .029942830824699], [.011947426349339, .029982089158259], [.011849246393462, .030021026407731], [.011750939541676, .030059642156129], [.011652506846768, .030097935989909], [.011553949362874, .030135907498976], [.011455268145464, .030173556276684], [.011356464251335, .030210881919845], [.011257538738598, .030247884028732], [.011158492666665, .030284562207083], [.01105932709624, .030320916062102], [.010960043089307, .03035694520447], [.010860641709118, .030392649248343], [.010761124020182, .030428027811361], [.010661491088253, .030463080514646], [.010561743980319, .030497806982812], [.010461883764593, .030532206843968], [.010361911510496, .030566279729717], [.010261828288652, .030600025275167], [.010161635170872, .030633443118931], [.010061333230142, .030666532903129], [.009960923540617, .030699294273397], [.009860407177603, .030731726878888], [.00975978521755, .030763830372273], [.009659058738038, .03079560440975], [.009558228817767, .030827048651045], [.009457296536545, .030858162759415], [.009356262975275, .030888946401653], [.009255129215945, .030919399248091], [.009153896341616, .030949520972603], [.009052565436412, .030979311252611], [.008951137585505, .031008769769084], [.008849613875105, .031037896206544], [.008747995392451, .031066690253072], [.008646283225794, .031095151600306], [.00854447846439, .031123279943448], [.008442582198486, .031151074981266], [.00834059551931, .031178536416098], [.008238519519057, .031205663953853], [.008136355290878, .031232457304017], [.008034103928871, .031258916179656], [.007931766528065, .031285040297416], [.007829344184412, .031310829377528], [.007726837994772, .031336283143813], [.007624249056906, .03136140132368], [.007521578469457, .031386183648135], [.007418827331946, .031410629851778], [.007315996744755, .031434739672811], [.007213087809115, .031458512853036], [.007110101627101, .031481949137863], [.00700703930161, .031505048276306], [.006903901936357, .031527810020993], [.006800690635862, .031550234128164], [.006697406505433, .031572320357675], [.006594050651161, .031594068473], [.006490624179905, .031615478241233], [.006387128199278, .031636549433095], [.006283563817639, .031657281822929], [.00617993214408, .031677675188707], [.006076234288412, .031697729312034], [.005972471361157, .031717443978146], [.005868644473532, .031736818975914], [.00576475473744, .031755854097848], [.005660803265456, .031774549140098], [.005556791170816, .031792903902453], [.005452719567407, .03181091818835], [.005348589569753, .031828591804869], [.005244402293001, .031845924562742], [.005140158852914, .031862916276347], [.005035860365855, .031879566763717], [.004931507948778, .031895875846539], [.004827102719212, .031911843350155], [.004722645795254, .031927469103567], [.004618138295554, .031942752939435], [.004513581339303, .031957694694082], [.004408976046222, .031972294207493], [.004304323536549, .03198655132332], [.00419962493103, .032000465888879], [.004094881350902, .032014037755158], [.003990093917884, .032027266776813], [.003885263754166, .03204015281217], [.003780391982394, .032052695723232], [.003675479725661, .032064895375674], [.003570528107494, .032076751638847], [.003465538251839, .03208826438578], [.003360511283053, .032099433493181], [.003255448325892, .032110258841438], [.003150350505494, .032120740314619], [.003045218947373, .032130877800478], [.002940054777404, .032140671190449], [.00283485912181, .032150120379653], [.002729633107153, .032159225266897], [.002624377860318, .032167985754674], [.002519094508504, .032176401749168], [.002413784179212, .03218447316025], [.002308448000231, .032192199901481], [.002203087099626, .032199581890114], [.002097702605728, .032206619047093], [.001992295647121, .032213311297057], [.001886867352628, .032219658568338], [.001781418851302, .03222566079296], [.00167595127241, .032231317906644], [.001570465745428, .032236629848809], [.001464963400018, .032241596562566], [.001359445366028, .032246217994727], [.00125391277347, .032250494095799], [.001148366752513, .03225442481999], [.001042808433471, .032258010125204], [.000937238946789, .032261249973045], [.00083165942303, .032264144328817], [.000726070992868, .032266693161525], [.000620474787068, .032268896443871], [.000514871936481, .032270754152261], [.00040926357203, .032272266266801], [.000303650824695, .032273432771295], [.000198034825504, .032274253653254], [92416705518e-15, .032274728903884]],
        t.MDCT_TABLE_240 = [[.091286604111815, .000298735779793], [.091247502481454, .002688238127538], [.091145864370807, .005075898091152], [.090981759437558, .00746007928776], [.09075530015103, .009839147718664], [.090466641715108, .012211472889198], [.090115981961863, .014575428926191], [.089703561215976, .016929395692256], [.089229662130024, .019271759896156], [.088694609490769, .02160091619847], [.088098769996564, .02391526831181], [.087442552006035, .026213230094844], [.086726405258214, .028493226639351], [.085950820564309, .030753695349588], [.085116329471329, .032993087013213], [.084223503897785, .035209866863042], [.083272955741727, .037402515628894], [.082265336461381, .039569530578832], [.08120133662867, .041709426549053], [.08008168545593, .043820736961749], [.078907150296148, .045902014830227], [.077678536117054, .047951833750597], [.076396684949434, .049968788879362], [.07506247531005, .051951497896226], [.073676821599542, .053898601951466], [.072240673475749, .055808766597225], [.070755015202858, .057680682702068], [.06922086497684, .059513067348201], [.067639274227625, .061304664710718], [.066011326898512, .063054246918278], [.064338138703282, .06476061489463], [.062620856361546, .066422599180399], [.060860656812842, .068039060734572], [.059058746410016, .069608891715145], [.05721636009245, .071131016238378], [.055334760539699, .072604391116154], [.053415237306106, .07402800657093], [.051459105937014, .075400886927784], [.049467707067153, .076722091283096], [.047442405501835, .077990714149396], [.045384589281588, .079205886075941], [.043295668730857, .080366774244592], [.041177075491445, .081472583040586], [.039030261541332, .08252255459781], [.036856698199564, .083515969318206], [.034657875117883, .084452146364948], [.032435299259796, .085330444129049], [.030190493867775, .086150260669096], [.027924997419306, .086911034123781], [.025640362572491, .087612243096981], [.023338155101933, .088253407015092], [.021019952825636, .08883408645639], [.018687344523641, .089353883452193], [.016341928849164, .089812441759604], [.013985313232951, .090209447105664], [.011619112781631, .09054462740274], [.009244949170797, .090817752935], [.006864449533597, .091028636515846], [.004479245345574, .091177133616206], [.002090971306534, .091263142463585]]
    }
    , function(e, t, n) {
        "use strict";
        function r(e) {
            switch (this.length = e) {
            case 64:
                this.roots = i(64);
                break;
            case 512:
                this.roots = a(512);
                break;
            case 60:
                this.roots = i(60);
                break;
            case 480:
                this.roots = a(480);
                break;
            default:
                throw new Error("unexpected FFT length: " + e)
            }
            this.rev = new Array(e);
            for (var t = 0; t < e; t++)
                this.rev[t] = new Float32Array(2);
            this.a = new Float32Array(2),
            this.b = new Float32Array(2),
            this.c = new Float32Array(2),
            this.d = new Float32Array(2),
            this.e1 = new Float32Array(2),
            this.e2 = new Float32Array(2)
        }
        function i(e) {
            for (var t = 2 * Math.PI / e, n = Math.cos(t), r = Math.sin(t), i = new Array(e), a = 0; a < e; a++)
                i[a] = new Float32Array(2);
            i[0][0] = 1;
            for (var o = i[0][1] = 0, s = 1; s < e; s++)
                i[s][0] = i[s - 1][0] * n + o * r,
                o = o * n - i[s - 1][0] * r,
                i[s][1] = -o;
            return i
        }
        function a(e) {
            for (var t = 2 * Math.PI / e, n = Math.cos(t), r = Math.sin(t), i = new Array(e), a = 0; a < e; a++)
                i[a] = new Float32Array(3);
            i[0][0] = 1,
            i[0][1] = 0,
            i[0][2] = 0;
            for (var o = 1; o < e; o++)
                i[o][0] = i[o - 1][0] * n + i[o - 1][2] * r,
                i[o][2] = i[o - 1][2] * n - i[o - 1][0] * r,
                i[o][1] = -i[o][2];
            return i
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        r.prototype.process = function(e, t) {
            for (var n = this.length, r = t ? 2 : 1, i = t ? n : 1, a = this.rev, o = this.roots, s = 0, u = 0; u < n; u++) {
                a[u][0] = e[s][0],
                a[u][1] = e[s][1];
                for (var f = n >>> 1; f <= s && 0 < f; )
                    s -= f,
                    f >>= 1;
                s += f
            }
            for (var l = this.a, c = this.b, d = this.c, h = this.d, p = this.e1, v = this.e2, y = 0; y < n; y++)
                e[y][0] = a[y][0],
                e[y][1] = a[y][1];
            for (var m = 0; m < n; m += 4)
                l[0] = e[m][0] + e[m + 1][0],
                l[1] = e[m][1] + e[m + 1][1],
                c[0] = e[m + 2][0] + e[m + 3][0],
                c[1] = e[m + 2][1] + e[m + 3][1],
                d[0] = e[m][0] - e[m + 1][0],
                d[1] = e[m][1] - e[m + 1][1],
                h[0] = e[m + 2][0] - e[m + 3][0],
                h[1] = e[m + 2][1] - e[m + 3][1],
                e[m][0] = l[0] + c[0],
                e[m][1] = l[1] + c[1],
                e[m + 2][0] = l[0] - c[0],
                e[m + 2][1] = l[1] - c[1],
                p[0] = d[0] - h[1],
                p[1] = d[1] + h[0],
                v[0] = d[0] + h[1],
                v[1] = d[1] - h[0],
                e[m + 3][1] = t ? (e[m + 1][0] = v[0],
                e[m + 1][1] = v[1],
                e[m + 3][0] = p[0],
                p[1]) : (e[m + 1][0] = p[0],
                e[m + 1][1] = p[1],
                e[m + 3][0] = v[0],
                v[1]);
            for (var b = 4; b < n; b <<= 1)
                for (var w = b << 1, g = n / w, _ = 0; _ < n; _ += w)
                    for (var k = 0; k < b; k++) {
                        var I = k * g
                          , E = o[I][0]
                          , S = o[I][r]
                          , T = e[b + _ + k][0] * E - e[b + _ + k][1] * S
                          , O = e[b + _ + k][0] * S + e[b + _ + k][1] * E;
                        e[b + _ + k][0] = (e[_ + k][0] - T) * i,
                        e[b + _ + k][1] = (e[_ + k][1] - O) * i,
                        e[_ + k][0] = (e[_ + k][0] + T) * i,
                        e[_ + k][1] = (e[_ + k][1] + O) * i
                    }
        }
        ,
        t.default = r,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = function() {
            function e(t) {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.canvas = t.canvas,
                this.context = this.canvas.getContext("2d"),
                this.canvas.width = this.width = t.width,
                this.canvas.height = this.height = t.height
            }
            return r(e, [{
                key: "render",
                value: function(e) {
                    this.context.putImageData(e, 0, 0)
                }
            }]),
            e
        }();
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }()
          , i = function() {
            function e(t) {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.options = t,
                this.context = e.CachedContext = e.CachedContext || new (window.AudioContext || window.webkitAudioContext),
                this.gain = this.context.createGain(),
                this.destination = this.gain,
                this.gain.connect(this.context.destination),
                this.context._connections = (this.context._connections || 0) + 1,
                this.startTime = 0,
                this.buffer = null,
                this.wallclockStartTime = 0,
                this.volume = 1,
                this.enabled = !0,
                Object.defineProperty(this, "enqueuedTime", {
                    get: this.getEnqueuedTime
                })
            }
            return r(e, [{
                key: "destroy",
                value: function() {
                    this.gain.disconnect(),
                    this.context._connections--,
                    0 === this.context._connections && (this.context.close(),
                    e.CachedContext = null)
                }
            }, {
                key: "play",
                value: function(e) {
                    var t = this.options
                      , n = t.sampleRate
                      , r = t.channelCount;
                    if (this.enabled) {
                        this.gain.gain.value = this.volume;
                        for (var i = this.context.createBuffer(2, e.length / 2, n), a = new Array(r), o = 0; o < r; o++)
                            a[o] = i.getChannelData(o);
                        for (var s = 0; s < i.length; s++)
                            for (var u = 0; u < r; u++)
                                a[u][s] = e[s * r + u];
                        var f = this.context.createBufferSource();
                        f.buffer = i,
                        f.connect(this.destination);
                        var l = this.context.currentTime
                          , c = i.duration;
                        this.startTime < l && (this.startTime = l,
                        this.wallclockStartTime = performance.now() / 1e3),
                        f.start(this.startTime),
                        this.startTime += c,
                        this.wallclockStartTime += c
                    }
                }
            }, {
                key: "stop",
                value: function() {}
            }, {
                key: "getEnqueuedTime",
                value: function() {
                    return Math.max(this.wallclockStartTime - performance.now() / 1e3, 0)
                }
            }, {
                key: "resetEnqueuedTime",
                value: function() {
                    this.startTime = this.context.currentTime,
                    this.wallclockStartTime = performance.now() / 1e3
                }
            }]),
            e
        }();
        i.IsSupported = function() {
            return window.AudioContext || window.webkitAudioContext
        }
        ,
        t.default = i,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r, i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n),
                r && e(t, r),
                t
            }
        }(), a = (r = n(4)) && r.__esModule ? r : {
            default: r
        }, o = 0, s = function(e) {
            function t() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t);
                var e = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return e._url = "",
                e._receivedLength = 0,
                e._status = o,
                e.requestAbort = !1,
                e._cacheBufferList = [],
                e
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, a.default),
            i(t, [{
                key: "open",
                value: function(e) {
                    var t = this;
                    this._url = e,
                    this._status = 1,
                    window.fetch(this._url).then(function(e) {
                        if (e.ok && 200 <= e.status && e.status <= 299)
                            return t._pump.call(t, e.body.getReader());
                        t._status = 3
                    }).catch(function(e) {
                        t._status = 3
                    })
                }
            }, {
                key: "pause",
                value: function() {
                    this.requestAbort = !0
                }
            }, {
                key: "_pump",
                value: function(e) {
                    var t = this;
                    return e.read().then(function(n) {
                        if (n.done)
                            t._status = 4;
                        else {
                            if (!0 === t.requestAbort)
                                return t.requestAbort = !1,
                                e.cancel();
                            t._status = 2;
                            var r = n.value.buffer
                              , i = t._receivedLength;
                            t._receivedLength += r.byteLength,
                            t._cacheBufferList.push(r),
                            t.emit("dataArrival", {
                                chunk: r,
                                byteStart: i,
                                byteLength: r.byteLength
                            }),
                            t._pump(e)
                        }
                    }).catch(function(e) {
                        console.error(e)
                    })
                }
            }]),
            t
        }();
        t.default = s,
        e.exports = t.default
    }
    , function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = {
            concat: function() {
                for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
                    t[n] = arguments[n];
                var r = t.reduce(function(e, t) {
                    return e + t.byteLength
                }, 0)
                  , i = new Uint8Array(r)
                  , a = 0;
                return t.forEach(function(e) {
                    i.set(new Uint8Array(e), a),
                    a += e.byteLength
                }),
                i.buffer
            },
            readUInt32BE: function(e, t) {
                var n = new Uint8Array(e);
                return n[t] << 24 | n[t + 1] << 16 | n[t + 2] << 8 | n[t + 3]
            },
            readUInt24BE: function(e, t) {
                var n = new Uint8Array(e);
                return n[t] << 16 | n[t + 1] << 8 | n[t + 2]
            },
            readUInt16BE: function(e, t) {
                var n = new Uint8Array(e);
                return n[t] << 8 | n[t + 1]
            },
            readUInt8: function(e, t) {
                return new Uint8Array(e)[t]
            },
            readToString: function(e) {
                var t = new Uint8Array(e)
                  , n = String.fromCharCode.apply(String, function(e) {
                    if (Array.isArray(e)) {
                        for (var t = 0, n = Array(e.length); t < e.length; t++)
                            n[t] = e[t];
                        return n
                    }
                    return Array.from(e)
                }(t));
                return decodeURIComponent(escape(n))
            },
            readDate: function(e, t) {
                return new Date(1e3 * r.readUInt32BE(e, t) - 20828448e5)
            },
            readFixed32: function(e, t) {
                return r.readUInt16BE(e, t) + r.readUInt16BE(e, t + 2) / 65536
            },
            readFixed16: function(e, t) {
                return r.readUInt8(e, t) + r.readUInt8(e, t + 1) / 256
            }
        };
        t.default = r,
        e.exports = t.default
    }
    ])
});
