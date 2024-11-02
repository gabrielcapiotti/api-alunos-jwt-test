import request from "supertest";
import app from "../../src";
import prismaConnection from "../../src/database/prisma.connection";

describe("Testes do student controller", () => {
  const dataStudent = {
    name: "Testes",
    email: "teste-user@teste.com",
    type: "M",
  };

  beforeAll(async () => {
    const student = await request(app)
      .post("/students")
      .send(dataStudent)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Authorization", "bearer ");
  });

  afterAll(async () => {
    const deleteStudent = await prismaConnection.students.delete({
      where: {email: dataStudent.email},
    });
  });

  test("Deveria buscar todos os estudantes pelo metodo get na rota /students", async () => {
    const response = await request(app).get("/students").set("Accept", "application/json");

    expect(response.body).toHaveProperty("data");
  });

  test("deveria retornar 500 ao não conseguir criar um estudante", async () => {
    const response = await request(app)
      .post("/students")
      .send({name: dataStudent.name, type: dataStudent.type})
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
  });

  test("Deveria buscar o estudante pelo id", async () => {
    const response = await request(app)
      .get("/students/e204505f-e9a6-4a74-91dc-36f7c3576049")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.body).toHaveProperty("data");
  });
});
