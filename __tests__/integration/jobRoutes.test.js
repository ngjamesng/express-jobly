const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
process.env.NODE_ENV === "test";


let handle;
beforeAll(async function(){

  //INSERT A DUMMY COMPANY
  await db.query("DELETE FROM companies");
  
  handle = "testHandle1";
  let result = await db.query(
    `INSERT INTO companies 
    (handle, name, num_employees, description, logo_url)
    VALUES ('${handle}', 'testName1', 1000, 'testdescription1', 'urlgoeshere')
    `
    );
    
    //INSERT A JOB
  await db.query("DELETE FROM jobs");
  await db.query("ALTER SEQUENCE jobs_id_seq RESTART WITH 1")
  const title = "testitle";
  const salary = 120000;
  const equity = 0.5;
  const company_handle = "testHandle1"
  // const [title, salary, equity, company_handle] = ["testTitle", 120000, 0.5, "testHandle"]
  await db.query(
    `INSERT INTO jobs 
  (title, salary, equity, company_handle)
  VALUES ('${title}', ${salary}, ${equity}, '${company_handle}')`)
})

/** CREATE Routes */
describe("Should be able to create a job, POST to /jobs", async function(){
  test("Can properly POST to job table with correct inputs", async function(){
    const response = await request(app)
      .post("/jobs")
      .send({
        "title": "testTitle2",
        "salary": 130000,
        "equity": 0.5,
        "company_handle": handle
      })
      expect(response.status).toEqual(201);
      expect(!!response.body.job).toEqual(true);
      expect(response.body.job.company_handle).toEqual(handle);
  })

//incorrect outputs
  test("does not post if nonexistent company handle is supplied", async function(){
    const response = await request(app)
      .post("/jobs")
      .send({
        "title": "testTitle2",
        "salary": 130000,
        "equity": 0.5,
        "company_handle": "nonexistent"
      })
      expect(response.status).toEqual(500);
      expect(!!response.body.job).toEqual(false);
  })
})



/**GET routes, for get all companies, get by id */
describe("get routes for all jobs", async function(){

  test("should be able to get all jobs at GET /jobs", async function(){
    const response = await request(app)
      .get("/jobs")
    expect(response.status).toEqual(200);
    expect(response.body.jobs).toHaveLength(2);
  })

  test("should successfully get a job by id at GET /jobs/:id", async function(){
    const response = await request(app)
      .get(`/jobs/1`)
    expect(response.status).toEqual(200);
    expect(response.body.job.company_handle).toEqual(handle);
  })

  test("should return an error if a nonexistent job ID does not exist at GET /jobs/:id", async function(){
    const response = await request(app)
      .get(`/jobs/0`)
    expect(response.status).toEqual(404);
    expect(response.body.status).toEqual(404);
    expect(!response.body.message).toEqual(false);
  })

  test("should return an array of companies if a search term matches at GET /jobs/", async function(){
    const response = await request(app)
      .get("/jobs")
      .send({
        search: "t",
        min_salary: 100,
        min_equity: 0.1
      })
    expect(response.status).toEqual(200);
    expect(response.body.jobs.length).toEqual(2);
    expect(response.body.jobs[0].company_handle).toEqual(handle);
  })

})



// /**UPDATE routes */
describe("update an existing job at PATCH /jobs/:id", async function(){
  test("should be able to update an existing job", async function(){
    const response = await request(app)
    .patch("/jobs/1")
    .send({
        title: "newTitle",
        salary: 1000000,
        equity: 1.0
    });
    expect(response.status).toEqual(200);
    expect(response.body.job.title).toEqual("newTitle");
  })
  test("should throw an error if attempting to update a non-existent job id", async function(){
    const response = await request(app)
    .patch("/jobs/0")
    .send({
      title: "newTitle",
      salary: 1000000,
      equity: 1.0
    })
  expect(response.status).toEqual(404);
  expect(response.body.status).toEqual(404);
  expect(!!response.body.message).toEqual(true);
  })
})


// /** DELETE routes  */


describe("delete routes testing", async function(){
  test("should be able to delete an existing job by id", async function(){
    const response = await request(app)
      .delete("/jobs/2")
      .send({})
      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual("Job deleted");
    })
  test("should return failed response, with status 404 if deleting a non-existent job", async function(){
    const response = await request(app)
      .delete("/jobs/0")

    expect(response.status).toEqual(404);
    expect(response.body.status).toEqual(404);
    expect(!!response.body.message).toEqual(true);

  })
})

afterAll(async function () {
	await db.end();
});