"use client"

/* Bundle size problem -- https://github.com/react-icons/react-icons/issues/154 */
// import { BsGearFill, BsFilePersonFill } from 'react-icons/bs';
// import { TbBooks } from 'react-icons/tb';
// import { GiRuleBook, GiOpenBook, GiSpellBook, GiBookCover } from 'react-icons/gi';
import { BsGearFill } from '@react-icons/all-files/bs/BsGearFill';
import { IoPersonSharp } from '@react-icons/all-files/io5/IoPersonSharp';
import { IoLibrary } from '@react-icons/all-files/io5/IoLibrary';
import { GiSpellBook } from '@react-icons/all-files/gi/GiSpellBook';
import { GiRuleBook } from '@react-icons/all-files/gi/GiRuleBook';
import { GiOpenBook } from '@react-icons/all-files/gi/GiOpenBook';
import { GiBookCover } from '@react-icons/all-files/gi/GiBookCover';

import Link from "next/link";
import { useState } from "react";
import { MouseEventHandler } from 'react';
import './navbar.css'

export default function NavBar() {
    const [selected, setSelected] = useState('')

    const navAction = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        const target = event.target as HTMLDivElement;
        if (!target.id) console.log(target)
        setSelected(target.id.split(' ')[0]);
    }

    return (
        <div className="navbar">
            <SideBarIcon icon={<GiSpellBook size="30" />} link={'/about'} text={'About'} selected={selected} onMouseClick={navAction} />
            <Divider />
            <SideBarIcon icon={<IoLibrary size="28" />} link={'/stories'} text={'Stories'} selected={selected} onMouseClick={navAction} />
            <SideBarIcon icon={<GiRuleBook size="26" />} link={'/stories/random'} text={'Random story'} selected={selected} onMouseClick={navAction} />
            <SideBarIcon icon={<GiOpenBook size="26" />} link={'/stories/new'} text={'New story'} selected={selected} onMouseClick={navAction} />
            {/* <Divider />
            <SideBarIcon icon={<IoPersonSharp size="24" />} link={'/settings'} text={'Profile'} />
            <SideBarIcon icon={<BsGearFill size="24" />} link={'/settings'} text={'Settings'} /> */}
            {/* <Divider /> */}
            {/* <SideBarIcon icon={<GiBookCover size="24" />} link={'/stories/random'} text={'Open Story'} /> */}
        </div>
    );
};

interface SideBarIconProps {
    icon: JSX.Element;
    link: string;
    text: string;
    selected: string;
    onMouseClick: MouseEventHandler<HTMLDivElement>;
}

const SideBarIcon: React.FC<SideBarIconProps> = ({ icon, link, text, selected, onMouseClick }) => {
    const id = text.split(' ')[0]
    const isSelected = selected === id

    return (
        <Link href={link} rel="preload">
            <div id={id}
                onClick={onMouseClick}
                className={`relative flex items-center justify-center h-14 w-14 mt-2 mb-2 mx-auto
                    ${isSelected ? 'bg-white text-secondary rounded-xl' : 'bg-secondary text-white rounded-3xl'}
                    hover:bg-tertiary hover:text-white 
                    hover:rounded-xl transition-all duration-300 ease-linear cursor-pointer shadow-lg group`}>
                <div className='pointer-events-none'>
                    {icon}
                </div>
                <span
                    className="absolute w-auto p-2 m-2 min-w-max left-16 rounded-md shadow-md text-xs font-bold 
                    text-white bg-tertiary 
                    transition-all duration-100 scale-0 origin-left z-10 sidebar-tooltip group-hover:scale-125">
                    {text}
                </span>
            </div>
        </Link>
    );
};

const SideBarIconServer = ({ icon, link, text }: { icon: any, link: string, text: string }) => (
    <Link href={link} rel="preload">
        {/* <Link href={link}> */}
        <div
            className="relative flex items-center justify-center h-14 w-14 mt-2 mb-2 mx-auto bg-secondary hover:bg-tertiary text-white hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg">
            {icon}
            <span className="absolute w-auto p-2 m-2 min-w-max left-16 rounded-md shadow-md text-white bg-background text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-10">
                {text}
            </span>
        </div>
    </Link>
);

const Divider = () => <hr className="border-secondary rounded-full border-2" />;