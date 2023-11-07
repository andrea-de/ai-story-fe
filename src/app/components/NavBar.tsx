"use client"

/* Bundle size problem -- https://github.com/react-icons/react-icons/issues/154 */
import { IoPersonSharp } from '@react-icons/all-files/io5/IoPersonSharp';
import { IoLibrary } from '@react-icons/all-files/io5/IoLibrary';
import { GiSpellBook } from '@react-icons/all-files/gi/GiSpellBook';
import { GiRuleBook } from '@react-icons/all-files/gi/GiRuleBook';
import { GiOpenBook } from '@react-icons/all-files/gi/GiOpenBook';
import { GiBookCover } from '@react-icons/all-files/gi/GiBookCover';

import { useGlobalContext } from '@/app/context';
import { useRouter } from 'next/navigation';
import './navbar.css'
import React from 'react';

export default function NavBar() {
    const router = useRouter()

    const { userId, setUserId, page, openStories, removeOpenStory } = useGlobalContext();

    const navAction = (link: string): void => {
        router.push(link);
    }

    const close = (tag: string): void => {
        removeOpenStory(tag)
        if (page === tag) router.push('/stories');
    }

    const stories = Object.entries(openStories).map(([tag, story]) => (
        <SideBarIcon
            key={tag}
            icon={<GiBookCover size="24" />}
            link={`/stories/${tag}?position=${story.position}`}
            text={story.title}
            selected={tag}
            current={page}
            onMouseClick={navAction}
            close={close}
        />
    ));

    return (
        <div className={`navbar ${page == '' ? 'opacity-0' : ''}`}>
            <SideBarIcon icon={<GiSpellBook size="30" />} link={'/about'} text={'About'} selected={'about'} current={page} onMouseClick={navAction} />
            {false &&
                <SideBarIcon icon={<IoPersonSharp size="26" />} link={'/profile'} text={''} selected={'profile'} current={page} onMouseClick={navAction} />
            }

            <Divider />

            <SideBarIcon icon={<IoLibrary size="28" />} link={'/stories'} text={'Stories'} selected={'stories'} current={page} onMouseClick={navAction} />
            <SideBarIcon icon={<GiOpenBook size="26" />} link={'/new'} text={'New story'} selected={'new'} current={page} onMouseClick={navAction} />

            {stories.length > 0 &&
                <>
                    <Divider />
                    {stories}
                    <Divider />
                </>
            }

            <SideBarIcon icon={<GiRuleBook size="26" />} link={'/random'} text={'Random story'} selected={''} current={page} onMouseClick={navAction} />

        </div>
    );
};

interface SideBarIconProps {
    icon: JSX.Element;
    link: string;
    text: string;
    selected: string;
    current: string;
    onMouseClick: any;
    close?: any;
}

const SideBarIcon: React.FC<SideBarIconProps> = ({ icon, link, text, selected, current, onMouseClick, close }) => {
    return (
        <div className={`relative mx-2 my-2 w-fit ${text === '' ? 'transition-all duration-200 ease-out animate-ping': ''}`}>
            <div id={selected} onClick={() => onMouseClick(link)}
                className={`flex items-center justify-center h-14 w-14 mx-auto
                    ${selected === current ? 'bg-white text-secondary rounded-xl' : 'bg-secondary text-white rounded-3xl'}
                    md:hover:bg-tertiary md:hover:text-white ${selected == 'random' ? 'active:bg-purple-700' : ''}
                    hover:rounded-xl transition-all duration-300 ease-linear cursor-pointer shadow-lg group`}>
                <div className='pointer-events-none'>
                    {icon}
                </div>
                <span
                    className="tooltip absolute w-auto p-2 m-2 min-w-max rounded-md shadow-md text-xs font-bold 
                    text-white bg-tertiary transition-all duration-100 scale-0 z-10 group-hover:scale-125">
                    {text}
                </span>
            </div>
            {selected.includes('-') &&
                <div
                    onClick={() => close(selected)}
                    className='absolute right-[-0.5em] top-[-0.5em] bg-red-500 text-white text-sm px-1 rounded-full cursor-pointer'>
                    X
                </div>
            }
        </div>
    );
}

const Divider = () => <hr className="border-secondary rounded-full border-2" />;