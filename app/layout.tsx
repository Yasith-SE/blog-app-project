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
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-blue-900 tracking-tight hover:opacity-80 transition-opacity">
              BlogApp Gateway
            </Link>
            
            <div className="flex gap-4 md:gap-6 items-center font-medium text-slate-600">
              <Link href="/" className="hidden md:block hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/dashboard" className="hidden md:block hover:text-blue-600 transition-colors">Dashboard</Link>
              
              {/* Vertical Divider line */}
              <div className="hidden md:block w-px h-6 bg-slate-300 mx-2"></div>
              
              {/* Login Icon & Link */}
              <Link href="/login" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
              
              {/* Register Icon & Button */}
              <Link href="/register" className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register
              </Link>
            </div>
          </div>
        </nav>
        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}