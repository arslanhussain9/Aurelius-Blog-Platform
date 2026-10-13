import './globals.css';
import { AuthProvider } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Aurelius | Full-Stack Blog Platform with Comments',
  description: 'A modern full-stack blogging platform with user registration, article management, and interactive comments.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen flex flex-col bg-surface text-on-surface antialiased selection:bg-primary selection:text-on-primary">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 pt-20">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
