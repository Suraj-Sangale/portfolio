import { useEffect, useRef } from "react";
import Header from "../header";
import SocialIcons from "./socialIcons";
import Link from "next/link";
import { trackEvent } from "@/utilities/analytics";


export default function DevFolio({ pageData }) {
  const canvasRef = useRef(null);
  const commitRef = useRef(null);
  const dotRef = useRef(null);
  const glowRef = useRef(null);
  const mxRef = useRef(0);
  const myRef = useRef(0);
  const gxRef = useRef(0);
  const gyRef = useRef(0);

  const { newData = {}, socialLinks = [] } = pageData;

  useEffect(() => {
    // Inject styles
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Load external scripts sequentially
    const loadScript = (src) =>
      new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        document.head.appendChild(s);
      });

    let cleanup = () => {};

    (async () => {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
      );

      const THREE = window.THREE;
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // ── CURSOR ──
      const dot = dotRef.current;
      const glow = glowRef.current;
      const onMouseMove = (e) => {
        mxRef.current = e.clientX;
        myRef.current = e.clientY;
        if (dot) {
          dot.style.left = e.clientX + "px";
          dot.style.top = e.clientY + "px";
        }
      };
      document.addEventListener("mousemove", onMouseMove);

      let rafCursor;
      const loopCursor = () => {
        gxRef.current += (mxRef.current - gxRef.current) * 0.1;
        gyRef.current += (myRef.current - gyRef.current) * 0.1;
        if (glow) {
          glow.style.left = gxRef.current + "px";
          glow.style.top = gyRef.current + "px";
        }
        rafCursor = requestAnimationFrame(loopCursor);
      };
      loopCursor();

      document
        .querySelectorAll("a,.bento,.glowbtn,.nav-btn,.chip,.role-badge")
        .forEach((el) => {
          el.addEventListener("mouseenter", () => {
            dot?.classList.add("big");
            glow?.classList.add("big");
          });
          el.addEventListener("mouseleave", () => {
            dot?.classList.remove("big");
            glow?.classList.remove("big");
          });
        });

      // ── COMMIT COUNTER ──
      const counterEl = commitRef.current;
      let count = 0,
        target = newData.hero.commitTarget;
      setTimeout(() => {
        const interval = setInterval(() => {
          count += Math.ceil((target - count) / 12);
          if (count >= target) {
            count = target;
            clearInterval(interval);
          }
          if (counterEl) counterEl.textContent = String(count).padStart(4, "0");
        }, 40);
      }, 1800);

      // ── TECH ORBIT DOTS ──
      const techs = [
        { label: "React", r: 130, angle: 0 },
        { label: "Next", r: 130, angle: 72 },
        { label: "Node", r: 130, angle: 144 },
        { label: "JS", r: 130, angle: 216 },
        { label: "TS", r: 130, angle: 288 },
        { label: "Mongo", r: 80, angle: 30 },
        { label: "PG", r: 80, angle: 150 },
        { label: "Redis", r: 80, angle: 270 },
      ];
      const orbit = document.querySelector(".tech-orbit");
      if (orbit) {
        techs.forEach((t) => {
          const el = document.createElement("div");
          el.className = "tech-dot";
          el.textContent = t.label;
          const rad = (t.angle * Math.PI) / 180;
          el.style.left = 170 + Math.cos(rad) * t.r - 22 + "px";
          el.style.top = 170 + Math.sin(rad) * t.r - 22 + "px";
          el.style.position = "absolute";
          orbit.appendChild(el);
        });
      }

      // ── THREE.JS ──
      const canvas = canvasRef.current;
      if (!canvas) return;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        70,
        innerWidth / innerHeight,
        0.01,
        2000,
      );
      camera.position.set(0, 0, 6);

      const auroraVert = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
      const auroraFrag = `uniform float uTime;uniform float uScroll;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}float fbm(vec2 p){float v=0.;float a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.1+vec2(1.7,9.2);a*=.5;}return v;}void main(){vec2 uv=vUv;float t=uTime*.18+uScroll*2.;vec2 warp=vec2(fbm(uv*2.+t),fbm(uv*2.+vec2(5.2,1.3)+t*.7));vec2 wuv=uv+warp*.35;float n=fbm(wuv*3.+t*.5);float n2=fbm(wuv*5.-t*.3);float n3=fbm(wuv*1.5+t*.2+vec2(9.,3.));float band=smoothstep(.2,.8,sin(wuv.y*3.14159+n*2.+t*.5)*.5+.5);band*=smoothstep(.0,.5,uv.x)*smoothstep(1.,.5,uv.x)*smoothstep(.0,.3,uv.y)*smoothstep(1.,.7,uv.y);vec3 col1=vec3(0.,.96,1.);vec3 col2=vec3(.46,.0,1.);vec3 col3=vec3(1.,0.,.43);vec3 col4=vec3(.02,.84,.63);vec3 col=mix(col1,col2,n);col=mix(col,col3,n2*.6);col=mix(col,col4,n3*.3);float alpha=band*(n*.7+.3)*0.55+fbm(uv*8.+t*.8)*.03;gl_FragColor=vec4(col*1.4,alpha);}`;

      const mkAurora = (pz, rz) => {
        const geo = new THREE.PlaneGeometry(28, 16, 1, 1);
        const mat = new THREE.ShaderMaterial({
          vertexShader: auroraVert,
          fragmentShader: auroraFrag,
          uniforms: { uTime: { value: pz * 0.5 }, uScroll: { value: 0 } },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const m = new THREE.Mesh(geo, mat);
        m.position.z = pz;
        m.rotation.z = rz;
        scene.add(m);
        return { mesh: m, mat };
      };
      const aA = mkAurora(-8, 0);
      const aB = mkAurora(-18, 0.15);

      const rings = [];
      for (let i = 0; i < 80; i++) {
        const t = i / 80,
          radius = 2.8 + Math.sin(t * Math.PI * 6) * 0.5;
        const geo = new THREE.TorusGeometry(radius, 0.005 + t * 0.003, 6, 100);
        const hue = (t * 360 + 200) % 360;
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(`hsl(${hue},80%,65%)`),
          transparent: true,
          opacity: 0.15 + t * 0.25,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const ring = new THREE.Mesh(geo, mat);
        ring.position.z = -i * 1.8;
        ring.rotation.x = (Math.random() - 0.5) * 0.5;
        ring.rotation.y = (Math.random() - 0.5) * 0.5;
        scene.add(ring);
        rings.push({ mesh: ring, baseRotZ: Math.random() * Math.PI * 2, hue });
      }

      const makeStar = (count, spread, size, col) => {
        const geo = new THREE.BufferGeometry();
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          p[i * 3] = (Math.random() - 0.5) * spread;
          p[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.5;
          p[i * 3 + 2] = (Math.random() - 0.5) * 160 - 30;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
        return new THREE.Points(
          geo,
          new THREE.PointsMaterial({
            size,
            color: col,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
      };
      const s1a = makeStar(3000, 160, 0.022, 0xffffff),
        s1b = makeStar(600, 80, 0.04, 0x00f5ff),
        s1c = makeStar(300, 60, 0.055, 0xff006e),
        s1d = makeStar(200, 50, 0.06, 0x7400ff);
      scene.add(s1a, s1b, s1c, s1d);

      const floaters = [];
      const fGeos = [
        new THREE.OctahedronGeometry(0.25),
        new THREE.IcosahedronGeometry(0.2),
        new THREE.DodecahedronGeometry(0.22),
        new THREE.TetrahedronGeometry(0.28),
      ];
      const fCols = [0x00f5ff, 0xff006e, 0x7400ff, 0xffbe0b, 0x06d6a0];
      for (let i = 0; i < 50; i++) {
        const g = fGeos[i % 4].clone();
        const w = new THREE.WireframeGeometry(g);
        const m = new THREE.LineBasicMaterial({
          color: fCols[i % 5],
          transparent: true,
          opacity: 0.25 + Math.random() * 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const obj = new THREE.LineSegments(w, m);
        obj.position.set(
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 12,
          -Math.random() * 110 - 3,
        );
        obj.userData = {
          rx: 0.003 + Math.random() * 0.007,
          ry: 0.004 + Math.random() * 0.006,
          rz: 0.002 + Math.random() * 0.004,
          dx: Math.random() * 0.004,
          dy: Math.random() * 0.003,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.5 + Math.random(),
        };
        scene.add(obj);
        floaters.push(obj);
      }

      scene.add(new THREE.AmbientLight(0x111133, 1));
      const pl1 = new THREE.PointLight(0x00f5ff, 5, 60);
      pl1.position.set(0, 0, 3);
      scene.add(pl1);
      const pl2 = new THREE.PointLight(0x7400ff, 4, 50);
      pl2.position.set(-6, 4, -15);
      scene.add(pl2);
      const pl3 = new THREE.PointLight(0xff006e, 3, 40);
      pl3.position.set(6, -3, -25);
      scene.add(pl3);

      // ── GSAP SCROLL ──
      let camZ = 6,
        camTX = 0,
        camTY = 0;
      ScrollTrigger.create({
        trigger: "#page",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
        onUpdate(self) {
          const p = self.progress;
          camZ = 6 - p * 135;
          camTX = Math.sin(p * Math.PI * 4) * 0.4;
          camTY = Math.cos(p * Math.PI * 3) * 0.25;
          aA.mesh.position.z = -8 + p * 20;
          aB.mesh.position.z = -18 + p * 30;
          rings.forEach((r, i) => {
            r.mesh.rotation.z = r.baseRotZ + p * Math.PI * 3 + i * 0.06;
          });
          const str = 1 + p * 3.5;
          s1a.scale.z = str;
          s1b.scale.z = str * 1.3;
          s1c.scale.z = str * 0.9;
          s1d.scale.z = str * 1.1;
          aA.mat.uniforms.uScroll.value = p;
          aB.mat.uniforms.uScroll.value = p;
        },
      });

      gsap.utils.toArray(".stat-cell").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#s2",
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });
      });
      gsap.utils.toArray(".bento").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          delay: i * 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#s3",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
      gsap.utils.toArray(".ht-item").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay: i * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#s5",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      });
      gsap.utils.toArray(".rv,.rv-l,.rv-r,.rv-s").forEach((el) => {
        const xv = el.classList.contains("rv-l")
          ? -60
          : el.classList.contains("rv-r")
            ? 60
            : 0;
        const sv = el.classList.contains("rv-s") ? 0.88 : 1;
        gsap.fromTo(
          el,
          {
            opacity: 0,
            x: xv,
            y: el.classList.contains("rv") ? 50 : 0,
            scale: sv,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 83%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // ── MOUSE PARALLAX + RENDER LOOP ──
      let mdx = 0,
        mdy = 0;
      const onMouse = (e) => {
        mdx = (e.clientX / innerWidth - 0.5) * 0.3;
        mdy = (e.clientY / innerHeight - 0.5) * 0.2;
      };
      document.addEventListener("mousemove", onMouse);

      let time = 0;
      const clock = new THREE.Clock();
      let rafId;
      const tick = () => {
        rafId = requestAnimationFrame(tick);
        const dt = clock.getDelta();
        time += dt;
        camera.position.z += (camZ - camera.position.z) * 0.055;
        camera.position.x += (camTX + mdx - camera.position.x) * 0.04;
        camera.position.y += (camTY - mdy - camera.position.y) * 0.04;
        camera.rotation.x += (mdy * 0.06 - camera.rotation.x) * 0.04;
        camera.rotation.y += (-mdx * 0.05 - camera.rotation.y) * 0.04;
        aA.mat.uniforms.uTime.value = time;
        aB.mat.uniforms.uTime.value = time + 2.5;
        aA.mesh.rotation.z = Math.sin(time * 0.08) * 0.06;
        aB.mesh.rotation.z = 0.15 + Math.sin(time * 0.06) * 0.05;
        floaters.forEach((f) => {
          f.rotation.x += f.userData.rx;
          f.rotation.y += f.userData.ry;
          f.rotation.z += f.userData.rz;
          f.position.x +=
            Math.sin(time * f.userData.dx + f.userData.phase) * 0.005;
          f.position.y +=
            Math.cos(time * f.userData.dy + f.userData.phase) * 0.004;
          f.material.opacity =
            0.25 +
            Math.sin(time * f.userData.pulseSpeed + f.userData.phase) * 0.15;
        });
        rings.forEach((r) => {
          const h = (r.hue + time * 20) % 360;
          r.mesh.material.color.setHSL(h / 360, 0.85, 0.6);
        });
        pl1.position.x = Math.sin(time * 0.7) * 4;
        pl1.position.y = Math.cos(time * 0.5) * 3;
        pl1.position.z = 3 + Math.sin(time * 0.3) * 2 + camera.position.z * 0.3;
        pl2.position.x = Math.cos(time * 0.4) * 6 + camera.position.x;
        pl2.position.y = Math.sin(time * 0.6) * 4;
        pl3.position.x = Math.sin(time * 0.3) * 7;
        pl3.position.y = Math.cos(time * 0.5) * 3;
        s1a.rotation.z = time * 0.005;
        s1b.rotation.z = -time * 0.008;
        s1c.rotation.z = time * 0.006;
        s1d.rotation.z = -time * 0.004;
        renderer.render(scene, camera);
      };
      tick();

      const onResize = () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      document.querySelectorAll(".bento").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5,
            y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `translateY(-4px) scale(1.01) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
      });

      cleanup = () => {
        cancelAnimationFrame(rafId);
        cancelAnimationFrame(rafCursor);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        ScrollTrigger.getAll().forEach((t) => t.kill());
        document.head.removeChild(styleEl);
      };
    })();

    return () => cleanup();
  }, []);

  const {
    nav,
    hero,
    stats,
    projects,
    marqueeRow1,
    marqueeRow2,
    journey,
    contact,
    footer,
  } = newData;

  const renderMarqueeItem = (item, i, symbol) =>
    item.label === symbol ? (
      <span
        key={i}
        className="marquee-item"
      >
        <span>{symbol}</span>
      </span>
    ) : (
      <span
        key={i}
        className={`marquee-item ${item.lit || ""}`}
      >
        {item.label}
      </span>
    );

  // Duplicate rows once for seamless infinite loop
  const row1 = [...marqueeRow1, ...marqueeRow1];
  const row2 = [...marqueeRow2, ...marqueeRow2];

  return (
    <>
      <div
        id="cursor-dot"
        ref={dotRef}
      ></div>
      <div
        id="cursor-glow"
        ref={glowRef}
      ></div>
      <div id="chroma-overlay"></div>
      <div id="scanlines"></div>
      <div id="vignette"></div>
      <canvas
        id="glcanvas"
        ref={canvasRef}
      ></canvas>

      {/* ── NAV ── */}
      {/* <nav>
        <div className="nav-logo">{nav.logo}</div>
        <div className="nav-r">
          {nav.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
            >
              {l.label}
            </a>
          ))}
          <a
            href={nav.cta.href}
            className="nav-btn"
          >
            <span>{nav.cta.label}</span>
          </a>
        </div>
      </nav> */}
      {/* <Header /> */}

      <div id="page">
        {/* ── S1 HERO ── */}
        <section id="s1">
          <h1
            className="glitch"
            data-text=""
          >
            {hero.firstName}
            <span className="hero-accent">{hero.lastName}</span>
          </h1>

          <div className="hero-roles">
            {/* {hero.badges.map((b) => (
              <span
              key={b.label}
              className={`role-badge ${b.cls}`}
              >
              {b.label}
              </span>
              ))} */}
          </div>
          <div className="hero-sub-wrap">
            <div className="hero-line"></div>
            <p className="hero-sub">{hero.tagline}</p>
            <div className="hero-line-r"></div>
          </div>
          <SocialIcons socialLinks={socialLinks} />
          <div className="hud">
            {hero.hud.map((h) => (
              <div
                key={h.label}
                className="hud-item"
              >
                {h.label}{" "}
                <span
                  className="hud-val"
                  ref={h.ref ? commitRef : null}
                >
                  {h.value}
                </span>
              </div>
            ))}
          </div>

          {/* <button
            onClick={() => trackEvent("Portfolio", "Click", "Contact Button")}
          >
            Event
          </button> */}
          {/* <div className="scroll-pulse">
            <div className="pulse-circle"></div>
            <p className="scroll-txt">Scroll to explore</p>
          </div> */}
        </section>

        {/* ── S2 STACK ── */}
        <section id="s2">
          <div
            className="rv"
            style={{ textAlign: "center" }}
          >
            <p className="section-tag tag-cyan">01 — Arsenal</p>
            <h2 className="big-heading">
              <span className="gw-c">MY</span>{" "}
              <span className="gw-v">TECH</span>
              <br />
              <span className="gw-m">STACK</span>
            </h2>
          </div>
          <div className="stats-band">
            {stats.map((s) => (
              <div
                key={s.label}
                className="stat-cell"
              >
                <div className={`stat-big ${s.cls}`}>
                  {s.value}
                  {s.suffix && (
                    <span style={{ fontSize: ".5em" }}>{s.suffix}</span>
                  )}
                </div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="tech-orbit rv-s">
            <div className="orbit-ring"></div>
            <div className="orbit-ring"></div>
            <div className="orbit-ring"></div>
            <div className="orbit-center">
              FULL
              <br />
              STACK
            </div>
          </div>
        </section>

        {/* ── S3 PROJECTS ── */}
        <section id="s3">
          <div
            className="rv"
            style={{ textAlign: "center", width: "100%", maxWidth: "1200px" }}
          >
            <p className="section-tag tag-mag">02 — Work</p>
            <h2 className="big-heading">
              <span className="gw-c">FEATURED</span>{" "}
              <span className="gw-m">PROJECTS</span>
            </h2>
          </div>
          <div className="bento-grid">
            {projects.map((p) => (
              <Link
                href={`/projects?slug=${p.slug}`}
                key={p.num}
                className={`bento ${p.sizeCls}`}
              >
                <div className="bento-num">{p.num}</div>
                <div className={`bento-icon ${p.iconCls}`}>{p.icon}</div>
                <div className="bento-title">
                  <span className={p.titleGradient}>{p.titleWord}</span>
                  {p.newline ? (
                    <>
                      <br />
                      {p.titleRest}
                    </>
                  ) : (
                    <> {p.titleRest}</>
                  )}
                </div>
                <div className="bento-body">{p.body}</div>

                {p.keyFeatures?.length > 0 && (
                  <ul className="bento-features">
                    {p.keyFeatures.map((feature) => (
                      <li key={feature.id}>{feature.text}</li>
                    ))}
                  </ul>
                )}
                <div className="bento-tags">
                  {p.tags.map((t) => (
                    <span
                      key={t.label}
                      className={`btag ${t.cls}`}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
                {p.orb && <div className={`bento-orb ${p.orb}`}></div>}
              </Link>
            ))}
          </div>
        </section>

        {/* ── S4 MARQUEE ── */}
        <section id="s4">
          <div className="marquee-wrap">
            <div className="marquee-track">
              {row1.map((item, i) => renderMarqueeItem(item, i, "✦"))}
            </div>
          </div>
          <div
            className="marquee-wrap"
            style={{ borderTop: "none", marginTop: "3px" }}
          >
            <div className="marquee-track rev">
              {row2.map((item, i) => renderMarqueeItem(item, i, "◈"))}
            </div>
          </div>
        </section>

        {/* ── S5 JOURNEY ── */}
        <section id="s5">
          <div
            className="rv"
            style={{ textAlign: "center" }}
          >
            <p className="section-tag tag-vio">03 — Chronicle</p>
            <h2 className="big-heading">
              <span className="gw-v">MY</span>{" "}
              <span className="gw-c">JOURNEY</span>
            </h2>
          </div>
          <div className="h-timeline">
            {journey.map((item) => (
              <div
                key={item.yr}
                className="ht-item"
              >
                <div className="ht-dot"></div>
                <div className="ht-yr">{item.yr}</div>
                <div className="ht-name">{item.name}</div>
                <div className="ht-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── S6 CONTACT ── */}
        <section id="s6">
          <div className="cta-container rv-s">
            <div className="cta-bg-glow"></div>
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
            <p className="cta-small">04 — Contact</p>
            <div className="cta-h">
              <span className="l1">LET'S BUILD</span>
              <span className="l2">SOMETHING</span>
              <span className="l3">TOGETHER</span>
            </div>
            <div className="contact-chips">
              {/* {contact.chips.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="chip"
                >
                  {c.label}
                </a>
              ))} */}
            </div>
            <div className="btn-row">
              {contact.buttons.map((b) => (
                <a
                  key={b.label}
                  href={b.href}
                  className={`glowbtn ${b.cls}`}
                >
                  {b.label}
                </a>
              ))}
            </div>
            <p className="cta-note">{contact.note}</p>
          </div>
        </section>

        <footer>
          <div className="fl">{footer.logo}</div>
          <div className="fm-links">
            {footer.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="fr">{footer.copy}</div>
        </footer>
      </div>
    </>
  );
}


const styles = ` 
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@100;200;300;400&family=Space+Mono:ital@0;1&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0
}

:root {
  --bg: #000308;
  --c1: #00f5ff;
  --c2: #ff006e;
  --c3: #7400ff;
  --c4: #ffbe0b;
  --c5: #06d6a0;
  --txt: #e2eaff;
  --dim: #3a4060;
  --fh: 'Anton', sans-serif;
  --fb: 'Outfit', sans-serif;
  --fm: 'Space Mono', monospace;
}

html {
  background: var(--bg);
  scroll-behavior: auto
}

body {
  font-family: var(--fb);
  background: var(--bg);
  color: var(--txt);
  overflow-x: hidden;
  cursor: none
}

#cursor-dot {
  position: fixed;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c1);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 12px var(--c1), 0 0 24px var(--c1);
  transition: width .2s, height .2s, background .3s;
}

#cursor-glow {
  position: fixed;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(0, 245, 255, .25);
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: width .35s cubic-bezier(.16, 1, .3, 1), height .35s cubic-bezier(.16, 1, .3, 1), border-color .3s;
  backdrop-filter: invert(3%);
}

#cursor-dot.big {
  width: 14px;
  height: 14px
}

#cursor-glow.big {
  width: 70px;
  height: 70px;
  border-color: rgba(0, 245, 255, .5)
}

#glcanvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none
}

#chroma-overlay {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(255, 0, 110, .04) 100%), radial-gradient(ellipse at 50% 50%, transparent 70%, rgba(0, 245, 255, .03) 100%);
  mix-blend-mode: screen;
}

#scanlines {
  position: fixed;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: .025;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 1) 2px, rgba(255, 255, 255, 1) 3px);
}

