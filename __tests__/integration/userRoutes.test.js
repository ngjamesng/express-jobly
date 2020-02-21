const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
process.env.NODE_ENV === "test";



beforeAll( async function(){
  await db.query("DELETE FROM users");

  await db.query(`
  INSERT INTO users
  (username, password, first_name, last_name, email, photo_url, is_admin)
  VALUES ( 'testusername', 'password', 'testfirstname', 'testlastname', 'testemail', 'testphotourl', false)
  `)
})



//CREATE A USER
/**create a user  */
describe("User create route", async function(){
  test("Can properly create a user with correct inputs", async function(){
    const response = await request(app)
      .post("/users")
      .send({
        "username": "testusername2",
        "password": "password",
        "first_name": "firstname",
        "last_name": "lastname",
        "email": "testemail2",
        "photo_url": "url"
      });
      expect(response.status).toEqual(201);
      expect(response.body.user.first_name).toEqual("firstname");
      // expect(response.body.job.company_handle).toEqual("testHandle1");
  });
});

//GET USERS

//GET A SINGLE USER

//UPDATE A USER

//DELETE A USER 

afterAll(async function () {
	await db.end();
});