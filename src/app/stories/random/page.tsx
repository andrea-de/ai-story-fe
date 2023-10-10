"use client"

import { redirect } from 'next/navigation'
import { useRouter } from 'next/router';

import { useLayoutEffect } from 'react';

export default function Page() {
    redirect('/');
    // const router = useRouter();

    // const goToRandom = async () => {
    //     try {
    //         // const response = await fetch(url, { cache: 'no-store' })
    //         const response = await fetch('/api/story')
    //         .then(res => res.json())
    //         if (response.error) throw response.error
    //         const tag = response.tag;
    //         console.log('tag: ', tag);
    //         const url = new URL(`stories/${tag}`, window.location.origin).toString();
    //         console.log('url: ', url);
    //         router.push('/' + tag);
    //         // redirect(url);
    //         // redirect('/stories/' + tag);
    //     } catch (error) {
    //         console.log(error);
    //         redirect('/');
    //     }
    // }

    // useLayoutEffect(() => {
        // goToRandom()
    // })


    // return (
    //     <div onClick={goToRandom} className="loading font-bold mt-3">loading </div>
    // )
}