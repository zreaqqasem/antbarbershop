export default function Animations() {
  const css = `
@keyframes atb-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes atb-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes atb-float-soft { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
@keyframes atb-spin { to { transform: rotate(360deg); } }
@keyframes atb-spin-rev { to { transform: rotate(-360deg); } }
@keyframes atb-pole { to { background-position: 0 44px; } }
@keyframes atb-marquee { to { transform: translateX(-50%); } }
@keyframes atb-ring { 0% { transform: scale(0.85); opacity: 0.65; } 70% { transform: scale(1.7); opacity: 0; } 100% { opacity: 0; } }
@keyframes atb-shimmer { to { background-position: 200% center; } }
@keyframes atb-blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(26px, -20px) scale(1.08); } 66% { transform: translate(-20px, 16px) scale(0.94); } }
@keyframes atb-snip { 0%, 100% { transform: rotate(-12deg); } 50% { transform: rotate(12deg); } }

.atb-rise { animation: atb-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
.atb-float { animation: atb-float 6s ease-in-out infinite; }
.atb-float-soft { animation: atb-float-soft 7.5s ease-in-out infinite; }
.atb-spin-slow { animation: atb-spin 22s linear infinite; }
.atb-spin-slow-rev { animation: atb-spin-rev 30s linear infinite; }
.atb-snip { animation: atb-snip 3.4s ease-in-out infinite; transform-origin: 50% 50%; }
.atb-blob { animation: atb-blob 18s ease-in-out infinite; }
.atb-ring { animation: atb-ring 3s cubic-bezier(0.22, 1, 0.36, 1) infinite; }

.atb-pole-stripes {
  background-image: repeating-linear-gradient(45deg, #C9A227 0 10px, #0B0B0C 10px 20px, #F5F2EC 20px 26px, #0B0B0C 26px 44px);
  background-size: 44px 44px;
  animation: atb-pole 2.4s linear infinite;
}
.atb-marquee-track { animation: atb-marquee 34s linear infinite; }
.atb-marquee-wrap:hover .atb-marquee-track { animation-play-state: paused; }

.atb-shimmer {
  background: linear-gradient(90deg, #C9A227 0%, #F7E8AE 28%, #C9A227 56%, #C9A227 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: atb-shimmer 5s linear infinite;
}

[data-reveal] {
  transition: opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1), transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
[data-reveal="out"] { opacity: 0; transform: translateY(34px); }
[data-reveal="in"] { opacity: 1; transform: none; }

.atb-lift { transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease, border-color 0.5s ease; }
.atb-lift:hover { transform: translateY(-8px); box-shadow: 0 26px 60px rgba(0, 0, 0, 0.55); }

@media (prefers-reduced-motion: reduce) {
  .atb-rise, .atb-float, .atb-float-soft, .atb-spin-slow, .atb-spin-slow-rev, .atb-snip,
  .atb-blob, .atb-ring, .atb-pole-stripes, .atb-marquee-track, .atb-shimmer { animation: none !important; }
  [data-reveal] { opacity: 1 !important; transform: none !important; }
  .atb-lift:hover { transform: none; }
}
`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}