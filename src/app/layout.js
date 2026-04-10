import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Watermark App',
  description: 'An app used to generate watermark picture.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><link rel="icon" href="/static/favicon.ico"></link></head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
