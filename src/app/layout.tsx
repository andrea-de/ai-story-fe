import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import Loading from './components/Loading'
import NavBar from './components/NavBar'
import { GlobalContextProvider } from './context';
import { NavigationEvents } from './components/NavigationEvents'

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
            <body className={inter.className + 'w-screen overflow-hidden text-white bg-background'}>
                <GlobalContextProvider>
                    <NavigationEvents />
                    <NavBar />
                    <main className='grow flex justify-center pt-8 overflow-hidden'>
                        <Suspense fallback={<Loading />}>
                            {children}
                        </Suspense>
                    </main>
                </GlobalContextProvider>
            </body>
        </html>
    )
}
