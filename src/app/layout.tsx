import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Magnet Brains Task Manager',
  description: 'Task management system for Magnet Brains',
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