#vignette {
  position: fixed;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0, 3, 8, .85) 100%);
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 52px;
}

nav::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 52px;
  right: 52px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 245, 255, .3), transparent);
}

.nav-logo {
  font-family: var(--fh);
  font-size: 1.8rem;
  letter-spacing: .2em;
  background: linear-gradient(135deg, var(--c1), var(--c3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 16px rgba(0, 245, 255, .5));
}

.nav-r {
  display: flex;
  gap: 36px;
  align-items: center
}

.nav-r a {
  font-family: var(--fm);
  font-size: .55rem;
  letter-spacing: .25em;
  color: rgba(226, 234, 255, .4);
  text-decoration: none;
  text-transform: uppercase;
  transition: color .3s, text-shadow .3s;
}

.nav-r a:hover {
  color: var(--c1);
  text-shadow: 0 0 10px var(--c1)
}

.nav-btn {
  font-family: var(--fm);
  font-size: .55rem;
  letter-spacing: .2em;
  padding: 10px 28px;
  border: 1px solid var(--c1);
  color: var(--c1);
  text-decoration: none;
  text-transform: uppercase;
  cursor: none;
  position: relative;
  overflow: hidden;
  transition: color .4s;
  box-shadow: 0 0 20px rgba(0, 245, 255, .15), inset 0 0 20px rgba(0, 245, 255, .05);
}

.nav-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--c1), var(--c3));
  transform: translateX(-101%);
  transition: transform .45s cubic-bezier(.77, 0, .175, 1);
}

