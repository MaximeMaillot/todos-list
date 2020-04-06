/* eslint-disable no-undef */
import request from "supertest";
import app from "../app.js";
import chai from "chai";
import * as dbQuery from "../db/dbQuery.js";

beforeEach(function () {
  dbQuery.clear();
});

describe("get /todos", () => {
  it("respond with a todo list", async () => {
    await Promise.all([
      dbQuery.insert("test1"),
      dbQuery.insert("test2"),
      dbQuery.insert("test3"),
    ])
      .then(async () => {
        let response = await request(app).get("/todos");
        chai.expect(response.status).is.equal(200);
        chai.expect(response.body.length).is.equal(3);
        chai.expect(response.body[0]).to.have.property("id");
        chai.expect(response.body[0]).to.have.property("name");
        chai.expect(response.body[0]).to.have.property("created_at");
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("get /todos with no todo in db", () => {
  it("respond with an error", async () => {
    let response = await request(app).get("/todos");
    chai.expect(response.status).is.equal(404);
    chai.expect(response.body).to.have.property("error");
  });
});

describe("get /todos/:id", () => {
  it("respond with the todo", async () => {
    await Promise.resolve(dbQuery.insert("test1"))
      .then(async (data) => {
        let response = await request(app).get("/todos/" + data[0].id);
        chai.expect(response.status).is.equal(200);
        chai.expect(response.body).to.have.property("id");
        chai.expect(response.body).to.have.property("name");
        chai.expect(response.body).to.have.property("created_at");
        chai.expect(response.body.name).is.equal("test1");
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("get /todos/:id with wrong id", () => {
  it("respond with an error", async () => {
    let response = await request(app).get("/todos/0");
    chai.expect(response.status).is.equal(404);
    chai.expect(response.body).to.have.property("error");
  });
});

describe("post /todos", () => {
  it("respond with the added todo", async () => {
    let response = await request(app).post("/todos").send({ name: "test" });
    chai.expect(response.status).is.equal(200);
    chai.expect(response.body).to.have.property("id");
    chai.expect(response.body).to.have.property("name");
    chai.expect(response.body).to.have.property("created_at");
    chai.expect(response.body.name).is.equal("test");
  });
});

describe("post /todos with an empty name", () => {
  it("respond with an error", async () => {
    let response = await request(app).post("/todos").send({ name: "" });
    chai.expect(response.status).is.equal(400);
    chai.expect(response.body).to.have.property("error");
  });
});

describe("put /todos/:id", () => {
  it("respond with the modified todo", async () => {
    await Promise.resolve(dbQuery.insert("test1"))
      .then(async (data) => {
        let response = await request(app)
          .put("/todos/" + data[0].id)
          .send({ name: "modified" });
        chai.expect(response.status).is.equal(200);
        chai.expect(response.body).to.have.property("id");
        chai.expect(response.body).to.have.property("name");
        chai.expect(response.body).to.have.property("created_at");
        chai.expect(response.body.name).is.equal("modified");
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("put /todos/:id with wrong id", () => {
  it("respond with an error", async () => {
    let response = await request(app).put("/todos/0");
    chai.expect(response.status).is.equal(400);
    chai.expect(response.body).to.have.property("error");
  });
});

describe("put /todos/:id with an empty name", () => {
  it("respond with the modified todo", async () => {
    await Promise.resolve(dbQuery.insert("test1"))
      .then(async (data) => {
        let response = await request(app)
          .put("/todos/" + data[0].id)
          .send({ name: "" });
        chai.expect(response.status).is.equal(400);
        chai.expect(response.body).to.have.property("error");
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("delete /todos/:id", () => {
  it("respond with a status code 204", async () => {
    await Promise.resolve(dbQuery.insert("test1"))
      .then(async (data) => {
        let response = await request(app).delete("/todos/" + data[0].id);
        chai.expect(response.status).is.equal(204);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("delete /todos/:id with a wrong id", () => {
  it("respond with an error", async () => {
    let response = await request(app).delete("/todos/0");
    chai.expect(response.status).is.equal(404);
    chai.expect(response.body).to.have.property("error");
  });
});
