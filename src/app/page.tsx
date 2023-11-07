"use client"

import { IoLibrary } from '@react-icons/all-files/io5/IoLibrary';
import { GiSpellBook } from '@react-icons/all-files/gi/GiSpellBook';
import { GiRuleBook } from '@react-icons/all-files/gi/GiRuleBook';
import { GiOpenBook } from '@react-icons/all-files/gi/GiOpenBook';

import Link from 'next/link';
import { useEffect } from 'react';

import { useGlobalContext } from './context';

export default function Page() {
    const { userId, setUserId, page, setPage } = useGlobalContext();

    const navAction = (id: string): void => {
        setTimeout(() => setPage(id), 200);
    }

    return (page == '' &&
        <div className='flex flex-col justify-center items-center gap-5 mx-10'>
            <h1 className='text-3xl'>ChoiceAI Adventures</h1>
            <p className='max-2xl text-lg'>
                Read and write stories with ChoiceAI.
            </p>
            <div className='flex flex-wrap justify-center mx-10'>
                <Icon icon={<GiSpellBook size="46" />} link={'/about'} text={'About'} onMouseClick={navAction} />
                <Icon icon={<IoLibrary size="40" />} link={'/stories'} text={'Stories'} onMouseClick={navAction} />
                <Icon icon={<GiRuleBook size="40" />} link={'/stories/random'} text={'Random story'} onMouseClick={navAction} />
                <Icon icon={<GiOpenBook size="40" />} link={'/new'} text={'New story'} onMouseClick={navAction} isUser={true} />
                {/* <Icon icon={<GiOpenBook size="40" />} link={'/new'} text={'New story'} onMouseClick={navAction} isUser={userId != ''} /> */}
            </div>
            <div hidden className={`text-center m-5 ${userId ? 'opacity-0' : ''}`}>
                <button onClick={() => { setUserId('1') }}
                    className='p-5 m-5 text-3xl font-bold text-center bg-secondary hover:bg-tertiary rounded-xl'>
                    Login
                </button>
            </div>
        </div>
    )
}

const Icon = ({ icon, link, text, isUser = true, onMouseClick }: { icon: JSX.Element, link: string, text: string, isUser?: boolean, onMouseClick: any }) => {
    const id = text.split(' ')[0].toLowerCase()

    return (
        <Link href={link}>
            <div
                onClick={() => onMouseClick(id)}
                className={`group transition-all duration-300 ease-linear w-24 flex flex-col items-center rounded-lg
                ${!isUser ? 'pointer-events-none border-2 border-dashed border-yellow-600' : ''}`}>
                <div
                    className={`flex items-center justify-center h-20 w-20 mt-2 mb-2 mx-auto rounded-3xl shadow-lg pointer-events-none
                bg-secondary text-white  group-hover:bg-tertiary group-hover:text-white group-hover:rounded-xl`}>
                    {icon}
                </div>
                <span
                    className="p-[.3rem] mt-2 rounded-md shadow-md text-xs font-bold text-white group-hover:bg-tertiary pointer-events-none">
                    {text}
                </span>
            </div>
        </Link>
    );
};