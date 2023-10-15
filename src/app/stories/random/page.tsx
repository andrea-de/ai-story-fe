"use client"

import Loading from '@/app/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const router = useRouter()

    const random = async () => {
        const story = await fetch('/api/random').then(res => res.json())
        router.push('/stories/' + story);
    }

    useEffect(() => { random() }, [])

    return (
        <Loading />
    )
}