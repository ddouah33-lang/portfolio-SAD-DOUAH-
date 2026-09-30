/* ===== 1. Data (the first name lives here, never in the HTML) ===== */
const portfolio = {
  firstName: "Saad",
  role: "software_engineering_student",
  email: "you@example.com",            // TODO: your email
  github: "https://github.com/",       // TODO: your GitHub
  linkedin: "https://linkedin.com/",   // TODO: your LinkedIn
  about: ["Software Engineering", "Web Development", "Problem Solving", "Database", "Algorithms"],
  skills: {
    Languages: ["C", "C++", "JavaScript", "Python", "SQL"],
    Web: ["HTML", "CSS", "JavaScript"],
    Tools: ["Git", "GitHub", "VS Code", "Vercel"],
    Concepts: ["OOP", "Algorithms", "Data Structures", "Databases", "Software Engineering"]
  },
  projects: [
    ["Academic Management System", "A structured C++ application built around object-oriented design.", ["C++", "OOP"]],
    ["Interactive Web Experience", "An immersive front-end experience with 3D and motion.", ["HTML", "CSS", "JavaScript"]],
    ["Database Management System", "Data modelling, queries and a Python layer on top.", ["SQL", "Python"]],
    ["Software Engineering Project", "Algorithms and data structures applied to a real problem.", ["Algorithms", "Data Structures"]]
  ],
  journey: [["2025", "Beginning of Software Engineering"], ["2026", "Web Development, Programming, Databases"], ["2026", "Projects, Git, GitHub, Deployment"], ["Future", "Software Engineer"]]
};
const $ = s => document.querySelector(s);
const name = portfolio.firstName;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const touch = matchMedia("(pointer:coarse)").matches;
const small = innerWidth < 860;

/* ===== 2. Inject content ===== */
document.title = `${name.toUpperCase()} // SOFTWARE ENGINEER`;
$("#logo").textContent = `${name.toUpperCase()}.DEV`;
$("#photo").alt = `Portrait of ${name}`;
$("#hello").textContent = `Hello, I'm ${name}`;
$("#foot").textContent = `© ${new Date().getFullYear()} ${name} — built with HTML, CSS & JS`;
$("#stack").innerHTML = portfolio.about.map((t, i) => `<div class="layer" style="--i:${5 - i};--d:${i * .4}s">${t}</div>`).join("");
$("#cards").innerHTML = portfolio.projects.map(([t, d, tags], i) =>
  `<article class="card reveal"><div class="num">0${i + 1}</div><h3>${t}</h3><p>${d}</p>
  <div class="chips">${tags.map(x => `<span>${x}</span>`).join("")}</div><button class="btn" data-i="${i}" data-magnetic>View project</button></article>`).join("");
$("#timeline").innerHTML = portfolio.journey.map(([y, t]) => `<li><b>${y}</b><span>${t}</span></li>`).join("");
$("#links").innerHTML = [["Email", `mailto:${portfolio.email}`], ["GitHub", portfolio.github], ["LinkedIn", portfolio.linkedin]]
  .map(([l, h]) => `<li><a href="${h}" target="_blank" rel="noopener">${l}<span>→</span></a></li>`).join("");

/* Project details dialog */
const pd = $("#pd");
$("#cards").addEventListener("click", e => {
  const b = e.target.closest("[data-i]"); if (!b) return;
  const i = +b.dataset.i, [t, d, tags] = portfolio.projects[i];
  $("#pd-n").textContent = `Project 0${i + 1}`; $("#pd-t").textContent = t; $("#pd-d").textContent = d;
  $("#pd-c").innerHTML = tags.map(x => `<span>${x}</span>`).join(""); $("#pd-l").href = portfolio.github;
  pd.showModal();
});
pd.addEventListener("click", e => { if (e.target === pd) pd.close(); });

/* ===== 3. Nav ===== */
const burger = $("#burger"), menu = $("#menu");
const setMenu = o => { menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); };
burger.onclick = () => setMenu(!menu.classList.contains("open"));
menu.querySelectorAll("a").forEach(a => a.onclick = () => setMenu(false));

/* ===== 4. Reveal on scroll + timeline progress ===== */
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .15 });
document.querySelectorAll(".reveal,.timeline li").forEach(el => io.observe(el));
const tl = $("#timeline");
addEventListener("scroll", () => {
  const r = tl.getBoundingClientRect();
  tl.style.setProperty("--p", Math.min(1, Math.max(0, (innerHeight * .7 - r.top) / r.height)));
}, { passive: true });