.nav-btn:hover::before {
  transform: translateX(0)
}

.nav-btn:hover {
  color: #000
}

.nav-btn span {
  position: relative;
  z-index: 1
}

#page {
  position: relative;
  z-index: 10
}

section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 100px 60px;
  overflow: hidden;
}

#s1 {
  min-height: 200vh;
  justify-content: flex-start;
  padding-top: 28vh;
  gap: 0
}

.glitch {
  position: relative;
  font-family: var(--fh);
  font-size: clamp(4rem, 14vw, 12rem);
  line-height: .85;
  letter-spacing: .03em;
  color: var(--txt);
  text-align: center;
  filter: drop-shadow(0 0 40px rgba(0, 245, 255, .3));
  opacity: 0;
  animation: heroIn 1.8s .3s cubic-bezier(.16, 1, .3, 1) forwards;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 1.4px;
  left: 3px;
  width: 100%;
  height: 100%;
  font-family: var(--fh);
  font-size: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  text-align: center;
}

.glitch::before {
  color: var(--c2);
  clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
  animation: glitch1 4s infinite;
  transform: translateX(-3px);
}

.glitch::after {
  color: var(--c1);
  clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
  animation: glitch2 4s infinite;
  transform: translateX(3px);
}

@keyframes glitch1 {

  0%,
  90%,
  100% {
    transform: translateX(-3px);
    opacity: .6
  }

  91% {
    transform: translateX(4px) skewX(4deg);
    opacity: 1
  }

  93% {
    transform: translateX(-2px);
    opacity: .4
  }

  95% {
    transform: translateX(6px) skewX(-2deg);
    opacity: 1
  }

  97% {
    transform: translateX(0);
    opacity: .6
  }
}

