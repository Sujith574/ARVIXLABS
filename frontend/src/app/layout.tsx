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
  verification: {
    google: '9gJWzTwkNrPzu1MoP5qL9sVrTfSR_DTLBAeDItUvOWw',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
