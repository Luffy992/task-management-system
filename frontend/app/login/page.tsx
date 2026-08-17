'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { guestLogin } from '../../lib/api';

export default function LoginPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleGuestLogin() {
        try {
            setLoading(true);
            setError('');

            const data = await guestLogin();

            /*
             * Store the guest authentication data.
             *
             * We keep this flexible because the backend response
             * may contain a token, user, or session information.
             */
            if (data) {
                localStorage.setItem(
                    'guestSession',
                    JSON.stringify(data),
                );
            }

            router.push('/dashboard');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to continue as guest.',
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

            <div className="w-full max-w-md">

                {/* Logo / Brand */}

                <div className="mb-8 text-center">

                    <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        Dexter
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Task Management System
                    </p>

                </div>

                {/* Login Card */}

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

                    <div className="mb-6">

                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                            Welcome back
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Sign in to manage your workspace.
                        </p>

                    </div>

                    {/* Guest Login */}

                    <button
                        type="button"
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                    >
                        {loading
                            ? 'Signing in...'
                            : 'Continue as Guest'}
                    </button>

                    {/* Error */}

                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 px-3 py-3 dark:bg-red-950/40">

                            <p className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>

                        </div>
                    )}

                    {/* Information */}

                    <p className="mt-5 text-center text-xs leading-5 text-zinc-400 dark:text-zinc-500">
                        Guest access lets you explore the task
                        management system without creating an account.
                    </p>

                </div>

                {/* Footer */}

                <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
                    Task Management System
                </p>

            </div>

        </main>
    );
}