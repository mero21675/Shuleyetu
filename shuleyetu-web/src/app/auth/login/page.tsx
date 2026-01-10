'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const form = event.currentTarget;
    const mode = (new FormData(form).get('mode') as string) || 'login';

    try {
      if (!email.trim() || !password.trim()) {
        setError('Please enter email and password.');
        return;
      }

      if (mode === 'signup') {
        const { error } = await supabaseClient.auth.signUp({
          email: email.trim(),
          password: password,
        });
        if (error) {
          setError(error.message);
          return;
        }
        setMessage('Check your email to confirm your account, then log in.');
      } else {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (error) {
          setError(error.message);
          return;
        }
        setMessage('Logged in successfully. You can now access the dashboard.');
      }
    } catch (err) {
      console.error('Auth error', err);
      setError('Unexpected error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-12">
      <header className="space-y-2">
        <Link
          href="/"
          className="text-xs font-medium text-sky-400 hover:text-sky-300"
        >
          ← Back to home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Vendor login
        </h1>
        <p className="text-sm text-slate-300">
          Sign in or sign up with your vendor email to manage inventory and orders.
        </p>
      </header>

      <form
        onSubmit={handleAuth}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4"
      >
        <div className="space-y-1 text-sm">
          <label className="block text-xs font-medium text-slate-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-50 outline-none focus:border-sky-500"
            autoComplete="email"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label
            className="block text-xs font-medium text-slate-300"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-50 outline-none focus:border-sky-500"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-100">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-100">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-2 text-sm">
          <button
            type="submit"
            name="mode"
            value="login"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {loading ? 'Working…' : 'Log in'}
          </button>
          <button
            type="submit"
            name="mode"
            value="signup"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-100 hover:border-sky-500 hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Working…' : 'Sign up'}
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          After signing up, an admin should link your user to a vendor in the
          <code className="mx-1 rounded bg-slate-800 px-1 py-0.5 text-[10px]">
            vendor_users
          </code>
          table.
        </p>
      </form>
    </main>
  );
}
