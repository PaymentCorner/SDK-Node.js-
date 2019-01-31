const config = require('../config');
const errorMessages = require('../errorMessages');
const responseHandler = require('./responseHandler');
const unirest = require('unirest');

class API {
    constructor(baseURL) {
        this.baseURL = '';
        baseURL ? this.setAPIBaseURL(baseURL) : this.setAPIBaseURL(config.APIBaseURLProduction);
    }

    setAPIBaseURL(URL) {
        if (!URL) {
            throw new Error(errorMessages.invalidAPIBaseURL);
        }
        this.baseURL = URL;
    }

    getAPIBaseURL() {
        return this.baseURL;
    }

    post(URL, data, headers = {}) {
        return new Promise((resolve, reject) => {
            if (!URL) {
                reject("URL missing");
                return;
            }
            unirest.post(`${this.baseURL}${URL}`)
                .headers(headers)
                .send(data)
                .end((response) => {
                    if (!(response.status >= 200 && response.status < 300)) {
                        reject(responseHandler.handleError(response));
                        return;
                    }
                    resolve(responseHandler.handleResponse(response.body));
                })
        });
    }

    get(URL, data, headers) {
        return new Promise((resolve, reject) => {
            if (!URL) {
                reject("URL missing");
                return;
            }
            unirest.get(`${this.baseURL}${URL}?${data}`)
                .headers(headers)
                .send(data)
                .end((response) => {
                    if (!(response.status >= 200 && response.status < 300)) {
                        reject(responseHandler.handleError(response));
                        return;
                    }
                    resolve(responseHandler.handleResponse(response.body));
                })
        });
    }

}

module.exports = API;