@keyframes glitch2 {

  0%,
  92%,
  100% {
    transform: translateX(3px);
    opacity: .5
  }

  93% {
    transform: translateX(-5px) skewX(-3deg);
    opacity: 1
  }

  95% {
    transform: translateX(2px);
    opacity: .3
  }

  97% {
    transform: translateX(-4px) skewX(2deg);
    opacity: 1
  }

  99% {
    transform: translateX(0);
    opacity: .5
  }
}

@keyframes heroIn {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(.95)
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1)
  }
}

.hero-accent {
  font-family: var(--fh);
  font-size: clamp(4rem, 14vw, 12rem);
  background: linear-gradient(135deg, var(--c1) 0%, var(--c3) 40%, var(--c2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 60px rgba(116, 0, 255, .6)) drop-shadow(0 0 120px rgba(0, 245, 255, .3));
  display: block;
}

.hero-roles {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 22px;
  opacity: 0;
  animation: heroIn 1.4s .9s cubic-bezier(.16, 1, .3, 1) forwards;
}

.role-badge {
  font-family: var(--fm);
  font-size: .5rem;
  letter-spacing: .25em;
  text-transform: uppercase;
  padding: 7px 18px;
  border: 1px solid;
}

.rb-c {
  border-color: rgba(0, 245, 255, .35);
  color: var(--c1);
  box-shadow: 0 0 14px rgba(0, 245, 255, .1), inset 0 0 14px rgba(0, 245, 255, .05)
}

.rb-m {
  border-color: rgba(255, 0, 110, .35);
  color: var(--c2);
  box-shadow: 0 0 14px rgba(255, 0, 110, .1), inset 0 0 14px rgba(255, 0, 110, .05)
}

.rb-v {
  border-color: rgba(116, 0, 255, .35);
  color: var(--c3);
  box-shadow: 0 0 14px rgba(116, 0, 255, .1), inset 0 0 14px rgba(116, 0, 255, .05)
}

.rb-a {
  border-color: rgba(255, 190, 11, .35);
  color: var(--c4);
  box-shadow: 0 0 14px rgba(255, 190, 11, .1), inset 0 0 14px rgba(255, 190, 11, .05)
}

.hero-sub-wrap {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 24px;
  opacity: 0;
  animation: heroIn 1.4s 1.1s cubic-bezier(.16, 1, .3, 1) forwards;
}

.hero-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--c1))
}

