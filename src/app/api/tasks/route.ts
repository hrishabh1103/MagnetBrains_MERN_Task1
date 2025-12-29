import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    const where: any = { userId: session.user.id };
    if (status && status !== 'all') {
        where.status = status;
    }

    try {
        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { dueDate: 'asc' },
            }),
            prisma.task.count({ where }),
        ]);

        return NextResponse.json({
            tasks,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: page,
            },
        });
    } catch (error) {
        console.error('Fetch tasks error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title, description, dueDate, priority } = await request.json();

        if (!title || !dueDate) {
            return NextResponse.json({ error: 'Title and Due Date are required' }, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description: description || '',
                dueDate: new Date(dueDate),
                priority: priority || 'medium',
                userId: session.user.id,
            },
        });

        return NextResponse.json({ success: true, task });
    } catch (error) {
        console.error('Create task error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
