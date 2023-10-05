import Link from "next/link";

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

export default function SideBar() {
    return (
        <div className="navbar">
            <SideBarIcon icon={<GiSpellBook size="30" />} link={'/about'} text={'About'} />
            <Divider />
            <SideBarIcon icon={<IoLibrary size="28" />} link={'/stories'} text={'Stories'} />
            <SideBarIcon icon={<GiRuleBook size="26" />} link={'/stories/random'} text={'Random story'} />
            <SideBarIcon icon={<GiOpenBook size="26" />} link={'/stories/new'} text={'New story'} />
            {/* <Divider />
            <SideBarIcon icon={<IoPersonSharp size="24" />} link={'/settings'} text={'Profile'} />
            <SideBarIcon icon={<BsGearFill size="24" />} link={'/settings'} text={'Settings'} /> */}
            {/* <Divider /> */}
            {/* <SideBarIcon icon={<GiBookCover size="24" />} link={'/stories/random'} text={'Open Story'} /> */}
        </div>
    );
};

const SideBarIcon = ({ icon, link, text }: { icon: any, link: string, text: string }) => (


    // <Link href={link} rel="preload">
    <Link href={link}>
        <div className="sidebar-icon group">
            {icon}
            <span className="sidebar-tooltip group-hover:scale-100  z-10">
                {text}
            </span>
        </div>
    </Link>
);


const Divider = () => <hr className="sidebar-hr" />;