
'use client';

import { createContext, useContext, Dispatch, SetStateAction, useState, ReactNode, useEffect } from "react";

type DataType = {
    firstName: string
}

type OpenStory = {
    [s: string]: {
        position: string
        title: string
    }
}

interface ContextProps {
    userId: string,
    setUserId: Dispatch<SetStateAction<string>>,
    page: string,
    setPage: Dispatch<SetStateAction<string>>,
    data: DataType[],
    setData: Dispatch<SetStateAction<DataType[]>>
    openStories: OpenStory
    setOpenStories: Dispatch<SetStateAction<OpenStory>>
    amendOpenStories: (tag: string, position: string, title: string) => void
}

const GlobalContext = createContext<ContextProps>({
    userId: '',
    setUserId: (): string => '',
    page: '',
    setPage: (): string => '',
    data: [],
    setData: (): DataType[] => [],
    openStories: {},
    setOpenStories: (): OpenStory => { return {} },
    amendOpenStories: (): void => { }
})

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState('');
    const [page, setPage] = useState('');
    const [data, setData] = useState<[] | DataType[]>([]);
    const [openStories, setOpenStories] = useState<OpenStory>({});

    const amendOpenStories = (tag: string, position: string, title: string): void => {
        const keys = Object.keys(openStories)
        const index = keys.findIndex((str) => str.includes(tag));
        const open = {
            [tag]: {
                title: title,
                position: position
            }
        }

        if (index == -1) { // New
            setOpenStories((stories) => {
                return { ...stories, ...open }
            });
        // TODO: shift position of navicons
        } else if (openStories[tag].position != position) { // Needs Update
            if (index == keys.length - 1) { // Update position in story
                setOpenStories((stories) => {
                    // stories.tag.position = position
                    return { ...stories, ...open }
                })
            } else {
                setOpenStories((stories) => { // Also update story position in navbar
                    delete stories.tag
                    return { ...stories, ...open }
                });
            }
        }
    }

    useEffect(() => console.log(openStories), [openStories])

    return (
        <GlobalContext.Provider value={{ userId, setUserId, page, setPage, openStories, setOpenStories, amendOpenStories, data, setData }}>
            {children}
        </GlobalContext.Provider>
    )
};

export const useGlobalContext = () => useContext(GlobalContext);