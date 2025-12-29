'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TaskFormProps {
    initialData?: {
        id?: number;
        title: string;
        description: string;
        dueDate: string;
        priority: string;
        status?: string;
    };
    onSuccess?: () => void;
}

export default function TaskForm({ initialData, onSuccess }: TaskFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
    const [priority, setPriority] = useState(initialData?.priority || 'medium');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const isEditing = !!initialData?.id;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = isEditing ? `/api/tasks/${initialData.id}` : '/api/tasks';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, dueDate, priority }),
            });

            if (!res.ok) throw new Error('Failed to save task');

            router.refresh();
            if (onSuccess) onSuccess();

            if (!isEditing) {
                setTitle('');
                setDescription('');
                setDueDate('');
                setPriority('medium');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{isEditing ? 'Edit Task' : 'Create New Task'}</h3>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

            <div className="input-group">
                <label className="label">Title</label>
                <input
                    type="text"
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="input-group">
                <label className="label">Description</label>
                <textarea
                    className="input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    style={{ resize: 'vertical' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                    <label className="label">Due Date</label>
                    <input
                        type="date"
                        className="input"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="label">Priority</label>
                    <select
                        className="input"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
            </button>
        </form>
    );
}
