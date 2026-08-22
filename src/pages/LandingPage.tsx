import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthPage } from './AuthPage';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import {
  Clock,
  CalendarCheck,
  CreditCard,
  BarChart3,
  ChevronRight,
  UserCircle,
  ShieldCheck,
  ArrowRight,
  Check,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   THEME MANAGEMENT
   ═══════════════════════════════════════════════════ */
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('dayflow-theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('dayflow-theme', theme);
  }, [theme]);

  // Clean up any stale data-theme on document when landing page unmounts
  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  return { theme, toggle };
}

/* ═══════════════════════════════════════════════════
   MOTION VOCABULARY — 4 named patterns
   ═══════════════════════════════════════════════════ */
const MOTION = {
  /* 1. Section entrance: grouped fade + slide up */
  sectionContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
  },
  sectionChild: {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  },

  /* 2. Hero word reveal */
  heroWord: {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    }),
  },

  /* 3. Card hover depth: scale + shadow via whileHover */
  cardHover: {
    rest: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
  },

  /* 4. Count-up for metrics */
  countUp: (target: number, duration = 1.2) => ({
    from: 0,
    to: target,
    duration,
    ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
  }),
};

/* ═══════════════════════════════════════════════════
   REUSABLE: Section with InView trigger
   ═══════════════════════════════════════════════════ */
const MotionSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}> = ({ children, className, id, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={style}
      variants={MOTION.sectionContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.section>
  );
};

/* ═══════════════════════════════════════════════════
   COUNTER — animates number on scroll
   ═══════════════════════════════════════════════════ */
const Counter: React.FC<{ value: number; label: string; suffix?: string }> = ({
  value,
  label,
  suffix = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<HTMLElement>, { once: true });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, reduced]);

  return (
    <div style={{ textAlign: 'center' }}>
      <span
        ref={ref}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 800,
          color: 'var(--color-primary)',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          display: 'block',
        }}
      >
        {display}{suffix}
      </span>
      <span
        style={{
          fontSize: 13,
          color: 'var(--color-text-muted)',
          marginTop: 4,
          display: 'block',
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   HERO MOCKUP — theme-aware, with live animations
   ═══════════════════════════════════════════════════ */
const StatusBadgePulse: React.FC = () => {
  const [approved, setApproved] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setApproved((v) => !v), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={approved ? 'approved' : 'pending'}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        style={{
          fontSize: 9,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 4,
          background: approved ? 'var(--color-status-success-bg)' : 'var(--color-status-warning-bg)',
          color: approved ? 'var(--color-status-success)' : 'var(--color-status-warning)',
          display: 'inline-block',
        }}
      >
        {approved ? 'Approved' : 'Pending'}
      </motion.span>
    </AnimatePresence>
  );
};

const DashboardMock: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [3, -3]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-3, 3]), { stiffness: 150, damping: 20 });
  const reduced = useReducedMotion();

  const handleMouse = (e: React.MouseEvent) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        perspective: 1200,
        rotateX: reduced ? 0 : rotateX,
        rotateY: reduced ? 0 : rotateY,
        borderRadius: 14,
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
        boxShadow: `0 24px 80px -12px var(--color-card-shadow), 0 0 0 1px var(--color-border)`,
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 14px',
          background: 'var(--color-border-subtle)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#fca5a5' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#fde68a' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#86efac' }} />
        <span
          style={{
            marginLeft: 12,
            flex: 1,
            height: 22,
            borderRadius: 6,
            background: 'var(--color-border)',
            fontSize: 11,
            color: 'var(--color-text-faint)',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 10,
            fontFamily: 'var(--font-sans)',
          }}
        >
          dayflow.app/dashboard
        </span>
      </div>

      {/* Dashboard */}
      <div style={{ display: 'flex', minHeight: 290 }}>
        {/* Sidebar */}
        <div
          style={{
            width: 54,
            background: 'var(--color-mock-sidebar)',
            padding: '16px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            flexShrink: 0,
          }}
        >
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--color-primary)' }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: i === 1 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)',
              }}
            />
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: 18, background: 'var(--color-mock-body)' }}>
          {/* Topbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ width: 100, height: 12, borderRadius: 3, background: 'var(--color-border)' }} />
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-primary-soft)' }} />
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'Present', value: '42', accent: 'var(--color-status-success)' },
              { label: 'On Leave', value: '3', accent: 'var(--color-status-warning)' },
              { label: 'Pending', value: '7', accent: 'var(--color-primary)' },
            ].map((c) => (
              <div
                key={c.label}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: 8, color: 'var(--color-text-faint)', marginBottom: 3 }}>{c.label}</div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: c.accent,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {c.value}
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div
              style={{
                display: 'flex',
                gap: 6,
                padding: '7px 10px',
                background: 'var(--color-border-subtle)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {['Employee', 'Dept', 'Status', 'Time'].map((h) => (
                <div
                  key={h}
                  style={{
                    flex: 1,
                    fontSize: 8,
                    color: 'var(--color-text-faint)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
            {[
              { name: 'Alex Morgan', dept: 'Engineering', status: 'Present', time: '09:02', ok: true },
              { name: 'Priya Sharma', dept: 'Design', status: 'Present', time: '09:15', ok: true },
              { name: 'Jordan Lee', dept: 'Product', status: 'Leave', time: '—', ok: false },
            ].map((row, i) => (
              <div
                key={row.name}
                style={{
                  display: 'flex',
                  gap: 6,
                  padding: '8px 10px',
                  borderBottom: i < 2 ? '1px solid var(--color-border-subtle)' : 'none',
                  fontSize: 10,
                  color: 'var(--color-text-secondary)',
                }}
              >
                <div style={{ flex: 1, fontWeight: 500, color: 'var(--color-text)' }}>{row.name}</div>
                <div style={{ flex: 1 }}>{row.dept}</div>
                <div style={{ flex: 1 }}>
                  {i === 2 ? <StatusBadgePulse /> : (
                    <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-status-success)' }}>
                      {row.status}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, fontVariantNumeric: 'tabular-nums' }}>{row.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════
   FEATURE MOCKS — theme-aware
   ═══════════════════════════════════════════════════ */
const FeatureMock: React.FC<{ type: 'attendance' | 'leave' | 'payroll' | 'analytics' }> = ({ type }) => {
  const s = {
    card: {
      padding: 18,
      background: 'var(--color-surface)',
      borderRadius: 10,
      border: '1px solid var(--color-border)',
    } as React.CSSProperties,
    label: { fontSize: 11, fontWeight: 600, color: 'var(--color-text)', marginBottom: 12, fontFamily: 'var(--font-display)' } as React.CSSProperties,
    smallLabel: { fontSize: 8, color: 'var(--color-text-faint)', marginBottom: 3 } as React.CSSProperties,
    bigNum: { fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' as const, color: 'var(--color-text)' } as React.CSSProperties,
  };

  if (type === 'attendance') {
    return (
      <div style={s.card}>
        <div style={s.label}>Today's Attendance</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { l: 'Checked In', v: '09:02 AM', bg: 'var(--color-status-success-bg)' },
            { l: 'Expected Out', v: '06:02 PM', bg: 'var(--color-primary-soft)' },
            { l: 'Hours', v: '4h 23m', bg: 'var(--color-border-subtle)' },
          ].map((c) => (
            <div key={c.l} style={{ flex: 1, textAlign: 'center', padding: '8px 6px', borderRadius: 8, background: c.bg }}>
              <div style={s.smallLabel}>{c.l}</div>
              <div style={{ ...s.bigNum, fontSize: 12 }}>{c.v}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--color-border)', position: 'relative' }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '55%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            style={{ height: '100%', borderRadius: 3, background: 'var(--color-status-success)' }}
          />
        </div>
      </div>
    );
  }

  if (type === 'leave') {
    return (
      <div style={s.card}>
        <div style={s.label}>Leave Requests</div>
        {[
          { n: 'Priya Sharma', t: 'Sick Leave · 2 days', status: 'Pending', c: 'var(--color-status-warning)', bg: 'var(--color-status-warning-bg)' },
          { n: 'Jordan Lee', t: 'Vacation · 5 days', status: 'Approved', c: 'var(--color-status-success)', bg: 'var(--color-status-success-bg)' },
          { n: 'Sam Wilson', t: 'Personal · 1 day', status: 'Pending', c: 'var(--color-status-warning)', bg: 'var(--color-status-warning-bg)' },
        ].map((r) => (
          <div key={r.n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--color-border-subtle)', fontSize: 11 }}>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{r.n}</div>
              <div style={{ fontSize: 9, color: 'var(--color-text-faint)' }}>{r.t}</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: r.bg, color: r.c }}>{r.status}</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'payroll') {
    return (
      <div style={s.card}>
        <div style={s.label}>August 2026 Payroll</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, padding: 8, borderRadius: 8, background: 'var(--color-status-success-bg)', textAlign: 'center' }}>
            <div style={s.smallLabel}>Net Pay</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-status-success)', fontVariantNumeric: 'tabular-nums' }}>₹52,400</div>
          </div>
          <div style={{ flex: 1, padding: 8, borderRadius: 8, background: 'var(--color-status-danger-bg)', textAlign: 'center' }}>
            <div style={s.smallLabel}>Deductions</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-status-danger)', fontVariantNumeric: 'tabular-nums' }}>₹7,600</div>
          </div>
        </div>
        {[
          { l: 'Basic', a: '₹30,000' },
          { l: 'HRA', a: '₹15,000' },
          { l: 'Allowances', a: '₹15,000' },
        ].map((row) => (
          <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--color-border-subtle)', fontSize: 11 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>{row.l}</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>{row.a}</span>
          </div>
        ))}
      </div>
    );
  }

  // analytics
  return (
    <div style={s.card}>
      <div style={s.label}>Workforce Overview</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90, marginBottom: 10 }}>
        {[65, 80, 45, 90, 72, 55, 85].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: h }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '3px 3px 0 0',
                background: i === 3 ? 'var(--color-primary)' : 'var(--color-primary-soft)',
              }}
            />
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: 'var(--color-text-faint)' }}>{d}</span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   NAV LINK with draw-in underline
   ═══════════════════════════════════════════════════ */
