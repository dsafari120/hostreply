import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HostReply — AI replies for Airbnb hosts',
  description: 'Generate perfect guest replies in seconds. Built for solo Airbnb hosts with 1–3 listings.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  )
}
