'use client';

import { updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => onAuthStateChanged(auth, (current) => {
    setUser(current);
    setName(current?.displayName || '');
    if (!current) router.push('/login');
  }), [router]);

  const save = async () => {
    if (!auth.currentUser) return;
    setMessage('');
    await updateProfile(auth.currentUser, { displayName: name });
    setMessage('Profile updated.');
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="section-title">Settings</h1>
      <div className="card space-y-4">
        <div>
          <label className="label">Display name</label>
          <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" value={user.email || ''} disabled />
        </div>
        <button className="btn" onClick={save}>Save Profile</button>
        {message && <p className="text-sm text-emerald-300">{message}</p>}
      </div>
    </div>
  );
}
