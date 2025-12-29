'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <header style={{
            padding: '1rem 2rem',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            marginBottom: '2rem'
        }}>
            <div className="container" style={{ padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/tasks" style={{ fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Magnet Brains
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link href="/tasks" style={{ fontWeight: 500, color: '#cbd5e1', transition: 'color 0.2s' }} className="hover:text-white">
                        Tasks
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.1)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
