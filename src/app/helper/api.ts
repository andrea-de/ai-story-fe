// import { getCookie } from "./utils";

export default class Api {
    client: null;
    api_token: null;
    constructor() {
        this.api_token = null;
        this.client = null;
        // this.api_url = process.env.REACT_APP_API_ENDPOINT;
    }

    URI_HEAD = "http://127.0.0.1:8000/api/";

    init = () => {
        //   this.api_token = getCookie("ACCESS_TOKEN");
        
        const headers = {
            Accept: "application/json",
        };
        
        const URI_HEAD = "http://127.0.0.1:8000/";

        // if (this.api_token) {
        // headers.Authorization = `Bearer ${this.api_token}`;
        // }

    };
    // const res = await fetch('http://127.0.0.1:8000/stories')

    getStories = async () => {
        const res = await fetch(this.URI_HEAD + 'story')
        const data: any[] = await res.json();
        return data;
    };

    getStory = async (id: string, position = 0) => {
        console.log('URI:: ' + this.URI_HEAD + 'story/' + id)
        const res = await fetch(this.URI_HEAD + 'story/' + id)
        const data: any = await res.json();
        return data;
    }

}