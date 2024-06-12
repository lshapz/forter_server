import supertest from "supertest";
const app = require("../serve/app");
const request = supertest(app);

beforeAll(()=>{
    global.fetch = jest.fn(() =>{
        return Promise.resolve({
            json: () => Promise.resolve({ country_name: "South Korea" }),
        })
    });
});

afterAll(()=>{
    global.fetch.mockClear();
    delete global.fetch;
});

describe("tess of the API server", () => {

    test("respond to GET '/'", async () => {
        let response = await request.get("/") ;
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe("this page is not functional");
    });

    test("respond to GET '/getCountry' without query params", async () => {
        let response = await request.get("/getCountry");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe("Please provide an IP address!");        
    });

    test("respond to GET on '/testing'", async () => {
        let response = await request.get("/testing");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe("South Korea");
    });

// NOTE: superfetch was timing out on any and all iterations of giving the URL query params
// but here is a version of what a real test should look like
//   test("respond to GET with a given IP address", async () => {
//     let response = await request.get("/getCountry") 
// //          ("/getCountry?ip=123.45.6.78"); 
// //         .query(`ip=123.45.6.78`);  
// //         .query({ip: "123.45.6.78"});
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBe("South Korea")
//   });

});