const NavLink: React.FC<{ href: string; children: string }> = ({ href, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        fontSize: 14,
        color: hovered ? 'var(--color-text)' : 'var(--color-text-secondary)',
        textDecoration: 'none',
        fontWeight: 500,
        paddingBottom: 2,
      }}
    >
      {children}
      <motion.span
        style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          height: 2,
          borderRadius: 1,
          background: 'var(--color-primary)',
        }}
        initial={{ width: 0 }}
        animate={{ width: hovered ? '100%' : 0 }}
        transition={{ duration: 0.2 }}
      />
    </a>
  );
};

/* ═══════════════════════════════════════════════════
   CTA BUTTON with shine sweep
   ═══════════════════════════════════════════════════ */
const CTAButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'ghost';
}> = ({ children, onClick, size = 'md', variant = 'primary' }) => {
  const pad = size === 'lg' ? '14px 32px' : size === 'sm' ? '8px 18px' : '10px 24px';
  const fs = size === 'lg' ? 16 : size === 'sm' ? 13 : 14;

  const isPrimary = variant === 'primary';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: pad,
        borderRadius: 10,
        background: isPrimary ? 'var(--color-primary)' : 'transparent',
        color: isPrimary ? 'var(--color-on-primary)' : 'var(--color-text)',
        fontWeight: 600,
        fontSize: fs,
        border: isPrimary ? 'none' : '1px solid var(--color-border)',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: isPrimary ? '0 2px 10px var(--color-primary-glow)' : 'none',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Shine sweep on hover */}
      {isPrimary && (
        <motion.span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%)',
            pointerEvents: 'none',
          }}
          initial={{ x: '-120%' }}
          whileHover={{ x: '120%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      {children}
    </motion.button>
  );
};

/* ═══════════════════════════════════════════════════
   THEME TOGGLE with morphing icon
   ═══════════════════════════════════════════════════ */
