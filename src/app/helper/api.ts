// import { getCookie } from "./utils";

export default class Api {
    client: null;
    api_token: null;
    api_url: string | undefined;

    constructor() {
        this.api_token = null;
        this.client = null;
        this.api_url = process.env.REACT_APP_API_URI + '/api/';
    }

    // init = () => {
    //       this.api_token = getCookie("ACCESS_TOKEN");
    //     const headers = { Accept: "application/json", };
    //     if (this.api_token) { headers.Authorization = `Bearer ${this.api_token}` }
    // };

}