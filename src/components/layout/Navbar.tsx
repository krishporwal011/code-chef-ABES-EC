import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefLogo } from '../brand/ChefLogo';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, Sun, Moon, Volume2, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Synthetic Web Audio Whistle (Zero external file dependencies)
  const playWhistle = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Train whistle chord (e.g. Eb and G)
      osc1.frequency.setValueAtTime(622.25, ctx.currentTime);
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.8);
      osc2.stop(ctx.currentTime + 0.8);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  const navLinks = [
    { name: 'Platform (Home)', path: '/' },
    { name: 'Departures (Events)', path: '/events' },
    { name: 'Bawarchis (Kitchen)', path: '/#kitchen' },
    { name: 'Control Room', path: '/admin', isSpecial: true },
  ];

  const isActive = (path: string) => {
    if (path.includes('#')) return false;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6EFE3]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-[#DDD2C1] dark:border-[#2A2722] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="focus:outline-hidden focus:ring-2 focus:ring-tomato rounded-lg"
          aria-label="CodeChef ABESEC Bawarchi Express Home"
        >
          <ChefLogo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                link.isSpecial
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:text-tomato flex items-center gap-1.5'
                  : isActive(link.path)
                  ? 'bg-tomato text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-tomato hover:bg-stone-500/10'
              }`}
            >
              {link.isSpecial && <Shield className="w-3.5 h-3.5 text-tomato" />}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Tools: Whistle + Theme Toggle + Reserve CTA */}
        <div className="flex items-center gap-2">
          {/* Whistle Button */}
          <button
            onClick={playWhistle}
            title="Honk Train Whistle"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] text-stone-700 dark:text-stone-300 hover:text-tomato hover:border-tomato transition-colors text-xs font-mono"
            aria-label="Play train whistle horn"
          >
            <Volume2 className="w-3.5 h-3.5 text-tomato" />
            <span className="text-[10px]">Horn</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-tomato hover:border-tomato transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-stone-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Quick Book CTA */}
          <Link
            to="/events"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-tomato hover:bg-tomato-hover text-white rounded-lg font-mono text-xs font-bold tracking-wide uppercase transition-all shadow-xs active:scale-95"
          >
            <span>Book Berth</span>
            <span>🎫</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-tomato"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DDD2C1] dark:border-[#2A2722] bg-[#F6EFE3] dark:bg-[#121110] px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold ${
                isActive(link.path)
                  ? 'bg-tomato text-white'
                  : 'text-stone-800 dark:text-stone-200 hover:bg-stone-500/10'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#DDD2C1] dark:border-[#2A2722] flex items-center justify-between">
            <button
              onClick={playWhistle}
              className="flex items-center gap-1.5 text-xs font-mono text-stone-700 dark:text-stone-300 py-2"
            >
              <Volume2 className="w-4 h-4 text-tomato" />
              <span>Honk Whistle</span>
            </button>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 bg-tomato text-white rounded-lg font-mono text-xs font-bold uppercase"
            >
              Book Berth 🎫
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