const ThemeToggle: React.FC<{ theme: string; toggle: () => void }> = ({ theme, toggle }) => (
  <motion.button
    onClick={toggle}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9, rotate: 90 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    style={{
      width: 36,
      height: 36,
      borderRadius: 8,
      background: 'var(--color-border-subtle)',
      border: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--color-text-secondary)',
    }}
    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
  >
    <AnimatePresence mode="wait">
      {theme === 'light' ? (
        <motion.div
          key="sun"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Sun size={17} />
        </motion.div>
      ) : (
        <motion.div
          key="moon"
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Moon size={17} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

/* ═══════════════════════════════════════════════════
   HOW-IT-WORKS connecting line that draws on scroll
   ═══════════════════════════════════════════════════ */
const DrawingLine: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as unknown as React.RefObject<HTMLElement>, { once: true, margin: '-100px' });
  const reduced = useReducedMotion();

  return (
    <svg
      ref={ref}
      width="100%"
      height="4"
      style={{ position: 'absolute', top: 32, left: 0, right: 0, zIndex: 0 }}
      preserveAspectRatio="none"
    >
      <motion.line
        x1="16.7%"
        y1="2"
        x2="83.3%"
        y2="2"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeDasharray="1000"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 1000 }}
        animate={inView ? { strokeDashoffset: 0 } : {}}
        transition={{ duration: reduced ? 0 : 1.2, ease: 'easeInOut' }}
        style={{ opacity: 0.3 }}
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════
   SCROLL-LINKED GLOW — ambient hue shift
   ═══════════════════════════════════════════════════ */
const AmbientGlow: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const hue = useTransform(scrollYProgress, [0, 1], [220, 260]);
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '-30vh',
        left: '50%',
        width: '80vw',
        height: '60vh',
        borderRadius: '50%',
        background: `radial-gradient(ellipse at center, hsla(${hue}, 60%, 55%, 0.04), transparent 70%)`,
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(60px)',
      }}
    />
  );
};

