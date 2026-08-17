'use client';

import Link from 'next/link';
import ThemeToggle from '../../components/tasks/ThemeToggle';
import ColorMode from '../../components/tasks/ColorMode';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

type ProjectPriority =
    | 'NO_PRIORITY'
    | 'URGENT'
    | 'HIGH'
    | 'MEDIUM'
    | 'LOW';

type Project = {
    id: number;
    name: string;
    priority: ProjectPriority;
    lead: string;
    dueDate: string | null;
    description: string;
};


function formatDate(date: string | null) {
    if (!date) {
        return '—';
    }

    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatPriority(priority: ProjectPriority) {
    return priority.replace('_', ' ');
}

export default function ProjectsPage() {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/login');
        }
    }, [router]);

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProjects() {
            try {
                const response = await fetch(
                    'http://localhost:3001/projects',
                );

                if (!response.ok) {
                    throw new Error(
                        'Failed to load projects',
                    );
                }

                const data = await response.json();

                setProjects(data);
            } catch (error) {
                console.error(
                    'Failed to load projects:',
                    error,
                );
            }
        }

        loadProjects();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');

    const [showFields, setShowFields] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const [priorityFilter, setPriorityFilter] =
        useState<'ALL' | ProjectPriority>('ALL');

    const [visibleFields, setVisibleFields] = useState({
        priority: true,
        lead: true,
        dueDate: true,
    });

    const [showAddProject, setShowAddProject] =
        useState(false);

    const [editingProject, setEditingProject] =
        useState<Project | null>(null);

    const [viewingProject, setViewingProject] =
        useState<Project | null>(null);

    const [openActionMenu, setOpenActionMenu] =
        useState<number | null>(null);

    function toggleField(
        field: keyof typeof visibleFields,
    ) {
        setVisibleFields((current) => ({
            ...current,
            [field]: !current[field],
        }));
    }


    async function handleDeleteProject(
        project: Project,
    ) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${project.name}"?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3001/projects/${project.id}`,
                {
                    method: 'DELETE',
                },
            );

            if (!response.ok) {
                throw new Error(
                    'Failed to delete project',
                );
            }

            setProjects((current) =>
                current.filter(
                    (item) => item.id !== project.id,
                ),
            );

            setOpenActionMenu(null);

        } catch (error) {
            console.error(
                'Failed to delete project:',
                error,
            );

            alert(
                'Failed to delete project. Please try again.',
            );
        }
    }

    async function handleCreateProject(
        project: Project,
    ) {
        try {
            const response = await fetch(
                'http://localhost:3001/projects',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        name: project.name,
                        description:
                            project.description,
                        priority:
                            project.priority,
                        dueDate:
                            project.dueDate,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(
                    'Failed to create project',
                );
            }

            const createdProject =
                await response.json();

            const projectResponse =
                await fetch(
                    `http://localhost:3001/projects/${createdProject.id}`,
                );

            if (!projectResponse.ok) {
                throw new Error(
                    'Failed to load created project',
                );
            }

            const newProject =
                await projectResponse.json();

            setProjects((current) => [
                ...current,
                newProject,
            ]);

            setShowAddProject(false);

        } catch (error) {
            console.error(
                'Failed to create project:',
                error,
            );

            alert(
                'Failed to create project. Please try again.',
            );
        }
    }

    async function handleUpdateProject(
        project: Project,
    ) {
        try {
            console.log(
                'Updating project:',
                project,
            );

            const response = await fetch(
                `http://localhost:3001/projects/${project.id}`,
                {
                    method: 'PATCH',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        name: project.name,
                        description:
                            project.description,
                        priority:
                            project.priority,
                        dueDate:
                            project.dueDate,
                    }),
                },
            );

            console.log(
                'Update response status:',
                response.status,
            );

            if (!response.ok) {
                const errorData =
                    await response.text();

                console.log(
                    'Backend error:',
                    errorData,
                );

                throw new Error(
                    'Failed to update project',
                );
            }

            const updatedProject =
                await response.json();

            setProjects((current) =>
                current.map((item) =>
                    item.id === project.id
                        ? updatedProject
                        : item,
                ),
            );

            setEditingProject(null);

        } catch (error) {
            console.error(
                'Failed to update project:',
                error,
            );

            alert(
                'Failed to update project. Please try again.',
            );
        }
    }

    const filteredProjects = projects.filter(
        (project) => {
            const matchesSearch = project.name
                .toLowerCase()
                .includes(
                    searchQuery.toLowerCase(),
                );

            const matchesPriority =
                priorityFilter === 'ALL' ||
                project.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesPriority
            );
        },
    );

    const visibleColumnCount =
        1 +
        (visibleFields.priority ? 1 : 0) +
        (visibleFields.lead ? 1 : 0) +
        (visibleFields.dueDate ? 1 : 0) +
        1;

    const gridTemplateColumns =
        visibleColumnCount === 5
            ? 'minmax(280px,2fr) 140px 140px 140px 80px'
            : visibleColumnCount === 4
                ? 'minmax(280px,2fr) 140px 140px 80px'
                : visibleColumnCount === 3
                    ? 'minmax(280px,2fr) 140px 80px'
                    : 'minmax(280px,2fr) 80px';

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-black dark:text-zinc-100">

            <div className="flex min-h-screen">

                {/* ================================================= */}
                {/* SIDEBAR */}
                {/* ================================================= */}

                <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:block">

                    <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">

                        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            Dexter
                        </h1>

                        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                            Task Management System
                        </p>

                    </div>

                    <nav className="p-4">

                        <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Workspace
                        </p>

                        <Link
                            href="/dashboard"
                            className="mt-1 flex min-h-10 w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors"                        >
                            Tasks
                        </Link>

                        <Link
                            href="/projects"
                            className="accent-soft accent-text mt-1 flex min-h-10 w-full items-center rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors dark:bg-zinc-800 dark:text-zinc-100"
                        >
                            Projects
                        </Link>

                    </nav>

                </aside>

                {/* ================================================= */}
                {/* MAIN CONTENT */}
                {/* ================================================= */}

                <section className="min-w-0 flex-1">

                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <header className="border-b border-zinc-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">

                        <div className="flex items-center justify-between gap-4">

                            <div>
                                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                                    Projects
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                    Manage your workspace projects
                                </p>
                            </div>

                            <div className="flex items-center gap-2">

                                <ThemeToggle />

                                <button
                                    type="button"
                                    onClick={() => setShowAddProject(true)}
                                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    + Add Project
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
                                        setSearchQuery(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Search projects..."
                                    className="w-64 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                />

                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearchQuery('')
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                    >
                                        ×
                                    </button>
                                )}

                            </div>

                            {/* ================================================= */}
                            {/* FIELDS */}
                            {/* ================================================= */}

                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFields(
                                            (current) =>
                                                !current,
                                        );

                                        setShowFilters(false);

                                        setOpenActionMenu(null);
                                    }}
                                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    Fields
                                </button>

                                {showFields && (

                                    <div className="absolute left-0 top-full z-50 mt-2 w-52 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">

                                        <p className="px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                            Fields
                                        </p>

                                        {/* Priority */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleField(
                                                    'priority',
                                                )
                                            }
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            <span>
                                                Priority
                                            </span>

                                            <span className="font-semibold">
                                                {visibleFields.priority
                                                    ? '✓'
                                                    : ''}
                                            </span>

                                        </button>

                                        {/* Lead */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleField(
                                                    'lead',
                                                )
                                            }
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            <span>
                                                Lead
                                            </span>

                                            <span className="font-semibold">
                                                {visibleFields.lead
                                                    ? '✓'
                                                    : ''}
                                            </span>

                                        </button>

                                        {/* Due Date */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleField(
                                                    'dueDate',
                                                )
                                            }
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            <span>
                                                Due Date
                                            </span>

                                            <span className="font-semibold">
                                                {visibleFields.dueDate
                                                    ? '✓'
                                                    : ''}
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
                                    onClick={() => {
                                        setShowFilters(
                                            (current) =>
                                                !current,
                                        );

                                        setShowFields(false);

                                        setOpenActionMenu(null);
                                    }}
                                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    Filter
                                </button>

                                {showFilters && (

                                    <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">

                                        <p className="px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                            Filter
                                        </p>

                                        <div className="px-3 py-3">

                                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                                Priority
                                            </label>

                                            <select
                                                value={
                                                    priorityFilter
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    setPriorityFilter(
                                                        event
                                                            .target
                                                            .value as
                                                        | 'ALL'
                                                        | ProjectPriority,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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

                                        {priorityFilter !==
                                            'ALL' && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPriorityFilter(
                                                            'ALL',
                                                        )
                                                    }
                                                    className="mx-3 mb-2 w-[calc(100%-1.5rem)] rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                                >
                                                    Clear Filter
                                                </button>

                                            )}

                                    </div>

                                )}

                            </div>

                            {/* ================================================= */}
                            {/* CLEAR */}
                            {/* ================================================= */}

                            {(searchQuery ||
                                priorityFilter !==
                                'ALL') && (

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setPriorityFilter(
                                                'ALL',
                                            );
                                        }}
                                        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                    >
                                        Clear
                                    </button>

                                )}

                        </div>

                    </header>

                    {/* ================================================= */}
                    {/* PROJECT TABLE */}
                    {/* ================================================= */}

                    <div className="overflow-x-auto p-6">

                        <div className="min-w-[760px] overflow-visible rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">

                            {/* ================================================= */}
                            {/* TABLE HEADER */}
                            {/* ================================================= */}

                            <div
                                style={{
                                    gridTemplateColumns,
                                }}
                                className="grid border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                            >

                                <div>
                                    Projects
                                </div>

                                {visibleFields.priority && (
                                    <div>
                                        Priority
                                    </div>
                                )}

                                {visibleFields.lead && (
                                    <div>
                                        Lead
                                    </div>
                                )}

                                {visibleFields.dueDate && (
                                    <div>
                                        Due Date
                                    </div>
                                )}

                                <div className="text-right">
                                    Actions
                                </div>

                            </div>

                            {/* ================================================= */}
                            {/* PROJECT ROWS */}
                            {/* ================================================= */}

                            {filteredProjects.map(
                                (project) => (

                                    <div
                                        key={project.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => {
                                            setOpenActionMenu(
                                                null,
                                            );

                                            setViewingProject(
                                                project,
                                            );
                                        }}
                                        onKeyDown={(event) => {
                                            if (
                                                event.key ===
                                                'Enter' ||
                                                event.key ===
                                                ' '
                                            ) {
                                                event.preventDefault();

                                                setOpenActionMenu(
                                                    null,
                                                );

                                                setViewingProject(
                                                    project,
                                                );
                                            }
                                        }}
                                        style={{
                                            gridTemplateColumns,
                                        }}
                                        className="grid cursor-pointer items-center border-b border-zinc-100 px-4 py-4 last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
                                    >

                                        {/* ================================================= */}
                                        {/* PROJECT */}
                                        {/* ================================================= */}

                                        <div className="min-w-0">

                                            <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                {
                                                    project.name
                                                }
                                            </div>

                                            <p className="mt-1 truncate text-xs text-zinc-400 dark:text-zinc-500">
                                                {
                                                    project.description
                                                }
                                            </p>

                                        </div>

                                        {/* ================================================= */}
                                        {/* PRIORITY */}
                                        {/* ================================================= */}

                                        {visibleFields.priority && (

                                            <div>

                                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                                                    {formatPriority(
                                                        project.priority,
                                                    )}
                                                </span>

                                            </div>

                                        )}

                                        {/* ================================================= */}
                                        {/* LEAD */}
                                        {/* ================================================= */}

                                        {visibleFields.lead && (

                                            <div>

                                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    {
                                                        project.lead
                                                    }
                                                </span>

                                            </div>

                                        )}

                                        {/* ================================================= */}
                                        {/* DUE DATE */}
                                        {/* ================================================= */}

                                        {visibleFields.dueDate && (

                                            <div>

                                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    {formatDate(
                                                        project.dueDate,
                                                    )}
                                                </span>

                                            </div>

                                        )}

                                        {/* ================================================= */}
                                        {/* ACTIONS */}
                                        {/* ================================================= */}

                                        <div
                                            className="relative flex justify-end"
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOpenActionMenu(
                                                        (
                                                            current,
                                                        ) =>
                                                            current ===
                                                                project.id
                                                                ? null
                                                                : project.id,
                                                    );
                                                }}
                                                className="rounded-md px-2 py-1 text-lg leading-none text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                                                aria-label={`Actions for ${project.name}`}
                                            >
                                                ⋯
                                            </button>

                                            {/* ================================================= */}
                                            {/* ACTION MENU */}
                                            {/* ================================================= */}

                                            {openActionMenu ===
                                                project.id && (

                                                    <div className="absolute right-0 top-full z-[80] mt-1 w-40 rounded-xl border border-zinc-200 bg-white p-1 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setViewingProject(
                                                                    project,
                                                                );

                                                                setOpenActionMenu(
                                                                    null,
                                                                );
                                                            }}
                                                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingProject(
                                                                    project,
                                                                );

                                                                setOpenActionMenu(
                                                                    null,
                                                                );
                                                            }}
                                                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteProject(
                                                                    project,
                                                                )
                                                            }
                                                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                )}

                                        </div>

                                    </div>

                                ),
                            )}

                            {/* ================================================= */}
                            {/* EMPTY STATE */}
                            {/* ================================================= */}

                            {filteredProjects.length ===
                                0 && (

                                    <div className="px-6 py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
                                        No projects found.
                                    </div>

                                )}

                            {/* ================================================= */}
                            {/* ADD PROJECT */}
                            {/* ================================================= */}

                            <button
                                type="button"
                                onClick={() => {
                                    setOpenActionMenu(null);
                                    setShowAddProject(true);
                                }}
                                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >

                                <span className="text-base">
                                    +
                                </span>

                                Add Project

                            </button>

                        </div>

                    </div>

                </section>

            </div>

            {/* ================================================= */}
            {/* ADD PROJECT MODAL */}
            {/* ================================================= */}

            {showAddProject && (

                <ProjectFormModal
                    mode="create"
                    onClose={() =>
                        setShowAddProject(false)
                    }
                    onSubmit={
                        handleCreateProject
                    }
                />

            )}

            {/* ================================================= */}
            {/* EDIT PROJECT MODAL */}
            {/* ================================================= */}

            {editingProject && (

                <ProjectFormModal
                    mode="edit"
                    project={editingProject}
                    onClose={() =>
                        setEditingProject(null)
                    }
                    onSubmit={
                        handleUpdateProject
                    }
                />

            )}

            {/* ================================================= */}
            {/* VIEW PROJECT MODAL */}
            {/* ================================================= */}

            {viewingProject && (

                <ProjectDetailsModal
                    project={viewingProject}
                    onClose={() =>
                        setViewingProject(null)
                    }
                />

            )}

        </main>
    );
}