.hero-sub {
  font-family: var(--fm);
  font-size: .65rem;
  letter-spacing: .3em;
  color: rgb(226 234 255 / 88%);
  text-transform: uppercase;
}

.hero-line-r {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, var(--c1), transparent)
}

.hud {
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 52px;
  opacity: 0;
  animation: heroIn 1s 1.6s ease forwards;
}

.hud-item {
  font-family: var(--fm);
  font-size: 14px;
  letter-spacing: .2em;
  color: var(--dim);
  text-transform: uppercase
}

.hud-val {
  color: var(--c1);
  text-shadow: 0 0 8px var(--c1)
}

.scroll-pulse {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
  animation: heroIn 1s 2s ease forwards;
}

.pulse-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(0, 245, 255, .3);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulseRing 2.5s ease-in-out infinite;
}

.pulse-circle::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c1);
  box-shadow: 0 0 8px var(--c1);
}

@keyframes pulseRing {

  0%,
  100% {
    transform: scale(1);
    opacity: .5;
    box-shadow: 0 0 0 0 rgba(0, 245, 255, .3)
  }

  50% {
    transform: scale(1.15);
    opacity: 1;
    box-shadow: 0 0 0 12px rgba(0, 245, 255, 0)
  }
}

.scroll-txt {
  font-family: var(--fm);
  font-size: .45rem;
  letter-spacing: .35em;
  color: var(--dim);
  text-transform: uppercase
}

