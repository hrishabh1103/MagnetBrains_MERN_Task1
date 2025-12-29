'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PriorityBadge from './PriorityBadge';

export default function TaskList() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: '5' });
            if (statusFilter !== 'all') params.append('status', statusFilter);

            const res = await fetch(`/api/tasks?${params}`);
            const data = await res.json();

            if (data.tasks) {
                setTasks(data.tasks);
                setTotalPages(data.pagination.pages);
            }
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [page, statusFilter]);

    const handleStatusChange = async (taskId: number, newStatus: string) => {
        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchTasks(); // Refresh list
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleDelete = async (taskId: number) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
            fetchTasks();
        } catch (error) {
            console.error('Failed to delete task', error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Your Tasks</h2>
                <select
                    className="input"
                    style={{ width: 'auto' }}
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No tasks found. Create one to get started!
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tasks.map((task) => (
                        <div key={task.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <Link href={`/tasks/${task.id}`} style={{ fontWeight: 600, fontSize: '1.1rem', textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? '#94a3b8' : 'white' }}>
                                        {task.title}
                                    </Link>
                                    <PriorityBadge priority={task.priority} />
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <select
                                    className="input"
                                    style={{ padding: '0.4rem', fontSize: '0.9rem', width: 'auto' }}
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>

                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="btn btn-danger"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                    <button
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        Previous
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
