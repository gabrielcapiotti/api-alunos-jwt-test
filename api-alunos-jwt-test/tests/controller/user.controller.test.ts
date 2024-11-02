import app from "../../src";
import request from "supertest";
import prismaConnection from "../../src/database/prisma.connection";

describe("Testes do user controller", () => {
  const dataUser = {
    email: "teste-user@teste.com",
    password: "123456",
  };

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
      .set("Accept", "application/json");
  });

  afterAll(async () => {
    const deleteStudent = await prismaConnection.students.findFirst({
      where: {email: dataStudent.email},
    });

    const deleteStudentUser = await prismaConnection.students.delete({
      where: {id: deleteStudent?.id},
    });
  });

  test("deveria retornar todos os users no metodo get da rota /users", async () => {
    const response = await request(app).get("/users").set("Accept", "application/json").set("Authorization", "bearer ");

    expect(response.body).toHaveProperty("data");
  });

  test("O usuário não digitou os campos obrigatórios", async () => {
    const response = await request(app)
      .post("/users")
      .send()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.body.success).toEqual(false);
  });

  test("Deveria retornar 400 ao tentar criar um usuário sem um estudante", async () => {
    const response = await request(app)
      .post("/users")
      .send({email: "test@test", password: dataUser.password})
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});
