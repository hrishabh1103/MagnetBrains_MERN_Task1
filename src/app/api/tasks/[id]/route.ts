import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) },
        });

        if (!task || task.userId !== session.user.id) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ task });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const { title, description, dueDate, status, priority } = await request.json();
        const taskId = parseInt(id);

        // Verify ownership
        const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
        if (!existingTask || existingTask.userId !== session.user.id) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                status,
                priority,
            },
        });

        return NextResponse.json({ success: true, task });
    } catch (error) {
        console.error('Update task error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const taskId = parseInt(id);

        // Verify ownership
        const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
        if (!existingTask || existingTask.userId !== session.user.id) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
