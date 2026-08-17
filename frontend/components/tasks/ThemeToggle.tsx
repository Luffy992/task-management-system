'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        const initialTheme: Theme =
            savedTheme === 'dark' ? 'dark' : 'light';

        setTheme(initialTheme);
        setMounted(true);

        if (initialTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    function toggleTheme() {
        const nextTheme: Theme =
            theme === 'light' ? 'dark' : 'light';

        setTheme(nextTheme);

        localStorage.setItem('theme', nextTheme);

        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    /*
     * Prevent hydration mismatch.
     * The button appears after the component mounts.
     */
    if (!mounted) {
        return (
            <button
                type="button"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                aria-label="Toggle theme"
            >
                🌙 Dark
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            aria-label={
                theme === 'light'
                    ? 'Switch to dark theme'
                    : 'Switch to light theme'
            }
        >
            {theme === 'light'
                ? '🌙 Dark'
                : '☀️ Light'}
        </button>
    );
}