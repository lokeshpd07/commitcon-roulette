import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight, Check, Clock3, RotateCw, Sparkles, Users, Zap, Volume2, VolumeX, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { landingRotation, type Hindrance } from '@/lib/roulette';

type Props = {
  kind: 'team' | 'challenge';
  items: Hindrance[];
  soundEnabled?: boolean;
};

function sectorPath(index: number) {
  const start = ((index * 45 - 112.5) * Math.PI) / 180;
  const end = start + Math.PI / 4;
  return `M 200 200 L ${200 + 190 * Math.cos(start)} ${200 + 190 * Math.sin(start)} A 190 190 0 0 1 ${200 + 190 * Math.cos(end)} ${200 + 190 * Math.sin(end)} Z`;
}

function labelLines(name: string) {
  if (name.length < 14) return [name];
  const words = name.split(' ');
  const split = Math.ceil(words.length / 2);
  return [words.slice(0, split).join(' '), words.slice(split).join(' ')];
}

export function RouletteWheel({ kind, items, soundEnabled = true }: Props) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Hindrance | null>(null);
  const [open, setOpen] = useState(false);
  const [spins, setSpins] = useState(0);
  const [active, setActive] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [audioMuted, setAudioMuted] = useState(!soundEnabled);

  const pending = useRef<Hindrance | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const clickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isTeam = kind === 'team';
  const challengeNumber = isTeam ? '1' : '2';
  const challengeCode = isTeam ? '01' : '02';
  const title = `Challenge ${challengeNumber}`;
  const subtitle = isTeam ? 'Team Dynamics & Collaboration Hindrances' : 'Solo & Technical Workflow Hindrances';

  // Procedural audio tick generator using Web Audio API
  const playTickSound = useCallback(() => {
    if (audioMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isTeam ? 580 : 720, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch {
      // Audio context might be restricted before interaction; fail silently
    }
  }, [audioMuted, isTeam]);

  const playWinFanfare = useCallback(() => {
    if (audioMuted) return;
    try {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const freqs = isTeam ? [440, 554.37, 659.25, 880] : [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch {
      // Ignore audio errors
    }
  }, [audioMuted, isTeam]);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
    if (clickIntervalRef.current) clearInterval(clickIntervalRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setActive(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [active]);

  function reveal() {
    const selected = pending.current;
    if (!selected) return;
    pending.current = null;
    if (timeout.current) clearTimeout(timeout.current);
    if (clickIntervalRef.current) clearInterval(clickIntervalRef.current);
    
    setResult(selected);
    setSpinning(false);
    setOpen(true);
    setSpins((value) => value + 1);
    playWinFanfare();
  }

  function spin() {
    if (spinning) return;
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    const randomValue = random[0];
    if (randomValue === undefined) return;
    const selectedIndex = Math.floor((randomValue / 4294967296) * items.length);
    const selected = items[selectedIndex];
    if (!selected) return;

    setActive(false);
    setRemaining(0);
    pending.current = selected;
    setSpinning(true);
    setRotation((current) => landingRotation(current, selectedIndex));

    // Play ticking simulation
    let tickCount = 0;
    const maxTicks = 35;
    if (clickIntervalRef.current) clearInterval(clickIntervalRef.current);
    
    const triggerTicks = () => {
      if (tickCount < maxTicks) {
        playTickSound();
        tickCount++;
      }
    };
    
    // Quick initial ticks
    clickIntervalRef.current = setInterval(triggerTicks, 120);

    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timeout.current = setTimeout(reveal, reduced ? 200 : 5400);
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalDuration > 0 ? ((totalDuration - remaining) / totalDuration) * 100 : 0;

  return (
    <section
      className={`roulette-card ${isTeam ? 'theme-challenge-1' : 'theme-challenge-2'} ${spinning ? 'is-spinning' : ''}`}
      aria-label={`${title} roulette`}
    >
      {/* Background ambient lighting */}
      <div className="card-ambient-glow" />

      {/* Card Header */}
      <div className="card-top-bar">
        <div className="card-title-group">
          <div className="challenge-badge">
            <span className="badge-dot" />
            CHALLENGE {challengeCode}
          </div>
          <h2 className="challenge-heading">{title}</h2>
          <p className="challenge-subtext">{subtitle}</p>
        </div>
        <div className="card-actions-group">
          <button
            type="button"
            className="sound-toggle-btn"
            onClick={() => setAudioMuted(!audioMuted)}
            title={audioMuted ? 'Unmute roulette sound' : 'Mute roulette sound'}
            aria-label={audioMuted ? 'Unmute roulette sound' : 'Mute roulette sound'}
          >
            {audioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <div className="category-emblem">
            {isTeam ? <Users size={20} /> : <Zap size={20} />}
          </div>
        </div>
      </div>

      {/* Wheel Stage */}
      <div className="wheel-stage">
        <span className="stage-coordinate coordinate-left">COMMITCON // CH-{challengeCode}</span>
        <span className="stage-coordinate coordinate-right">8 SECTOR MATRIX</span>

        {/* High precision top arrow pointer */}
        <div className="wheel-pointer">
          <div className="pointer-glow" />
          <div className="pointer-needle" />
          <div className="pointer-dot" />
        </div>

        {/* Outer Wheel Housing */}
        <div className="wheel-frame">
          <svg
            className="wheel-svg"
            viewBox="0 0 400 400"
            role="img"
            aria-label={`${title} roulette wheel with eight hindrances`}
          >
            <defs>
              <filter id={`glow-${kind}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
              </filter>
              {items.map((item, index) => (
                <radialGradient
                  key={item.name}
                  id={`${kind}-sector-${index}`}
                  className={`sector-gradient gradient-${index}`}
                  cx="50%"
                  cy="50%"
                  r="75%"
                >
                  <stop offset="0%" className="sector-stop-inner" />
                  <stop offset="100%" className="sector-stop-outer" />
                </radialGradient>
              ))}
            </defs>

            {/* Outer track & mechanical ticks */}
            <circle className="wheel-track" cx="200" cy="200" r="198" />
            <circle className="wheel-track-inner" cx="200" cy="200" r="192" />
            {Array.from({ length: 64 }, (_, index) => (
              <line
                key={index}
                className={index % 8 === 0 ? 'wheel-tick major-tick' : 'wheel-tick'}
                x1="200"
                y1="2"
                x2="200"
                y2={index % 8 === 0 ? '12' : '6'}
                transform={`rotate(${index * 5.625} 200 200)`}
              />
            ))}

            {/* Rotating Rotor */}
            <g
              className="wheel-rotor"
              style={{ transform: `rotate(${rotation}deg)` }}
              onTransitionEnd={reveal}
            >
              {items.map((item, index) => (
                <g key={item.name} className="wheel-sector-group">
                  <path
                    className={`wheel-segment segment-${index}`}
                    fill={`url(#${kind}-sector-${index})`}
                    d={sectorPath(index)}
                  />
                  <g transform={`rotate(${index * 45} 200 200)`}>
                    <path
                      className="sector-ornament"
                      d="M 193 30 L 200 23 L 207 30 L 200 37 Z"
                    />
                    <text
                      className="wheel-text"
                      x="200"
                      y={labelLines(item.name).length > 1 ? '63' : '70'}
                      textAnchor="middle"
                      filter={`url(#glow-${kind})`}
                    >
                      {labelLines(item.name).map((line, lineIndex) => (
                        <tspan key={line} x="200" dy={lineIndex === 0 ? 0 : 13}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                    <line className="sector-rule" x1="188" y1="92" x2="212" y2="92" />
                    <text
                      className="sector-number"
                      x="200"
                      y="114"
                      textAnchor="middle"
                    >
                      {(index + 1).toString().padStart(2, '0')}
                    </text>
                  </g>
                </g>
              ))}
            </g>

            {/* Central hub & glowing code core */}
            <circle className="wheel-inner-orbit" cx="200" cy="200" r="58" />
            <circle className="wheel-center-bevel" cx="200" cy="200" r="45" />
            <circle className="wheel-center" cx="200" cy="200" r="37" />
            <circle className="wheel-center-core" cx="200" cy="200" r="28" />
            <text className="center-label" x="200" y="200" textAnchor="middle">
              &lt;/&gt;
            </text>
            <text className="center-sublabel" x="200" y="214" textAnchor="middle">
              CH·{challengeCode}
            </text>
          </svg>
        </div>
      </div>

      {/* Spin Controls & Actions */}
      <div className="wheel-controls">
        <Button
          variant={kind}
          className="spin-control-btn"
          onClick={spin}
          disabled={spinning}
          aria-label={`Spin ${title}`}
        >
          <RotateCw className={spinning ? 'animate-spin' : 'spin-icon'} />
          <span>{spinning ? 'Fate Deciding...' : `Spin ${title}`}</span>
          {!spinning && <ArrowUpRight className="spin-arrow" />}
        </Button>
      </div>

      {/* Footer Meta & Stats */}
      <div className="wheel-meta-row">
        <div className="meta-item">
          <span className="meta-label">CHALLENGES</span>
          <span className="meta-value">8 ITEMS</span>
        </div>
        <div className="meta-divider">/</div>
        <div className="meta-item">
          <span className="meta-label">SPINS RECORDED</span>
          <span className="meta-value">{spins.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Active Challenge HUD / Status Banner */}
      {active && result ? (
        <div className="active-hud-card">
          <div className="active-hud-header">
            <div className="active-hud-title">
              <span className="hud-pulse-dot" />
              <span>ACTIVE HINDRANCE: {result.name}</span>
            </div>
            <button
              type="button"
              className="hud-dismiss-btn"
              onClick={() => setActive(false)}
              title="Finish or cancel hindrance"
            >
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Done</span>
            </button>
          </div>
          <div className="active-hud-timer">
            <Clock3 size={16} />
            <span className="hud-digits">{formatTime(remaining)}</span>
            <span className="hud-duration-label">/ {result.duration} MIN</span>
          </div>
          <div className="hud-progress-bar">
            <div
              className="hud-progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>
      ) : result ? (
        <div className="last-roll-card">
          <span className="last-roll-tag">LAST SPIN</span>
          <span className="last-roll-name">{result.name}</span>
          <span className="last-roll-time">({result.duration} min)</span>
        </div>
      ) : (
        <div className="idle-status-card">
          <span>Ready to spin · Click button above</span>
        </div>
      )}

      {/* Result Dialog Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`result-modal-v2 ${isTeam ? 'modal-challenge-1' : 'modal-challenge-2'}`}>
          <div className="modal-header-tag">
            <span className="tag-bracket">[</span>
            <span>{title.toUpperCase()} OUTCOME</span>
            <span className="tag-bracket">]</span>
          </div>

          <div className="modal-emblem-glow">
            <div className="result-emblem">
              <Sparkles size={28} />
            </div>
          </div>

          <span className="modal-subtitle">FATE HAS DECIDED YOUR NEXT TWIST</span>
          <DialogTitle className="modal-title">{result?.name}</DialogTitle>

          <div className="modal-duration-pill">
            <Clock3 size={15} />
            <span>ROUND DURATION: {result?.duration} MINUTES</span>
          </div>

          <DialogDescription className="modal-description-box">
            {result?.description}
          </DialogDescription>

          <div className="modal-actions">
            <Button
              size="lg"
              className="accept-challenge-btn"
              onClick={() => {
                if (!result) return;
                const totalSecs = result.duration * 60;
                setTotalDuration(totalSecs);
                setRemaining(totalSecs);
                setActive(true);
                setOpen(false);
              }}
            >
              <Check size={18} />
              <span>Accept {title}</span>
            </Button>
            <Button
              variant="outline"
              className="modal-secondary-btn"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
              <span>Close</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}