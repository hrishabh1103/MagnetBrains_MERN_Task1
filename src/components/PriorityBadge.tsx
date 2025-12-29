export default function PriorityBadge({ priority }: { priority: string }) {
    const colors: Record<string, string> = {
        low: 'bg-green-500/20 text-green-300 border-green-500/30',
        medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        high: 'bg-red-500/20 text-red-300 border-red-500/30',
    };

    const style = colors[priority] || colors.medium;

    // Since we are using vanilla CSS mostly but I used tailwind-like classes in the map above for reference,
    // I will convert them to inline styles or a simple className mapping if I had utility classes.
    // But I don't have utility classes. So I will use inline styles based on the map.

    const getStyle = (p: string) => {
        switch (p) {
            case 'low': return { background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)' };
            case 'high': return { background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' };
            default: return { background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.3)' };
        }
    };

    const s = getStyle(priority);

    return (
        <span style={{
            ...s,
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        }}>
            {priority}
        </span>
    );
}
