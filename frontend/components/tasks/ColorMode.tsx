'use client';

import { useEffect, useState } from 'react';

type ColorMode =
    | 'amber'
    | 'blue'
    | 'pink'
    | 'rose'
    | 'emerald'
    | 'black';

const colorModes: {
    value: ColorMode;
    label: string;
    color: string;
}[] = [
    {
        value: 'amber',
        label: 'Amber',
        color: 'bg-amber-500',
    },
    {
        value: 'blue',
        label: 'Blue',
        color: 'bg-blue-500',
    },
    {
        value: 'pink',
        label: 'Pink',
        color: 'bg-pink-500',
    },
    {
        value: 'rose',
        label: 'Rose',
        color: 'bg-rose-500',
    },
    {
        value: 'emerald',
        label: 'Emerald',
        color: 'bg-emerald-500',
    },
    {
        value: 'black',
        label: 'Black',
        color: 'bg-zinc-900',
    },
];

export default function ColorMode() {
    const [colorMode, setColorMode] =
        useState<ColorMode>('black');

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const savedMode =
            localStorage.getItem('colorMode');

        const validMode = colorModes.some(
            (mode) => mode.value === savedMode,
        );

        if (
            validMode &&
            savedMode
        ) {
            setColorMode(
                savedMode as ColorMode,
            );

            document.documentElement.dataset.colorMode =
                savedMode;
        } else {
            document.documentElement.dataset.colorMode =
                'black';

            localStorage.setItem(
                'colorMode',
                'black',
            );
        }
    }, []);

    function changeColorMode(
        mode: ColorMode,
    ) {
        setColorMode(mode);

        localStorage.setItem(
            'colorMode',
            mode,
        );

        document.documentElement.dataset.colorMode =
            mode;

        setOpen(false);
    }

    const currentMode = colorModes.find(
        (mode) => mode.value === colorMode,
    );

    return (
        <div className="relative">

            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (current) => !current,
                    )
                }
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
                <span className="flex items-center gap-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${currentMode?.color}`}
                    />

                    Color
                </span>
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">

                    <p className="px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Color Mode
                    </p>

                    {colorModes.map(
                        (mode) => (
                            <button
                                key={mode.value}
                                type="button"
                                onClick={() =>
                                    changeColorMode(
                                        mode.value,
                                    )
                                }
                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                <span className="flex items-center gap-2">

                                    <span
                                        className={`h-3 w-3 rounded-full ${mode.color}`}
                                    />

                                    {mode.label}

                                </span>

                                {colorMode ===
                                    mode.value && (
                                    <span className="font-semibold">
                                        ✓
                                    </span>
                                )}

                            </button>
                        ),
                    )}

                </div>
            )}

        </div>
    );
}