/* eslint-disable no-undef */
import request from "supertest";
import app from "../app.js";
import chai from "chai";
import * as dbQuery from "../db/dbQuery.js";

beforeEach(() => {
  dbQuery.clear();
});

describe("Route GET /todos", () => {
  describe("with todos in the database", () => {
    it("should respond with a todo list", async () => {
      const expectedTodos = await Promise.all([
        dbQuery.insert("test1"),
        dbQuery.insert("test2"),
        dbQuery.insert("test3"),
      ]);

      let response = await request(app).get("/todos");

      chai.expect(response.status).is.equal(200);
      chai.expect(response.body).to.have.lengthOf(3);
      response.body.forEach((todo) => {
        const expectedTodo = expectedTodos.find((element) => {
          return element.id === todo.id;
        });
        // Need to transform to json then back to object to format the date.
        chai.expect(todo).to.include(JSON.parse(JSON.stringify(expectedTodo)));
      });
    });
  });

  describe("without todos in the database", () => {
    it("should respond with an empty todo list", async () => {
      let response = await request(app).get("/todos");
      chai.expect(response.status).is.equal(200);
      chai.expect(response.body).to.have.lengthOf(0);
    });
  });
});

describe("Route GET /todos/:id", () => {
  describe("with a correct id", () => {
    it("should respond with a todo with the right id", async () => {
      const expectedTodo = await Promise.resolve(dbQuery.insert("test"));

      let response = await request(app).get("/todos/" + expectedTodo.id);
      chai.expect(response.status).is.equal(200);
      chai
        .expect(response.body)
        .to.include(JSON.parse(JSON.stringify(expectedTodo)));
      chai.expect(response.body.name).is.equal("test");
    });
  });

  describe("with a wrong todo id", () => {
    it("should respond with an error", async () => {
      let response = await request(app).get("/todos/0");
      chai.expect(response.status).is.equal(404);
      chai.expect(response.body).to.have.property("error");
      chai
        .expect(response.body.error)
        .is.equal("the todo with the id: 0 doesn't exist in the database");
    });
  });
});

describe("route POST /todos", () => {
  describe("with correct data", () => {
    it("should respond with the added todo", async () => {
      let response = await request(app).post("/todos").send({ name: "test" });
      chai.expect(response.status).is.equal(200);
      chai.expect(response.body.name).is.equal("test");

      chai.expect(response.body).to.have.property("id").that.is.a("number");

      const expectedTodo = await Promise.resolve(
        dbQuery.getById(response.body.id)
      );
      chai
        .expect(response.body)
        .to.include(JSON.parse(JSON.stringify(expectedTodo[0])));
    });
  });

  describe("with an empty name", () => {
    it("should respond with an error", async () => {
      let response = await request(app).post("/todos").send({ name: "" });
      chai.expect(response.status).is.equal(400);
      chai.expect(response.body).to.have.property("error");
      chai.expect(response.body.error).is.equal("Name can't be null");

      const expectNoTodo = await Promise.resolve(dbQuery.getAll());
      chai.expect(expectNoTodo).to.have.lengthOf(0);
    });
  });
});

describe("route PUT /todos/:id", () => {
  describe("with the correct id and data", () => {
    it("should respond with the modified todo", async () => {
      const expectedTodo = await Promise.resolve(dbQuery.insert("test"));

      let response = await request(app)
        .put("/todos/" + expectedTodo.id)
        .send({ name: "modified" });
      chai.expect(response.status).is.equal(200);
      chai.expect(response.body.name).is.equal("modified");
      chai.expect(response.body.date).is.equal(expectedTodo.date);
      chai.expect(response.body.id).is.equal(expectedTodo.id);

      const modifiedTodo = await Promise.resolve(
        dbQuery.getById(expectedTodo.id)
      );
      chai
        .expect(response.body)
        .to.include(JSON.parse(JSON.stringify(modifiedTodo[0])));
      chai.expect(expectedTodo.date).is.equal(modifiedTodo[0].date);
      chai.expect(expectedTodo.id).is.equal(modifiedTodo[0].id);
    });
  });

  describe("with a wrong todo id", () => {
    it("should respond with an error", async () => {
      let response = await request(app)
        .put("/todos/0")
        .send({ name: "modified" });
      chai.expect(response.status).is.equal(404);
      chai.expect(response.body).to.have.property("error");
      chai
        .expect(response.body.error)
        .is.equal("the todo with the id: 0 doesn't exist in the database");
    });
  });

  describe("with an empty name", () => {
    it("should respond with an error", async () => {
      const expectedTodo = await Promise.resolve(dbQuery.insert("test"));

      let response = await request(app)
        .put("/todos/" + expectedTodo.id)
        .send({ name: "" });
      chai.expect(response.status).is.equal(400);
      chai.expect(response.body).to.have.property("error");
      chai.expect(response.body.error).is.equal("Name can't be null");

      const notModifiedTodo = await Promise.resolve(
        dbQuery.getById(expectedTodo.id)
      );
      chai.expect(notModifiedTodo[0].name).is.equal("test");
    });
  });
});

describe("route DELETE /todos/:id", () => {
  describe("with a correct id", () => {
    it("should respond with a status code 204", async () => {
      const expectedTodo = await Promise.resolve(dbQuery.insert("test"));
      let response = await request(app).delete("/todos/" + expectedTodo.id);
      chai.expect(response.status).is.equal(204);

      const expectNoTodo = await Promise.resolve(dbQuery.getAll());
      chai.expect(expectNoTodo).to.have.lengthOf(0);
    });
  });

  describe("with a wrong todo id", () => {
    it("should respond with an error", async () => {
      let response = await request(app).delete("/todos/0");
      chai.expect(response.status).is.equal(404);
      chai.expect(response.body).to.have.property("error");
      chai
        .expect(response.body.error)
        .is.equal("the todo with the id: 0 doesn't exist in the database");
    });
  });
});
