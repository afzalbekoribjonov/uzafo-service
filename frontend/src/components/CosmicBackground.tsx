import { useRef, useEffect, useState } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  o: number;
  s: number;
  isSupernova?: boolean;
  supernovaProgress?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface SpaceObject {
  x: number;
  y: number;
  angle: number;
  speed: number;
  active: boolean;
  waitFrames: number;
  type: 'rocket' | 'satellite' | 'comet';
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  
  const rocketRef = useRef<SpaceObject>({
    x: -100, y: -100, angle: 0, speed: 2, active: false, waitFrames: 60, type: 'rocket'
  });
  const satelliteRef = useRef<SpaceObject>({
    x: -100, y: -100, angle: 0, speed: 0.5, active: false, waitFrames: 180, type: 'satellite'
  });
  const cometRef = useRef<SpaceObject>({
    x: -100, y: -100, angle: 0, speed: 0.8, active: false, waitFrames: 400, type: 'comet'
  });
  
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      if (!canvas) return;
      const count = Math.min(250, Math.floor((canvas.width * canvas.height) / 4000));
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.5 + 0.3,
        o: Math.random() * 0.7 + 0.3,
        s: Math.random() * 1.5 + 0.3,
      }));
    }

    function resetObject(objRef: { current: SpaceObject }) {
      if (!canvas) return;
      const side = Math.floor(Math.random() * 4);
      let x, y, angle;

      if (side === 0) { x = -50; y = Math.random() * canvas.height; angle = (Math.random() - 0.5) * Math.PI / 4; }
      else if (side === 1) { x = canvas.width + 50; y = Math.random() * canvas.height; angle = Math.PI + (Math.random() - 0.5) * Math.PI / 4; }
      else if (side === 2) { x = Math.random() * canvas.width; y = -50; angle = Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 4; }
      else { x = Math.random() * canvas.width; y = canvas.height + 50; angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 4; }

      objRef.current = {
        ...objRef.current,
        x, y, angle,
        speed: objRef.current.type === 'rocket' ? 1.5 + Math.random() * 1.5 : 
               objRef.current.type === 'comet' ? 0.7 + Math.random() * 0.5 : 0.4 + Math.random() * 0.4,
        active: true,
        waitFrames: 0
      };
    }

    function createParticle(x: number, y: number, angle: number, type: 'rocket' | 'comet') {
      const spread = type === 'rocket' ? 0.2 : 0.1;
      const pAngle = angle + Math.PI + (Math.random() - 0.5) * spread;
      const speed = type === 'rocket' ? 1 + Math.random() * 2 : 0.5 + Math.random();
      
      particlesRef.current.push({
        x, y,
        vx: Math.cos(pAngle) * speed,
        vy: Math.sin(pAngle) * speed,
        life: 1,
        maxLife: type === 'rocket' ? 20 + Math.random() * 20 : 60 + Math.random() * 40,
        size: type === 'rocket' ? 1 + Math.random() * 2 : 0.5 + Math.random() * 1.5,
        color: type === 'rocket' ? (Math.random() > 0.5 ? '#f59e0b' : '#ef4444') : '#93c5fd'
      });
    }

    function drawRocket(ctx: CanvasRenderingContext2D) {
      const r = rocketRef.current;
      if (!r.active) {
        r.waitFrames--;
        if (r.waitFrames <= 0) resetObject(rocketRef);
        return;
      }

      r.x += Math.cos(r.angle) * r.speed;
      r.y += Math.sin(r.angle) * r.speed;

      // Rocket particles
      if (Math.random() > 0.3) {
        createParticle(r.x - Math.cos(r.angle) * 10, r.y - Math.sin(r.angle) * 10, r.angle, 'rocket');
      }

      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(r.angle);

      const flick = 0.7 + Math.sin(Date.now() * 0.04) * 0.15 + Math.random() * 0.15;

      // Exhaust flame (drawn first, behind the body)
      const flameLen = 28 * flick;
      const fg = ctx.createLinearGradient(-13, 0, -13 - flameLen, 0);
      fg.addColorStop(0, 'rgba(255,255,255,0.95)');
      fg.addColorStop(0.25, 'rgba(255,214,102,0.9)');
      fg.addColorStop(0.6, 'rgba(249,115,22,0.65)');
      fg.addColorStop(1, 'rgba(239,68,68,0)');
      ctx.beginPath();
      ctx.moveTo(-13, -4.5);
      ctx.quadraticCurveTo(-13 - flameLen, 0, -13, 4.5);
      ctx.closePath();
      ctx.fillStyle = fg;
      ctx.fill();
      // Inner hot core
      ctx.beginPath();
      ctx.moveTo(-13, -2.2);
      ctx.quadraticCurveTo(-13 - flameLen * 0.55, 0, -13, 2.2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fill();

      // Tail fins
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-8, -5.5);
      ctx.lineTo(-16, -11);
      ctx.lineTo(-12, -5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-8, 5.5);
      ctx.lineTo(-16, 11);
      ctx.lineTo(-12, 5);
      ctx.closePath();
      ctx.fill();

      // Fuselage (metallic capsule)
      const bg = ctx.createLinearGradient(0, -7, 0, 7);
      bg.addColorStop(0, '#ffffff');
      bg.addColorStop(0.5, '#cbd5e1');
      bg.addColorStop(1, '#8a97a8');
      ctx.beginPath();
      ctx.moveTo(-13, -6);
      ctx.lineTo(8, -6);
      ctx.lineTo(8, 6);
      ctx.lineTo(-13, 6);
      ctx.quadraticCurveTo(-17, 0, -13, -6);
      ctx.closePath();
      ctx.fillStyle = bg;
      ctx.fill();

      // Nose cone
      ctx.beginPath();
      ctx.moveTo(8, -6);
      ctx.quadraticCurveTo(24, 0, 8, 6);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      // Accent stripe
      ctx.fillStyle = 'rgba(79,70,229,0.9)';
      ctx.fillRect(-2, -6, 4, 12);

      // Cockpit window
      ctx.beginPath();
      ctx.arc(5, 0, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.stroke();

      ctx.restore();

      if (canvas && (r.x < -200 || r.x > canvas.width + 200 || r.y < -200 || r.y > canvas.height + 200)) {
        r.active = false;
        r.waitFrames = 300 + Math.random() * 600;
      }
    }

    function drawComet(ctx: CanvasRenderingContext2D) {
      const c = cometRef.current;
      if (!c.active) {
        c.waitFrames--;
        if (c.waitFrames <= 0) resetObject(cometRef);
        return;
      }

      c.x += Math.cos(c.angle) * c.speed;
      c.y += Math.sin(c.angle) * c.speed;

      // Comet trail particles
      for (let i = 0; i < 2; i++) {
        createParticle(c.x, c.y, c.angle, 'comet');
      }

      ctx.save();
      ctx.translate(c.x, c.y);
      
      // Comet Head (Glow)
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 8);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(147, 197, 253, 0.8)');
      gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
      
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.restore();

      if (canvas && (c.x < -200 || c.x > canvas.width + 200 || c.y < -200 || c.y > canvas.height + 200)) {
        c.active = false;
        c.waitFrames = 800 + Math.random() * 1200;
      }
    }

    function drawSatellite(ctx: CanvasRenderingContext2D) {
      const s = satelliteRef.current;
      if (!s.active) {
        s.waitFrames--;
        if (s.waitFrames <= 0) resetObject(satelliteRef);
        return;
      }

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle + 0.2);

      // Booms connecting the panels to the bus
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-13, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(13, 0); ctx.stroke();

      // Solar panel wings (segmented photovoltaic cells)
      const drawPanel = (sx: number) => {
        const w = 22, h = 18, pad = 1.5, cols = 3, rows = 3;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(sx, -h / 2, w, h);
        const cw = (w - pad * (cols + 1)) / cols;
        const ch = (h - pad * (rows + 1)) / rows;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? '#2563eb' : '#1e3a8a';
            ctx.fillRect(sx + pad + col * (cw + pad), -h / 2 + pad + row * (ch + pad), cw, ch);
          }
        }
        // Sun glare across the panel
        const gl = ctx.createLinearGradient(sx, -h / 2, sx + w, h / 2);
        gl.addColorStop(0, 'rgba(255,255,255,0.28)');
        gl.addColorStop(0.5, 'rgba(255,255,255,0)');
        ctx.fillStyle = gl;
        ctx.fillRect(sx, -h / 2, w, h);
      };
      drawPanel(-35);
      drawPanel(13);

      // Central bus wrapped in gold thermal foil
      const bgd = ctx.createLinearGradient(0, -9, 0, 9);
      bgd.addColorStop(0, '#fde68a');
      bgd.addColorStop(0.5, '#d4a017');
      bgd.addColorStop(1, '#8a6a1f');
      ctx.fillStyle = bgd;
      ctx.beginPath();
      ctx.roundRect(-8, -9, 16, 18, 2);
      ctx.fill();
      // Foil crinkle lines
      ctx.strokeStyle = 'rgba(120,90,20,0.5)';
      ctx.lineWidth = 0.6;
      for (let i = -6; i <= 6; i += 3) {
        ctx.beginPath(); ctx.moveTo(-8, i); ctx.lineTo(8, i); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.roundRect(-8, -9, 16, 18, 2); ctx.stroke();

      // High-gain dish antenna
      ctx.save();
      ctx.translate(0, -9);
      ctx.rotate(-0.3);
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(0, -3, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.strokeStyle = '#cbd5e1';
      ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(0, 0); ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.beginPath(); ctx.arc(0, -3, 1, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Communications mast
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 9); ctx.lineTo(0, 15); ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath(); ctx.arc(0, 15, 1.2, 0, Math.PI * 2); ctx.fill();

      // Blinking navigation beacon
      const blink = (Math.sin(Date.now() * 0.006) + 1) / 2;
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(239,68,68,${0.4 + blink * 0.6})`;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 6 * blink;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      if (canvas && (s.x < -200 || s.x > canvas.width + 200 || s.y < -200 || s.y > canvas.height + 200)) {
        s.active = false;
        s.waitFrames = 600 + Math.random() * 1000;
      }
    }

    function updateSupernovas() {
      if (Math.random() < 0.005) {
        const availableStars = starsRef.current.filter(s => !s.isSupernova);
        if (availableStars.length > 0) {
          const star = availableStars[Math.floor(Math.random() * availableStars.length)];
          star.isSupernova = true;
          star.supernovaProgress = 0;
        }
      }

      starsRef.current.forEach(star => {
        if (star.isSupernova && star.supernovaProgress !== undefined) {
          star.supernovaProgress += 0.01;
          if (star.supernovaProgress >= 1) {
            star.isSupernova = false;
            star.supernovaProgress = 0;
          }
        }
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      const dx = (mouseRef.current.x - cx) * 0.005;
      const dy = (mouseRef.current.y - cy) * 0.005;

      const bhX = canvas.width * 0.8;
      const bhY = canvas.height * 0.2;

      const applyLensing = (x: number, y: number) => {
        const dx_bh = x - bhX;
        const dy_bh = y - bhY;
        const dist_bh = Math.sqrt(dx_bh * dx_bh + dy_bh * dy_bh);
        if (dist_bh < 250 && dist_bh > 5) {
          const strength = Math.pow(1 - dist_bh / 250, 2) * 50;
          return {
            lx: x - (dx_bh / dist_bh) * strength,
            ly: y - (dy_bh / dist_bh) * strength
          };
        }
        return { lx: x, ly: y };
      };

      updateSupernovas();

      starsRef.current.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        let radius = star.r;
        let opacity = star.o;

        const { lx, ly } = applyLensing(star.x + dx * star.s, star.y + dy * star.s);

        if (star.isSupernova && star.supernovaProgress !== undefined) {
          const p = star.supernovaProgress;
          const scale = p < 0.2 ? 1 + (p / 0.2) * 4 : 5 - ((p - 0.2) / 0.8) * 4;
          radius *= scale;
          opacity = p < 0.2 ? star.o + (1 - star.o) * (p / 0.2) : 1 - ((p - 0.2) / 0.8);
          
          ctx.beginPath();
          ctx.arc(lx, ly, radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(lx, ly, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      // Particles with lensing
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        
        const opacity = 1 - (p.life / p.maxLife);
        if (opacity <= 0) return false;

        const { lx, ly } = applyLensing(p.x, p.y);

        ctx.beginPath();
        ctx.arc(lx, ly, p.size * opacity, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        return p.life < p.maxLife;
      });

      drawRocket(ctx);
      drawSatellite(ctx);
      drawComet(ctx);
      drawBlackHole(ctx, bhX, bhY);
      
      rafRef.current = requestAnimationFrame(draw);
    }

    function drawBlackHole(ctx: CanvasRenderingContext2D, x: number, y: number) {
      // Accretion disk glow
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 70);
      grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(0.3, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(0.5, 'rgba(79, 70, 229, 0.2)');
      grad.addColorStop(1, 'rgba(79, 70, 229, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, 70, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      
      // Rotating disk line
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Date.now() * 0.0005);
      ctx.beginPath();
      ctx.ellipse(0, 0, 50, 8, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Event Horizon
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setParallax({
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy
      });
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: '#050505' }} />

      {/* Dynamic Nebula Blobs */}
      <div
        className="absolute rounded-full opacity-40"
        style={{
          width: 600, height: 600,
          top: '-10%', left: '10%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'nebulaDrift 25s ease-in-out infinite alternate, nebulaColor 30s linear infinite',
          transform: `translate(${parallax.x * 30}px, ${parallax.y * 30}px)`,
          transition: 'transform 0.4s ease-out'
        }}
      />
      <div
        className="absolute rounded-full opacity-30"
        style={{
          width: 500, height: 500,
          top: '50%', left: '60%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'nebulaDrift 35s ease-in-out infinite alternate-reverse, nebulaColor 40s linear infinite reverse',
          transform: `translate(${parallax.x * -40}px, ${parallax.y * -40}px)`,
          transition: 'transform 0.4s ease-out'
        }}
      />
      <div
        className="absolute rounded-full opacity-25"
        style={{
          width: 450, height: 450,
          top: '20%', left: '70%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'nebulaDrift 30s ease-in-out infinite alternate, nebulaColor 45s linear infinite',
          animationDelay: '-10s',
          transform: `translate(${parallax.x * 50}px, ${parallax.y * 50}px)`,
          transition: 'transform 0.4s ease-out'
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0" />

      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(5,5,5,0.8) 100%)',
        }}
      />

      <style>{`
        @keyframes nebulaDrift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(40px, 30px) scale(1.1); }
        }
        @keyframes nebulaColor {
          0% { filter: blur(100px) hue-rotate(0deg); }
          100% { filter: blur(100px) hue-rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

