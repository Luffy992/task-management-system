'use client';

import { useState } from 'react';
import { guestLogin } from '../lib/api';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGuestLogin() {
    try {
      setLoading(true);
      setError('');

      const response = await guestLogin();

      console.log('Guest login successful:', response);

      window.location.href = '/dashboard';
    } catch {
      setError('Unable to continue as guest. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">

        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Dexter
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Task Management System
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Welcome
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Sign in to continue to your workspace
          </p>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Continue as Guest'}
          </button>

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Login with Google
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

          <p className="mt-6 text-xs leading-5 text-zinc-400">
            By continuing, you agree to our{' '}
            <span className="cursor-pointer underline">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="cursor-pointer underline">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </main>
  );
}