'use client';

import { useState } from 'react';
import { updateTask } from '../../lib/api';

type Task = {
    id: number;
    title: string;
    description: string | null;
    status: 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';
    priority: 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    due_date: string | null;
};

type EditTaskModalProps = {
    task: Task;
    onClose: () => void;
    onUpdated: () => void;
};

export default function EditTaskModal({
    task,
    onClose,
    onUpdated,
}: EditTaskModalProps) {
    const [title, setTitle] = useState(task.title);

    const [description, setDescription] = useState(
        task.description ?? '',
    );

    const [status, setStatus] = useState<Task['status']>(
        task.status,
    );

    const [priority, setPriority] = useState<Task['priority']>(
        task.priority,
    );

    const [dueDate, setDueDate] = useState(
        task.due_date
            ? task.due_date.split('T')[0]
            : '',
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!title.trim()) {
            setError('Task title is required.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await updateTask(task.id, {
                title: title.trim(),
                description: description.trim(),
                status,
                priority,
                dueDate: dueDate || undefined,
            });

            onUpdated();
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to update task.',
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/60">

            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-zinc-700 dark:bg-zinc-900">

                {/* Header */}

                <div className="flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">
                        Edit Task
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        ×
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >

                    {/* Title */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-zinc-200">
                            Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
                        />

                    </div>

                    {/* Description */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-zinc-200">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            rows={3}
                            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
                        />

                    </div>

                    {/* Status + Priority */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Status */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-zinc-200">
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value as Task['status'],
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
                            >
                                <option value="TODO">
                                    To Do
                                </option>

                                <option value="DOING">
                                    Doing
                                </option>

                                <option value="COMPLETED">
                                    Completed
                                </option>

                                <option value="ON_HOLD">
                                    On Hold
                                </option>
                            </select>

                        </div>

                        {/* Priority */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-zinc-200">
                                Priority
                            </label>

                            <select
                                value={priority}
                                onChange={(event) =>
                                    setPriority(
                                        event.target.value as Task['priority'],
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
                            >
                                <option value="NO_PRIORITY">
                                    No Priority
                                </option>

                                <option value="URGENT">
                                    Urgent
                                </option>

                                <option value="HIGH">
                                    High
                                </option>

                                <option value="MEDIUM">
                                    Medium
                                </option>

                                <option value="LOW">
                                    Low
                                </option>
                            </select>

                        </div>

                    </div>

                    {/* Due Date */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-zinc-200">
                            Due Date
                        </label>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(event) =>
                                setDueDate(event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
                        />

                    </div>

                    {/* Error */}

                    {error && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
                            {error}
                        </p>
                    )}

                    {/* Buttons */}

                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                        >
                            {loading
                                ? 'Saving...'
                                : 'Save Changes'}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}