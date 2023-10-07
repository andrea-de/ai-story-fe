import chalk from 'chalk';
import { redirect } from 'next/navigation'

const api_url = process.env.REACT_APP_API_URI + '/api/';

export default async function Random() {
    try {
        const response = await fetch(api_url + 'story/random', { cache: 'no-store' })
            .then(res => res.json())
        if (response.error) throw response.error
        const tag = response.tag;
        redirect(tag);
    } catch (error) {
        redirect('/stories');
    }
}