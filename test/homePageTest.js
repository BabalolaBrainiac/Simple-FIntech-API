const request = require("supertest");
const app = require("../app");

describe("homepage", () => {
  it("Registers New User", (done) => {
    request(app)
      .post("/users/signup")
      .query({
            "username": "realtest",
            "password": "realtest",
            "name": "realtest",
            "email": "realtest@gmail.com"
      })
      .expect(200)
      .expect(/User saved successfully/, done);
  });
});
