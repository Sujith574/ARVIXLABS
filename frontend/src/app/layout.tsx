import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arvix Labs — AI-Powered Government Grievance System',
  description:
    'Arvix Labs is a production-grade AI-powered Government Grievance and Data Intelligence platform. Submit complaints, track status, and get AI-driven insights.',
  keywords: ['government grievance', 'AI platform', 'complaint management', 'Arvix Labs'],
  openGraph: {
    title: 'Arvix Labs — AI Government Intelligence',
    description: 'The future of government grievance management',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
