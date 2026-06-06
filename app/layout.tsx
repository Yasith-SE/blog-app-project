import "./globals.css";
import Link from 'next/link';

export const metadata = {
  title: 'My Simple Blog',
  description: 'A blog application built for my internship assessment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <span className="font-bold text-xl text-blue-600">BlogApp</span>
            <div className="flex gap-6 font-medium text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            </div>
          </div>
        </nav>
        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}