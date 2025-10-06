import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reply.sh - AI Chatbot Platform',
  description: 'Serverless AI chatbot for your website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}