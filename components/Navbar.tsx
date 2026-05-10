'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Logo from './Logo';

const primaryLinks = [
  { href: '/tools', label: 'Tools' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => { return onAuthStateChanged(auth, setUser); }, []);

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <button
            className="btn-secondary md:hidden"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-nav"
          >
            Menu
          </button>
          <div id="site-nav" className="hidden items-center gap-2 md:flex">
            {primaryLinks.map((link) => <Link key={link.href} className="navlink" href={link.href}>{link.label}</Link>)}
            {user && <Link className="navlink" href="/dashboard">Dashboard</Link>}
            {user && <Link className="navlink" href="/settings">Settings</Link>}
            {user ? (
              <button onClick={() => signOut(auth)} className="btn">Logout</button>
            ) : (
              <Link className="btn" href="/login">Login</Link>
            )}
          </div>
        </div>
        {open && (
          <div className="mt-3 grid gap-2 border-t border-slate-200 pt-3 md:hidden">
            {primaryLinks.map((link) => <Link key={link.href} className="navlink" href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
            {user && <Link className="navlink" href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>}
            {user && <Link className="navlink" href="/settings" onClick={() => setOpen(false)}>Settings</Link>}
            {user ? (
              <button onClick={() => { setOpen(false); signOut(auth); }} className="btn">Logout</button>
            ) : (
              <Link className="btn" href="/login" onClick={() => setOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

