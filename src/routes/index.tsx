import { createFileRoute } from "@tanstack/react-router";
import { GitBranch, Sparkles, ChevronDown, ChevronUp, ShieldAlert, Terminal } from "lucide-react";
import { RouletteWheel } from "@/components/roulette-wheel";
import { GithubLogo } from "@/components/github-logo";
import { teamHindrances, challengeHindrances } from "@/lib/roulette";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Commitcon Roulette | Challenge 1 & Challenge 2" },
      {
        name: "description",
        content:
          "Two hackathon wheels. Sixteen custom hindrances. Spin Challenge 1 first, then scroll down to take on Challenge 2 at Commitcon.",
      },
      { property: "og:title", content: "Commitcon Roulette | Challenge 1 & Challenge 2" },
      {
        property: "og:description",
        content:
          "Spin Challenge 1 for team dynamics and Challenge 2 for technical twists at Commitcon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/github-logo.svg", type: "image/svg+xml" },
    ],
  }),
  component: Index,
});

function Index() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="event-page">
      {/* Slowed-down dotted animation background video */}
      <video
        className="bg-video"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{ playbackRate: 0.4 } as React.CSSProperties}
        ref={(el) => { if (el) el.playbackRate = 0.4; }}
      >
        <source src="/animation.webm" type="video/webm" />
      </video>
      {/* Dark overlay to keep content readable */}
      <div className="bg-video-overlay" />
      {/* Background ambient lighting overlays */}
      <div className="bg-glow-top" />
      <div className="bg-cyber-grid" />

      {/* Header */}
      <header className="event-header">
        <div className="header-left">
          {/* Prominent Circular GitHub Logo Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="github-logo-link"
            aria-label="GitHub"
            title="GitHub"
          >
            <GithubLogo size={36} />
          </a>

          <a
            href="https://ghcc.psgtech.ac.in/commitcon"
            target="_blank"
            rel="noreferrer"
            className="wordmark"
            aria-label="Commitcon event website"
          >
            <span className="wordmark-symbol">&lt;/&gt;</span>
            <span className="wordmark-text">commitcon</span>
            <span className="text-signal">.</span>
          </a>
          <span className="header-tagline">HACKATHON ROULETTE</span>
        </div>

        {/* Quick Nav Anchors */}
        <div className="header-nav-anchors">
          <button
            type="button"
            className="anchor-link anchor-ch1"
            onClick={() => scrollToSection("challenge-1")}
          >
            <span className="anchor-dot dot-amber" />
            <span>Challenge 1</span>
          </button>
          <button
            type="button"
            className="anchor-link anchor-ch2"
            onClick={() => scrollToSection("challenge-2")}
          >
            <span className="anchor-dot dot-cyan" />
            <span>Challenge 2</span>
          </button>
        </div>

        <div className="header-meta">
          <span className="meta-club">
            <Terminal size={13} className="text-signal" />
            GITHUB CAMPUS CLUB · PSG TECH
          </span>
          <span className="live-badge">
            <span className="live-dot" />
            HACKATHON MODE
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Intro / Hero */}
        <section className="event-intro">
          <div className="github-sponsor-pill">
            <GithubLogo size={18} />
            <span>POWERED BY GITHUB CAMPUS CLUB</span>
          </div>

          <div className="eyebrow">
            <Sparkles size={13} />
            <span>Expect the unexpected</span>
            <Sparkles size={13} />
          </div>

          <h1 className="hero-title">
            Commitcon<br />
            <span className="hero-highlight">Roulette.</span>
          </h1>

          <p className="hero-subtitle">
            Two sequential challenge wheels. First spin <span className="text-amber-400 font-semibold">Challenge 1</span> below for team dynamics, then scroll down to face <span className="text-emerald-400 font-semibold">Challenge 2</span> for technical plot twists.
          </p>
        </section>

        {/* SECTION 1: CHALLENGE 1 (Roulette 1 - First) */}
        <section id="challenge-1" className="roulette-section-container section-challenge-1">
          <div className="section-level-badge level-badge-1">
            <span>LEVEL 01 // FIRST STAGE</span>
          </div>
          
          <div className="single-wheel-wrapper">
            <RouletteWheel kind="team" items={teamHindrances} />
          </div>

          {/* Scroll Down Prompt leading to Challenge 2 */}
          <div className="scroll-down-prompt">
            <button
              type="button"
              className="scroll-down-btn"
              onClick={() => scrollToSection("challenge-2")}
              aria-label="Scroll down to Challenge 2"
            >
              <span className="scroll-prompt-text">NEXT STAGE: CHALLENGE 2</span>
              <div className="scroll-arrow-anim">
                <ChevronDown size={20} className="bounce-arrow" />
              </div>
            </button>
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="stage-divider">
          <div className="stage-divider-line" />
          <div className="stage-divider-diamond">
            <Sparkles size={14} className="text-signal" />
          </div>
          <div className="stage-divider-line" />
        </div>

        {/* SECTION 2: CHALLENGE 2 (Roulette 2 - After Scrolling) */}
        <section id="challenge-2" className="roulette-section-container section-challenge-2">
          <div className="section-level-badge level-badge-2">
            <span>LEVEL 02 // ADVANCED STAGE</span>
          </div>

          <div className="single-wheel-wrapper">
            <RouletteWheel kind="challenge" items={challengeHindrances} />
          </div>

          {/* Quick return to top */}
          <div className="scroll-up-prompt">
            <button
              type="button"
              className="scroll-up-btn"
              onClick={() => scrollToSection("challenge-1")}
              aria-label="Back to Challenge 1"
            >
              <ChevronUp size={16} />
              <span>Back to Challenge 1</span>
            </button>
          </div>
        </section>

        {/* Rules & Guidelines Banner */}
        <section className="rules-section">
          <div className="rules-card">
            <div className="rules-icon">
              <ShieldAlert size={20} className="text-signal" />
            </div>
            <div className="rules-content">
              <h3>Hackathon Roulette Protocol</h3>
              <p>
                When instructed by organizers during each round, spin the designated wheel. Spin <strong>Challenge 1</strong> for team structure and communication twists, and scroll down to spin <strong>Challenge 2</strong> for codebase and tool constraints. Each team must adopt the hindrance immediately and continue building until time expires.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="event-footer">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="footer-brand"
        >
          <GithubLogo size={24} />
          <span>GITHUB CAMPUS CLUB <span className="text-foreground">/ PSG TECH</span></span>
        </a>
        <span className="footer-motto">
          <GitBranch size={13} />
          <span>BUILD. ADAPT. COMMIT.</span>
        </span>
        <span className="footer-edition">COMMITCON · CHALLENGE ROULETTE</span>
      </footer>
    </div>
  );
}
