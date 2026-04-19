import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Moon, Sun, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)', transition: 'all 0.3s' }}>
      <header style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <div className="app-logo" style={{ fontSize: '1.5rem' }}>
          <Book size={28} color="var(--apple-blue)" />
          JotSpace
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button onClick={toggleTheme} className="action-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Sign In</Link>
          <Link to="/register" className="btn-primary sm" style={{ textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>
      </header>

      <main className="container animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 2rem' }}>


        <h1 style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '800px' }}>
          Your Mind's Workspace, <br />Beautifully Organized.
        </h1>

        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
          Capture thoughts, manage ideas securely, and experience the fastest sync engine. Built on a clean, distraction-free aesthetic.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/register" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', textDecoration: 'none' }}>
            Start for free <ArrowRight size={20} />
          </Link>
        </div>

        <div className="notes-grid" style={{ marginTop: '5rem', width: '100%', maxWidth: '1000px', textAlign: 'left', pointerEvents: 'none', opacity: 0.8 }}>
          {/* Decorative Preview Cards */}
          <div className="note-card" style={{ transform: 'rotate(-2deg)', boxShadow: 'var(--shadow-float)' }}>
            <h3 className="note-title">Meeting with Engineering</h3>
            <p className="note-content">Key takeaways: Move token to HttpOnly strictly. Expand the caching limits on Redis. Roll out the UI redesign focusing on the Apple Monochrome aesthetic...</p>
          </div>
          <div className="note-card" style={{ transform: 'translateY(-20px) rotate(1deg)', boxShadow: 'var(--shadow-float)', border: '2px solid var(--apple-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--apple-blue)', fontWeight: 600 }}><Zap size={18} /> Ultra-Fast Sync</div>
            <h3 className="note-title">Next-Gen Architecture</h3>
            <p className="note-content">Testing global context routing vs individual interceptors. Performance is drastically improved.</p>
          </div>
          <div className="note-card" style={{ transform: 'rotate(2deg)', boxShadow: 'var(--shadow-float)' }}>
            <h3 className="note-title">Shopping List</h3>
            <p className="note-content">1. Coffee Beans (Dark Roast)<br />2. Almond Milk<br />3. Mechanical Keyboard Switches</p>
          </div>
        </div>
      </main>
    </div>
  );
};
