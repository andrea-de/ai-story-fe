import Api from '@/app/helper/api';
import { redirect } from 'next/navigation'

const api = new Api();

export default async function Random(){
    const { tag } = await api.getRandomStory()
    redirect(tag);
}