#s2 {
  min-height: 120vh;
  gap: 80px
}

.section-tag {
  font-family: var(--fm);
  font-size: .55rem;
  letter-spacing: .5em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.tag-cyan {
  color: var(--c1);
  text-shadow: 0 0 12px var(--c1)
}

.tag-mag {
  color: var(--c2);
  text-shadow: 0 0 12px var(--c2)
}

.tag-vio {
  color: var(--c3);
  text-shadow: 0 0 12px var(--c3)
}

.tag-amb {
  color: var(--c4);
  text-shadow: 0 0 12px var(--c4)
}

.tag-mint {
  color: var(--c5);
  text-shadow: 0 0 12px var(--c5)
}

.big-heading {
  font-family: var(--fh);
  font-size: clamp(3.5rem, 9vw, 8.5rem);
  line-height: .88;
  text-align: center;
  letter-spacing: .02em;
}

.gw-c {
  background: linear-gradient(135deg, var(--c1), #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text
}

.gw-m {
  background: linear-gradient(135deg, var(--c2), #ff9ec8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text
}

.gw-v {
  background: linear-gradient(135deg, var(--c3), #c084ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text
}

.gw-a {
  background: linear-gradient(135deg, var(--c4), #fff7aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text
}

.gw-g {
  background: linear-gradient(135deg, var(--c5), #afffea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text
}

.stats-band {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  width: 100%;
  max-width: 1100px;
  border: 1px solid rgba(255, 255, 255, .05);
  background: rgba(255, 255, 255, .03);
}

.stat-cell {
  padding: 40px 32px;
  text-align: center;
  background: rgba(0, 3, 8, .6);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, .05);
  transition: background .4s;
  opacity: 0;
  transform: translateY(30px);
}

.stat-cell:last-child {
  border-right: none
}

.stat-cell:hover {
  background: rgba(0, 245, 255, .04)
}

.stat-big {
  font-family: var(--fh);
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  line-height: 1;
  margin-bottom: 10px;
}

.stat-big.c {
  color: var(--c1);
  text-shadow: 0 0 30px var(--c1), 0 0 60px rgba(0, 245, 255, .3)
}

.stat-big.m {
  color: var(--c2);
  text-shadow: 0 0 30px var(--c2), 0 0 60px rgba(255, 0, 110, .3)
}

.stat-big.v {
  color: var(--c3);
  text-shadow: 0 0 30px var(--c3), 0 0 60px rgba(116, 0, 255, .3)
}

.stat-big.a {
  color: var(--c4);
  text-shadow: 0 0 30px var(--c4), 0 0 60px rgba(255, 190, 11, .3)
}

.stat-lbl {
  font-family: var(--fm);
  font-size: .5rem;
  letter-spacing: .3em;
  color: var(--dim);
  text-transform: uppercase
}

.tech-orbit {
  position: relative;
  width: 340px;
  height: 340px;
  margin: 0 auto;
}

.orbit-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(0, 245, 255, .08);
  animation: spinRing 20s linear infinite;
}

.orbit-ring:nth-child(2) {
  inset: 50px;
  border-color: rgba(116, 0, 255, .08);
  animation-duration: 15s;
  animation-direction: reverse
}

.orbit-ring:nth-child(3) {
  inset: 100px;
  border-color: rgba(255, 0, 110, .08);
  animation-duration: 25s
}

@keyframes spinRing {
  from {
    transform: rotate(0deg)
  }

  to {
    transform: rotate(360deg)
  }
}

.orbit-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 245, 255, .15), rgba(116, 0, 255, .08), transparent);
  border: 1px solid rgba(0, 245, 255, .2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--fh);
  font-size: 1rem;
  letter-spacing: .15em;
  color: var(--c1);
  text-shadow: 0 0 12px var(--c1);
}

.tech-dot {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 3, 8, .8);
  border: 1px solid rgba(255, 255, 255, .1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .6rem;
  font-family: var(--fm);
  letter-spacing: .05em;
  transition: all .3s;
  box-shadow: 0 0 14px rgba(0, 0, 0, .5);
}

.tech-dot:hover {
  color: var(--c1);
  border-color: var(--c1);
  box-shadow: 0 0 16px rgba(0, 245, 255, .3);
  transform: scale(1.2)
}

#s3 {
  padding: 120px 52px;
  align-items: center
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  gap: 3px;
  width: 100%;
  max-width: 1200px;
  margin-top: 60px;
}

.bento {
  background: rgba(255, 255, 255, .02);
  border: 1px solid rgba(255, 255, 255, .06);
  padding: 40px;
  position: relative;
  overflow: hidden;
  transition: border-color .4s, transform .5s cubic-bezier(.16, 1, .3, 1), background .4s;
  opacity: 0;
  transform: translateY(30px) scale(.97);
  backdrop-filter: blur(1px);
}

.bento:hover {
  border-color: rgba(0, 245, 255, .25);
  background: rgba(0, 245, 255, .03);
  transform: translateY(-4px) scale(1.01) !important;
  z-index: 5;
  backdrop-filter: blur(20px);
}

.bento::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 245, 255, .5), transparent);
  opacity: 0;
  transition: opacity .4s;
}

.bento:hover::before {
  opacity: 1
}

.b1 {
  grid-column: span 7;
  grid-row: span 2;
  min-height: 320px
}

.b2 {
  grid-column: span 5;
  min-height: 155px
}

.b3 {
  grid-column: span 5;
  min-height: 155px
}

.b4 {
  grid-column: span 4;
  min-height: 200px
}

.b5 {
  grid-column: span 4;
  min-height: 200px
}

.b6 {
  grid-column: span 4;
  min-height: 200px
}

.bento-num {
  font-family: var(--fh);
  font-size: 4rem;
  color: rgb(140 216 255);
  line-height: 1;
  position: absolute;
  top: 20px;
  right: 24px;
}

