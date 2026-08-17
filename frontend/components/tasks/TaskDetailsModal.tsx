'use client';

type Task = {
    id: number;
    title: string;
    description: string | null;
    status: 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';
    priority: 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    due_date: string | null;
};

type TaskDetailsModalProps = {
    task: Task;
    onClose: () => void;
};

function formatValue(value: string) {
    return value.replace('_', ' ');
}

function formatDate(date: string | null) {
    if (!date) {
        return 'No due date';
    }

    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function TaskDetailsModal({
    task,
    onClose,
}: TaskDetailsModalProps) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4">

            <div className="flex max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">

                {/* ================================================= */}
                {/* MAIN */}
                {/* ================================================= */}

                <div className="min-w-0 flex-1 overflow-y-auto">

                    {/* Header */}

                    <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">

                        <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                    Task
                                </p>

                                <h2 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                                    {task.title}
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg px-2 py-1 text-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                aria-label="Close task details"
                            >
                                ×
                            </button>

                        </div>

                        {/* Properties */}

                        <div className="mt-4 flex flex-wrap items-center gap-2">

                            <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                {formatValue(task.status)}
                            </span>

                            <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                {formatValue(task.priority)}
                            </span>

                            <span className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                                Due {formatDate(task.due_date)}
                            </span>

                        </div>

                    </div>

                    {/* Body */}

                    <div className="space-y-7 px-6 py-6">

                        {/* Description */}

                        <section>

                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                Description
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                {task.description ||
                                    'No description provided.'}
                            </p>

                        </section>

                        {/* Labels */}

                        <section>

                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                Labels
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-2">

                                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                                    No labels
                                </span>

                            </div>

                        </section>

                        {/* Resources */}

                        <section>

                            <div className="flex items-center justify-between">

                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    Resources
                                </h3>

                                <button
                                    type="button"
                                    className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                >
                                    + Add resource
                                </button>

                            </div>

                            <div className="mt-3 rounded-lg border border-dashed border-zinc-200 px-4 py-4 text-xs text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                                No resources attached.
                            </div>

                        </section>

                        {/* Subtasks */}

                        <section>

                            <div className="flex items-center justify-between">

                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    Subtasks
                                </h3>

                                <button
                                    type="button"
                                    className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                >
                                    + Add Subtask
                                </button>

                            </div>

                            <div className="mt-3 rounded-lg border border-zinc-200 dark:border-zinc-700">

                                <div className="px-4 py-4 text-xs text-zinc-400 dark:text-zinc-500">
                                    No subtasks yet.
                                </div>

                            </div>

                        </section>

                        {/* Comments */}

                        <section>

                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                Comments
                            </h3>

                            <div className="mt-3 space-y-3">

                                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">

                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                        No comments yet.
                                    </p>

                                </div>

                                <div className="flex gap-2">

                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                    />

                                    <button
                                        type="button"
                                        className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                                    >
                                        Send
                                    </button>

                                </div>

                            </div>

                        </section>

                    </div>

                </div>

                {/* ================================================= */}
                {/* RIGHT DETAILS PANEL */}
                {/* ================================================= */}

                <aside className="hidden w-72 shrink-0 border-l border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/40 lg:block">

                    <div className="flex items-center justify-between">

                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Details
                        </h3>

                    </div>

                    <div className="mt-5 space-y-5">

                        {/* Status */}

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                Status
                            </p>

                            <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {formatValue(task.status)}
                            </p>

                        </div>

                        {/* Priority */}

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                Priority
                            </p>

                            <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {formatValue(task.priority)}
                            </p>

                        </div>

                        {/* Members */}

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                Members
                            </p>

                            <button
                                type="button"
                                className="mt-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            >
                                + Add members
                            </button>

                        </div>

                        {/* Due Date */}

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                Due Date
                            </p>

                            <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {formatDate(task.due_date)}
                            </p>

                        </div>

                        {/* Teams */}

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                Teams
                            </p>

                            <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
                                No team assigned
                            </p>

                        </div>

                        {/* Reporter */}

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                Reporter
                            </p>

                            <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
                                —
                            </p>

                        </div>

                    </div>

                </aside>

            </div>

        </div>
    );
}