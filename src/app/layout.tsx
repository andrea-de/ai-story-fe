import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SideBar from './components/SideBar'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Choice AI Adventures',
  description: 'Choose your own Adventure',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + 'pt-5 w-screen dark:bg-background'}>
        <SideBar />
        <main className='w-full mx-5 flex scroll-ml-96'>
          <Suspense fallback={
            <div className="loading font-bold mt-3">loading </div>
          }>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  )
}