.bento-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 1.4rem;
  border: 1px solid rgba(255, 255, 255, .08);
}

.ic {
  background: radial-gradient(circle, rgba(0, 245, 255, .15), transparent)
}

.im {
  background: radial-gradient(circle, rgba(255, 0, 110, .15), transparent)
}

.iv {
  background: radial-gradient(circle, rgba(116, 0, 255, .15), transparent)
}

.ia {
  background: radial-gradient(circle, rgba(255, 190, 11, .15), transparent)
}

.ig {
  background: radial-gradient(circle, rgba(6, 214, 160, .15), transparent)
}

.bento-title {
  font-family: var(--fh);
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  line-height: 1;
  margin-bottom: 14px;
  letter-spacing: .02em;
}

.bento-body {
  font-family: var(--fb);
  font-weight: 200;
  font-size: .8rem;
  line-height: 1.9;
  color: rgba(226, 234, 255, .45);
  letter-spacing: .03em;
}

.bento-orb {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  right: -60px;
  bottom: -60px;
  opacity: .35;
}

.orb-c {
  background: radial-gradient(circle, var(--c1), transparent)
}

.orb-m {
  background: radial-gradient(circle, var(--c2), transparent)
}

.orb-v {
  background: radial-gradient(circle, var(--c3), transparent)
}

.bento-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.btag {
  font-family: var(--fm);
  font-size: .42rem;
  letter-spacing: .18em;
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, .08);
  color: var(--dim);
  text-transform: uppercase;
}

.btag-c {
  border-color: rgba(0, 245, 255, .25);
  color: var(--c1)
}

.btag-m {
  border-color: rgba(255, 0, 110, .25);
  color: var(--c2)
}

.btag-v {
  border-color: rgba(116, 0, 255, .25);
  color: var(--c3)
}

.btag-a {
  border-color: rgba(255, 190, 11, .25);
  color: var(--c4)
}

.btag-g {
  border-color: rgba(6, 214, 160, .25);
  color: var(--c5)
}

#s4 {
  min-height: auto;
  padding: 0;
  overflow: hidden;
  flex-direction: column;
  gap: 0
}

.marquee-wrap {
  width: 100%;
  overflow: hidden;
  padding: 40px 0;
  border-top: 1px solid rgba(255, 255, 255, .05);
  border-bottom: 1px solid rgba(255, 255, 255, .05);
  position: relative;
}

.marquee-wrap::before,
.marquee-wrap::after {
  content: '';
  position: absolute;
  top: 0;
  width: 200px;
  height: 100%;
  z-index: 2;
}

.marquee-wrap::before {
  left: 0;
  background: linear-gradient(90deg, var(--bg), transparent)
}

.marquee-wrap::after {
  right: 0;
  background: linear-gradient(-90deg, var(--bg), transparent)
}

.marquee-track {
  display: flex;
  gap: 60px;
  width: max-content;
  animation: marqueeL 25s linear infinite;
}

.marquee-track.rev {
  animation: marqueeR 30s linear infinite
}

.marquee-item {
  font-family: var(--fh);
  font-size: 3rem;
  letter-spacing: .08em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, .5);
  white-space: nowrap;
  transition: color .3s, -webkit-text-stroke .3s;
  text-transform: uppercase;
}

.marquee-item.lit {
  color: var(--c1);
  -webkit-text-stroke: 0px;
  text-shadow: 0 0 30px var(--c1);
}

.marquee-item.lit2 {
  color: var(--c2);
  -webkit-text-stroke: 0px;
  text-shadow: 0 0 30px var(--c2);
}

.marquee-item.lit3 {
  color: var(--c5);
  -webkit-text-stroke: 0px;
  text-shadow: 0 0 30px var(--c5);
}

.marquee-item span {
  color: var(--c3);
  margin: 0 30px;
  opacity: .4;
  font-size: 1rem
}

@keyframes marqueeL {
  0% {
    transform: translateX(0)
  }

  100% {
    transform: translateX(-50%)
  }
}

@keyframes marqueeR {
  0% {
    transform: translateX(-50%)
  }

  100% {
    transform: translateX(0)
  }
}

#s5 {
  min-height: 120vh;
  gap: 80px
}

.h-timeline {
  display: flex;
  gap: 0;
  width: 100%;
  max-width: 1200px;
  position: relative;
  margin-top: 20px;
}

.h-timeline::before {
  content: '';
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--c1), var(--c3), var(--c2), var(--c4));
}

.ht-item {
  flex: 1;
  padding-top: 68px;
  padding-right: 32px;
  position: relative;
  opacity: 0;
  transform: translateY(30px);
}

.ht-dot {
  position: absolute;
  top: 28px;
  left: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid currentColor;
  background: var(--bg);
  transform: translateY(-50%) translateX(-1px);
}

.ht-dot::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px currentColor;
}

.ht-item:nth-child(1) .ht-dot,
.ht-item:nth-child(1) .ht-yr {
  color: var(--c1)
}

.ht-item:nth-child(2) .ht-dot,
.ht-item:nth-child(2) .ht-yr {
  color: var(--c3)
}

.ht-item:nth-child(3) .ht-dot,
.ht-item:nth-child(3) .ht-yr {
  color: var(--c2)
}

.ht-item:nth-child(4) .ht-dot,
.ht-item:nth-child(4) .ht-yr {
  color: var(--c4)
}

.ht-item:nth-child(5) .ht-dot,
.ht-item:nth-child(5) .ht-yr {
  color: var(--c5)
}

.ht-yr {
  font-family: var(--fh);
  font-size: 1.8rem;
  margin-bottom: 10px;
  line-height: 1
}

.ht-name {
  font-family: var(--fb);
  font-weight: 300;
  font-size: .85rem;
  color: var(--txt);
  margin-bottom: 10px;
  letter-spacing: .05em
}

.ht-desc {
  font-family: var(--fm);
  font-size: .7rem;
  line-height: 2;
  color: #a2fbffbd;
  letter-spacing: .04em
}

