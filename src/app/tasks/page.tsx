'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

export default function TasksPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleTaskCreated = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <Header />
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                    <section className="animate-fade-in">
                        <TaskForm onSuccess={handleTaskCreated} />
                    </section>

                    <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <TaskList key={refreshKey} />
                    </section>
                </div>
            </div>
        </>
    );
}
