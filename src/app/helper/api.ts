// import { getCookie } from "./utils";

export default class Api {
    client: null;
    api_token: null;
    constructor() {
        this.api_token = null;
        this.client = null;
        // this.api_url = process.env.REACT_APP_API_ENDPOINT;
    }

    URI_HEAD = process.env.API_URI + "/api/";

    init = () => {
        //   this.api_token = getCookie("ACCESS_TOKEN");

        const headers = {
            Accept: "application/json",
        };

        // const URI_HEAD = "http://127.0.0.1:8000/";

        // if (this.api_token) {
        // headers.Authorization = `Bearer ${this.api_token}`;
        // }

    };
    // const res = await fetch('http://127.0.0.1:8000/story')

    getStories = async (page: number = 1, limit: number = 3) => {
        let uri = this.URI_HEAD + 'story?page=' + page + '&limit=' + limit;
        const response = await fetch(uri, { cache: 'no-store' })
            .then(res => res.json())
        if (response.error) throw response.error
        return response;
    };

    getStory = async (tag: string, position: string = '0') => {
        let uri = this.URI_HEAD + 'story/tag/' + tag + '/' + position;
        const response = await fetch(uri)
            .then(res => res.json())
        if (response.error) throw response.error
        return response;
    }
    
    getRandomStory = async () => {
        let uri = this.URI_HEAD + 'story/random';
        const response = await fetch(uri)
            .then(res => res.json())
        if (response.error) throw response.error
        return response;
    }

    sendStoryAction = async (tag: string, position: string, action: number) => {
        let uri = this.URI_HEAD + 'story/action/';
        // let uri = this.URI_HEAD + 'story/action/safe';
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tag: tag,
                position: position,
                action: action
            }),
        }).then(res => res.json())
        if (response.error) throw response.error
        return response;
    }

    newStory = async (formData: any) => {
        let uri = this.URI_HEAD + 'story/new';
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        }).then(res => res.json())
        if (response.error) throw response.error
        return response;
    }

    generateDescription = async () => {
        let uri = this.URI_HEAD + 'ai/generate';
        const res = await fetch(uri)
        const data: any = await res.json();
        if (data.error) throw data
        return data;
    }

}