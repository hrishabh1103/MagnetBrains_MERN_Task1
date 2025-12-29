import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Task Management System',
  description: 'A simple task management system',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
