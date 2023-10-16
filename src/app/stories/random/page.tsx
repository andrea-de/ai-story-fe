"use client"

import Loading from '@/app/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const router = useRouter()
    const [story, setStory] = useState('');

    const random = async () => {
        const result = await fetch('/api/random').then(res => res.json())
        setStory(result);
        router.push('/stories/' + result);
    }

    useEffect(() => { 
        random(); 
    }, [])

    return (
        <div>
            <Loading />
        </div>
    )
}