/* ===== 5. Cursor, magnetic buttons, card tilt ===== */
const cur = $("#cursor");
if (!touch && !reduce) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; cur.classList.add("on"); });
  (function f() { cx += (tx - cx) * .18; cy += (ty - cy) * .18; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(f); })();
  document.addEventListener("mouseover", e => cur.classList.toggle("big", !!e.target.closest("a,button,.card,input,textarea")));
  document.querySelectorAll("[data-magnetic]").forEach(b => {
    b.addEventListener("mousemove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    b.addEventListener("mouseleave", () => b.style.transform = "");
  });
  document.querySelectorAll(".card,.portrait").forEach(c => {
    c.addEventListener("mousemove", e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.transform = `rotateY(${(x - .5) * 14}deg) rotateX(${(.5 - y) * 14}deg)`;
      c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
    });
    c.addEventListener("mouseleave", () => c.style.transform = "");
  });
  const st = $("#stack");
  addEventListener("mousemove", e => { st.querySelectorAll(".layer").forEach(l => { l.style.setProperty("--ry", (e.clientX / innerWidth - .5) * -18 + "deg"); l.style.setProperty("--rx", (e.clientY / innerHeight - .5) * 12 + "deg"); }); });
}

/* ===== 6. Terminal (typing + interactive) ===== */
const out = $("#term-out"), inp = $("#term-input");
const cmds = {
  whoami: name.toLowerCase(), role: portfolio.role, passion: "building_software", status: "learning...",
  help: "commands: whoami, role, passion, status, clear"
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function type(cmd) {
  const line = document.createElement("div"); line.innerHTML = `<span class="cmd">$ </span>`; out.append(line);
  for (const ch of cmd) { line.append(ch); if (!reduce) await sleep(70); }
  const res = document.createElement("div"); res.textContent = "\n" + (cmds[cmd] ?? `command not found: ${cmd}`) + "\n"; out.append(res);
}
let started = false;
new IntersectionObserver(async ([e]) => {
  if (!e.isIntersecting || started) return; started = true;
  for (const c of ["whoami", "role", "passion", "status"]) { await type(c); await sleep(reduce ? 0 : 350); }
}, { threshold: .5 }).observe($(".term"));
inp.addEventListener("keydown", e => {
  if (e.key !== "Enter" || !inp.value.trim()) return;
  const c = inp.value.trim().toLowerCase(); inp.value = "";
  if (c === "clear") return void (out.innerHTML = "");
  const l = document.createElement("div"); l.innerHTML = `<span class="cmd">$ </span>${c.replace(/[<>&]/g, "")}`; out.append(l);
  const r = document.createElement("div"); r.textContent = "\n" + (cmds[c] ?? `command not found: ${c}`) + "\n"; out.append(r);
});

/* ===== 7. Contact form (front-end only) ===== */
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, ok = f.name.value.trim() && /\S+@\S+\.\S+/.test(f.email.value) && f.message.value.trim();
  $("#status").textContent = ok ? `Message ready, thanks ${f.name.value.trim()}. (Demo form: nothing is sent.)` : "Please fill in name, a valid email and a message.";
  if (ok) f.reset();
});

/* ===== 8. Skills constellation (2D canvas) ===== */
(() => {
  const cv = $("#constellation"), ctx = cv.getContext("2d"), cols = ["#8ab4ff", "#b39dff", "#7fe0d0", "#f2f4f8"];
  let W, H, nodes = [], mouse = { x: -999, y: -999 }, hov = null;
  $("#legend").innerHTML = Object.keys(portfolio.skills).map((k, i) => `<span><b style="background:${cols[i]}"></b>${k}</span>`).join("");
  function build() {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2); W = r.width; H = r.height;
    cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    nodes = [];
    const cs = [[.27, .32], [.73, .3], [.27, .72], [.73, .7]];
    Object.entries(portfolio.skills).forEach(([cat, arr], c) => {
      const cx = W * cs[c][0], cy = H * cs[c][1], R = Math.min(W, H) * .17;
      nodes.push({ label: cat, hub: true, c, cx, cy, x: cx, y: cy, a: 0, R: 0, s: 0 });
      arr.forEach((l, i) => nodes.push({ label: l, c, cx, cy, a: i / arr.length * 6.283, R, s: (.15 + i * .02) * (c % 2 ? -1 : 1), x: cx, y: cy }));
    });
  }
  addEventListener("resize", build); build();
  cv.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
  cv.addEventListener("pointerleave", () => mouse = { x: -999, y: -999 });
  let t = 0;
  (function draw() {
    t += reduce ? 0 : .016; ctx.clearRect(0, 0, W, H);
    nodes.forEach(n => { if (!n.hub) { const a = n.a + t * n.s; n.x = n.cx + Math.cos(a) * n.R; n.y = n.cy + Math.sin(a) * n.R * .8; } });
    hov = null; let best = 30;
    nodes.forEach(n => { const d = Math.hypot(n.x - mouse.x, n.y - mouse.y); if (d < best) { best = d; hov = n; } });
    const hubs = nodes.filter(n => n.hub);
    ctx.lineWidth = 1;
    hubs.forEach((h, i) => { const o = hubs[(i + 1) % 4]; ctx.strokeStyle = "rgba(255,255,255,.08)"; ctx.beginPath(); ctx.moveTo(h.x, h.y); ctx.lineTo(o.x, o.y); ctx.stroke(); });
    nodes.forEach(n => {
      if (n.hub) return; const h = hubs[n.c], on = hov && (hov === n || hov === h || hov.label === n.label);
      ctx.strokeStyle = on ? cols[n.c] : "rgba(255,255,255,.12)"; ctx.globalAlpha = on ? .9 : 1;
      ctx.beginPath(); ctx.moveTo(h.x, h.y); ctx.lineTo(n.x, n.y); ctx.stroke(); ctx.globalAlpha = 1;
    });
    nodes.forEach(n => {
      const on = hov && (hov === n || (hov.hub && hov.c === n.c) || hov.label === n.label), r = n.hub ? 7 : on ? 6 : 4;
      ctx.fillStyle = cols[n.c]; ctx.shadowColor = cols[n.c]; ctx.shadowBlur = on ? 22 : n.hub ? 14 : 6;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
      ctx.font = `${n.hub ? 500 : 400} ${n.hub ? 13 : 11}px JetBrains Mono, monospace`; ctx.textAlign = "center";
      ctx.fillStyle = on || n.hub ? "#f2f4f8" : "#8b93a7"; ctx.fillText(n.label, n.x, n.y + (n.hub ? -16 : 18));
    });
    requestAnimationFrame(draw);
  })();
})();

