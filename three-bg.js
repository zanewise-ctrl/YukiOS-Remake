const themes = [
  {
    bg0: "#050816",
    bg1: "#0f172a",
    accentA: "#7c3aed",
    accentB: "#22d3ee",
    accentC: "#f472b6",
    glow: "rgba(124,58,237,0.7)"
  },
  {
    bg0: "#070b14",
    bg1: "#0b1120",
    accentA: "#38bdf8",
    accentB: "#a78bfa",
    accentC: "#34d399",
    glow: "rgba(56,189,248,0.7)"
  },
  {
    bg0: "#120b1d",
    bg1: "#1f1231",
    accentA: "#f472b6",
    accentB: "#a78bfa",
    accentC: "#facc15",
    glow: "rgba(244,114,182,0.7)"
  },
  {
    bg0: "#040d12",
    bg1: "#0f172a",
    accentA: "#2dd4bf",
    accentB: "#22d3ee",
    accentC: "#c084fc",
    glow: "rgba(45,212,191,0.7)"
  }
];

const theme = themes[Math.floor(Math.random() * themes.length)];
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let w = 0;
let h = 0;
let particles = [];

function resizeCanvas() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w * window.devicePixelRatio;
  canvas.height = h * window.devicePixelRatio;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  createParticles();
}

function createParticles() {
  const total = Math.min(180, Math.max(120, Math.floor((w * h) / 12)));
  particles = Array.from({ length: total }, () => {
    return {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random() * 2 + 0.5,
      size: Math.random() * 2.8 + 1.2,
      speed: Math.random() * 0.005 + 0.0015,
      drift: (Math.random() - 0.5) * 0.02
    };
  });
}

let rot = 0;

function drawBackground() {
  ctx.clearRect(0, 0, w, h);

  const grd = ctx.createLinearGradient(0, 0, w, h);
  grd.addColorStop(0, theme.bg0);
  grd.addColorStop(1, theme.bg1);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);

  const glowCount = 5;
  for (let i = 0; i < glowCount; i++) {
    const x = (w * (i + 1)) / (glowCount + 1);
    const y = h * (0.25 + (i % 3) * 0.2);
    const radius = 220 + i * 80;

    const g = ctx.createRadialGradient(x, y, 10, x, y, radius);
    g.addColorStop(0, i % 2 === 0 ? theme.accentA : theme.accentB);
    g.addColorStop(0.2, i % 2 === 0 ? theme.accentB : theme.accentC);
    g.addColorStop(0.5, "rgba(255,255,255,0.08)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  const cx = w / 2;
  const cy = h / 2;

  for (const p of particles) {
    p.x += p.drift * 0.4;
    p.y += Math.sin((p.z + rot) * 2) * 0.0015;

    const rx = p.x * Math.cos(rot) - p.z * Math.sin(rot);
    const rz = p.x * Math.sin(rot) + p.z * Math.cos(rot);
    const perspective = 1 / (1.8 + rz * 2.2);
    const px = cx + rx * 420 * perspective;
    const py = cy + p.y * 300 * perspective;

    if (px > -10 && px < w + 10 && py > -10 && py < h + 10) {
      const alpha = Math.min(1, 0.25 + perspective * 0.9);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, p.size * perspective, 0, Math.PI * 2);
      ctx.fill();

      if (Math.random() > 0.96) {
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + p.size * 10, py + p.size * 6);
        ctx.stroke();
      }
    }
  }

  rot += 0.0035;
  requestAnimationFrame(drawBackground);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(drawBackground);