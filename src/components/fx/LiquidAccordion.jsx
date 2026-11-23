import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

const PAD = 14
const R = 20

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uCard;
uniform vec4 uBox[2];uniform float uBoxR[2];uniform vec4 uSat[4];uniform vec4 uRip[6];uniform vec3 uMouse;uniform vec3 uFront;
uniform float uDark;uniform float uAmb;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;
 for(int i=0;i<2;i++){vec4 B=uBox[i];if(B.z>.5){vec2 q=p;
  if(i==int(uFront.z)){float f=exp(-pow(q.y-uFront.x,2.)/260.);q.y+=f*uFront.y*(sin(q.x*.075+uTime*6.)+.5*sin(q.x*.19-uTime*4.3));}
  d=smin(d,sdRB(q-B.xy,B.zw,uBoxR[i]),13.);}}
 for(int i=0;i<4;i++){vec4 S=uSat[i];if(S.z>.5){d=smin(d,length(p-S.xy)-S.z,13.);}}
 return d;}
float cardD(vec2 p){vec2 h=uCard.zw*.5;return sdRB(p-uCard.xy-h,h,28.);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1400.);
 w+=uAmb*(sin(p.x*.04+p.y*.02+uTime*1.1)*.45+sin(p.x*.11-uTime*.8+p.y*.13)*.25);return w;}
