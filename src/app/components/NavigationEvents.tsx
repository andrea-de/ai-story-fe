'use client'

import { useEffect, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useGlobalContext } from '@/app/context';

export function NavigationEvents() {
    const pathname = usePathname()
    const { setPage } = useGlobalContext();

    const setPageCallback = useCallback((newPage: string) => {
        setPage(newPage);
    }, [setPage]);

    useEffect(() => {
        if (pathname === '/') setPage('main')
        setPage (pathname.split('/').slice(-1)[0])
    }, [pathname, setPageCallback])

    return null
}