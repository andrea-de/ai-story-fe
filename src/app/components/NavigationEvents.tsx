'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useGlobalContext } from '@/app/context';

export function NavigationEvents() {
    const pathname = usePathname()
    const { setPage } = useGlobalContext();

    useEffect(() => {
        if (pathname === '/') setPage('main')
        setPage (pathname.split('/').slice(-1)[0])
    }, [pathname])

    return null
}