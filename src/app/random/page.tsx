"use client"

import Loading from '@/app/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const router = useRouter()
    // const [story, setStory] = useState('');

    const random = async () => {
        return await fetch('/api/random', { cache: 'no-store' }).then(res => res.json())
    }

    const redirect = async () => {
        const story = await random()
        // const nextStory = await random()
        // setStory(nextStory);
        // console.log('Navigating to story: ', story);
        router.push('/stories/' + story);
    }

    useEffect(() => {
        redirect()
    }, [])

    return (
        <>
            <div>
                <Loading />
            </div>
        </>
    )
}