'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import TaskForm from '@/components/TaskForm';
import Link from 'next/link';

export default function TaskDetailsPage() {
    const params = useParams();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await fetch(`/api/tasks/${params.id}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'Failed to fetch task');

                setTask(data.task);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchTask();
    }, [params.id]);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;
    if (error) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--danger)' }}>{error}</div>;
    if (!task) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Task not found</div>;

    return (
        <>
            <Header />
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href="/tasks" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ← Back to Tasks
                    </Link>
                </div>

                <div className="animate-fade-in">
                    <TaskForm initialData={task} onSuccess={() => router.push('/tasks')} />
                </div>
            </div>
        </>
    );
}