/* ========================================================= */
/* PROJECT FORM MODAL */
/* ========================================================= */

type ProjectFormModalProps = {
    mode: 'create' | 'edit';
    project?: Project;
    onClose: () => void;
    onSubmit: (project: Project) => void;
};

function ProjectFormModal({
    mode,
    project,
    onClose,
    onSubmit,
}: ProjectFormModalProps) {

    const [name, setName] = useState(
        project?.name ?? '',
    );

    const [description, setDescription] =
        useState(
            project?.description ?? '',
        );

    const [priority, setPriority] =
        useState<ProjectPriority>(
            project?.priority ??
            'NO_PRIORITY',
        );

    const [lead, setLead] = useState(
        project?.lead ?? '',
    );

    const [dueDate, setDueDate] = useState(
        project?.dueDate
            ? project.dueDate.split('T')[0]
            : '',
    );

    const [error, setError] = useState('');

    function handleSubmit(
        event: React.FormEvent,
    ) {

        event.preventDefault();

        if (!name.trim()) {

            setError(
                'Project name is required.',
            );

            return;
        }

        const newProject: Project = {

            id:
                project?.id ??
                Date.now(),

            name: name.trim(),

            description:
                description.trim(),

            priority,

            lead:
                lead.trim() ||
                'Admin',

            dueDate:
                dueDate || null,
        };

        onSubmit(newProject);
    }

    return (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">

                {/* Header */}

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Projects
                        </p>

                        <h2 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                            {mode === 'create'
                                ? 'Add Project'
                                : 'Edit Project'}
                        </h2>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        ×
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >

                    {/* Name */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Project Name
                        </label>

                        <input
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value,
                                )
                            }
                            placeholder="Enter project name"
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />

                    </div>

                    {/* Description */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Description
                        </label>

                        <textarea
                            value={
                                description
                            }
                            onChange={(
                                event,
                            ) =>
                                setDescription(
                                    event.target.value,
                                )
                            }
                            rows={3}
                            placeholder="Enter project description"
                            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />

                    </div>

                    {/* Priority + Lead */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>

                            <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Priority
                            </label>

                            <select
                                value={
                                    priority
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setPriority(
                                        event
                                            .target
                                            .value as ProjectPriority,
                                    )
                                }
                                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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

                        <div>

                            <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Lead
                            </label>

                            <input
                                value={lead}
                                onChange={(
                                    event,
                                ) =>
                                    setLead(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="Admin"
                                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                            />

                        </div>

                    </div>

                    {/* Due Date */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Due Date
                        </label>

                        <input
                            type="date"
                            value={
                                dueDate
                            }
                            onChange={(
                                event,
                            ) =>
                                setDueDate(
                                    event
                                        .target
                                        .value,
                                )
                            }
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />

                    </div>

                    {/* Error */}

                    {error && (

                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                            {error}
                        </p>

                    )}

                    {/* Buttons */}

                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                        >
                            {mode ===
                                'create'
                                ? 'Create Project'
                                : 'Save Changes'}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

/* ========================================================= */
/* PROJECT DETAILS MODAL */
/* ========================================================= */

type ProjectDetailsModalProps = {
    project: Project;
    onClose: () => void;
};

function ProjectDetailsModal({
    project,
    onClose,
}: ProjectDetailsModalProps) {

    return (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">

                {/* Header */}

                <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Project Details
                        </p>

                        <h2 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                            {project.name}
                        </h2>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        ×
                    </button>

                </div>

                {/* Body */}

                <div className="space-y-6 px-6 py-6">

                    {/* Description */}

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Description
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                            {project.description ||
                                'No description provided.'}
                        </p>

                    </div>

                    {/* Properties */}

                    <div className="grid grid-cols-2 gap-5">

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Priority
                            </p>

                            <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {formatPriority(
                                    project.priority,
                                )}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Lead
                            </p>

                            <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {project.lead}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Due Date
                            </p>

                            <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {formatDate(
                                    project.dueDate,
                                )}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );
}