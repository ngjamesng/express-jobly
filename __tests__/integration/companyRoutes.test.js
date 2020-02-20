const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
process.env.NODE_ENV === "test";

describe("test GET multiple company routes", async function () {

	//POST REQ? 
	beforeEach(async function () {
		await db.query("DELETE FROM companies");

		let result = await db.query(
			`INSERT INTO companies 
        (handle, name, num_employees, description, logo_url)
        VALUES ('testHandle1', 'testName1', 1000, 'testdescription1', 'urlgoeshere')
        `
		);
	});

	test("can get all companies at GET companies/", async function () {
		const response = await request(app).get("/companies").send({ search: "" });
		expect(response.status).toEqual(200);
		expect(response.body.companies).toHaveLength(1);
		// expect(response.body).toEqual({
		// 	companies: [
		// 		{
		// 			handle: "testHandle1",
		// 			name: "testName1"
		// 		}
		// 	]
		// });
	});

	test("returns {companies:[]} if no search term match at GET companies/", async function () {
		const response = await request(app).get("/companies").send({ search: "zzzzzzzzzzz" });
		expect(response.status).toEqual(200);
		expect(response.body.companies).toHaveLength(0);
		// expect(response.body).toEqual({
		// 	companies: []
		// });
	});

	test("returns error if min_employees > max_employees", async function () {
		const response = await request(app).get("/companies").send({
			search: "",
			min_employees: 2,
			max_employees: 1
		});
		expect(response.status).toEqual(400);
		expect(response.body.message).toEqual("min_employees cannot be greater than max_employees");
	});
});

// maybe consolidate to 1 beforeEach to keep test logic consistent 
// maybe move to top to stay consistent with CRUD pattern !? 
describe("test successful POST to companies table", async function () {
	beforeEach(async function () {
		await db.query("DELETE FROM companies");
	});

	test("can get 1 company after posting success", async function () {
		const response = await request(app)
			.post("/companies")
			.send({
				"handle": "testHandle2",
				"name": "testName2",
				"num_employees": 2000,
				"description": "testDesc 2",
				"logo_url": "dummy url2"
			});

		expect(response.status).toEqual(201);
		// expect(response.body).toHaveLength(1);
		// console.log("TEST COMPANY POST RESPONSE.BODY......", response);
		expect(response.body).toEqual({
			company:
			{
				"handle": "testHandle2",
				"name": "testName2",
				"num_employees": 2000,
				"description": "testDesc 2",
				"logo_url": "dummy url2"
			}
		});
	});

	//maybe combine with GET describe block at top 
	describe("can get existing company by handle", async function () {
		let handle;

		beforeEach(async function () {
			await db.query("DELETE FROM companies");
			handle = "testHandle1";
			let result = await db.query(
				`INSERT INTO companies 
        (handle, name, num_employees, description, logo_url)
        VALUES ('${handle}', 'testName1', 1000, 'testdescription1', 'urlgoeshere')
        `
			);
		});

		test("can get specific company at GET companies/:handle", async function () {
			const response = await request(app).get(`/companies/${handle}`)
				.send({});

			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				company:
				{
					"handle": "testHandle1",
					"name": "testName1",
					"num_employees": 1000,
					"description": "testdescription1",
					"logo_url": "urlgoeshere"
				}
			});
		});
	});

	describe("can update existing company by handle", async function () {
		let handle;

		beforeEach(async function () {
			await db.query("DELETE FROM companies");
			handle = "testHandle1";
			let result = await db.query(
				`INSERT INTO companies 
        (handle, name, num_employees, description, logo_url)
        VALUES ('${handle}', 'testName1', 1000, 'testdescription1', 'urlgoeshere')
        `
			);
		});

		test("can update specific company at PATCH companies/:handle", async function () {

			let data = {
				"handle": "testHandle1",
				"name": "newName",
				"num_employees": 1000,
				"description": "new new new desc",
				"logo_url": "new url"
			};

			const response = await request(app).patch(`/companies/${handle}`)
				.send(data);

			expect(response.status).toEqual(200);
			expect(response.body).toEqual({ company: data });
		});
	});


}); // end main describe block

afterAll(async function () {
	await db.end();
});