#s6 {
  min-height: 100vh;
  gap: 0;
  padding: 80px 60px
}

.cta-container {
  position: relative;
  width: 100%;
  max-width: 1100px;
  padding: 100px 80px;
  border: 1px solid rgba(255, 255, 255, .06);
  background: rgba(255, 255, 255, .01);
  backdrop-filter: blur(20px);
  text-align: center;
  overflow: hidden;
}

.corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border-color: var(--c1);
  border-style: solid;
  opacity: .4
}

.corner-tl {
  top: 0;
  left: 0;
  border-width: 1px 0 0 1px
}

.corner-tr {
  top: 0;
  right: 0;
  border-width: 1px 1px 0 0
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-width: 0 0 1px 1px
}

.corner-br {
  bottom: 0;
  right: 0;
  border-width: 0 1px 1px 0
}

.cta-bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 400px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse, rgba(116, 0, 255, .12), rgba(0, 245, 255, .06), transparent 70%);
  pointer-events: none;
  animation: ctaPulse 4s ease-in-out infinite;
}

@keyframes ctaPulse {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: .6
  }

  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 1
  }
}

.cta-small {
  font-family: var(--fm);
  font-size: .6rem;
  letter-spacing: .5em;
  color: var(--c5);
  text-transform: uppercase;
  margin-bottom: 28px;
  text-shadow: 0 0 12px var(--c5)
}

.cta-h {
  font-family: var(--fh);
  font-size: clamp(3.5rem, 10vw, 9rem);
  line-height: .88;
  margin-bottom: 48px;
}

.cta-h .l1 {
  display: block;
  color: transparent;
  -webkit-text-stroke: 1px rgba(226, 234, 255, .2)
}

.cta-h .l2 {
  display: block;
  background: linear-gradient(135deg, var(--c1) 0%, var(--c3) 50%, var(--c2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(0, 245, 255, .5));
}

.cta-h .l3 {
  display: block;
  color: var(--txt)
}

.contact-chips {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 36px;
}

.chip {
  font-family: var(--fm);
  font-size: .5rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 1px solid rgba(255, 255, 255, .1);
  color: var(--dim);
  text-decoration: none;
  cursor: none;
  position: relative;
  overflow: hidden;
  transition: all .4s;
}

.chip:hover {
  color: var(--c1);
  border-color: rgba(0, 245, 255, .3);
  box-shadow: 0 0 20px rgba(0, 245, 255, .12)
}

.btn-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px
}

.glowbtn {
  padding: 16px 56px;
  font-family: var(--fm);
  font-size: .6rem;
  letter-spacing: .3em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: none;
  position: relative;
  overflow: hidden;
  transition: all .4s;
}

.glowbtn-primary {
  background: linear-gradient(135deg, var(--c1), var(--c3));
  color: #000;
  box-shadow: 0 0 40px rgba(0, 245, 255, .3), 0 0 80px rgba(116, 0, 255, .2);
}

.glowbtn-primary:hover {
  box-shadow: 0 0 60px rgba(0, 245, 255, .6), 0 0 120px rgba(116, 0, 255, .4);
  transform: translateY(-2px);
}

.glowbtn-outline {
  background: transparent;
  color: var(--txt);
  border: 1px solid rgba(226, 234, 255, .2);
}

.glowbtn-outline::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 245, 255, .08), rgba(116, 0, 255, .08));
  opacity: 0;
  transition: opacity .4s;
}

.glowbtn-outline:hover::after {
  opacity: 1
}

.cta-note {
  font-family: var(--fm);
  font-size: .5rem;
  letter-spacing: .2em;
  color: var(--dim);
  text-transform: uppercase
}

footer {
  padding: 36px 52px;
  border-top: 1px solid rgba(255, 255, 255, .05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
}

.fl {
  font-family: var(--fh);
  font-size: 1.4rem;
  letter-spacing: .25em;
  background: linear-gradient(135deg, var(--c1), var(--c3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.fr {
  font-family: var(--fm);
  font-size: .48rem;
  letter-spacing: .15em;
  color: rgba(58, 64, 96, .6)
}

.fm-links {
  display: flex;
  gap: 28px
}

.fm-links a {
  font-family: var(--fm);
  font-size: .48rem;
  letter-spacing: .18em;
  color: var(--dim);
  text-decoration: none;
  text-transform: uppercase;
  transition: color .3s
}

.fm-links a:hover {
  color: var(--c1)
}

.rv {
  opacity: 0;
  transform: translateY(50px)
}

.rv-l {
  opacity: 0;
  transform: translateX(-60px)
}

.rv-r {
  opacity: 0;
  transform: translateX(60px)
}

.rv-s {
  opacity: 0;
  transform: scale(.88)
}

@media(max-width:900px) {
  nav {
    padding: 18px 20px
  }

  .nav-r a {
    display: none
  }

  section {
    padding: 80px 20px
  }

  .stats-band {
    grid-template-columns: 1fr 1fr
  }

  .bento-grid {
    grid-template-columns: 1fr
  }

  .b1,
  .b2,
  .b3,
  .b4,
  .b5,
  .b6 {
    grid-column: span 1;
    min-height: auto
  }

  .h-timeline {
    flex-direction: column;
    gap: 40px
  }

  .h-timeline::before {
    top: 0;
    bottom: 0;
    left: 8px;
    right: auto;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, var(--c1), var(--c3), var(--c2), var(--c4))
  }

  .ht-item {
    padding-top: 0;
    padding-left: 40px;
    padding-right: 0
  }

  .ht-dot {
    top: 4px;
    left: 0;
    transform: none
  }

  .cta-container {
    padding: 60px 24px
  }

  footer {
    flex-direction: column;
    gap: 20px;
    text-align: center
  }

  .tech-orbit {
    display: none
  }
}

.bento-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0;
}

.bento-features li {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: rgba(226, 234, 255, 0.5);
  padding-left: 14px;
  position: relative;
}

.bento-features li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--c1);
  opacity: 0.6;
}
`;