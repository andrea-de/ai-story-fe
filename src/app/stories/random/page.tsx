import { redirect } from 'next/navigation'

const getRandom = () => {
    const random = Math.random()
    return "id_" + (random*10e4).toString().substring(0,4);
}

export default async function Random(){
    const path = getRandom()
    redirect(path);
}