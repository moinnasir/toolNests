import './globals.css'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/components/AuthProvider'
import AnalyticsAds from './(providers)/analytics-ads'
export const metadata = { title: 'ToolNest', description: 'All-in-one SEO, design, AI, website, marketing, and developer tools.' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><AuthProvider>
          <Navbar />
          <div suppressHydrationWarning>
            <AnalyticsAds />
          </div><main className="mx-auto max-w-6xl px-4 py-8">{children}</main></AuthProvider>
    </body></html>);
}

