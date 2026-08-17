'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';

import { getTasks, deleteTask, updateTask } from '../../lib/api';
import AddTaskModal from '../../components/tasks/AddTaskModal';
import EditTaskModal from '../../components/tasks/EditTaskModal';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';
import ThemeToggle from '../../components/tasks/ThemeToggle';
import ColorMode from '../../components/tasks/ColorMode';

type Task = {
    id: number;
    title: string;
    description: string | null;
    status: 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';
    priority: 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    due_date: string | null;
};

const columns = [
    { key: 'TODO', label: 'To Do' },
    { key: 'DOING', label: 'Doing' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'ON_HOLD', label: 'On Hold' },
] as const;

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    function handleLogout() {
        logout();
        router.replace('/login');
    }

    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [detailsTask, setDetailsTask] = useState<Task | null>(null);
    const [openTaskMenu, setOpenTaskMenu] = useState<number | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    const [statusFilter, setStatusFilter] = useState<
        'ALL' | Task['status']
    >('ALL');

    const [priorityFilter, setPriorityFilter] = useState<
        'ALL' | Task['priority']
    >('ALL');

    const [showFilters, setShowFilters] = useState(false);
    const [showFields, setShowFields] = useState(false);

    const [viewMode, setViewMode] = useState<'board' | 'list'>('list');

    const [visibleFields, setVisibleFields] = useState({
        priority: true,
        members: true,
        dueDate: true,
        labels: true,
        status: false,
        reporter: false,
    });


    async function loadTasks() {
        try {
            setLoading(true);
            setError('');

            const data = await getTasks();
            setTasks(data);
        } catch {
            setError('Unable to load tasks.');
        } finally {
            setLoading(false);
        }
    }

    async function handleMoveTask(
        task: Task,
        status:
            | 'TODO'
            | 'DOING'
            | 'COMPLETED'
            | 'ON_HOLD',
    ) {
        try {
            setError('');

            await updateTask(task.id, {
                status,
            });

            await loadTasks();

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to move task.',
            );
        }
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/login');
        }
    }, [router]);

    useEffect(() => {
        loadTasks();
    }, []);

    function toggleField(field: keyof typeof visibleFields) {
        setVisibleFields((current) => ({
            ...current,
            [field]: !current[field],
        }));
    }

    async function handleDeleteTask(task: Task) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${task.title}"?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');

            await deleteTask(task.id);

            await loadTasks();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to delete task.',
            );
        }
    }

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());



        const matchesStatus =
            statusFilter === 'ALL' ||
            task.status === statusFilter;

        const matchesPriority =
            priorityFilter === 'ALL' ||
            task.priority === priorityFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
        );
    });

    const listGridColumns = [
        'minmax(280px, 2fr)',
        visibleFields.priority ? '140px' : null,
        visibleFields.members ? '140px' : null,
        visibleFields.dueDate ? '140px' : null,
        visibleFields.labels ? '140px' : null,
        visibleFields.status ? '140px' : null,
        visibleFields.reporter ? '140px' : null,
        '100px',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">

            <div className="flex min-h-screen">

                {/* ================================================= */}
                {/* SIDEBAR */}
                {/* ================================================= */}


                <aside className="fixed left-0 top-0 hidden h-screen w-64 shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:block">

                    <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">

                        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            Dexter
                        </h1>

                        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                            Task Management System
                        </p>

                    </div>

                    <nav className="flex h-[calc(100vh-89px)] flex-col p-4">

                        <div>

                            <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                Workspace
                            </p>

                            <Link
                                href="/dashboard"
                                className="accent-soft accent-text mt-1 flex min-h-10 w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"                            >
                                Tasks
                            </Link>

                            <Link
                                href="/projects"
                                className="mt-1 flex min-h-10 w-full items-center rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                Projects
                            </Link>

                        </div>

                        {/* Logout */}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-auto flex min-h-10 w-full items-center rounded-lg px-3 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                            Logout
                        </button>

                    </nav>
                </aside>

                {/* ================================================= */}
                {/* MAIN CONTENT */}
                {/* ================================================= */}

                <section className="ml-64 min-w-0 flex-1">

                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 sm:py-5 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                                    Tasks
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                    Manage your workspace tasks
                                </p>

                            </div>

                            <div className="flex items-center gap-2">

                                <ThemeToggle />

                                <ColorMode />

                                <button
                                    type="button"
                                    onClick={() => setShowAddTask(true)}
                                    className="accent-bg rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"                                >
                                    + Add Task
                                </button>

                            </div>

                        </div>

                        {/* ================================================= */}
                        {/* TOOLBAR */}
                        {/* ================================================= */}

                        <div className="mt-5 flex flex-wrap items-center gap-2">

                            {/* SEARCH */}

                            <div className="relative">

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    placeholder="Search tasks..."
                                    className="w-full sm:w-64 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                                />

                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                    >
                                        ×
                                    </button>
                                )}

                            </div>

                            {/* CLEAR FILTERS */}

                            {(searchQuery ||
                                statusFilter !== 'ALL' ||
                                priorityFilter !== 'ALL') && (

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setStatusFilter('ALL');
                                            setPriorityFilter('ALL');
                                        }}
                                        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                    >
                                        Clear Filters
                                    </button>

                                )}

                            {/* ================================================= */}
                            {/* FIELDS */}
                            {/* ================================================= */}

                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowFields((current) => !current)
                                    }
                                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    Fields
                                </button>

                                {showFields && (
                                    <div className="absolute left-0 top-full z-40 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">

                                        <p className="px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                            Fields
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => toggleField('priority')}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            <span>Priority</span>

                                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                                {visibleFields.priority ? '✓' : ''}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleField('members')}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            <span>Members</span>

                                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                                {visibleFields.members ? '✓' : ''}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleField('dueDate')}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            <span>Due Date</span>

                                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                                {visibleFields.dueDate ? '✓' : ''}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleField('labels')}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            <span>Labels</span>

                                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                                {visibleFields.labels ? '✓' : ''}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleField('status')}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            <span>Status</span>

                                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                                {visibleFields.status ? '✓' : ''}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleField('reporter')}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            <span>Reporter</span>

                                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                                {visibleFields.reporter ? '✓' : ''}
                                            </span>
                                        </button>

                                    </div>
                                )}

                            </div>

                            {/* ================================================= */}
                            {/* FILTER */}
                            {/* ================================================= */}

                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowFilters((current) => !current)
                                    }
                                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    Filter
                                </button>

                                {showFilters && (

                                    <div className="absolute left-0 top-full z-40 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">

                                        <p className="px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                            Filter
                                        </p>

                                        <div className="border-b border-zinc-100 px-3 py-3 dark:border-zinc-800">

                                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                                Status
                                            </label>

                                            <select
                                                value={statusFilter}
                                                onChange={(event) =>
                                                    setStatusFilter(
                                                        event.target.value as
                                                        | 'ALL'
                                                        | Task['status'],
                                                    )
                                                }
                                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
                                            >
                                                <option value="ALL">
                                                    All Statuses
                                                </option>

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

                                        <div className="px-3 py-3">

                                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                                Priority
                                            </label>

                                            <select
                                                value={priorityFilter}
                                                onChange={(event) =>
                                                    setPriorityFilter(
                                                        event.target.value as
                                                        | 'ALL'
                                                        | Task['priority'],
                                                    )
                                                }
                                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
                                            >
                                                <option value="ALL">
                                                    All Priorities
                                                </option>

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

                                        {(statusFilter !== 'ALL' ||
                                            priorityFilter !== 'ALL') && (

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setStatusFilter('ALL');
                                                        setPriorityFilter('ALL');
                                                    }}
                                                    className="mx-3 mb-2 w-[calc(100%-1.5rem)] rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                                >
                                                    Clear Filters
                                                </button>

                                            )}

                                    </div>

                                )}

                            </div>

                            {/* ================================================= */}
                            {/* BOARD / LIST */}
                            {/* ================================================= */}

                            <div className="ml-auto flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">

                                <button
                                    type="button"
                                    onClick={() => setViewMode('board')}
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium ${viewMode === 'board'
                                            ? 'accent-bg shadow-sm'
                                            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                                        }`}
                                >
                                    Board
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium ${viewMode === 'list'
                                            ? 'accent-bg shadow-sm'
                                            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                                        }`}
                                >
                                    List
                                </button>

                            </div>

                        </div>

                    </header>

                    {/* ================================================= */}
                    {/* CONTENT */}
                    {/* ================================================= */}

                    <div className="overflow-x-auto p-4 sm:p-6">

                        {loading && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Loading tasks...
                            </p>
                        )}

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/40">

                                <p className="text-sm text-red-500 dark:text-red-400">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={loadTasks}
                                    className="mt-3 rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                                >
                                    Try Again
                                </button>

                            </div>
                        )}

                        {!loading && !error && (

                            <>

                                {/* ================================================= */}
                                {/* BOARD VIEW */}
                                {/* ================================================= */}

                                {viewMode === 'board' && (

                                    <div className="grid min-w-[820px] grid-cols-4 gap-3 sm:min-w-[900px] sm:gap-4">

                                        {columns.map((column) => {

                                            const columnTasks =
                                                filteredTasks.filter(
                                                    (task) =>
                                                        task.status ===
                                                        column.key,
                                                );

                                            return (

                                                <div
                                                    key={column.key}
                                                    className="min-h-[500px] rounded-xl bg-zinc-100 p-3 dark:bg-zinc-900"
                                                >

                                                    <div className="mb-3 flex items-center justify-between">

                                                        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                                                            {column.label}
                                                        </h3>

                                                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                                            {columnTasks.length}
                                                        </span>

                                                    </div>

                                                    <div className="space-y-3">

                                                        {columnTasks.map((task) => (

                                                            <article
                                                                key={task.id}
                                                                className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-colors sm:p-4 dark:border-zinc-700 dark:bg-zinc-800"
                                                            >

                                                                <div className="flex items-start justify-between gap-3">

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setDetailsTask(
                                                                                task,
                                                                            )
                                                                        }
                                                                        className="text-left text-sm font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                                                                    >
                                                                        {task.title}
                                                                    </button>

                                                                    <div className="relative flex items-center">

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setOpenTaskMenu((current) =>
                                                                                    current === task.id ? null : task.id,
                                                                                )
                                                                            }
                                                                            className="rounded-md px-2 py-1 text-lg leading-none text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                                                                            aria-label={`Actions for ${task.title}`}
                                                                            aria-expanded={openTaskMenu === task.id}
                                                                        >
                                                                            ⋯
                                                                        </button>

                                                                        {openTaskMenu === task.id && (
                                                                            <div className="absolute right-0 top-full z-[100] mt-1 w-32 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setOpenTaskMenu(null);
                                                                                        setDetailsTask(task);
                                                                                    }}
                                                                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                                >
                                                                                    View
                                                                                </button>

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setOpenTaskMenu(null);
                                                                                        setEditingTask(task);
                                                                                    }}
                                                                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                                >
                                                                                    Edit
                                                                                </button>

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setOpenTaskMenu(null);
                                                                                        handleDeleteTask(task);
                                                                                    }}
                                                                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                                                                                >
                                                                                    Delete
                                                                                </button>

                                                                            </div>
                                                                        )}

                                                                    </div>

                                                                </div>

                                                                {task.description && (
                                                                    <p className="mt-2 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                                                                        {task.description}
                                                                    </p>
                                                                )}

                                                                <div className="mt-4 flex items-center justify-between gap-2">

                                                                    {visibleFields.priority && (
                                                                        <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                                                                            {task.priority.replace(
                                                                                '_',
                                                                                ' ',
                                                                            )}
                                                                        </span>
                                                                    )}

                                                                    {visibleFields.dueDate &&
                                                                        task.due_date && (

                                                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                                {new Date(
                                                                                    task.due_date,
                                                                                ).toLocaleDateString(
                                                                                    'en-GB',
                                                                                    {
                                                                                        day: '2-digit',
                                                                                        month: 'short',
                                                                                        year: 'numeric',
                                                                                    },
                                                                                )}
                                                                            </span>

                                                                        )}

                                                                </div>

                                                            </article>

                                                        ))}

                                                        {columnTasks.length === 0 && (
                                                            <p className="py-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
                                                                No tasks
                                                            </p>
                                                        )}

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowAddTask(true)
                                                        }
                                                        className="mt-4 w-full rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:bg-white dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                                    >
                                                        + Add Task
                                                    </button>

                                                </div>

                                            );
                                        })}

                                    </div>

                                )}

                                {/* ================================================= */}
                                {/* LIST VIEW */}
                                {/* ================================================= */}

                                {viewMode === 'list' && (
                                    <div className="min-w-[900px] space-y-5">

                                        {columns
                                            .filter((column) => column.key !== 'ON_HOLD')
                                            .map((column) => {
                                                const columnTasks = filteredTasks.filter(
                                                    (task) => task.status === column.key,
                                                );

                                                return (
                                                    <section
                                                        key={column.key}
                                                        className="overflow-visible rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                                                    >

                                                        {/* Section Header */}
                                                        <div className="flex items-center gap-2 px-2 py-2">
                                                            <button
                                                                type="button"
                                                                className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200"
                                                            >
                                                                <span className="text-xs">
                                                                    ▼
                                                                </span>

                                                                {column.label}
                                                            </button>

                                                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                                                {columnTasks.length}
                                                            </span>
                                                        </div>

                                                        {/* Table */}
                                                        <div className="overflow-visible rounded-lg border border-zinc-200 dark:border-zinc-700">

                                                            {/* Table Header */}
                                                            <div
                                                                style={{
                                                                    gridTemplateColumns: listGridColumns,
                                                                }}
                                                                className="grid border-b border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                                                            >
                                                                <div>
                                                                    Task
                                                                </div>

                                                                {visibleFields.priority && (
                                                                    <div>
                                                                        Priority
                                                                    </div>
                                                                )}

                                                                {visibleFields.members && (
                                                                    <div>
                                                                        Members
                                                                    </div>
                                                                )}

                                                                {visibleFields.dueDate && (
                                                                    <div>
                                                                        Due Date
                                                                    </div>
                                                                )}

                                                                {visibleFields.labels && (
                                                                    <div>
                                                                        Labels
                                                                    </div>
                                                                )}

                                                                {visibleFields.status && (
                                                                    <div>
                                                                        Status
                                                                    </div>
                                                                )}

                                                                {visibleFields.reporter && (
                                                                    <div>
                                                                        Reporter
                                                                    </div>
                                                                )}

                                                                <div className="text-right">
                                                                    Actions
                                                                </div>
                                                            </div>

                                                            {/* Task Rows */}
                                                            {columnTasks.map((task) => (
                                                                <div
                                                                    key={task.id}
                                                                    style={{
                                                                        gridTemplateColumns:
                                                                            listGridColumns,
                                                                    }}
                                                                    className="grid items-center border-b border-zinc-100 px-3 py-3 last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
                                                                >

                                                                    {/* Task */}
                                                                    <div className="min-w-0">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setDetailsTask(task)
                                                                            }
                                                                            className="block max-w-full truncate text-left text-sm font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                                                                        >
                                                                            {task.title}
                                                                        </button>

                                                                        {task.description && (
                                                                            <p className="mt-1 max-w-xl truncate text-xs text-zinc-400 dark:text-zinc-500">
                                                                                {task.description}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    {/* Priority */}
                                                                    {visibleFields.priority && (
                                                                        <div>
                                                                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                                                                                {task.priority.replace(
                                                                                    '_',
                                                                                    ' ',
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Members */}
                                                                    {visibleFields.members && (
                                                                        <div>
                                                                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                                                                —
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Due Date */}
                                                                    {visibleFields.dueDate && (
                                                                        <div>
                                                                            {task.due_date ? (
                                                                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                                    {new Date(
                                                                                        task.due_date,
                                                                                    ).toLocaleDateString(
                                                                                        'en-GB',
                                                                                        {
                                                                                            day: '2-digit',
                                                                                            month: 'short',
                                                                                            year: 'numeric',
                                                                                        },
                                                                                    )}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-xs text-zinc-300 dark:text-zinc-600">
                                                                                    —
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {/* Labels */}
                                                                    {visibleFields.labels && (
                                                                        <div>
                                                                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                                                                —
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Status */}
                                                                    {visibleFields.status && (
                                                                        <div>
                                                                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                                                                                {task.status.replace(
                                                                                    '_',
                                                                                    ' ',
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Reporter */}
                                                                    {visibleFields.reporter && (
                                                                        <div>
                                                                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                                                                —
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Actions */}
                                                                    <div className="relative flex items-center justify-end">

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setOpenTaskMenu((current) =>
                                                                                    current === task.id ? null : task.id,
                                                                                )
                                                                            }
                                                                            className="rounded-md px-2 py-1 text-lg leading-none text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                                                                            aria-label={`Actions for ${task.title}`}
                                                                            aria-expanded={openTaskMenu === task.id}
                                                                        >
                                                                            ⋯
                                                                        </button>

                                                                        {openTaskMenu === task.id && (
                                                                            <div className="absolute right-0 top-full z-[100] mt-1 w-32 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setOpenTaskMenu(null);
                                                                                        setDetailsTask(task);
                                                                                    }}
                                                                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                                >
                                                                                    View
                                                                                </button>

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setOpenTaskMenu(null);
                                                                                        setEditingTask(task);
                                                                                    }}
                                                                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                                >
                                                                                    Edit
                                                                                </button>

                                                                                {/* Move Task */}

                                                                                {task.status !== 'TODO' && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setOpenTaskMenu(null);
                                                                                            handleMoveTask(task, 'TODO');
                                                                                        }}
                                                                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                                    >
                                                                                        Move to To Do
                                                                                    </button>
                                                                                )}

                                                                                {task.status !== 'DOING' && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setOpenTaskMenu(null);
                                                                                            handleMoveTask(task, 'DOING');
                                                                                        }}
                                                                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                                    >
                                                                                        Move to Doing
                                                                                    </button>
                                                                                )}

                                                                                {task.status !== 'COMPLETED' && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setOpenTaskMenu(null);
                                                                                            handleMoveTask(task, 'COMPLETED');
                                                                                        }}
                                                                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                                    >
                                                                                        Move to Completed
                                                                                    </button>
                                                                                )}

                                                                                {task.status !== 'ON_HOLD' && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setOpenTaskMenu(null);
                                                                                            handleMoveTask(task, 'ON_HOLD');
                                                                                        }}
                                                                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                                    >
                                                                                        Move to On Hold
                                                                                    </button>
                                                                                )}

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setOpenTaskMenu(null);
                                                                                        handleDeleteTask(task);
                                                                                    }}
                                                                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                                                                                >
                                                                                    Delete
                                                                                </button>

                                                                            </div>
                                                                        )}

                                                                    </div>

                                                                </div>
                                                            ))}

                                                            {/* Empty State */}
                                                            {columnTasks.length === 0 && (
                                                                <div className="px-4 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
                                                                    No tasks
                                                                </div>
                                                            )}

                                                            {/* Add Task */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setShowAddTask(true)
                                                                }
                                                                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                                            >
                                                                <span className="text-sm">
                                                                    +
                                                                </span>

                                                                Add Task
                                                            </button>

                                                        </div>

                                                    </section>
                                                );
                                            })}

                                    </div>
                                )}

                            </>

                        )}

                    </div>

                </section>

            </div>

            {/* ================================================= */}
            {/* MODALS */}
            {/* ================================================= */}

            {showAddTask && (
                <AddTaskModal
                    onClose={() => setShowAddTask(false)}
                    onCreated={loadTasks}
                />
            )}

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdated={loadTasks}
                />
            )}

            {detailsTask && (
                <TaskDetailsModal
                    task={detailsTask}
                    onClose={() => setDetailsTask(null)}
                />
            )}

        </main>
    );
}