/* ===== 9. Hero 3D "Software Core" (Three.js via CDN) ===== */
if (window.THREE) {
  const canvas = $("#core"), R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  R.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(45, 1, .1, 100); cam.position.z = 8;
  const ice = 0x8ab4ff, core = new THREE.Group(); scene.add(core);
  const shell = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.7, 2)), new THREE.LineBasicMaterial({ color: ice, transparent: true, opacity: .35 }));
  const dots = new THREE.Points(new THREE.IcosahedronGeometry(1.2, 5), new THREE.PointsMaterial({ color: 0xf2f4f8, size: .022 }));
  const heart = new THREE.Mesh(new THREE.SphereGeometry(.4, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const glow = new THREE.Mesh(new THREE.SphereGeometry(.85, 32, 32), new THREE.MeshBasicMaterial({ color: ice, transparent: true, opacity: .16, blending: THREE.AdditiveBlending }));
  core.add(shell, dots, heart, glow);
  const rings = [0, 1, 2].map(i => {
    const g = new THREE.Group(), m = new THREE.Mesh(new THREE.TorusGeometry(2.4 + i * .45, .004, 8, 200), new THREE.MeshBasicMaterial({ color: i == 1 ? 0xb39dff : ice, transparent: true, opacity: .5 }));
    const s = new THREE.Mesh(new THREE.SphereGeometry(.06, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })); s.position.x = 2.4 + i * .45;
    g.add(m, s); g.rotation.set(i * 1.1, i * .7, 0); g.userData.v = .4 + i * .25; core.add(g); return g;
  });
  const N = small ? 300 : 900, p = new Float32Array(N * 3).map(() => (Math.random() - .5) * 30);
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(p, 3));
  const field = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x8b93a7, size: .035, transparent: true, opacity: .7 })); scene.add(field);
  let mx = 0, my = 0, sy = 0;
  addEventListener("mousemove", e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  addEventListener("scroll", () => sy = Math.min(1, scrollY / innerHeight), { passive: true });
  function size() { R.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); core.scale.setScalar(innerWidth < 860 ? .62 : 1); }
  addEventListener("resize", size); size();
  const clk = new THREE.Clock();
  (function loop() {
    const t = reduce ? 0 : clk.getElapsedTime();
    core.rotation.y += (mx * 1.4 + t * .15 - core.rotation.y) * .05;
    core.rotation.x += (my * .9 - core.rotation.x) * .05;
    shell.rotation.z = t * .1; dots.rotation.y = -t * .2; glow.scale.setScalar(1 + Math.sin(t * 2) * .06);
    rings.forEach(g => g.rotation.z = t * g.userData.v);
    core.position.y = (innerWidth < 860 ? 1.5 : 1.15) + Math.sin(t) * .1 + sy * 2;
    field.rotation.y = t * .01 + sy * .4;
    canvas.style.opacity = 1 - sy * .85;
    R.render(scene, cam); requestAnimationFrame(loop);
  })();
}