/* ═══════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════ */
export const LandingPage: React.FC = () => {
  const auth = useAuth();
  const { theme, toggle } = useTheme();
  const [showAuth, setShowAuth] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (showAuth) return <AuthPage onBackToHome={() => setShowAuth(false)} />;

  const goToAuth = () => setShowAuth(true);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Roles', href: '#roles' },
  ];

  const heroWords = ['Every', 'workday,', 'perfectly', 'aligned.'];

  const features = [
    {
      headline: "Know who's in, instantly",
      body: 'One-click check-in. Real-time attendance matrix. Shift hours calculated automatically — no spreadsheets, no guesswork.',
      type: 'attendance' as const,
      reverse: false,
    },
    {
      headline: "Leave requests that don't disappear into email",
      body: 'Employees apply in two taps. Admins see a triage queue with approve and reject in one click. Balance updates on the spot.',
      type: 'leave' as const,
      reverse: true,
    },
    {
      headline: 'Payroll, calculated and documented',
      body: 'Basic, HRA, allowances, deductions — all visible. Generate PDF salary slips instantly. Every number aligned so columns actually line up.',
      type: 'payroll' as const,
      reverse: false,
    },
    {
      headline: 'See the patterns, not just the data',
      body: 'Department-level attendance trends, leave utilization rates, and payroll summaries — in charts your leadership team can actually read.',
      type: 'analytics' as const,
      reverse: true,
    },
  ];

  return (
    <div
      className="landing-root"
      data-theme={theme}
      style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: 'var(--color-bg)', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}
    >
      <AmbientGlow />

      {/* ────────── NAV ────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--color-nav-bg)',
          backdropFilter: navScrolled ? 'blur(16px) saturate(1.2)' : 'blur(8px)',
          borderBottom: `1px solid ${navScrolled ? 'var(--color-border)' : 'transparent'}`,
          transition: 'border-color 0.3s, backdrop-filter 0.3s',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--color-text)',
                color: 'var(--color-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 14,
                fontFamily: 'var(--font-display)',
              }}
            >
              D
            </div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 20,
                color: 'var(--color-text)',
                letterSpacing: -0.5,
              }}
            >
              Dayflow
            </span>
          </div>

          {/* Desktop */}
          <div className="landing-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {navLinks.map((l) => (
              <NavLink key={l.label} href={l.href}>{l.label}</NavLink>
            ))}
            <ThemeToggle theme={theme} toggle={toggle} />
            <CTAButton onClick={goToAuth} size="sm">Get Started</CTAButton>
          </div>

          {/* Mobile */}
          <div className="landing-mobile-toggle" style={{ display: 'none', alignItems: 'center', gap: 8 }}>
            <ThemeToggle theme={theme} toggle={toggle} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden', padding: '0 24px', background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}
            >
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'block', padding: '12px 0', fontSize: 15, color: 'var(--color-text)', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid var(--color-border-subtle)' }}
                >
                  {l.label}
                </a>
              ))}
              <div style={{ padding: '12px 0' }}>
                <CTAButton onClick={goToAuth} size="md">Get Started</CTAButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ────────── HERO ────────── */}
      <section style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '50vw',
            height: '50vw',
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, var(--color-hero-glow), transparent 70%)`,
            pointerEvents: 'none',
            filter: 'blur(40px)',
          }}
        />

        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '80px 24px 56px',
            display: 'flex',
            alignItems: 'center',
            gap: 56,
            flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          {/* Left — copy */}
          <div style={{ flex: '1 1 420px', minWidth: 300 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(38px, 5vw, 56px)',
                lineHeight: 1.08,
                letterSpacing: -2,
                color: 'var(--color-text)',
                marginBottom: 22,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0 12px',
              }}
            >
              {heroWords.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  variants={MOTION.heroWord}
                  initial="hidden"
                  animate="visible"
                  style={{ display: 'inline-block' }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              style={{
                fontSize: 17,
                lineHeight: 1.65,
                color: 'var(--color-text-secondary)',
                maxWidth: 480,
                marginBottom: 36,
              }}
            >
              Attendance tracking, leave approvals, payroll generation, and workforce
              analytics — running from one dashboard your team actually opens every morning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.4 }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
            >
              <CTAButton onClick={goToAuth} size="lg">
                See it in action <ArrowRight size={17} />
              </CTAButton>
              <CTAButton onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} size="lg" variant="ghost">
                Explore features <ChevronRight size={16} />
              </CTAButton>
            </motion.div>
          </div>

          {/* Right — mock */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ flex: '1 1 480px', minWidth: 320, maxWidth: 580 }}
          >
            <DashboardMock />
          </motion.div>
        </div>
      </section>

      {/* ────────── METRICS STRIP ────────── */}
      <MotionSection>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            variants={MOTION.sectionChild}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 48,
              flexWrap: 'wrap',
              padding: '28px 40px',
              borderRadius: 14,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 2px 8px var(--color-card-shadow)',
            }}
          >
            <Counter value={6} label="Core modules" />
            <Counter value={2} label="Role views" />
            <Counter value={1} label="Unified dashboard" />
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 32,
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                ∞
              </span>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4, display: 'block' }}>
                Workdays aligned
              </span>
            </div>
          </motion.div>
        </div>
      </MotionSection>

      {/* ────────── FEATURES ────────── */}
      <div id="features" style={{ paddingTop: 60 }}>
        {features.map((feature, idx) => (
          <MotionSection key={idx}>
            <div
              style={{
                maxWidth: 1120,
                margin: '0 auto',
                padding: '48px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 56,
                flexWrap: 'wrap',
                flexDirection: feature.reverse ? 'row-reverse' : 'row',
              }}
            >
              <motion.div variants={MOTION.sectionChild} style={{ flex: '1 1 380px', minWidth: 260 }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 28,
                    lineHeight: 1.25,
                    letterSpacing: -0.5,
                    color: 'var(--color-text)',
                    marginBottom: 12,
                  }}
                >
                  {feature.headline}
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: 420 }}>
                  {feature.body}
                </p>
              </motion.div>

              <motion.div
                variants={MOTION.sectionChild}
                whileHover={reduced ? {} : { scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  flex: '1 1 380px',
                  minWidth: 260,
                  maxWidth: 480,
                  boxShadow: '0 4px 16px var(--color-card-shadow)',
                  borderRadius: 12,
                }}
              >
                <FeatureMock type={feature.type} />
              </motion.div>
            </div>
          </MotionSection>
        ))}
      </div>

      {/* ────────── HOW IT WORKS ────────── */}
      <MotionSection id="how-it-works">
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <motion.h2
            variants={MOTION.sectionChild}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: -0.5,
              color: 'var(--color-text)',
              marginBottom: 52,
            }}
          >
            Up and running in three steps
          </motion.h2>

          <div style={{ position: 'relative' }}>
            {/* Connecting line */}
            <div className="landing-steps-line">
              <DrawingLine />
            </div>

            <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              {[
                { step: '1', icon: <UserCircle size={26} strokeWidth={1.5} />, title: 'Sign up', desc: 'Create your organization account. Takes about thirty seconds.' },
                { step: '2', icon: <ShieldCheck size={26} strokeWidth={1.5} />, title: 'Set up your team', desc: 'Add employees, assign roles, configure salary structures.' },
                { step: '3', icon: <BarChart3 size={26} strokeWidth={1.5} />, title: 'Run HR from one place', desc: 'Attendance, leave, payroll, analytics — one dashboard.' },
              ].map((s) => (
                <motion.div
                  key={s.step}
                  variants={MOTION.sectionChild}
                  whileHover={reduced ? {} : { scale: 1.03, y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{
                    flex: '1 1 260px',
                    maxWidth: 320,
                    padding: 28,
                    borderRadius: 14,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    cursor: 'default',
                    boxShadow: '0 2px 8px var(--color-card-shadow)',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'var(--color-primary-soft)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 14px',
                    }}
                  >
                    {s.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginBottom: 6,
                      fontFamily: 'var(--font-display)',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    Step {s.step}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: 18,
                      color: 'var(--color-text)',
                      marginBottom: 8,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ────────── ROLES COMPARISON ────────── */}
      <MotionSection id="roles">
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '56px 24px 80px' }}>
          <motion.h2
            variants={MOTION.sectionChild}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: -0.5,
              color: 'var(--color-text)',
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            Two views, one platform
          </motion.h2>
          <motion.p
            variants={MOTION.sectionChild}
            style={{
              fontSize: 15,
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              maxWidth: 520,
              margin: '0 auto 48px',
              lineHeight: 1.5,
            }}
          >
            Employees and HR admins see exactly what they need — nothing more, nothing less.
          </motion.p>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Employee */}
            <motion.div
              variants={MOTION.sectionChild}
              whileHover={reduced ? {} : { scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                flex: '1 1 340px',
                maxWidth: 480,
                padding: 30,
                borderRadius: 14,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 2px 8px var(--color-card-shadow)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'var(--color-primary-soft)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UserCircle size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-text)' }}>
                    Employee View
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>Self-service workspace</p>
                </div>
              </div>
              {[
                'Clock in and out with one tap',
                'View personal attendance history',
                'Apply for leave and track status',
                'Download monthly salary slips (PDF)',
                'Update profile and contact info',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 13 }}>
                  <Check size={16} style={{ color: 'var(--color-status-success)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </motion.div>

            {/* Admin */}
            <motion.div
              variants={MOTION.sectionChild}
              whileHover={reduced ? {} : { scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                flex: '1 1 340px',
                maxWidth: 480,
                padding: 30,
                borderRadius: 14,
                background: 'var(--color-mock-sidebar)',
                border: '1px solid var(--color-border)',
                color: '#e8ecf4',
                boxShadow: '0 2px 8px var(--color-card-shadow)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(91, 141, 239, 0.15)',
                    color: '#93bbfd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#f0f4fb' }}>
                    Admin View
                  </h3>
                  <p style={{ fontSize: 12, color: '#7b8ba5' }}>Full operational control</p>
                </div>
              </div>
              {[
                'Organization-wide attendance matrix',
                'Approve or reject leave in one click',
                'Manage employee roster and roles',
                'Set and edit salary structures',
                'Generate payslips and run payroll',
                'Workforce analytics and trend charts',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 13 }}>
                  <Check size={16} style={{ color: '#60a5fa', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: '#a4b1c7', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </MotionSection>

      {/* ────────── FINAL CTA ────────── */}
      <MotionSection>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 80px' }}>
          <motion.div
            variants={MOTION.sectionChild}
            style={{
              padding: '60px 40px',
              borderRadius: 18,
              background: 'var(--color-mock-sidebar)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* CTA glow */}
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                width: '120%',
                height: '120%',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, var(--color-primary-glow), transparent 60%)',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                opacity: 0.5,
              }}
            />
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(22px, 3.5vw, 34px)',
                color: '#f0f4fb',
                letterSpacing: -0.5,
                marginBottom: 12,
                position: 'relative',
              }}
            >
              Your team's HR shouldn't be held together by spreadsheets.
            </h2>
            <p style={{ fontSize: 15, color: '#7b8ba5', marginBottom: 28, position: 'relative' }}>
              Try Dayflow free — set up takes under a minute.
            </p>
            <div style={{ position: 'relative' }}>
              <CTAButton onClick={goToAuth} size="lg">
                Start free demo <ArrowRight size={17} />
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </MotionSection>

      {/* ────────── FOOTER ────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '28px 24px',
          background: 'var(--color-surface)',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 5,
                background: 'var(--color-text)',
                color: 'var(--color-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 10,
                fontFamily: 'var(--font-display)',
              }}
            >
              D
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-secondary)' }}>
              Dayflow
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>· Every workday, perfectly aligned.</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'GitHub', href: 'https://github.com' },
              { label: 'Contact', href: '#' },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{
                  fontSize: 13,
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ────────── SCOPED THEME + RESPONSIVE CSS ────────── */}
      <style>{`
        /* ── Light theme (default) ── */
        .landing-root,
        .landing-root[data-theme="light"] {
          --font-display: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --color-bg: #f7f8fa;
          --color-surface: #ffffff;
          --color-surface-raised: #ffffff;
          --color-text: #111827;
          --color-text-secondary: #4b5563;
          --color-text-muted: #6b7280;
          --color-text-faint: #9ca3af;
          --color-border: #e5e7eb;
          --color-border-subtle: #f3f4f6;
          --color-primary: #1a56db;
          --color-primary-hover: #1648b8;
          --color-primary-soft: #dbeafe;
          --color-primary-glow: rgba(26, 86, 219, 0.12);
          --color-on-primary: #ffffff;
          --color-nav-bg: rgba(247, 248, 250, 0.85);
          --color-card-shadow: rgba(15, 23, 42, 0.04);
          --color-card-shadow-hover: rgba(15, 23, 42, 0.08);
          --color-hero-glow: rgba(26, 86, 219, 0.06);
          --color-status-success: #16a34a;
          --color-status-success-bg: #dcfce7;
          --color-status-warning: #ca8a04;
          --color-status-warning-bg: #fef9c3;
          --color-status-danger: #dc2626;
          --color-status-danger-bg: #fef2f2;
          --color-mock-sidebar: #111827;
          --color-mock-body: #f9fafb;
        }

        /* ── Dark theme ── */
        .landing-root[data-theme="dark"] {
          --color-bg: #0c1222;
          --color-surface: #141c2e;
          --color-surface-raised: #1a2540;
          --color-text: #e8ecf4;
          --color-text-secondary: #a4b1c7;
          --color-text-muted: #7b8ba5;
          --color-text-faint: #556178;
          --color-border: #1e2d4a;
          --color-border-subtle: #162038;
          --color-primary: #5b8def;
          --color-primary-hover: #7ba4f7;
          --color-primary-soft: rgba(91, 141, 239, 0.15);
          --color-primary-glow: rgba(91, 141, 239, 0.08);
          --color-on-primary: #ffffff;
          --color-nav-bg: rgba(12, 18, 34, 0.88);
          --color-card-shadow: rgba(0, 0, 0, 0.3);
          --color-card-shadow-hover: rgba(91, 141, 239, 0.12);
          --color-hero-glow: rgba(91, 141, 239, 0.05);
          --color-status-success: #4ade80;
          --color-status-success-bg: rgba(74, 222, 128, 0.12);
          --color-status-warning: #facc15;
          --color-status-warning-bg: rgba(250, 204, 21, 0.12);
          --color-status-danger: #f87171;
          --color-status-danger-bg: rgba(248, 113, 113, 0.12);
          --color-mock-sidebar: #0a0f1e;
          --color-mock-body: #111827;
        }

        /* Smooth theme transition within landing page only */
        .landing-root,
        .landing-root * {
          transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .landing-root,
          .landing-root * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .landing-desktop-nav { display: none !important; }
          .landing-mobile-toggle { display: flex !important; }
          .landing-steps-line { display: none !important; }
        }
        @media (min-width: 769px) {
          .landing-mobile-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
};