float H(vec2 p){float dc=cardD(p);return lens(dc,18.)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,9.,-dc);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=cardD(p);if(dp>16.){gl_FragColor=vec4(0.);return;}
 float dd=dropD(p);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+fres*.85+p.x*.0028+p.y*.0015+uTime*.035));
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dropD(p-vec2(0.,5.)))*(1.-dm)*pm*(.11+.07*uDark);
 vec3 c=vec3(0.,.14,.36)*sh;float a=sh;
 float pa=clamp(pm*(fres*.5+spec*.9+spec2),0.,1.);
 c=mix(vec3(1.),irid,.5*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 tint=mix(vec3(.82,.94,1.),vec3(.52,.80,1.),uDark);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.24+.14*body)*(1.-.35*uDark);vec3 dc=mix(tint,vec3(1.),body*.6);
 float la=rim*.20;vec3 lc=mix(vec3(0.,.42,.82),vec3(.12,.56,.96),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*.26*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.38;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`

const makeBox = () => ({ x: 0, y: 0, w: 0, h: 0, vx: 0, vy: 0, vw: 0, vh: 0 })

function makeState() {
  return {
    a: makeBox(),
    b: makeBox(),
    lead: 0,
    lagUntil: 0,
    sats: [],
    rips: [],
    mouse: { x: 0, y: 0, s: 0, on: false },
    open: null,
    lastIdx: 0,
    moving: false,
    split: false,
    ready: false,
    w: 0,
    h: 0,
    ch: 0,
    visible: true,
    reduce: false,
    raf: 0,
    last: 0,
    time: 0,
    glc: null,
  }
}

function initGL(canvas) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
  if (!gl) return null
  const sh = (type, src) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = sh(gl.VERTEX_SHADER, VERT)
  const fs = sh(gl.FRAGMENT_SHADER, FRAG)
  const p = gl.createProgram()
  if (!vs || !fs || !p) return null
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null
  gl.useProgram(p)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(p, 'a')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const u = {}
  for (const n of ['uRes', 'uDpr', 'uTime', 'uCard', 'uBox', 'uBoxR', 'uSat', 'uRip', 'uMouse', 'uFront', 'uDark', 'uAmb']) {
    u[n] = gl.getUniformLocation(p, n)
  }
  return { gl, u }
}

/**
 * Nimbus WebGL Liquid Water-Drop Accordion (adaptasi 21st.dev id:44747).
 * Tetesan kaca cair mengalir mengikuti baris yang dibuka, beriak saat disentuh kursor,
 * dengan fallback CSS halus dan dukungan penuh prefers-reduced-motion serta tema Light/Dark.
 */
export default function LiquidAccordion({ items = [], defaultOpen = 0, className = '' }) {
  const [current, setCurrent] = useState(defaultOpen)
  const [tone, setTone] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const uid = useId().replace(/:/g, '')
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const poolRef = useRef(null)
  const itemRefs = useRef([])
  const btnRefs = useRef([])
  const iconRefs = useRef([])
  const st = useRef(makeState())
  const [glMode, setGlMode] = useState('on')
  const [fx, setFx] = useState({ i: -1, n: 0 })
  const darkRef = useRef(tone === 'dark' ? 1 : 0)
  darkRef.current = tone === 'dark' ? 1 : 0

  const target = useCallback(() => {
    const s = st.current
    const root = rootRef.current
    if (!root) return null
    if (s.open !== null) {
      const el = itemRefs.current[s.open]
      if (!el) return null
      return {
        x: PAD + s.w / 2,
        y: PAD + el.offsetTop + el.offsetHeight / 2,
        w: s.w / 2 - 8,
        h: Math.max(4, el.offsetHeight / 2 - 1),
      }
    }
    const ic = iconRefs.current[s.lastIdx]
    if (!ic) return null
    const r = root.getBoundingClientRect()
    const b = ic.getBoundingClientRect()
    return { x: PAD + b.left - r.left + b.width / 2, y: PAD + b.top - r.top + b.height / 2, w: 0, h: 0 }
  }, [])

  const draw = useCallback(() => {
    const s = st.current
    const head = s.lead === 0 ? s.a : s.b
    const tail = s.lead === 0 ? s.b : s.a
    const gap = Math.abs(head.y - tail.y) - (head.h + tail.h)
    const thin = Math.max(0, Math.min(1, (gap + 80) / 70))
    const shape = (B, k) => {
      const w = B.w * (1 - k * thin)
      const h = B.h
      const r = Math.max(0, Math.min(R + (Math.min(w, h) - R) * thin, w, h))
      return { w, h, r }
    }
    const hs = shape(head, 0.22)
    const ts = shape(tail, 0.5)

    if (s.glc) {
      const { gl: c, u } = s.glc
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      c.viewport(0, 0, c.drawingBufferWidth, c.drawingBufferHeight)
      c.uniform2f(u.uRes, s.w + PAD * 2, s.ch)
      c.uniform1f(u.uDpr, dpr)
      c.uniform1f(u.uTime, s.time)
      c.uniform4f(u.uCard, PAD, PAD, s.w, s.h)
      const on = (B) => B.w > 1 && B.h > 1
      c.uniform4fv(
        u.uBox,
        new Float32Array([head.x, head.y, on(hs) ? hs.w : 0, hs.h, tail.x, tail.y, on(ts) ? ts.w : 0, ts.h]),
      )
      c.uniform1fv(u.uBoxR, new Float32Array([hs.r, ts.r]))
      const sats = new Float32Array(16)
      s.sats.slice(0, 4).forEach((d, i) => sats.set([d.x, d.y, d.r, 0], i * 4))
      c.uniform4fv(u.uSat, sats)
      const rips = new Float32Array(24)
      s.rips.slice(-6).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4))
      c.uniform4fv(u.uRip, rips)
      c.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s)
      c.uniform3f(u.uFront, head.y + head.h, s.reduce ? 0 : Math.min(Math.abs(head.vh) * 0.012, 4.5), 0)
      c.uniform1f(u.uDark, darkRef.current)
      c.uniform1f(u.uAmb, s.reduce ? 0 : 1)
      c.clearColor(0, 0, 0, 0)
      c.clear(c.COLOR_BUFFER_BIT)
      c.drawArrays(c.TRIANGLES, 0, 3)
    } else if (poolRef.current) {
      const p = poolRef.current
      const T = target()
      if (s.open !== null && T) {
        p.style.opacity = '1'
        p.style.height = `${T.h * 2}px`
        p.style.transform = `translateY(${T.y - T.h - PAD}px)`
      } else {
        p.style.opacity = '0'
      }
    }
  }, [target])

  const step = useCallback(
    (dt, now) => {
      const s = st.current
      s.time += dt
      const T = target()
      let still = true
      if (T) {
        const bodies = [s.a, s.b]
        if (s.reduce) {
          for (const B of bodies) Object.assign(B, T, { vx: 0, vy: 0, vw: 0, vh: 0 })
          s.sats = []
        } else {
          bodies.forEach((B, i) => {
            const lead = i === s.lead
            const k = lead ? 210 : 60
            const c = lead ? 25 : 13
            const f = !lead && now < s.lagUntil ? 0.04 : 1
            const kh = lead ? 260 : 90
            B.vx += (k * (T.x - B.x) - c * B.vx) * dt * f
            B.vy += (k * (T.y - B.y) - c * B.vy) * dt * f
            B.vw += (k * (T.w - B.w) - c * B.vw) * dt * f
            B.vh += (kh * (T.h - B.h) - (lead ? 22 : 14) * B.vh) * dt * f
            B.x += B.vx * dt
            B.y += B.vy * dt
            B.w += B.vw * dt
            B.h += B.vh * dt
            B.w = Math.max(0, B.w)
            B.h = Math.max(0, B.h)
            if (Math.abs(T.y - B.y) > 0.3 || Math.abs(T.h - B.h) > 0.3 || Math.abs(T.w - B.w) > 0.3 || Math.abs(B.vy) + Math.abs(B.vh) > 3) {
              still = false
            }
          })
          const head = bodies[s.lead]
          const tail = bodies[1 - s.lead]
          const gap = Math.abs(head.y - tail.y) - (head.h + tail.h)
          if (!s.split && s.moving && gap > 4 && s.open !== null) {
            s.split = true
            const top = Math.min(head.y, tail.y) + (head.y < tail.y ? head.h : tail.h)
            ;[0.25, 0.55, 0.85].forEach((t, j) => {
              s.sats.push({
                x: head.x + (Math.random() - 0.5) * s.w * 0.35,
                y: top + gap * t,
                vx: (Math.random() - 0.5) * 80,
                vy: (head.vy + tail.vy) * 0.4,
                r: 9 - j * 1.5 + Math.random() * 2,
                k: 60 + Math.random() * 80,
              })
            })
          }
          s.sats = s.sats.filter((d) => {
            d.vx += (25 * (head.x - d.x) - 6 * d.vx) * dt
            d.vy += (d.k * (head.y - d.y) - 9 * d.vy) * dt
            d.x += d.vx * dt
            d.y += d.vy * dt
            if (Math.abs(head.y - d.y) < head.h * 0.85 || head.h < 6) d.r -= dt * 30
            return d.r > 0.6
          })
          if (s.sats.length) still = false
        }
        if (s.moving && still) {
          s.moving = false
          if (!s.reduce && s.open !== null) s.rips.push({ x: T.x, y: T.y - T.h + 22, age: 0, amp: s.split ? 1.1 : 0.6 })
        }
      }
      s.rips.forEach((p) => (p.age += dt))
      s.rips = s.rips.filter((p) => p.age < 2.4)
      s.mouse.s += ((s.mouse.on ? 1 : 0) - s.mouse.s) * Math.min(1, dt * 7)
    },
    [target],
  )

  const loop = useCallback(() => {
    const s = st.current
    if (s.raf) return
    s.last = performance.now()
    const tick = (now) => {
      const dt = Math.min((now - s.last) / 1000, 1 / 30)
      s.last = now
      step(dt, now)
      draw()
      const busy = s.moving || s.rips.length || s.sats.length || s.mouse.s > 0.01
      if (s.visible && (!s.reduce || busy)) s.raf = requestAnimationFrame(tick)
      else s.raf = 0
    }
    s.raf = requestAnimationFrame(tick)
  }, [draw, step])

  const resize = useCallback(() => {
    const root = rootRef.current
    const cv = canvasRef.current
    if (!root) return
    const s = st.current
    s.w = root.offsetWidth
    s.h = root.offsetHeight
    if (cv) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const W = s.w + PAD * 2
      const Hc = Math.ceil((s.h + PAD * 2) / 96) * 96
      if (Hc !== s.ch || cv.width !== Math.round(W * dpr)) {
        s.ch = Hc
        cv.width = Math.round(W * dpr)
        cv.height = Math.round(Hc * dpr)
        cv.style.width = `${W}px`
        cv.style.height = `${Hc}px`
      }
    }
    if (!s.ready) {
      const T = target()
      if (T) {
        Object.assign(s.a, T)
        Object.assign(s.b, T)
        s.ready = true
      }
    }
    loop()
  }, [loop, target])

  useEffect(() => {
    const s = st.current
    s.reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const cv = canvasRef.current
    s.glc = cv ? initGL(cv) : null
    if (!s.glc) setGlMode('off')
    const lost = (e) => {
      e.preventDefault()
      s.glc = null
      setGlMode('off')
    }
    cv?.addEventListener('webglcontextlost', lost)
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting
      if (s.visible) loop()
    })
    if (rootRef.current) io.observe(rootRef.current)
    const vis = () => {
      s.visible = document.visibilityState === 'visible'
      if (s.visible) loop()
    }
    document.addEventListener('visibilitychange', vis)
    let roRaf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(roRaf)
      roRaf = requestAnimationFrame(() => resize())
    })
    if (rootRef.current) ro.observe(rootRef.current)

    const themeObs = new MutationObserver(() => {
      setTone(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
    })
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cv?.removeEventListener('webglcontextlost', lost)
      io.disconnect()
      ro.disconnect()
      themeObs.disconnect()
      document.removeEventListener('visibilitychange', vis)
      cancelAnimationFrame(roRaf)
      cancelAnimationFrame(s.raf)
      s.raf = 0
    }
  }, [loop, resize])

  useLayoutEffect(() => {
    const s = st.current
    if (!s.ready) {
      s.open = current
      if (current !== null) s.lastIdx = current
      resize()
      return
    }
    if (s.open === current) return
    const from = s.open
    s.open = current
    if (current !== null) {
      s.lastIdx = current
      if (from === null) {
        const ic = iconRefs.current[current]
        const root = rootRef.current
        if (ic && root) {
          const r = root.getBoundingClientRect()
          const b = ic.getBoundingClientRect()
          const x = PAD + b.left - r.left + b.width / 2
          const y = PAD + b.top - r.top + b.height / 2
          for (const B of [s.a, s.b]) Object.assign(B, { x, y, w: 0, h: 0, vx: 0, vy: 0, vw: 0, vh: 0 })
        }
      }
    }
    const T = target()
    if (T) s.lead = Math.abs(T.y - s.a.y) <= Math.abs(T.y - s.b.y) ? 0 : 1
    s.lagUntil = performance.now() + (from === null || current === null ? 0 : 120)
    s.moving = true
    s.split = false
    loop()
  }, [current, loop, resize, target])

  useEffect(() => {
    loop()
  }, [tone, items.length, loop])

  const local = (clientX, clientY) => {
    const r = rootRef.current?.getBoundingClientRect()
    return r ? { x: clientX - r.left + PAD, y: clientY - r.top + PAD } : { x: 0, y: 0 }
  }

  const toggle = (i) => {
    const next = current === i ? null : i
    if (next !== null) setFx((f) => ({ i, n: f.n + 1 }))
    setCurrent(next)
  }

  const onKeyDown = (e, i) => {
    const n = items.length
    let j = -1
    if (e.key === 'ArrowDown') j = (i + 1) % n
    else if (e.key === 'ArrowUp') j = (i - 1 + n) % n
    else if (e.key === 'Home') j = 0
    else if (e.key === 'End') j = n - 1
    if (j < 0) return
    e.preventDefault()
    btnRefs.current[j]?.focus()
  }

  return (
    <div
      ref={rootRef}
      className={`lacc ${className}`.trim()}
      data-tone={tone}
      data-gl={glMode}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const s = st.current
        const p = local(e.clientX, e.clientY)
        s.mouse.x = p.x
        s.mouse.y = p.y
        s.mouse.on = true
        loop()
      }}
      onPointerLeave={() => {
        st.current.mouse.on = false
        loop()
      }}
      onPointerDown={(e) => {
        const s = st.current
        if (s.reduce) return
        const p = local(e.clientX, e.clientY)
        s.rips.push({ x: p.x, y: p.y, age: 0, amp: 0.7 })
        loop()
      }}
    >
      <span className="lacc__glass" aria-hidden="true" />
      <canvas className="lacc__water" ref={canvasRef} aria-hidden="true" />
      <span className="lacc__pool" ref={poolRef} aria-hidden="true" />
      {items.map((it, i) => {
        const isOpen = current === i
        const base = `${uid}-${it.key ?? i}`
        return (
          <div className="lacc__item" key={it.key ?? i} data-open={isOpen} ref={(el) => (itemRefs.current[i] = el)}>
            <h4 className="lacc__h">
              <button
                ref={(el) => (btnRefs.current[i] = el)}
                type="button"
                id={`${base}-q`}
                className="lacc__q"
                aria-expanded={isOpen}
                aria-controls={`${base}-a`}
                onClick={() => toggle(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span className="lacc__qt">
                  <span className="lacc__title">{it.title}</span>
                  <span className="lacc__sub">{it.sub}</span>
                </span>
                {it.tag && <span className="lacc__tag">{it.tag}</span>}
                <span
                  className="lacc__ico"
                  aria-hidden="true"
                  key={fx.i === i ? fx.n : 0}
                  data-fx={fx.i === i ? 'drip' : undefined}
                  ref={(el) => (iconRefs.current[i] = el)}
                />
              </button>
            </h4>
            <div className="lacc__panel" id={`${base}-a`} role="region" aria-labelledby={`${base}-q`}>
              <div className="lacc__inner">
                <div className="lacc__a">{it.desc}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
