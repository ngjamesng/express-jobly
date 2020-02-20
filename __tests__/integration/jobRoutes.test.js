const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
process.env.NODE_ENV === "test";


/** CREATE Routes */
describe("Should be able to CREATE a job", async function(){
  
})



/**GET routes, for get all companies, get by id */
describe("should successfully get All jobs by empty string search term", async function(){

})

describe("should successfully get jobs by search term", async function(){

})

describe("should sucessfully get jobs by search term, providing min_salary and min_equity", async function(){

})

/**UPDATE routes */
describe("should successfully update an existing job", async function(){})

describe("should throw an error if updating a non-existent job", async function(){})


/** DELETE routes  */
describe("should successfully delete an existing job", async function(){})

describe("should throw an error if deleting a non-existing job", async function(){})
