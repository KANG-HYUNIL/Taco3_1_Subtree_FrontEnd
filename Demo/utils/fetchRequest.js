//fetch 요청을 간략하게 사용하기 위한 Builder Patter 클래스 
class FetchRequestBuilder {
    //test
    constructor() {
        this.url = "";
        this.method = "GET";
        this.headers = {};
        this.body = null;
        this.credentials = "same-origin";
        this.pollingCount = 0;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setMethod(method) {
        this.method = method;
        return this;
    }

    addHeader(key, value) {
        this.headers[key] = value;
        return this;
    }

    addBody(body) {
        if (body instanceof FormData) 
        {
            this.body = body;
        } else if (typeof body === "object") 
        {
            this.body = JSON.stringify(body);
            this.addHeader("Content-Type", "application/json");
        } 
        else 
        {
            this.body = body;
        }
        return this;
    }

    setCredentials(useCredentials) {
        this.credentials = useCredentials ? "include" : "same-origin";
        return this;
    }

    setPollingCount(count) {
        this.pollingCount = count;
        return this;
    }

    async build() 
    {

        if (!this.url)
        {
            throw new Error("URL is required");
        }

        const requestOptions = 
        {
            method: this.method,
            headers: this.headers,
            credentials: this.credentials
        };

        if (this.body)
        {
            requestOptions.body = this.body;
        }

        let response = null;

        for (let i = 0; i <= this.pollingCount; i++)
        {
            response = await fetch(this.url, requestOptions);

            if (response.ok)
            {
                break;
            }
        }



        return response; //응답을 반환
    }

};


export default FetchRequestBuilder;

