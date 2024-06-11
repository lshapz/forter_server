### How to Use This Server

* navigate to the main folder of this repo on your terminal
* if this is your first time, run `npm install`
* this application relies upon two third party services, [IP Stack](https://ipstack.com) and [IP2Location](https://ip2location.io)
    * both sites have a limited number of requests available on the free tier, so please be judicious in use of this app
* run `node serve/server.js`
    * to prevent exceeding rate limits at the services, the default number of attempts at each provider is 5. 
    * if you would like more or fewer queries, you can include that as an argument, i.e. `node server.js 6`
* visit `http://localhost:1234/getCountry?ip=${IP_ADDRESS}` to see the name of the country associated with a given IP address 
* to run the unit tests with Jest, run `npm run test`