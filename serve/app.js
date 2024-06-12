var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors())

let tempCache = {};
let stackLimits = process.argv[2] || 5;

const IPStackApiKey = "397f0c8e1460b4bb8eae3f9bc485a4e1";
let IPStackFetchCount = 0;
// const IP2LocationApiKey = "28D24B592E41A255D2965D3FA3D2D7C2"
// NOTE: API key for this site was only working intermittently, but you get 500 free / day without registration
let IP2LocationFetchCount = 0;

app.get("/", async (_req, res, _next) => {
   return sendResponse(res, "this page is not functional")
})

app.get("/testing", async (_req, res, _next) => {
    let body = await fetch(`http://api.ipstack.com/123.45.6.78?access_key=${IPStackApiKey}`)
    let answer = await parseBody(body, "123.45.6.78", "stack");
    return sendResponse(res, answer);
}) 

app.get("/getCountry", async (req, res, next) => {
    let {ip} = req.query;

    let answer, body;

    if (!ip) {
        return res.status(200).json("Please provide an IP address!");
    } else if (Object.keys(tempCache).includes(ip)) {
        answer = tempCache[ip];
        return sendResponse(res, `you looked this up already! the answer was ${answer}`);
    } else if (IPStackFetchCount < stackLimits) {
        try {
            body = await fetch(`http://api.ipstack.com/${ip}?access_key=${IPStackApiKey}`);
        } catch (error) {
            return sendResponse(res, `Error: ${error}`);
        };
        let answer = await parseBody(body, ip, "stack");
        return sendResponse(res, answer);
    } else if ((IPStackFetchCount >= stackLimits) && (IP2LocationFetchCount < stackLimits)) {
        try {
            body = await fetch(`https://api.ip2location.io/?ip=${ip}`);
         // body = await fetch(`https://api.ip2location.io/?key=${IP2LocationApiKey}?ip=${ip}`)
        } catch (error) {
            return sendResponse(res, `Error: ${error}`);
        };
        let answer = await parseBody(body, ip, "locat");
        return sendResponse(res, answer);
    } else if (IP2LocationFetchCount >= stackLimits) {
        return sendResponse(res, "You have reached the rate limit for our IP location servers! Please try again tomorrow.");
    };
});
   

const parseBody = async (body, ip, site) => {
    let json = await body.json();
    let answer;
    if (json.country_name) {
        answer = json.country_name;
        tempCache[ip] = answer;
        if (site == "stack") {
            IPStackFetchCount += 1;
        } else if (site == "locat") {
            IP2LocationFetchCount += 1;
        }
    } else if (json.error) {
        answer = json.error.error_message || json.error.info;
        if (answer.includes("monthly usage limit")) {
            if (site == "stack") {
                IPStackFetchCount = stackLimits + 1;
            } else {
                IP2LocationFetchCount = stackLimits + 1;
            }
        }
    }
    return answer;
};

const sendResponse = (res, answer) => {
    res.status(200).json(answer);
};

module.exports = app;
